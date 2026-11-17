# Configuro Concepts — Shopify theme + tooling

One Online Store 2.0 theme that runs five concept brands, plus the backend
pieces each concept needs. The public demos on
`configuro.studio/shopify-templates/<slug>` are **rendered from this theme** (see
`scripts/templates/build-demos.mjs`), so what you see there is what installs.

```
shopify/
  theme/                         ← upload this (or `npm run theme:zip`)
    layout/theme.liquid          one layout; brand = template suffix (product.vela → vela)
    sections/                    cfg-* shared · vela-* · shadeline-* · ng-* · lc-* · aurel-*
    sections/*-group.json        per-brand header/footer section groups
    snippets/                    cfg-image (responsive), cfg-cart-drawer, cfg-icon …
    templates/                   product.vela · product.shadeline · page.northgate ·
                                 collection.linkcore · product.aurel + generic templates
    assets/cfg-core.js           shared runtime: Ajax Cart API, drawer, forms, dialogs
    assets/brand-*.css, *.js     per-brand styles and behaviour (no jQuery, no build step)
  definitions/                   metafield + metaobject definitions (JSON)
  scripts/                       Python: definitions + selling plans, Linkcore CSV importer
  functions/northgate-tier-discount/   Discount Function enforcing trade tiers at checkout
  northgate/hubspot-webhook/     customers/create → HubSpot; approval → customer tag
  demo/                          fixture data the public demo renders the theme against
```

## Install on a development store

1. **Theme** — `npm run theme:zip`, then *Online Store → Themes → Add theme →
   Upload zip* with `dist/configuro-concepts-theme.zip`. Or
   `shopify theme push --path shopify/theme` with Shopify CLI.
   `theme-check` passes with zero offenses.
2. **Definitions** — create a custom app (Settings → Apps → Develop apps) with
   `write_products`, `write_inventory`, `write_metaobject_definitions`,
   `write_purchase_options`, then:
   ```bash
   cd shopify/scripts
   export SHOPIFY_STORE=your-dev-store.myshopify.com SHOPIFY_ADMIN_TOKEN=shpat_…
   python setup_definitions.py                                  # idempotent
   python setup_definitions.py --vela-product gid://shopify/Product/123   # selling plans
   ```
3. **Products** — create them in admin (or import), then assign templates:

   | Concept | Resource | Template | Data it reads |
   |---|---|---|---|
   | Vela | product, option *Pack* (1/2/3 jars) | `product.vela` | selling plan group, `custom.ingredients` (metaobjects), variant `custom.pack_size`/`badge` |
   | Shadeline | product, options *Width band / Depth band / Finish* + add-on products `led-lighting`, `zip-screen`, `installation` | `product.shadeline` | `custom.price_rules` (JSON) |
   | Northgate | page + collection `trade-essentials` | `page.northgate` | `custom.price_tiers`, `custom.pack`, `custom.spec`, customer tag `trade-approved` |
   | Linkcore | collection | `collection.linkcore` | specs + `custom.compatibility` (run the importer) |
   | Aurel | product, options *Metal / Size* | `product.aurel` | `custom.engraving_max`, `custom.drop_at` |

   Every section falls back to the theme's rendered imagery, so pages look
   finished before you upload photos.
4. **Demo mode** (Theme settings → Demo mode) adds the "Concept demo" bar and
   footer note, keeps the cart in memory and disables checkout. It is **off**
   by default in `settings_data.json`; the public build turns it on.

## The engineering in each concept

**Vela — bundles + subscriptions.** Packs are variants, so inventory and
reporting stay native. Per-jar price and saving are computed in Liquid from
variant prices. Subscribe-and-save posts `selling_plan`. Without JS the form
still works (radios named `id`, select named `selling_plan`).
`vela.js` adds live pricing from `selling_plan_allocations`, image swaps and
the sticky bar. Renewals need a subscription app; Shopify's free
*Subscriptions* app is enough.

**Shadeline — configurator.** `assets/shadeline-pricing.js` is a pure module:
the browser uses it for the live quote, and `demo/shadeline.mjs` uses it to
generate the 45 band-variant prices. Use the same function in your price-sync
job so the quote always equals checkout. Exact sizes are snapped *up* to a
manufacturing band (the variant) and travel as `properties[Width (cm)]`,
`properties[Depth (cm)]`, `properties[Made in band]` and `_config_id`. Add-ons
are separate per-unit products added in the same `/cart/add.js` call, with
quantity = metres or m². Three.js (`shadeline-pergola.js`, shared with the
offline renderer) loads only after scroll or interaction, behind posters of
the same model.

**Northgate — B2B.** Gating is server-side Liquid
(`customer.tags contains 'trade-approved'`): guests never receive tier prices
in the HTML. The quick-order grid adds every line in one `/cart/add.js`
request and can reload `customer.orders.first`. Tier prices are enforced at
checkout by `functions/northgate-tier-discount` (a free custom app with an
automatic app discount; tests: `node --test shopify/functions/northgate-tier-discount/src/index.test.mjs`).
Applications use the native `create_customer` form with tag `trade-applicant`
and note fields.
`northgate/hubspot-webhook/server.mjs` verifies the Shopify HMAC, upserts the
HubSpot contact and creates a deal; HubSpot's approval webhook (v3 signature
verified) swaps the tag to `trade-approved`. Without `HUBSPOT_TOKEN` it runs in
stub mode and logs the calls instead. Tests:
`node --test shopify/northgate/hubspot-webhook/server.test.mjs`.

**Linkcore — catalog + compatibility.** `assets/linkcore-compat.js` is pure
and tested (`node scripts/templates/test-linkcore-compat.mjs`). It knows base
Apple-silicon Macs drive one external display, macOS doesn't do MST,
DisplayLink bypasses both, many docks drop to 4K30 with two screens, and
chargers can outrun the dock's power delivery. Computer profiles are section
blocks; product rules are the `custom.compatibility` metafield. Spec rows
are blocks naming a metafield key, so a new spec needs no code.

`scripts/linkcore_import.py` imports `scripts/data/linkcore_supplier.csv`:
```bash
python linkcore_import.py data/linkcore_supplier.csv --dry-run
python linkcore_import.py data/linkcore_supplier.csv          # needs the env vars above
python -m unittest -v                                         # offline tests, fake Admin API
```
It looks up each variant by SKU, stores a SHA-256 of the normalised product
in `custom.import_hash`, and only calls `productSet` when the hash changes.
Re-running the same file makes zero product writes. Stock syncs with an
absolute `inventorySetQuantities`, and THROTTLED responses back off using the
query cost.

**Aurel — drop.** Liquid compares `custom.drop_at` to `now` on render. Before
the drop the primary action is a waitlist (native `customer` form, tags
`waitlist,<handle>,drop-02`); `aurel.js` flips to *Add to bag* at zero
without a reload. Engraving is `properties[Engraving]` +
`properties[Engraving style]`. The input's `maxlength` comes from
`custom.engraving_max`, and characters an engraver can't cut are stripped as
you type.

## API versions

Scripts default to Admin API `2026-10` (`SHOPIFY_API_VERSION` overrides).
The Function targets the Discount API (`cart.lines.discounts.generate.run`,
`api_version = "2025-07"`). Check both against the store's supported
versions before deploying.
