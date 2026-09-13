import { CLIPS, GAITS, ClipPlayer, type ClipName } from "./clips.js";
import {
  roomPoint,
  stepTravel,
  stoppingPoint,
  type Pace,
  type Point,
  type TravelState,
} from "./motion.js";

interface MotionSprite {
  x: number;
  y: number;
  setPosition(x: number, y: number): unknown;
  setFrame(frame: number): unknown;
}

interface Destination extends Point {
  pace: Pace;
  after?: () => void;
}

/** Owns one motion/pose at a time. Room sequences care; this class performs it. */
export class RonnieMotion {
  private state: TravelState;
  private destination?: Destination;
  private anticipation = 0;
  private facing: "left" | "right" = "right";
  private stridePhase = 0;
  private clipName: ClipName = "idle";
  private player = new ClipPlayer(CLIPS.idle);
  private afterClip?: () => void;

  constructor(
    private readonly sprite: MotionSprite,
    readonly reduced: boolean,
  ) {
    this.state = { x: sprite.x, y: sprite.y, vx: 0, vy: 0 };
  }
  get moving() {
    return this.destination !== undefined;
  }
  get calm() {
    return (
      !this.moving && (this.clipName === "idle" || this.clipName === "rest")
    );
  }
  get airborne() {
    return this.moving || this.reduced ? 0 : this.player.lift;
  }
  place(point: Point) {
    this.destination = undefined;
    this.state = { ...roomPoint(point), vx: 0, vy: 0 };
    this.sprite.setPosition(this.state.x, this.state.y);
  }
  moveTo(point: Point, pace: Pace = "walk", after?: () => void) {
    const target = roomPoint(point);
    const wasMoving = this.moving;
    this.afterClip = undefined;
    if (
      this.reduced ||
      (Math.hypot(target.x - this.state.x, target.y - this.state.y) < 1 &&
        Math.hypot(this.state.vx, this.state.vy) < 1)
    ) {
      this.place(target);
      this.play("idle");
      after?.();
      return;
    }
    this.destination = { ...target, pace, after };
    if (!wasMoving) {
      this.anticipation = 170;
      this.stridePhase = 0;
      this.facing = target.x < this.state.x ? "left" : "right";
      this.sprite.setFrame(GAITS[this.facing].look);
    }
    // Retargeting preserves velocity and stride phase. She brakes before reversing.
  }
  stopThen(after: () => void) {
    if (!this.moving || Math.hypot(this.state.vx, this.state.vy) < 1) {
      this.destination = undefined;
      after();
    } else {
      this.destination = { ...stoppingPoint(this.state), pace: "walk", after };
      this.anticipation = 0;
    }
  }
  play(name: ClipName, after?: () => void) {
    this.destination = undefined;
    this.state.vx = this.state.vy = 0;
    this.clipName = name;
    this.player = new ClipPlayer(CLIPS[name]);
    this.afterClip = after;
    this.sprite.setFrame(this.reduced ? CLIPS[name].still : this.player.frame);
  }
  update(delta: number) {
    const ms = Math.max(0, Math.min(100, delta));
    if (this.destination) {
      if (this.anticipation > 0) {
        this.anticipation -= ms;
        return;
      }
      const target = this.destination;
      const result = stepTravel(this.state, target, ms / 1000, target.pace);
      this.state = result.state;
      this.sprite.setPosition(this.state.x, this.state.y);
      // An eight-frame gait covers about 64 sprite pixels. Advancing by distance
      // makes steps slow down with her body, and prevents feet cycling in place.
      const depthScale = 0.78 + ((this.state.y - 280) / 140) * 0.12;
      if (this.state.vx > 5) this.facing = "right";
      else if (this.state.vx < -5) this.facing = "left";
      const gait = GAITS[this.facing];
      this.stridePhase =
        (this.stridePhase + result.travelled / (gait.stride * depthScale)) % 1;
      this.sprite.setFrame(
        gait.frames[Math.floor(this.stridePhase * gait.frames.length)],
      );
      if (result.arrived) {
        this.destination = undefined;
        if (target.after) target.after();
        else
          this.play(
            this.facing === "right" ? "settleRight" : "settleLeft",
            () => this.play("idle"),
          );
      }
      return;
    }
    const result = this.player.advance(ms);
    this.sprite.setFrame(
      this.reduced ? CLIPS[this.clipName].still : result.frame,
    );
    if (result.completed) {
      const after = this.afterClip;
      this.afterClip = undefined;
      after?.();
    }
  }
}
