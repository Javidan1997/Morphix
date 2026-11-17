// Visual deliverables for the template demos, captured from a built site.
//
//   npm run build && node scripts/serve-pages.mjs 4173 &
//   node scripts/templates/capture.mjs og covers shots   (any subset)
//
//   og      → public/shopify-templates/og/<slug>.jpg + theme assets/<slug>-og.jpg (1200×630)
//             public/shopify-templates/og/shopify-templates.jpg for the gallery page
//   covers  → public/shopify-templates/covers/<slug>-{800,1200}.webp (gallery cards)
//   shots   → docs/templates/screenshots/<slug>-{desktop-1440,mobile-390}.jpg (2×, full page)
//
// Dev-only (outputs are committed). Needs Playwright's Chromium.
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const { templates } = await import("../../src/data/templateGallery.js");
const BASE = process.env.BASE || "http://localhost:4173";
const jobs = new Set(process.argv.slice(2).length ? process.argv.slice(2) : ["og", "covers", "shots"]);
const only = process.env.ONLY ? process.env.ONLY.split(",") : null;
const list = templates.filter((t) => !only || only.includes(t.slug));

const OG = {
  forma: { head: "A slower way to live.", bg: "#f4f0e9", ink: "#241f1a", accent: "#9a8065", file: "font-cormorant-400.woff2", body: "font-jost.woff2", img: "forma-hero-1600.webp", name: "FORMA" },
  edito: { head: "Wear your own point of view.", bg: "#ffffff", ink: "#171715", accent: "#302d28", file: "font-cormorant-400.woff2", body: "font-jost.woff2", img: "edito-hero-1600.webp", name: "ÉDITO" },
  vela: { head: "Bundles and subscribe-and-save, from one buy box.", bg: "#f6f0e7", ink: "#2a1f2e", accent: "#7f603b", font: "Fraunces", file: "font-fraunces.woff2", body: "font-inter.woff2", bodyFamily: "Inter", img: "vela-hero-1200.webp", name: "vela" },
  shadeline: { head: "Size it in 3D. See the real price live.", bg: "#14171a", ink: "#f3f1ec", accent: "#c9b99e", font: "Archivo", file: "font-archivo.woff2", body: "font-archivo.woff2", bodyFamily: "Archivo", img: "shadeline-hero-1280.webp", name: "SHADELINE" },
  northgate: { head: "Trade pricing that unlocks at login.", bg: "#f3f2ed", ink: "#111111", accent: "#ff5a1f", font: "Plex", file: "font-plex-sans-600.woff2", body: "font-plex-mono-500.woff2", bodyFamily: "PlexMono", img: "northgate-hero-1200.webp", name: "NORTHGATE SUPPLY" },
  linkcore: { head: "“Will it work with my setup?” Answered.", bg: "#0a0e15", ink: "#e8edf5", accent: "#c6f432", font: "Grotesk", file: "font-space-grotesk.woff2", body: "font-jetbrains-mono.woff2", bodyFamily: "Mono", img: "linkcore-hero-1200.webp", name: "linkcore" },
  aurel: { head: "An engraved ring, released on drop day.", bg: "#f8f5ef", ink: "#1c1a17", accent: "#8a6a3a", font: "Cormorant", file: "font-cormorant-400.woff2", body: "font-jost.woff2", bodyFamily: "Jost", img: "aurel-hero-1200.webp", name: "AUREL" },
};

function ogHtml(t) {
  const b = OG[t.slug];
  const a = `${BASE}/shopify-templates/assets/`;
  return `<!doctype html><html><head><style>
  @font-face{font-family:D;src:url(${a}${b.file})}
  @font-face{font-family:B;src:url(${a}${b.body})}
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;display:grid;grid-template-columns:560px 640px;background:${b.bg};color:${b.ink};font-family:B,sans-serif;overflow:hidden}
  .l{padding:56px 52px;display:flex;flex-direction:column}
  .brand{font-family:D;font-size:${t.slug === "aurel" ? 34 : 30}px;letter-spacing:${["aurel", "shadeline"].includes(t.slug) ? ".24em" : "-.01em"};font-weight:600}
  .k{margin-top:auto;font-size:15px;letter-spacing:.14em;text-transform:uppercase;color:${b.accent}}
  h1{font-family:D;font-weight:${t.slug === "aurel" ? 400 : 600};font-size:56px;line-height:1.02;letter-spacing:-.02em;margin-top:14px}
  .tags{margin-top:22px;font-size:18px;opacity:.85}
  .foot{margin-top:28px;padding-top:18px;border-top:1px solid ${b.ink}33;font-size:15px;opacity:.75;display:flex;justify-content:space-between}
  .r{background:url(${a}${b.img}) center/cover}
  </style></head><body><div class="l"><p class="brand">${b.name}</p><p class="k">${t.sector}</p><h1>${b.head}</h1><p class="tags">${t.tags.join(" · ")}</p><p class="foot"><span>Concept Shopify store</span><span>configuro.studio</span></p></div><div class="r"></div></body></html>`;
}

