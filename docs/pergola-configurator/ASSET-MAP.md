# /pergola-configurator asset and source map

Originals are preserved. Nothing under `C:\Users\Professional\Desktop\Glass Group ALL` or `output/pergola-motion-brief` was modified. Production derivatives live in `public/pergola-configurators/v2/`. The original URLs under `/pergola-configurators/` (models, environments, PNG renders) still resolve, because external Framer templates load them.

## 3D assets

| Source | Destination | Processing |
| --- | --- | --- |
| `public/pergola-configurators/environments/Patio.glb` (from Confiurator, Shopify CDN) | `v2/env-patio.glb` | spec/gloss → metal/rough, meshopt, WebP textures ≤1024. 13.2 MB → 1.7 MB |
| `…/environments/Pool.glb` | `v2/env-pool.glb` | same. 5.2 MB → 3.0 MB |
| `…/environments/Deck.glb` | `v2/env-deck.glb` | same. 6.3 MB → 1.7 MB |
| `…/environments/Rooftop.glb` | `v2/env-rooftop.glb` | same. 4.2 MB → 0.6 MB |
| `…/environments/morning.hdr` (4096×2048) | `v2/sky-1k.hdr` | 1024×512 box filter. 16.6 MB → 2.1 MB |
| `pergola-configurator-pwa/public/models/heater.glb` | `v2/heater.glb` | metal/rough + meshopt. 275 KB → 56 KB |

The frame, louvers, sliding glass, fixed glass, ZIP screens, composite panels, LEDs and wall mount are procedural geometry (`src/pergola/viewer/buildPergola.js`). They follow the PWA product rules, so every size is valid. The source `main.glb` is a nested CAD assembly and cannot be resized reliably in the browser.

Not used: `fan-small/large.glb` (a static beam rather than a fan, and unreliable after compression), guillotine glass (Shopify CDN only), and the source `10x10/10x13/13x16` pergola GLBs (kept online for Framer).

## Product rules (pergola-configurator-pwa/src/main.js → src/pergola/configModel.js)

- `DIMENSION_LIMITS.height` 84–132 in → height 2.15–3.35 m
- `MAX_MODULE_WIDTH_IN` 177.19 in → a bay split and intermediate posts above 4.50 m width
- `MAX_STRUCTURE_UNIT_PROJECTION_IN` 168 in → middle side posts above 4.27 m projection
- `SLIDING_GLASS_OPEN_MAX_DEFAULT` 75 → sliding glass opens up to 75%
- `FIXED_GLASS_PANE_COUNT_BY_LENGTH` → 3 panes for bays up to 10 ft, otherwise 4
- `RAL_CLASSIC` → the six finishes offered
- Wall mount removes the wall-side posts and side system

The client's price grid (`PRICE_GRID`, `SUBSYSTEM_PRICE_TABLES`) is **not** used. The estimate uses clearly labelled placeholder rates (`ILLUSTRATIVE_RATES`).

## Images

| Source | Destination |
| --- | --- |
| `public/pergola-configurators/hero-morning.png` / `hero-night.png` / `detail.png` | `v2/img/hero-*`, `night-*`, `detail-*` (AVIF + WebP), `og-pergola-configurator.jpg` |
| PWA `public/images/glass.png`, `fixed_glass.webp`, `zip.png`, `composit_panel.webp` | `v2/img/side-*.webp` |
| `output/pergola-motion-brief/images/*.png` (concept renders) | `v2/img/concept-*-{640,960,1536}.{avif,webp}` and `*-thumb.webp` |
| Live viewer captures (`scripts/capture-pergola-renders.mjs`) | `v2/img/poster-*`, `story-*`, `scene-*-thumb.webp` |

Concept renders appear only in the marketing sections and are labelled as concepts. Movement, story frames, scene thumbnails, exports and the poster all come from the live model.

## Scripts

- `scripts/optimize-pergola-assets.mjs`: GLB, HDR and image derivatives (needs `sharp` and `@gltf-transform/cli`)
- `scripts/capture-pergola-renders.mjs`: poster, story frames and scene thumbnails from the real viewer
- `scripts/check-pergola-model.mjs`: configuration model checks (`npm run check:pergola`)
- `scripts/serve-pages.mjs`: serves `dist/` the way GitHub Pages does
- `scripts/verify-pergola.mjs`: 96 browser checks (routes, controls, exports, form, story, mobile, reduced motion)
