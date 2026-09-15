// Builds the web-ready asset set for /pergola-configurator from the original
// source files. Outputs go to public/pergola-configurators/v2/ so the original
// asset URLs under /pergola-configurators/ keep working untouched.
//
// This is a one-off maintenance script, not part of `npm run build`. It needs
// two tools that are deliberately not project dependencies:
//
//   npm i --no-save sharp @gltf-transform/cli@4.5.0
//   node scripts/optimize-pergola-assets.mjs
//
// Set ASSET_TOOLS_DIR to a folder whose node_modules holds those packages if
// they are installed elsewhere. See docs/pergola-configurator/ASSET-MAP.md for
// the source-to-destination mapping.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const toolsDir = process.env.ASSET_TOOLS_DIR || root;
const require = createRequire(join(toolsDir, "package.json"));
const sharp = require("sharp");
const gltfTransform = join(toolsDir, "node_modules", ".bin", process.platform === "win32" ? "gltf-transform.cmd" : "gltf-transform");

const PUBLIC = join(root, "public", "pergola-configurators");
const OUT = join(PUBLIC, "v2");
const SOURCE_PWA = process.env.PWA_SOURCE || "C:/Users/Professional/Desktop/Glass Group ALL/pergola-configurator-pwa/public";
mkdirSync(join(OUT, "img"), { recursive: true });

const kb = (file) => `${Math.round(readFileSync(file).length / 1024)} KB`;

// 1. GLB: convert legacy spec/gloss materials (no longer read by three.js),
//    then weld, simplify conservatively and meshopt-compress.
const GLBS = [
  [join(PUBLIC, "environments", "Patio.glb"), "env-patio.glb"],
  [join(PUBLIC, "environments", "Pool.glb"), "env-pool.glb"],
  [join(PUBLIC, "environments", "Deck.glb"), "env-deck.glb"],
  [join(PUBLIC, "environments", "Rooftop.glb"), "env-rooftop.glb"],
  [join(SOURCE_PWA, "models", "heater.glb"), "heater.glb"],
];
for (const [source, name] of GLBS) {
  if (!existsSync(source)) { console.warn(`skip ${name}: missing ${source}`); continue; }
  const temp = join(OUT, `.tmp-${name}`);
  // .cmd shims need a shell on Windows, and a shell needs quoted paths.
  const shell = process.platform === "win32";
  const q = (arg) => (shell && /\s/.test(arg) ? `"${arg}"` : arg);
  const run = (args) => execFileSync(shell ? `"${gltfTransform}"` : gltfTransform, args.map(q), { stdio: "ignore", shell });
  run(["metalrough", source, temp]);
  run(["optimize", temp, join(OUT, name), "--compress", "meshopt", "--texture-compress", "webp", "--texture-size", "1024", "--simplify-error", "0.0005"]);
  execFileSync(process.execPath, ["-e", `require('fs').rmSync(${JSON.stringify(temp)})`]);
  console.log(`${name}: ${kb(source)} -> ${kb(join(OUT, name))}`);
}

// 2. HDR: 4096x2048 -> 1024x512 box filter, written as RLE-framed RGBE.
{
  const source = join(PUBLIC, "environments", "morning.hdr");
  const buffer = readFileSync(source);
  const loader = new HDRLoader().setDataType(THREE.FloatType);
  const parsed = loader.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
  const factor = 4, w = parsed.width / factor, h = parsed.height / factor;
  const rgbe = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let r = 0, g = 0, b = 0;
    for (let dy = 0; dy < factor; dy++) for (let dx = 0; dx < factor; dx++) {
      // three flips HDR rows on parse; undo it so the file stays top-down.
      const sy = parsed.height - 1 - (y * factor + dy);
      const i = (sy * parsed.width + x * factor + dx) * 4;
      r += parsed.data[i]; g += parsed.data[i + 1]; b += parsed.data[i + 2];
    }
    const n = factor * factor; r /= n; g /= n; b /= n;
    const max = Math.max(r, g, b), o = (y * w + x) * 4;
    if (max < 1e-32) continue;
    const exp = Math.ceil(Math.log2(max));
    const scale = 256 / 2 ** exp;
    rgbe[o] = Math.min(255, r * scale); rgbe[o + 1] = Math.min(255, g * scale); rgbe[o + 2] = Math.min(255, b * scale); rgbe[o + 3] = exp + 128;
  }
  const chunks = [Buffer.from(`#?RADIANCE\nFORMAT=32-bit_rle_rgbe\n\n-Y ${h} +X ${w}\n`, "latin1")];
  for (let y = 0; y < h; y++) {
    chunks.push(Buffer.from([2, 2, w >> 8, w & 255]));
    for (let c = 0; c < 4; c++) {
      // Literal runs of at most 128 bytes are valid RLE framing; gzip on the
      // CDN does the actual compression.
      for (let x = 0; x < w; x += 128) {
        const len = Math.min(128, w - x);
        const run = Buffer.alloc(len + 1); run[0] = len;
        for (let k = 0; k < len; k++) run[k + 1] = rgbe[(y * w + x + k) * 4 + c];
        chunks.push(run);
      }
    }
  }
  writeFileSync(join(OUT, "sky-1k.hdr"), Buffer.concat(chunks));
  console.log(`sky-1k.hdr: ${kb(source)} -> ${kb(join(OUT, "sky-1k.hdr"))}`);
}

