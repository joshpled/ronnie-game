export interface ClipFrame {
  frame: number;
  ms: number;
  lift: number;
}
export interface Clip {
  frames: readonly ClipFrame[];
  loop: boolean;
  still: number;
}
const frames = (
  values: readonly (readonly [number, number, number?])[],
): ClipFrame[] => values.map(([frame, ms, lift = 0]) => ({ frame, ms, lift }));

export const GAITS = {
  right: { frames: [8, 9, 10, 11, 12, 13, 14, 15], stride: 64, look: 76 },
  left: { frames: [16, 17, 18, 19, 20, 21, 22, 23], stride: 64, look: 84 },
} as const;

// Explicit frame timings: long relaxed holds, brief blinks, and complete gestures.
// Add new frame sequences here; care rewards stay in care.ts.
export const CLIPS = {
  idle: {
    frames: frames([
      [0, 1300],
      [3, 550],
      [5, 1500],
      [3, 550],
      [0, 800],
      [2, 110],
      [0, 250],
    ]),
    loop: true,
    still: 0,
  },
  rest: {
    frames: frames([
      [64, 1900],
      [65, 150],
      [66, 110],
      [65, 180],
      [64, 1500],
      [69, 1600],
    ]),
    loop: true,
    still: 64,
  },
  affection: {
    frames: frames([
      [24, 300],
      [25, 240],
      [26, 420],
      [25, 280],
      [24, 550],
    ]),
    loop: false,
    still: 24,
  },
  jump: {
    frames: frames([
      [32, 250],
      [33, 140, 0.5],
      [34, 180, 1],
      [35, 150, 0.5],
      [36, 450],
    ]),
    loop: false,
    still: 36,
  },
  // Lower and raise her head through the existing directional poses. These are
  // temporary snack motions until approved eating artwork is integrated.
  snack: {
    frames: frames([
      [76, 180],
      [77, 150],
      [78, 160],
      [79, 180],
      [80, 650],
      [79, 150],
      [80, 500],
      [81, 150],
      [80, 600],
      [79, 180],
      [78, 180],
      [77, 160],
      [76, 180],
      [6, 420],
    ]),
    loop: false,
    still: 80,
  },
  sitDown: {
    frames: frames([
      [6, 150],
      [36, 220],
      [64, 450],
    ]),
    loop: false,
    still: 64,
  },
  standUp: {
    frames: frames([
      [64, 200],
      [36, 220],
      [6, 300],
    ]),
    loop: false,
    still: 6,
  },
  settleRight: {
    frames: frames([
      [76, 180],
      [6, 300],
    ]),
    loop: false,
    still: 6,
  },
  settleLeft: {
    frames: frames([
      [84, 180],
      [6, 300],
    ]),
    loop: false,
    still: 6,
  },
} satisfies Record<string, Clip>;
export type ClipName = keyof typeof CLIPS;

/** A renderer-independent playhead. A completion edge is emitted exactly once. */
export class ClipPlayer {
  private index = 0;
  private elapsed = 0;
  private finished = false;
  constructor(readonly clip: Clip) {}
  get frame() {
    return this.clip.frames[this.index].frame;
  }
  get lift() {
    return this.clip.frames[this.index].lift;
  }
  advance(ms: number) {
    if (this.finished) return { frame: this.frame, completed: false };
    this.elapsed += Math.max(0, ms);
    while (this.elapsed >= this.clip.frames[this.index].ms) {
      this.elapsed -= this.clip.frames[this.index].ms;
      if (this.index === this.clip.frames.length - 1) {
        if (this.clip.loop) this.index = 0;
        else {
          this.finished = true;
          return { frame: this.frame, completed: true };
        }
      } else this.index++;
    }
    return { frame: this.frame, completed: false };
  }
}
