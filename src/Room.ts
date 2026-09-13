import Phaser from "phaser";
import type { Action } from "./care";

export type RoomAction = Action | "rest" | "wake" | "call";
interface RoomEvents {
  ready: () => void;
  message: (message: string) => void;
  busy: (busy: boolean) => void;
  complete: (action: Action) => void;
  rest: (resting: boolean) => void;
  pet: () => void;
  error: () => void;
}
const ROWS: [string, number, number, number][] = [
  ["idle", 0, 6, 5],
  ["right", 1, 8, 9],
  ["left", 2, 8, 9],
  ["wave", 3, 4, 7],
  ["jump", 4, 5, 8],
  ["sit", 6, 6, 4],
];

export class Room extends Phaser.Scene {
  private dog!: Phaser.GameObjects.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private ball!: Phaser.GameObjects.Container;
  private food!: Phaser.GameObjects.Container;
  private restText!: Phaser.GameObjects.Text;
  private moveTween?: Phaser.Tweens.Tween;
  private locked = false;
  private resting = false;
  private nextWander = 0;
  private reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  private available = false;

  constructor(
    private readonly eventsOut: RoomEvents,
    private readonly initiallyResting: boolean,
  ) {
    super("room");
  }
  preload() {
    this.load.svg("room", `${import.meta.env.BASE_URL}assets/room.svg`, {
      width: 780,
      height: 900,
    });
    this.load.spritesheet(
      "ronnie",
      `${import.meta.env.BASE_URL}assets/ronnie.webp`,
      { frameWidth: 192, frameHeight: 208 },
    );
    this.load.on("loaderror", () => this.eventsOut.error());
  }
  create() {
    if (!this.textures.exists("ronnie") || !this.textures.exists("room"))
      return;
    this.add.image(195, 225, "room").setDisplaySize(390, 450);
    ROWS.forEach(([key, row, count, frameRate]) =>
      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers("ronnie", {
          start: row * 8,
          end: row * 8 + count - 1,
        }),
        frameRate,
        repeat: -1,
      }),
    );
    this.shadow = this.add.ellipse(197, 344, 69, 14, 0x6b6549, 0.14);
    this.dog = this.add
      .sprite(197, 348, "ronnie", 0)
      .setOrigin(0.5, 0.94)
      .setScale(0.85);
    // A tighter hit area prevents the transparent sprite margins swallowing floor taps.
    this.dog.setInteractive(
      new Phaser.Geom.Rectangle(40, 28, 112, 170),
      Phaser.Geom.Rectangle.Contains,
    );
    this.dog.on(
      "pointerdown",
      (
        _pointer: Phaser.Input.Pointer,
        _x: number,
        _y: number,
        event: Phaser.Types.Input.EventData,
      ) => {
        event.stopPropagation();
        if (!this.locked && !this.resting) this.eventsOut.pet();
      },
    );
    this.ball = this.add
      .container(265, 390, [
        this.add.ellipse(0, 9, 22, 6, 0x8c7958, 0.18),
        this.add.circle(0, 0, 11, 0xb5b779),
        this.add.arc(0, 0, 8, -90, 90, false).setStrokeStyle(1.5, 0xf1e9c6),
      ])
      .setVisible(false);
    this.food = this.add.container(0, 0);
    [
      [309, 327],
      [317, 325],
      [325, 328],
      [334, 326],
      [319, 330],
    ].forEach(([x, y]) => {
      this.food.add(this.add.ellipse(x, y, 7, 4, 0x654b32));
    });
    this.restText = this.add
      .text(114, 269, "z z", {
        fontFamily: "Georgia",
        fontSize: "20px",
        color: "#8f987c",
      })
      .setVisible(false);
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.locked || this.resting || pointer.y < 260) return;
      this.eventsOut.message("Coming, coming!");
      this.marker(pointer.x, pointer.y);
      this.walk(pointer.x, pointer.y);
    });
    this.available = true;
    this.nextWander = this.time.now + 12_000;
    if (this.initiallyResting) {
      this.resting = true;
      this.dog.setPosition(73, 390);
      this.pose("sit");
      this.restText.setVisible(true);
      this.eventsOut.message(
        "A quiet little rest. Tap Wake when you’re ready.",
      );
    } else this.pose("idle");
    this.eventsOut.ready();
  }
  update(time: number) {
    if (!this.available) return;
    this.shadow.setPosition(this.dog.x, this.dog.y - 3);
    const scale = 0.78 + ((this.dog.y - 280) / 140) * 0.12;
    this.dog.setScale(scale);
    this.shadow.setScale(scale / 0.85);
    // Gentle independent movement; care interactions always take priority.
    if (
      !this.reduced &&
      !this.locked &&
      !this.resting &&
      !this.moveTween?.isPlaying() &&
      time > this.nextWander
    ) {
      this.nextWander = time + Phaser.Math.Between(12_000, 20_000);
      this.walk(Phaser.Math.Between(115, 277), Phaser.Math.Between(313, 377));
    }
  }
  perform(action: RoomAction) {
    if (!this.available || this.locked) return;
    if (action === "wake") {
      this.resting = false;
      this.restText.setVisible(false);
      this.eventsOut.rest(false);
      this.eventsOut.message("Stretch, stretch. Hello again!");
      this.walk(188, 348);
      return;
    }
    if (this.resting) return;
    if (action === "call") {
      this.eventsOut.message("Right by your side.");
      this.marker(195, 367);
      this.walk(195, 367);
      return;
    }
    this.locked = true;
    this.eventsOut.busy(true);
    this.moveTween?.stop();
    if (action === "rest") {
      this.eventsOut.message("Off to her favorite cushion.");
      this.walk(73, 390, () => {
        this.resting = true;
        this.pose("sit");
        this.restText.setVisible(true);
        this.eventsOut.rest(true);
        this.eventsOut.message(
          "A quiet little rest. Her energy is recharging.",
        );
        this.unlock();
      });
    } else if (action === "feed") {
      this.eventsOut.message("Did someone say snack?");
      this.food.setVisible(true);
      this.walk(299, 344, () => {
        this.dog.anims.stop();
        this.dog.setFrame(80); // Existing downward gaze, ready to replace with a dedicated eating loop.
        this.time.delayedCall(1700, () => {
          this.food.setVisible(false);
          this.finish("feed", "A full tummy and a very happy girl.");
        });
      });
    } else if (action === "pet") {
      this.eventsOut.message("That’s the spot. ♡");
      this.pose("wave");
      this.hearts();
      this.time.delayedCall(1600, () =>
        this.finish("pet", "She loves being close to you."),
      );
    } else {
      this.eventsOut.message("Catch it, Ronnie!");
      this.ball.setPosition(145, 386).setVisible(true);
      this.tweens.add({
        targets: this.ball,
        x: 276,
        y: 311,
        duration: this.reduced ? 150 : 650,
        ease: "Quad.easeOut",
        onComplete: () =>
          this.walk(267, 328, () => {
            this.pose("jump");
            this.time.delayedCall(750, () => {
              this.ball.setVisible(false);
              this.finish("play", "Got it! She’s quite proud of herself.");
            });
          }),
      });
    }
  }
  private finish(action: Action, message: string) {
    this.eventsOut.complete(action);
    this.eventsOut.message(message);
    this.pose("idle");
    this.unlock();
  }
  private unlock() {
    this.locked = false;
    this.nextWander = this.time.now + 13_000;
    this.eventsOut.busy(false);
  }
  private pose(name: string) {
    if (this.reduced) {
      this.dog.anims.stop();
      this.dog.setFrame((ROWS.find((row) => row[0] === name)?.[1] ?? 0) * 8);
    } else this.dog.play(name, true);
  }
  private walk(rawX: number, rawY: number, after?: () => void) {
    const x = Phaser.Math.Clamp(rawX, 73, 306),
      y = Phaser.Math.Clamp(rawY, 296, 398);
    this.moveTween?.stop();
    const distance = Phaser.Math.Distance.Between(this.dog.x, this.dog.y, x, y);
    this.pose(x >= this.dog.x ? "right" : "left");
    this.moveTween = this.tweens.add({
      targets: this.dog,
      x,
      y,
      duration: this.reduced ? 100 : Math.max(160, distance / 0.1),
      ease: "Linear",
      onComplete: () => {
        this.pose("idle");
        after?.();
      },
    });
    this.nextWander = this.time.now + 15_000;
  }
  private marker(x: number, y: number) {
    if (this.reduced) return;
    const ring = this.add
      .ellipse(
        Phaser.Math.Clamp(x, 73, 306),
        Phaser.Math.Clamp(y, 296, 398),
        22,
        8,
      )
      .setStrokeStyle(1.5, 0xfaf3d8, 0.9);
    this.tweens.add({
      targets: ring,
      scale: 2,
      alpha: 0,
      duration: 650,
      onComplete: () => ring.destroy(),
    });
  }
  private hearts() {
    if (this.reduced) return;
    [-23, 0, 24].forEach((offset, i) => {
      const heart = this.add
        .text(this.dog.x + offset, this.dog.y - 138, "♥", {
          fontSize: "18px",
          color: "#c48c8f",
        })
        .setOrigin(0.5);
      this.tweens.add({
        targets: heart,
        y: heart.y - 35,
        alpha: 0,
        delay: i * 180,
        duration: 1100,
        onComplete: () => heart.destroy(),
      });
    });
  }
}
