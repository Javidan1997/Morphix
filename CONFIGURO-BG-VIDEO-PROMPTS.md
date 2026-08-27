# Configuro — AI background video: services + prompts

Replaces the `bg-render/` node-graph clips (`automation-indigo.mp4`, `automation-slate.mp4`)
with a **creative-process** film: sketch → model → build → launch.

---

## 0. Hard constraints from the site (read first)

The background is not a normal hero loop. `src/components/VideoBackground.jsx` **scrubs
`video.currentTime` from scroll progress** — the clip is a timeline the user drags by reading.
That dictates everything:

| Constraint | Value | Why |
|---|---|---|
| Motion type | **One continuous progression**, no cuts, no loop-back | Scroll maps 0→1 onto 0→duration. A cut = a jump-scare mid-scroll. |
| Duration | 10–14 s (current clips are 12 s / 360 frames @ 30 fps) | Long enough that a full page scroll feels slow and cinematic. |
| Resolution | 1920×1080, 16:9 | `object-fit: cover` over full viewport. |
| Encoding | **All-intra** (`-g 1 -bf 0`) | Every frame a keyframe, so a scrub seek decodes exactly 1 frame. Normal AI-tool output stutters badly here. |
| Base colour | `#06070a` near-black | `.cinematic-bg` background and `body` are this. Anything brighter shows a seam. |
| Accent | indigo `#7d95ff` / `#a5b6ff`, or slate `#93a9cc` / `#bccbe2` | Existing palettes in `bg-render/main.js:7-22`. |
| Contrast | Low–mid, dark | CSS already adds `brightness(1.04) contrast(1.08) saturate(1.08)` + a vignette. Bright footage becomes unreadable behind white text. |
| Composition | Detail in outer thirds, **calm negative space through the middle band** | Headline and body copy sit there. |
| Text in frame | **None** | AI video renders text as garbled glyphs. Also: no fake logos, no fake brand names. |
| Camera | Slow dolly / macro drift only | Fast camera + scroll-scrub = motion sickness. |

---

## 1. Free services worth trying

Free tiers change constantly — treat credit amounts as "check the site", not gospel.

**Best quality on a free tier**
- **Google Veo (via the Gemini app / Google AI Studio / Flow)** — best prompt adherence of the free options, and the one that actually *respects structured JSON prompts*. Limited free generations per day. Use it for the hero clip.
- **Kling AI** — free daily credit refresh, strong on macro/物理 realism, and has **start-frame + end-frame** control, which is how you chain clips into one 12 s continuous take.
- **Hailuo / MiniMax** — generous free daily credits, very good camera-motion control.

**Also free, good for variations**
- **Luma Dream Machine** — free monthly generations; excellent smooth dolly moves, has keyframe-to-keyframe.
- **Pika** — free tier, stylised looks.
- **Vidu** — free daily credits, fast.
- **Krea** — free daily credits, aggregates several video models in one UI.
- **Runway** — one-time free credit grant (not refreshing), so save it for a final pick.

**Free and unlimited if you have a GPU (or use a Hugging Face Space)**
- **Wan 2.x**, **LTX-Video**, **HunyuanVideo** — open weights. Run in ComfyUI locally or on a free HF Space. Slower, but no credit ceiling and no watermark. Best option once you know exactly which prompt you want and need 20 takes of it.

**Watermarks:** most free tiers stamp one. It usually lands bottom-right — survivable here because `object-fit: cover` crops and the bottom vignette is `rgba(6,7,10,0.58)`, but check before committing. Crop-and-rescale is in §4.

**Already wired up:** you have the **Higgsfield** MCP connected in this session (`generate_video`). It's credit-based, not free, but I can drive it directly from here if you want a take without leaving the editor.

---

## 2. Prompt A — "One Studio, One Take" (recommended hero, indigo)

**The concept:** a single unbroken documentary tracking shot gliding through a dark working
studio at night, passing four stations in sequence — a designer sketching, a 3D artist shaping
a model, a developer writing code, and a strategist watching an automation pipeline come alive.
Real people, real hands, real screens. The whole Configuro history in one move: *Design → Build
→ Automate.*

### The face problem (read before generating)

Human faces are where AI video visibly breaks — they morph, drift, and gain features between
frames. The prompt below is engineered around that: people appear as **hands, backs, shoulders,
profiles turned away, and out-of-focus silhouettes lit from behind by their monitors**. That
reads as *more* documentary-real, not less — it's exactly how making-of films are shot. Keep
`no front-facing faces` in the negative even though people are present.

Same for screens: AI cannot render legible UI or code. The prompt asks for screen content that
is **deliberately out of focus and abstract** — glowing wireframes, colour blocks, flowing line
patterns — which is also what you want behind a headline anyway.

