// Renders the concept-brand product imagery with Three.js in headless
// Chromium and writes responsive WebP sizes into shopify/theme/assets.
// All imagery on the template demos is generated here — no stock photos.
//
//   node scripts/templates/render-assets.mjs            # every scene
//   node scripts/templates/render-assets.mjs vela aurel # only these brands
//
// Dev-only tool (the outputs are committed). Needs Playwright's Chromium.

import { createServer } from "node:http";
import { createReadStream, existsSync, statSync, writeFileSync, readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const assetsDir = join(root, "shopify", "theme", "assets");

const MOUNTS = {
  "/three/": join(root, "node_modules", "three"),
  "/scenes/": join(here, "scenes"),
  "/assets/": assetsDir,
};
const TYPES = { ".js": "text/javascript", ".html": "text/html", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png" };

const server = createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(`<!doctype html><html><head><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script></head><body style="margin:0;background:#000"></body></html>`);
  }
  const mount = Object.keys(MOUNTS).find((m) => url.startsWith(m));
  const file = mount && join(MOUNTS[mount], url.slice(mount.length));
  if (!file || !existsSync(file) || !statSync(file).isFile()) {
    res.writeHead(404);
    return res.end();
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  createReadStream(file).pipe(res);
}).listen(0);
const port = server.address().port;

const only = process.argv.slice(2);
const sceneFiles = readdirSync(join(here, "scenes")).filter((f) => f.endsWith(".js") && f !== "common.js");
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
const page = await browser.newPage();
page.on("console", (m) => console.log(`  [page] ${m.text()}`));
page.on("pageerror", (e) => console.error(`  [page error] ${e.message}`));
await page.goto(`http://localhost:${port}/`);

let written = 0;
for (const file of sceneFiles) {
  const brand = file.replace(/\.js$/, "");
  if (only.length && !only.includes(brand)) continue;
  const shots = await page.evaluate(async (src) => (await import(src)).shotList(), `/scenes/${file}`);
  for (const shot of shots) {
    if (only.length > 1 && process.env.SHOT && shot !== process.env.SHOT) continue;
    const t0 = Date.now();
    const out = await page.evaluate(async ({ src, shot }) => (await import(src)).render(shot), { src: `/scenes/${file}`, shot });
    for (const [name, dataUrl] of Object.entries(out)) {
      const ext = dataUrl.startsWith("data:image/png") ? "png" : "webp";
      writeFileSync(join(assetsDir, `${name}.${ext}`), Buffer.from(dataUrl.split(",")[1], "base64"));
      written += 1;
    }
    console.log(`${brand}/${shot}: ${Object.keys(out).length} files in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
}
await browser.close();
server.close();
console.log(`Wrote ${written} images to shopify/theme/assets`);
