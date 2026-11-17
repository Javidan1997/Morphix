# Image prompts for the Shopify concept templates

Every image on the five demos is a slot. Generate each one with GPT image generation, save it as `shopify/images/<slot>.png` (or `.jpg` / `.webp`), then run:

```bash
npm run templates:images        # crops/resizes into shopify/theme/assets/<slot>-<width>.webp
npm run build                   # rebuild the demos
```

Generate at the **GPT size** shown; the script crops to the slot's aspect around the **focus** and resizes. Slots without a file show a labelled placeholder. After the hero images are in, re-run `node scripts/templates/capture.mjs og covers shots` so link previews, gallery covers and screenshots use them.

## Vela (supplement)

**Art direction (append to every prompt):** Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.

### `vela-hero` · 1600 × 1600 · GPT 1024x1024 · focus centre

*Used in:* Hero (right column)

```text
Hero product photograph of a matte deep-plum ceramic supplement jar (about 7 cm wide, 9 cm tall) with a ribbed champagne-gold metal lid and a minimal cream label reading "vela" in a soft serif, with "Evening Calm" in small italic below, standing on a warm sand-coloured seamless backdrop, a few two-tone lavender-and-cream capsules scattered in front, a large soft pale circle in the background like a rising moon, late-evening warm light from the left casting a long soft shadow. Square composition with the jar slightly right of centre and empty space around it.

Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.
```

### `vela-pack-1` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Buy box: 1-jar pack

```text
Clean e-commerce photograph of one a matte deep-plum ceramic supplement jar (about 7 cm wide, 9 cm tall) with a ribbed champagne-gold metal lid and a minimal cream label reading "vela" in a soft serif, with "Evening Calm" in small italic below, centred on a soft cream seamless background, gentle shadow, front-facing, label fully readable. Square.

Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.
```

### `vela-pack-2` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Buy box: 2-jar pack

```text
Clean e-commerce photograph of two identical a matte deep-plum ceramic supplement jar (about 7 cm wide, 9 cm tall) with a ribbed champagne-gold metal lid and a minimal cream label reading "vela" in a soft serif, with "Evening Calm" in small italic below, side by side and slightly angled towards each other, centred on a soft cream seamless background, gentle shadows, labels readable. Square.

Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.
```

### `vela-pack-3` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Buy box: 3-jar pack

```text
Clean e-commerce photograph of three identical a matte deep-plum ceramic supplement jar (about 7 cm wide, 9 cm tall) with a ribbed champagne-gold metal lid and a minimal cream label reading "vela" in a soft serif, with "Evening Calm" in small italic below in a gentle arc, the middle one slightly forward, on a soft cream seamless background, gentle shadows, labels readable. Square, all three jars fully in frame with margin.

Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.
```

### `vela-capsules` · 1600 × 1200 · GPT 1536x1024 · focus centre

*Used in:* Ingredients section image + buy-box thumbnail

```text
Close-up still life of two-tone vegan capsules (lavender cap, cream body) scattered on warm sand-coloured linen, with the base of a matte deep-plum ceramic supplement jar (about 7 cm wide, 9 cm tall) with a ribbed champagne-gold metal lid and a minimal cream label reading "vela" in a soft serif, with "Evening Calm" in small italic below out of focus in the top-right corner, soft daylight, shallow depth of field, calm and tactile. Landscape 4:3.

Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.
```

### `vela-ritual` · 1600 × 1100 · GPT 1536x1024 · focus centre

*Used in:* Buy-box thumbnail (evening ritual)

```text
Moody evening lifestyle still life on a bedside table: a matte deep-plum ceramic supplement jar (about 7 cm wide, 9 cm tall) with a ribbed champagne-gold metal lid and a minimal cream label reading "vela" in a soft serif, with "Evening Calm" in small italic below, a clear glass of water and a small ceramic dish holding two capsules, dim warm lamp light, deep plum and charcoal tones in the background, cosy and quiet. Landscape.

Warm, calm, premium wellness editorial. Soft natural window light, cream and warm sand backgrounds, deep plum accents, champagne-gold details. Clean and minimal, shallow depth of field, photographic realism, no people unless stated, no extra text or logos beyond the jar label.
```

## Shadeline (pergolas)

**Art direction (append to every prompt):** Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.

### `shadeline-hero` · 2000 × 1125 · GPT 1536x1024 · focus right

*Used in:* Full-bleed hero (text sits on the left)

