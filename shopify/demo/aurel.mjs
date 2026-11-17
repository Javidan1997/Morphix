// Aurel fixture: Metal × Size variants, engraving limit and drop time as metafields.
import { img, mf, product } from "./helpers.mjs";

const metals = ["Yellow gold", "White gold", "Rose gold"];
const sizes = ["5", "6", "7", "8", "9"];
const variants = [];
for (const m of metals) for (const s of sizes) variants.push({ option1: m, option2: s, price: m === "White gold" ? 152000 : 148000, sku: `AU-MER-${m[0]}-${s}` });

// Drop time: a fixed public opening. After it passes the page switches to
// "Add to bag" on its own (Liquid on load, aurel.js live at zero).
const DROP_AT = "2027-02-14T17:00:00Z";

const meridian = product({
  handle: "meridian-ring",
  title: "The Meridian",
  options: ["Metal", "Size"],
  selectedIndex: 2,
  variants,
  featured_image: img("aurel-ring-yellow", 1200, 1200, "The Meridian ring", [480, 800, 1200]),
  metafields: {
    custom: {
      materials: mf("Recycled 18k gold · 0.30 ct lab-grown diamond"),
      engraving_max: mf(18, "number_integer"),
      drop_at: mf(DROP_AT, "date_time"),
    },
  },
});

export default { template: "product.aurel", context: { product: meridian }, products: { "meridian-ring": meridian } };