```json
{
  "concept": "One unbroken documentary tracking shot through a dark design-and-engineering studio at night, passing four working stations in sequence — sketching, 3D modelling, coding, and an automation pipeline going live. The complete creative process shown as real people at real work.",
  "duration_seconds": 10,
  "aspect_ratio": "16:9",
  "resolution": "1920x1080",
  "frame_rate": 30,
  "camera": {
    "type": "35mm anamorphic, T2.0, shallow depth of field, cinema camera on a slider",
    "movement": "one continuous slow lateral tracking dolly moving right, constant speed, gliding past each station without stopping; a gentle rack focus hands off from each station to the next",
    "height": "seated eye level, slightly behind the subjects, over-the-shoulder framing",
    "stability": "smooth dolly, no handheld shake, no whip pans, no zoom"
  },
  "sequence": [
    {
      "time": "0.0-2.5s",
      "beat": "DESIGN",
      "action": "Open close on a designer's hands at a dark desk — one hand steadying a sheet of matte paper, the other drawing confident pencil strokes of a product silhouette. Real skin texture, a rolled sleeve, a wristwatch. Material swatches and a cold cup of coffee sit half out of focus. A single warm desk lamp rakes across the paper; everything beyond it falls into near-black. The camera begins gliding right."
    },
    {
      "time": "2.5-5.0s",
      "beat": "3D MODELLING",
      "action": "The camera arrives over the shoulder of a 3D artist facing a large monitor, seen from behind — back of the head and shoulder in silhouette, face never visible. On screen, softly out of focus, a glowing indigo wireframe product model slowly rotates and gains translucent surfaces. Their hand rests on a 3D mouse, thumb nudging it; the model turns in response. Indigo monitor light rims their shoulder and the edge of the desk."
    },
    {
      "time": "5.0-7.5s",
      "beat": "DEVELOPMENT",
      "action": "The camera continues right to a developer's workstation. Hands in sharp focus on a mechanical keyboard, fingers moving in a natural typing rhythm — real knuckles, real tendons, one hand leaving to move a mouse. Two monitors behind them glow with abstract columns of indistinct luminous code, heavily defocused into indigo and pale bokeh bands. Their forearm and the reflection on the desk surface catch the screen light."
    },
    {
      "time": "7.5-10.0s",
      "beat": "AUTOMATION",
      "action": "The camera settles on a wide dark wall display where a network of glowing indigo nodes and connecting lines lights up in sequence, pulses travelling along the links as the system comes online. A figure stands a few steps back in full silhouette, arms folded, watching — only their outline is readable against the glow. Motion slows almost to stillness as the last connections illuminate."
    }
  ],
  "human_direction": {
    "presence": "people are essential — hands, forearms, shoulders, backs of heads, silhouettes",
    "framing_rule": "never show a front-facing human face; subjects are turned away, in profile edge, or backlit into silhouette",
    "performance": "calm, absorbed, unhurried, natural micro-movements — no acting to camera, no gestures at the lens",
    "wardrobe": "muted dark neutrals — charcoal knit, dark denim, plain grey tee; no patterns, no visible branding",
    "skin_and_hands": "anatomically correct hands, five fingers, natural skin texture and pores, realistic tendon and knuckle movement"
  },
  "screen_content": {
    "rule": "all screens are defocused and abstract — no legible text, no readable code, no recognisable software UI",
    "appearance": "glowing indigo wireframe geometry, soft columns of luminous lines, node graphs, colour blocks bleeding into bokeh"
  },
  "lighting": {
    "key": "practical sources only — monitor glow and one warm desk lamp, motivated and visible in frame",
    "accent": "indigo #7d95ff screen light spilling across faces-turned-away, shoulders, desks and walls",
    "ambient": "near-black studio, deep unlit background, no fill light, pools of light separated by darkness",
    "mood": "quiet, focused, premium, a serious studio still working at 2am"
  },
  "color_palette": {
    "background": "#06070a near-black with a cool blue-black falloff",
    "primary_accent": "#7d95ff indigo screen light",
    "secondary_accent": "#a5b6ff pale periwinkle",
    "warm_counterpoint": "a single low-intensity amber desk lamp, used only at the first station",
    "highlight": "#d6ddff cool white, sparingly on rim lights",
    "saturation": "desaturated overall, colour carried almost entirely by the indigo practicals"
  },
  "composition": {
    "detail_placement": "subjects and screens occupy the lower and outer thirds of frame",
    "negative_space": "the upper-central band stays dark, empty and low-contrast so overlaid headline text remains legible",
    "depth": "strong foreground and background bokeh, layered depth, deep black falloff behind every station"
  },
  "style": {
    "reference": "high-end making-of documentary, Apple design-team film, Netflix 'Abstract: The Art of Design', cinematic behind-the-scenes studio footage",
    "realism": "photoreal live-action cinematography, not CGI, not illustration, not animation",
    "texture": "fine 35mm film grain, subtle anamorphic falloff, natural motion blur, no lens flare, no chromatic aberration"
  },
  "motion_rules": [
    "one continuous take, no cuts, no transitions, no fades to black",
    "constant slow dolly speed throughout — nothing accelerates, snaps or whips",
    "the camera only ever travels forward/right, it never returns to a previous station",
    "human movement is subtle and continuous, never looping or resetting"
  ],
  "audio": "none — silent clip",
  "negative_prompt": "front-facing faces, close-up faces, morphing or drifting facial features, distorted eyes, extra fingers, six fingers, deformed or melting hands, warped limbs, floating disconnected body parts, legible text, letters, words, numbers, readable code, recognisable software UI, logos, brand names, watermark, people looking at camera, posed smiling stock-footage acting, fast camera movement, whip pan, zoom punch, cuts, scene changes, flashing, strobing, high contrast, bright white background, overlit office, fluorescent daylight, warm orange grade, neon cyberpunk, teal-and-orange, lens flare, floating particles, confetti, cluttered centre of frame, jitter, stutter"
}
```

**Flattened text version** (for tools that only take a paragraph — Kling, Hailuo, Vidu, Pika):

