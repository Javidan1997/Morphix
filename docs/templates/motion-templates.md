# Forma and Édito

Original concept brands added to Configuro's Shopify gallery. The selected
Be Yours demos informed the interaction direction; no theme source, branding
or reference photography was copied. The implementation uses the existing
Liquid theme, demo renderer, cart adapter and self-hosted fonts.

- Forma: `/shopify-templates/forma`, luxury furniture.
- Édito: `/shopify-templates/edito`, editorial clothing.
- Gallery: `/shopify-templates/`, both entries first, with Furniture, Fashion
  and Scroll storytelling filters. Count, metadata and sitemap cover seven demos.

## Design system and sections

Forma uses ivory `#f4f0e9`, dark brown `#241f1a`, Cormorant Garamond display type
and Jost interface type. Édito uses true white `#ffffff` with near-black
`#171715`. Both use open full-bleed imagery, sharp corners, underlined actions,
4.7vw desktop gutters and 22px phone gutters. The concept sequence is hero,
editorial, campaign scene, collection, footer.

The four `cfg-motion-*` Liquid sections expose merchant settings and blocks.
`cfg-motion.js` batches scroll updates with requestAnimationFrame; video seeks
coalesce while a previous seek is pending. No animation framework is required.
Images have dimensions, responsive WebP sources and lazy loading below the
hero. Video is muted, never auto-playing, and not requested in reduced-motion
or save-data mode. The local preview and Vite servers support byte-range video
requests to match production seeking behavior.

Bundled five-second videos are subtle camera moves across original generated
campaign photographs. They demonstrate actual MP4 seeking, not live-action
motion. Replace them with real brand film through the section's video setting.

## Functional verification

`npm run build` renders all seven demos. `npm run templates:check-motion`
checks both new demos in Chromium at 1440×900 and 390×844, including:

- Hero MP4 currentTime changes with scroll (approximately three seconds at 60%).
- Chapter panels move horizontally and Édito's desktop collection translates.
- Furniture adds to cart; clothing size M reaches the cart correctly.
- Pause restores all chapters to static document flow.
- Reduced motion avoids video loading and hides the redundant pause control.
- No unintended mobile document overflow; phone product rails remain swipeable.
- Gallery has seven cards and the Fashion filter returns Édito.
- No new-demo runtime errors or failed local asset requests.

Results: [motion-checks.json](motion-checks.json). Theme CLI validation reports
zero issues. No Lighthouse scores are claimed for these additions. No live
Shopify development store installation was performed.

Browser extension/connection tools were unavailable, so verification used the
repository's puppeteer-core with system Chromium. `check-motion.mjs` captures
hero, editorial, scene, collection, static story and phone screenshots. Images
are inspected directly with `view_image`, including both concepts and browser
captures. Concepts are 1024×1536 overview art; desktop captures are 1440×900
section views and full document views, and phone captures are 390×844. The
concept overview is not a viewport-sized browser specification.

## Visual fidelity ledger

The concept art direction was faithfully implemented and visually compared in
`view_image`. Intentional functional additions are recorded below.

| Check | Concept evidence | Render evidence / decision |
|---|---|---|
| Typography | Large fine serif headlines and restrained sans UI | Cormorant/Jost, matching headline hierarchy and small underlined actions |
| Palette | Forma warm ivory; Édito true white | Exact background tokens retained; no default rounded cards |
| Header | Spaced wordmark, two navigation links, bag | Same structure; existing bag icon opens the working cart |
| Hero | Full-bleed architectural / courtyard campaign | Original generated campaign assets, same image-first direction; first-screen CTA fit corrected |
| Editorial | Forma material closeup; Édito staggered portraits | Sharp material photograph and staggered drifting fashion row |
| Story | Dark campaign scene with light serif text | Pinned image chapters; a second chapter intentionally demonstrates the requested sliding transition |
| Collection | Three furniture / clothing products | Same product lineup, with price, real variant controls and working cart added |
| Phone | Editorial hierarchy adapted to narrow screens | Oversized heading retained; fashion image crop corrected to keep the model visible |

Above-the-fold copy matches the concept headline, brand, navigation and CTA.
Intentional differences: Configuro concept-demo disclosure, accessible motion
control, bag icon instead of text, original separately generated campaign
photographs, and an opaque header on Édito for consistent navigation contrast.
The second story chapter and functional price/variant/cart controls extend the
static concept to satisfy the requested storefront behavior.

No material layout defects remain in the inspected viewports. Screenshots in
`screenshots/` and concept images in `concepts/` are retained as review artifacts.

## Reproduce

```
npm ci
npm run build
npm run serve:pages
npm run templates:check-motion
npm run templates:capture-motion
```

Capture refreshes gallery covers and social images for the two new demos.
Rebuild after capture to copy these public images into `dist/`.
