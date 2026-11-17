// Shopify-compatible Liquid renderer for the public template demos.
//
// The demos on configuro.studio/templates/<slug> are not hand-written copies of
// the Shopify theme: they are rendered FROM the theme in shopify/theme with
// LiquidJS, against fixture data in shopify/demo. This module implements the
// subset of Shopify's Liquid the theme uses:
//
//   tags     {% schema %} {% form %} {% style %} {% sections %} {% section %}
//   filters  asset_url stylesheet_tag preload_tag image_url money* t handleize
//   render   JSON templates and section groups, with schema defaults merged
//            into section.settings / block.settings like the storefront does.
//
// Anything outside that subset fails loudly so the theme cannot drift into
// markup the demo build silently renders wrong.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Liquid, Tag, Hash } from "liquidjs";

const FORM_ACTIONS = {
  product: "/cart/add",
  customer: "/contact#contact_form",
  contact: "/contact#contact_form",
  create_customer: "/account",
  customer_login: "/account/login",
};

/** Read a Liquid file's {% schema %} JSON. */
export function readSchema(source, file = "section") {
  const match = source.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`Invalid {% schema %} JSON in ${file}: ${error.message}`);
  }
}

function defaultsFor(settings = []) {
  const out = {};
  for (const s of settings) {
    if (!s.id) continue; // header / paragraph entries
    if ("default" in s) out[s.id] = s.default;
    else if (s.type === "checkbox") out[s.id] = false;
    else out[s.id] = null;
  }
  return out;
}

function kwargs(args) {
  const out = {};
  const positional = [];
  for (const a of args) {
    if (Array.isArray(a) && a.length === 2 && typeof a[0] === "string") out[a[0]] = a[1];
    else positional.push(a);
  }
  return { out, positional };
}

const escAttr = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

