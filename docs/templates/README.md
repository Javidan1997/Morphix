# Shopify Templates — configuro.studio/shopify-templates

Five concept Shopify storefronts for invented brands, published as a gallery
on configuro.studio and shipped as one installable Online Store 2.0 theme.

| Demo | URL | Engineering hook | Lighthouse mobile (P / A / BP / SEO) |
|---|---|---|---|
| Vela | `/shopify-templates/vela` | 1/2/3-pack variants + native selling plans, sticky ATC | 100 / 100 / 100 / 100 |
| Shadeline | `/shopify-templates/shadeline` | Three.js preview, metafield price rules, line-item properties | 100 / 100 / 100 / 100 |
| Northgate Supply | `/shopify-templates/northgate` | customer-tag gated tiers, quick order, HubSpot webhook, discount Function | 100 / 100 / 100 / 100 |
| Linkcore | `/shopify-templates/linkcore` | compatibility rules from metafields, Python GraphQL importer | 100 / 100 / 100 / 100 |
| Aurel | `/shopify-templates/aurel` | engraving preview + limit, size drawer, drop countdown, waitlist | 100 / 100 / 100 / 100 |

Measured with Lighthouse 12.8 (mobile preset: simulated slow 4G, 4× CPU
throttle) against the production build served gzipped by
`scripts/serve-pages.mjs`. In the reports kept in `lighthouse/` every demo has
LCP ≤ 1.9 s, TBT ≤ 10 ms and CLS 0; across repeated runs performance varied
by at most one point (one Linkcore run scored 99).

## How it is built

```
src/data/templateGallery.js        one list: gallery cards, demo titles/descriptions, sitemap
src/pages/TemplateGallery.jsx      /shopify-templates (React, Configuro brand, filter chips)
src/pages/Templates.jsx            existing /templates builder — unchanged
shopify/theme/                     the Shopify theme (source of truth for every demo)
shopify/demo/*.mjs                 fixture data shaped like Shopify's Liquid objects
scripts/templates/liquid-engine.mjs  Shopify-compatible LiquidJS (schema, form, sections, money, t, image_url…)
scripts/templates/build-demos.mjs  renders each JSON template → dist/shopify-templates/<slug>.html
shopify/images/manifest.json       every image slot: size, focus, GPT prompt
scripts/templates/images.mjs       your images (or placeholders) → theme assets (WebP sizes)
scripts/templates/capture.mjs      OG images, gallery covers, full-page screenshots
```