// 3. Renders -> responsive AVIF + WebP, plus the social preview image.
const RENDERS = [
  ["hero-morning.png", "hero", [640, 960, 1280, 1920]],
  ["hero-night.png", "night", [640, 960, 1440]],
  ["detail.png", "detail", [480, 800]],
];
for (const [file, name, widths] of RENDERS) {
  for (const width of widths) {
    const image = sharp(join(PUBLIC, file)).resize({ width });
    await image.clone().avif({ quality: 52, effort: 6 }).toFile(join(OUT, "img", `${name}-${width}.avif`));
    await image.clone().webp({ quality: 74 }).toFile(join(OUT, "img", `${name}-${width}.webp`));
  }
  console.log(`${name}: ${widths.join("/")} avif+webp`);
}
await sharp(join(PUBLIC, "hero-morning.png")).resize(1200, 630, { fit: "cover", position: "centre" }).jpeg({ quality: 80, mozjpeg: true }).toFile(join(OUT, "img", "og-pergola-configurator.jpg"));

// 4. Side-system thumbnails from the PWA option imagery.
const THUMBS = [["glass.png", "side-sliding"], ["fixed_glass.webp", "side-fixed"], ["zip.png", "side-zip"], ["composit_panel.webp", "side-panel"]];
for (const [file, name] of THUMBS) {
  const source = join(SOURCE_PWA, "images", file);
  if (!existsSync(source)) { console.warn(`skip ${name}`); continue; }
  await sharp(source).resize(160, 160, { fit: "contain", background: "#ffffff" }).flatten({ background: "#ffffff" }).webp({ quality: 80 }).toFile(join(OUT, "img", `${name}.webp`));
}
console.log("thumbnails done");

// 5. Concept renders from output/pergola-motion-brief (kept outside public/).
//    The day/night pair gets identical sizes and crops so the comparison
//    slider lines up pixel for pixel.
const BRIEF = join(root, "output", "pergola-motion-brief", "images");
const CONCEPTS = [
  ["garden-day.png", "concept-garden-terrace-day", [640, 960, 1536]],
  ["garden-night.png", "concept-garden-terrace-evening", [640, 960, 1536]],
  ["coastal-pool.png", "concept-poolside-villa", [640, 960, 1536]],
  ["rooftop-evening.png", "concept-hospitality-rooftop", [640, 960, 1536]],
  ["glass-screen-detail.png", "concept-glass-screen-detail", [640, 960, 1536]],
  ["engineering-exploded.png", "concept-exploded-components", [640, 960, 1536]],
];
for (const [file, name, widths] of CONCEPTS) {
  const source = join(BRIEF, file);
  if (!existsSync(source)) { console.warn(`skip ${name}: missing ${source}`); continue; }
  for (const width of widths) {
    const image = sharp(source).resize({ width, height: Math.round((width * 2) / 3), fit: "cover", position: "centre" });
    await image.clone().avif({ quality: 50, effort: 6 }).toFile(join(OUT, "img", `${name}-${width}.avif`));
    await image.clone().webp({ quality: 74 }).toFile(join(OUT, "img", `${name}-${width}.webp`));
  }
  await sharp(source).resize(320, 214, { fit: "cover" }).webp({ quality: 70 }).toFile(join(OUT, "img", `${name}-thumb.webp`));
  console.log(`${name}: ${widths.join("/")} avif+webp + thumb`);
}