export function createShopifyEngine({ themeDir, assetBase, assetVersion, locale, data }) {
  const engine = new Liquid({
    root: [join(themeDir, "sections"), join(themeDir, "layout")],
    partials: [join(themeDir, "snippets")],
    extname: ".liquid",
    cache: true,
    strictFilters: true,
    // Shopify treats "" and [] as truthy too; keep Ruby truthiness.
    jsTruthy: false,
    orderedFilterParameters: true,
  });

  // ---------------------------------------------------------------- filters
  const assetUrl = (name) => `${assetBase}${name}${assetVersion ? `?v=${assetVersion}` : ""}`;
  engine.registerFilter("asset_url", assetUrl);
  engine.registerFilter("stylesheet_tag", (url) => `<link href="${url}" rel="stylesheet" type="text/css" media="all">`);
  engine.registerFilter("script_tag", (url) => `<script src="${url}" type="text/javascript"></script>`);
  engine.registerFilter("preload_tag", (url, ...args) => {
    const { out } = kwargs(args);
    const as = out.as || "style";
    const extra = as === "font" ? ` type="font/woff2" crossorigin` : "";
    return `<link rel="preload" href="${url}" as="${as}"${extra}>`;
  });
  engine.registerFilter("inline_asset_content", (name) => readFileSync(join(themeDir, "assets", name), "utf8"));

  // image_url: real fixtures carry the widths that exist on disk
  // ({ src: "vela-jar", sizes: [480, 800, 1200], ext: "webp" }); pick the
  // smallest file that covers the requested width, as Shopify's CDN would.
  engine.registerFilter("image_url", (image, ...args) => {
    if (image == null || image === "") return "";
    if (typeof image === "string") return image.startsWith("http") || image.startsWith("/") ? image : assetUrl(image);
    const { out } = kwargs(args);
    const want = Number(out.width) || 0;
    if (image.url) return image.url;
    const sizes = image.sizes || [image.width];
    const pick = sizes.find((w) => w >= want) || sizes[sizes.length - 1];
    return assetUrl(`${image.src}-${pick}.${image.ext || "webp"}`);
  });

  const money = (cents, { trailing = true, currency = false } = {}) => {
    const n = Number(cents || 0) / 100;
    let s = n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (!trailing) s = s.replace(/\.00$/, "");
    return `${data.shop.currency_symbol || "$"}${s}${currency ? ` ${data.shop.currency}` : ""}`;
  };
  engine.registerFilter("money", (c) => money(c));
  engine.registerFilter("money_without_trailing_zeros", (c) => money(c, { trailing: false }));
  engine.registerFilter("money_with_currency", (c) => money(c, { currency: true }));
  engine.registerFilter("handleize", (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  engine.registerFilter("handle", (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  engine.registerFilter("t", (key, ...args) => {
    const { out } = kwargs(args);
    const value = String(key).split(".").reduce((node, k) => (node == null ? node : node[k]), locale);
    if (value == null) throw new Error(`Missing translation: ${key}`);
    const text = typeof value === "object" ? (Number(out.count) === 1 ? value.one : value.other) : value;
    return String(text).replace(/{{\s*(\w+)\s*}}/g, (_, k) => (k in out ? out[k] : ""));
  });
  // Shopify semantics: integer ÷ integer floors (liquidjs divides as floats).
  engine.registerFilter("divided_by", (a, b) => {
    const x = Number(a), y = Number(b);
    return Number.isInteger(x) && Number.isInteger(y) ? Math.floor(x / y) : x / y;
  });
  engine.registerFilter("json", (v) => JSON.stringify(v ?? null).replace(/</g, "\\u003c"));

  // ------------------------------------------------------------------- tags
  // {% schema %}: section metadata for the theme editor; renders nothing.
  engine.registerTag("schema", class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      while (remain.length) {
        const t = remain.shift();
        if (t.name === "endschema") return;
      }
      throw new Error("{% schema %} not closed");
    }
    render() { return ""; }
  });

  class BlockTag extends Tag {
    constructor(token, remain, liquid, parser, endName) {
      super(token, remain, liquid);
      this.templates = [];
      const stream = parser.parseStream(remain);
      stream
        .on(`tag:${endName}`, () => stream.stop())
        .on("template", (tpl) => this.templates.push(tpl))
        .on("end", () => { throw new Error(`{% ${token.name} %} not closed`); });
      stream.start();
    }
  }

  engine.registerTag("style", class extends BlockTag {
    constructor(token, remain, liquid, parser) { super(token, remain, liquid, parser, "endstyle"); }
    * render(ctx, emitter) {
      emitter.write("<style>");
      yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
      emitter.write("</style>");
    }
  });

  // {% form 'product', product, id: 'x', class: 'y' %}
  engine.registerTag("form", class extends BlockTag {
    constructor(token, remain, liquid, parser) {
      super(token, remain, liquid, parser, "endform");
      const m = token.args.match(/^\s*(['"])(\w+)\1\s*(?:,\s*([a-z_][\w.]*)(?=\s*(?:,|$)))?\s*,?\s*(.*)$/s);
      if (!m) throw new Error(`Unsupported form arguments: ${token.args}`);
      this.formType = m[2];
      if (!FORM_ACTIONS[this.formType]) throw new Error(`Unsupported form type: ${this.formType}`);
      this.hash = new Hash(m[4] || "");
    }
    * render(ctx, emitter) {
      const attrs = yield this.hash.render(ctx);
      const extra = Object.entries(attrs)
        .filter(([, v]) => v != null && v !== false)
        .map(([k, v]) => ` ${k}="${escAttr(v)}"`)
        .join("");
      const enctype = this.formType === "product" ? ` enctype="multipart/form-data"` : "";
      emitter.write(`<form method="post" action="${FORM_ACTIONS[this.formType]}" accept-charset="UTF-8"${enctype}${extra}>`);
      emitter.write(`<input type="hidden" name="form_type" value="${this.formType}"><input type="hidden" name="utf8" value="✓">`);
      yield this.liquid.renderer.renderTemplates(this.templates, ctx, emitter);
      emitter.write("</form>");
    }
  });

  // {% sections 'vela-header-group' %} and {% section 'name' %}
  const renderer = { renderSection: null, renderGroup: null };
  engine.registerTag("sections", class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      this.group = token.args.trim().replace(/^['"]|['"]$/g, "");
    }
    * render(ctx, emitter) {
      emitter.write(yield renderer.renderGroup(this.group, ctx.getAll()));
    }
  });
  engine.registerTag("section", class extends Tag {
    constructor(token, remain, liquid) {
      super(token, remain, liquid);
      this.name = token.args.trim().replace(/^['"]|['"]$/g, "");
    }
    * render(ctx, emitter) {
      emitter.write(yield renderer.renderSection(this.name, { type: this.name }, ctx.getAll()));
    }
  });

  // --------------------------------------------------------------- sections
  const schemaCache = new Map();
  function sectionSource(type) {
    const file = join(themeDir, "sections", `${type}.liquid`);
    if (!existsSync(file)) throw new Error(`Section not found: sections/${type}.liquid`);
    if (!schemaCache.has(type)) {
      const src = readFileSync(file, "utf8");
      schemaCache.set(type, { src, schema: readSchema(src, file) });
    }
    return schemaCache.get(type);
  }

  // Resolve resource settings (product / collection pickers) to objects.
  function resolveSetting(def, value) {
    if (!def || value == null) return value;
    if (def.type === "product" && typeof value === "string") return data.all_products[value] ?? null;
    if (def.type === "collection" && typeof value === "string") return data.collections[value] ?? null;
    if (def.type === "product_list" && Array.isArray(value)) return value.map((h) => data.all_products[h]).filter(Boolean);
    return value;
  }
  function settingsFor(defs = [], given = {}) {
    const merged = { ...defaultsFor(defs), ...given };
    for (const def of defs) if (def.id) merged[def.id] = resolveSetting(def, merged[def.id]);
    return merged;
  }

  async function renderSection(id, entry, globals, wrapperId = `shopify-section-${id}`) {
    const { src, schema } = sectionSource(entry.type);
    const order = entry.block_order || Object.keys(entry.blocks || {});
    const blocks = order
      .filter((key) => entry.blocks[key] && !entry.blocks[key].disabled)
      .map((key) => {
        const b = entry.blocks[key];
        const def = (schema.blocks || []).find((t) => t.type === b.type);
        if (!def) throw new Error(`Block type "${b.type}" is not declared in sections/${entry.type}.liquid`);
        return {
          id: key,
          type: b.type,
          settings: settingsFor(def.settings, b.settings),
          shopify_attributes: `data-shopify-editor-block="${escAttr(JSON.stringify({ id: key, type: b.type }))}"`,
        };
      });
    if (schema.max_blocks && blocks.length > schema.max_blocks) {
      throw new Error(`sections/${entry.type}.liquid allows ${schema.max_blocks} blocks, got ${blocks.length}`);
    }
    const section = { id, settings: settingsFor(schema.settings, entry.settings), blocks };
    const html = await engine.parseAndRender(src, { ...globals, section });
    const tag = schema.tag || "div";
    const cls = ["shopify-section", schema.class].filter(Boolean).join(" ");
    return `<${tag} id="${wrapperId}" class="${cls}">${html}</${tag}>`;
  }

  async function renderGroup(name, globals) {
    const file = join(themeDir, "sections", `${name}.json`);
    if (!existsSync(file)) throw new Error(`Section group not found: sections/${name}.json`);
    const group = JSON.parse(readFileSync(file, "utf8"));
    const out = [];
    for (const key of group.order) {
      const entry = group.sections[key];
      if (entry.disabled) continue;
      out.push(await renderSection(key, entry, globals, `shopify-section-sections--${name}__${key}`));
    }
    return out.join("\n");
  }
  renderer.renderSection = renderSection;
  renderer.renderGroup = renderGroup;

  async function renderTemplate(templateName, globals) {
    const file = join(themeDir, "templates", `${templateName}.json`);
    const template = JSON.parse(readFileSync(file, "utf8"));
    const parts = [];
    for (const key of template.order) {
      const entry = template.sections[key];
      if (entry.disabled) continue;
      parts.push(await renderSection(key, entry, globals));
    }
    const layout = template.layout === false ? null : template.layout || "theme";
    const content = parts.join("\n");
    if (!layout) return content;
    const layoutSrc = readFileSync(join(themeDir, "layout", `${layout}.liquid`), "utf8");
    return engine.parseAndRender(layoutSrc, { ...globals, content_for_layout: content });
  }

  return { engine, renderTemplate, renderSection, settingsFor, sectionSource };
}

/** Merge settings_schema.json defaults with settings_data.json "current". */
export function themeSettings(themeDir) {
  const schema = JSON.parse(readFileSync(join(themeDir, "config", "settings_schema.json"), "utf8"));
  const data = JSON.parse(readFileSync(join(themeDir, "config", "settings_data.json"), "utf8"));
  const out = {};
  for (const group of schema) for (const s of group.settings || []) if (s.id) out[s.id] = s.default ?? (s.type === "checkbox" ? false : null);
  const current = typeof data.current === "string" ? data.presets[data.current] : data.current;
  return { ...out, ...current };
}
