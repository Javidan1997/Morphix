# Atelier — build guide

A one-page product template built around the `Configurator3D` component. Aimed
at furniture, lighting, outdoor and DTC hardware brands: anyone selling one
considered product that benefits from being turned around in 3D.

Everything below is prescriptive on purpose — follow it top to bottom and the
page assembles in about two hours. Every value is a real value, not a
placeholder.

---

## 0. Before you start

- Framer project on any plan (you can build free, you need a paid plan to publish)
- `Configurator3D.tsx` pasted into **Assets → Code**
- One `.glb` under 2 MB with **named materials** (see the README)

Set the page background to `#F7F8FA` and the max content width to **1200**.

---

## 1. Styles — create these first

Doing this before you draw anything is what makes the template feel coherent,
and it is what lets a buyer re-skin it in five minutes.

### Colour styles

| Name | Value | Used for |
|---|---|---|
| `Ink` | `#14181D` | Headings, primary buttons |
| `Muted` | `#6B7480` | Body copy, captions |
| `Line` | `#E3E7EC` | Borders, dividers |
| `Surface` | `#FFFFFF` | Cards |
| `Canvas` | `#F7F8FA` | Page background |
| `Stage` | `#ECEEF1` | Configurator background |
| `Accent` | `#14181D` | Active states (swap this to re-brand) |

### Text styles

Typeface **Inter** throughout. Set `letter-spacing` negative on the big sizes —
it is most of what separates a premium-looking template from a default one.

| Name | Size / Line | Weight | Tracking |
|---|---|---|---|
| `Display` | 72 / 1.02 | 700 | −3% |
| `H2` | 40 / 1.1 | 700 | −2.5% |
| `H3` | 20 / 1.3 | 600 | −1.5% |
| `Body L` | 18 / 1.6 | 400 | −0.5% |
| `Body` | 16 / 1.65 | 400 | 0 |
| `Caption` | 13 / 1.5 | 500 | 2% (uppercase) |

Mobile: `Display` 40, `H2` 30, `Body L` 16.

### Spacing

Section padding **120px** desktop / **64px** mobile. Gaps on an 8-point scale
(8 / 16 / 24 / 40 / 64). Radius **16** on cards and the configurator frame.

---

## 2. Sections

### Nav — sticky, 72px tall

Left: wordmark (`H3`). Right: three links (`Body`, Muted) + one filled button
(`Ink` background, white text, radius 999, 12×24 padding).

Set the nav to **Sticky → Top**, background `Canvas` at 80% opacity, and add a
backdrop blur of 12.

### Hero — the section that sells the template

Two columns on desktop, **7 : 5**, gap 64, vertically centred. Stack on mobile
with the configurator **first**.

**Left column**
- `Caption` in Muted — "MADE TO ORDER"
- `Display` — "Built to your measure."
- `Body L` in Muted, max-width 46ch — "Turn it, change the finish, see it from
  every angle before you commit. Every piece is made to order in our workshop
  and shipped within four weeks."
- Row, gap 12: primary button "Configure yours" + text button "See specification"
- `Caption` in Muted — "From $480 · Free delivery · 10-year frame warranty"

**Right column** — a frame at **aspect ratio 1:1**, radius 16, then drop
`Configurator3D` inside set to fill. Properties:

```
Model            your .glb
Transparent      on
Lighting         Neutral
Exposure         1.05
Shadow           on
Auto-rotate      on, Speed 0.8
Zoom             1
Camera height    0.85
Visitor zoom     off      ← stops the page fighting scroll on mobile
Show swatches    on, Bottom
Colour options   4 swatches, all targeting your fabric material
```

> **This is the one setting people get wrong:** the parent frame must have a
> real height. Use an aspect ratio or a fixed height, never "fit content" —
> a zero-height container renders nothing and looks broken.

### Trust strip

Full-width, 1px `Line` top and bottom, 24px padding. Five logos or five
`Caption` items in a row, Muted, space-between. On mobile show three.

### Feature triptych

`H2` centred — "Considered down to the joint." Three columns, gap 40, each:
icon (24px, Ink) → `H3` → `Body` in Muted.

1. **Solid oak frame** — "Kiln-dried, mortise-and-tenon jointed, and finished by hand. No veneer, no particle board."
2. **Choose your textile** — "Twelve upholstery options from our Belgian mill, all rated for 40,000 rub cycles."
3. **Made to order** — "Built after you order, so nothing sits in a warehouse and nothing goes to landfill."

