// Optional local QA. Uses an existing Playwright install; adds no game dependency.
import { pathToFileURL, fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
import assert from "node:assert/strict";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const playwrightModule = process.env.PLAYWRIGHT_MODULE
  ? pathToFileURL(path.join(process.env.PLAYWRIGHT_MODULE, "index.mjs")).href
  : "playwright";
const { webkit, devices } = await import(playwrightModule);

(async () => {
  const browser = await webkit.launch({ headless: true });
  try {
    const page = await browser.newPage({
      ...devices["iPhone 13"],
      reducedMotion: "reduce",
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(
      pathToFileURL(path.join(__dirname, "../ronnie-walk-review.html")).href,
    );
    await page.waitForFunction(
      () => document.documentElement.dataset.ready === "true",
    );
    assert.equal(await page.locator("#toggle").innerText(), "Play");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    const frame = () =>
      page.evaluate(() => document.querySelector("canvas").toDataURL());
    const first = await frame();
    await page.waitForTimeout(150);
    assert.equal(
      await frame(),
      first,
      "reduced-motion preview must stay still",
    );
    await page.locator("#step").click();
    assert.notEqual(await frame(), first);
    for (let i = 0; i < 63; i++) await page.locator("#step").click();
    assert.equal(
      await frame(),
      first,
      "step wraps to the same rendered pose and floor",
    );
    await page.locator("#toggle").click();
    await page.waitForTimeout(230);
    await page.locator("#toggle").click();
    assert.notEqual(await frame(), first, "playback advances");
    const paused = await frame();
    await page.waitForTimeout(150);
    assert.equal(await frame(), paused, "pause freezes the render");
    await page.locator("#speed").fill("0.5");
    await page.locator("#speed").dispatchEvent("input");
    assert.equal(await page.locator("#speedValue").innerText(), "0.5×");
    await page.locator("#phase").fill("500");
    await page.locator("#phase").dispatchEvent("input");
    assert.equal(await page.locator("#position").innerText(), "Step cycle 50%");
    await page.locator("#debug").check();
    const debug = await frame();
    await page.locator("#debug").uncheck();
    assert.notEqual(await frame(), debug, "joint overlay toggles");
    await page.locator("#large").check();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    await page.locator("#large").uncheck();
    await page.locator("#restart").click();
    assert.equal(await frame(), first);
    const loop = await page.evaluate(() => {
      walkStudy.renderAt(walkStudy.WALK.duration);
      return document.querySelector("canvas").toDataURL();
    });
    assert.equal(loop, first, "exact loop closure includes scenery");
    const renderMs = await page.evaluate(() => {
      const samples = [];
      for (let i = 0; i < 64; i++) {
        const start = performance.now();
        walkStudy.renderAt((i * walkStudy.WALK.duration) / 64);
        samples.push(performance.now() - start);
      }
      samples.sort((a, b) => a - b);
      return { median: samples[32], p95: samples[60], max: samples[63] };
    });
    assert.ok(
      renderMs.median < 33,
      "desktop emulated render exceeds 30fps budget",
    );
    await page.evaluate(() => walkStudy.renderAt(0));
    await page.screenshot({
      path: path.join(__dirname, "mobile.png"),
      fullPage: true,
    });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.reload();
    await page.waitForFunction(
      () => document.documentElement.dataset.ready === "true",
    );
    assert.equal(await page.locator("#toggle").innerText(), "Pause");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.querySelector("#toggle").textContent === "Play",
    );
    assert.deepEqual(errors, []);
    const report = {
      browser: "WebKit",
      device: "iPhone 13 emulation on desktop",
      checks: [
        "initial/live reduced motion",
        "play/pause",
        "64-step wrap",
        "scrub",
        "speed",
        "restart",
        "joint overlay",
        "mobile/enlarged overflow",
        "exact rendered loop seam",
      ],
      renderMs,
      performanceLimit:
        "CPU submission timing only, not physical iPhone frame-rate evidence",
      errors,
    };
    fs.writeFileSync(
      path.join(__dirname, "browser-qa.json"),
      JSON.stringify(report, null, 2) + "\n",
    );
    console.log(JSON.stringify(report));
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
