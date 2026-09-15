import { clips } from "./clips.js";

const canvas = document.querySelector("#ronnie");
const context = canvas.getContext("2d");
const gallery = document.querySelector("#gallery");
const scrub = document.querySelector("#scrub");
const toggle = document.querySelector("#toggle");
const replay = document.querySelector("#replay");
const loop = document.querySelector("#loop");
const status = document.querySelector("#status");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const dog = document.createElement("canvas");
dog.width = 192;
dog.height = 208;
const dogContext = dog.getContext("2d");
const images = new Map();
let active = clips[0],
  time = 0,
  playing = false,
  previous = null;
const duration = (clip) =>
  clip.steps.reduce((sum, step) => sum + step.duration, 0);
const ease = (t) => (1 - Math.cos(Math.PI * t)) / 2;
function poseAt(clip, ms) {
  let end = 0;
  return (
    clip.steps.find((step) => {
      end += step.duration;
      return ms < end;
    }) ?? clip.steps.at(-1)
  ).pose;
}
function render(target, clip, ms, poster = false) {
  const pose = poster ? clip.poster : poseAt(clip, ms);
  dogContext.clearRect(0, 0, 192, 208);
  dogContext.drawImage(
    images.get(clip.id),
    pose * 192,
    0,
    192,
    208,
    0,
    0,
    192,
    208,
  );
  if (clip.breathing && !poster) {
    // Approved curled-breathing recipe: fixed head/paws, maximum 3px back lift.
    const breath =
      ms <= 1400
        ? ease(ms / 1400)
        : ms < 3400
          ? 1 - ease((ms - 1400) / 2000)
          : 0;
    if (breath > 0) {
      dogContext.clearRect(18, 94, 86, 60);
      for (let x = 18; x < 104; x++) {
        const weight =
          x < 48 ? ease((x - 18) / 30) : x < 66 ? 1 : 1 - ease((x - 66) / 38);
        const lift = 3 * weight * breath;
        dogContext.drawImage(
          images.get(clip.id),
          x,
          96,
          1,
          58,
          x,
          96 - lift,
          1,
          58 + lift,
        );
      }
    }
  }
  target.clearRect(0, 0, 256, 256);
  if (clip.breathing) {
    target.drawImage(images.get("bed"), 0, 32);
    target.drawImage(dog, 32, -12);
  } else target.drawImage(dog, 32, 24);
  return pose;
}
function paint() {
  canvas.dataset.clip = active.id;
  canvas.dataset.pose = render(context, active, time);
  canvas.setAttribute("aria-label", `Ronnie: ${active.label}`);
  scrub.value = Math.round(time);
  scrub.setAttribute(
    "aria-valuetext",
    `${active.label}, ${(time / 1000).toFixed(1)} seconds`,
  );
  document.querySelector("#time").textContent =
    `${(time / 1000).toFixed(1)} / ${(duration(active) / 1000).toFixed(1)} s`;
}
function setPlaying(value) {
  playing = value;
  previous = null;
  toggle.textContent = playing ? "Pause" : "Play";
  status.textContent = playing ? "Playing" : "Paused";
}
function select(id) {
  active = clips.find((clip) => clip.id === id);
  time = 0;
  scrub.max = duration(active);
  document.querySelector("#clip-title").textContent = active.label;
  document.querySelector("#mood").textContent = active.mood;
  document.querySelector("#duration").textContent = active.length;
  gallery
    .querySelectorAll("button")
    .forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.clip === id)),
    );
  document
    .querySelectorAll("[data-action]")
    .forEach((button) =>
      button.classList.toggle("active", button.dataset.action === id),
    );
  setPlaying(!reducedMotion.matches);
  paint();
}
async function loadImage(key, url) {
  const image = new Image();
  image.src = url;
  await image.decode();
  images.set(key, image);
}
try {
  await Promise.all([
    ...clips.map((clip) => loadImage(clip.id, clip.asset)),
    loadImage("bed", "assets/bed.png"),
  ]);
  for (const clip of clips) {
    const button = document.createElement("button");
    button.className = "clip";
    button.dataset.clip = clip.id;
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Preview ${clip.label}: ${clip.caption}`);
    const thumbnail = document.createElement("canvas");
    thumbnail.width = 256;
    thumbnail.height = 256;
    thumbnail.setAttribute("aria-hidden", "true");
    const text = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = clip.label;
    const length = document.createElement("small");
    length.textContent = clip.length;
    text.append(name, length);
    button.append(thumbnail, text);
    gallery.append(button);
    render(thumbnail.getContext("2d"), clip, 0, true);
    button.addEventListener("click", () => {
      select(clip.id);
      if (matchMedia("(max-width: 690px)").matches) {
        document
          .querySelector(".phone-column")
          .scrollIntoView({
            behavior: reducedMotion.matches ? "instant" : "smooth",
            block: "start",
          });
      }
    });
  }
  document.querySelectorAll("button, input").forEach((control) => {
    control.disabled = false;
  });
  document
    .querySelectorAll("[data-action]")
    .forEach((button) =>
      button.addEventListener("click", () => select(button.dataset.action)),
    );
  toggle.addEventListener("click", () => {
    if (!playing && time >= duration(active)) time = 0;
    setPlaying(!playing);
    paint();
  });
  replay.addEventListener("click", () => {
    time = 0;
    setPlaying(true);
    paint();
  });
  scrub.addEventListener("input", () => {
    time = Number(scrub.value);
    setPlaying(false);
    paint();
  });
  document.addEventListener("visibilitychange", () => {
    previous = null;
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) setPlaying(false);
  });
  select("tail-wag");
  function tick(now) {
    if (playing && !document.hidden && previous !== null) {
      time += now - previous;
      const total = duration(active);
      if (time >= total) {
        if (loop.checked) time %= total;
        else {
          time = total;
          setPlaying(false);
        }
      }
      paint();
    }
    previous = document.hidden ? null : now;
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
} catch (error) {
  status.textContent = "Artwork could not load. Please reload.";
  console.error(error);
}
