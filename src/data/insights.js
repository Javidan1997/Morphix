// Insights / blog articles. SEO-oriented long-form content targeting the
// keywords buyers actually search. Each article is structured content (blocks)
// so it can render semantically and be prerendered for search engines.
//
// Block types: "p" (paragraph), "h2" (subheading), "ul" (bullet list, items[]).

export const insightCategories = [
  { id: "all", label: "All" },
  { id: "configurators", label: "3D Configurators" },
  { id: "design", label: "3D & Design" },
  { id: "automation", label: "CRM & Automation" },
  { id: "software", label: "Apps & Software" },
];

export const insights = [
  {
    slug: "3d-configurators-increase-conversion",
    title: "How 3D Product Configurators Increase Conversion",
    description:
      "Why interactive 3D configurators outperform static product pages for considered purchases — and what it takes to build one that actually sells.",
    category: "configurators",
    date: "2026-06-10",
    readingMinutes: 6,
    author: "Configuro",
    cover: "/portfolio/outdoor-living/01.webp",
    coverAlt: "Configurable pergola and deck outdoor living system render",
    body: [
      { type: "p", text: "When a product has options — sizes, finishes, materials, add-ons — a static page forces the buyer to imagine the combination they actually want. A 3D configurator removes that guesswork. The customer builds their exact product on screen, sees it from every angle, and arrives at checkout already confident in the decision." },
      { type: "h2", text: "Why configurators convert" },
      { type: "p", text: "Considered purchases stall on uncertainty. The more a buyer has to picture, compare, or ask about, the more likely they are to leave and 'think about it.' A configurator collapses that uncertainty into a single, guided interaction." },
      { type: "ul", items: [
        "Fewer pre-sales questions — customers self-serve answers your team used to field by email.",
        "Higher intent at checkout — a configured product is a decided product.",
        "Better data — every configuration is a signal about what buyers actually want.",
      ]},
      { type: "h2", text: "What a good configurator needs" },
      { type: "p", text: "A configurator is only as good as the engineering behind it. Real GLB models, optimized assets, and a mobile-friendly interface are the baseline. Beyond that, the configurator should be wired into the rest of the business: an instant quote, a lead pushed to your CRM, and analytics on what people configure." },
      { type: "p", text: "That last part is where most configurators fall short — they look impressive but sit in isolation. The version that grows revenue is connected to sales and automation from day one." },
    ],
  },
  {
    slug: "crm-automation-zoho-gohighlevel-hubspot",
    title: "CRM Automation: Zoho vs GoHighLevel vs HubSpot",
    description:
      "A practical comparison of Zoho, GoHighLevel, and HubSpot for automating sales and marketing — and how to choose the right one for your business.",
    category: "automation",
    date: "2026-06-18",
    readingMinutes: 7,
    author: "Configuro",
    cover: "/portfolio/nights-mixed-use/01.webp",
    coverAlt: "Downtown building at dusk representing a connected business system",
    body: [
      { type: "p", text: "The best CRM is the one your team will actually use — and the one that automates the busywork draining your sales pipeline. Zoho, GoHighLevel, and HubSpot all do this well, but they suit different businesses." },
      { type: "h2", text: "HubSpot" },
      { type: "p", text: "Polished, well-documented, and strong for content-driven marketing teams. It scales cleanly but gets expensive as you add seats and advanced automation. Best when marketing and sales alignment is the priority." },
      { type: "h2", text: "Zoho" },
      { type: "p", text: "Deep, flexible, and cost-effective, especially if you use the wider Zoho suite. It rewards proper setup — which is exactly where most teams struggle. Configured well, it's one of the best value CRMs available." },
      { type: "h2", text: "GoHighLevel" },
      { type: "p", text: "Built for agencies and service businesses that live on follow-up: pipelines, SMS and email sequences, booking, and reputation management in one place. Excellent for automating the path from lead to booked call." },
      { type: "h2", text: "How to choose" },
      { type: "ul", items: [
        "Map your actual sales process first — the tool should fit it, not the other way around.",
        "Automate the highest-friction step: usually lead follow-up and routing.",
        "Integrate the CRM with your site, forms, and calendar so data flows automatically.",
      ]},
      { type: "p", text: "Whichever platform you pick, the value is in the setup and the automation, not the logo on the login screen. That's the part we handle." },
    ],
  },
  {
    slug: "what-web-and-mobile-app-development-costs",
    title: "What Web & Mobile App Development Actually Costs",
    description:
      "A clear breakdown of what drives the cost of building a web or mobile app, and how to scope a project so you don't overpay or under-build.",
    category: "software",
    date: "2026-06-25",
    readingMinutes: 5,
    author: "Configuro",
    cover: "/portfolio/urban-residences/01.webp",
    coverAlt: "Modern building facade representing structured software architecture",
    body: [
      { type: "p", text: "There's no single price for an app because 'an app' can mean a two-screen MVP or a multi-platform product with a backend, integrations, and years of iteration ahead of it. What you can do is understand the drivers of cost and scope accordingly." },
      { type: "h2", text: "What drives the cost" },
      { type: "ul", items: [
        "Platforms — web only, or iOS and Android too.",
        "Backend complexity — accounts, payments, real-time data, integrations.",
        "Design depth — a template vs a custom, branded experience.",
        "Ongoing work — an app is a product, not a one-off deliverable.",
      ]},
      { type: "h2", text: "How to scope well" },
      { type: "p", text: "Start with the smallest version that delivers real value, ship it, and let usage guide what comes next. This avoids the two most expensive mistakes: building features nobody uses, and rebuilding because the foundation wasn't made to scale." },
      { type: "p", text: "We scope every project to what it actually needs, whether that's a fixed-scope build or a retainer, so you get a clear number instead of a vague hourly guess." },
    ],
  },
  {
    slug: "3d-renders-vs-product-photography",
    title: "Why 3D Renders Beat Photography for Product Launches",
    description:
      "Product renders let you show finishes, sizes, and lighting that don't physically exist yet, at a quality photography can't match. Here's when to use them.",
    category: "design",
    date: "2026-07-01",
    readingMinutes: 5,
    author: "Configuro",
    cover: "/portfolio/pergolade/01.jpg",
    coverAlt: "Two Pergolade louvered pergolas rendered in a studio with LED lighting",
    body: [
      { type: "p", text: "Photography needs a finished product, a studio, and a reshoot every time something changes. A 3D render needs none of that. Once we've built the model, we can show any finish, any size, any lighting setup, in any environment, at a consistency a camera can't hold across a whole range." },
      { type: "h2", text: "Where renders win" },
      { type: "ul", items: [
        "Products that don't exist yet, or exist only as prototypes.",
        "Ranges with many finishes or configurations, where reshooting each one is expensive.",
        "Launch campaigns that need a consistent look across web, ads, and print.",
        "Anything that feeds a configurator, where the render and the interactive model share the same source.",
      ]},
      { type: "h2", text: "Where photography still earns its place" },
      { type: "p", text: "Real photography is still worth it for texture, human moments, and trust on hero pages. The smart approach is usually a mix: renders for the range and the configurable options, photography for the flagship shots. Because we build the 3D asset once, it keeps paying off across the site, the ads, and the pitch deck." },
    ],
  },
  {
    slug: "pergola-configurator-sketch-to-sold",
    title: "A Pergola Configurator, From Sketch to Sold",
    description:
      "How a configurable outdoor product goes from CAD to a 3D configurator that quotes itself, using a louvered pergola range as the example.",
    category: "configurators",
    date: "2026-06-30",
    readingMinutes: 6,
    author: "Configuro",
    cover: "/portfolio/pergolade/03.jpg",
    coverAlt: "Black and white louvered pergolas staged with outdoor furniture",
    body: [
      { type: "p", text: "Outdoor products like pergolas are a textbook case for configuration. There are frame colors, louver finishes, sizes, lighting, screens, and mounting options, and every buyer wants a slightly different combination. A brochure can't keep up. A configurator can." },
      { type: "h2", text: "1. Model once, reuse everywhere" },
      { type: "p", text: "We build a clean, optimized 3D model of the product with its real options baked in. That same model powers the studio renders, the lifestyle shots, and the interactive configurator, so everything stays visually consistent." },
      { type: "h2", text: "2. Wire options to logic" },
      { type: "p", text: "Each choice, size, finish, lighting, screens, maps to real rules: what's available, what it costs, what it looks like. The customer builds their exact unit and sees it update in real time." },
      { type: "h2", text: "3. Turn a configuration into a quote" },
      { type: "p", text: "The finished configuration becomes an instant price estimate and a qualified lead in the CRM, so the sales team receives someone who already knows what they want. That's the difference between a nice 3D toy and a tool that shortens the sales cycle." },
    ],
  },
  {
    slug: "what-crm-automation-removes-from-your-week",
    title: "What Good CRM Automation Actually Removes From Your Week",
    description:
      "Automation isn't about buzzwords. It's about deleting the manual steps that quietly eat your team's time. Here's what that looks like in practice.",
    category: "automation",
    date: "2026-06-28",
    readingMinutes: 4,
    author: "Configuro",
    cover: "/portfolio/nights-mixed-use/01.webp",
    coverAlt: "Downtown building at dusk representing a connected, automated business",
    body: [
      { type: "p", text: "Most sales teams lose hours a week to work no one should be doing by hand: copying leads between tools, chasing follow-ups, updating statuses, sending the same three emails. Good automation quietly removes all of it." },
      { type: "h2", text: "The usual suspects" },
      { type: "ul", items: [
        "New leads that have to be typed into the CRM from a form or inbox.",
        "Follow-ups that depend on someone remembering to send them.",
        "Handoffs between marketing and sales that go through a spreadsheet.",
        "Reporting that someone rebuilds manually every Monday.",
      ]},
      { type: "h2", text: "What we set up instead" },
      { type: "p", text: "On Zoho, GoHighLevel, or HubSpot, we connect your forms and site straight to the CRM, route leads automatically, trigger follow-up sequences, and keep reporting live. Your team stops doing data entry and goes back to talking to customers." },
    ],
  },
];

export const getInsight = (slug) => insights.find((a) => a.slug === slug);