> Photoreal cinematic documentary footage, one continuous 10-second tracking shot gliding slowly
> to the right through a dark design studio at night, 35mm anamorphic, shallow depth of field.
> It passes four working stations without stopping: a designer's hands sketching a product on
> paper under a single warm desk lamp; a 3D artist seen from behind, over the shoulder,
> silhouetted against a large monitor where a glowing indigo wireframe model slowly rotates; a
> developer's hands typing on a mechanical keyboard with heavily defocused luminous indigo code
> glowing behind them; and finally a wide wall display where a network of indigo nodes and
> connecting lines lights up in sequence while a person watches in full silhouette, arms folded.
> Near-black #06070a environment, indigo #7d95ff monitor light as the only real colour,
> desaturated, deep shadows, practical lighting only, fine film grain, natural motion blur. No
> faces visible — people are shown as hands, shoulders, backs and silhouettes. Screens are out of
> focus and abstract with no readable text. The upper centre of frame stays dark and empty. One
> unbroken take, constant slow speed, no cuts.
>
> Negative: front-facing faces, morphing faces, deformed hands, extra fingers, legible text, readable code, logos, watermark, looking at camera, posed stock-footage acting, fast camera moves, cuts, flashing, bright overlit office, daylight, warm orange grade, teal and orange, lens flare, clutter in the centre, jitter.

### Realism boosters that actually move the needle

Add these if a take comes out looking CGI or stocky:

- `shot on ARRI Alexa, Cooke anamorphic lenses` — pushes the model toward live-action footage.
- `practical lighting only, motivated light sources visible in frame` — kills the flat CGI look.
- `natural skin texture, visible pores, subtle imperfections` — the single biggest realism lever.
- `candid, unposed, subject unaware of camera` — kills the stock-footage smile.
- `slight lens breathing, natural handheld micro-movement on a dolly` — a *little* imperfection
  reads as real. Don't ask for full handheld; it fights the scroll-scrub.
- Add real props to the description — a coffee cup, cable clutter, a sticky note, a worn desk
  edge. Sterile sets are the tell that something is generated.

---

## 3. Prompt B — "Blueprint to Build" (slate variant, for /work, /pricing, /templates)

Calmer, more architectural — pairs with the slate palette so the two routes still feel distinct.

```json
{
  "concept": "An overhead continuous drift across a dark drafting surface where technical blueprint linework assembles itself, gains depth, and becomes a built structure — design becoming reality.",
  "duration_seconds": 12,
  "aspect_ratio": "16:9",
  "resolution": "1920x1080",
  "frame_rate": 30,
  "camera": {
    "type": "top-down orthographic-feeling wide, 35mm",
    "movement": "extremely slow continuous push-in combined with a slight drift right",
    "stability": "perfectly locked, no shake"
  },
  "sequence": [
    { "time": "0-3s", "action": "Faint pale-slate blueprint lines draw themselves onto a near-black surface — grid, axes, dimension arrows, a floor plan taking shape stroke by stroke." },
    { "time": "3-6s", "action": "The plan gains a third dimension: thin vertical lines rise from the footprint, forming a transparent wireframe structure. Fine measurement ticks fade in and out." },
    { "time": "6-9s", "action": "Translucent panels fill between the wireframe edges — frosted glass surfaces catching a cool slate highlight. Soft shadows appear on the surface below." },
    { "time": "9-12s", "action": "The structure settles into a quiet finished form, softly lit, with faint reflections. A few thin slate lines trail off into the dark edges of frame. Motion nearly stops." }
  ],
  "lighting": {
    "key": "cool diffuse overhead light, very soft",
    "accent": "pale slate blue #93a9cc emissive linework",
    "ambient": "near-black with a faint blue-grey gradient",
    "mood": "calm, precise, architectural, restrained"
  },
  "color_palette": {
    "background": "#06070a",
    "primary_accent": "#93a9cc slate blue",
    "secondary_accent": "#bccbe2 pale steel",
    "highlight": "#e8eef7 near-white, minimal use",
    "saturation": "very low, almost monochrome"
  },
  "composition": {
    "negative_space": "large dark quiet area through the centre and upper-middle for headline text",
    "detail_placement": "structure occupies the lower two-thirds, weighted right"
  },
  "style": {
    "reference": "architectural competition film, technical drawing come to life, Norman Foster studio reel",
    "texture": "clean vector-crisp lines over photoreal surface, subtle film grain"
  },
  "motion_rules": [
    "single unbroken take",
    "constant glacial speed, always progressing forward",
    "no loop, no reset, no cuts"
  ],
  "audio": "none",
  "negative_prompt": "text, numerals, labels, logos, watermark, people, hands, fast motion, cuts, flashing, strobe, bright white, warm tones, neon, heavy clutter, distorted or melting geometry, jitter, camera shake"
}
```

---

## 4. Getting the output into the site

AI tools give you 5–10 s clips at whatever encoding they like. Two things to fix.

### 4a. Chain short clips into one 12 s take

Free tiers cap at 5–10 s. To reach 12 s without a visible cut, use **end-frame / keyframe
control** (Kling, Luma, Runway all have it):

1. Generate clip 1 from Prompt A with only the **DESIGN** and **3D MODELLING** beats in `sequence`.
2. Export the **last frame** of clip 1 as a PNG.
3. Generate clip 2 with that PNG as the **start frame**, and only the **DEVELOPMENT** and
   **AUTOMATION** beats in `sequence`.
4. Repeat if you need a third — one beat per clip gives the cleanest human motion, at the cost
   of more joins to hide.