```text
Wide architectural photograph of a free-standing louvred aluminium pergola about 4.2 m wide and 3.4 m deep, square 16 cm posts, a slim flat perimeter beam and motorised horizontal roof louvres partly open in a sand/beige powder-coat finish over a stone terrace beside a modern house, teak lounge sofa underneath, the pergola placed in the RIGHT half of the frame and the LEFT third kept calm (sky, wall, soft lawn) for headline text, louvre shadows striping the pavers. 16:9.

Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.
```

### `shadeline-poster-anthracite` · 1600 × 1200 · GPT 1536x1024 · focus centre

*Used in:* Configurator stage before 3D loads (Anthracite)

```text
Three-quarter view photograph of a free-standing louvred aluminium pergola about 4.2 m wide and 3.4 m deep, square 16 cm posts, a slim flat perimeter beam and motorised horizontal roof louvres partly open in a dark anthracite grey (RAL 7016) matte finish, centred on a light stone terrace against a pale rendered wall, teak sofa and coffee table underneath, soft afternoon light. Landscape 4:3, whole pergola in frame with margin.

Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.
```

### `shadeline-poster-sand` · 1600 × 1200 · GPT 1536x1024 · focus centre

*Used in:* Configurator stage before 3D loads (Sand)

```text
Same composition as the anthracite poster: three-quarter view of a free-standing louvred aluminium pergola about 4.2 m wide and 3.4 m deep, square 16 cm posts, a slim flat perimeter beam and motorised horizontal roof louvres partly open in a warm sand beige finish (RAL 1015), centred on a light stone terrace against a pale rendered wall, teak sofa underneath, soft afternoon light. Landscape 4:3, whole pergola in frame.

Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.
```

### `shadeline-poster-white` · 1600 × 1200 · GPT 1536x1024 · focus centre

*Used in:* Configurator stage before 3D loads (Signal white)

```text
Same composition as the anthracite poster: three-quarter view of a free-standing louvred aluminium pergola about 4.2 m wide and 3.4 m deep, square 16 cm posts, a slim flat perimeter beam and motorised horizontal roof louvres partly open in a clean signal-white finish (RAL 9016), centred on a light stone terrace against a warm grey rendered wall so the white frame stands out, teak sofa underneath, soft afternoon light. Landscape 4:3.

Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.
```

### `shadeline-top` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Engineering section + add-on product images

```text
Elevated three-quarter view from above of a free-standing louvred aluminium pergola about 4.2 m wide and 3.4 m deep, square 16 cm posts, a slim flat perimeter beam and motorised horizontal roof louvres partly open in anthracite, louvres open at about 45 degrees so the blade rhythm is clearly visible, striped sun shadows on the stone terrace below. Square.

Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.
```

### `shadeline-night` · 1600 × 1000 · GPT 1536x1024 · focus centre

*Used in:* Delivery section image

```text
Blue-hour photograph of a free-standing louvred aluminium pergola about 4.2 m wide and 3.4 m deep, square 16 cm posts, a slim flat perimeter beam and motorised horizontal roof louvres partly open in anthracite with warm LED strip lighting glowing along the inside of the beams, louvres closed, one dark fabric ZIP side screen lowered on the left, glowing windows of the house behind, cosy terrace with sofa. Landscape 16:10.

Architectural photography. Modern residential terrace, large-format stone pavers, rendered white or warm-grey walls, minimal planting, teak outdoor furniture. Crisp late-afternoon sun with louvre shadow stripes, true-to-life colours, eye-level or slightly elevated camera, no people, no visible text or logos.
```

## Northgate Supply (B2B packaging)

**Art direction (append to every prompt):** Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.

### `northgate-hero` · 1600 × 1200 · GPT 1536x1024 · focus centre

*Used in:* Hero image

```text
Catalog photograph of a wooden pallet stacked three layers high with plain brown corrugated kraft shipping boxes wrapped in clear stretch film, a single loose box and a roll of kraft tape on the floor beside it, three-quarter view, light warm-grey seamless studio background, soft shadows. Landscape 4:3.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-box-s` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Shipping box S

```text
Catalog photograph of one small closed kraft corrugated shipping box (300 × 200 × 150 mm) sealed with kraft tape, three-quarter view, light warm-grey seamless background, soft shadow. Square, product centred.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-box-m` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Shipping box M

