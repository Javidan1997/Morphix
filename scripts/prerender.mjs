// Post-build prerender: bakes unique SEO metadata (title, description, keywords,
// canonical, Open Graph, JSON-LD) and a crawlable text snapshot into a static
// HTML file per route. Runs after `vite build`. This makes every URL fully
// indexable even before the SPA hydrates — the foundation of on-page SEO.
//
// Usage: node scripts/prerender.mjs   (wired into `npm run build`)

import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
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

// Static routes. Standalone pages (their own HTML entry) are rendered below.
for (const path of Object.keys(en)) {
  const seo = en[path];
  if (seo.standalone) continue;
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

// ---- /pergola-configurator ---------------------------------------------------
// Rendered from React at build time and hydrated on load, so the full page is
// in the initial HTML. Written as dist/pergola-configurator.html: GitHub Pages
// serves it at the extensionless URL with a 200 (a same-named directory would
// force a trailing-slash redirect instead).
{
  const PATH = "/pergola-configurator";
  const url = `${ORIGIN}${PATH}`;
  const seo = en[PATH];
  const { render, copy } = await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href);
  const shell = readFileSync(join(dist, "pergola.html"), "utf8");
  const image = `${ORIGIN}/pergola-configurators/v2/img/og-pergola-configurator.jpg`;
  const heroSet = [640, 960, 1280, 1920].map((w) => `/pergola-configurators/v2/img/hero-${w}.avif ${w}w`).join(", ");

  const faq = copy.faqs.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } }));
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${ORIGIN}/#organization`,
        name: "Configuro",
        url: `${ORIGIN}/`,
        email: "hello@configuro.studio",
        logo: `${ORIGIN}/morphix-logo.svg`,
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: seo.title,
        description: seo.description,
        inLanguage: "en",
        isPartOf: { "@id": `${ORIGIN}/#website` },
        primaryImageOfPage: { "@type": "ImageObject", url: image, width: 1200, height: 630 },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        about: { "@id": `${url}#service` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Pergola configurator", item: url },
        ],
      },
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: seo.serviceName,
        serviceType: "3D product configurator design and development",
        description: seo.description,
        url,
        provider: { "@id": `${ORIGIN}/#organization` },
        areaServed: "Worldwide",
        audience: { "@type": "BusinessAudience", audienceType: "Pergola manufacturers, dealers and installers" },
        offers: copy.services.map(([name, price, description]) => ({
          "@type": "Offer",
          name,
          description,
          priceSpecification: { "@type": "PriceSpecification", minPrice: Number(price.replace(/[^0-9.]/g, "")), priceCurrency: "USD" },
        })),
      },
      { "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: faq },
    ],
  };

  const head = [
    `<title>${esc(seo.title)}</title>`,
    `<meta name="description" content="${esc(seo.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Configuro" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(copy.heroAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    `<link rel="preload" as="image" type="image/avif" imagesrcset="${heroSet}" imagesizes="(min-width: 1024px) 56vw, 100vw" fetchpriority="high" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>`,
  ].filter(Boolean).join("\n    ");

  // Inline the page stylesheet: it is small (~7 KB gzipped) and removing the
  // render-blocking request brings first paint and the hero image forward.
  let page = shell.replace("<!--pc-head-->", head).replace("<!--pc-app-->", render());
  page = page.replace(/<link rel="stylesheet" crossorigin href="(\/assets\/pergola-[^"]+\.css)">/, (tag, href) => `<style>${readFileSync(join(dist, href), "utf8").replace(/<\/style/gi, "<\\/style")}</style>`);
  if (!page.includes("<style>")) throw new Error("Pergola prerender: stylesheet was not inlined");
  if (!page.includes("<h1") || page.includes("<!--pc-")) throw new Error("Pergola prerender failed: placeholders not replaced");
  writeFileSync(join(dist, "pergola-configurator.html"), page, "utf8");
  rmSync(join(dist, "pergola.html"));

  // Old plural URL. GitHub Pages cannot send a custom 301, so this page
  // redirects instantly (script keeps the query and hash; meta refresh is the
  // no-JS fallback) and points search engines at the new canonical URL. Its
  // folder also holds the original 3D assets, which stay where they are.
  const legacy = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Moved: Pergola configurator | Configuro</title>
<link rel="canonical" href="${url}" />
<script>location.replace("${PATH}" + location.search + location.hash);</script>
<meta http-equiv="refresh" content="0; url=${PATH}" />
</head>
<body><p>This page has moved to <a href="${PATH}">${url}</a>.</p></body>
</html>
`;
  mkdirSync(join(dist, "pergola-configurators"), { recursive: true });
  writeFileSync(join(dist, "pergola-configurators", "index.html"), legacy, "utf8");
  count += 1;
}

// SPA fallback for any unmatched route (GitHub Pages serves 404.html).
writeFileSync(join(dist, "404.html"), template, "utf8");

// Generate sitemap.xml from all indexable routes so new articles are always listed.
const priority = { "/": "1.0", "/work": "0.9", "/pergola-configurator": "0.9", "/services": "0.8", "/insights": "0.8" };
const buildDate = new Date().toISOString().slice(0, 10);
const sitemapUrls = [];
for (const path of Object.keys(en)) {
  if (en[path].noindex) continue;
  const lastmod = en[path].standalone ? buildDate : undefined;
  sitemapUrls.push({ loc: `${ORIGIN}${path === "/" ? "/" : path}`, priority: priority[path] || "0.7", freq: "monthly", lastmod });
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