Because each beat is a different station, the joins fall where the camera is mid-glide past a
dark gap between desks — the easiest place in the whole shot to hide a seam. Aim your splits
there deliberately.

Then concat:

```bash
# clips.txt:  file 'clip1.mp4'  /  file 'clip2.mp4'
ffmpeg -f concat -safe 0 -i clips.txt -c copy joined.mp4
```

### 4b. Re-encode all-intra (mandatory — otherwise scroll-scrub stutters)

Same flags `scripts/capture-bg.mjs` uses for the current clips:

```bash
ffmpeg -y -i joined.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" \
  -c:v libx264 -preset slow -crf 22 \
  -g 1 -bf 0 -tune fastdecode \
  -pix_fmt yuv420p -movflags +faststart \
  src/assets/process-indigo.mp4
```

To crop out a corner watermark, zoom slightly before cropping:

```bash
-vf "scale=2112:1188,crop=1920:1080:96:54,fps=30"
```

Expect ~8–20 MB per clip at CRF 22 all-intra. If it's over ~25 MB, raise CRF to 26 — the
vignette and dark palette hide the artefacts.

### 4c. Wire it up

`src/components/VideoBackground.jsx:3-20` — swap the imports and the `ROUTE_VIDEO` map:

```js
import processIndigo from "../assets/process-indigo.mp4";
import processSlate from "../assets/process-slate.mp4";
```

Nothing else changes; the scrub logic is source-agnostic.

---

## 5. Prompting tips specific to these tools

- **Veo** takes the JSON almost literally — paste it whole.
- **Kling / Hailuo / Vidu / Pika** want prose. Use the flattened paragraph, and put the negative
  list in the dedicated negative field if there is one rather than in the prompt body.
- **Luma** ignores most style words; lead with the camera move and the subject transformation.
- Generate **at least 5 takes per prompt** and pick. Free-tier video is a slot machine — the
  first result is rarely the good one.
- If the transformation "resets" or loops mid-clip, add `no looping, no repeating motion, the
  transformation only moves forward` and shorten the requested duration.
- If the centre gets too busy for text, add `the centre of the frame stays empty, dark and
  out of focus` — say it twice, it helps.

---

## 6. Keyframe image prompts (start + end frames)

Start/end-frame control is what turns four separate 5-second generations into one believable
12-second oner. You need **five stills** — one opening frame, three handoff frames at the gaps
between desks, one closing frame. Each clip then runs `frame N → frame N+1`.

| Clip | Start frame | End frame | Beat |
|---|---|---|---|
| 1 | F1 | F2 | Design |
| 2 | F2 | F3 | 3D modelling |
| 3 | F3 | F4 | Development |
| 4 | F4 | F5 | Automation |

Generate these in any image model — GPT Image, Nano Banana / Gemini, Flux, Midjourney, Krea,
Ideogram. All are 16:9, 1920×1080.

> **Continuity rule that matters more than the prompts:** generate **F1 first**, then feed F1
> back in as a *reference image* when generating F2, F2 as reference for F3, and so on. Without
> that chain the studio changes shape between frames and the illusion of one take dies. In
> Midjourney use `--cref` / `--sref`; in GPT Image and Gemini just attach the previous frame and
> say "same studio, same lighting, same camera height — the camera has moved slightly right."

### Shared style block — append to every one of the five prompts

```
Photoreal cinematic film still, shot on ARRI Alexa with 35mm anamorphic lens at T2.0, shallow
depth of field, seated eye-level camera positioned slightly behind the subject. Dark design
studio at night, near-black #06070a environment, deep unlit background, practical lighting only.
Indigo #7d95ff monitor glow is the dominant colour; everything else desaturated. Fine 35mm film
grain, natural falloff, no lens flare, no chromatic aberration. Subjects are shown as hands,
shoulders, backs of heads and backlit silhouettes — no front-facing faces. All screen content is
defocused and abstract with no readable text. The upper-central band of the frame is dark, empty
and low-contrast. 16:9, 1920x1080.
```

### Shared negative — append to every one of the five prompts

```
front-facing face, visible facial features, eyes, distorted or deformed hands, extra fingers,
six fingers, fused fingers, legible text, letters, numbers, readable code, recognisable software
UI, logos, brand names, watermark, person looking at camera, posed smiling stock photo, bright
overlit office, daylight, fluorescent lighting, white background, warm orange grade, teal and
orange, neon cyberpunk, lens flare, floating particles, cluttered centre of frame, illustration,
3D render, CGI look, cartoon, painting
```

### F1 — opening frame (Design)

```
Extreme close film still of a designer's hands at a dark desk. The left hand steadies a sheet of
matte paper, the right hand draws a confident pencil stroke of a product silhouette. Real skin
texture with visible pores, a rolled charcoal sleeve, a plain steel wristwatch. Material swatches
and a cold cup of coffee sit half out of focus behind. A single low warm desk lamp rakes across
the paper from the upper left; everything beyond its pool falls into near-black. Hands sit in the
lower-left third of frame. Candid, unposed.
```

### F2 — handoff: Design → 3D modelling

```
Film still taken from a camera that has glided a metre to the right. In the left foreground, the
edge of the sketching desk and the blurred warm lamp glow exit frame as heavy bokeh. Entering
from the right, the silhouetted shoulder and back of the head of a 3D artist seated at a large
monitor. The monitor is defocused and washes indigo light across their shoulder and the desk
edge. A dark unlit gap separates the two workstations through the centre of frame.
```

### F3 — handoff: 3D modelling → Development