function galleryOgHtml() {
  const a = `${BASE}/shopify-templates/assets/`;
  const tiles = templates.map((t) => `<div style="background:url(${a}${OG[t.slug].img}) center/cover"></div>`).join("");
  return `<!doctype html><html><head><style>
  @font-face{font-family:G;src:url(${a}font-space-grotesk.woff2)}*{margin:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#0b0c0f;color:#f3f5fa;font-family:G,sans-serif;display:grid;grid-template-rows:1fr 250px;overflow:hidden}
  .t{padding:56px 60px}.k{letter-spacing:.18em;font-size:15px;color:#9aa3b2;text-transform:uppercase}
  h1{font-size:60px;line-height:1.02;letter-spacing:-.03em;margin-top:14px;max-width:960px}
  .g{display:grid;grid-template-columns:repeat(${templates.length},1fr);gap:6px;padding:0 6px 6px}.g div{border-radius:10px}
  </style></head><body><div class="t"><p class="k">Configuro · Shopify templates</p><h1>${templates.length} concept stores, each built as a real Online Store 2.0 theme.</h1></div><div class="g">${tiles}</div></body></html>`;
}

const browser = await chromium.launch();

if (jobs.has("og")) {
  const dir = join(root, "public", "shopify-templates", "og");
  mkdirSync(dir, { recursive: true });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  // Same origin as the fonts, so @font-face loads (about:blank would block them).
  await page.goto(`${BASE}/robots.txt`).catch(() => {});
  await page.route(`${BASE}/__og`, (route) => route.fulfill({ contentType: "text/html", body: "<!doctype html><html></html>" }));
  await page.goto(`${BASE}/__og`);
  for (const t of list) {
    await page.setContent(ogHtml(t), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const buf = await page.screenshot({ type: "jpeg", quality: 86 });
    writeFileSync(join(dir, `${t.slug}.jpg`), buf);
    writeFileSync(join(root, "shopify", "theme", "assets", `${t.slug}-og.jpg`), buf);
    console.log(`og/${t.slug}.jpg`);
  }
  await page.setContent(galleryOgHtml(), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  writeFileSync(join(dir, "shopify-templates.jpg"), await page.screenshot({ type: "jpeg", quality: 86 }));
  console.log("og/shopify-templates.jpg");
  await page.close();
}

async function settle(page) {
  // Walk the page so lazy images load and reveal animations finish.
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 600) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in")));
  await page.waitForTimeout(900);
}

if (jobs.has("covers")) {
  const dir = join(root, "public", "shopify-templates", "covers");
  mkdirSync(dir, { recursive: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  for (const t of list) {
    await page.goto(`${BASE}/shopify-templates/${t.slug}`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: ".cfg-demo-bar{display:none!important}" });
    await page.waitForTimeout(600);
    const png = await page.screenshot({ type: "png" });
    // Encode WebP in the browser (no image deps in Node).
    const out = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${b64}`;
      await img.decode();
      const res = {};
      for (const w of [800, 1200]) {
        const c = document.createElement("canvas");
        c.width = w;
        c.height = Math.round(w * 0.625);
        const g = c.getContext("2d");
        g.imageSmoothingQuality = "high";
        g.drawImage(img, 0, 0, 1440, 900, 0, 0, c.width, c.height);
        res[w] = c.toDataURL("image/webp", 0.82).split(",")[1];
      }
      return res;
    }, png.toString("base64"));
    for (const [w, b64] of Object.entries(out)) writeFileSync(join(dir, `${t.slug}-${w}.webp`), Buffer.from(b64, "base64"));
    console.log(`covers/${t.slug}`);
  }
  await ctx.close();
}

if (jobs.has("shots")) {
  const dir = join(root, "docs", "templates", "screenshots");
  mkdirSync(dir, { recursive: true });
  for (const [label, opts] of [
    ["desktop-1440", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }],
    ["mobile-390", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    for (const t of list) {
      await page.goto(`${BASE}/shopify-templates/${t.slug}`, { waitUntil: "networkidle" });
      await settle(page);
      writeFileSync(join(dir, `${t.slug}-${label}.jpg`), await page.screenshot({ fullPage: true, type: "jpeg", quality: 80 }));
      console.log(`screenshots/${t.slug}-${label}.jpg`);
    }
    await ctx.close();
  }
}

await browser.close();
