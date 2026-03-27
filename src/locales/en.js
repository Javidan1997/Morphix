const en = {
  meta: {
    title: "Morphix | 3D Product Websites and Configurators",
    description:
      "Morphix designs and builds 3D product websites, configurators, launch pages, and interactive experiences for technical and premium brands.",
  },
  common: {
    brandName: "Morphix",
    homeAriaLabel: "Morphix home",
    primaryNavAriaLabel: "Primary",
    languageSwitcherLabel: "Language",
    productExamplesAriaLabel: "Product configurator examples",
  },
  nav: {
    hero: "Hero",
    capabilities: "Capabilities",
    pricing: "Pricing",
    about: "About",
    contact: "Contact",
    cta: "Discuss your product",
  },
  hero: {
    eyebrow: "3D product websites and configurators",
    proofline: [
      "Three.js implementation",
      "3D models and renders included",
      "Production-ready front-end delivery",
    ],
    title: "3D product websites that make complex products",
    titleAccent: "easier to understand and configure.",
    copy:
      "Morphix builds serious, production-ready experiences for configurable, technical, and premium products. We combine clear messaging, Three.js interaction, product logic, and web-ready asset delivery so customers can evaluate options with more confidence and less friction.",
    primaryCta: "Plan your configurator",
    secondaryCta: "View demo section",
    stats: [
      {
        label: "Use cases",
        value: "configurators, launch pages, product explainers",
      },
      {
        label: "Product logic",
        value: "size, finish, variants, modules, attachments",
      },
      {
        label: "Delivery",
        value: "Three.js, assets, renders, and launch support",
      },
    ],
    stage: {
      label: "Structured for launch",
      title: "Serious product storytelling with 3D depth where it helps the buyer.",
      copy:
        "We design the product narrative, the interaction model, and the delivery system together so the site stays persuasive, fast, and maintainable.",
      points: [
        "Clear page structure",
        "Interactive product logic",
        "3D assets and renders",
        "Production handoff",
      ],
    },
    delivery: {
      chip: "Built for real product teams",
      copy:
        "For configurable products, we can own the website interface, the Three.js implementation, the 3D asset workflow, and the visuals your team needs for launch, campaigns, and sales.",
      points: [
        "Product pages",
        "Configurator logic",
        "Asset production",
        "Launch support",
      ],
    },
  },
  configuratorDemo: {
    eyebrow: "Interactive Configurator Demo",
    title: "A real 3D configurator workspace powered by actual product models.",
    copy:
      "Switch between a sofa, phone, and XR headset, then test finish, scale, focus, and scene presets against real GLB assets. The demo now runs as a live WebGL viewer with orbit controls and WebXR launch hooks instead of a static illustration.",
    sidebar: {
      label: "What this demo proves",
      title: "One interface, multiple product types, real 3D assets.",
      copy:
        "The same configurator architecture can support furniture, consumer tech, and XR hardware while keeping the buying flow structured and the viewer performant enough for a premium website.",
      points: [
        "Real GLB model loading",
        "Finish and scale presets",
        "Scene-aware product staging",
        "AR and VR session support",
      ],
    },
    delivery: {
      copy:
        "The same setup can be extended with variant logic, pricing rules, CMS-fed product data, analytics events, and device-specific AR or VR handoff for production launches.",
    },
    shell: {
      label: "Real-time configurator demo",
      title: "Live WebGL viewer with product switching, option logic, and XR launch controls.",
      copy:
        "Change the active model, test finish and scene presets, orbit the asset freely, and launch AR or VR on supported devices without leaving the product flow.",
      stageBadge: "Real model preview",
      footerPoints: [
        "Real 3D assets",
        "Orbit and zoom",
        "Finish and scene logic",
        "AR / VR ready",
      ],
      viewer: {
        loading: "Loading model...",
        error: "This model could not be loaded right now. Please refresh and try again.",
        dragHint: "Drag to orbit. Scroll or pinch to zoom.",
        xrNote: "AR and VR launch on supported browsers and devices with WebXR.",
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
  servicesSection: {
    eyebrow: "Services",
    title: "Customizable product configurators and product websites built for real buyers.",
    copy:
      "We build product experiences that help customers configure, compare, and understand what they are buying before they speak to sales or commit to purchase.",
    showcaseEyebrow: "Configurator Systems",
    showcaseTitle: "We build advanced website configurators for products with real-world options.",
    showcaseCopy:
      "For brands selling pergolas, furniture, lighting, equipment, and other configurable products, we can create guided configurators where users change dimensions, colors, materials, accessories, side modules, and environment views with immediate visual feedback.",
    configuratorFeatures: [
      {
        title: "Option controls customers actually use",
        copy:
          "Size, finish, color, product type, attachments, accessories, side panels, lighting, and other high-impact choices can be handled in one clear interface.",
      },
      {
        title: "Environment-aware product visualization",
        copy:
          "We can switch environments, camera views, and contextual scenes so buyers can evaluate the product in a more realistic setting.",
      },
      {
        title: "3D assets included",
        copy:
          "We can deliver the 3D models, materials, optimized web assets, and supporting renders required to launch the configurator properly.",
      },
      {
        title: "Built with Three.js for the web",
        copy:
          "Our configurator systems are designed for responsive product websites and can be integrated with pricing logic, CMS content, and commerce flows.",
      },
    ],
    services: [
      {
        title: "Custom Three.js configurators",
        copy:
          "Website-integrated configurators that let customers change size, finish, color, product options, attachments, and views with immediate visual feedback.",
        tags: ["Three.js", "Options", "Commerce"],
      },
      {
        title: "Product launch websites",
        copy:
          "Launch pages for software, hardware, and premium products that combine product narrative, proof, and conversion structure in one clear customer journey.",
        tags: ["Launch", "Messaging", "Conversion"],
      },
      {
        title: "3D models and render production",
        copy:
          "We produce optimized 3D assets, studio renders, product cutaways, and configuration-ready model sets for websites, campaigns, and sales tools.",
        tags: ["Models", "Renders", "Assets"],
      },
      {
        title: "Interactive product demos",
        copy:
          "Guided 3D and motion-led demos that help customers understand capabilities, workflows, and differentiators before they book a call or start a trial.",
        tags: ["Demo", "Education", "Conversion"],
      },
    ],
    portfolioEyebrow: "Portfolio",
    portfolioTitle:
      "Representative product use cases for teams selling complex or premium offers.",
    portfolio: [
      {
        name: "Pergola configurator system",
        type: "Outdoor products",
        result:
          "A configurable product experience where customers can adjust size, side options, lighting, accessories, and mounting choices in one guided buying flow.",
      },
      {
        name: "Premium consumer electronics",
        type: "Consumer product",
        result:
          "Interactive feature walkthroughs and product comparison views designed to improve understanding before purchase.",
      },
      {
        name: "Enterprise SaaS platform",
        type: "Software",
        result:
          "A high-clarity site system that turns abstract platform value into a concrete story for decision-makers and evaluators.",
      },
    ],
  },
  buildSection: {
    eyebrow: "What We Can Build",
    title: "What we can build for product, marketing, and growth teams.",
    copy:
      "The goal is not novelty for its own sake. The goal is a clearer product story, better customer understanding, and a site your team can confidently launch and maintain.",
    items: [
      {
        title: "Website-based product configurators",
        copy:
          "Interactive product systems where customers can change size, color, material, product variants, accessories, and attachments directly on the website.",
      },
      {
        title: "Environment and VR previews",
        copy:
          "Views that place the product in different environments or immersive contexts so buyers can better visualize fit, scale, and outcome.",
      },
      {
        title: "3D model and render packages",
        copy:
          "Production-ready model creation, texturing, lighting, and render output for websites, configurators, campaigns, and product marketing assets.",
      },
      {
        title: "Technical product explainers",
        copy:
          "Structured visual storytelling for products that are difficult to explain with text alone, including workflows, systems, and component views.",
      },
      {
        title: "Commerce-ready product pages",
        copy:
          "High-clarity product pages that improve customer understanding and trust before purchase, especially for higher-consideration products.",
      },
      {
        title: "Sales and launch microsites",
        copy:
          "Dedicated pages for launches, ABM campaigns, demos, and sales enablement where the story needs to stay focused and persuasive.",
      },
    ],
  },
  salesSection: {
    eyebrow: "How It Increases Sales",
    title: "How the site helps customers move toward a decision.",
    copy:
      "Good product marketing reduces confusion. A better digital experience helps visitors understand the offer, trust the team, and move forward with more confidence.",
    kicker: "Sales signal",
    drivers: [
      {
        title: "Reduces product ambiguity",
        copy:
          "Customers understand what the product does, who it is for, and why it matters without having to decode dense or technical messaging.",
      },
      {
        title: "Improves decision confidence",
        copy:
          "Clearer visuals and guided motion help buyers feel more certain before they request a demo, contact sales, or move toward checkout.",
      },
      {
        title: "Supports higher-consideration purchases",
        copy:
          "For premium, configurable, or technical products, a better product story can justify attention and support a longer evaluation path.",
      },
      {
        title: "Improves lead quality",
        copy:
          "When the site answers more questions up front, sales conversations start with better context and more qualified intent.",
      },
    ],
  },
  processSection: {
    eyebrow: "Our Process",
    title: "A delivery process built for clarity, speed, and clean handoff.",
    copy:
      "Every phase is designed to keep the work understandable for stakeholders and manageable for the team responsible for launch.",
    steps: [
      {
        step: "01",
        title: "Discovery and goals",
        copy:
          "We align on the product, audience, buying journey, and business goal so the experience supports how customers actually evaluate the offer.",
      },
      {
        step: "02",
        title: "Structure and prototype",
        copy:
          "We map information hierarchy, page structure, motion intent, and content flow so the experience is clear before full production begins.",
      },
      {
        step: "03",
        title: "Build and integrate",
        copy:
          "We build the site, connect forms or commerce flows, and optimize every scene for responsiveness, performance, and maintainability.",
      },
      {
        step: "04",
        title: "QA, launch, and handoff",
        copy:
          "We test across breakpoints, ship cleanly, and hand over a production-ready site your team can operate and extend with confidence.",
      },
    ],
  },
  pricingSection: {
    eyebrow: "Pricing",
    title: "Engagement models for launch work and longer-term product marketing.",
    copy:
      "Start with one focused product page, a multi-section site, or a custom engagement when the product requires a more complex system.",
    badge: "Most requested",
    cta: "Enquire now",
    tiers: [
      {
        tier: "Foundation",
        price: "$4,900",
        subtitle: "For one focused product page or launch experience.",
        features: [
          "Discovery workshop and page plan",
          "One high-impact product page",
          "One primary 3D motion sequence",
          "Responsive QA and handoff",
        ],
      },
      {
        tier: "Growth",
        price: "$14,900",
        subtitle: "For multi-section product sites with deeper customer journeys.",
        features: [
          "Multi-section product website",
          "Custom scene transitions and motion system",
          "CMS or API-ready content structure",
          "Launch support and optimization",
        ],
        featured: true,
      },
      {
        tier: "Custom",
        price: "Custom",
        subtitle:
          "For configurators, larger site systems, and ongoing product marketing work.",
        features: [
          "Complex data-driven product scenes",
          "Commerce, CRM, or CMS integrations",
          "Reusable component and motion system",
          "Ongoing optimization and support",
        ],
      },
    ],
  },
  aboutSection: {
    eyebrow: "About",
    title: "We build product marketing experiences that are visual, usable, and maintainable.",
    copy:
      "Morphix works with teams that need the website to do more than look good. It needs to explain the product, support the buyer journey, and be strong enough for real launch conditions.",
    principles: [
      {
        title: "Product understanding first",
        copy:
          "We use motion to clarify the product, not to decorate the page. The message stays readable and the decision path stays clear.",
      },
      {
        title: "Motion with a job to do",
        copy:
          "Every interaction should support orientation, explanation, or emphasis. If motion does not help the customer, it does not ship.",
      },
      {
        title: "Built for real teams",
        copy:
          "The final site is structured for content updates, responsive QA, and long-term maintainability after launch.",
      },
    ],
  },
  contactSection: {
    eyebrow: "Project Intake",
    title: "Shape the right 3D experience through a guided intake.",
    copy:
      "Move through a few focused steps and tell us what you are launching, who you need to reach, which capabilities you need, and what constraints we should design around.",
    facts: [
      "Step-by-step project discovery",
      "Scope, systems, and assets covered",
      "Faster and better-qualified proposals",
    ],
    wizard: {
      introLabel: "Interactive brief builder",
      stepLabel: "Step",
      previous: "Back",
      next: "Continue",
      submit: "Request proposal",
      successTitle: "Brief captured",
      successCopy:
        "Your intake is now structured for a tailored follow-up. You can keep refining the details or use this as the basis for the next conversation.",
      steps: [
        {
          title: "Foundations",
          copy: "Start with the product, company, and overall project direction.",
        },
        {
          title: "Audience & goals",
          copy: "Tell us who needs to be convinced and what the experience should achieve.",
        },
        {
          title: "Scope & systems",
          copy: "Select the deliverables, integrations, and assets that matter to the build.",
        },
        {
          title: "Timing & contact",
          copy: "Add timeline, budget, and the final context we need to respond well.",
        },
      ],
    },
    fields: {
      company: { label: "Company", placeholder: "Northline Systems" },
      productName: { label: "Product or offer", placeholder: "Modular pergola range" },
      website: { label: "Current website", placeholder: "northline.com" },
      fullName: { label: "Your name", placeholder: "Alex Morgan" },
      email: { label: "Work email", placeholder: "alex@northlinesystems.com" },
      brief: {
        label: "Additional context",
        placeholder:
          "Anything we should know about buying cycles, internal approvals, launch pressure, or technical complexity?",
      },
    },
    groups: {
      projectType: {
        label: "What are you planning?",
        description: "Choose the primary engagement you need right now.",
        multi: false,
        options: [
          { value: "configurator", label: "3D configurator" },
          { value: "product-site", label: "Product website" },
          { value: "launch-site", label: "Launch microsite" },
          { value: "interactive-demo", label: "Interactive demo" },
          { value: "redesign", label: "Site redesign" },
        ],
      },
      productStage: {
        label: "Where is the project today?",
        description: "Tell us the current moment in the product or marketing cycle.",
        multi: false,
        options: [
          { value: "new-launch", label: "New launch" },
          { value: "growth-push", label: "Growth push" },
          { value: "repositioning", label: "Repositioning" },
          { value: "sales-enable", label: "Sales enablement" },
        ],
      },
      audience: {
        label: "Who is the primary audience?",
        description: "Select every group the site needs to serve well.",
        multi: true,
        options: [
          { value: "end-customers", label: "End customers" },
          { value: "enterprise-buyers", label: "Enterprise buyers" },
          { value: "technical-evaluators", label: "Technical evaluators" },
          { value: "partners", label: "Distributors or partners" },
          { value: "sales-teams", label: "Internal sales teams" },
        ],
      },
      goals: {
        label: "What should the experience drive?",
        description: "Pick the outcomes that matter most.",
        multi: true,
        options: [
          { value: "clarity", label: "Clarify a complex offer" },
          { value: "show-options", label: "Show options visually" },
          { value: "lead-quality", label: "Improve lead quality" },
          { value: "sales-support", label: "Support sales conversations" },
          { value: "launch-momentum", label: "Strengthen a launch campaign" },
        ],
      },
      deliverables: {
        label: "What do you need us to deliver?",
        description: "Select the workstreams you want us to own.",
        multi: true,
        options: [
          { value: "strategy", label: "Site strategy and messaging" },
          { value: "design-build", label: "UI design and front-end build" },
          { value: "threejs", label: "Three.js scenes or interactions" },
          { value: "models", label: "3D model production" },
          { value: "renders", label: "Render or motion asset pack" },
          { value: "cms", label: "CMS or content structure" },
        ],
      },
      integrations: {
        label: "Which systems matter?",
        description: "Flag the platforms or logic the project should connect to.",
        multi: true,
        options: [
          { value: "cms", label: "CMS" },
          { value: "crm", label: "CRM or forms" },
          { value: "commerce", label: "Commerce stack" },
          { value: "pricing", label: "Pricing or quote logic" },
          { value: "analytics", label: "Analytics" },
          { value: "localization", label: "Localization" },
        ],
      },
      assets: {
        label: "What do you already have?",
        description: "Tell us what is ready and what may still need production.",
        multi: true,
        options: [
          { value: "brand", label: "Brand system" },
          { value: "copy", label: "Messaging or copy" },
          { value: "cad", label: "CAD or 3D models" },
          { value: "renders", label: "Photography or renders" },
          { value: "team", label: "Internal dev or marketing team" },
          { value: "none", label: "We are starting from scratch" },
        ],
      },
      timeline: {
        label: "Preferred timeline",
        description: "Choose the pace you are targeting.",
        multi: false,
        options: [
          { value: "2-weeks", label: "Within 2 weeks" },
          { value: "1-month", label: "Within 1 month" },
          { value: "2-3-months", label: "Within 2 to 3 months" },
          { value: "flexible", label: "Flexible" },
        ],
      },
      budget: {
        label: "Budget range",
        description: "This helps us recommend the right scope from the start.",
        multi: false,
        options: [
          { value: "4900-9900", label: "$4,900 - $9,900" },
          { value: "10000-19900", label: "$10,000 - $19,900" },
          { value: "20000-49900", label: "$20,000 - $49,900" },
          { value: "50000-plus", label: "$50,000+" },
        ],
      },
    },
    summary: {
      title: "Project snapshot",
      empty: "Your selections will build a live brief here.",
      labels: {
        projectType: "Project",
        productStage: "Stage",
        audience: "Audience",
        goals: "Goals",
        deliverables: "Deliverables",
        integrations: "Integrations",
        assets: "Assets",
        timeline: "Timeline",
        budget: "Budget",
      },
    },
  },
  footer: {
    copy:
      "We build product websites and interactive experiences that help teams explain complex offers clearly and support better customer decisions.",
    cta: "Start a conversation",
    capabilitiesTitle: "What we build",
    capabilities: [
      "Product launch websites",
      "Interactive feature demos",
      "Configurator journeys",
      "Production-ready site systems",
    ],
    outcomesTitle: "Business impact",
    outcomes: [
      "Clarify the product",
      "Increase buyer confidence",
      "Support qualified enquiries",
      "Strengthen premium positioning",
    ],
    contactTitle: "Contact",
    contactItems: [
      "hello@morphix.studio",
      "Remote collaboration, global delivery",
      "Proposal turnaround within 48 hours",
    ],
    pricingLink: "View engagement models",
    copyright:
      "Copyright 2026 Morphix. Built for product launches, demos, and customer-facing site systems.",
  },
};

export default en;