```
Film still, camera continuing right. On the left, the 3D artist's shoulder exits frame as soft
bokeh, still rimmed in indigo. Entering from the right, a developer's hands rest on a mechanical
keyboard in sharp focus — real knuckles and tendons, forearms lit by screen glow. Two monitors
behind them are heavily defocused into columns of luminous indigo and pale bokeh bands. A dark
unlit gap runs through the centre of frame between the two desks.
```

### F4 — handoff: Development → Automation

```
Film still, camera continuing right. On the left, the keyboard and the developer's forearm exit
frame as foreground bokeh. Entering from the right, a wide dark wall display beginning to
illuminate — a sparse network of glowing indigo nodes and thin connecting lines, only partly lit,
the rest still dark. A person stands a few steps back in near-total silhouette, just their
outline separating from the darkness. Deep black space through the upper centre of frame.
```

### F5 — closing frame (Automation)

```
Film still. A wide dark wall display fully illuminated with a network of glowing indigo nodes and
connecting lines, bright pulses sitting on the links. A person stands several steps back in full
silhouette, arms folded, watching — only their outline readable against the glow. The studio
behind them is near-black. The display occupies the lower and right portion of frame; the upper
centre stays dark and empty. Still, quiet, resolved.
```

### Notes

- Generate **6–10 variations of each frame** and pick. Image models garble hands as readily as
  video models do; F1 and F3 are the risky ones. Compositions where hands are partly cropped by
  the frame edge fail less often.
- If a handoff frame looks like two unrelated photos glued together, add `single continuous room,
  one unbroken desk row, consistent floor and ceiling line`.
- Once a clip is generated, **export its real last frame and use that as the next clip's start
  frame** rather than your generated F(N+1). The generated frame is the *target* you aim the clip
  at; the actual rendered frame is what guarantees a seamless join.

---

## 6b. Prompt A+ — "The Thread" (expanded, most Configuro-specific)

Same oner, but five stations instead of four, and **one product carries through every station** —
a modular slatted canopy sketched, modelled, configured, shipped into an app, and finally moving
through an automated pipeline. That through-line is what makes it read as *Configuro's* film
rather than generic studio b-roll: it shows the handoff between pillars, which is the actual
sell. 12 s to match the current clip length.

