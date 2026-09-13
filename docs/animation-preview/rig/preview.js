// Bundled with gait.mjs and embedded textures by build-preview.mjs.
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const images = {};
await Promise.all(
  Object.entries(ASSETS).map(async ([name, src]) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    images[name] = img;
  }),
);
const farImages = {};
for (const [name, img] of Object.entries(images)) {
  const surface = document.createElement("canvas");
  surface.width = img.width;
  surface.height = img.height;
  const paint = surface.getContext("2d");
  paint.drawImage(img, 0, 0);
  paint.globalCompositeOperation = "source-atop";
  paint.fillStyle = "rgba(0,0,0,0.21)";
  paint.fillRect(0, 0, surface.width, surface.height);
  farImages[name] = surface;
}
// Each texture's center line follows its alpha silhouette, rather than
// carrying a baked-in bend into the rig a second time.
const axes = {};
for (const name of ["front-lower", "far-front-lower", "hind-foot"]) {
  const img = images[name],
    surface = document.createElement("canvas");
  surface.width = img.width;
  surface.height = img.height;
  const paint = surface.getContext("2d");
  paint.drawImage(img, 0, 0);
  const data = paint.getImageData(0, 0, img.width, img.height).data;
  axes[name] = Array.from({ length: img.height }, (_, y) => {
    let left = img.width,
      right = -1;
    for (let x = 0; x < img.width; x++)
      if (data[(y * img.width + x) * 4 + 3] > 100) {
        left = Math.min(left, x);
        right = x;
      }
    return right < left ? 0.43 : (left + right) / 2 / img.width;
  });
}
let farSide = false;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let playing = !reduced.matches,
  elapsed = 0,
  previous = 0;
let speed = 1,
  debug = false;
const toggle = document.querySelector("#toggle");

