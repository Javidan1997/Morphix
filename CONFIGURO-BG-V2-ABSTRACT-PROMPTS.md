# Configuro background v2 — Optics & Light · 20 s seamless loop

No humans. No glow-in-void, no neon, no drawn-line clichés. A **precision optical bench shot as a
product film**: bone-white seamless, black anodised mounts, ground glass, and one beam of daylight
travelling through the system. Two 10-second chunks forming a 20-second loop.

**Subject:** a row of optical elements — a coated filter, a dispersing prism, a lens stack, a
recombining prism — mounted on machined adjusters, with light passing through them.

**The idea:** the film has no beginning or end because the *light* is the subject, not an object
being built. It enters, is split, is shaped, is recombined, and exits — continuously. That is the
most honest picture of what Configuro actually sells: a system that takes something in, transforms
it precisely, and delivers it. Design → Build → Automate as one optical path.

---

## 0. How the loop works

Two mechanisms, both one-directional, both returning exactly to the start at 20 s:

1. **Every motorised mount rotates exactly 360°** over the 20 seconds. Prisms and filters turn
   slowly on their axes, so the refracted paths and the caustics on the surface sweep continuously
   — then arrive back at their opening positions. Nothing reverses; the cycle simply completes.
2. **The camera orbits exactly 360°** around the bench over the same 20 seconds, ending at the
   identical height, angle, distance and focal length it started at.

Because the light source and the elements' positions never change, frame 600 is geometrically
identical to frame 0. The cut is invisible.

You need only **two reference stills**: F1 (opening *and* closing frame) and F2 (the midpoint).

> **Note on your site:** `VideoBackground.jsx` scrubs `currentTime` from scroll position rather
> than playing, so the loop shows at the scroll extremes or if you later enable autoplay. Worth
> getting right regardless — it costs nothing here.

---

## 1. The rules that keep it from looking AI-generated

| Banned | Why |
|---|---|
| Volumetric light shafts, haze, atmosphere, god rays | The single biggest "AI render" tell in any optics shot. Light is visible **inside the glass and where it lands**, never as a beam in mid-air. |
| Saturated rainbow dispersion | The prism-rainbow is the most generated image on earth. Dispersion here is **narrow and pale** — a whisper of amber and cool blue at the fringes, nothing more. |
| Emissive glow, bloom, light trails | Real lenses bloom on bright sources only. |
| Floating elements without shadows | Everything is bolted to a mount and casts a contact shadow. |
| Flat background with no falloff | Real seamless has a visible gradient. |
| Lens flare | Never. |

**Positive counterparts to say explicitly:** caustics crawling on the surface, the green edge tint
of real optical glass, faint coating bloom on filter faces, knurling on the adjusters, one soft
grounded shadow per mount.

---

## 2. Constraints

- 1920×1080, 16:9, 30 fps, 20 s total.
- Continuous one-directional motion, no cuts, no reversal.
- No legible text, no logos, no readable UI, no screens.
- Must be re-encoded all-intra before use — §6.

### ⚠️ One thing this breaks

Your site is dark: `body { background: #08090c }`, white text, black scrim at
`src/cinematic.css:28-35`. **A bone-white film under white headline text is unreadable.** Pick one
before generating:

1. **Go light properly** — flip the public shell to dark text and change `.cinematic-vig` to a
   white veil (`rgba(255,255,255,0.55)`). The more Apple answer, but a real design change.
2. **Keep the site dark, shoot "graphite"** — same bench, charcoal seamless. Zero CSS changes,
   and honestly the stronger look for optics: glass and caustics read beautifully on dark. Swap
   block in §5.

Everything below is written for the light version; §5 converts it.

---

## 3. Reference image prompts (ChatGPT / GPT Image)

| Frame | Role |
|---|---|
| **F1** | Opening frame **and** closing frame — the loop point |
| **F2** | Chunk 1 end / chunk 2 start |

**Workflow:** generate F1 first, then attach it to the F2 request with *"same bench, same light,
same surface — the camera has moved around to the opposite side and the mounts have rotated
halfway."*

