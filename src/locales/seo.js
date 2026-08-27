// Per-page SEO metadata. Every route gets a unique, keyword-rich title and
// description (search engines penalise duplicate titles across pages).
// Keyed by language, then by pathname. Falls back to content.meta when a
// route is missing here.

export const pageSeo = {
  en: {
    "/": {
      title: "Configuro | Design, Build & Automate — Apps, 3D Configurators & CRM",
      description:
        "Configuro is a design and engineering partner. We build web & mobile apps, interactive 3D configurators, and product sites, automate your CRM (Zoho, GoHighLevel, HubSpot), and produce premium 3D renders and film — end to end.",
      keywords:
        "web app development, mobile app development, 3D configurator, CRM automation, Zoho, GoHighLevel, HubSpot, 3D product rendering, product launch website",
    },
    "/services": {
      title: "Services — App Development, 3D Configurators & CRM Automation | Configuro",
      description:
        "Web and mobile apps, interactive 3D configurators, product sites, full CRM automation on Zoho, GoHighLevel and HubSpot, plus premium 3D renders and film. One team, end to end.",
      keywords:
        "software development agency, 3D configurator development, CRM automation agency, Zoho partner, GoHighLevel, HubSpot automation, product website design",
    },
    "/work": {
      title: "Work — Apps, Configurators & 3D Visualization Projects | Configuro",
      description:
        "Selected work across web apps, mobile and POS workflows, CRM automation, AI systems, 3D configurators, product launches, and photoreal architectural and product renders.",
      keywords:
        "web app portfolio, mobile app portfolio, POS app development, CRM automation case study, AI automation, 3D configurator examples, product website portfolio, architectural visualization",
    },
    "/pricing": {
      title: "Pricing — Project, Retainer & Custom Engagements | Configuro",
      description:
        "Simple engagements scoped to your goals. Fixed-scope projects, monthly retainers, or fully custom builds for apps, CRM automation, configurators, and 3D.",
      keywords: "app development pricing, CRM automation pricing, 3D configurator cost, retainer",
    },
    "/about": {
      title: "About — Design, Engineering & Automation Studio | Configuro",
      description:
        "Configuro combines design, software engineering, CRM automation, and 3D craft in one focused team built for premium products and brands.",
      keywords: "design and development studio, product engineering team, 3D studio",
    },
    "/contact": {
      title: "Start a Project — Get a Tailored Proposal | Configuro",
      description:
        "Tell us what you're building — an app, a 3D configurator, a CRM automation, or a launch. Tailored proposal, response within 48 hours.",
      keywords: "hire app developers, CRM automation consultation, 3D configurator quote",
    },
    "/playground": {
      title: "Live 3D Product Configurator Demo | Configuro",
      description:
        "Try a real WebGL product configurator — switch models, finishes, and scenes, and orbit freely. The same technology we ship to clients.",
      keywords: "3D configurator demo, WebGL product viewer, interactive 3D product",
    },
    "/templates": {
      title: "Templates — Launch-Ready 3D & Web Starting Points | Configuro",
      description:
        "Ready-to-customize starting points for product sites, 3D configurators, and launch experiences.",
      keywords: "3D website template, configurator template, product launch template",
    },
    "/insights": {
      title: "Insights — App, CRM Automation & 3D Guides | Configuro",
      description:
        "Practical guides on 3D configurators, live demos, CRM automation with Zoho, GoHighLevel and HubSpot, POS apps, app development, AI automation, and product visualization.",
      keywords: "3D configurator guide, CRM automation guide, app development blog, POS app development, AI automation, live product demo SEO",
    },
    "/portal": {
      title: "Client Portal | Configuro",
      description: "Sign in to your Configuro client portal to track your project, assets, and invoices.",
      keywords: "client portal",
      noindex: true,
    },
    "/freelance": {
      title: "Hire Configuro Through Freelance Platforms | Upwork, Fiverr & More",
      description:
        "Start a Configuro project through Upwork, Freelancer.com, Fiverr, or a direct senior-studio engagement. Compare platform-specific scope, milestones, reviews, and delivery.",
      keywords:
        "hire software development studio, Upwork agency alternative, Freelancer developer, Fiverr custom software, senior freelance development team",
      serviceName: "Freelance platform design and development services",
    },
    "/upwork": {
      title: "Upwork Web App, 3D & Automation Studio | Configuro",
      description:
        "Hiring on Upwork? Get a clear scope, 3–5 reviewable milestones, weekly demos, and documented handoff for web apps, mobile workflows, 3D configurators, CRM automation, and Shopify.",
      keywords:
        "Upwork web developer, Upwork agency, hire Upwork React developer, Upwork 3D configurator, Upwork CRM automation expert",
      serviceName: "Upwork project design and development",
    },
    "/freelancer": {
      title: "Freelancer.com Web Development & Automation Studio | Configuro",
      description:
        "Turn your Freelancer.com project post into a dependable build with an itemized scope, proposed milestones, visible risks, staged reviews, and organized source-file handoff.",
      keywords:
        "Freelancer.com web developer, hire Freelancer developer, Freelancer milestone project, custom web app Freelancer",
      serviceName: "Freelancer.com project design and development",
    },
    "/fiverr": {
      title: "Fiverr Custom Web, 3D & Automation Offers | Configuro",
      description:
        "Need more than a standard Fiverr Gig? Configuro scopes custom offers for UX, React development, 3D product work, and CRM automation with clear deliverables and revisions.",
      keywords:
        "Fiverr web developer, Fiverr custom offer, Fiverr React developer, Fiverr 3D product rendering, Fiverr automation expert",
      serviceName: "Fiverr custom digital production services",
    },
    "/toptal": {
      title: "Senior Product Design & Engineering Studio | Toptal Alternative | Configuro",
      description:
        "A compact senior product studio for teams comparing elite talent options. Add cross-functional product engineering, UX, automation, and interactive 3D without a long ramp-up.",
      keywords:
        "Toptal alternative, senior product engineering team, hire senior React developers, fractional product team",
      serviceName: "Senior product design and engineering team",
    },
    "/shopify": {
      title: "Shopify Development, Themes, Apps & Migration | Configuro",
      description:
        "Shopify store builds, redesigns, custom Liquid theme sections, apps, integrations, migration, CRO, and performance engineering—with a practical merchant handoff.",
      keywords:
        "Shopify developer, Shopify development agency, custom Shopify theme, Shopify app development, Shopify migration service, Shopify speed optimization",
      serviceName: "Shopify development and migration services",
    },
  },
  az: {
    "/": {
      title: "Configuro | Dizayn, Qurma və Avtomatlaşdırma — Tətbiqlər, 3D Konfiquratorlar və CRM",
      description:
        "Configuro dizayn və mühəndislik tərəfdaşıdır. Veb və mobil tətbiqlər, interaktiv 3D konfiquratorlar və məhsul saytları qururuq, CRM-inizi avtomatlaşdırırıq (Zoho, GoHighLevel, HubSpot) və premium 3D renderlər və film istehsal edirik.",
      keywords:
        "veb tətbiq hazırlanması, mobil tətbiq, 3D konfiqurator, CRM avtomatlaşdırma, Zoho, GoHighLevel, HubSpot, 3D render",
    },
    "/services": {
      title: "Xidmətlər — Tətbiq Hazırlanması, 3D Konfiquratorlar və CRM Avtomatlaşdırma | Configuro",
      description:
        "Veb və mobil tətbiqlər, interaktiv 3D konfiquratorlar, məhsul saytları, Zoho, GoHighLevel və HubSpot üzərində tam CRM avtomatlaşdırması və premium 3D renderlər. Bir komanda, baştan-sona.",
      keywords: "proqram təminatı agentliyi, 3D konfiqurator, CRM avtomatlaşdırma, Zoho, HubSpot",
    },
    "/work": {
      title: "İşlər — Tətbiqlər, Konfiquratorlar və 3D Vizuallaşdırma Layihələri | Configuro",
      description:
        "Proqram təminatı, avtomatlaşdırma və vizuallaşdırma üzrə seçilmiş işlər — 3D konfiquratorlar, məhsul buraxılışları, CRM sistemləri və fotoreal renderlər.",
      keywords: "3D konfiqurator nümunələri, məhsul saytı portfoliosu, arxitektura vizuallaşdırması",
    },
    "/pricing": {
      title: "Qiymətlər — Layihə, Abunə və Xüsusi Əməkdaşlıqlar | Configuro",
      description:
        "Məqsədlərinizə uyğun sadə əməkdaşlıqlar. Sabit həcmli layihələr, aylıq abunələr və ya tətbiqlər, CRM avtomatlaşdırma və 3D üçün tam xüsusi qurmalar.",
      keywords: "tətbiq hazırlanması qiyməti, CRM avtomatlaşdırma qiyməti, 3D konfiqurator",
    },
    "/about": {
      title: "Haqqımızda — Dizayn, Mühəndislik və Avtomatlaşdırma Studiyası | Configuro",
      description:
        "Configuro dizaynı, proqram mühəndisliyini, CRM avtomatlaşdırmasını və 3D sənətkarlığını bir fokuslanmış komandada birləşdirir.",
      keywords: "dizayn və inkişaf studiyası, məhsul mühəndisliyi komandası, 3D studiya",
    },
    "/contact": {
      title: "Layihəyə Başla — Fərdi Təklif Alın | Configuro",
      description:
        "Nə qurduğunuzu bizə deyin — tətbiq, 3D konfiqurator, CRM avtomatlaşdırma və ya buraxılış. Fərdi təklif, 48 saat ərzində cavab.",
      keywords: "tətbiq developerləri, CRM avtomatlaşdırma məsləhəti, 3D konfiqurator qiyməti",
    },
    "/playground": {
      title: "Canlı 3D Məhsul Konfiquratoru Demosu | Configuro",
      description:
        "Real WebGL məhsul konfiquratorunu sınayın — modelləri, örtükləri və səhnələri dəyişin. Müştərilərə təhvil verdiyimiz eyni texnologiya.",
      keywords: "3D konfiqurator demo, WebGL məhsul görüntüləyici",
    },
    "/templates": {
      title: "Şablonlar — Buraxılışa Hazır 3D və Veb Başlanğıc Nöqtələri | Configuro",
      description: "Məhsul saytları, 3D konfiquratorlar və buraxılış təcrübələri üçün hazır şablonlar.",
      keywords: "3D sayt şablonu, konfiqurator şablonu",
    },
    "/insights": {
      title: "Məqalələr — Tətbiq, CRM Avtomatlaşdırma və 3D Bələdçiləri | Configuro",
      description:
        "3D konfiquratorlar, Zoho, GoHighLevel və HubSpot ilə CRM avtomatlaşdırması, tətbiq hazırlanması və məhsul vizuallaşdırması üzrə praktik bələdçilər.",
      keywords: "3D konfiqurator bələdçisi, CRM avtomatlaşdırma bələdçisi",
    },
    "/portal": {
      title: "Müştəri Portalı | Configuro",
      description: "Layihənizi, resurslarınızı və hesab-fakturalarınızı izləmək üçün Configuro müştəri portalına daxil olun.",
      keywords: "müştəri portalı",
      noindex: true,
    },
  },
};

