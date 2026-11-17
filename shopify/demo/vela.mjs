// Vela fixture: one product, three pack variants, one selling-plan group,
// ingredient metaobjects. Shaped like Shopify's Liquid objects.
import { img, mf, product, allocation } from "./helpers.mjs";

const groupId = "gid-vela-subscribe";
const plan30 = { id: 690001001, name: "Delivered every 30 days, save 15%", options: [{ name: "Delivery every", value: "Every 30 days" }], price_adjustments: [{ value_type: "percentage", value: 15 }] };
const plan60 = { id: 690001002, name: "Delivered every 60 days, save 15%", options: [{ name: "Delivery every", value: "Every 60 days" }], price_adjustments: [{ value_type: "percentage", value: 15 }] };
const plans = [plan30, plan60];
const allocs = (price) => plans.map((p) => allocation(p, groupId, price, 15));

const packs = [
  { option1: "1 jar", price: 3800, jars: 1, badge: null },
  { option1: "2 jars", price: 6800, jars: 2, badge: "Most popular" },
  { option1: "3 jars", price: 9200, jars: 3, badge: "Best value" },
];

const ingredient = (name, dose, role, source, detail) => ({ name: mf(name), dose_mg: mf(dose, "number_integer"), role: mf(role), source: mf(source), detail: mf(detail, "multi_line_text_field") });

const evening = product({
  handle: "evening-calm",
  title: "Vela Evening Calm",
  options: ["Pack"],
  selectedIndex: 1,
  variants: packs.map((p, i) => ({
    option1: p.option1,
    price: p.price,
    sku: `VELA-EC-${p.jars}`,
    featured_image: img(`vela-pack-${i + 1}`, 1200, 1200, `Vela Evening Calm, ${p.option1}`),
    selling_plan_allocations: allocs(p.price),
    metafields: { custom: { pack_size: mf(p.jars, "number_integer"), ...(p.badge ? { badge: mf(p.badge) } : {}) } },
  })),
  selling_plan_groups: [{ id: groupId, name: "Subscribe & save", options: [{ name: "Delivery every", values: ["Every 30 days", "Every 60 days"] }], selling_plans: plans }],
  featured_image: img("vela-hero", 1600, 1600, "Vela Evening Calm jar with capsules"),
  metafields: {
    custom: {
      subtitle: mf("Magnesium + L-Theanine · 60 vegan capsules · 30 nights per jar"),
      ingredients: mf(
        [
          ingredient("Magnesium glycinate", 200, "Muscle relaxation*", "Chelated for gentle absorption", "A highly absorbable form of magnesium bound to glycine, chosen because it's easy on the stomach. Magnesium supports normal muscle and nervous-system function.*"),
          ingredient("L-Theanine", 200, "Relaxed, clear focus*", "Fermentation-derived", "An amino acid naturally found in green tea that supports a calm-but-alert state, without drowsiness.*"),
          ingredient("Ashwagandha root extract", 300, "Everyday stress support*", "Standardised root extract", "An adaptogenic botanical traditionally used to support the body's response to everyday stress.*"),
          ingredient("Tart cherry", 100, "Evening wind-down*", "Montmorency cherry powder", "A small amount of tart cherry rounds out the formula with naturally occurring polyphenols.*"),
        ],
        "list.metaobject_reference",
      ),
    },
  },
});

export default {
  template: "product.vela",
  context: { product: evening },
  products: { "evening-calm": evening },
};