### Shared style block — append to both image prompts

```
Photographed still life, shot on a Phase One medium format camera with a 100mm macro lens at f/5.6,
studio tabletop. Seamless bone-white paper sweep, background #F2F0EC warming to #E6E3DE in the
falloff, with a soft visible gradient — not a flat void. Lit by one large overhead softbox plus a
single narrow collimated daylight source entering low from the left; neutral white balance around
5600K. Every mount casts one soft, physically accurate contact shadow. Materials are real: polished
optical glass with a faint green edge tint, magnesium-fluoride coated filter faces with a subtle
violet sheen, black anodised aluminium mounts with knurled adjustment rings, bead-blasted aluminium
posts, bone-white seamless. Light is visible only inside the glass and in the caustics it casts on
the surface — never as a beam in the air. Extremely low saturation, gentle contrast, no crushed
blacks, no blown highlights. Generous empty space. Calm, precise, expensive, restrained. Apple
product photography meets a scientific instrument catalogue. 16:9 widescreen, 1920x1080.
```

### Shared negative — append to both image prompts

```
No volumetric light shafts, no god rays, no haze, no atmosphere, no fog, no smoke, no visible beam
in the air, no dust particles, no rainbow, no saturated spectrum, no prism rainbow cliché, no
iridescence, no glow, no emissive light, no bloom, no lens flare, no light trails, no neon, no
holograms, no HUD graphics, no screens, no dark void, no black background, no floating objects
without shadows, no people, no hands, no text, no letters, no numbers, no logos, no watermark, no
teal and orange, no cyberpunk, no cluttered composition, no cartoon, no illustration, no plastic
CGI look, no oversaturated colour.
```

### F1 — the loop point (opening **and** closing frame)

```
A low three-quarter macro view along a precision optical bench on a bone-white studio surface.
Four optical elements stand in a perfectly aligned row on black anodised aluminium mounts with
knurled adjustment rings and bead-blasted posts: a flat coated filter with a faint violet sheen
nearest camera, then a triangular glass prism, then a small stack of two lens elements, then a
second prism further away and softly out of focus. A narrow collimated daylight beam enters from
the left and can be seen travelling inside the glass — bright within each element, invisible in
the air between them. On the seamless below, a crisp caustic figure sits beneath the first prism,
a clean elongated shape of concentrated light with the faintest amber and cool blue at its edges.
Each mount casts one soft grounded shadow. The bench occupies the lower right; the upper left two
thirds of frame is empty bone-white surface falling gently into soft shadow.
```

### F2 — the midpoint

```
The same optical bench on the same bone-white surface, seen from the opposite side of the table at
a slightly wider framing. The mounts have rotated: the first prism is now turned side-on, throwing
its refracted light across the bench at an angle, and the coated filter shows a broader face to
camera with a subtle violet-green coating bloom. The light travelling inside the glass now takes a
visibly different path — entering the prism at a steeper angle and emerging as a narrow pale fan,
faint amber on one edge and cool blue on the other, never a saturated rainbow. Two large soft
caustic figures now stretch across the seamless below, overlapping. The lens stack, closest to
camera, is sharply focused with the green edge tint of real optical glass clearly visible. Bench
in the lower right; upper left remains empty surface.
```

---

## 4. Video prompts — two 10-second chunks

Chunk 2 starts from chunk 1's **exported last frame** (not the generated still — that's the
target; the rendered frame guarantees the join).

### Chunk 1 (0–10 s) — "Entry & Dispersion" · F1 → F2

