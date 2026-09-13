import Phaser from "phaser";
import type { Action } from "./care";
import { RonnieMotion } from "./RonnieMotion";
import type { Pace } from "./motion";

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

export class Room extends Phaser.Scene {
  private dog!: Phaser.GameObjects.Sprite;
  private shadow!: Phaser.GameObjects.Ellipse;
  private ball!: Phaser.GameObjects.Container;
  private ballShadow!: Phaser.GameObjects.Ellipse;
  private food!: Phaser.GameObjects.Container;
  private restText!: Phaser.GameObjects.Text;
  private motion!: RonnieMotion;
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
    this.shadow = this.add.ellipse(197, 344, 69, 14, 0x6b6549, 0.14);
    this.dog = this.add
      .sprite(197, 348, "ronnie", 0)
      .setOrigin(0.5, 0.94)
      .setScale(0.85);
    this.motion = new RonnieMotion(this.dog, this.reduced);
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
    this.ballShadow = this.add
      .ellipse(265, 399, 22, 6, 0x8c7958, 0.18)
      .setVisible(false);
    this.ball = this.add
      .container(265, 390, [
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
    this.nextWander = this.time.now + 20_000;
    if (this.initiallyResting) {
      this.resting = true;
      this.motion.place({ x: 73, y: 390 });
      this.motion.play("rest");
      this.restText.setVisible(true);
      this.eventsOut.message(
        "A quiet little rest. Tap Wake when you’re ready.",
      );
    } else this.motion.play("idle");
    this.eventsOut.ready();
  }
  update(time: number, delta: number) {
    if (!this.available) return;
    this.motion.update(delta);
    this.shadow.setPosition(this.dog.x, this.dog.y - 3);
    const scale = 0.78 + ((this.dog.y - 280) / 140) * 0.12;
    // Tiny breathing movement, anchored at the paws; jumping is already drawn in the art.
    const breath =
      !this.reduced && this.motion.calm
        ? Math.sin((time * Math.PI * 2) / 4600) * 0.004
        : 0;
    this.dog.setScale(scale, scale * (1 + breath));
    this.shadow.setScale((scale / 0.85) * (1 - this.motion.airborne * 0.22));
    this.shadow.setAlpha(0.14 - this.motion.airborne * 0.04);
    // Gentle independent movement; care interactions always take priority.
    if (
      !this.reduced &&
      !this.locked &&
      !this.resting &&
      !this.motion.moving &&
      time > this.nextWander
    ) {
      this.walk(
        Phaser.Math.Between(115, 277),
        Phaser.Math.Between(313, 377),
        undefined,
        "wander",
      );
    }
  }
  perform(action: RoomAction) {
    if (!this.available || this.locked) return;
    if (action === "wake") {
      this.locked = true;
      this.eventsOut.busy(true);
      this.resting = false;
      this.restText.setVisible(false);
      this.eventsOut.rest(false);
      this.eventsOut.message("Stretch, stretch. Hello again!");
      this.motion.play("standUp", () =>
        this.walk(188, 348, () => {
          this.motion.play("idle");
          this.unlock();
        }),
      );
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
    if (action === "rest") {
      this.eventsOut.message("Off to her favorite cushion.");
      this.walk(73, 390, () => {
        this.motion.play("sitDown", () => {
          this.resting = true;
          this.motion.play("rest");
          this.restText.setVisible(true);
          this.eventsOut.rest(true);
          this.eventsOut.message(
            "A quiet little rest. Her energy is recharging.",
          );
          this.unlock();
        });
      });
    } else if (action === "feed") {
      this.eventsOut.message("Did someone say snack?");
      this.food.setVisible(true);
      this.walk(299, 344, () => {
        this.motion.play("snack", () => {
          this.food.setVisible(false);
          this.finish("feed", "A full tummy and a very happy girl.");
        });
      });
    } else if (action === "pet") {
      this.motion.stopThen(() => {
        this.eventsOut.message("That’s the spot. ♡");
        this.hearts();
        this.motion.play("affection", () =>
          this.finish("pet", "She loves being close to you."),
        );
      });
    } else {
      this.eventsOut.message("Catch it, Ronnie!");
      this.motion.stopThen(() => {
        this.motion.play("idle");
        this.tossBall(() =>
          this.walk(
            267,
            338,
            () => {
              this.motion.play("jump", () => {
                this.ball.setVisible(false);
                this.ballShadow.setVisible(false);
                this.finish("play", "Got it! She’s quite proud of herself.");
              });
            },
            "chase",
          ),
        );
      });
    }
  }
  private finish(action: Action, message: string) {
    this.eventsOut.complete(action);
    this.eventsOut.message(message);
    this.motion.play("idle");
    this.unlock();
  }
  private unlock() {
    this.locked = false;
    this.nextWander = this.time.now + Phaser.Math.Between(20_000, 32_000);
    this.eventsOut.busy(false);
  }
  private walk(x: number, y: number, after?: () => void, pace: Pace = "walk") {
    this.motion.moveTo({ x, y }, pace, after);
    this.nextWander = this.time.now + Phaser.Math.Between(20_000, 32_000);
  }
  private tossBall(after: () => void) {
    this.ball.setPosition(145, 386).setRotation(0).setVisible(true);
    this.ballShadow.setPosition(145, 395).setVisible(true);
    const throwProgress = { value: 0 };
    this.tweens.add({
      targets: throwProgress,
      value: 1,
      duration: this.reduced ? 100 : 1250,
      ease: "Sine.easeOut",
      onUpdate: () => {
        const t = throwProgress.value;
        const x = Phaser.Math.Linear(145, 276, t),
          ground = Phaser.Math.Linear(386, 326, t);
        const lift = this.reduced ? 0 : Math.sin(t * Math.PI) * 16;
        this.ball.setPosition(x, ground - lift).setRotation(t * Math.PI * 2);
        this.ballShadow.setPosition(x, ground + 9).setScale(1 - lift / 60);
      },
      onComplete: after,
    });
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
        y: heart.y - 28,
        alpha: 0,
        delay: i * 220,
        duration: 1500,
        onComplete: () => heart.destroy(),
      });
    });
  }
}