```json
{
  "concept": "One unbroken documentary tracking shot through a dark studio at night, following a single product — a modular slatted architectural canopy — as it travels through five stations: hand sketch, 3D model, live configurator, mobile app build, and an automated client pipeline. The same object appears at every station in a more finished state, so the shot reads as one continuous handoff from design to build to automation.",
  "duration_seconds": 12,
  "aspect_ratio": "16:9",
  "resolution": "1920x1080",
  "frame_rate": 30,
  "the_thread": "The same slatted canopy silhouette is visible at all five stations — drawn in pencil, then as a rotating wireframe, then as a configurable photoreal render, then inside a phone screen, then as a node in a live pipeline. It is the only repeating shape in the film.",
  "camera": {
    "type": "35mm anamorphic, T2.0, shallow depth of field, cinema camera on a slider",
    "movement": "one continuous slow lateral tracking dolly moving right at constant speed, gliding past each station without stopping; at the configurator station it arcs in slightly closer, then resumes the lateral glide",
    "height": "seated eye level, slightly behind the subjects, over-the-shoulder framing",
    "focus": "a gentle rack focus hands off from each station to the next as the camera passes the dark gap between desks",
    "stability": "smooth dolly with faint natural micro-movement, no handheld shake, no whip pans, no zoom"
  },
  "sequence": [
    {
      "time": "0.0-2.4s",
      "beat": "DESIGN",
      "action": "Open close on a designer's hands at a dark desk. One hand steadies a sheet of matte paper, the other draws confident pencil strokes of a slatted canopy silhouette — parallel louvre lines, a clean structural frame. Real skin texture with visible pores, a rolled charcoal sleeve, a plain steel wristwatch. Aluminium and timber material swatches fan out beside the sheet, a cold cup of coffee half out of focus. One low warm desk lamp rakes across the paper; everything past its pool falls into near-black. The camera begins gliding right."
    },
    {
      "time": "2.4-4.8s",
      "beat": "3D MODELLING",
      "action": "The camera arrives behind a 3D artist at a large monitor — back of the head and shoulder in silhouette, face never visible. On screen, softly defocused, the same canopy now exists as a glowing indigo wireframe, slowly rotating, louvres resolving one by one into translucent surfaces. Their hand rests on a 3D mouse; the model turns as their thumb nudges it. Indigo screen light rims their shoulder and the desk edge."
    },
    {
      "time": "4.8-7.2s",
      "beat": "CONFIGURATOR",
      "action": "The camera arcs slightly closer. A second pair of hands works a tablet lying flat on the desk, thumb tapping through a row of material swatches. On the large display behind, the canopy — now photoreal, matte metal with soft studio reflections — changes finish in sync with each tap, louvres rotating open and closed. The physical aluminium swatch from the first desk sits on the table beside the tablet, matching the on-screen material exactly."
    },
    {
      "time": "7.2-9.6s",
      "beat": "DEVELOPMENT",
      "action": "The camera continues right to a developer's workstation. Hands in sharp focus on a mechanical keyboard, fingers moving in natural typing rhythm — real knuckles, real tendons, one hand leaving to reach a mouse. A phone sits upright in a stand at the edge of the desk, screen glowing, the same canopy rotating inside it in miniature. Two monitors behind are heavily defocused into columns of luminous indigo and pale bokeh bands."
    },
    {
      "time": "9.6-12.0s",
      "beat": "AUTOMATION",
      "action": "The camera settles on a wide dark wall display. A network of glowing indigo nodes and connecting lines lights up in sequence — a small canopy icon travels along the links from node to node, pulses following it as each stage completes and the system comes online. A figure stands a few steps back in full silhouette, arms folded, watching; only their outline is readable against the glow. Motion slows almost to stillness as the last connection illuminates."
    }
  ],
  "human_direction": {
    "presence": "people are essential — hands, forearms, shoulders, backs of heads, silhouettes",
    "framing_rule": "never show a front-facing human face; subjects are turned away, at the frame edge in profile, or backlit into pure silhouette",
    "performance": "calm, absorbed, unhurried, natural micro-movements — no acting to camera, no gesturing at the lens, subject unaware of camera",
    "wardrobe": "muted dark neutrals — charcoal knit, dark denim, plain grey tee; no patterns, no visible branding",
    "skin_and_hands": "anatomically correct hands, five fingers, natural skin texture and pores, realistic tendon and knuckle movement, hands often partly cropped by the frame edge"
  },
  "production_design": {
    "set": "one continuous desk row along a dark studio wall, five stations separated by unlit gaps",
    "props": "pencils, matte paper, aluminium and timber material swatches, a 3D mouse, a tablet flat on the desk, a phone in a stand, a mechanical keyboard, a cold coffee cup, loose cable clutter, a worn desk edge",
    "rule": "lived-in, not staged — sterile empty desks read as generated"
  },
  "screen_content": {
    "rule": "all screens are defocused and abstract — no legible text, no readable code, no recognisable software UI, no menu bars",
    "appearance": "glowing indigo wireframe geometry, the photoreal canopy render, soft columns of luminous lines, node graphs, colour blocks bleeding into bokeh"
  },
  "lighting": {
    "key": "practical sources only — monitor glow and one warm desk lamp, motivated and visible in frame",
    "accent": "indigo #7d95ff screen light spilling across shoulders, desks, walls and the underside of hands",
    "ambient": "near-black studio, deep unlit background, no fill light, isolated pools of light separated by darkness",
    "mood": "quiet, focused, expensive, a serious studio still working at 2am"
  },
  "color_palette": {
    "background": "#06070a near-black with a cool blue-black falloff",
    "primary_accent": "#7d95ff indigo screen light",
    "secondary_accent": "#a5b6ff pale periwinkle",
    "warm_counterpoint": "a single low-intensity amber desk lamp, first station only",
    "highlight": "#d6ddff cool white, sparingly on rim lights",
    "saturation": "desaturated overall, colour carried almost entirely by the indigo practicals"
  },
  "composition": {
    "detail_placement": "subjects, props and screens occupy the lower and outer thirds of frame",
    "negative_space": "the upper-central band stays dark, empty and low-contrast so overlaid headline text remains legible",
    "depth": "strong foreground and background bokeh, three layers of depth at every station, deep black falloff behind each"
  },
  "style": {
    "reference": "high-end making-of documentary, Apple design-team film, Netflix 'Abstract: The Art of Design', architectural studio behind-the-scenes footage",
    "realism": "photoreal live-action cinematography, not CGI, not illustration, not animation, not a 3D render of a studio",
    "texture": "fine 35mm film grain, subtle anamorphic falloff, natural motion blur, no lens flare, no chromatic aberration",
    "grade": "cool, low-contrast, lifted blacks kept dark, no teal-and-orange"
  },
  "motion_rules": [
    "one continuous take, no cuts, no transitions, no fades to black",
    "constant slow dolly speed throughout — nothing accelerates, snaps or whips",
    "the camera only ever travels right, it never returns to a previous station",
    "the product only ever becomes more finished, never reverts",
    "human movement is subtle and continuous, never looping or resetting"
  ],
  "audio": "none — silent clip",
  "negative_prompt": "front-facing faces, close-up faces, morphing or drifting facial features, distorted eyes, extra fingers, six fingers, fused or deformed hands, warped limbs, floating disconnected body parts, legible text, letters, words, numbers, readable code, recognisable software UI, menu bars, logos, brand names, watermark, people looking at camera, posed smiling stock-footage acting, empty sterile desks, fast camera movement, whip pan, zoom punch, cuts, scene changes, flashing, strobing, high contrast, bright white background, overlit office, fluorescent daylight, warm orange grade, neon cyberpunk, teal-and-orange, lens flare, floating particles, confetti, cluttered centre of frame, jitter, stutter"
}
```

**Flattened version:**