```json
{
  "chunk": "1 of 2",
  "concept": "Light enters a precision optical bench, passes through a coated filter into a slowly rotating prism, and spreads into a narrow pale fan. The camera travels around the bench while caustics sweep across the surface below.",
  "duration_seconds": 10,
  "aspect_ratio": "16:9",
  "resolution": "1920x1080",
  "frame_rate": 30,
  "start_frame": "F1 — low three-quarter macro along the aligned optical bench, single caustic below the first prism",
  "end_frame": "F2 — the bench seen from the opposite side, mounts rotated halfway, two overlapping caustics",
  "loop_role": "First half of a 20-second seamless loop. The camera covers the first 180 degrees of a single continuous 360-degree orbit, and every motorised mount covers the first 180 degrees of a single continuous 360-degree rotation.",
  "camera": {
    "type": "100mm macro on medium format, f/5.6, shallow but controlled depth of field",
    "movement": "one continuous slow orbit to the right around the optical bench, covering 180 degrees over the ten seconds at constant angular speed, easing very slightly wider as it travels",
    "stability": "smooth motion-control move, no shake, no zoom snap"
  },
  "sequence": [
    { "time": "0.0-3.5s", "action": "Macro along the bench. The collimated beam enters the flat coated filter from the left, its violet-green coating bloom shifting subtly as the camera begins to orbit. Light is bright inside the glass and absent from the air between elements. The caustic beneath the first prism holds crisp and still." },
    { "time": "3.5-7.0s", "action": "The prism mounts begin to rotate slowly on their axes. As the first prism turns, the light path inside it bends progressively and the caustic on the seamless below stretches, slides sideways and elongates. The knurled adjustment rings turn with it. The camera continues around, revealing the bench from a new angle." },
    { "time": "7.0-10.0s", "action": "The rotating prism reaches an angle where the emerging light spreads into a narrow pale fan — a whisper of amber on one edge, cool blue on the other, never a saturated rainbow. A second caustic figure opens on the surface beside the first and the two begin to overlap. The camera arrives at the opposite side of the bench." }
  ],
  "lighting": "one large overhead softbox for the objects, plus a single narrow collimated daylight source entering low from the left, neutral 5600K; soft gradient falloff across the seamless; light visible only inside the glass and in the caustics on the surface, never as a beam in the air",
  "materials": "polished optical glass with faint green edge tint, magnesium-fluoride coated filter faces, black anodised aluminium mounts with knurled rings, bead-blasted aluminium posts, bone-white seamless",
  "color_palette": { "ground": "#F2F0EC bone white falling to #E6E3DE", "mounts": "#232426 black anodised", "metal": "warm silver bead-blasted aluminium", "glass": "near-colourless with pale green edges", "dispersion": "extremely pale amber and cool blue fringes only", "saturation": "extremely low, near-neutral" },
  "composition": { "subject_placement": "bench along the lower and right thirds", "negative_space": "upper-left two-thirds stays clean empty surface for overlaid headline text" },
  "style": "Apple product film crossed with a scientific instrument catalogue, medium-format still-life photography brought to motion, physically accurate caustics and refraction, honest contact shadows, gentle contrast, fine natural grain",
  "motion_rules": [
    "one continuous take, no cuts, no fades",
    "constant angular speed for both the camera orbit and the mount rotations",
    "everything rotates in one direction only and never reverses",
    "the elements never move position on the bench — only their own rotation changes",
    "no volumetric beam in the air at any point"
  ],
  "audio": "none",
  "negative_prompt": "volumetric light shafts, god rays, haze, atmosphere, fog, smoke, visible beam in air, dust particles, rainbow, saturated spectrum, prism rainbow cliché, iridescence, glow, emissive light, bloom, lens flare, light trails, neon, holograms, HUD graphics, screens, dark void, black background, floating objects without shadows, people, hands, text, letters, numbers, logos, watermark, teal-and-orange, cyberpunk, clutter, cartoon, illustration, plastic CGI look, oversaturated colour, fast camera movement, cuts, flashing, jitter"
}
```

### Chunk 2 (10–20 s) — "Recombination & Return" · F2 → F1

