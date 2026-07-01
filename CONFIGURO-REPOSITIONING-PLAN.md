# Configuro — Repositioning & Content Plan

**Date:** 2026-07-01
**Prepared from:** full read of `src/locales/en.js`, `pageMedia.js`, page components, `VideoBackground.jsx`
**Reviews applied:** UX copy, design critique, accessibility (WCAG 2.1 AA), user research, content modeling

---

## 0. The core problem in one sentence

The entire site says **"Configuro is a 3D visualization studio"** — but you now want it to say **"Configuro is an A‑to‑Z code + design solutions company"** whose 3D/render work is *one* of several offers. Every page, the meta description, the hero, the value props, the services list, the footer, and the pricing model are built around the old narrow positioning. This is a **repositioning**, not a copy tweak.

**Current positioning (in code today):**
> "Configuro is a 3D visualization studio. We produce photoreal architectural and product renders, interactive configurators, and immersive product websites…" — `en.js:5-7, 31-33`

**Target positioning:**
> A full-stack solutions partner that builds **software** (web, iOS, Android, configurators), **automates operations** (CRM setup + automation on Zoho, GoHighLevel, HubSpot), and **produces premium visual content** (3D renders, product renders, video/image production) — end to end, for high-end clients.

Everything below serves closing that gap.

---

## 1. Positioning & messaging architecture (do this first)

Decide the **umbrella story** before touching pages. Recommended framing:

> **Configuro — we design, build, and automate.**
> One partner for the software, the systems, and the visuals behind a premium product or brand.

Three co-equal **capability pillars** (this replaces the current "3D studio" single-pillar):

| Pillar | What it contains | Old site coverage |
|---|---|---|
| **Build** (Software) | Web apps, iOS & Android apps, 3D configurators, product/launch websites, e-commerce | Partially there (configurators, product sites) — apps totally missing |
| **Automate** (Systems) | CRM setup + full automation: Zoho, GoHighLevel (GHL), HubSpot; integrations, workflows, pipelines | **Completely absent** |
| **Visualize** (Design/3D) | 3D renders, product renders, architectural viz, video renders, image production, motion | Strong — this is basically the whole current site |

Positioning "spine" to reuse as a repeatable phrase across pages: **"Design → Build → Automate."** It reads as a lifecycle and signals A‑to‑Z.

**Why this structure (user-research + content-modeling rationale):** high-end buyers don't buy "3D renders"; they buy an outcome (a launched product, a working sales system, a brand that looks expensive). Leading with three verbs lets one visitor self-select into apps, another into CRM automation, another into renders — without making any of them feel like they're on the wrong site.

---

## 2. Page-by-page content analysis + rewrite plan

### 2.1 Home (`en.js` hero / valueProps / servicesPreview / portfolioPreview / trust / homeCta)

**Current state**
- `meta.title`: "Configuro | 3D Visualization & Product Studio" → too narrow.
- `hero.headline`: "We make spaces and products people want to explore." → beautiful but pure 3D/spatial framing.
- `hero.subline`: explicitly self-defines as "a 3D visualization studio."
- `servicesPreview.items`: 4 items, all render/3D/launch — no software, no CRM.
- `trust`: metrics are render-centric ("100+ renders produced", "9 project types") — weak, vanity, and 3D-only.

**Change plan**
1. `meta.title` → "Configuro | Design, Build & Automate — Software, Systems & 3D" (or shorter, see UX-copy §4).
2. New hero headline options (see §4).
3. Rebuild `servicesPreview` into the **3 pillars + a peek at sub-services** (6 cards): Web & Mobile Apps · 3D Configurators · Product & Launch Sites · CRM Automation (Zoho/GHL/HubSpot) · 3D & Product Renders · Video & Image Production.
4. Replace vanity metrics with **outcome metrics** framed around all three pillars (e.g. "Apps, sites & systems shipped", "CRM workflows automated", "Renders & films delivered"). If real numbers don't exist yet, use qualitative trust signals instead of inventing stats (see a11y/ethics note in §6 — don't fabricate).
5. Add a **logo/tech strip** ("Works with Zoho · GoHighLevel · HubSpot · React · Swift · Kotlin · WebGL") — instantly communicates the expanded scope to high-end buyers scanning for capability.

### 2.2 Services (`en.js` servicesPage)