// Human-readable breadcrumb labels per path (English base; localized labels
// come from nav where available).
export const breadcrumbLabels = {
  "/services": "Services",
  "/work": "Work",
  "/pricing": "Pricing",
  "/about": "About",
  "/contact": "Contact",
  "/playground": "Live demo",
  "/templates": "Templates",
  "/insights": "Insights",
  "/portal": "Client portal",
  "/freelance": "Freelance platforms",
  "/upwork": "Upwork services",
  "/freelancer": "Freelancer.com services",
  "/fiverr": "Fiverr services",
  "/toptal": "Senior product team",
  "/shopify": "Shopify development",
};

const ORIGIN = "https://configuro.studio";

// Build a JSON-LD graph for a given route: WebPage + BreadcrumbList, and on the
// homepage the ProfessionalService entity describing the business.
export function buildJsonLd(pathname, seo) {
  const url = `${ORIGIN}${pathname === "/" ? "/" : pathname}`;
  const graph = [
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: seo.title,
      description: seo.description,
      isPartOf: { "@id": `${ORIGIN}/#website` },
      inLanguage: "en",
    },
  ];

  if (pathname !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${ORIGIN}/` },
        {
          "@type": "ListItem",
          position: 2,
          name: breadcrumbLabels[pathname] || seo.title,
          item: url,
        },
      ],
    });
    if (seo.serviceName) {
      graph.push({
        "@type": "Service",
        "@id": `${url}#service`,
        name: seo.serviceName,
        description: seo.description,
        url,
        provider: { "@id": `${ORIGIN}/#organization` },
        areaServed: "Worldwide",
        serviceType: seo.serviceName,
      });
    }
  } else {
    graph.push({
      "@type": ["Organization", "ProfessionalService"],
      "@id": `${ORIGIN}/#organization`,
      name: "Configuro",
      url: `${ORIGIN}/`,
      email: "hello@configuro.studio",
      description: seo.description,
      logo: `${ORIGIN}/morphix-logo.svg`,
      image: `${ORIGIN}/og-image.jpg`,
      knowsAbout: [
        "Web Application Development",
        "Mobile App Development",
        "3D Product Configurators",
        "CRM Automation",
        "Zoho",
        "GoHighLevel",
        "HubSpot",
        "Architectural Visualization",
        "Product Rendering",
        "Real-time WebGL",
      ],
      areaServed: "Worldwide",
      sameAs: [],
    });
    graph.push({
      "@type": "WebSite",
      "@id": `${ORIGIN}/#website`,
      url: `${ORIGIN}/`,
      name: "Configuro",
      publisher: { "@id": `${ORIGIN}/#organization` },
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}