```json
{
  "chunk": "2 of 2",
  "concept": "The dispersed light is gathered by a lens stack and recombined by a second prism into a single clean beam. The mounts complete their rotation and the camera completes its orbit, arriving at exactly the opening frame.",
  "duration_seconds": 10,
  "aspect_ratio": "16:9",
  "resolution": "1920x1080",
  "frame_rate": 30,
  "start_frame": "F2 — bench from the opposite side, mounts rotated halfway (use the exported last frame of chunk 1)",
  "end_frame": "F1 — the identical opening macro: aligned bench, single crisp caustic beneath the first prism, same camera height, angle, distance and focal length",
  "shot_type": "CONTINUATION — the camera is already orbiting and the mounts are already rotating; do not re-establish, do not cut, do not change the set or lighting",
  "loop_role": "Second half of a 20-second seamless loop. The camera completes the remaining 180 degrees of its single continuous orbit and every mount completes the remaining 180 degrees of its rotation, so the final frame is geometrically identical to the opening frame.",
  "camera": {
    "type": "100mm macro, f/5.6",
    "movement": "continue the same orbit to the right at the identical angular speed, covering the remaining 180 degrees; ease back in from the wider framing to the opening tight macro as it arrives",
    "stability": "smooth motion control"
  },
  "sequence": [
    { "time": "0.0-3.5s", "action": "The pale fan of light reaches the lens stack. The two elements gather it, the spread narrowing as it passes through, the green edge tint of the glass catching the softbox. On the seamless below, the two overlapping caustics contract and sharpen into one tighter figure." },
    { "time": "3.5-7.0s", "action": "The second prism, still rotating, reaches the angle that recombines the light into a single clean path. The colour fringes fold back into neutral white inside the glass. The camera continues around the bench, the mounts' knurled rings turning steadily, shadows sweeping across the surface." },
    { "time": "7.0-10.0s", "action": "The recombined light exits the last element as one narrow clean path. The mounts complete their rotation and settle into exactly their opening orientations; the caustic on the surface contracts back to the single crisp figure beneath the first prism. The camera eases back into the opening tight macro framing along the aligned bench. Motion settles to the exact opening frame." }
  ],
  "continuity_locks": {
    "set": "identical bone-white seamless, identical bench, identical element positions throughout",
    "lighting": "identical softbox and collimated source, unchanged direction and intensity",
    "grade": "identical neutral 5600K, low saturation, gentle contrast — no exposure or white-balance shift",
    "loop_frame": "the final frame must match the opening frame exactly — same camera height, angle, distance and focal length, same mount orientations, same single caustic in the same position, same shadows",
    "elements": "no element is ever added, removed or repositioned on the bench; only rotation changes"
  },
  "materials": "polished optical glass with faint green edge tint, coated filter faces, black anodised mounts with knurled rings, bead-blasted aluminium posts, bone-white seamless",
  "composition": { "subject_placement": "bench along the lower and right thirds", "negative_space": "upper-left stays clean empty surface for overlaid headline text" },
  "style": "Apple product film crossed with a scientific instrument catalogue, physically accurate caustics and refraction, honest shadows, extremely restrained",
  "motion_rules": [
    "continuation of an existing shot — no cut, no fade, no transition at the first frame",
    "constant angular speed identical to the incoming clip",
    "camera and mounts rotate in one direction only and never reverse",
    "the film ends on the exact opening framing so it loops invisibly",
    "no volumetric beam in the air at any point"
  ],
  "audio": "none",
  "negative_prompt": "re-establishing shot, new camera angle, scene reset, cut, fade, camera reversing, speed change, lighting change, colour shift, volumetric light shafts, god rays, haze, fog, smoke, visible beam in air, dust particles, rainbow, saturated spectrum, iridescence, glow, emissive light, bloom, lens flare, light trails, neon, holograms, screens, dark background, floating objects without shadows, people, hands, text, logos, watermark, oversaturated colour, plastic CGI look, clutter, fast camera movement, jitter"
}
```

---

## 5. Graphite variant (keeps the site dark — and suits optics better)

Glass, caustics and coated filters read *better* on dark than on bone white, so this is the
stronger version as well as the zero-CSS-change one.

**Replace the shared style block's first three sentences with:**

