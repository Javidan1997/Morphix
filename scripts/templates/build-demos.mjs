// Renders the public concept demos from the Shopify theme.
//
//   node scripts/templates/build-demos.mjs            # → dist/templates/<slug>.html
//   node scripts/templates/build-demos.mjs --out tmp  # another output root
//
// For each demo in src/data/templateGallery.js it loads the fixture in
// shopify/demo/<slug>.mjs, renders the theme's JSON template through the
// Shopify-compatible engine and writes a static page. Theme assets are copied
// verbatim to /templates/assets/, so the demo runs the exact CSS/JS a store
// installing shopify/theme would. Also appends the demo URLs to sitemap.xml.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createShopifyEngine, themeSettings } from "./liquid-engine.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..", "..");
const themeDir = join(root, "shopify", "theme");
const demoDir = join(root, "shopify", "demo");

const { templates, templateUrl, TEMPLATE_ORIGIN } = await import(pathToFileURL(join(root, "src", "data", "templateGallery.js")).href);
const { shop } = await import(pathToFileURL(join(demoDir, "shop.mjs")).href);

export const ASSET_BASE = "/templates/assets/";

function assetVersion() {
  const hash = createHash("sha1");
  for (const f of readdirSync(join(themeDir, "assets")).sort()) {
    const s = statSync(join(themeDir, "assets", f));
    hash.update(`${f}:${s.size}:${s.mtimeMs}`);
  }
  return hash.digest("hex").slice(0, 8);
}

/** Render one demo to an HTML string. Exported for the Vite dev middleware. */
export async function renderDemo(slug, { version = assetVersion() } = {}) {
  const meta = templates.find((t) => t.slug === slug);
  if (!meta) throw new Error(`Unknown template: ${slug}`);
  // Cache-bust fixtures in dev so edits show without a restart.
  const fixture = (await import(`${pathToFileURL(join(demoDir, `${slug}.mjs`)).href}?t=${Date.now()}`)).default;
  const locale = JSON.parse(readFileSync(join(themeDir, "locales", "en.default.json"), "utf8"));
  const settings = { ...themeSettings(themeDir), demo_mode: true, demo_back_url: `${TEMPLATE_ORIGIN}/templates` };
  const data = { shop, all_products: fixture.products || {}, collections: fixture.collections || {} };
  const { renderTemplate, renderSection } = createShopifyEngine({ themeDir, assetBase: ASSET_BASE, assetVersion: version, locale, data });

  const [type, suffix] = fixture.template.split(".");
  const globals = {
    settings,
    shop,
    cart: { item_count: 0, total_price: 0, items: [] },
    customer: null,
    routes: { root_url: "/", cart_url: "/cart", cart_add_url: "/cart/add", cart_change_url: "/cart/change", account_url: "/account", account_login_url: "/account/login", account_register_url: "/account/register" },
    request: { design_mode: false, page_type: type, locale: { iso_code: "en" }, host: "configuro.studio" },
    template: { name: type, suffix, directory: null },
    page_title: meta.title,
    page_description: meta.description,
    canonical_url: templateUrl(slug),
    page_image: `${TEMPLATE_ORIGIN}/templates/og/${slug}.jpg`,
    content_for_header: "",
    all_products: data.all_products,
    collections: data.collections,
    ...fixture.context,
  };

  let html = await renderTemplate(fixture.template, globals);

  // Alternate server-rendered states (e.g. Northgate as a logged-in trade
  // buyer) are rendered by the same Liquid and shipped in <template> tags so
  // the demo can switch to them without a backend.
  for (const [name, state] of Object.entries(fixture.states || {})) {
    const parts = [];
    for (const key of state.sections) {
      const tpl = JSON.parse(readFileSync(join(themeDir, "templates", `${fixture.template}.json`), "utf8"));
      const entry = tpl.sections[key];
      parts.push(`<template data-demo-state="${name}" data-section="${key}">${await renderSection(key, entry, { ...globals, ...state.context })}</template>`);
    }
    html = html.replace("</main>", `${parts.join("\n")}\n</main>`);
  }

  return tidy(html);
}

// Collapse blank lines Liquid leaves behind (keeps <pre>/<script> intact enough).
function tidy(html) {
  return html.replace(/\n[ \t]*(?=\n)/g, "").replace(/\n{2,}/g, "\n");
}

export async function buildDemos(outRoot, only = []) {
  const outDir = join(outRoot, "templates");
  mkdirSync(join(outDir, "assets"), { recursive: true });
  cpSync(join(themeDir, "assets"), join(outDir, "assets"), { recursive: true });
  const version = assetVersion();
  for (const t of templates) {
    if (only.length && !only.includes(t.slug)) continue;
    const html = await renderDemo(t.slug, { version });
    // GitHub Pages serves templates/vela.html at /templates/vela with a 200.
    writeFileSync(join(outDir, `${t.slug}.html`), html, "utf8");
    console.log(`  templates/${t.slug}.html  ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
  }

  const sitemap = join(outRoot, "sitemap.xml");
  if (existsSync(sitemap)) {
    const today = new Date().toISOString().slice(0, 10);
    let xml = readFileSync(sitemap, "utf8");
    const urls = templates
      .filter((t) => !xml.includes(`<loc>${templateUrl(t.slug)}</loc>`))
      .map((t) => `  <url><loc>${templateUrl(t.slug)}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`);
    xml = xml.replace("</urlset>", `${urls.join("\n")}\n</urlset>`);
    writeFileSync(sitemap, xml, "utf8");
  }
  console.log(`Built ${templates.length} template demos into ${outDir}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const i = process.argv.indexOf("--out");
  const out = i > -1 ? join(process.cwd(), process.argv[i + 1]) : join(root, "dist");
  const j = process.argv.indexOf("--only");
  await buildDemos(out, j > -1 ? process.argv[j + 1].split(",") : []);
}
