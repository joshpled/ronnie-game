const player = document.querySelector("#player");
const large = document.querySelector("#large-player");
const toggle = document.querySelector("#toggle");
const replay = document.querySelector("#replay");
const scrub = document.querySelector("#scrub");
const status = document.querySelector("#status");
const phase = document.querySelector("#phase");
const loop = document.querySelector("#loop");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const image = new Image();
image.src = "motion-v2.png";

try {
  const [timeline] = await Promise.all([
    fetch("timeline-v2.json").then((response) => {
      if (!response.ok) throw new Error("Timeline unavailable");
      return response.json();
    }),
    image.decode(),
  ]);
  const duration = timeline.reduce((total, step) => total + step.duration, 0);
  // A paused peak pose lets people inspect the expression without autoplay.
  const peakTime = timeline
    .slice(
      0,
      timeline.findIndex((step) => step.phase === "Howling"),
    )
    .reduce((total, step) => total + step.duration, 0);
  let time = reducedMotion.matches ? peakTime : 0;
  let playing = !reducedMotion.matches;
  let previous = null;
  let lastPose = -1;
  const contexts = [player, large].map((canvas) => canvas.getContext("2d"));
  scrub.max = duration;

  function paint() {
    let end = 0;
    const step =
      timeline.find((entry) => {
        end += entry.duration;
        return time < end;
      }) ?? timeline.at(-1);
    if (step.pose !== lastPose) {
      for (const context of contexts) {
        context.clearRect(0, 0, 192, 208);
        context.drawImage(image, step.pose * 192, 0, 192, 208, 0, 0, 192, 208);
      }
      lastPose = step.pose;
    }
    scrub.value = Math.round(time);
    scrub.setAttribute(
      "aria-valuetext",
      `${step.phase}, ${(time / 1000).toFixed(1)} seconds`,
    );
    phase.textContent = `${step.phase} · ${(time / 1000).toFixed(1)} / ${(duration / 1000).toFixed(1)} s`;
    player.dataset.pose = step.pose;
  }

  function setPlaying(value) {
    playing = value;
    previous = null;
    toggle.textContent = playing ? "Pause" : "Play";
    status.textContent = playing ? "Playing" : "Paused";
  }
  toggle.addEventListener("click", () => {
    if (!playing && time >= duration) time = 0;
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
  // Never turn time spent in another tab into an abrupt motion jump.
  document.addEventListener("visibilitychange", () => {
    previous = null;
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) setPlaying(false);
  });
  function tick(now) {
    if (playing && !document.hidden && previous !== null) {
      time += now - previous;
      if (time >= duration) {
        if (loop.checked) time %= duration;
        else {
          time = duration;
          setPlaying(false);
        }
      }
      paint();
    }
    previous = document.hidden ? null : now;
    requestAnimationFrame(tick);
  }
  for (const control of [toggle, replay, scrub, loop]) control.disabled = false;
  setPlaying(playing);
  paint();
  requestAnimationFrame(tick);
} catch (error) {
  status.textContent =
    "Preview could not load. Reload, or open the animated GIF below.";
  console.error(error);
}