```text
Catalog photograph of one medium closed kraft corrugated shipping box (400 × 300 × 250 mm) sealed with kraft tape, black "this side up" arrows on the side, three-quarter view, light warm-grey seamless background. Square, centred.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-box-l` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Shipping box L

```text
Catalog photograph of one large double-wall kraft corrugated shipping box (600 × 400 × 400 mm), sealed, three-quarter view, light warm-grey seamless background, soft shadow. Square, centred.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-tape` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Kraft packing tape

```text
Catalog photograph of three rolls of brown kraft paper packing tape, two lying flat and one standing on its edge, light warm-grey seamless background, soft shadows. Square, centred.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-film` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Hand stretch film

```text
Catalog photograph of one roll of clear hand stretch film on a brown cardboard core, lying diagonally, glossy translucent plastic with subtle reflections, light warm-grey seamless background. Square, centred.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-mailer` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Co-ex poly mailer

```text
Catalog photograph of a flat white co-extruded poly mailer bag with a peel-and-seal flap, small black "NORTHGATE" wordmark with an orange bar, lying slightly angled, light warm-grey seamless background. Square.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-gloves` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Nitrile gloves

```text
Catalog photograph of a white dispenser box of blue nitrile disposable gloves with one glove pulled halfway out of the top slot, a blue band along the bottom of the box, three-quarter view, light warm-grey seamless background. Square.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

### `northgate-paper` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Void-fill kraft paper

```text
Catalog photograph of a large roll of brown kraft void-fill paper lying on its side, with a loose crumpled sheet of the same paper beside it, light warm-grey seamless background, soft shadow. Square.

