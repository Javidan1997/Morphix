// Northgate fixture: a trade collection with per-product tier metafields, and
// a second "trade" render state for a customer tagged trade-approved.
import { img, mf, product } from "./helpers.mjs";

const items = [
  ["box-s", "Shipping box S", "NG-BX-S", "300 × 200 × 150 mm · 32 ECT", "Case of 25", 2850, [2490, 2240, 1980]],
  ["box-m", "Shipping box M", "NG-BX-M", "400 × 300 × 250 mm · 32 ECT", "Case of 20", 3450, [2990, 2690, 2390]],
  ["box-l", "Shipping box L", "NG-BX-L", "600 × 400 × 400 mm · 44 ECT", "Case of 15", 4290, [3790, 3390, 2990]],
  ["tape", "Kraft packing tape", "NG-TP-48", "48 mm × 66 m · water-activated", "Case of 36 rolls", 6900, [5990, 5390, 4790]],
  ["film", "Hand stretch film", "NG-SF-500", "500 mm × 300 m · 17 µm", "Case of 6 rolls", 5400, [4690, 4190, 3790]],
  ["mailer", "Co-ex poly mailer", "NG-PM-325", "325 × 430 mm · 60 µm", "Case of 500", 7900, [6890, 6190, 5490]],
  ["gloves", "Nitrile gloves, L", "NG-GL-L", "Powder-free · 4 mil", "Case of 10 × 100", 8900, [7690, 6990, 6290]],
  ["paper", "Void-fill kraft paper", "NG-VF-450", "450 m roll · 70 gsm", "Case of 2 rolls", 6200, [5390, 4890, 4390]],
];

const products = {};
for (const [asset, title, sku, spec, pack, list, tiers] of items) {
  const handle = sku.toLowerCase();
  products[handle] = product({
    handle,
    title,
    variants: [{ price: list, sku, available: asset !== "gloves" }],
    featured_image: img(`northgate-${asset}`, 1200, 1200, title, [480, 800, 1200]),
    metafields: {
      custom: {
        spec: mf(spec),
        pack: mf(pack),
        price_tiers: mf([{ min: 1, price: tiers[0] }, { min: 10, price: tiers[1] }, { min: 50, price: tiers[2] }], "json"),
      },
    },
  });
}
const essentials = { handle: "trade-essentials", title: "Trade essentials", products: Object.values(products), products_count: items.length };

const v = (h) => products[h].variants[0].id;
const tradeCustomer = {
  id: 7200001,
  name: "Jordan Lee",
  email: "buyer@acme-hospitality.example",
  tags: ["trade-approved", "tier-standard", "net30"],
  default_address: { company: "Acme Hospitality (demo)" },
  orders: [
    {
      name: "#NG1042",
      line_items: [
        { variant_id: v("ng-bx-m"), quantity: 12 },
        { variant_id: v("ng-tp-48"), quantity: 4 },
        { variant_id: v("ng-sf-500"), quantity: 2 },
        { variant_id: v("ng-pm-325"), quantity: 10 },
      ],
    },
  ],
};

export default {
  template: "page.northgate",
  context: { page: { title: "Trade", handle: "trade" } },
  products,
  collections: { "trade-essentials": essentials },
  states: {
    trade: { sections: ["pricing", "quick"], context: { customer: tradeCustomer } },
  },
};
