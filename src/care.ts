export const SAVE_KEY = "ronnie-care-v1";
export type Action = "feed" | "pet" | "play";
export interface Care {
  version: 1;
  fullness: number;
  happiness: number;
  energy: number;
  bond: number;
  resting: boolean;
  lastUpdated: number;
}
const clamp = (value: number) => Math.max(0, Math.min(100, value));
export function freshCare(now = Date.now()): Care {
  return {
    version: 1,
    fullness: 68,
    happiness: 76,
    energy: 82,
    bond: 0,
    resting: false,
    lastUpdated: now,
  };
}
export function advanceCare(state: Care, now: number): Care {
  // Limit time away to eight hours: returning should feel welcoming, not punishing.
  const hours = Math.min(8, Math.max(0, now - state.lastUpdated) / 3_600_000);
  return {
    ...state,
    fullness: clamp(state.fullness - hours * 5),
    happiness: clamp(state.happiness - hours * 3),
    energy: clamp(state.energy + hours * (state.resting ? 24 : -3)),
    lastUpdated: Math.max(now, state.lastUpdated),
  };
}
export function applyAction(
  state: Care,
  action: Action,
  now = Date.now(),
): Care {
  const next = advanceCare(state, now);
  if (action === "feed") next.fullness = clamp(next.fullness + 25);
  if (action === "pet") next.happiness = clamp(next.happiness + 8);
  if (action === "play") {
    next.happiness = clamp(next.happiness + 16);
    next.energy = clamp(next.energy - 8);
    next.fullness = clamp(next.fullness - 3);
  }
  next.bond = Math.min(Number.MAX_SAFE_INTEGER, next.bond + 1);
  return next;
}
export function setResting(
  state: Care,
  resting: boolean,
  now = Date.now(),
): Care {
  return { ...advanceCare(state, now), resting };
}
export function decodeCare(raw: string | null, now = Date.now()): Care {
  if (!raw) return freshCare(now);
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return freshCare(now);
    const s = value as Record<string, unknown>;
    const numbers = ["fullness", "happiness", "energy", "bond", "lastUpdated"];
    if (
      s.version !== 1 ||
      typeof s.resting !== "boolean" ||
      numbers.some(
        (key) => typeof s[key] !== "number" || !Number.isFinite(s[key]),
      )
    )
      return freshCare(now);
    const state = s as unknown as Care;
    return advanceCare(
      {
        ...state,
        fullness: clamp(state.fullness),
        happiness: clamp(state.happiness),
        energy: clamp(state.energy),
        bond: Math.min(
          Number.MAX_SAFE_INTEGER,
          Math.max(0, Math.floor(state.bond)),
        ),
        // A saved future clock must not freeze progression until that date arrives.
        lastUpdated: Math.max(0, Math.min(now, state.lastUpdated)),
      },
      now,
    );
  } catch {
    return freshCare(now);
  }
}
