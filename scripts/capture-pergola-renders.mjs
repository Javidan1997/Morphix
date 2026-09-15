// Captures real output of the live 3D viewer for static use on the page:
//   - poster shown before the engine loads (and as the no-WebGL fallback)
//   - story frames for "See every option in action"
//   - scene thumbnails for the Scene tab
// Nothing here is concept art: every image is rendered by the configurator.
//
//   npm run build && node scripts/serve-pages.mjs 4173
//   ASSET_TOOLS_DIR=<folder with sharp> node scripts/capture-pergola-renders.mjs [--only=poster,story,scenes]
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import { DEFAULT_CONFIG, encodeConfig, normalizeConfig } from "../src/pergola/configModel.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sharp = createRequire(join(process.env.ASSET_TOOLS_DIR || root, "package.json"))("sharp");
const out = join(root, "public", "pergola-configurators", "v2", "img");
const base = process.env.BASE_URL || "http://localhost:4173";
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
const only = (process.argv.find((a) => a.startsWith("--only=")) || "--only=poster,story,scenes").slice(7).split(",");

const design = (patch) => normalizeConfig({ ...DEFAULT_CONFIG, ...patch, sides: { ...DEFAULT_CONFIG.sides, ...(patch.sides || {}) } });
const clean = { sides: { front: "none", right: "none", rear: "none", left: "none" }, led: "off", heaters: 0 };
const enclosure = { ...clean, sides: { front: "sliding", right: "zip", rear: "none", left: "none" } };
const jobs = [];
if (only.includes("poster")) jobs.push({ name: "poster", config: design({}), view: "overview", widths: [960, 1440] });
if (only.includes("story")) {
  jobs.push(
    { name: "story-roof-closed", config: design({ ...clean, roof: 0 }), view: "roof" },
    { name: "story-roof-half", config: design({ ...clean, roof: 45 }), view: "roof" },
    { name: "story-roof-open", config: design({ ...clean, roof: 90 }), view: "roof" },
    { name: "story-enclosure-open", config: design({ ...enclosure, slidingOpen: 75, zipOpen: 100 }), view: "overview" },
    { name: "story-enclosure-glass", config: design({ ...enclosure, slidingOpen: 0, zipOpen: 100 }), view: "overview" },
    { name: "story-enclosure-screen", config: design({ ...enclosure, slidingOpen: 0, zipOpen: 0 }), view: "overview" },
    { name: "story-atmosphere-anthracite", config: design({ ...clean, led: "warm", ledLevel: 60 }), view: "overview" },
    { name: "story-atmosphere-white", config: design({ ...clean, finish: "ral9016", led: "warm", ledLevel: 60 }), view: "overview" },
    { name: "story-atmosphere-warm", config: design({ ...clean, led: "warm", ledLevel: 90, heaters: 2, time: "night" }), view: "overview" },
    { name: "story-atmosphere-color", config: design({ ...clean, led: "color", ledHue: 195, ledLevel: 100, heaters: 2, time: "night" }), view: "overview" },
  );
  for (const job of jobs) if (job.name.startsWith("story")) job.widths = [960, 1440];
}
if (only.includes("scenes")) {
  for (const environment of ["studio", "patio", "pool", "deck", "rooftop"]) jobs.push({ name: `scene-${environment}`, config: design({ environment }), view: "overview", thumb: true });
}

const browser = await puppeteer.launch({ executablePath: chrome, headless: "new", args: ["--use-angle=d3d11", "--enable-gpu", "--ignore-gpu-blocklist", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 1 });
for (const job of jobs) {
  await page.goto(`${base}/pergola-configurator?debug3d&c=${encodeConfig(job.config)}`, { waitUntil: "networkidle0" });
  await page.addStyleTag({ content: ".pc-stage{position:fixed!important;inset:0!important;width:1440px!important;height:1080px!important;max-height:none!important;border-radius:0!important;z-index:9999} .pc-stage-bar,.pc-stage-zoom,.pc-stage-demo,.pc-stage-status,.pc-toast-region,.pc-header{display:none!important}" });
  await page.evaluate(() => window.dispatchEvent(new Event("configuro:viewer-activate")));
  await page.waitForSelector('.pc-stage[data-status="ready"]', { timeout: 60000 });
  await page.waitForFunction((env) => env === "studio" || window.__pergolaViewer?.environmentModel, { timeout: 60000 }, job.config.environment);
  await page.evaluate((view) => window.__pergolaViewer.setView(view, { instant: true }), job.view);
  await new Promise((resolve) => setTimeout(resolve, 2500));
  const png = await (await page.$(".pc-host")).screenshot({ type: "png" });
  if (job.thumb) {
    await sharp(png).resize(320, 200, { fit: "cover" }).webp({ quality: 72 }).toFile(join(out, `${job.name}-thumb.webp`));
  } else {
    for (const width of job.widths) {
      const image = sharp(png).resize(width, Math.round(width * 0.75), { fit: "cover" });
      await image.clone().avif({ quality: 55, effort: 6 }).toFile(join(out, `${job.name}-${width}.avif`));
      await image.clone().webp({ quality: 78 }).toFile(join(out, `${job.name}-${width}.webp`));
    }
  }
  console.log("captured", job.name);
}
await browser.close();
