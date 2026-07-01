// Real architectural & product visualization projects produced by the studio.
// Images live in /public/portfolio/<slug>/NN.webp and are served statically.

const img = (slug, n, alt) => ({
  src: `/portfolio/${slug}/${String(n).padStart(2, "0")}.webp`,
  alt,
});

// Newer sets are delivered as .jpg (pending WebP optimization).
const jimg = (slug, n, alt) => ({
  src: `/portfolio/${slug}/${String(n).padStart(2, "0")}.jpg`,
  alt,
});

export const projectCategories = [
  { id: "all", label: "All work" },
  { id: "software", label: "Web, Mobile & POS" },
  { id: "automation", label: "CRM & AI Automation" },
  { id: "residential", label: "Residential" },
  { id: "hospitality", label: "Hospitality & Retail" },
  { id: "urban", label: "Urban & Mixed-Use" },
  { id: "product", label: "Outdoor & Product" },
];

export const projects = [
  {
    slug: "pergolade",
    name: "Pergolade-Louvered Pergola System",
    category: "product",
    type: "Product · 3D Configurator & Renders",
    summary:
      "Studio-grade product renders and a real-time 3D configurator for Pergolade's aluminium louvered pergola range, so buyers can explore finishes, sizes, and lighting before they order.",
    scope: ["Product renders", "3D configurator", "Finish & lighting options", "Lifestyle staging"],
    year: "2025",
    images: [
      jimg("pergolade", 1, "Two Pergolade louvered pergolas in black and white with integrated LED lighting, studio render"),
      jimg("pergolade", 2, "Pergolade pergola interior view with lounge furniture and warm LED-lit louvers"),
      jimg("pergolade", 3, "Black and white Pergolade pergolas staged with designer outdoor seating"),
      jimg("pergolade", 4, "Single white Pergolade louvered pergola product render on a studio backdrop"),
      jimg("pergolade", 5, "Pergolade pergola with sofa and side tables under lit aluminium louvers"),
      jimg("pergolade", 6, "White Pergolade pergola with privacy screens attached to a suburban home"),
    ],
  },
  {
    slug: "glass-group-operations",
    name: "Glass Group Operations Portal",
    category: "software",
    kind: "digital",
    type: "Web App - Quoting & Operations",
    summary:
      "A practical operations build for a glass and installation team: enquiry capture, quote preparation, project stages, and handoff notes in one place so jobs do not live across WhatsApp, spreadsheets, and memory.",
    scope: ["Client intake", "Quote workflow", "Job status board", "Team handoff"],
    platform: "React, Supabase-ready data model, CRM handoff",
    outcome: "Cleaner lead-to-quote flow and fewer missed follow-ups between sales and operations.",
    year: "2025",
  },
  {
    slug: "pergolast-sales-system",
    name: "Pergolast Sales & CRM Automation",
    category: "automation",
    kind: "digital",
    type: "CRM Automation - Outdoor Products",
    summary:
      "A lead-routing and follow-up system for an outdoor product business, connecting website enquiries, product interest, sales stages, and reminder sequences so every request receives a consistent next step.",
    scope: ["Lead routing", "Pipeline setup", "Follow-up sequences", "Reporting views"],
    platform: "GoHighLevel / Zoho-style workflow, forms, automations",
    outcome: "A repeatable sales process for product enquiries, dealer requests, and installation conversations.",
    year: "2025",
  },
  {
    slug: "railbuild-custom-platform",
    name: "RailBuild Custom Platform",
    category: "software",
    kind: "digital",
    type: "Custom Web Platform - Construction",
    summary:
      "A construction-focused platform concept for RailBuild-style teams: project intake, document collection, quote stages, supplier notes, and client updates built around the way trade teams actually work.",
    scope: ["Project dashboard", "Document flow", "Client updates", "Admin controls"],
    platform: "Custom web app, role-based views, automation hooks",
    outcome: "A single source of truth for projects that would otherwise be split across email threads and files.",
    year: "2025",
  },
  {
    slug: "meze-pos-app",
    name: "Meze POS & Restaurant Workflow",
    category: "software",
    kind: "digital",
    type: "POS App - Hospitality",
    summary:
      "A restaurant workflow build shaped around real service pressure: table flow, menu items, modifiers, kitchen notes, payment state, and simple manager visibility without unnecessary enterprise clutter.",
    scope: ["POS interface", "Menu management", "Kitchen notes", "Daily reporting"],
    platform: "Web/mobile POS interface, responsive admin, automation-ready exports",
    outcome: "Faster order handling and a cleaner bridge between front-of-house, kitchen, and management.",
    year: "2025",
  },
  {
    slug: "ai-client-automation-suite",
    name: "AI Client Automation Suite",
    category: "automation",
    kind: "digital",
    type: "AI Automation - Multi-Platform",
    summary:
      "Custom automation for teams that want AI to support the business without turning it into a gimmick: lead summaries, reply drafts, CRM updates, internal task creation, and handoff notes that match how the client wants to work.",
    scope: ["AI summaries", "CRM updates", "Task creation", "Custom prompts"],
    platform: "OpenAI workflows, Zapier/Make-style automations, CRM integrations",
    outcome: "Less manual admin after every call, form submission, or customer conversation.",
    year: "2026",
  },
  {
    slug: "education-demo-platform",
    name: "Live Demo Learning Platform",
    category: "software",
    kind: "digital",
    type: "Educational Demo - Interactive Web",
    summary:
      "A live demo section designed for educational content: interactive product scenes, guided explanations, saved examples, and simple calls to action that let people learn before they book a project.",
    scope: ["Live demo UX", "Interactive lessons", "Lead capture", "Content structure"],
    platform: "React, WebGL demos, SEO-prerendered articles",
    outcome: "More useful interactions from visitors who want to understand configurators before they buy one.",
    year: "2026",
  },
  {
    slug: "building",
    name: "Riverside Apartments",
    category: "residential",
    type: "Multi-Family · Exterior",
    summary:
      "Exterior visualization of a boutique multi-family building, shown with landscaping, street life, and mixed stone and timber facade materials for marketing and approvals.",
    scope: ["Exterior renders", "Material study", "Streetscape staging", "Context views"],
    year: "2024",
    images: [
      jimg("building", 1, "Modern four-storey apartment building with stone, render, and timber facade at a landscaped corner"),
      jimg("building", 2, "Street-facing elevation of the apartment building framed by trees and gardens"),
      jimg("building", 3, "Apartment building entrance and frontage with residents and planting"),
      jimg("building", 4, "Wide context view of the boutique apartment building on its street"),
    ],
  },
  {
    slug: "beverly-hills-hotel",
    name: "Waldorf-Style Hotel Tower",
    category: "hospitality",
    type: "Hospitality · Exterior",
    summary:
      "A curved-balcony luxury hotel and its arrival plaza, visualized from concept massing through to a photoreal street-level hero.",
    scope: ["Exterior renders", "Daylight study", "Streetscape staging"],
    year: "2024",
    images: [
      img("beverly-hills-hotel", 1, "Luxury hotel tower with curved glass balconies and arrival plaza"),
      img("beverly-hills-hotel", 2, "Hotel tower facade detail in daylight"),
      img("beverly-hills-hotel", 3, "Hotel podium and landscaped frontage"),
      img("beverly-hills-hotel", 4, "Hotel entrance and sculptural plaza feature"),
      img("beverly-hills-hotel", 5, "Wide context view of the hotel within the city block"),
    ],
  },
  {
    slug: "private-residence",
    name: "Private Residence",
    category: "residential",
    type: "Residential · Interior & Exterior",
    summary:
      "A full interior and exterior package for a private home — living spaces, entertainment room, and the facade tied together in one consistent look.",
    scope: ["Interior renders", "Exterior render", "Material styling"],
    year: "2024",
    images: [
      img("private-residence", 1, "Modern private residence exterior at dusk"),
      img("private-residence", 2, "Games room interior with pool table and fireplace"),
      img("private-residence", 3, "Residence interior living space"),
      img("private-residence", 4, "Residence interior detail view"),
      img("private-residence", 5, "Residence interior with natural light"),
    ],
  },
  {
    slug: "hillside-villa",
    name: "Hillside Villa",
    category: "residential",
    type: "Residential · Exterior",
    summary:
      "A contemporary villa with pergola, pool, and landscaping, shown across multiple angles to support marketing and approvals.",
    scope: ["Exterior renders", "Landscape integration", "Pergola system"],
    year: "2023",
    images: [
      img("hillside-villa", 1, "Contemporary hillside villa with pergola and pool"),
      img("hillside-villa", 2, "Villa terrace and outdoor lounge"),
      img("hillside-villa", 3, "Villa exterior side elevation"),
      img("hillside-villa", 4, "Villa landscaping and approach"),
    ],
  },
  {
    slug: "poolside-pavilion",
    name: "Poolside Pavilion",
    category: "residential",
    type: "Residential · Outdoor",
    summary:
      "A minimalist poolside pavilion and glazed lounge, rendered to show how a single outdoor structure changes the feel of a whole property.",
    scope: ["Exterior renders", "Outdoor living", "Daylight study"],
    year: "2023",
    images: [
      img("poolside-pavilion", 1, "White poolside pavilion with glazed lounge and pergola"),
      img("poolside-pavilion", 2, "Pavilion and pool deck"),
      img("poolside-pavilion", 3, "Pavilion interior seen through glass"),
      img("poolside-pavilion", 4, "Pavilion and landscaped surroundings"),
    ],
  },
  {
    slug: "urban-residences",
    name: "Urban Residences",
    category: "urban",
    type: "Multi-Family · Exterior",
    summary:
      "A mid-rise residential block presented with people, parking, and planting so buyers and stakeholders can picture everyday life on site.",
    scope: ["Exterior renders", "Context staging", "Material palette"],
    year: "2024",
    images: [
      img("urban-residences", 1, "Mid-rise residential building with mixed-material facade"),
      img("urban-residences", 2, "Residential block entrance and courtyard"),
      img("urban-residences", 3, "Residences facade and balconies"),
      img("urban-residences", 4, "Residential street frontage with landscaping"),
      img("urban-residences", 5, "Residences corner view"),
    ],
  },
  {
    slug: "silver-diner-district",
    name: "Silver District",
    category: "hospitality",
    type: "Retail & Mixed-Use",
    summary:
      "A retail and dining corner within a larger district, visualized from an elevated angle to read both the architecture and the public realm.",
    scope: ["Aerial render", "Street-level views", "Signage staging"],
    year: "2023",
    images: [
      img("silver-diner-district", 1, "Aerial view of retail and dining district corner"),
      img("silver-diner-district", 2, "Retail frontage and outdoor seating"),
      img("silver-diner-district", 3, "Mixed-use street view"),
      img("silver-diner-district", 4, "District context view"),
    ],
  },
  {
    slug: "nights-mixed-use",
    name: "Downtown After Dark",
    category: "urban",
    type: "Mixed-Use · Dusk",
    summary:
      "A dusk and night lighting study for a downtown infill block, showing how glass, brick, and street lighting read after sunset.",
    scope: ["Night renders", "Lighting study", "Streetscape"],
    year: "2024",
    images: [
      img("nights-mixed-use", 1, "Downtown glass building at dusk with reflective wet street"),
      img("nights-mixed-use", 2, "Mixed-use block lit at night"),
      img("nights-mixed-use", 3, "Street-level night view with lighting"),
      img("nights-mixed-use", 4, "Downtown infill building after sunset"),
    ],
  },
  {
    slug: "portobello-quarter",
    name: "Portobello Quarter",
    category: "hospitality",
    type: "Retail & Hospitality",
    summary:
      "A walkable retail and hospitality quarter with restaurants and storefronts, staged to sell the atmosphere of the place, not just the buildings.",
    scope: ["Aerial render", "Street views", "Public realm"],
    year: "2023",
    images: [
      img("portobello-quarter", 1, "Aerial view of walkable retail and hospitality quarter"),
      img("portobello-quarter", 2, "Quarter storefronts and street life"),
      img("portobello-quarter", 3, "Retail district public realm"),
      img("portobello-quarter", 4, "Hospitality quarter context view"),
    ],
  },
  {
    slug: "outdoor-living",
    name: "Outdoor Living Systems",
    category: "product",
    type: "Product · Pergola & Deck",
    summary:
      "Product-style visuals for pergolas, decks, and roof systems — the kind of clean, configurable outdoor pieces that suit a configurator or catalogue.",
    scope: ["Product renders", "Configurable options", "Lifestyle staging"],
    year: "2023",
    images: [
      img("outdoor-living", 1, "Pergola and pool deck outdoor living system"),
      img("outdoor-living", 2, "Patio pergola product render"),
      img("outdoor-living", 3, "Timber deck system render"),
      img("outdoor-living", 4, "Roof and pergola structure render"),
    ],
  },
];

export const featuredProjects = projects.filter((p) =>
  ["pergolade", "beverly-hills-hotel", "private-residence", "nights-mixed-use"].includes(p.slug),
);

export const allProjectImages = projects.flatMap((p) =>
  (p.images ?? []).map((image) => ({ ...image, project: p.name, slug: p.slug })),
);
