import test from "node:test";
import assert from "node:assert/strict";
import {
  stepTravel,
  PACES,
  stoppingPoint,
  type TravelState,
} from "../src/motion.js";
import { CLIPS, ClipPlayer } from "../src/clips.js";
import { RonnieMotion } from "../src/RonnieMotion.js";

class SpriteStandIn {
  x = 150;
  y = 340;
  frame = 0;
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  setFrame(frame: number) {
    this.frame = frame;
  }
}

test("walking starts gradually, stays below its speed limit and brakes before arrival", () => {
  let state: TravelState = { x: 90, y: 340, vx: 0, vy: 0 };
  const speeds: number[] = [];
  let arrived = false;
  let elapsed = 0;
  while (!arrived && elapsed < 10) {
    const result = stepTravel(state, { x: 290, y: 340 }, 1 / 60);
    state = result.state;
    arrived = result.arrived;
    elapsed += 1 / 60;
    speeds.push(Math.hypot(state.vx, state.vy));
    assert.ok(state.x <= 290.7);
  }
  assert.ok(arrived);
  assert.ok(speeds[0] < 3);
  assert.ok(Math.max(...speeds) <= PACES.walk + 0.001);
  assert.ok(speeds.at(-8)! < PACES.walk / 2);
  assert.ok(elapsed > 3.3 && elapsed < 5);
  assert.deepEqual(state, { x: 290, y: 340, vx: 0, vy: 0 });
});
test("retargeting preserves momentum and crosses zero before reversing", () => {
  const start = { x: 195, y: 340, vx: 60, vy: 0 };
  const next = stepTravel(start, { x: 80, y: 340 }, 1 / 60).state;
  assert.ok(next.vx > 55 && next.vx < 60);
  assert.ok(next.x > start.x);
  let state = next;
  for (let i = 0; i < 60; i++)
    state = stepTravel(state, { x: 80, y: 340 }, 1 / 60).state;
  assert.ok(state.vx < 0);
  assert.deepEqual(start, { x: 195, y: 340, vx: 60, vy: 0 });
});
test("motion is consistent across frame rates and handles short moves and room edges", () => {
  const sample = (fps: number) => {
    let state = { x: 90, y: 320, vx: 0, vy: 0 };
    for (let i = 0; i < fps * 2; i++)
      state = stepTravel(state, { x: 290, y: 380 }, 1 / fps).state;
    return state;
  };
  const low = sample(30),
    high = sample(120);
  assert.ok(Math.hypot(low.x - high.x, low.y - high.y) < 0.1);
  let state = { x: 305, y: 340, vx: 30, vy: 0 };
  for (let i = 0; i < 300; i++)
    state = stepTravel(state, { x: 999, y: 340 }, 1 / 60).state;
  assert.equal(state.x, 306);
  assert.equal(state.vx, 0);
  assert.deepEqual(stoppingPoint({ x: 305, y: 340, vx: 60, vy: 0 }), {
    x: 306,
    y: 340,
  });
  const near = stepTravel(
    { x: 100, y: 340, vx: 0, vy: 0 },
    { x: 100.5, y: 340 },
    1 / 60,
  );
  assert.equal(near.arrived, true);
});
test("one-shot clips finish after the last pose hold, and report completion once", () => {
  for (const clip of Object.values(CLIPS).filter((clip) => !clip.loop)) {
    const player = new ClipPlayer(clip);
    const duration = clip.frames.reduce((total, frame) => total + frame.ms, 0);
    assert.equal(player.advance(duration - 1).completed, false);
    assert.equal(player.advance(1).completed, true);
    assert.equal(player.frame, clip.frames.at(-1)!.frame);
    assert.equal(player.advance(9999).completed, false);
  }
});
test("looping clips retain the blink and repeat without completing care", () => {
  const player = new ClipPlayer(CLIPS.idle);
  const duration = CLIPS.idle.frames.reduce(
    (total, frame) => total + frame.ms,
    0,
  );
  assert.equal(player.advance(duration * 2).completed, false);
  assert.equal(player.frame, CLIPS.idle.frames[0].frame);
  assert.ok(
    CLIPS.idle.frames.some((frame) => frame.frame === 2 && frame.ms <= 150),
  );
});

test("an interrupted route cannot fire a stale completion, and petting waits for braking", () => {
  const sprite = new SpriteStandIn(),
    motion = new RonnieMotion(sprite, false);
  let obsolete = 0,
    petRewards = 0;
  motion.moveTo({ x: 290, y: 340 }, "walk", () => obsolete++);
  for (let i = 0; i < 55; i++) motion.update(1000 / 60);
  motion.stopThen(() => motion.play("affection", () => petRewards++));
  const start = sprite.x;
  motion.update(1000 / 60);
  assert.ok(sprite.x > start, "the body should continue forward while braking");
  assert.equal(petRewards, 0);
  for (let i = 0; i < 300; i++) motion.update(1000 / 60);
  assert.equal(obsolete, 0);
  assert.equal(petRewards, 1);
  assert.equal(sprite.frame, CLIPS.affection.frames.at(-1)!.frame);
});

test("a new target at the current moving position does not snap her to a stop", () => {
  const sprite = new SpriteStandIn(),
    motion = new RonnieMotion(sprite, false);
  motion.moveTo({ x: 290, y: 340 });
  for (let i = 0; i < 60; i++) motion.update(1000 / 60);
  const x = sprite.x;
  motion.moveTo({ x, y: 340 });
  motion.update(1000 / 60);
  assert.ok(sprite.x > x);
  for (let i = 0; i < 300; i++) motion.update(1000 / 60);
  assert.ok(Math.abs(sprite.x - x) < 0.01);
});

test("reduced motion skips travel but still completes an action exactly once", () => {
  const sprite = new SpriteStandIn(),
    motion = new RonnieMotion(sprite, true);
  let completed = 0;
  motion.moveTo({ x: 280, y: 340 }, "walk", () =>
    motion.play("jump", () => completed++),
  );
  assert.equal(sprite.x, 280);
  for (let i = 0; i < 200; i++) {
    motion.update(1000 / 60);
    assert.equal(sprite.frame, CLIPS.jump.still);
  }
  assert.equal(completed, 1);
});
