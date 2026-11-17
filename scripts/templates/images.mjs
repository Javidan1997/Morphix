// Image slots for the concept brands → responsive WebP files in theme assets.
//
//   npm run templates:images                 # every slot
//   npm run templates:images -- vela-hero    # only these slots
//
// For each slot in shopify/images/manifest.json:
//   • shopify/images/<slot>.(png|jpg|jpeg|webp) exists → crop to the slot's
//     aspect (focus: centre | left | right | top | bottom), resize, and write
//     <slot>-<width>.webp for every width the theme's srcset uses;
//   • otherwise → a labelled placeholder at the same sizes, so layouts keep
//     their exact proportions (no layout shift) until the real image lands.
// Also regenerates docs/templates/image-prompts.md from the manifest.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const srcDir = join(root, "shopify", "images");
const outDir = join(root, "shopify", "theme", "assets");
const manifest = JSON.parse(readFileSync(join(srcDir, "manifest.json"), "utf8"));
const only = process.argv.slice(2);

const TINT = {
  vela: { bg: "#ebdfcf", line: "#d9c7b2", ink: "#3b2741" },
  shadeline: { bg: "#dcd8cf", line: "#c9c3b7", ink: "#16191c" },
  northgate: { bg: "#e7e5df", line: "#d3d0c6", ink: "#111111" },
  linkcore: { bg: "#121823", line: "#1c2533", ink: "#c6f432" },
  aurel: { bg: "#f1ece3", line: "#e2d9cb", ink: "#8a6a3a" },
};

export function widthsFor(width) {
  if (width >= 2000) return [640, 960, 1280, 1600, 2000];
  if (width >= 1600) return [480, 800, 1200, 1600];
  return [480, 800, 1200].filter((w) => w <= width);
}

const POSITION = { centre: "centre", center: "centre", left: "west", right: "east", top: "north", bottom: "south" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");

function placeholderSvg(brand, slot, [w, h], usedIn, focus = "centre") {
  const t = TINT[brand];
  // Keep the label where the real subject will be (heroes with copy on one side).
  const cx = focus === "right" ? w * 0.74 : focus === "left" ? w * 0.26 : w / 2;
  const u = Math.min(w, h) / (focus === "centre" ? 100 : 150); // type scale relative to the short edge
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><pattern id="p" width="${u * 6}" height="${u * 6}" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="${u * 6}" stroke="${t.line}" stroke-width="${u * 0.5}"/></pattern></defs>
  <rect width="100%" height="100%" fill="${t.bg}"/><rect width="100%" height="100%" fill="url(#p)"/>
  <rect x="${u * 3}" y="${u * 3}" width="${w - u * 6}" height="${h - u * 6}" fill="none" stroke="${t.ink}" stroke-opacity=".25" stroke-width="${u * 0.25}" stroke-dasharray="${u * 1.5} ${u}"/>
  <g font-family="Inter, DejaVu Sans, sans-serif" fill="${t.ink}" text-anchor="middle">
    <text x="${cx}" y="${h / 2 - u * 7}" font-size="${u * 3}" letter-spacing="${u * 0.6}" opacity=".7">IMAGE SLOT</text>
    <text x="${cx}" y="${h / 2 + u * 1.5}" font-size="${u * 7}" font-weight="600">${esc(slot)}</text>
    <text x="${cx}" y="${h / 2 + u * 8}" font-size="${u * 3.2}" opacity=".75">${w} × ${h} · ${esc(usedIn)}</text>
    <text x="${cx}" y="${h / 2 + u * 13}" font-size="${u * 2.6}" opacity=".55">shopify/images/${esc(slot)}.png → npm run templates:images</text>
  </g></svg>`;
}

function findSource(slot) {
  for (const ext of ["png", "jpg", "jpeg", "webp"]) {
    const p = join(srcDir, `${slot}.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

let real = 0, placeholders = 0;
for (const [brand, b] of Object.entries(manifest.brands)) {
  for (const s of b.slots) {
    if (only.length && !only.includes(s.slot)) continue;
    const [w, h] = s.size;
    const source = findSource(s.slot);
    const base = source
      ? sharp(source).rotate().resize(w, h, { fit: "cover", position: POSITION[s.focus] || "centre", kernel: "lanczos3" })
      : sharp(Buffer.from(placeholderSvg(brand, s.slot, s.size, s.usedIn, s.focus)));
    const master = await base.png().toBuffer();
    for (const width of widthsFor(w)) {
      await sharp(master).resize(width).webp({ quality: source ? 82 : 70, effort: 5 }).toFile(join(outDir, `${s.slot}-${width}.webp`));
    }
    source ? real++ : placeholders++;
    console.log(`${source ? "image" : "placeholder"}  ${s.slot}  ${w}×${h}`);
  }
}
console.log(`${real} real, ${placeholders} placeholder slots written to shopify/theme/assets`);

// ---------------------------------------------------------------- prompts doc
const lines = [
  "# Image prompts for the Shopify concept templates",
  "",
  "Every image on the five demos is a slot. Generate each one with GPT image generation, save it as `shopify/images/<slot>.png` (or `.jpg` / `.webp`), then run:",
  "",
  "```bash",
  "npm run templates:images        # crops/resizes into shopify/theme/assets/<slot>-<width>.webp",
  "npm run build                   # rebuild the demos",
  "```",
  "",
  "Generate at the **GPT size** shown; the script crops to the slot's aspect around the **focus** and resizes. Slots without a file show a labelled placeholder. After the hero images are in, re-run `node scripts/templates/capture.mjs og covers shots` so link previews, gallery covers and screenshots use them.",
  "",
];
for (const [brand, b] of Object.entries(manifest.brands)) {
  lines.push(`## ${b.name}`, "", `**Art direction (append to every prompt):** ${b.direction}`, "");
  for (const s of b.slots) {
    const prompt = s.prompt.replaceAll("{product}", b.product);
    lines.push(
      `### \`${s.slot}\` · ${s.size[0]} × ${s.size[1]} · GPT ${s.gpt} · focus ${s.focus}`,
      "",
      `*Used in:* ${s.usedIn}`,
      "",
      "```text",
      `${prompt}\n\n${b.direction}`,
      "```",
      "",
    );
  }
}
mkdirSync(join(root, "docs", "templates"), { recursive: true });
writeFileSync(join(root, "docs", "templates", "image-prompts.md"), lines.join("\n"));
console.log("docs/templates/image-prompts.md updated");
