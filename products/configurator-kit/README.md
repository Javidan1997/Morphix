# 3D Product Configurator Kit

A schema-driven 3D product configurator for the web. Bring a `.glb`, describe your
options in one config file, and you have a working configurator — real-time 3D,
generated controls, live pricing, and a payload ready for your cart.

Built on Three.js and React. No subscription, no external service, no vendor
account. You own the code.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:5180
```

You should see the demo chair. Every control in the panel comes from
`examples/chair.config.js` — nothing about that product is hard-coded.

```bash
npm run build        # production bundle
npm run demo:model   # regenerate the demo .glb
```

---

## Your first configurator in four steps

### 1. Point at your model

```js
export default {
  name: 'My Product',
  model: '/models/my-product.glb',
};
```

### 2. Find your part and material names

Open your `.glb` in [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com)
and look at the scene tree. The **node names** and **material names** are the
selectors you use below. Name things deliberately in Blender before exporting —
`Legs`, `Seat`, `Frame` — and the rest of this is easy.

### 3. Add options

```js
options: [
  {
    id: 'finish',
    type: 'swatch',
    label: 'Finish',
    effect: { type: 'materialColor', materials: 'Frame' },
    choices: [
      { id: 'black', label: 'Black', color: '#2d3239' },
      { id: 'brass', label: 'Brass', color: '#b08d57', price: 85 },
    ],
  },
]
```

### 4. Drop in the component

```jsx
import Configurator from './src/ui/Configurator.jsx';
import config from './my-product.config.js';

<Configurator
  config={config}
  onChange={(state, price) => console.log(state, price)}
/>
```

That's the whole integration.

---

## Option types

| Type | Control | Value |
|---|---|---|
| `swatch` | Colour circles | The chosen `choice.id` |
| `select` | Segmented buttons | The chosen `choice.id` |
| `toggle` | Switch | `true` / `false` |
| `range` | Slider | A number |

Common fields: `id`, `label`, `help`, `price`, `value` (the default).
`range` also takes `min`, `max`, `step`, `unit`.

## Effects

An effect is what an option *does* to the model. Put it on the option, or on an
individual choice when different selections should drive different parts.

### `materialColor`

```js
effect: { type: 'materialColor', materials: 'Upholstery' }
effect: { type: 'materialColor', nodes: ['Seat', 'Back'], metalness: 0.8 }
```

Selects by material name, by node name, or — with neither — everything.
The colour comes from the chosen swatch, or from `effect.color`.

### `visibility`

```js
// toggle: show/hide one group ( `invert: true` flips it )
effect: { type: 'visibility', nodes: 'Armrests' }

// select: show only the group matching the chosen id
effect: { type: 'visibility', nodesFor: { high: 'Backrest_High', low: 'Backrest_Low' } }
```

### `transform`

```js
effect: {
  type: 'transform',
  nodes: 'Legs',
  property: 'scale',      // 'scale' | 'position' | 'rotation'
  axis: 'y',              // 'x' | 'y' | 'z'
  from: 0.9, to: 1.25,    // the range option's min/max maps onto this
}
```

`rotation` is in degrees. Transforms are relative to the model's authored
values, so they compose cleanly and never drift.

### `custom`

```js
effect: {
  type: 'custom',
  apply: (model, { value, option, choice }) => { /* anything */ },
}
```

### Selectors

Every `nodes` / `materials` field accepts a string, an array, or a regular
expression:

```js
nodes: 'Legs'
nodes: ['Leg_FL', 'Leg_FR']
nodes: /^Leg_/
```

---

## Camera views

```js
views: {
  front:  { position: [0, 0.75, 2.4], target: [0, 0.5, 0] },
  detail: { position: [0.9, 0.95, 1.1], target: [0, 0.6, 0] },
}
```

Rendered as buttons over the stage. Moves are eased, not snapped.

## Pricing

```js
price: { base: 480, currency: 'USD' }
```

Then `price` on any option or choice adds to it. On a `range`, the price is
multiplied by the value. `onChange` hands you the running total; there is no
pricing logic to write.

---

## The JavaScript API

`<Configurator>` covers most cases, but the engine is standalone and
framework-agnostic:

```js
import { createConfigurator } from './src/core/engine.js';

const cfg = await createConfigurator({ container, config, onProgress, onChange });

cfg.set('finish', 'brass');   // change an option
cfg.getState();               // { finish: 'brass', ... }
cfg.price();                  // 745
cfg.summary();                // [{ id, label, value, display }, ...] for an order
cfg.setView('detail');        // eased camera move
cfg.setAutoRotate(false);
await cfg.snapshot('design.png');  // downloads; returns the Blob
cfg.dispose();                // always call this on unmount
```

`summary()` is the one to send to your cart — it is already human-readable.

---

## Sending a configuration to a cart

```jsx
<Configurator config={config} onChange={(state, price) => setOrder({ state, price })} />
```

**Shopify** — put `cfg.summary()` into line item properties:

```js
const properties = Object.fromEntries(cfg.summary().map(i => [i.label, i.display]));
await fetch('/cart/add.js', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items: [{ id: variantId, quantity: 1, properties }] }),
});
```

**WooCommerce / custom** — post `getState()` and `price()` to your endpoint and
price it again server-side. Never trust a browser price.

---

## Preparing models

Performance is almost entirely down to your `.glb`. Aim for **under 2 MB**.

```bash
npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp
```

Then point the config at a decoder:

```js
dracoPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
```

Checklist:

- Name your nodes and materials before exporting — they are your selectors
- Apply transforms and centre the model near the origin
- Keep textures at 1–2K; 4K is wasted on a product view
- Separate anything you need to show, hide or recolour into its own node

The engine centres the model on the floor and frames the camera automatically,
so you do not need to match any particular scale.

---

## Browser support

Any browser with WebGL 2 — Chrome, Edge, Firefox, Safari 15+, iOS and Android.
The render loop sleeps when nothing is moving, so an idle configurator costs no
frames and no battery. `prefers-reduced-motion` disables auto-rotate and camera
easing automatically.

---

## Project layout

```
src/core/engine.js     Three.js engine — scene, loading, camera, render loop
src/core/schema.js     Config validation, defaults, pricing
src/core/effects.js    Option → model changes
src/ui/Configurator.jsx  React component
src/ui/Controls.jsx      Controls generated from the option list
src/ui/configurator.css  Styles (all tokenised at the top)
examples/              Example configs
tools/                 Demo model generator
```

## Theming

Override the tokens on `.cfg` — you should not need to touch any other rule:

```css
.cfg {
  --cfg-accent: #0071e3;
  --cfg-radius: 16px;
  --cfg-font: 'Your Font', sans-serif;
}
```

---

## Troubleshooting

**Model doesn't appear** — check the browser console for a 404, and that the
path is relative to `public/`.

**An option does nothing** — your `nodes` / `materials` selector doesn't match.
Open the model in the glTF viewer and check the exact names; they are
case-sensitive.

**Colour changes affect the wrong parts** — the material is shared across those
meshes in the source file. Split it in Blender, or target `nodes` instead.

**Everything is black** — the model has no materials, or an `.hdr` failed to
load. Try `environment: 'studio'`.

**Model is tiny or enormous** — it is auto-framed, so this is usually a
mis-scaled export. It will still work; set `camera.distance` to override.

---

## Licence

One licence per end product. You may use it in client work and in commercial
projects, and modify it freely. You may not resell or redistribute the kit
itself, as a kit or as part of a competing template or boilerplate.

The demo chair is generated by `tools/make-demo-model.mjs` and is yours to use
or delete — there is nothing third-party to attribute.