> Photoreal cinematic documentary footage, one continuous 12-second tracking shot gliding slowly
> right through a dark design studio at night, 35mm anamorphic, shallow depth of field, practical
> lighting only. It follows one product — a modular slatted canopy — across five stations without
> a single cut. A designer's hands sketch its louvred silhouette in pencil under a warm desk lamp
> beside aluminium and timber swatches. A 3D artist, seen from behind in silhouette, rotates the
> same canopy as a glowing indigo wireframe on a large monitor. Hands tap material swatches on a
> flat tablet and the canopy on the big display changes finish in sync, now photoreal matte metal.
> A developer's hands type on a mechanical keyboard while the same canopy turns inside a phone
> propped in a stand. Finally a wide wall display lights up as a small canopy icon travels through
> a network of glowing indigo nodes, a figure watching in full silhouette with folded arms.
> Near-black #06070a environment, indigo #7d95ff monitor glow as the only real colour,
> desaturated, deep shadows, fine 35mm grain, natural motion blur, lived-in desks with cable
> clutter and a cold coffee cup. No faces — people appear as hands, shoulders, backs and
> silhouettes. Screens are defocused and abstract with no readable text. The upper centre of frame
> stays dark and empty. One unbroken take, constant slow speed, nothing accelerates.
>
> Negative: front-facing faces, morphing faces, deformed hands, extra fingers, legible text,
> readable code, software UI, logos, watermark, looking at camera, posed stock-footage acting,
> sterile empty desks, fast camera moves, cuts, flashing, bright overlit office, daylight, warm
> orange grade, teal and orange, lens flare, clutter in the centre, jitter.

Five beats at 12 s means splitting into **five clips of ~2.4 s each**, or three clips (beats 1–2,
3, 4–5). The keyframe workflow in §6 extends the same way — you just need six stills instead of
five, with the extra handoff frame falling in the gap between the modelling and configurator
desks.

---

## 6c. Continuation prompt — resuming a take that stopped at 7 s

Nearly every free tier caps a single generation at 5–10 s, so Prompt A+ will stop partway. A stop
at **7 s** lands mid-CONFIGURATOR beat (4.8–7.2 s), with the camera already gliding right past the
tablet desk. This prompt resumes from exactly there and carries through to 12 s.

**How to feed it in, whichever tool you're using:**

- If the tool has a native **Extend / Continue** button (Kling, Luma, Runway, Hailuo all do),
  press it on the existing clip and paste this as the extension prompt.
- If it doesn't, export the **final frame** of the 7 s clip as a PNG and use it as the
  **start frame** for a fresh generation with this prompt.
- Either way, request only **5 seconds**. Asking for the full remainder in one go is what caused
  the early stop.

The critical thing a continuation prompt must do is tell the model it is *mid-shot*. Without
that, it re-establishes the scene — new camera position, new desk, new lighting — and you get a
cut instead of a continuation.

```json
{
  "shot_type": "CONTINUATION — this is the second half of a single unbroken take already in progress. Do not re-establish, do not reset the camera, do not cut to a new scene. The camera is already moving and simply keeps going.",
  "resume_state": "At the first frame, the camera is mid-glide past the configurator desk in a dark studio at night. A tablet lies flat on the desk with hands working a row of material swatches; a large display behind shows a photoreal matte-metal slatted canopy. The camera is travelling laterally to the right at a slow constant speed and must continue at exactly that speed and height without pause.",
  "duration_seconds": 5,
  "aspect_ratio": "16:9",
  "resolution": "1920x1080",
  "frame_rate": 30,
  "camera": {
    "type": "35mm anamorphic, T2.0, shallow depth of field",
    "movement": "continue the existing lateral tracking dolly to the right at the identical constant speed — no acceleration, no stop, no reverse, no new camera angle",
    "height": "unchanged, seated eye level, slightly behind the subjects",
    "focus": "rack focus hands off from the configurator desk to the developer's workstation as the camera crosses the dark gap between them"
  },
  "sequence": [
    {
      "time": "0.0-0.5s",
      "beat": "HANDOFF",
      "action": "The tablet and the configurator display slide out of frame to the left, dissolving into foreground bokeh. The camera crosses an unlit gap between two desks — a moment of near-total darkness through the centre of frame."
    },
    {
      "time": "0.5-2.6s",
      "beat": "DEVELOPMENT",
      "action": "A developer's workstation enters from the right. Hands in sharp focus on a mechanical keyboard, fingers moving in a natural typing rhythm — real knuckles, real tendons, visible skin texture, one hand leaving to reach a mouse. A phone stands upright in a stand at the desk edge, screen glowing, the same slatted canopy rotating inside it in miniature. Two monitors behind are heavily defocused into columns of luminous indigo and pale bokeh bands. Only the back of the developer's shoulder is visible; no face."
    },
    {
      "time": "2.6-3.1s",
      "beat": "HANDOFF",
      "action": "The keyboard and forearm exit left as foreground bokeh. The camera crosses another dark unlit gap."
    },
    {
      "time": "3.1-5.0s",
      "beat": "AUTOMATION",
      "action": "A wide dark wall display enters from the right and the camera settles on it. A network of glowing indigo nodes and connecting lines lights up in sequence — a small canopy icon travels along the links from node to node, pulses following it as each stage completes. A figure stands several steps back in full silhouette, arms folded, watching; only their outline is readable against the glow. Motion slows almost to stillness as the last connection illuminates."
    }
  ],
  "continuity_locks": {
    "environment": "same studio, same continuous desk row, same wall, same floor line as the opening clip",
    "lighting": "identical — practical sources only, monitor glow plus the distant warm desk lamp far behind, near-black elsewhere",
    "grade": "identical cool desaturated low-contrast grade, no shift in white balance or exposure",
    "grain": "identical fine 35mm grain and anamorphic falloff",
    "product": "the same slatted canopy continues to appear, now inside the phone and then as an icon in the pipeline — it only becomes more finished, never reverts to sketch or wireframe"
  },
  "human_direction": {
    "framing_rule": "never show a front-facing human face; hands, forearms, shoulders, backs of heads and backlit silhouettes only",
    "performance": "calm, absorbed, unaware of camera, natural micro-movements",
    "skin_and_hands": "anatomically correct hands, five fingers, natural skin texture and pores, realistic tendon movement"
  },
  "screen_content": {
    "rule": "all screens defocused and abstract — no legible text, no readable code, no recognisable software UI"
  },
  "color_palette": {
    "background": "#06070a near-black",
    "primary_accent": "#7d95ff indigo screen light",
    "secondary_accent": "#a5b6ff pale periwinkle",
    "saturation": "desaturated, colour carried almost entirely by the indigo practicals"
  },
  "composition": {
    "negative_space": "the upper-central band stays dark, empty and low-contrast for overlaid headline text",
    "depth": "strong foreground and background bokeh, deep black falloff behind every station"
  },
  "style": {
    "reference": "high-end making-of documentary, cinematic behind-the-scenes studio footage",
    "realism": "photoreal live-action cinematography, not CGI, not illustration, not animation"
  },
  "motion_rules": [
    "this is a continuation of an existing shot — no cut, no fade, no transition at the first frame",
    "constant slow dolly speed identical to the incoming clip",
    "the camera only ever travels right and never returns to a previous station",
    "human movement is subtle and continuous, never looping or resetting"
  ],
  "audio": "none — silent clip",
  "negative_prompt": "re-establishing shot, new camera angle, scene reset, cut, jump cut, fade in, fade to black, camera reversing direction, returning to a previous desk, speed change, front-facing faces, morphing facial features, deformed hands, extra fingers, legible text, readable code, software UI, logos, watermark, looking at camera, posed stock-footage acting, sterile empty desks, bright overlit office, daylight, warm orange grade, teal-and-orange, lens flare, floating particles, cluttered centre of frame, jitter, stutter, lighting change, colour shift"
}
```

