import { readFile, writeFile } from "node:fs/promises";
const file = (name) => new URL(name, import.meta.url);
const names = ["body", "front-lower", "far-front-lower", "hind-foot", "tail"];
const assets = Object.fromEntries(
  await Promise.all(
    names.map(async (name) => [
      name,
      "data:image/png;base64," +
        (await readFile(file(name + ".png"))).toString("base64"),
    ]),
  ),
);
const gait = (await readFile(file("gait.mjs"), "utf8")).replaceAll(
  "export ",
  "",
);
const app = await readFile(file("preview.js"), "utf8");
const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ronnie · a gentler walk</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#eee8dd;color:#352b24;font:16px/1.5 system-ui,-apple-system,sans-serif}main{max-width:800px;margin:auto;padding:30px 20px 48px}h1{font-size:clamp(30px,7vw,46px);line-height:1.1;margin:10px 0 14px;letter-spacing:-.04em}.eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#786b59}.intro{max-width:570px;color:#665c4f}.card{margin:24px 0;background:#f8f2e7;border:1px solid #dbd0bd;border-radius:24px;overflow:hidden}.stage{display:flex;justify-content:center;padding:18px 0 0}canvas{width:240px;height:240px;max-width:100%;aspect-ratio:1;display:block}.large canvas{width:480px;height:auto}.controls{padding:20px;border-top:1px solid #e4d8c6}.buttons{display:flex;gap:8px;flex-wrap:wrap}button{font:inherit;border:1px solid #b8a78b;background:#fffaf2;border-radius:12px;min-height:44px;padding:8px 16px;color:inherit}#toggle{background:#3e6049;border-color:#3e6049;color:white;min-width:92px}button:focus-visible,input:focus-visible{outline:3px solid #4c775b;outline-offset:3px}.range{display:grid;grid-template-columns:1fr auto;gap:6px;margin-top:18px}.range input{width:100%;grid-column:1/-1;min-height:32px;accent-color:#3e6049}.options{display:flex;gap:18px;flex-wrap:wrap;margin-top:12px}.options label{min-height:44px;display:flex;gap:8px;align-items:center}.caption{text-align:center;color:#786b59;font-size:13px;margin:4px 0 18px}.note{font-size:14px;color:#665c4f}details{border-top:1px solid #cfc3b1;margin-top:24px;padding-top:18px}summary{cursor:pointer;min-height:44px}code{font-size:.9em}a{color:#335c41}@media(max-width:400px){main{padding:24px 14px}.controls{padding:16px}button{padding:8px 12px}}
</style></head><body><main><div class="eyebrow">Ronnie / movement study 02</div><h1>A gentler walk.</h1><p class="intro">A new walk built around her joints. Four paws take turns, her body stays calm, and each planted paw moves with the ground.</p>
<section class="card" aria-label="Ronnie walking preview"><div class="stage"><canvas width="960" height="960" role="img" aria-label="Ronnie, a tan and black dog with tall ears and freckled paws, walking to the right."></canvas></div><p class="caption" id="contacts"></p><div class="controls"><div class="buttons"><button id="toggle" type="button">Loading…</button><button id="step" type="button">Small step</button><button id="restart" type="button">Restart</button></div><label class="range">Playback speed <output id="speedValue">1×</output><input id="speed" type="range" min="0.25" max="1.5" step="0.25" value="1"></label><label class="range">Scrub the walk <output id="position">Step cycle 0%</output><input id="phase" type="range" min="0" max="1000" step="1" value="0"></label><div class="options"><label><input id="large" type="checkbox">Enlarge Ronnie</label><label><input id="debug" type="checkbox">Show joints &amp; contacts</label></div></div></section>
<p class="note">Watch her paws against the small marks on the ground. Pause or scrub to inspect a step. With reduced motion enabled, this preview starts paused.</p><details><summary>About this revision</summary><p>The previous sequence of separate drawings was rejected. This version uses one consistent body and illustrated limb pieces, with continuously calculated joint positions. One cycle takes 1.6 seconds at normal speed.</p><p>This is a right-facing animation study awaiting your review. It has not been added to the care game. A joint rig makes timing and foot contact adjustable, but it can still need artwork and anatomy refinement.</p></details></main><script type="module">const ASSETS=${JSON.stringify(assets)};\n${gait}\n${app}</script></body></html>`;
await writeFile(file("../ronnie-walk-review.html"), html);
console.log(
  "Built self-contained walk preview (" +
    Math.round(Buffer.byteLength(html) / 1024) +
    " KiB).",
);
