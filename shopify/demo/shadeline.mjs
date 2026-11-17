// Shadeline fixture: one pergola product with Width band × Depth band × Finish
// variants. Variant prices are produced by the SAME quote() function the
// configurator uses, from the same rules stored in custom.price_rules.
import { img, mf, product } from "./helpers.mjs";
import { DEFAULT_RULES, quote } from "../theme/assets/shadeline-pricing.js";

const rules = DEFAULT_RULES;
const finishes = Object.keys(rules.finishes);
const variants = [];
for (const w of rules.bands.width)
  for (const d of rules.bands.depth)
    for (const f of finishes)
      variants.push({
        option1: `${w} cm`,
        option2: `${d} cm`,
        option3: f,
        sku: `SL-${w}-${d}-${f.slice(0, 2).toUpperCase()}`,
        price: quote({ width: w, depth: d, finish: f }, rules).frame,
      });

const pergola = product({
  handle: "louvred-pergola",
  title: "Shadeline Louvred Pergola",
  options: ["Width band", "Depth band", "Finish"],
  // 420 × 340 cm defaults → 500 × 400 band, Anthracite.
  selectedIndex: variants.findIndex((v) => v.option1 === "500 cm" && v.option2 === "400 cm" && v.option3 === "Anthracite"),
  variants,
  featured_image: img("shadeline-poster-anthracite", 1600, 1200, "Anthracite louvred pergola"),
  metafields: { custom: { price_rules: mf(rules, "json") } },
});

const addon = (handle, title, price) =>
  product({ handle, title, variants: [{ price, sku: handle.toUpperCase() }], featured_image: img("shadeline-top", 1200, 1200, title, [480, 800, 1200]) });

const products = {
  "louvred-pergola": pergola,
  "led-lighting": addon("led-lighting", "LED louvre lighting (per metre)", rules.addons.lighting.perUnit),
  "zip-screen": addon("zip-screen", "ZIP side screen (per metre)", rules.addons.screens.perUnit),
  installation: addon("installation", "Professional installation (per m²)", rules.addons.install.perUnit),
};

export default { template: "product.shadeline", context: { product: pergola }, products };