**Flattened version:**

> Continue this shot without cutting. The camera is already gliding slowly right through a dark
> design studio at night, 35mm anamorphic, shallow depth of field — keep the exact same speed,
> height, lighting and colour grade, and do not re-establish the scene. The configurator desk and
> its tablet slide out of frame left into bokeh as the camera crosses a dark gap. A developer's
> workstation enters from the right: hands in sharp focus typing on a mechanical keyboard, a phone
> upright in a stand with a slatted canopy rotating on its screen, two heavily defocused monitors
> glowing indigo behind. The camera crosses another dark gap and settles on a wide wall display
> where a network of glowing indigo nodes lights up in sequence, a small canopy icon travelling
> along the links, while a figure watches in full silhouette with folded arms. Motion slows almost
> to stillness. Near-black #06070a, indigo #7d95ff monitor glow as the only colour, desaturated,
> fine 35mm grain. No faces — hands, shoulders, backs and silhouettes only. Screens defocused with
> no readable text. Upper centre of frame stays dark and empty.
>
> Negative: re-establishing shot, new camera angle, scene reset, cut, fade, camera reversing,
> returning to a previous desk, speed change, lighting or colour shift, front-facing faces,
> deformed hands, extra fingers, legible text, readable code, logos, watermark, looking at camera,
> bright overlit office, daylight, warm orange grade, lens flare, jitter.

### If it stops early again

- **Ask for less.** Request 4–5 s per generation, never the full remainder. Most free tiers
  silently truncate rather than error.
- **Split at a gap.** Generate `HANDOFF + DEVELOPMENT` as one clip and `HANDOFF + AUTOMATION` as
  another. Both stops then land in darkness between desks, where a seam is invisible.
- **Check the join before generating more.** Concat what you have and scrub it. A drift in
  brightness or grain between clips is far easier to fix now (one `eq` filter on the offending
  clip) than after five clips are stacked up.
- **Fixing a brightness mismatch at a join:**
  ```bash
  ffmpeg -i clip2.mp4 -vf "eq=brightness=-0.03:saturation=0.96" -c:v libx264 -crf 18 clip2-matched.mp4
  ```

---

## 7. Handoff block for Codex (assembly + integration)

Paste this as a task to a coding agent once the clips exist. It does no generation — just the
join, the encode and the wiring.

```
In this repo (Vite + React, Configuro site), assemble AI-generated background clips into the
scroll-scrubbed site background.

Inputs: clip1.mp4 .. clip4.mp4 in ./output/, each ~5s, generated so that each clip's last frame
matches the next clip's first frame.

Tasks:
1. Concat the clips losslessly into a single continuous take with ffmpeg (concat demuxer,
   -c copy). If the clips have mismatched codecs or resolutions, normalise them first with the
   concat filter instead.
2. Re-encode the result to all-intra H.264, matching exactly the settings in
   scripts/capture-bg.mjs (-c:v libx264 -preset slow -crf 22 -g 1 -bf 0 -tune fastdecode
   -pix_fmt yuv420p -movflags +faststart), scaled/cropped to 1920x1080 at 30fps. Write it to
   src/assets/process-indigo.mp4. The all-intra flags are mandatory: src/components/
   VideoBackground.jsx scrubs video.currentTime from scroll position, so every frame must be a
   keyframe or seeking stutters.
3. Do the same for the slate variant if slate clips are present -> src/assets/process-slate.mp4.
4. Update the imports and the ROUTE_VIDEO map in src/components/VideoBackground.jsx to use the
   new files in place of automation-indigo.mp4 / automation-slate.mp4. Change nothing else in
   that file — the scrub logic is source-agnostic.
5. Report the output file sizes. If either exceeds 25 MB, re-encode that one at CRF 26 and
   report both sizes.

Do not delete the existing automation-*.mp4 files.
```
