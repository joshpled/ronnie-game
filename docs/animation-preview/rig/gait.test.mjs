import test from "node:test";
import assert from "node:assert/strict";
import { WALK, LEGS, footAt, poseAt, wrap } from "./gait.mjs";
const near = (a, b, tol = 1e-6) =>
  assert.ok(Math.abs(a - b) < tol, `${a} differs from ${b}`);
test("every stance paw stays on one world-space point as Ronnie travels", () => {
  for (const leg of LEGS)
    for (let i = 0; i < 1000; i++) {
      const t = (i * WALK.duration) / 1000,
        dt = 1e-5,
        a = footAt(t, leg),
        b = footAt(t + dt, leg);
      if (a.planted && b.planted && b.phase > a.phase) {
        near(a.x + t * WALK.speed, b.x + (t + dt) * WALK.speed);
        near(a.y, leg.ground);
      }
    }
});
test("four separate footfalls, at least two supports, and no underground paws", () => {
  assert.deepEqual(
    [...LEGS]
      .sort((a, b) => wrap(-a.offset) - wrap(-b.offset))
      .map((l) => l.id),
    ["near-hind", "near-front", "far-hind", "far-front"],
  );
  for (let i = 0; i < 1000; i++) {
    const feet = LEGS.map((l) => ({
      ...footAt((i * WALK.duration) / 1000, l),
      ground: l.ground,
    }));
    assert.ok(feet.filter((f) => f.planted).length >= 2);
    for (const f of feet) assert.ok(f.y <= f.ground);
  }
});
test("position and velocity remain continuous at lift, landing and loop", () => {
  const dt = 1e-6;
  for (const leg of LEGS)
    for (const phase of [0, WALK.duty, 1]) {
      const t = (phase - leg.offset) * WALK.duration,
        a = footAt(t - dt, leg),
        b = footAt(t, leg),
        c = footAt(t + dt, leg);
      for (const key of ["x", "y"]) {
        near(a[key], c[key], 0.001);
        near((b[key] - a[key]) / dt, (c[key] - b[key]) / dt, 0.01);
      }
    }
});
test("joint positions are finite, preserve bone lengths and repeat exactly", () => {
  for (let i = 0; i < 1000; i++) {
    const t = (i * WALK.duration) / 1000,
      pose = poseAt(t),
      repeat = poseAt(t + WALK.duration);
    for (let l = 0; l < 4; l++) {
      const points = pose.legs[l].points,
        lengths =
          pose.legs[l].kind === "front"
            ? [32, 32]
            : [32, 32, Math.hypot(8, 14)];
      points.forEach((p, j) => {
        assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
        near(p.x, repeat.legs[l].points[j].x);
        near(p.y, repeat.legs[l].points[j].y);
        if (j)
          near(
            Math.hypot(p.x - points[j - 1].x, p.y - points[j - 1].y),
            lengths[j - 1],
          );
      });
    }
  }
});