This is the **most important page for the repositioning** and needs the biggest rework.

**Current state:** 7 services, all product/3D/launch-website flavored (`servicesPage.services[]`). No apps, no CRM/automation. Copy is well-written but scoped to "premium/configurable products."

**Change plan — restructure into 3 grouped pillars:**

- **Build (Software)**
  - Web Applications & Platforms — dashboards, portals, SaaS front-ends, APIs
  - iOS & Android Apps — native/cross-platform, from MVP to production
  - 3D Product Configurators — *(keep existing copy, it's strong)*
  - Product & Launch Websites — *(keep)*
  - E-commerce / Commerce-Ready Pages — *(keep)*
- **Automate (Systems)** — *net-new section*
  - CRM Setup & Migration — Zoho, GoHighLevel, HubSpot
  - Sales & Marketing Automation — pipelines, workflows, lead routing, email/SMS
  - Integrations — connect CRM to site, forms, payments, calendars, data
  - "Full automation" outcome copy — reduce manual ops, faster follow-up, no leads lost
- **Visualize (Design/3D)**
  - 3D Product Configurators cross-links here too
  - Architectural & Product Renders — *(keep; move from Home)*
  - Renders, Images & Film — *(keep existing strong copy at `en.js:184-187`)*
  - Technical Explainers / Interactive Demos — *(keep)*

Keep the existing **process** (Discovery → Direction → Build → Release, `en.js:301-327`) — it's good and now needs to also mention automation/QA handoff.

### 2.3 Work (`en.js` workPage + `data/projects.js`)

**Current state:** 5 projects, all viz/product-website case studies. CTA "Want your project visualized like this?" (`Work.jsx:102`) reinforces the 3D-only frame. Background video is a spinning luxury watch (`showcase-watch.mp4`) — see §5.

**Change plan**
1. Add categories/filter tags for the new pillars so the filter (`Work.jsx:34`) can show **Apps · Configurators · Websites · CRM Automation · 3D & Film**. The filter UI already exists — it just needs categories that reflect all pillars.
2. Add at least **2–3 case studies outside pure 3D**: one app, one CRM-automation engagement, one full "design+build+automate" project. Even if anonymized/representative, they must exist so the page proves the new claims. **Do not leave the new pillars unproven** — an unproven claim on a high-end pitch is worse than not making it.
3. Rewrite the closing CTA from "visualized" → outcome-neutral: e.g. "Have a project like this in mind?"
4. Each case study should follow the case-study rhythm already scaffolded in `pageMedia.workMediaGallery` (opener → before/after → detail → interaction → proof).

### 2.4 Pricing (`en.js` pricingPage)

**Current state:** 3 tiers (Foundation $4,900 / Growth $14,900 / Custom) scoped entirely to "product page / product website / configurator." No path to price an **app build** or a **CRM automation** engagement.

**Change plan**
- Option A (recommended for high-end): **de-emphasize fixed prices**, move to **engagement models** — "Project" (fixed scope), "Retainer" (ongoing build/automation), "Custom." Fixed low prices ($4,900) can *cheapen* perception for high-end clients and don't fit app/CRM scopes.
- Option B: keep tiers but add a **CRM/Automation** starting point and an **App build** starting point, and make "Custom / Let's talk" the visual hero.
- Update FAQ (`en.js:415-432`) — the "2–3 weeks" timeline is unrealistic for app or CRM work; segment timelines by pillar.

### 2.5 About (`en.js` aboutPage)

**Current state:** "A studio built for product teams… combines design, engineering, and 3D craft." Close, but still "studio," still product-launch framed.

**Change plan:** widen to "a team that designs, builds, and automates." Keep the three principles (they're good) but reframe principle copy so "engineering" and "automation" are visibly first-class, not just supporting 3D. Add a short line on the tech + platform breadth (mobile, web, CRM ecosystems) to reassure enterprise buyers.

### 2.6 Contact (`en.js` contactPage wizard)

**Current state:** Strong multi-step wizard, but the option sets are 3D/product-website-shaped:
- `groups.projectType.options`: configurator / product-site / launch-site / interactive-demo / redesign — **no "Mobile app," no "Web app," no "CRM automation."**
- `groups.deliverables.options`: strategy / UI+frontend / Three.js / 3D models / renders / CMS — **no backend, no mobile, no CRM/automation.**

**Change plan:** extend both option groups to cover the new pillars:
- projectType += `web-app`, `mobile-app`, `crm-automation`.
- deliverables += `backend-api`, `mobile-dev`, `crm-automation`, `integrations`.
- Add a "Which platforms/tools?" optional group (Zoho / GHL / HubSpot / iOS / Android / Web).
This is low-effort, high-impact: it's the clearest signal to a lead that you actually do this work.

---

## 3. Information architecture / navigation

Current nav: Home · Services · Live demo · Templates · Work · Pricing · About · Contact (`en.js:18-28`).

**Recommendations**
- Keep top-level lean. Consider a **Services mega-item or the 3-pillar split** surfaced in nav or on the Services landing.
- "Live demo" (Playground) and "Templates" are strong proof assets for the **Build** pillar — keep them but frame them as "see our configurator tech live," which now supports the software story, not just 3D.
- Add a persistent primary CTA "Start a project" (already present) — good.

---

## 4. UX-copy findings (skill: /ux-copy)

**Repositioning-level copy issues (highest priority):**

| Location | Issue | Fix |
|---|---|---|
| `meta.description`, `hero.subline`, `footer.copy` | Hard-codes "3D visualization studio" | Rewrite to the design/build/automate umbrella |
| `servicesPreview`, `footer.services` | Service lists omit apps + CRM entirely | Add Build/Automate items |
| `Work.jsx:102` "visualized like this?" | Locks Work into 3D-only | Neutral outcome CTA |
| `trust` metrics | Render-count vanity metrics, 3D-only | Outcome metrics across pillars, or qualitative trust if numbers aren't real |

**Hero headline candidates (verb-led, outcome-first, for high-end tone):**

| Option | Copy | Best for |
|---|---|---|
| A (recommended) | "We design, build, and automate — end to end." | Clear A‑to‑Z signal, matches the pillar spine |
| B | "One team for the software, the systems, and the story." | Emphasizes single-partner / no-handoff |
| C | "Premium products deserve a premium build — and a system behind it." | Leans into high-end + automation |

Keep the existing craft in the writing — it's genuinely good. The problem isn't quality, it's **scope**. Reuse the current tone; widen the subject.

**Consistency note:** the site currently mixes "studio" (3D framing) with "team"/"partner." Pick one primary self-label. Recommended: **"studio" → "team/partner"** to shed the 3D-only connotation, but keep "studio-grade" as a *quality* adjective for the visual work.

---

## 5. Design critique + background video plan (skill: /design-critique)

**What works:** the light "Bright Studio" theme, editorial layout, scroll-scrubbed cinematic background, and the real WebGL configurator are genuinely premium and differentiate you. Don't lose them.

**Background video — the specific concern.** Videos are mapped by route in `VideoBackground.jsx:9-18`:

| Route | Current clip | Verdict | Recommendation |
|---|---|---|---|
| `/` | `configuro-bg.mp4` | Keep | Brand-neutral, fine as the anchor |
| `/services` `/templates` `/playground` | `assembly-camera.mp4` | OK | Assembly/exploded motion reads as "we build" — good for Services |
| `/work` | `showcase-watch.mp4` (spinning watch) | ❌ Off | A spinning product loop competes with the case-study grid and signals "we make watch renders," not "we ship apps/systems." Replace with a **calm, abstract, low-contrast** loop (soft gradient/particle/subtle grid) OR a muted montage of *your* work. Product-hero loops belong on a product page, not behind a portfolio index. |
| `/pricing` `/contact` | `hero-mercedes.mp4` | ⚠️ Risky | A Mercedes behind pricing/contact implies "automotive render shop." Swap for something abstract/neutral so it doesn't narrow perception. |
| `/about` | `drone-reveal.mp4` | OK-ish | Fine if it reads as place/scale, not a specific product vertical. |

**Design principle to apply site-wide:** background video should be **atmosphere, not subject.** The moment a viewer can name the product in the background (watch, Mercedes), the video starts *defining* your company as "the people who render that." For a multi-service agency, backgrounds should be **abstract, textural, and low-contrast** so they never contradict the pillar the page is selling — and so text stays readable (see a11y §6).

**Other design findings:**
- **Contrast risk:** light theme + bright video behind text. The `cinematic-vig` overlay helps but must guarantee a minimum scrim on text areas (see a11y).
- **Hierarchy:** with 3 pillars incoming, Services and Home need clear grouping (section headers per pillar) or the page becomes a flat list of 12+ services.
- **Consistency:** "studio" vs "team," metric styles, and CTA labels ("Start a project" vs "Get in touch" vs "Get started" vs "Send brief") drift across pages — standardize the primary CTA to one phrase.

---

## 6. Accessibility audit (skill: /accessibility-review, WCAG 2.1 AA)

Likely issues given the current build (verify in browser during implementation):

**Perceivable**
- **1.4.3 Contrast (🔴 Critical):** text over full-bleed video on a light theme. Must maintain ≥4.5:1 for body text regardless of video frame. Fix: stronger/adaptive scrim behind text blocks, not just a vignette.
- **1.1.1 Non-text (🟡):** background videos are correctly `aria-hidden` (`VideoBackground.jsx:95`) — good. Ensure all **meaningful** gallery images have real alt text (Work uses `image.alt` — verify `data/projects.js` alts are descriptive, not filenames).

**Operable**
- **2.3.1 / motion (🟡):** scroll-scrubbed video + reveal animations. `VideoBackground.jsx:29` already checks `prefers-reduced-motion` — confirm the reveal animations do too, and that content is fully visible when motion is reduced.
- **2.1.1 Keyboard (🟡):** Work lightbox, filter tabs (`role="tablist"`), and the language switcher must be fully keyboard operable; lightbox needs focus trap + Escape (skill checklist).
- **2.4.7 Focus visible (🟡):** confirm visible focus rings on all custom buttons (pills, swatches, wizard steps) against the light theme.
- **2.5.5 Target size (🟢):** swatch/pill controls in the configurator and filter pills should be ≥44×44px.

**Understandable**
- **3.3.1/3.3.2 Forms (🟡):** contact wizard and home enquiry need programmatic labels + inline error identification (verify each field has an associated `<label>` and error text, not just placeholders — placeholders alone fail).

**Robust**
- **4.1.2 (🟡):** custom tabs, wizard steps, and language switcher need correct name/role/value and state (`aria-selected` is present on filters — good; audit wizard steps similarly).

**Ethics note (research + a11y overlap):** don't ship fabricated metrics ("3× time on page," "50% fewer inquiries") for the new pillars you can't yet prove. High-end buyers verify. Use real or clearly illustrative-labeled numbers.

---

## 7. User research plan (skill: /user-research) — de-risk before big spend

You have **no research data yet**, and this is a positioning bet. Cheapest way to avoid building the wrong site:

**Objective:** validate that (a) the 3-pillar story is credible from one vendor, (b) high-end buyers understand "we do apps *and* CRM *and* 3D" without thinking "jack of all trades," (c) the words they use for CRM automation match your labels.

**Method 1 — 5–8 buyer interviews (2–3 weeks, highest value).**
- Who: 5–8 people who are your *actual* target — founders/marketing leads/ops leads at premium product or property/hospitality brands, ideally past or prospective clients.
- Guide (reuse the skill's structure): warm-up → their current vendor setup (do they use one partner or many?) → reactions to the 3-pillar page → do they believe one team can do all three? → what proof would they need?
- Deliverable: themes + the exact objections to preempt in copy.

**Method 2 — first-click / 5-second test on 2 hero options (1 week, cheap).**
- Show 15–20 target-adjacent people the current hero vs. a repositioned hero; ask "what does this company do?" If they can't name apps + automation + 3D, the copy failed.

**Method 3 — card sort on services (1 week).**
- Give 15–30 participants the ~12 services and let them group them. Validates whether Build/Automate/Visualize is *their* mental model or just yours. Directly informs IA (§3) and content model (§8).

**Sequencing:** Method 2 + 3 can run this week (low cost, unblock copy/IA). Method 1 runs in parallel to inform Work case studies and objection-handling.

---

## 8. Content-model findings (skill: /content-modeling-best-practices)

**Current model:** all copy is **page-shaped, presentation-coupled, and duplicated 4×** across `en.js / az.js / ru.js / tr.js` (plus `pageMedia.js` per language). Adding pillars multiplies this problem: every new service must be hand-edited in 4 files, in nested arrays tied to a specific page layout.

**Principle violations flagged by the skill:**
- **"Content is data, not pages":** services/case-studies are modeled as slices of a page object, not as reusable entities. A "Service" can't be reused across Home preview, Services page, and Footer without copy-paste (it *is* copy-pasted today: `servicesPreview`, `servicesPage.services`, `footer.services` are three separate hand-maintained lists of the same offering).
- **"Single source of truth":** the same service appears in 3+ places per language × 4 languages = high drift risk (already visible — footer services ≠ services-page services).
- **Editor-centric:** non-devs can't safely edit deeply nested JS arrays.

**Recommended model (target entities):**
- **Service** (name, pillar[Build/Automate/Visualize], summary, body, tags, icon, related work[]) — referenced everywhere, authored once.
- **CaseStudy / Work** (title, client, pillars[], summary, outcome, media[], services[]) — references Services; powers Work filter + Home preview.
- **Pillar** (taxonomy: Build/Automate/Visualize) as a **faceted tag**, so Work and Services filter by the same taxonomy.
- **Page** documents compose *references* to Services/CaseStudies rather than embedding copy.
- **Localization:** move from 4 parallel files to **field-level localization** (one document, translated fields) so structure changes once, not four times.

**Two implementation paths:**
- **Path A (low effort, no CMS):** refactor locales into a **shared language-neutral structure** (`services.js`, `caseStudies.js` with `{en, az, ru, tr}` per field) + thin page files that reference them by id. Kills duplication, keeps the current stack. **Recommended near-term.**
- **Path B (higher effort, future-proof):** adopt a headless CMS (Sanity fits the multi-language + reference model well) so non-devs can add services/case studies and translate field-by-field. Worth it if content will change often or non-devs will edit. Consider after positioning is validated (§7).

**Taxonomy note:** define the Build/Automate/Visualize facet **once** and reuse it for Services filter, Work filter, and Contact wizard options — one vocabulary across the whole site (this also fixes the drift problem).

---

## 9. Prioritized action plan

**Phase 0 — Decide (this week)**
- Lock the umbrella positioning + pillar names (§1). Approve one hero direction (§4).
- Run cheap research: 5-second hero test + services card sort (§7 methods 2–3).

**Phase 1 — Reposition the words (1–2 weeks, highest ROI)**
- Rewrite meta, hero, value props, Services page (3-pillar restructure), footer, About.
- Extend Contact wizard options (apps, CRM, platforms) — low effort, big signal.
- Fix Work CTA + add pillar categories to the filter.
- Add Zoho/GHL/HubSpot + tech logo strip.

**Phase 2 — Prove it (2–4 weeks)**
- Produce 2–3 non-3D case studies (app, CRM automation, full design+build+automate).
- Rework Pricing into engagement models / add app + CRM starting points.
- Swap background videos: Work + Pricing/Contact to abstract/neutral loops (§5).

**Phase 3 — Restructure the content model (parallel / after validation)**
- Path A refactor: shared Services/CaseStudies entities, field-level localization (§8).
- Re-audit accessibility in-browser against the checklist (§6).
- (Optional) Path B: headless CMS migration.

**Phase 4 — Polish**
- Standardize primary CTA wording, contrast scrims, focus states, reduced-motion parity.

---

## 10. Decisions — LOCKED (2026-07-01)

1. **Positioning label:** ✅ **Team / Partner.** Drop "studio" as the self-label; keep "studio-grade" only as a quality adjective for the visual work.
2. **Pillar names:** ✅ **Build / Automate / Visualize** ("Design → Build → Automate").
3. **CRM emphasis:** ✅ **Co-equal pillar** — "Automate" (Zoho / GHL / HubSpot) sits beside Build and Visualize as a top-level pillar.
4. **Pricing:** ✅ **Engagement models / "Let's talk."** Remove fixed low prices ($4,900 etc.); use Project / Retainer / Custom framing. Rewrite Pricing page + FAQ accordingly.
5. **Content model:** ✅ **Path A** — refactor locales into shared Service/CaseStudy entities with field-level localization, in the existing stack (no CMS yet). Revisit Path B (CMS) after positioning is validated.

**Still open (not blockers for Phase 1 copy work):**
- **Proof:** do real app/CRM case studies exist to publish, or do we need representative/anonymized ones for Phase 2 Work page?
