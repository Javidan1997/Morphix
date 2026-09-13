# Configurator 3D — Framer code component

A real-time 3D product viewer with colour swatches, for Framer. Upload a `.glb`,
add swatches in the properties panel, done. No code, no external service, no
subscription.

This is the component that makes the template worth buying. The surrounding
page — hero, sections, typography — is assembled in Framer itself (see
"Building the template" below).

---

## Installing it in Framer

1. In your Framer project, open the **Assets** panel → **Code** → **New code file**
2. Name it `Configurator3D`
3. Paste the contents of `Configurator3D.tsx` and save
4. Drag the component onto the canvas from Assets → Code

Framer resolves the `three` import automatically the first time it compiles.

## Using it

Select the component and set, in the properties panel:

| Control | What it does |
|---|---|
| **Model** | Upload your `.glb`. Keep it under 2 MB |
| **Background / Transparent** | Solid colour, or transparent to sit on your page background |
| **Lighting** | Soft / Neutral / Bright studio environment |
| **Exposure** | Overall brightness |
| **Shadow** | Contact shadow on the floor |
| **Auto-rotate / Speed** | Idle rotation; pauses while a visitor is dragging |
| **Zoom / Camera height** | Framing |
| **Visitor zoom** | Let visitors scroll-zoom, or lock it |
| **Colour options** | The swatch list — label, colour, and what it applies to |
| **Accent** | Active swatch ring and loading bar |

### Targeting parts with "Applies to"

Leave it **empty** and the swatch recolours the whole model — right for a
single-material product.

To recolour one part, enter the **material or node name** from your `.glb`:

```
Upholstery
```

Several at once, comma separated:

```
Seat, Backrest, Cushion
```

Open your model in [gltf-viewer.donmccurdy.com](https://gltf-viewer.donmccurdy.com)
to read the exact names. They are case-sensitive.

This is what lets one swatch row change the fabric while another changes the
frame — give them different targets.

---

## Preparing your model

Model quality decides how good this looks and how fast it loads. Aim for
**under 2 MB**.

```bash
npx gltf-transform optimize in.glb out.glb --compress draco --texture-compress webp
```

Draco-compressed files work out of the box — the component loads the decoder
from Google's CDN.

Before exporting from Blender:

- **Name your materials and objects.** They are what "Applies to" matches
- Apply transforms, and centre the model near the origin
- Keep textures at 1–2K
- Split anything you want to recolour separately into its own material

The component auto-centres and auto-frames whatever you give it, so scale
doesn't matter.

---

## Building the template around it

The component is one element. A template that sells is a full page. A structure
that works for product pages:

1. **Hero** — the configurator at ~70vh, transparent background, swatches on,
   headline and price beside it on desktop and stacked on mobile
2. **Detail strip** — three columns of material/feature copy
3. **Second configurator** — same model, different camera height and zoom, to
   show a detail
4. **Specification table**
5. **CTA** — enquiry form or buy button

Two practical notes:

- Put the configurator in a frame with a **fixed height** (or aspect ratio).
  It fills its container, and a zero-height container renders nothing
- Use **one** configurator per viewport. Each one is a WebGL context, and
  browsers cap how many can exist at once

### Performance

The render loop sleeps whenever nothing is moving, so an idle configurator
costs no frames. On the Framer canvas auto-rotate is disabled automatically so
it doesn't spin while you design. `prefers-reduced-motion` is respected on the
published site.

---

## Troubleshooting

**Nothing renders** — the parent frame has no height. Give it a fixed height or
an aspect ratio.

**"Could not load that model"** — re-upload the `.glb`. If it is Draco
compressed by a tool other than gltf-transform, try re-exporting uncompressed.

**A swatch changes the wrong parts** — the material is shared across meshes in
the source file. Split it in Blender, or target a node name instead.

**Model looks flat or black** — it has no materials assigned, or all-black ones.
Assign a basic PBR material before exporting.

**It loads slowly** — the `.glb` is too big. Run the gltf-transform command
above; 10 MB → under 1 MB is normal.

---

## Licence

One licence per end product. Use it in client work and commercial projects, and
modify it freely. Don't resell or redistribute the component itself, on its own
or inside a competing template.