**Demos are rendered from the theme, not copied from it.** `build-demos.mjs`
loads each brand's JSON template, merges each section's `{% schema %}`
defaults like the storefront does, renders sections, section groups and the
layout through LiquidJS with Shopify's tags and filters, then writes static
HTML. Theme `assets/` are copied verbatim to `/shopify-templates/assets/`, so the
public page runs byte-for-byte the CSS and JavaScript a store installing the
theme gets. Logged-in states (Northgate's trade view) come from the same
Liquid rendered with a tagged customer fixture and shipped in `<template>`
tags.

**Demo mode** (`settings.demo_mode`) shows the "Concept demo by Configuro ·
Back to templates" bar and the footer note "Demo store, not a real brand".
In demo mode `cfg-core.js` swaps the Ajax Cart API for an in-memory cart:
add to cart, subscribe, forms and the waitlist all work visually. Nothing is
sent, nothing is stored (no cookies, no localStorage), and checkout is
disabled.

**Imagery** is supplied by you: every image is a slot listed in
`shopify/images/manifest.json` with its size, crop focus and a GPT prompt
(`image-prompts.md`). Until a file exists the slot shows a labelled
placeholder at the exact final proportions. Brand fonts are self-hosted OFL
faces from Fontsource, so demos make no third-party requests.

**Per-demo meta.** Each page has its own `<title>`, description,
`rel="canonical"` (`https://configuro.studio/shopify-templates/<slug>`), Open Graph
and Twitter tags with a 1200×630 image (`public/shopify-templates/og/<slug>.jpg`, also
in theme assets as `<slug>-og.jpg`), an SVG favicon, and FAQPage JSON-LD
where relevant. The gallery has its own OG image and an `ItemList` in its
JSON-LD, and all five URLs are added to `sitemap.xml`.

### Commands

```bash
npm run build              # site + prerender + template demos (CI runs this)
npm run dev                # /shopify-templates/<slug> renders live from shopify/theme on each request
npm run templates:build    # demos only (after `npm run build` once)
npm run templates:images   # shopify/images/<slot>.png → theme assets; placeholders for missing ones
npm run theme:zip          # dist/configuro-concepts-theme.zip for Shopify upload
node scripts/templates/capture.mjs og covers shots   # with serve-pages running on :4173
```

## Routing and hosting

Production is **GitHub Pages** (`.github/workflows/deploy-pages.yml` builds
on push to `main`; `public/CNAME` = `configuro.studio`).

| URL | File | Notes |
|---|---|---|
| `/shopify-templates` | `dist/shopify-templates/index.html` (prerendered SPA route) | gallery; Pages redirects to the trailing slash like other routes |
| `/shopify-templates/vela` … | `dist/shopify-templates/vela.html` | Pages serves `name.html` at the extensionless URL with 200, same trick as `/pergola-configurator` |
| `/shopify-templates/assets/*` | theme assets copied verbatim | |
| `/templates` | unchanged | the existing Template Studio builder |

`vercel.json` gets the matching rewrite
(`/shopify-templates/:slug(shadeline|vela|northgate|linkcore|aurel)` →
`/shopify-templates/:slug.html`), so the site still works if it's deployed to Vercel.
The Vite dev server renders demos on request (`templateDemoRoutes()` in
`vite.config.js`).

Gallery cards link with plain `<a href>` (a full page load): each demo is its
own document with its own fonts, CSS and meta.

## Subdomains (optional): vela.configuro.studio …

GitHub Pages serves one custom domain per repository and has no wildcard
support, so subdomains need a thin proxy in front. The cheapest option is
Cloudflare (free plan):

1. **Move DNS to Cloudflare.** Add `configuro.studio` as a site, copy the
   existing records (the GitHub Pages `A` records for `@` — 185.199.108.153,
   .109.153, .110.153, .111.153 — and `www`), then switch the nameservers at
   the registrar. Keep `@` and `www` as **DNS only** (grey cloud) so GitHub
   Pages keeps issuing its certificate.
2. **Wildcard record:** `CNAME  *  configuro.studio`, **Proxied** (orange
   cloud). Cloudflare's Universal SSL covers `*.configuro.studio`.
3. **Worker:** create one from `docs/templates/subdomain-worker.js` and add the
   route `*.configuro.studio/*`. `vela.configuro.studio/` then serves
   `/shopify-templates/vela`, `/shopify-templates/assets/…` passes through, and any other path
   301s to the canonical page.
4. **Canonical:** nothing to change. Every demo already declares
   `<link rel="canonical" href="https://configuro.studio/shopify-templates/<slug>">`,
   and the Worker adds the same canonical as an HTTP `Link` header, so search
   engines index one URL per demo.

Check with `curl -sI https://vela.configuro.studio/` (expect 200 plus a
`link: <…/shopify-templates/vela>; rel="canonical"` header).

On **Vercel** instead: point the nameservers at Vercel, add
`*.configuro.studio` as a wildcard domain, and use a rewrite with a `has`
host condition (`{ "type": "host", "value": "(?<slug>vela|shadeline|northgate|linkcore|aurel)\\.configuro\\.studio" }`)
to `/shopify-templates/:slug.html`.

## Deliverables in this folder

- `screenshots/<slug>-desktop-1440.jpg`, `screenshots/<slug>-mobile-390.jpg`:
  full page at 2×
- `lighthouse/<slug>-lighthouse-mobile.png`: score summaries
- `upwork-portfolio.md`: title, role line, ~90-word description, five skills
  and the link for each demo
- `subdomain-worker.js`: the Cloudflare Worker above
- Shopify code: `shopify/` (see `shopify/README.md`)

## Known limits

- The `/shopify-templates` **gallery page** inherits the site shell. Its Lighthouse
  performance in this headless setup (≈35) matches existing pages such as
  `/work` (≈42) because the site-wide WebGL ambient background dominates main
  thread time under software rendering. The demos don't load that bundle.
  Deferring that background on low-power devices would lift every page; it
  was left unchanged here so existing pages behave exactly as before.
- Selling plans offer subscriptions; billing renewals needs a subscription
  app (Shopify's free Subscriptions app works).
- Shadeline prices by manufacturing band (variants), because Shopify can't
  price a line from free-form properties without Plus or Cart Transform.
