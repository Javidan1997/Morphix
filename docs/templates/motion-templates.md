# Forma and Édito luxury storefronts

Two original concept brands in Configuro's Shopify gallery. Forma is furniture;
Édito is clothing. Both use the shared Liquid theme, self-hosted fonts and
original generated concept photography. Reference themes informed the direction;
no reference theme source, brand identity or photographs were copied.

Each brand now has 12 pages: home, collection, six product pages, studio,
journal and two articles. The full build produces 29 pages across seven brands.

## Routes and architecture

- `/shopify-templates/{forma|edito}`
- `/shopify-templates/{brand}/collection`
- `/shopify-templates/{brand}/products/{handle}`
- `/shopify-templates/{brand}/studio`
- `/shopify-templates/{brand}/journal`
- `/shopify-templates/{brand}/journal/{handle}`

`shopify/demo/luxury.mjs` supplies Shopify-shaped products, collections, blogs,
articles and pages. Variant IDs are stable across documents. JSON templates use
`cfg-lux-*` sections; `cfg-luxury.css` and `cfg-luxury.js` are shared by the two
brands. LiquidJS render snippets receive Shopify global objects through the
engine's globals option, preserving isolated snippet locals.

The static builder writes nested HTML and directory indexes for parent routes
so GitHub Pages directory redirects work. Vite handles the same routes in
development; Vercel has matching rewrites. Canonicals and sitemap entries cover
each page, with brand social previews.

## Design and movement

Forma uses ivory `#f4f0e9`, brown `#241f1a`, Cormorant Garamond and Jost. Édito
uses white `#ffffff` and near-black `#171715`. Both use full-bleed photography,
large serif headlines, sharp corners, understated controls and generous space.

Home sequence: cinematic hero, manifesto, featured pieces, pinned image
chapters, brand feature, shoppable scene, journal and newsletter. Supporting
pages carry the same typography, spacing and photographic direction.

Motion preserves native scrolling. A requestAnimationFrame loop interpolates
scroll values and writes transform-only parallax and editorial drift; image
curtains use clip-path in a fixed-height pinned stage. Geometry is cached and
remeasured on load, resize and collection changes. Reveals use IntersectionObserver.
Native cross-document view transitions add a short dissolve and shared product
imagery when supported. Other browsers navigate normally.

The public demos use image movement instead of seeking an MP4 on every scroll.
Merchants can select an optional muted looping Shopify video for the hero.
Pause motion and reduced-motion preferences return chapters to normal document
flow and remove decorative motion. Hero dimensions stay stable during scrolling.

Demo collections filter and sort six products. Installed stores use native Shopify filter URLs, server sorting and 24-product pagination; blog indexes paginate 12 stories, while home previews show two. Product-type filters appear when enabled for the collection in Shopify. Product pages include image/campaign
views, variant selection, quantities, accordions and related pieces. Édito adds
a size guide. Bags persist across pages per brand in tab-scoped sessionStorage;
only demo cart lines are stored. No form input is stored or sent. Checkout stays
disabled. Live stores use the existing Shopify Ajax Cart adapter.

## Verification and visual review

`npm run templates:check-motion` runs Chromium at 1440×1000 and 390×844. It
checks every luxury route, heading structure, internal navigation, local asset
and runtime errors, stable hero height, parallax, chapter masks, pause/reduced
motion, collection filters/sorting, galleries, size selection, quantities,
bag persistence, mobile navigation and overflow. It also checks that the five
older demos retain disabled demo checkout.

Evidence goes to `/tmp/configuro-luxury-qa` by default, or `EVIDENCE_DIR`.
`results.json` is written only after all assertions pass. Historical checked-in
`motion-checks.json` and earlier screenshots document the previous release;
they are not the results of this upgrade. No Lighthouse score or physical-device
frame-rate guarantee is claimed. A live Shopify development-store installation
has not been performed.

The current concept and browser images were inspected directly. The first-screen
headlines, editorial scale, image-first composition and product-page hierarchy
follow the new concepts. Original campaign images were generated separately,
so their contents differ intentionally. Functional navigation, Configuro demo
disclosure, pause control, quantity/variant controls and demo bag extend the
static concepts.

| Area | Concept direction | Browser implementation |
|---|---|---|
| Furniture home | Warm architectural room, white serif over image | Full-height room with “Live with intention.” and restrained navigation |
| Fashion home | Sunlit campaign, large asymmetric serif | “A point of view. Yours.” with transparent navigation over campaign |
| Editorial | Material pairing / staggered fashion portraits | Parallax material details and two drifting fashion rows |
| Chapters | Cinematic image change | Two pinned curtain-reveal scenes with chapter controls |
| Product | Large image beside restrained buy box | Gallery, size/finish, quantity, bag and material details |
| Phone | Retained hierarchy in narrow columns | Stacked content, two-column catalog, menu dialog and adapted image crops |

## Reproduce

```sh
npm ci
npm run build
npm run serve:pages
npm run templates:check-motion
npm run templates:capture-motion
```

Capture refreshes portfolio covers and social images. Rebuild afterward to copy
them into `dist`. Native Liquid regressions: `node scripts/templates/check-luxury-liquid.mjs` covers a non-first linked variant, 70 products and 31 journal articles. Shopify CLI validation: `shopify theme check --path shopify/theme`.
