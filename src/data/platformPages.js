export const platformPages = {
  upwork: {
    slug: "upwork",
    platform: "Upwork",
    theme: "cobalt",
    headline: "Your Upwork shortlist ends here.",
    lede:
      "Bring the job post, rough brief, or half-formed idea. Configuro turns it into a clear product plan, reviewable milestones, and a production-ready build—without adding another layer of project management.",
    primaryCta: "Scope my Upwork project",
    secondaryCta: "See relevant work",
    proof: ["Clear scope", "3–5 milestones", "Weekly demos", "Documented handoff"],
    processTitle: "Built for the way Upwork projects run",
    processIntro:
      "A fixed-price project works best when every stage produces something you can review. We shape the engagement around concrete outputs before build work begins.",
    process: [
      { title: "Discovery", output: "Scope, requirements and success criteria", mark: "01" },
      { title: "Prototype", output: "Clickable flow or technical proof", mark: "02" },
      { title: "Build", output: "Working product with integrations and QA", mark: "03" },
      { title: "Launch", output: "Deployment, documentation and walkthrough", mark: "04" },
    ],
    fitTitle: "The senior team behind the proposal",
    fitCopy:
      "You work with the people designing and building the product. That keeps decisions fast, technical risks visible, and the final handoff clean.",
    fit: [
      ["Before the contract", "We turn the brief into assumptions, exclusions, deliverables and milestone options."],
      ["During delivery", "You get a concise update, a reviewable build and the next decision—never a vague activity report."],
      ["At handoff", "You receive source files, deployment notes, credentials guidance and a recorded walkthrough."],
    ],
    servicesTitle: "One contract. The right mix of craft.",
    services: [
      ["Product engineering", "Web apps, mobile workflows, client portals and operational tools."],
      ["3D commerce", "Interactive product configurators, WebGL viewers and premium renders."],
      ["CRM automation", "HubSpot, Zoho and GoHighLevel workflows connected to the real sales process."],
      ["Shopify", "High-performance storefronts, custom sections, apps and integrations."],
    ],
    briefTitle: "Bring us the brief you already posted.",
    briefCopy:
      "Paste the essentials. We’ll reply with the questions, likely delivery shape and a practical first milestone.",
    faqs: [
      ["Can we keep the contract on Upwork?", "Yes. If your project starts on Upwork, contracting, milestone funding and project messages can remain there."],
      ["Do you work fixed-price or hourly?", "Both. Defined outcomes suit fixed-price milestones; evolving product work is usually better with a controlled weekly allocation."],
      ["What should the first milestone be?", "Usually a paid discovery, clickable prototype or technical proof that removes the largest uncertainty before full production."],
      ["Will I own the source files?", "Our proposal states the handoff clearly. Completed, paid deliverables include the agreed source files and documentation."],
    ],
    disclaimer: "Configuro is an independent studio and is not affiliated with Upwork.",
  },
  freelancer: {
    slug: "freelancer",
    platform: "Freelancer.com",
    theme: "sky",
    headline: "Turn a promising bid into a dependable build.",
    lede:
      "You have plenty of bids. What you need is a delivery plan you can compare: named outputs, realistic dates, visible risk, and milestone payments tied to work you can inspect.",
    primaryCta: "Review my project brief",
    secondaryCta: "Compare our process",
    proof: ["Bid clarified", "Milestones proposed", "Risks surfaced", "Files organized"],
    processTitle: "From project post to controlled delivery",
    processIntro:
      "We make the bid useful before asking you to award it. Each phase has a definition of done and a review point.",
    process: [
      { title: "Qualify", output: "Questions, constraints and feasibility", mark: "A" },
      { title: "Propose", output: "Itemized scope and payment schedule", mark: "B" },
      { title: "Execute", output: "Staged work with visible progress", mark: "C" },
      { title: "Release", output: "Validated delivery and clean archive", mark: "D" },
    ],
    fitTitle: "A bid you can evaluate—not decode",
    fitCopy:
      "Freelancer projects move faster when assumptions are exposed early. We show what is included, what is not, and what evidence unlocks the next milestone.",
    fit: [
      ["Comparable scope", "Deliverables are written as outcomes so you can compare substance, not just total price."],
      ["Milestone control", "Proposed milestones connect a task, review artifact, date and payment in one line."],
      ["Platform continuity", "Project correspondence and payments can stay on Freelancer.com when the engagement originates there."],
    ],
    servicesTitle: "Projects that benefit from a multidisciplinary bid",
    services: [
      ["Web platforms", "Dashboards, portals, quoting tools and responsive customer experiences."],
      ["Mobile workflows", "Field, service and operations apps shaped around real working conditions."],
      ["Automation", "Lead routing, CRM stages, notifications, reporting and AI-assisted admin."],
      ["Visualization", "3D products, environments and configurators that explain complex offers."],
    ],
    briefTitle: "Let us sharpen the project before you award it.",
    briefCopy:
      "Share the post or requirements. We’ll identify the missing decisions and propose a milestone structure you can inspect.",
    faqs: [
      ["Can you propose Freelancer.com milestones?", "Yes. We can map each substantial deliverable to a proposed milestone so the schedule and release points are clear."],
      ["What if my specification is incomplete?", "That is common. We isolate unknowns and use a short discovery milestone before committing to the full implementation."],
      ["Do you take over unfinished projects?", "Yes, after a code and asset audit. The first output is a recovery plan with risks, priorities and realistic next steps."],
      ["How do revisions work?", "Every proposal defines review windows and included revision rounds by milestone so feedback does not become open-ended scope."],
    ],
    disclaimer: "Configuro is an independent studio and is not affiliated with Freelancer.com.",
  },
  fiverr: {
    slug: "fiverr",
    platform: "Fiverr",
    theme: "mint",
    headline: "When a standard Gig is too small for the idea.",
    lede:
      "Configuro packages complex product work into a custom offer you can understand—clear requirements, the right delivery model, defined revisions, and checkpoints for larger builds.",
    primaryCta: "Shape a custom offer",
    secondaryCta: "Explore deliverables",
    proof: ["Brief refined", "Offer tailored", "Revisions defined", "Delivery packaged"],
    processTitle: "A custom offer with the ambiguity removed",
    processIntro:
      "Simple tasks can stay simple. Larger products are separated into meaningful checkpoints so expectations remain visible from order to final delivery.",
    process: [
      { title: "Brief", output: "Goals, references, budget and timeline", mark: "1" },
      { title: "Offer", output: "Deliverables, options and revision terms", mark: "2" },
      { title: "Create", output: "Visible drafts and milestone deliveries", mark: "3" },
      { title: "Package", output: "Final files, source and usage notes", mark: "4" },
    ],
    fitTitle: "Buy an outcome, not a mystery box",
    fitCopy:
      "The offer states exactly what arrives, which inputs we need, how many review rounds are included, and what would count as a new request.",
    fit: [
      ["Right-sized order", "One-off delivery for a contained task; milestones for complex builds; recurring work only when the need is genuinely ongoing."],
      ["Visible revisions", "Review points and revision allowances are attached to specific outputs, not left as a vague promise."],
      ["Useful final delivery", "Files are named, organized and accompanied by the context needed to use or continue the work."],
    ],
    servicesTitle: "Specialist deliverables that connect",
    services: [
      ["UX & interface design", "Flows, wireframes, design systems and production-ready screens."],
      ["Frontend builds", "Responsive React experiences, landing pages and interactive product UI."],
      ["3D & motion", "Product renders, configuration assets, launch visuals and cinematic sequences."],
      ["Automation setup", "Forms, CRM pipelines, integrations and practical AI workflows."],
    ],
    briefTitle: "Ask for the offer your project actually needs.",
    briefCopy:
      "Send the goal, references and constraints. We’ll recommend a single delivery, phased milestones, or an ongoing structure—whichever fits.",
    faqs: [
      ["Can you send a custom offer on Fiverr?", "Yes, when the conversation begins through Fiverr. We scope the deliverables, timing, revisions and suitable order structure first."],
      ["Are milestones always necessary?", "No. They are useful for complex, multi-stage work. A focused deliverable is often clearer as one order."],
      ["Can I request a smaller paid test?", "Yes. A useful test should produce a real artifact, such as one key screen, a product render or a technical proof—not throwaway work."],
      ["What do you need for an accurate quote?", "The business goal, audience, current assets, examples you like, required integrations, deadline and an honest budget range."],
    ],
    disclaimer: "Configuro is an independent studio and is not affiliated with Fiverr.",
  },
  toptal: {
    slug: "toptal",
    platform: "Toptal",
    theme: "violet",
    headline: "Senior product execution, without a long ramp-up.",
    lede:
      "For teams comparing elite talent models, Configuro offers a focused alternative: a compact senior studio that can own design, engineering, automation, and 3D as one accountable delivery unit.",
    primaryCta: "Meet the delivery model",
    secondaryCta: "Review capabilities",
    proof: ["Senior-led", "Cross-functional", "Fast context", "Handoff ready"],
    processTitle: "Integrate quickly. Leave the product stronger.",
    processIntro:
      "The engagement is designed to join an existing team or own a defined product stream without creating permanent coordination overhead.",
    process: [
      { title: "Context", output: "Architecture, product and team map", mark: "I" },
      { title: "Embed", output: "Rituals, access and first production task", mark: "II" },
      { title: "Deliver", output: "Owned workstream with measurable output", mark: "III" },
      { title: "Transfer", output: "Decisions, documentation and continuity", mark: "IV" },
    ],
    fitTitle: "A studio when one specialist is not enough",
    fitCopy:
      "Some initiatives cross product strategy, interface design, backend systems and content. A small senior pod keeps those decisions coherent while giving you one accountable lead.",
    fit: [
      ["Add a workstream", "We can own a defined product surface while your internal team retains roadmap and architectural control."],
      ["Fill a capability gap", "Bring in 3D commerce, automation or product design without assembling several independent contractors."],
      ["Create continuity", "Decisions, code and operating knowledge are documented for your permanent team from day one."],
    ],
    servicesTitle: "Executive clarity. Production depth.",
    services: [
      ["Product direction", "Problem framing, prioritization, prototyping and delivery planning."],
      ["Full-stack execution", "Modern web products, APIs, data models and integrations."],
      ["Experience systems", "Design systems, high-value interfaces and interactive 3D."],
      ["Operational leverage", "CRM, AI and workflow automation tied to measurable team friction."],
    ],
    briefTitle: "Define the gap. We’ll define the engagement.",
    briefCopy:
      "Tell us the outcome, current team and missing capability. We’ll respond with the smallest senior setup that can own it well.",
    faqs: [
      ["Are you part of the Toptal network?", "This page makes no such claim. Configuro is an independent studio for buyers comparing senior external delivery options."],
      ["Can you work inside our existing team?", "Yes. We agree ownership boundaries, communication rhythm, repositories and decision-makers during onboarding."],
      ["Can the engagement start with a trial?", "We can begin with a short paid diagnostic or production sprint with explicit outcomes before a longer commitment."],
      ["Who leads the work?", "A senior Configuro lead remains accountable for scope, decisions and delivery; specialist contributors are introduced when their work is relevant."],
    ],
    disclaimer: "Configuro is an independent studio and is not affiliated with Toptal.",
  },
  shopify: {
    slug: "shopify",
    platform: "Shopify",
    theme: "commerce",
    headline: "A Shopify store engineered to sell.",
    lede:
      "New stores, redesigns, migrations, flexible theme sections, custom apps and reliable integrations—built around the way your team merchandises and your customers buy.",
    primaryCta: "Plan my Shopify build",
    secondaryCta: "See commerce work",
    proof: ["Store builds", "Theme development", "Custom apps", "CRO & speed"],
    processTitle: "Our commerce build system",
    processIntro:
      "A storefront is a working sales system. Strategy, content structure, engineering and handoff are designed together so the store remains fast and manageable after launch.",
    process: [
      { title: "Strategy & UX", output: "Journeys, content model, wireframes and measurement plan", mark: "01" },
      { title: "Shopify engineering", output: "Theme, sections, metafields, apps and integrations", mark: "02" },
      { title: "QA & migration", output: "Devices, data, redirects, analytics and launch checks", mark: "03" },
      { title: "Growth & handoff", output: "Training, documentation and prioritized improvements", mark: "04" },
    ],
    fitTitle: "From storefront friction to commercial flow",
    fitCopy:
      "We remove the theme debt and brittle workarounds that make every campaign slower, then give your team flexible components with sensible guardrails.",
    fit: [
      ["Slow, bloated theme", "Audit the critical path, remove unnecessary weight and rebuild the highest-impact templates cleanly."],
      ["Rigid content blocks", "Create brand-specific sections and metafields your team can safely reuse without developer help."],
      ["Disconnected tools", "Connect product, inventory, CRM, fulfillment and reporting systems with visible failure handling."],
    ],
    servicesTitle: "Shopify expertise across the store lifecycle",
    services: [
      ["Build or redesign", "A new storefront or a deliberate redesign grounded in products, content and conversion paths."],
      ["Theme development", "Custom Liquid sections, templates, metafields and maintainable theme architecture."],
      ["Apps & integrations", "Custom app logic and reliable connections to the systems behind the storefront."],
      ["Migration & optimization", "Catalog and redirect planning, analytics checks, performance and post-launch iteration."],
    ],
    briefTitle: "Get a tailored Shopify build plan.",
    briefCopy:
      "Share the current store, commercial goal and constraints. We’ll identify the highest-leverage path and the risks to solve first.",
    migration: ["Catalog", "Customers", "Orders", "Content", "SEO redirects", "Analytics"],
    faqs: [
      ["Can you migrate an existing store?", "Yes. We plan data mapping, content, URLs, redirects, integrations, tracking and launch validation before the switch."],
      ["Do you customize existing themes?", "Yes, when the theme is a sound base. If accumulated customizations make it fragile or slow, we explain the cost of repair versus a cleaner rebuild."],
      ["Can you build custom Shopify apps?", "Yes. We first confirm whether a trusted existing app solves the need; custom work is reserved for workflows or differentiators that justify ownership."],
      ["Will our team be able to manage the store?", "That is a core requirement. We build flexible sections with guardrails, then provide documentation and a practical handoff session."],
    ],
    disclaimer: "Configuro is an independent studio and is not affiliated with Shopify.",
  },
};

export const platformOrder = ["upwork", "freelancer", "fiverr", "toptal", "shopify"];