### Detail — second configurator

Reversed columns, **5 : 7**. Configurator on the **left** this time, with
different framing so it reads as a different shot:

```
Background       Stage (not transparent)
Zoom             1.45
Camera height    0.45
Auto-rotate      off
Show swatches    off
Visitor zoom     on
```

Right column: `H2` "Every angle, before you buy." then a definition list —
four rows of `Caption` label + `Body` value, separated by 1px `Line`.

> Only one configurator is visible per viewport here, which is deliberate.
> Each instance is a WebGL context and browsers cap how many can exist at once.

### Specification table

`H2` — "Specification." Two columns of rows, each row `Caption` label +
`Body` value with a 1px `Line` below:

Dimensions `W 72 × D 80 × H 96 cm` · Seat height `42 cm` · Frame `Solid European oak` ·
Upholstery `Wool blend, 40,000 Martindale` · Weight `18 kg` · Assembly `None required` ·
Lead time `4 weeks` · Warranty `10 years`

### Testimonial

Centred, max-width 720. `H3` at 28px — "It arrived looking exactly like the
configurator. That never happens." Then `Caption` in Muted — "Marta L. ·
Verified buyer".

### FAQ

Two columns, **1 : 1.5**. Left: `H2` "Questions." Right: five accordions
(Framer's native accordion component), 1px `Line` between, 20px padding.

Can I see a fabric sample? · How long does delivery take? · What if it does not
fit? · Is it assembled? · Do you ship internationally?

### Closing CTA

Full-width, `Ink` background, white text, 120px padding, radius 24, centred.
`H2` "Start with the finish you like." Body in white at 70%. One white button
with Ink text.

### Footer

1px `Line` top, 48px padding. Wordmark left, three link columns right, legal
row beneath in `Caption` Muted.

---

## 3. Responsive

Framer breakpoints: Desktop 1200 / Tablet 810 / Phone 390.

- Every two-column section stacks; the configurator goes **first** in the hero
  and **last** in the detail section
- Configurator frames become aspect ratio **4:5** on phone — taller reads better
  than wide on a portrait screen
- Section padding 120 → 64
- Turn **Visitor zoom off** on phone for every instance, otherwise pinch-zoom
  fights page scroll
- Trust strip: 5 items → 3

## 4. Before you publish

- Test on a real phone, not just the Framer preview — WebGL behaves differently
- Check the page with the model **not yet loaded**; the loading state should not
  jump the layout (the aspect-ratio frame prevents this)
- Run Framer's own performance check; the 3D is lazy so the rest of the page
  should still score well
- Add a page description and an OG image — a screenshot of the hero works

---

## 5. Marketplace listing

Framer publishes templates immediately, with no review, so the listing is the
only thing standing between you and sales. Make it specific.

**Name** — Atelier
**Byline** — "One-page product template with a real 3D configurator"

**Description**

> Atelier is a one-page template for brands selling one considered product.
> It ships with a real-time 3D configurator — upload a .glb, add colour
> swatches, and visitors can turn the product and change its finish right in
> the hero. No plugin, no subscription, no external service.
>
> Built with styles throughout, so you can re-skin it by changing seven colours
> and one typeface. Fully responsive, with the 3D tuned for mobile.

**Categories** — Ecommerce, Portfolio, Landing Page
**Styles** — Minimal, Editorial

**Features** — 3D product configurator · Colour swatches · Responsive ·
Text and colour styles · CMS-ready spec table · Accessible accordions

**Screenshots** — five, in this order: hero with the configurator mid-rotation;
a swatch changing the finish; the detail section; the spec table; mobile.

The first screenshot decides whether anyone clicks. Capture the configurator
at a three-quarter angle with a shadow, not head-on.

---

## 6. Pricing

Framer templates cluster at **$79–$199**, with premium ones at $99+. You have
a genuine differentiator almost nobody else has, but no reviews yet.

Launch at **$49**. That is meaningfully under the field without reading as
low-quality, and because Framer takes **0%**, $49 is $49 in your pocket — the
same money as a $115 sale on a 50/50 marketplace.

Raise to $79 once you have ten sales and a few reviews.

Two things that compound from day one: every template also earns you **50% of
any Framer subscription it refers for 12 months**, and a free "lite" version
with one section and the configurator is the cheapest way to get the reviews
that make the paid one rank.
