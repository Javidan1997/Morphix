// Shadeline price rules — pure functions, no DOM.
//
// The rules live in the product metafield `custom.price_rules` (JSON) so the
// merchant edits them in Shopify admin. The same function:
//   • prices the live configurator in the browser (shadeline-configurator.js)
//   • generates the size-band variant prices (shopify/demo/shadeline.mjs and
//     the price-sync step documented in shopify/README.md), so what the buyer
//     sees is exactly what Shopify charges at checkout.
//
// Shopify can't price a line from free-form properties without Plus/Functions,
// so exact sizes are snapped UP to the nearest manufacturing band (a real
// variant) and the exact cut size travels as line-item properties.

export const DEFAULT_RULES = {
  version: "2026-11",
  bands: { width: [300, 400, 500, 600, 700], depth: [300, 400, 500] },
  limits: { width: [250, 700], depth: [250, 500] },
  base: 240000, // cents: frame, motor, controller
  perSquareMetre: 31000, // cents per m² of band area
  finishes: { Anthracite: 0, Sand: 4, "Signal white": 4 }, // % surcharge
  addons: {
    lighting: { label: "LED louvre lighting", unit: "m", perUnit: 4500, basis: "perimeter" },
    screens: { label: "ZIP side screen", unit: "m", perUnit: 18500, basis: "screen_width" },
    install: { label: "Professional installation", unit: "m²", perUnit: 6500, basis: "area" },
  },
};

/** Smallest band ≥ value (values above the last band are clamped). */
export function bandFor(value, bands) {
  return bands.find((b) => b >= value) ?? bands[bands.length - 1];
}

const clamp = (v, [lo, hi]) => Math.min(hi, Math.max(lo, v));

/**
 * @param {object} config  { width, depth } in cm, finish, lighting, screens (count of sides), install
 * @param {object} rules   price rules (metafield JSON); defaults to DEFAULT_RULES
 * @returns {object}       { band, frame, addons[], total } — all money in cents
 */
export function quote(config, rules = DEFAULT_RULES) {
  const width = clamp(Math.round(config.width), rules.limits.width);
  const depth = clamp(Math.round(config.depth), rules.limits.depth);
  const band = { width: bandFor(width, rules.bands.width), depth: bandFor(depth, rules.bands.depth) };
  const bandArea = (band.width / 100) * (band.depth / 100);
  const surcharge = rules.finishes[config.finish] ?? 0;
  const frame = Math.round(((rules.base + rules.perSquareMetre * bandArea) * (100 + surcharge)) / 100 / 100) * 100;

  const addons = [];
  const qty = {
    perimeter: Math.ceil((2 * (width + depth)) / 100),
    screen_width: Math.ceil((config.screens || 0) * (width / 100)),
    area: Math.ceil((width / 100) * (depth / 100)),
  };
  for (const [key, addon] of Object.entries(rules.addons)) {
    const on = key === "screens" ? (config.screens || 0) > 0 : Boolean(config[key]);
    if (!on) continue;
    const quantity = qty[addon.basis];
    // Add-ons are their own products priced per unit; the cart line quantity is
    // the unit count (metres, m²), so checkout recomputes the same total.
    const price = quantity * addon.perUnit;
    addons.push({ key, label: addon.label, quantity, unit: addon.unit, unitPrice: addon.perUnit, price });
  }
  return {
    width,
    depth,
    area: +((width / 100) * (depth / 100)).toFixed(2),
    band,
    surcharge,
    frame,
    addons,
    total: frame + addons.reduce((n, a) => n + a.price, 0),
    version: rules.version,
  };
}