Clean industrial catalog photography. Light warm-grey seamless studio background (#e7e5df), soft even light with one key light from the upper left, crisp edges, realistic kraft and plastic materials. Packaging may carry a small black "NORTHGATE" wordmark with a short orange bar; no other text or real brands.
```

## Linkcore (IT hardware)

**Art direction (append to every prompt):** Premium tech product photography on a dark navy-to-charcoal studio sweep (#0a0e15). Dark anodised aluminium, precise edges, subtle electric-lime (#c6f432) and cyan rim lights, port details sharp and believable. No real brand logos; a small lowercase "linkcore" wordmark on the top surface is fine.

### `linkcore-hero` · 1600 × 1200 · GPT 1536x1024 · focus centre

*Used in:* Hero image

```text
Hero product photograph of a slim rectangular dark-grey anodised aluminium docking station (about 22 cm wide, 3 cm tall) lying on a dark studio surface, front ports visible (USB-C, two blue USB-A, SD card slot, audio jack) with a tiny lime status LED, a braided cable curving away, and a small USB-C hub partly in frame on the left, lime and cyan rim light from behind. Landscape 4:3.

Premium tech product photography on a dark navy-to-charcoal studio sweep (#0a0e15). Dark anodised aluminium, precise edges, subtle electric-lime (#c6f432) and cyan rim lights, port details sharp and believable. No real brand logos; a small lowercase "linkcore" wordmark on the top surface is fine.
```

### `linkcore-dock12` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Dock 12 (Thunderbolt 4)

```text
Product photograph of a slim rectangular dark-grey anodised aluminium docking station (22 cm wide), front three-quarter view with the front ports visible (USB-C, two USB-A, SD slot, audio jack), on a dark studio sweep with subtle lime rim light. Square, centred.

Premium tech product photography on a dark navy-to-charcoal studio sweep (#0a0e15). Dark anodised aluminium, precise edges, subtle electric-lime (#c6f432) and cyan rim lights, port details sharp and believable. No real brand logos; a small lowercase "linkcore" wordmark on the top surface is fine.
```

### `linkcore-dock8` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Dock 8 (USB-C)

```text
Product photograph of a smaller graphite-grey aluminium USB-C dock (16 cm wide), front three-quarter view showing one USB-C, one USB-A and an audio jack, on a dark studio sweep, cyan rim light. Square, centred.

Premium tech product photography on a dark navy-to-charcoal studio sweep (#0a0e15). Dark anodised aluminium, precise edges, subtle electric-lime (#c6f432) and cyan rim lights, port details sharp and believable. No real brand logos; a small lowercase "linkcore" wordmark on the top surface is fine.
```

### `linkcore-hub7` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: Hub 7

```text
Product photograph of a compact space-grey aluminium USB-C travel hub (11 cm long, very thin) with a short attached USB-C cable, side ports visible (two USB-A, HDMI, SD), on a dark studio sweep. Square, centred.

Premium tech product photography on a dark navy-to-charcoal studio sweep (#0a0e15). Dark anodised aluminium, precise edges, subtle electric-lime (#c6f432) and cyan rim lights, port details sharp and believable. No real brand logos; a small lowercase "linkcore" wordmark on the top surface is fine.
```

### `linkcore-dl2` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Product: DualLink DL

```text
Product photograph of a silver brushed-aluminium display dock (12 cm wide, rounded corners), front three-quarter view showing a USB-C, a USB-A and an audio jack, on a dark navy studio sweep with a subtle lime edge light. Square, centred.

Premium tech product photography on a dark navy-to-charcoal studio sweep (#0a0e15). Dark anodised aluminium, precise edges, subtle electric-lime (#c6f432) and cyan rim lights, port details sharp and believable. No real brand logos; a small lowercase "linkcore" wordmark on the top surface is fine.
```

## Aurel (fine jewellery)

**Art direction (append to every prompt):** High-end editorial jewellery photography. Ivory, bone and travertine tones, soft diffused daylight, gentle shadows, sharp metal reflections and sparkling diamond facets, generous negative space. No text, no logos.

### `aurel-hero` · 1600 × 2000 · GPT 1024x1536 · focus centre

*Used in:* Editorial hero (portrait, right half on desktop)

```text
Editorial still life of a solitaire engagement ring: a 2.4 mm comfort-fit domed band with a single round brilliant-cut diamond (about 0.30 ct) held low in a four-claw basket setting in 18k yellow gold, standing upright on a cylindrical travertine plinth, a second taller plinth softly out of focus behind, ivory background, soft daylight from the left, lots of calm negative space above. Portrait 4:5.

High-end editorial jewellery photography. Ivory, bone and travertine tones, soft diffused daylight, gentle shadows, sharp metal reflections and sparkling diamond facets, generous negative space. No text, no logos.
```

### `aurel-ring-yellow` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Buy box gallery: Yellow gold

```text
Clean product photograph of a solitaire engagement ring: a 2.4 mm comfort-fit domed band with a single round brilliant-cut diamond (about 0.30 ct) held low in a four-claw basket setting in 18k yellow gold, standing upright at a slight three-quarter angle on a seamless ivory background, soft reflection and shadow beneath, diamond sparkling. Square, centred, whole ring in frame with margin.

High-end editorial jewellery photography. Ivory, bone and travertine tones, soft diffused daylight, gentle shadows, sharp metal reflections and sparkling diamond facets, generous negative space. No text, no logos.
```

### `aurel-ring-white` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Buy box gallery: White gold

```text
Clean product photograph of a solitaire engagement ring: a 2.4 mm comfort-fit domed band with a single round brilliant-cut diamond (about 0.30 ct) held low in a four-claw basket setting in 18k white gold, same angle and lighting as the yellow-gold version, seamless ivory background, soft shadow. Square, centred.

High-end editorial jewellery photography. Ivory, bone and travertine tones, soft diffused daylight, gentle shadows, sharp metal reflections and sparkling diamond facets, generous negative space. No text, no logos.
```

### `aurel-ring-rose` · 1200 × 1200 · GPT 1024x1024 · focus centre

*Used in:* Buy box gallery: Rose gold

```text
Clean product photograph of a solitaire engagement ring: a 2.4 mm comfort-fit domed band with a single round brilliant-cut diamond (about 0.30 ct) held low in a four-claw basket setting in 18k rose gold, same angle and lighting as the yellow-gold version, seamless ivory background, soft shadow. Square, centred.

High-end editorial jewellery photography. Ivory, bone and travertine tones, soft diffused daylight, gentle shadows, sharp metal reflections and sparkling diamond facets, generous negative space. No text, no logos.
```

### `aurel-trio` · 1600 × 1000 · GPT 1536x1024 · focus centre

*Used in:* Editorial section: the three metals

```text
Editorial photograph of three identical solitaire rings in white gold, yellow gold and rose gold standing upright in a row on an ivory surface, soft daylight, delicate shadows, calm luxurious mood. Landscape 16:10, rings centred with space around.

High-end editorial jewellery photography. Ivory, bone and travertine tones, soft diffused daylight, gentle shadows, sharp metal reflections and sparkling diamond facets, generous negative space. No text, no logos.
```