function paw(name, foot, width, height, start) {
  const img = (farSide ? farImages : images)[name];
  ctx.drawImage(
    img,
    0,
    img.height * start,
    img.width,
    img.height * (1 - start),
    foot.x - width * 0.44,
    foot.y - height,
    width,
    height,
  );
}
// Skin a continuous illustration over fixed-length bones. The ribbon uses
// arc length, so turning a bone never stretches its texture along the limb.
function triangle(img, source, target) {
  const [s0, s1, s2] = source,
    [d0, d1, d2] = target;
  const determinant =
    (s1.x - s0.x) * (s2.y - s0.y) - (s2.x - s0.x) * (s1.y - s0.y);
  const a =
    ((d1.x - d0.x) * (s2.y - s0.y) - (d2.x - d0.x) * (s1.y - s0.y)) /
    determinant;
  const c =
    ((d2.x - d0.x) * (s1.x - s0.x) - (d1.x - d0.x) * (s2.x - s0.x)) /
    determinant;
  const b =
    ((d1.y - d0.y) * (s2.y - s0.y) - (d2.y - d0.y) * (s1.y - s0.y)) /
    determinant;
  const d =
    ((d2.y - d0.y) * (s1.x - s0.x) - (d1.y - d0.y) * (s2.x - s0.x)) /
    determinant;
  // Expand the clipping edges by less than one device pixel. Otherwise Canvas
  // antialiases each triangle independently and exposes a fine mesh of cracks.
  const winding = Math.sign(
    (d1.x - d0.x) * (d2.y - d0.y) - (d1.y - d0.y) * (d2.x - d0.x),
  );
  const expanded = target.map((p, i) => {
    const previous = target[(i + 2) % 3],
      next = target[(i + 1) % 3];
    const normal = (a, b) => {
      const length = Math.hypot(b.x - a.x, b.y - a.y);
      return {
        x: (winding * (b.y - a.y)) / length,
        y: (-winding * (b.x - a.x)) / length,
      };
    };
    const n0 = normal(previous, p),
      n1 = normal(p, next),
      amount = 0.18 / (1 + n0.x * n1.x + n0.y * n1.y);
    return { x: p.x + (n0.x + n1.x) * amount, y: p.y + (n0.y + n1.y) * amount };
  });
  ctx.save();
  ctx.beginPath();
  expanded.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  ctx.closePath();
  ctx.clip();
  ctx.transform(
    a,
    b,
    c,
    d,
    d0.x - a * s0.x - c * s0.y,
    d0.y - b * s0.x - d * s0.y,
  );
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
function skin(name, points, width, cropEnd = 1) {
  const img = (farSide ? farImages : images)[name],
    lengths = points
      .slice(1)
      .map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  const total = lengths.reduce((a, b) => a + b, 0);
  function along(distance) {
    let remaining = Math.max(0, Math.min(total, distance));
    let index = 0;
    while (index < lengths.length - 1 && remaining > lengths[index])
      remaining -= lengths[index++];
    const a = points[index],
      b = points[index + 1],
      t = remaining / lengths[index];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  const count = 64,
    rows = [];
  for (let i = 0; i <= count; i++) {
    const u = i / count,
      distance = u * total,
      center = along(distance);
    const before = along(distance - 3),
      after = along(distance + 3);
    const length = Math.hypot(after.x - before.x, after.y - before.y);
    const normal = {
      x: (after.y - before.y) / length,
      y: -(after.x - before.x) / length,
    };
    const w = Array.isArray(width)
      ? width[0] + (width[1] - width[0]) * u
      : width;
    const axis =
      axes[name][
        Math.min(img.height - 1, Math.round(u * img.height * cropEnd))
      ];
    rows.push({
      left: {
        x: center.x - normal.x * w * axis,
        y: center.y - normal.y * w * axis,
      },
      right: {
        x: center.x + normal.x * w * (1 - axis),
        y: center.y + normal.y * w * (1 - axis),
      },
      y: u * img.height * cropEnd,
    });
  }
  for (let i = 0; i < count; i++) {
    const a = rows[i],
      b = rows[i + 1],
      s0 = { x: 0, y: a.y },
      s1 = { x: img.width, y: a.y },
      s2 = { x: 0, y: b.y },
      s3 = { x: img.width, y: b.y };
    triangle(img, [s0, s1, s2], [a.left, a.right, b.left]);
    triangle(img, [s1, s3, s2], [a.right, b.right, b.left]);
  }
}

function legArt(leg) {
  const p = leg.points;
  ctx.save();
  farSide = leg.far;
  if (leg.kind === "front") {
    const lower = leg.far ? "far-front-lower" : "front-lower";
    skin(lower, p, 24, 0.78);
    paw(lower, leg.foot, 18, 9, 0.81);
  } else {
    skin("hind-foot", p, [34, 18], 0.7);
    paw("hind-foot", leg.foot, 16, 8, 0.76);
  }
  ctx.restore();
}

function render(time) {
  const pose = poseAt(time),
    scale = canvas.width / 240;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, 240, 240);
  ctx.fillStyle = "#f8f2e7";
  ctx.fillRect(0, 0, 240, 240);
  ctx.save();
  ctx.translate(17, 13);
  ctx.fillStyle = "#e9dfce";
  ctx.fillRect(-17, 178, 240, 49);
  ctx.strokeStyle = "#cabc9f";
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(-17, 178);
  ctx.lineTo(223, 178);
  ctx.stroke();
  // Ground markers travel at WALK.speed. A planted paw follows its marker.
  const gap = (WALK.duration * WALK.speed) / 2;
  const travel = (time * WALK.speed) % gap;
  ctx.fillStyle = "#c9bca6";
  for (let x = -gap; x < 250; x += gap) ctx.fillRect(x - travel, 197, 4, 1);
  // Ground shadow is scenery, not baked into Ronnie's art.
  ctx.fillStyle = "rgba(82,58,32,0.08)";
  ctx.beginPath();
  ctx.ellipse(104, 188, 70, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  pose.legs.filter((l) => l.far).forEach(legArt);
  ctx.save();
  ctx.translate(43, 102 + pose.bob);
  ctx.rotate(0.05 * Math.sin(pose.phase * Math.PI * 2));
  ctx.drawImage(images.tail, -31, -43, 37, 48);
  ctx.restore();
  pose.legs.filter((l) => !l.far).forEach(legArt);
  ctx.drawImage(
    images.body,
    27,
    12 + pose.bob,
    160,
    (160 * images.body.height) / images.body.width,
  );
  if (debug)
    for (const leg of pose.legs) {
      ctx.strokeStyle = leg.far ? "#6d78ad" : "#a9371f";
      ctx.lineWidth = 1;
      ctx.beginPath();
      leg.points.forEach((p, i) =>
        i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
      );
      ctx.stroke();
      for (const p of leg.points) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.7, 0, Math.PI * 2);
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
      }
      ctx.fillStyle = leg.foot.planted ? "#25704d" : "#b97016";
      ctx.beginPath();
      ctx.arc(leg.foot.x, leg.foot.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  ctx.restore();
  document.querySelector("#phase").value = String(
    Math.round(pose.phase * 1000),
  );
  document.querySelector("#position").textContent =
    `Step cycle ${Math.round(pose.phase * 100)}%`;
  document.querySelector("#contacts").textContent =
    `${pose.legs.filter((l) => l.foot.planted).length} paws supporting her`;
}
function state() {
  toggle.textContent = playing ? "Pause" : "Play";
  toggle.setAttribute("aria-pressed", String(playing));
}
toggle.onclick = () => {
  playing = !playing;
  state();
};
document.querySelector("#step").onclick = () => {
  playing = false;
  elapsed =
    (((Math.round((elapsed / WALK.duration) * 64) + 1) % 64) * WALK.duration) /
    64;
  state();
  render(elapsed);
};
document.querySelector("#restart").onclick = () => {
  elapsed = 0;
  render(elapsed);
};
document.querySelector("#speed").oninput = (e) => {
  speed = Number(e.target.value);
  document.querySelector("#speedValue").textContent = speed + "×";
};
document.querySelector("#phase").oninput = (e) => {
  playing = false;
  elapsed = (Number(e.target.value) / 1000) * WALK.duration;
  state();
  render(elapsed);
};
document.querySelector("#debug").onchange = (e) => {
  debug = e.target.checked;
  render(elapsed);
};
document.querySelector("#large").onchange = (e) =>
  document.querySelector(".stage").classList.toggle("large", e.target.checked);
reduced.onchange = (e) => {
  if (e.matches) {
    playing = false;
    state();
  }
};
function tick(now) {
  if (playing && previous && !document.hidden) {
    elapsed += Math.min((now - previous) / 1000, 0.05) * speed;
    render(elapsed);
  }
  previous = now;
  requestAnimationFrame(tick);
}
document.addEventListener("visibilitychange", () => {
  previous = 0;
});
// Deterministic render hook for contact-sheet exports and browser QA.
window.walkStudy = {
  renderAt(time) {
    playing = false;
    elapsed = time;
    state();
    render(elapsed);
  },
  poseAt,
  footAt,
  WALK,
  LEGS,
};
state();
render(0);
document.documentElement.dataset.ready = "true";
requestAnimationFrame(tick);
