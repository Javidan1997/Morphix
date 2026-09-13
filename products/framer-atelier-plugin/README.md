# Atelier Scaffolder — Framer plugin

Creates the Atelier design system and page skeleton on the Framer canvas in two
clicks, so you are not hand-building 13 styles and ten nested sections every
time you spin up a template.

The tokens live in `src/design.ts` — the same values as `TEMPLATE-GUIDE.md`.
That file is the machine-readable version of the guide: change a colour there,
re-run, and the project restyles.

---

## Running it

```bash
npm install
npm run dev
```

Then in Framer: **menu → Plugins → Open Development Plugin**.

> **If `npm run dev` fails with "Cannot find native binding"** — that is a
> [known npm bug](https://github.com/npm/cli/issues/4828) with optional
> dependencies, not this plugin. Fix:
> ```bash
> rm -rf node_modules package-lock.json && npm install
> ```
> If it persists on Windows, install the binding directly:
> `npm i --no-save @rolldown/binding-win32-x64-msvc`
> (on Apple silicon, `@rolldown/binding-darwin-arm64`).

Ad-blockers and Brave can block Framer from reaching localhost. Allowlist
`framer.com` if the plugin will not open.

---

## What it does

**1 — Create styles**

- 7 colour styles (`Atelier/Ink`, `Muted`, `Line`, `Surface`, `Canvas`, `Stage`,
  `Accent`), each with a dark-mode value
- 6 text styles (`Display`, `H2`, `H3`, `Body L`, `Body`, `Caption`) with the
  exact sizes, line heights and negative tracking from the guide, including
  responsive breakpoints at 810 and 390

Styles are matched **by name**, so re-running updates them instead of creating
duplicates. That is what makes this usable as a re-skinning tool and not just a
one-shot scaffold.

**2 — Build page skeleton**

Creates `Atelier — Page` at 1200px with ten sections nested inside it, each with
its stack direction, padding, gap, background and radius already set, plus the
column frames (Hero 7:5, Features 3×, Detail 5:7, FAQ 1:1.5) and a fixed-height
`Configurator Frame` in both stage columns.

---

## What it deliberately does not do

Two hard limits in Framer's plugin API (`@framer/plugin` v4), not choices:

**Text cannot be placed into a frame.** `addText(text, options)` returns `void`
and takes only a `tag` — no parent, no position. So the plugin builds the
skeleton and you type the copy from `TEMPLATE-GUIDE.md` into it. Every section
is named, so it is obvious where each block goes.

**Component instances cannot be parented.** `AddComponentInstanceOptions` has
only `url` and `attributes` — no `parentId`. If you paste the Configurator3D URL
the plugin adds one instance to the canvas and you drag it into a
`Configurator Frame`.

Both of these would be a few lines if Framer exposed them. If that changes,
`src/App.tsx` is where to add it.

---

## If you do want the MCP server as well

There is no official Framer MCP. The community one is **"MCP: AI Plugin"** by
Tommy D. Rossi on the Framer Marketplace: a Framer plugin, a Cloudflare Worker
at `mcp.unframer.co`, and a WebSocket tunnel.

1. Install the plugin from the Framer Marketplace and **open it** in the project
   you want to edit — it only works while the plugin is open
2. The plugin gives you a URL containing your own `id` and `secret`. The bare
   endpoint returns `401 Missing id and secret query parameters`, so the full
   URL it generates is the one you need
3. Register it locally — **not** in a committed file, because that URL contains
   a secret:

```bash
claude mcp add --scope local --transport http framer "https://mcp.unframer.co/mcp?id=YOUR_ID&secret=YOUR_SECRET"
```

`--scope local` keeps it in your machine-level Claude config instead of
`.mcp.json` in the repo. `.mcp.json` is gitignored here for exactly that reason.

For ChatGPT: Settings → Apps & Connectors → Advanced → **Developer Mode** on,
then **Create** and paste the same full URL. Needs a paid plan — Free accounts
cannot add custom MCP connectors.

Worth knowing before relying on it: your design data is tunnelled through a
third party's worker, and the server drives the same plugin API described above,
so it hits the same two limits.

---

## Why this and not an MCP server

An MCP server for Framer is a remote wrapper around this same plugin API — it
inherits every limitation above, and adds a tunnel plus a third party in the
path of your design data.

For a deterministic job like "build this exact template", a plugin is the better
tool: one click, same result every time, nothing leaves your machine, no tokens
spent. Use MCP for open-ended conversational edits, where a model deciding what
to do is the point.

---

## Files

```
src/design.ts   The design system as data — edit this to re-skin
src/App.tsx     Plugin UI and the two build routines
framer.json     Plugin manifest (id, name, modes, icon)
```

Change `framer.json`'s `name` and `icon` before publishing it anywhere.
