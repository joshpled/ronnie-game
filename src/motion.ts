// World units are pixels in the 390 × 450 room, independent of screen resolution.
export interface Point {
  x: number;
  y: number;
}
export interface TravelState extends Point {
  vx: number;
  vy: number;
}
export const PACES = { wander: 48, walk: 60, chase: 84 } as const;
export type Pace = keyof typeof PACES;
export const BOUNDS = { left: 73, right: 306, top: 296, bottom: 398 };
export const ACCELERATION = 135;
export const BRAKING = 185;

export function roomPoint(point: Point): Point {
  return {
    x: Math.max(BOUNDS.left, Math.min(BOUNDS.right, point.x)),
    y: Math.max(BOUNDS.top, Math.min(BOUNDS.bottom, point.y)),
  };
}

export function stoppingPoint(state: TravelState): Point {
  const speed = Math.hypot(state.vx, state.vy);
  // Distance required to lose the current speed, preserving her direction of travel.
  return roomPoint({
    x: state.x + (state.vx * speed) / (2 * BRAKING),
    y: state.y + (state.vy * speed) / (2 * BRAKING),
  });
}

export function stepTravel(
  initial: TravelState,
  destination: Point,
  seconds: number,
  pace: Pace = "walk",
) {
  const state = { ...initial };
  const target = roomPoint(destination);
  let remaining = Math.max(0, Math.min(0.1, seconds));
  let travelled = 0;
  let arrived = false;
  // Small integration steps keep braking consistent on 30, 60 and 120 Hz displays.
  while (remaining > 0) {
    const dt = Math.min(1 / 120, remaining);
    remaining -= dt;
    const dx = target.x - state.x,
      dy = target.y - state.y;
    const distance = Math.hypot(dx, dy);
    const speed = Math.hypot(state.vx, state.vy);
    if (distance <= 0.65 && speed < 10) {
      travelled += distance;
      Object.assign(state, target, { vx: 0, vy: 0 });
      arrived = true;
      break;
    }
    const desiredSpeed = Math.min(
      PACES[pace],
      Math.sqrt(2 * BRAKING * distance),
    );
    const desiredX = distance > 0 ? (dx / distance) * desiredSpeed : 0;
    const desiredY = distance > 0 ? (dy / distance) * desiredSpeed : 0;
    const changeX = desiredX - state.vx,
      changeY = desiredY - state.vy;
    const change = Math.hypot(changeX, changeY);
    const braking =
      desiredSpeed < speed || desiredX * state.vx + desiredY * state.vy < 0;
    const fraction =
      change === 0
        ? 0
        : Math.min(1, ((braking ? BRAKING : ACCELERATION) * dt) / change);
    const vx = state.vx + changeX * fraction,
      vy = state.vy + changeY * fraction;
    const next = roomPoint({
      x: state.x + (state.vx + vx) * 0.5 * dt,
      y: state.y + (state.vy + vy) * 0.5 * dt,
    });
    travelled += Math.hypot(next.x - state.x, next.y - state.y);
    state.vx =
      (next.x === BOUNDS.left && vx < 0) || (next.x === BOUNDS.right && vx > 0)
        ? 0
        : vx;
    state.vy =
      (next.y === BOUNDS.top && vy < 0) || (next.y === BOUNDS.bottom && vy > 0)
        ? 0
        : vy;
    state.x = next.x;
    state.y = next.y;
  }
  return { state, travelled, arrived };
}
