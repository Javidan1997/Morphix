import { pageMediaSections } from "./pageMedia";

const en = {
  meta: {
    title: "Configuro | Digital Product Studio",
    description:
      "Configuro is a digital product studio specializing in 3D product websites, interactive configurators, and immersive web experiences.",
  },
  common: {
    brandName: "Configuro",
    homeAriaLabel: "Configuro home",
    primaryNavAriaLabel: "Primary",
    languageSwitcherLabel: "Language",
    productExamplesAriaLabel: "Product configurator examples",
    mobileNavOpenLabel: "Open navigation menu",
    mobileNavCloseLabel: "Close navigation menu",
  },
  nav: {
    home: "Home",
    services: "Services",
    playground: "Playground",
    work: "Work",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    cta: "Start a project",
  },
  // ── HOME PAGE ──
  hero: {
    headline: "We build products people actually want to explore.",
    subline:
      "Configuro is a digital product studio. We design and engineer 3D websites, interactive configurators, and launch experiences for brands that refuse to be forgettable.",
    primaryCta: "Start a project",
    secondaryCta: "See our work",
  },
  valueProps: {
    eyebrow: "Why Configuro",
    items: [
      {
        title: "Interactive, not decorative",
        copy: "Every 3D element serves the buyer. Configuration, comparison, exploration — not just eye candy.",
      },
      {
        title: "Engineered for production",
        copy: "Three.js, optimized assets, responsive layouts. Ships fast, runs smooth, scales cleanly.",
      },
      {
        title: "Full-stack delivery",
        copy: "Strategy, design, 3D, front-end, launch. One team, one process, no handoff gaps.",
      },
    ],
  },
  servicesPreview: {
    eyebrow: "What we do",
    title: "From concept to launch, we handle everything.",
    items: [
      { title: "3D Configurators", copy: "Let your customers build their own product." },
      { title: "Product Websites", copy: "Storytelling that converts, not just impresses." },
      { title: "Launch Experiences", copy: "Immersive pages for product drops and campaigns." },
    ],
    cta: "All services",
  },
  portfolioPreview: {
    eyebrow: "Selected work",
    title: "Products we've brought to life.",
    projects: [
      {
        name: "Outdoor Living Configurator",
        type: "Pergola System",
        result: "Customers configure size, finish, lighting, and accessories in a guided 3D flow. Reduced pre-sales questions by half.",
      },
      {
        name: "Consumer Electronics Launch",
        type: "Product Website",
        result: "Interactive feature walkthrough that increased time on page 3x and drove a measurable lift in demo requests.",
      },
    ],
    cta: "View all work",
  },
  trust: {
    eyebrow: "Results",
    items: [
      { metric: "3×", label: "average increase in time on page" },
      { metric: "50%", label: "fewer pre-sales support questions" },
      { metric: "40%", label: "higher conversion on product pages" },
    ],
  },
  homeContact: {
    eyebrow: "Quick enquiry",
    title: "Have a project in mind?",
    copy: "Drop us a line. We'll get back within 48 hours.",
    fields: {
      name: { label: "Name", placeholder: "Alex Morgan" },
      email: { label: "Email", placeholder: "alex@company.com" },
      message: { label: "Message", placeholder: "Tell us briefly about your project..." },
    },
    submit: "Send message",
    successTitle: "Sent!",
    successCopy: "We'll be in touch soon.",
  },
  homeCta: {
    headline: "Ready to make your product unforgettable?",
    copy: "Tell us what you're building. We'll show you what's possible.",
    button: "Get in touch",
  },
  ...pageMediaSections.en,
  mediaSlotsShared: {
    eyebrow: "Media slots",
    title: "Reserved space for images and render video.",
    copy:
      "Use these placeholders across the site for final product stills, launch motion, turntable renders, or short walkthrough captures as assets become available.",
    items: [
      {
        type: "image",
        label: "Image slot",
        title: "Still image or render",
        copy: "Use this for product photography, close-up materials, annotated stills, or polished hero renders.",
      },
      {
        type: "video",
        label: "Render video slot",
        title: "Motion render or walkthrough",
        copy: "Use this for turntable videos, feature reveals, UI captures, or short launch sequences.",
      },
    ],
    note: "These placeholders are designed to be replaced with final assets later without restructuring each page.",
  },
  // ── SERVICES PAGE ──
  servicesPage: {
    eyebrow: "Services",
    headline: "Services for products that need more than a pretty landing page.",
    copy:
      "We help teams turn complex, configurable, or premium products into digital experiences people can actually understand. That can mean strategy, sharper copy, 3D assets, a launch site, or the interactive layer that ties it all together.",
    servicesIntro: {
      eyebrow: "What we can build",
      title: "Support that fits the way your product is sold.",
      copy:
        "Some projects need one focused deliverable. Others need the whole launch system. We step in where clarity, visuals, and interaction matter most.",
    },
    story: {
      panelLabel: "What clients usually need",
      title: "A partner who can think about the product and make the thing.",
      copy:
        "Most teams do not come to us with a tidy brief. They come with a strong product, half-finished assets, internal pressure to launch, and a sense that the current presentation is underselling the work.",
      points: [
        {
          title: "Clear thinking before pretty output",
          copy: "We start by understanding what buyers need to see, compare, and trust before we design the experience around it.",
        },
        {
          title: "Design and build in the same room",
          copy: "Copy, layout, motion, 3D, and front-end are shaped together, so the final result feels cohesive instead of stitched together.",
        },
        {
          title: "Useful after launch too",
          copy: "The deliverables are meant to help sales, marketing, and product teams keep using the work after the first campaign goes live.",
        },
      ],
      note:
        "We are especially helpful when the product has options, technical detail, or a price point that asks customers to spend time understanding what makes it worth it.",
    },
    services: [
      {
        title: "3D Product Configurators",
        copy:
          "Interactive product experiences where customers can change materials, dimensions, options, and presentation states without losing the thread. Useful when the buying decision depends on seeing the product adapt in real time.",
        tags: ["Three.js", "Product Logic", "Commerce-Ready"],
      },
      {
        title: "Product Launch Websites",
        copy:
          "Launch pages and microsites that do more than look polished. We structure the story, proof, and calls to action so the page explains the product and builds confidence at the same time.",
        tags: ["Launch", "Storytelling", "Conversion"],
      },
      {
        title: "3D Asset Production",
        copy:
          "Optimized models, clean materials, still renders, cutaways, and web-ready asset sets that work across the site, presentations, paid campaigns, and the configurator itself.",
        tags: ["Models", "Renders", "WebGL Assets"],
      },
      {
        title: "Interactive Product Demos",
        copy:
          "Guided demos and motion-led walkthroughs that help people understand how the product works before they ever talk to sales. Great for reducing repetitive questions and making technical products feel approachable.",
        tags: ["Demo", "Education", "Self-Serve"],
      },
      {
        title: "Technical Explainers",
        copy:
          "For products that break the moment you try to explain them in plain paragraphs. We turn mechanisms, systems, and workflows into visuals people can follow without a technical background.",
        tags: ["Animation", "Explainer", "Complex Products"],
      },
      {
        title: "Commerce-Ready Pages",
        copy:
          "Product pages for considered purchases, where people need reassurance before checkout. We combine stronger hierarchy, visual proof, and better interaction so the price makes more sense before the cart appears.",
        tags: ["E-commerce", "Trust", "Premium"],
      },
    ],
    mediaShowcase: {
      eyebrow: "Work samples",
      title: "A few good examples will sell this page better than more claims.",
      copy:
        "Use this area for the pieces that help someone quickly understand the level of work: one short video, a strong still, an interface capture, and a simple proof image.",
      layout: "storyboard",
      highlights: ["Short intro video", "Strong still", "Interface capture", "Proof image"],
      items: [
        {
          type: "video",
          label: "Opening film",
          meta: "First impression",
          title: "Brand reveal, project intro, or short walkthrough",
          copy: "Keep this short. It only needs to give people a feel for the quality of the work.",
          size: "hero",
        },
        {
          type: "image",
          label: "Detail still",
          meta: "Craft signal",
          title: "Close-up render, material family, or product finish system",
          copy: "Use one clear still that shows the finish, detail, or visual quality you want to be known for.",
          size: "standard",
        },
        {
          type: "video",
          label: "UX capture",
          meta: "Interaction proof",
          title: "Configurator sequence, mobile flow, or UI walkthrough",
          copy: "If interaction is part of the service, this is the place to show it plainly.",
          size: "tall",
        },
        {
          type: "image",
          label: "Comparison frame",
          meta: "Value explanation",
          title: "Before-and-after screen, annotation layer, or proof graphic",
          copy: "A simple comparison or annotated image often explains the value faster than another paragraph.",
          size: "wide",
        },
        {
          type: "image",
          label: "Delivery board",
          meta: "What ships",
          title: "Asset library, campaign stills, or client-ready handoff frame",
          copy: "Finish with something that shows the work is usable after launch, not just nice to look at.",
          size: "standard",
        },
      ],
      note:
        "This section should feel like real evidence of the work, not a promise of what might be added later.",
    },
    playgroundRedirect: {
      eyebrow: "Playground",
      title: "The interactive part now lives in Playground.",
      copy:
        "That is the better place to actually test materials, upload files, and explore product options. The Services page should explain the offer clearly, then hand people off to a dedicated environment when they want to interact.",
      features: [
        {
          title: "Cleaner journey",
          copy: "Visitors can read about the service here, then move into a focused interface when they are ready to try it.",
        },
        {
          title: "More room to explore",
          copy: "Playground can carry uploads, material changes, dual-color testing, and future editor features without making this page feel crowded.",
        },
        {
          title: "Better UX on mobile",
          copy: "The mobile-friendly Playground flow is a better home for interaction than an embedded demo inside a long marketing page.",
        },
      ],
      primaryCta: "Open Playground",
      secondaryCta: "Start a project",
      previewLabel: "Playground preview",
      previewTitle: "A stronger handoff from story to interaction",
      previewCopy:
        "Instead of dropping a mini configurator into the page, we now preview the experience and send people to the full Playground when they want to explore properly.",
      previewChips: ["Asset upload", "Material controls", "Mobile-friendly"],
      previewCards: [
        {
          title: "Bring in real models",
          copy: "Use supported 3D files to review products in a space designed for testing instead of just browsing.",
        },
        {
          title: "Adjust finishes with intent",
          copy: "Swap RAL colors, use custom picking, and test main plus sub color combinations for more realistic presentations.",
        },
        {
          title: "Give the UI room to breathe",
          copy: "Playground is easier to extend, easier to use, and a much better place for interaction than a compressed demo block.",
        },
      ],
    },
    process: {
      eyebrow: "How we work",
      title: "A simple process, even when the product is complex.",
      copy:
        "We keep the workflow clear on purpose. You should always know what we are making, why it matters, and what is happening next.",
      steps: [
        {
          step: "01",
          title: "Discovery",
          copy: "We figure out what the product is, what makes it valuable, and where the current presentation is losing people.",
        },
        {
          step: "02",
          title: "Direction",
          copy: "We shape the narrative, page flow, interaction plan, and visual references before deep production begins.",
        },
        {
          step: "03",
          title: "Build",
          copy: "Design, 3D, frontend, and asset production move together so the final experience feels consistent across every touchpoint.",
        },
        {
          step: "04",
          title: "Release",
          copy: "We polish, test, launch, and hand things over in a way your team can actually keep using and extending.",
        },
      ],
    },
    bottomCta: {
      title: "Have a product that needs a better digital story?",
      copy: "We can help you turn the complexity into something clearer, sharper, and easier to sell.",
    },
  },
  // ── WORK PAGE ──
  workPage: {
    eyebrow: "Work",
    headline: "Products we've helped launch.",
    copy: "A selection of projects across industries. Each one started with a product that needed a better story.",
    projects: [
      {
        name: "Pergola Configurator System",
        type: "Outdoor Products",
        result: "A full configurator experience: size, side options, lighting, accessories, and mounting — all in one guided buying flow.",
        details: "Reduced pre-sales inquiries by 50%. Customers self-configure with confidence before contacting the team.",
      },
      {
        name: "Premium Consumer Electronics",
        type: "Product Launch",
        result: "Interactive feature walkthroughs and comparison views that made a complex product line feel approachable.",
        details: "3× increase in time on page. Measurable lift in demo requests within the first month.",
      },
      {
        name: "Enterprise SaaS Platform",
        type: "Product Website",
        result: "Turned abstract platform value into a concrete, visual story for decision-makers and evaluators.",
        details: "Shortened the sales cycle by giving prospects the clarity they needed before the first call.",
      },
      {
        name: "Furniture Collection Launch",
        type: "E-commerce",
        result: "3D product viewer with finish and environment switching. Customers explore every angle before buying.",
        details: "40% higher add-to-cart rate compared to the previous static product pages.",
      },
      {
        name: "Industrial Equipment Explainer",
        type: "Technical Product",
        result: "Animated component breakdowns that made complex machinery understandable to non-technical buyers.",
        details: "Used across trade shows, sales decks, and the main product site.",
      },
    ],
  },
  // ── PRICING PAGE ──
  pricingPage: {
    eyebrow: "Pricing",
    headline: "Transparent pricing. No surprises.",
    copy: "Choose a starting point. Every engagement is scoped to your product, timeline, and goals.",
    badge: "Most popular",
    cta: "Get started",
    tiers: [
      {
        tier: "Foundation",
        price: "$4,900",
        subtitle: "One focused product page or launch experience.",
        features: [
          "Discovery workshop and page strategy",
          "One high-impact product page",
          "One primary 3D or motion sequence",
          "Responsive QA and clean handoff",
        ],
      },
      {
        tier: "Growth",
        price: "$14,900",
        subtitle: "Multi-page product site with deeper customer journeys.",
        features: [
          "Multi-section product website",
          "Custom scene transitions and motion",
          "CMS or API-ready content structure",
          "Launch support and optimization pass",
        ],
        featured: true,
      },
      {
        tier: "Custom",
        price: "Let's talk",
        subtitle: "Configurators, complex systems, and ongoing partnerships.",
        features: [
          "Data-driven 3D product scenes",
          "Commerce, CRM, or CMS integrations",
          "Reusable component and motion library",
          "Ongoing optimization and support",
        ],
      },
    ],
    faq: [
      {
        q: "What's included in every tier?",
        a: "Discovery, design, development, QA, and deployment. We don't charge extra for basics.",
      },
      {
        q: "Can I upgrade later?",
        a: "Absolutely. Foundation projects often grow into Growth or Custom engagements as results come in.",
      },
      {
        q: "How long does a typical project take?",
        a: "Foundation: 2–3 weeks. Growth: 4–8 weeks. Custom: scoped together based on complexity.",
      },
      {
        q: "Do you work with existing designs?",
        a: "Yes. We can work from your brand system or design from scratch — whatever makes sense for the project.",
      },
    ],
  },
  // ── ABOUT PAGE ──
  aboutPage: {
    eyebrow: "About",
    headline: "A studio built for product teams.",
    copy: "Configuro exists because product launches deserve better than template sites and stock renders. We're a small, focused team that combines design, engineering, and 3D craft into one practice.",
    principles: [
      {
        title: "Clarity over spectacle",
        copy: "We use motion and 3D to explain, not to decorate. If it doesn't help the buyer understand, it doesn't ship.",
      },
      {
        title: "Built for real teams",
        copy: "Everything we deliver is structured for content updates, responsive QA, and long-term maintenance. No throwaway builds.",
      },
      {
        title: "One team, one process",
        copy: "Strategy, design, 3D, and code live under one roof. Fewer handoffs means fewer things lost in translation.",
      },
    ],
    story: {
      title: "How we work",
      copy: "We partner with product, marketing, and growth teams at companies selling complex, configurable, or premium products. Our job is to make the product easier to understand and harder to forget — through the website experience itself.",
    },
  },
  // ── CONTACT PAGE (multi-step wizard) ──
  contactPage: {
    eyebrow: "Get in touch",
    headline: "Let's build something worth remembering.",
    copy: "Walk through a few quick steps so we can understand your project and respond with a tailored proposal.",
    facts: [
      "Response within 48 hours",
      "Tailored proposal, not a template",
      "No obligations, no pressure",
    ],
    wizard: {
      stepLabel: "Step",
      previous: "Back",
      next: "Continue",
      submit: "Send brief",
      successTitle: "Brief sent!",
      successCopy: "Thanks for the details. We'll get back to you within 48 hours with next steps.",
      steps: [
        { title: "About you", copy: "Tell us who you are and where to reach you." },
        { title: "Your project", copy: "What are you building and what stage is it at?" },
        { title: "Scope & goals", copy: "What do you need, and what should the experience achieve?" },
        { title: "Timeline & budget", copy: "Help us understand your constraints so we can scope accurately." },
      ],
    },
    fields: {
      fullName: { label: "Your name", placeholder: "Alex Morgan" },
      email: { label: "Work email", placeholder: "alex@company.com" },
      company: { label: "Company", placeholder: "Northline Systems" },
      website: { label: "Current website", placeholder: "northline.com" },
      productName: { label: "Product or offer", placeholder: "Modular pergola range" },
      brief: {
        label: "Additional context",
        placeholder: "Anything we should know about your buying cycles, launch timeline, or technical constraints?",
      },
    },
    groups: {
      projectType: {
        label: "What are you planning?",
        description: "Choose the primary engagement type.",
        multi: false,
        options: [
          { value: "configurator", label: "3D Configurator" },
          { value: "product-site", label: "Product Website" },
          { value: "launch-site", label: "Launch Experience" },
          { value: "interactive-demo", label: "Interactive Demo" },
          { value: "redesign", label: "Site Redesign" },
        ],
      },
      productStage: {
        label: "Where is the project today?",
        description: "Current stage of the product or campaign.",
        multi: false,
        options: [
          { value: "new-launch", label: "New launch" },
          { value: "growth", label: "Growth push" },
          { value: "repositioning", label: "Repositioning" },
          { value: "sales-enable", label: "Sales enablement" },
        ],
      },
      goals: {
        label: "What should the experience drive?",
        description: "Pick all that apply.",
        multi: true,
        options: [
          { value: "clarity", label: "Clarify a complex offer" },
          { value: "show-options", label: "Show options visually" },
          { value: "lead-quality", label: "Improve lead quality" },
          { value: "sales-support", label: "Support sales conversations" },
          { value: "launch-momentum", label: "Strengthen a launch" },
        ],
      },
      deliverables: {
        label: "What do you need us to deliver?",
        description: "Select the workstreams you want us to own.",
        multi: true,
        options: [
          { value: "strategy", label: "Strategy & messaging" },
          { value: "design-build", label: "UI design & front-end" },
          { value: "threejs", label: "Three.js / WebGL" },
          { value: "models", label: "3D model production" },
          { value: "renders", label: "Renders & motion" },
          { value: "cms", label: "CMS integration" },
        ],
      },
      timeline: {
        label: "Preferred timeline",
        description: "Choose the pace you're targeting.",
        multi: false,
        options: [
          { value: "2-weeks", label: "Within 2 weeks" },
          { value: "1-month", label: "Within 1 month" },
          { value: "2-3-months", label: "2–3 months" },
          { value: "flexible", label: "Flexible" },
        ],
      },
      budget: {
        label: "Budget range",
        description: "Helps us recommend the right scope.",
        multi: false,
        options: [
          { value: "4900-9900", label: "$4,900 – $9,900" },
          { value: "10000-19900", label: "$10,000 – $19,900" },
          { value: "20000-49900", label: "$20,000 – $49,900" },
          { value: "50000-plus", label: "$50,000+" },
        ],
      },
    },
    stepLayout: [
      { fieldKeys: ["fullName", "email", "company", "website"] },
      { fieldKeys: ["productName"], groupKeys: ["projectType", "productStage"] },
      { groupKeys: ["goals", "deliverables"] },
      { fieldKeys: ["brief"], groupKeys: ["timeline", "budget"] },
    ],
  },
  // ── CONFIGURATOR DEMO (kept on Services page) ──
  configuratorDemo: {
    eyebrow: "Live Demo",
    title: "Try it yourself.",
    copy: "Switch between products, change finishes, adjust scale, and orbit freely. This is a real WebGL configurator — the same technology we ship to clients.",
    sidebar: {
      label: "What this proves",
      title: "One interface. Multiple product types.",
      copy: "The same configurator architecture supports furniture, consumer tech, and XR hardware — all performant enough for a premium website.",
      points: [
        "Real GLB models",
        "Finish and scale presets",
        "Scene-aware staging",
        "AR / VR ready",
      ],
    },
    delivery: {
      copy: "Extensible with variant logic, pricing rules, CMS data, analytics, and device-specific AR/VR handoff.",
    },
    shell: {
      label: "Configurator",
      title: "Live 3D viewer with product switching and option logic.",
      copy: "Change the model, test presets, orbit freely, and launch AR or VR on supported devices.",
      stageBadge: "Live preview",
      footerPoints: [
        "Real 3D assets",
        "Orbit and zoom",
        "Finish logic",
        "AR / VR ready",
      ],
      viewer: {
        loading: "Loading model…",
        error: "This model could not be loaded. Please refresh and try again.",
        dragHint: "Drag to orbit · Scroll to zoom",
        xrNote: "AR and VR on supported browsers and devices via WebXR.",
        arLaunch: "Enter AR",
        arExit: "Exit AR",
        arUnsupported: "AR unavailable",
        vrLaunch: "Enter VR",
        vrExit: "Exit VR",
        vrUnsupported: "VR unavailable",
      },
    },
  },
  heroConfiguratorProducts: [
    {
      key: "sofa",
      label: "Lounge Sofa",
      category: "Furniture",
      previewNote: "Real sofa model with finish, footprint, and staging presets.",
      controls: [
        {
          id: "size",
          label: "Footprint",
          type: "pill",
          options: [
            { value: "compact", label: "Compact" },
            { value: "standard", label: "Standard" },
            { value: "expansive", label: "Expansive" },
          ],
        },
        {
          id: "finish",
          label: "Upholstery",
          type: "swatch",
          options: [
            { value: "graphite", label: "Graphite", color: "#6f7983" },
            { value: "sand", label: "Sand", color: "#d8d0c6" },
            { value: "sage", label: "Sage", color: "#7d8977" },
          ],
        },
        {
          id: "feature",
          label: "Focus",
          type: "pill",
          options: [
            { value: "lounge", label: "Lounge view" },
            { value: "detail", label: "Material detail" },
            { value: "styling", label: "Styling angle" },
          ],
        },
        {
          id: "environment",
          label: "Scene",
          type: "pill",
          options: [
            { value: "loft", label: "Loft" },
            { value: "showroom", label: "Showroom" },
            { value: "editorial", label: "Editorial" },
          ],
        },
      ],
    },
    {
      key: "phone",
      label: "iPhone 14 Pro Max",
      category: "Consumer tech",
      previewNote: "Real device model with finish, scale, and feature-focus presets.",
      controls: [
        {
          id: "size",
          label: "Scale",
          type: "pill",
          options: [
            { value: "pocket", label: "Pocket" },
            { value: "standard", label: "Standard" },
            { value: "hero", label: "Hero shot" },
          ],
        },
        {
          id: "finish",
          label: "Finish",
          type: "swatch",
          options: [
            { value: "graphite", label: "Graphite", color: "#5c6470" },
            { value: "silver", label: "Silver", color: "#d4d9e1" },
            { value: "blue", label: "Deep blue", color: "#5d708e" },
          ],
        },
        {
          id: "feature",
          label: "Focus",
          type: "pill",
          options: [
            { value: "camera", label: "Camera system" },
            { value: "display", label: "Display glass" },
            { value: "frame", label: "Titanium frame" },
          ],
        },
        {
          id: "environment",
          label: "Scene",
          type: "pill",
          options: [
            { value: "studio", label: "Studio" },
            { value: "retail", label: "Retail" },
            { value: "night", label: "Night" },
          ],
        },
      ],
    },
    {
      key: "headset",
      label: "VR Headset",
      category: "XR hardware",
      previewNote: "Real headset model with fit, finish, and mode presets.",
      controls: [
        {
          id: "size",
          label: "Fit",
          type: "pill",
          options: [
            { value: "compact", label: "Compact" },
            { value: "standard", label: "Standard" },
            { value: "extended", label: "Extended" },
          ],
        },
        {
          id: "finish",
          label: "Finish",
          type: "swatch",
          options: [
            { value: "carbon", label: "Carbon", color: "#4d5663" },
            { value: "frost", label: "Frost", color: "#d6dde6" },
            { value: "neon", label: "Neon", color: "#6f8ffc" },
          ],
        },
        {
          id: "feature",
          label: "Mode",
          type: "pill",
          options: [
            { value: "gaming", label: "Gaming" },
            { value: "productivity", label: "Productivity" },
            { value: "demo", label: "Demo" },
          ],
        },
        {
          id: "environment",
          label: "Scene",
          type: "pill",
          options: [
            { value: "stage", label: "Stage" },
            { value: "lab", label: "Lab" },
            { value: "immersive", label: "Immersive" },
          ],
        },
      ],
    },
  ],
  footer: {
    copy: "Digital product studio specializing in 3D websites, configurators, and launch experiences.",
    cta: "Start a project",
    servicesTitle: "Services",
    services: [
      "3D Configurators",
      "Product Websites",
      "Launch Experiences",
      "Asset Production",
    ],
    companyTitle: "Company",
    company: ["About", "Work", "Pricing", "Contact"],
    contactTitle: "Contact",
    contactItems: [
      "hello@configuro.studio",
      "Global delivery, remote-first",
    ],
    copyright: "© 2026 Configuro. All rights reserved.",
  },
};

export default en;