```
Photographed still life, shot on a Phase One medium format camera with a 100mm macro lens at f/5.6,
studio tabletop. Seamless deep warm charcoal paper sweep, background #17181B deepening to #0C0D10
in the falloff, with a soft visible gradient — not a flat black void. Lit by one soft overhead
source raking from the left plus a single narrow collimated daylight beam entering low from the
left; neutral white balance around 5600K.
```

**And in every `color_palette`:**

| Light version | Graphite version |
|---|---|
| ground `#F2F0EC` → `#E6E3DE` | ground `#17181B` → `#0C0D10` |
| black anodised mounts `#232426` | natural bead-blasted aluminium mounts — they separate from the dark |
| glass, pale green edges | same, and considerably more visible |
| caustics: bright on white | caustics: the brightest thing in frame, pale warm white on charcoal |

Keep every rule from §1 intact — no haze, no rainbow, no volumetric beam. On a dark ground the
temptation to add a glowing shaft in the air is much stronger, and it is exactly what would sink
the shot.

---

## 6. Assembly

```bash
# clips.txt:  file 'chunk1.mp4'  /  file 'chunk2.mp4'
ffmpeg -f concat -safe 0 -i clips.txt -c copy joined.mp4

# mandatory all-intra re-encode — every frame a keyframe, or scroll-scrub stutters
ffmpeg -y -i joined.mp4 \
  -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30" \
  -c:v libx264 -preset slow -crf 22 \
  -g 1 -bf 0 -tune fastdecode \
  -pix_fmt yuv420p -movflags +faststart \
  src/assets/optics-light.mp4
```

### Checking and rescuing the loop

Play the joined file on repeat and watch the wrap point. If the last frame doesn't quite match the
first, crossfade a 0.8 s tail into the head — it hides a surprising amount of mismatch:

```bash
# 20s source -> 19.2s seamless loop
ffmpeg -y -i joined.mp4 -filter_complex \
 "[0:v]trim=0:19.2,setpts=PTS-STARTPTS[main]; \
  [0:v]trim=19.2:20,setpts=PTS-STARTPTS[tail]; \
  [0:v]trim=0:0.8,setpts=PTS-STARTPTS[head]; \
  [tail][head]xfade=transition=fade:duration=0.8:offset=0[blend]; \
  [main][blend]concat=n=2:v=1:a=0[out]" \
 -map "[out]" -c:v libx264 -preset slow -crf 22 -g 1 -bf 0 -pix_fmt yuv420p \
 -movflags +faststart loop20.mp4
```

Brightness or grain step at the chunk join:

```bash
ffmpeg -i chunk2.mp4 -vf "eq=brightness=-0.03:saturation=0.96" -c:v libx264 -crf 18 chunk2-matched.mp4
```

Then swap the imports in `src/components/VideoBackground.jsx` (lines 3–20). The `loop` attribute is
already set there.

If you shoot the **light** version, also change `.cinematic-vig` in `src/cinematic.css:28-35` from
black gradients to a white veil and flip the public-shell text tokens to dark — otherwise white
headlines sit on bone white and vanish.

---

## 7. If a take still looks AI-generated

In order of how much they help:

1. `light is visible only inside the glass and in the caustics it casts, never as a beam in the
   air` — say it in every prompt. Volumetric haze is the tell that ruins optics shots.
2. `one soft grounded contact shadow under every mount`.
3. `the faint green edge tint of real optical glass` — real glass is never colourless at the edge,
   and naming it instantly reads as photographed rather than rendered.
4. `shot on Phase One medium format, 100mm macro, f/5.6` — real optics beat any style adjective.
5. `narrow pale dispersion, a whisper of amber and cool blue at the fringes, never a rainbow`.
6. `knurled adjustment rings, bead-blasted posts, visible machining` — name the finishes.
7. Add one imperfection: `a faint dust speck on one filter face`, `one adjuster ring turned
   slightly out of true`, `a fingerprint smudge at the edge of a lens mount`. Perfection is the tell.
