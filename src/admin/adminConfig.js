export const ADMIN_NAV_ITEMS = [
  {
    to: "/admin/overview",
    label: "Overview",
    helper: "Start here and choose the next task.",
  },
  {
    to: "/admin/content",
    label: "Content",
    helper: "Edit one section at a time by page and locale.",
  },
  {
    to: "/admin/templates",
    label: "Templates",
    helper: "Download or upload Excel-friendly batch CSV files.",
  },
  {
    to: "/admin/media",
    label: "Media",
    helper: "Upload full images and render videos for slots.",
  },
  {
    to: "/admin/inquiries",
    label: "Inquiries",
    helper: "Review and update incoming project leads.",
  },
  {
    to: "/admin/access",
    label: "Access",
    helper: "Check session, credentials, and site coverage.",
  },
];

export const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

export const SOURCE_LABELS = {
  "home-form": "Quick enquiry",
  "contact-wizard": "Project intake",
  website: "Website form",
};

export const HIDDEN_SECTION_KEYS = new Set(["mediaSlotsShared"]);

export const PAGE_SECTION_GROUPS = {
  global: ["meta", "common", "nav", "footer"],
  home: [
    "hero",
    "valueProps",
    "servicesPreview",
    "portfolioPreview",
    "trust",
    "homeContact",
    "homeCta",
    "homeMediaGallery",
  ],
  services: ["servicesPage"],
  work: ["workPage", "workMediaGallery"],
  about: ["aboutPage", "aboutMediaGallery"],
  pricing: ["pricingPage", "pricingMediaGallery"],
  contact: ["contactPage", "contactMediaGallery"],
};

export const PAGE_FILTERS = [
  { id: "all", label: "All pages" },
  { id: "global", label: "Global" },
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "pricing", label: "Pricing" },
  { id: "contact", label: "Contact" },
];

const SECTION_PAGE_LOOKUP = Object.fromEntries(
  Object.entries(PAGE_SECTION_GROUPS).flatMap(([pageId, sectionList]) => (
    sectionList.map((sectionKey) => [sectionKey, pageId])
  )),
);

export const SITE_PAGE_RECORDS = [
  {
    id: "home",
    name: "Home",
    route: "/",
    focus: "First impression, service positioning, and quick enquiry conversion.",
    owner: "Marketing",
    slotCount: 5,
  },
  {
    id: "services",
    name: "Services",
    route: "/services",
    focus: "Long-form offer narrative, proof blocks, and Playground handoff.",
    owner: "Sales",
    slotCount: 5,
  },
  {
    id: "work",
    name: "Work",
    route: "/work",
    focus: "Case-study storytelling and project credibility.",
    owner: "Marketing",
    slotCount: 6,
  },
  {
    id: "about",
    name: "About",
    route: "/about",
    focus: "Studio credibility, principles, and team positioning.",
    owner: "Brand",
    slotCount: 4,
  },
  {
    id: "pricing",
    name: "Pricing",
    route: "/pricing",
    focus: "Package framing, FAQ support, and qualification flow.",
    owner: "Sales",
    slotCount: 4,
  },
  {
    id: "contact",
    name: "Contact",
    route: "/contact",
    focus: "Structured intake and qualification for new projects.",
    owner: "Operations",
    slotCount: 4,
  },
];

export const MEDIA_SLOT_CONFIGS = [
  {
    id: "home-media",
    sectionKey: "homeMediaGallery",
    itemPath: ["items"],
    title: "Home media gallery",
    description: "Homepage visuals built around one strong render, one short video, and a few supporting images.",
  },
  {
    id: "services-media",
    sectionKey: "servicesPage",
    itemPath: ["mediaShowcase", "items"],
    title: "Services media showcase",
    description: "A simpler set of work samples for the Services page: one intro video, strong stills, and proof images.",
  },
  {
    id: "work-media",
    sectionKey: "workMediaGallery",
    itemPath: ["items"],
    title: "Work media gallery",
    description: "Case-study visuals with an opener, a few proof points, and enough depth to feel real.",
  },
  {
    id: "about-media",
    sectionKey: "aboutMediaGallery",
    itemPath: ["items"],
    title: "About media gallery",
    description: "Grounded studio visuals that show how the team works and what the final output looks like.",
  },
  {
    id: "pricing-media",
    sectionKey: "pricingMediaGallery",
    itemPath: ["items"],
    title: "Pricing media gallery",
    description: "Simple deliverable previews that help people connect package prices to real output.",
  },
  {
    id: "contact-media",
    sectionKey: "contactMediaGallery",
    itemPath: ["items"],
    title: "Contact media gallery",
    description: "Calm supporting visuals that make the enquiry flow feel like the start of a real project.",
  },
];

export function cloneValue(value) {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

export function formatDate(value) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatBytes(value) {
  if (!value && value !== 0) return "Unknown size";
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

export function formatSectionLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function resolveSectionPageId(sectionKey) {
  return SECTION_PAGE_LOOKUP[sectionKey] ?? "global";
}

export function getPageFilterLabel(pageId) {
  return PAGE_FILTERS.find((item) => item.id === pageId)?.label ?? pageId;
}

export function getValueAtPath(source, path) {
  return path.reduce((current, part) => current?.[part], source);
}

export function setValueAtPath(source, path, value) {
  if (!path.length) return value;

  const [currentPath, ...rest] = path;

  if (Array.isArray(source)) {
    return source.map((item, index) => (
      index === currentPath ? setValueAtPath(item, rest, value) : item
    ));
  }

  return {
    ...source,
    [currentPath]: setValueAtPath(source?.[currentPath], rest, value),
  };
}

export function getSectionKeys(localeContent) {
  return Object.keys(localeContent ?? {}).filter((sectionKey) => !HIDDEN_SECTION_KEYS.has(sectionKey));
}

export function getVisibleSectionKeys({
  localeContent,
  activePageFilter,
  sectionSearch = "",
}) {
  const sectionKeys = getSectionKeys(localeContent);
  const pageScopedSectionKeys = activePageFilter === "all"
    ? sectionKeys
    : sectionKeys.filter((sectionKey) => resolveSectionPageId(sectionKey) === activePageFilter);

  if (!sectionSearch.trim()) {
    return pageScopedSectionKeys;
  }

  const needle = sectionSearch.trim().toLowerCase();
  return pageScopedSectionKeys.filter((sectionKey) => (
    formatSectionLabel(sectionKey).toLowerCase().includes(needle)
  ));
}
