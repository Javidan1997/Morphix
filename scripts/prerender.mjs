// Post-build prerender: bakes unique SEO metadata (title, description, keywords,
// canonical, Open Graph, JSON-LD) and a crawlable text snapshot into a static
// HTML file per route. Runs after `vite build`. This makes every URL fully
// indexable even before the SPA hydrates — the foundation of on-page SEO.
//
// Usage: node scripts/prerender.mjs   (wired into `npm run build`)

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");

const { pageSeo, buildJsonLd } = await import("../src/locales/seo.js");
const { insights } = await import("../src/data/insights.js");

const ORIGIN = "https://configuro.studio";
const template = readFileSync(join(dist, "index.html"), "utf8");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Replace the content of a meta tag identified by an attribute marker.
function setMetaContent(html, marker, value) {
  const re = new RegExp(`(${marker}[^>]*content=")[^"]*(")`);
  return re.test(html) ? html.replace(re, `$1${esc(value)}$2`) : html;
}

function stripBrand(title) {
  return title.replace(/\s*[|—]\s*Configuro.*$/i, "").replace(/\s*\|\s*Configuro$/i, "").trim();
}

// Minimal crawlable content injected into #root (React replaces it on hydrate).
function crawlBlock({ heading, description, links }) {
  const nav = links
    .map((l) => `<a href="${l.href}">${esc(l.label)}</a>`)
    .join(" ");
  return `<div id="root"><main><h1>${esc(heading)}</h1><p>${esc(description)}</p><nav aria-label="Site">${nav}</nav></main></div>`;
}

const SITE_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function renderRoute(path, seo, jsonLd, heading) {
  let html = template;
  const url = `${ORIGIN}${path === "/" ? "/" : path}`;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`);
  html = setMetaContent(html, 'name="description"', seo.description);
  html = setMetaContent(html, 'property="og:title"', seo.title);
  html = setMetaContent(html, 'name="twitter:title"', seo.title);
  html = setMetaContent(html, 'property="og:description"', seo.description);
  html = setMetaContent(html, 'name="twitter:description"', seo.description);
  html = setMetaContent(html, 'property="og:url"', url);
  if (seo.keywords) html = setMetaContent(html, 'name="keywords"', seo.keywords);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  if (seo.noindex) {
    html = html.replace(/(<meta name="robots" content=")[^"]*(")/, `$1noindex, nofollow$2`);
  }

  // Page JSON-LD before </head>.
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  </head>`,
  );

  // Crawlable body snapshot.
  html = html.replace(
    /<div id="root"><\/div>/,
    crawlBlock({ heading, description: seo.description, links: SITE_LINKS }),
  );

  return html;
}

function write(path, html) {
  const dir = path === "/" ? dist : join(dist, path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf8");
}

const en = pageSeo.en;
let count = 0;

// Static routes.
for (const path of Object.keys(en)) {
  const seo = en[path];
  const jsonLd = buildJsonLd(path, seo);
  write(path, renderRoute(path, seo, jsonLd, stripBrand(seo.title)));
  count += 1;
}

// Insight articles (dynamic routes) → BlogPosting.
for (const a of insights) {
  const path = `/insights/${a.slug}`;
  const url = `${ORIGIN}${path}`;
  const seo = {
    title: `${a.title} | Configuro`,
    description: a.description,
    keywords: undefined,
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.date,
    image: `${ORIGIN}${a.cover}`,
    author: { "@type": "Organization", name: "Configuro", url: `${ORIGIN}/` },
    publisher: {
      "@type": "Organization",
      name: "Configuro",
      logo: { "@type": "ImageObject", url: `${ORIGIN}/morphix-logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
  write(path, renderRoute(path, seo, jsonLd, a.title));
  count += 1;
}

// SPA fallback for any unmatched route (GitHub Pages serves 404.html).
writeFileSync(join(dist, "404.html"), template, "utf8");

// Generate sitemap.xml from all indexable routes so new articles are always listed.
const priority = { "/": "1.0", "/work": "0.9", "/services": "0.8", "/insights": "0.8" };
const sitemapUrls = [];
for (const path of Object.keys(en)) {
  if (en[path].noindex) continue;
  sitemapUrls.push({ loc: `${ORIGIN}${path === "/" ? "/" : path}`, priority: priority[path] || "0.7", freq: "monthly" });
}
for (const a of insights) {
  sitemapUrls.push({ loc: `${ORIGIN}/insights/${a.slug}`, priority: "0.7", freq: "monthly", lastmod: a.date });
}
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  sitemapUrls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}<changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(dist, "sitemap.xml"), sitemap, "utf8");

console.log(`Prerendered ${count} routes + 404 + sitemap (${sitemapUrls.length} urls) into dist/`);
