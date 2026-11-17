// Single source for the /templates gallery AND the demo build
// (scripts/templates/build-demos.mjs reads titles/descriptions from here).
// Plain ESM with no JSX so Node can import it at build time.

export const TEMPLATE_ORIGIN = "https://configuro.studio";

export const templateFilters = [
  { id: "all", label: "All templates" },
  { id: "configurator", label: "Configurator" },
  { id: "landing", label: "Landing page" },
  { id: "b2b", label: "B2B" },
  { id: "catalog", label: "Catalog" },
  { id: "premium", label: "Premium brand" },
  { id: "furniture", label: "Furniture" },
  { id: "fashion", label: "Fashion" },
  { id: "motion", label: "Scroll storytelling" },
];

export const templates = [
  {
    "slug": "forma",
    "name": "Forma",
    "sector": "Luxury furniture",
    "oneLiner": "A cinematic furniture showroom with scroll-controlled film, drifting material details and sliding room chapters.",
    "tags": [
      "Scroll video",
      "Sliding scenes",
      "Shop the collection"
    ],
    "filters": [
      "premium",
      "landing",
      "motion",
      "furniture"
    ],
    "hook": "Pinned story chapters + scroll-linked video + accessible motion controls",
    "accent": "#9a8065",
    "title": "Forma — A slower way to live | Concept store by Configuro",
    "description": "Original luxury furniture Shopify concept by Configuro with scroll-linked video, sliding campaign imagery and a shoppable collection."
  },
  {
    "slug": "edito",
    "name": "Édito",
    "sector": "Editorial fashion",
    "oneLiner": "A fashion editorial with scroll-controlled film, drifting image rows and a horizontal shoppable collection.",
    "tags": [
      "Scroll video",
      "Moving lookbook",
      "Shop the collection"
    ],
    "filters": [
      "premium",
      "landing",
      "motion",
      "fashion"
    ],
    "hook": "Drifting editorial + horizontal collection + native size variants",
    "accent": "#302d28",
    "title": "Édito — Wear your own point of view | Concept store by Configuro",
    "description": "Original luxury fashion Shopify concept by Configuro with scroll-linked video, sliding campaign imagery and a shoppable collection."
  },

  {
    slug: "vela",
    name: "Vela",
    sector: "Single-product supplement",
    oneLiner: "A benefit-led supplement landing page that sells bundles and subscriptions from one buy box.",
    tags: ["Landing page", "Bundles", "Subscriptions"],
    filters: ["landing", "premium"],
    hook: "Selling plans + 1/2/3-pack variants priced in one form",
    accent: "#3b2741",
    title: "Vela Evening Calm — Magnesium + L-Theanine | Concept store by Configuro",
    description:
      "Concept Shopify landing page for an invented supplement brand: benefit-led hero, ingredient breakdown, 1/2/3-pack bundles, subscribe-and-save selling plans and a sticky add-to-cart.",
  },
  {
    slug: "shadeline",
    name: "Shadeline",
    sector: "Outdoor pergolas",
    oneLiner: "Size a louvred pergola in 3D and get a live price before you ever talk to sales.",
    tags: ["Configurator", "3D", "Price rules"],
    filters: ["configurator", "premium"],
    hook: "Three.js preview + metafield price rules + line-item properties",
    accent: "#2e3134",
    title: "Shadeline Louvred Pergolas — Configure in 3D | Concept store by Configuro",
    description:
      "Concept Shopify configurator for an invented pergola maker: Three.js preview, width/depth/finish inputs, live price from metafield price rules and a configured cart line with properties.",
  },
  {
    slug: "northgate",
    name: "Northgate Supply",
    sector: "B2B wholesale",
    oneLiner: "A trade portal: apply for an account, see tiered pricing once approved, reorder from a grid.",
    tags: ["B2B", "Tiered pricing", "Quick order"],
    filters: ["b2b", "catalog"],
    hook: "Customer-tag gating, quantity tiers and a HubSpot webhook",
    accent: "#ff5a1f",
    title: "Northgate Supply — Wholesale Packaging for Trade | Concept store by Configuro",
    description:
      "Concept Shopify B2B storefront for an invented packaging wholesaler: trade application, login-gated tiered quantity pricing and a quick-order grid for repeat buyers.",
  },
  {
    slug: "linkcore",
    name: "Linkcore",
    sector: "IT hardware",
    oneLiner: "A hardware lineup with spec comparison and a “will it work with my setup?” checker.",
    tags: ["Catalog", "Spec compare", "CSV import"],
    filters: ["catalog"],
    hook: "Compatibility rules from metafields + Python GraphQL importer",
    accent: "#c6f432",
    title: "Linkcore Docks, Hubs & Switches — Check Compatibility | Concept store by Configuro",
    description:
      "Concept Shopify catalog for an invented IT hardware brand: product lineup, spec comparison table, a compatibility checker driven by metafields and an idempotent supplier CSV importer.",
  },
  {
    slug: "aurel",
    name: "Aurel",
    sector: "Fine jewellery drop",
    oneLiner: "An editorial ring drop with live engraving preview, size guide, countdown and waitlist.",
    tags: ["Product drop", "Engraving", "Waitlist"],
    filters: ["premium", "landing"],
    hook: "Engraving as line-item property + metafield-driven drop timer",
    accent: "#b8955a",
    title: "Aurel — The Meridian Ring, Limited Drop | Concept store by Configuro",
    description:
      "Concept Shopify product drop for an invented fine jewellery house: editorial hero, engraving with live preview and character limit, ring-size guide drawer, countdown and waitlist capture.",
  },
];

// Demos live under their own page, separate from the existing /templates builder.
export const TEMPLATES_PATH = "/shopify-templates";
export const templateUrl = (slug) => `${TEMPLATE_ORIGIN}${TEMPLATES_PATH}/${slug}`;
