import test from "node:test";
import assert from "node:assert/strict";
import {
  advanceCare,
  applyAction,
  decodeCare,
  freshCare,
  setResting,
} from "../src/care.js";
const NOW = 1_000_000_000;
test("feeding, affection and play affect their intended needs", () => {
  const initial = freshCare(NOW);
  assert.equal(applyAction(initial, "feed", NOW).fullness, 93);
  assert.equal(applyAction(initial, "pet", NOW).happiness, 84);
  const played = applyAction(initial, "play", NOW);
  assert.equal(played.energy, 74);
  assert.equal(played.happiness, 92);
  assert.equal(initial.bond, 0);
  assert.equal(played.bond, 1);
});
test("absence is capped, needs never become negative, repeated resume does not double-charge", () => {
  const later = NOW + 72 * 3_600_000;
  const next = advanceCare(freshCare(NOW), later);
  assert.equal(next.fullness, 28);
  assert.deepEqual(advanceCare(next, later), next);
  assert.equal(
    advanceCare({ ...next, fullness: 2 }, later + 3_600_000).fullness,
    0,
  );
});
test("rest restores energy across closing and reopening", () => {
  const sleeping = setResting({ ...freshCare(NOW), energy: 20 }, true, NOW);
  const restored = decodeCare(JSON.stringify(sleeping), NOW + 2 * 3_600_000);
  assert.equal(restored.energy, 68);
  assert.equal(restored.resting, true);
  assert.equal(
    setResting(restored, false, restored.lastUpdated).resting,
    false,
  );
});
test("malformed, unsupported and incomplete saves recover without crashing", () => {
  for (const raw of [
    "oops",
    "null",
    "[]",
    "{}",
    '{"version":2}',
    JSON.stringify({ ...freshCare(NOW), energy: "bad" }),
  ]) {
    assert.deepEqual(decodeCare(raw, NOW), freshCare(NOW));
  }
});
test("stored values are bounded and a future clock does not lock progression", () => {
  const decoded = decodeCare(
    JSON.stringify({
      ...freshCare(NOW),
      fullness: 300,
      happiness: -5,
      lastUpdated: NOW + 99_999,
    }),
    NOW,
  );
  assert.equal(decoded.fullness, 100);
  assert.equal(decoded.happiness, 0);
  assert.equal(advanceCare(decoded, NOW + 3_600_000).fullness, 95);
  assert.equal(
    applyAction({ ...decoded, happiness: 99 }, "pet", NOW).happiness,
    100,
  );
});
