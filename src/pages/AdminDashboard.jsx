import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { localeOptions, locales } from "../locales";
import { useAdminAuth } from "../admin/AdminAuthContext";
import { useContentAdmin } from "../admin/ContentAdminContext";
import { readInquiries, updateInquiryStatus } from "../admin/inquiries";
import {
  assetKindFromType,
  deleteMediaAsset,
  readAllMediaAssets,
  saveMediaAsset,
} from "../admin/mediaStore";
import AdminContentField from "../components/AdminContentField";

const SECTION_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "content", label: "Content Studio" },
  { id: "inquiries", label: "Inquiries" },
  { id: "media", label: "Media Uploads" },
  { id: "pages", label: "Site Pages" },
  { id: "access", label: "Access" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
];

const SOURCE_LABELS = {
  "home-form": "Quick enquiry",
  "contact-wizard": "Project intake",
  website: "Website form",
};

const HIDDEN_SECTION_KEYS = new Set(["mediaSlotsShared"]);

const SITE_PAGE_RECORDS = [
  {
    name: "Home",
    route: "/",
    focus: "First impression, service positioning, and quick enquiry conversion.",
    owner: "Marketing",
    slotCount: 5,
  },
  {
    name: "Services",
    route: "/services",
    focus: "Long-form offer narrative, proof blocks, and Playground handoff.",
    owner: "Sales",
    slotCount: 5,
  },
  {
    name: "Work",
    route: "/work",
    focus: "Case-study storytelling and project credibility.",
    owner: "Marketing",
    slotCount: 6,
  },
  {
    name: "About",
    route: "/about",
    focus: "Studio credibility, principles, and team positioning.",
    owner: "Brand",
    slotCount: 4,
  },
  {
    name: "Pricing",
    route: "/pricing",
    focus: "Package framing, FAQ support, and qualification flow.",
    owner: "Sales",
    slotCount: 4,
  },
  {
    name: "Contact",
    route: "/contact",
    focus: "Structured intake and qualification for new projects.",
    owner: "Operations",
    slotCount: 4,
  },
];

const MEDIA_SLOT_CONFIGS = [
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

function cloneValue(value) {
  if (value === null || value === undefined || typeof value !== "object") {
    return value;
  }

  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function formatDate(value) {
  if (!value) return "Not available";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatBytes(value) {
  if (!value && value !== 0) return "Unknown size";
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(2)} MB`;
}

function formatSectionLabel(key) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getValueAtPath(source, path) {
  return path.reduce((current, part) => current?.[part], source);
}

function setValueAtPath(source, path, value) {
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

function AdminDashboard({ content }) {
  const { session, credentialConfig, logout } = useAdminAuth();
  const {
    mergedLocales,
    localeCodes,
    getBaseSection,
    hasSectionOverride,
    saveSection,
    resetSection,
  } = useContentAdmin();

  const [filter, setFilter] = useState("all");
  const [inquiries, setInquiries] = useState(() => readInquiries());
  const [activeLocale, setActiveLocale] = useState(localeCodes[0] ?? "en");
  const [sectionSearch, setSectionSearch] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [draftSection, setDraftSection] = useState(() => (
    cloneValue((mergedLocales[localeCodes[0] ?? "en"] ?? {}).hero)
  ));
  const [lastSavedAt, setLastSavedAt] = useState("");
  const [assetVersion, setAssetVersion] = useState(0);
  const [libraryAssets, setLibraryAssets] = useState([]);
  const [uploadingSlotId, setUploadingSlotId] = useState("");

  const localeContent = mergedLocales[activeLocale] ?? mergedLocales[localeCodes[0]];
  const sectionKeys = Object.keys(localeContent ?? {}).filter((sectionKey) => !HIDDEN_SECTION_KEYS.has(sectionKey));

  const visibleSectionKeys = useMemo(() => {
    if (!sectionSearch.trim()) return sectionKeys;

    const needle = sectionSearch.trim().toLowerCase();
    return sectionKeys.filter((sectionKey) => formatSectionLabel(sectionKey).toLowerCase().includes(needle));
  }, [sectionKeys, sectionSearch]);

  const currentSectionValue = localeContent?.[activeSection];
  const hasUnsavedChanges = JSON.stringify(draftSection) !== JSON.stringify(currentSectionValue);

  const visibleInquiries = useMemo(() => (
    filter === "all" ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter)
  ), [filter, inquiries]);

  const metrics = useMemo(() => {
    const totalSlots = MEDIA_SLOT_CONFIGS.reduce(
      (count, config) => count + (getValueAtPath(localeContent?.[config.sectionKey], config.itemPath) ?? []).length,
      0,
    );

    return [
      {
        label: "New inquiries",
        value: inquiries.filter((item) => item.status === "new").length,
        helper: "Fresh submissions waiting for review",
      },
      {
        label: "Editable sections",
        value: sectionKeys.length,
        helper: "Top-level content sections available in the current locale",
      },
      {
        label: "Media placements",
        value: totalSlots,
        helper: "Full image and video areas planned across the public site",
      },
      {
        label: "Active locales",
        value: Object.keys(locales).length,
        helper: "Languages currently configured in the site",
      },
      {
        label: "Uploaded assets",
        value: libraryAssets.length,
        helper: "Images and videos stored for page slots",
      },
      {
        label: "Playground route",
        value: "Live",
        helper: "Configured as the destination for interactive exploration",
      },
    ];
  }, [inquiries, libraryAssets.length, localeContent, sectionKeys.length]);

  const mediaGroups = useMemo(() => MEDIA_SLOT_CONFIGS.map((config) => {
    const sectionValue = localeContent?.[config.sectionKey];
    const items = getValueAtPath(sectionValue, config.itemPath) ?? [];

    return {
      ...config,
      sectionValue,
      items,
    };
  }), [localeContent]);

  const assetMap = useMemo(() => Object.fromEntries(
    libraryAssets.map((asset) => [asset.id, asset]),
  ), [libraryAssets]);

  useEffect(() => {
    if (!sectionKeys.includes(activeSection)) {
      setActiveSection(sectionKeys[0] ?? "");
    }
  }, [activeSection, sectionKeys]);

  useEffect(() => {
    setDraftSection(cloneValue(currentSectionValue));
  }, [activeLocale, activeSection, currentSectionValue]);

  useEffect(() => {
    let isMounted = true;
    let objectUrls = [];

    const loadAssets = async () => {
      const records = await readAllMediaAssets();
      const nextAssets = records.map((record) => {
        const previewUrl = URL.createObjectURL(record.blob);
        objectUrls.push(previewUrl);

        return {
          ...record,
          kind: assetKindFromType(record.type),
          previewUrl,
        };
      });

      if (!isMounted) {
        objectUrls.forEach((url) => URL.revokeObjectURL(url));
        return;
      }

      setLibraryAssets(nextAssets);
    };

    loadAssets();

    return () => {
      isMounted = false;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [assetVersion]);

  const handleStatusChange = (inquiryId, status) => {
    setInquiries(updateInquiryStatus(inquiryId, status));
  };

  const handleSaveSection = () => {
    saveSection(activeLocale, activeSection, draftSection);
    setLastSavedAt(new Date().toISOString());
  };

  const handleResetSection = () => {
    const nextBaseSection = getBaseSection(activeLocale, activeSection);
    resetSection(activeLocale, activeSection);
    setDraftSection(nextBaseSection);
    setLastSavedAt(new Date().toISOString());
  };

  const handleUploadToSlot = async (config, itemIndex, file) => {
    if (!file) return;

    const uploadId = `${config.id}-${itemIndex}`;
    setUploadingSlotId(uploadId);

    try {
      const asset = await saveMediaAsset(file);
      const nextSection = setValueAtPath(config.sectionValue, [...config.itemPath, itemIndex], {
        ...config.items[itemIndex],
        assetId: asset.id,
        type: assetKindFromType(asset.type),
      });

      saveSection(activeLocale, config.sectionKey, nextSection);
      setAssetVersion((current) => current + 1);
    } finally {
      setUploadingSlotId("");
    }
  };

  const handleClearSlot = (config, itemIndex) => {
    const nextSection = setValueAtPath(config.sectionValue, [...config.itemPath, itemIndex], {
      ...config.items[itemIndex],
      assetId: "",
    });

    saveSection(activeLocale, config.sectionKey, nextSection);
  };

  const handleDeleteAsset = async (assetId) => {
    await deleteMediaAsset(assetId);
    setAssetVersion((current) => current + 1);
  };

  return (
    <main className="admin-dashboard-page">
      <div className="admin-dashboard-shell">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <span className="chip">Morphix</span>
            <h1>Admin panel</h1>
            <p>Content studio, translation control, media uploads, and inquiry review in one place.</p>
          </div>

          <nav className="admin-sidebar-nav" aria-label="Admin sections">
            {SECTION_LINKS.map((section) => (
              <a className="admin-sidebar-link" key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>

          <div className="admin-sidebar-session">
            <span className="metric-label">Signed in as</span>
            <strong>{session?.name}</strong>
            <p>{session?.email}</p>
            <span>Session started {formatDate(session?.loginAt)}</span>
          </div>

          <div className="admin-sidebar-actions">
            <Link className="secondary-button" to="/">
              View website
            </Link>
            <button className="primary-button" type="button" onClick={logout}>
              Log out
            </button>
          </div>
        </aside>

        <div className="admin-main">
          <header className="admin-topbar" id="overview">
            <div>
              <span className="metric-label">Operations</span>
              <h2>Editable control room for content, translations, and media.</h2>
              <p>
                Update public copy by locale, manage section content, upload slot imagery and
                videos, and review incoming project leads from one professional workspace.
              </p>
            </div>

            <div className="admin-topbar-meta">
              <span className="admin-status-badge is-scheduled">Playground live</span>
              <span className="admin-status-badge is-reviewing">{content.nav.playground}</span>
            </div>
          </header>

          <section className="admin-section">
            <div className="admin-metric-grid">
              {metrics.map((metric) => (
                <article className="glass-card admin-metric-card" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.helper}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-section" id="content">
            <div className="admin-section-head">
              <div>
                <span className="metric-label">Content studio</span>
                <h3>Edit every public section by locale</h3>
                <p>
                  Choose a language, open any top-level content section, and update the live site copy
                  without digging through locale files.
                </p>
              </div>
            </div>

            <div className="admin-studio-grid">
              <aside className="glass-card admin-studio-sidebar">
                <div className="admin-studio-block">
                  <span className="metric-label">Locale</span>
                  <div className="admin-locale-tabs">
                    {localeCodes.map((localeCode) => {
                      const localeOption = localeOptions.find((option) => option.code === localeCode);
                      return (
                        <button
                          className={`admin-locale-tab ${localeCode === activeLocale ? "is-active" : ""}`}
                          key={localeCode}
                          type="button"
                          onClick={() => setActiveLocale(localeCode)}
                        >
                          <span>{localeOption?.flag}</span>
                          <strong>{localeCode.toUpperCase()}</strong>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="admin-studio-block">
                  <span className="metric-label">Find section</span>
                  <input
                    className="admin-search-input"
                    type="text"
                    value={sectionSearch}
                    placeholder="Search content sections"
                    onChange={(event) => setSectionSearch(event.target.value)}
                  />
                </div>

                <div className="admin-studio-block">
                  <span className="metric-label">Sections</span>
                  <div className="admin-section-list">
                    {visibleSectionKeys.map((sectionKey) => (
                      <button
                        className={`admin-section-button ${sectionKey === activeSection ? "is-active" : ""}`}
                        key={sectionKey}
                        type="button"
                        onClick={() => setActiveSection(sectionKey)}
                      >
                        <span>{formatSectionLabel(sectionKey)}</span>
                        {hasSectionOverride(activeLocale, sectionKey) ? <em>Custom</em> : <em>Base</em>}
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              <article className="glass-card admin-editor-card">
                <div className="admin-editor-toolbar">
                  <div>
                    <span className="metric-label">
                      {activeLocale.toUpperCase()} · {formatSectionLabel(activeSection)}
                    </span>
                    <h4>{formatSectionLabel(activeSection)}</h4>
                    <p>
                      Edit the selected section for the active locale. Save applies the override immediately.
                    </p>
                  </div>

                  <div className="admin-editor-actions">
                    {hasUnsavedChanges ? <span className="admin-status-badge is-reviewing">Unsaved changes</span> : null}
                    {hasSectionOverride(activeLocale, activeSection) ? <span className="admin-status-badge is-scheduled">Custom override</span> : null}
                    <button className="secondary-button" type="button" onClick={handleResetSection}>
                      Reset section
                    </button>
                    <button className="primary-button" type="button" onClick={handleSaveSection}>
                      Save changes
                    </button>
                  </div>
                </div>

                <div className="admin-editor-meta">
                  <span>Last save: {formatDate(lastSavedAt)}</span>
                  <span>Fields hidden from the form: media asset IDs are managed in the media section below.</span>
                </div>

                <div className="admin-editor-scroll">
                  {draftSection ? (
                    <AdminContentField
                      fieldKey={activeSection}
                      rootLabel={formatSectionLabel(activeSection)}
                      value={draftSection}
                      onChange={setDraftSection}
                    />
                  ) : (
                    <div className="admin-empty-state">
                      <strong>Nothing selected</strong>
                      <p>Select a content section to start editing.</p>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </section>

          <section className="admin-section" id="inquiries">
            <div className="admin-section-head">
              <div>
                <span className="metric-label">Lead inbox</span>
                <h3>Project inquiries</h3>
                <p>Submissions from the Home quick enquiry and the Contact intake wizard are collected here.</p>
              </div>

              <div className="admin-filter-row">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    className={`admin-filter-chip ${filter === option.value ? "is-active" : ""}`}
                    key={option.value}
                    type="button"
                    onClick={() => setFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-card-stack">
              {visibleInquiries.length ? visibleInquiries.map((inquiry) => (
                <article className="glass-card admin-inquiry-card" key={inquiry.id}>
                  <div className="admin-inquiry-head">
                    <div>
                      <div className="admin-inquiry-title-row">
                        <h4>{inquiry.fullName || "Unnamed lead"}</h4>
                        <span className={`admin-status-badge is-${inquiry.status}`}>{inquiry.status}</span>
                      </div>
                      <p>
                        {SOURCE_LABELS[inquiry.source] ?? inquiry.source}
                        {" · "}
                        {inquiry.email || "No email provided"}
                        {" · "}
                        {formatDate(inquiry.receivedAt)}
                      </p>
                    </div>

                    <label className="admin-select-field">
                      Status
                      <select
                        value={inquiry.status}
                        onChange={(event) => handleStatusChange(inquiry.id, event.target.value)}
                      >
                        {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="admin-inquiry-meta">
                    {inquiry.company ? <span>{inquiry.company}</span> : null}
                    {inquiry.website ? <span>{inquiry.website}</span> : null}
                    {inquiry.productName ? <span>{inquiry.productName}</span> : null}
                    {inquiry.timeline ? <span>{inquiry.timeline}</span> : null}
                    {inquiry.budget ? <span>{inquiry.budget}</span> : null}
                  </div>

                  {inquiry.brief ? <p className="admin-inquiry-brief">{inquiry.brief}</p> : null}

                  {(inquiry.goals.length || inquiry.deliverables.length || inquiry.projectType || inquiry.productStage) ? (
                    <div className="admin-chip-row">
                      {inquiry.projectType ? <span className="chip">{inquiry.projectType}</span> : null}
                      {inquiry.productStage ? <span className="chip">{inquiry.productStage}</span> : null}
                      {inquiry.goals.map((goal) => <span className="chip" key={goal}>{goal}</span>)}
                      {inquiry.deliverables.map((deliverable) => <span className="chip" key={deliverable}>{deliverable}</span>)}
                    </div>
                  ) : null}
                </article>
              )) : (
                <div className="glass-card admin-empty-state">
                  <strong>No inquiries yet</strong>
                  <p>
                    Once someone submits the Home quick enquiry or the Contact wizard,
                    their details will appear here for review.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="admin-section" id="media">
            <div className="admin-section-head">
              <div>
                <span className="metric-label">Media uploads</span>
                <h3>Images and videos for full-page media placements</h3>
                <p>
                  Upload one strong image or one strong video per placement,
                  and the public site will render it as a full media area instead of a collage-style placeholder.
                </p>
              </div>
            </div>

            <div className="admin-media-grid">
              {mediaGroups.map((config) => (
                <article className="glass-card admin-media-panel" key={config.id}>
                  <div className="admin-media-panel-head">
                    <div>
                      <h4>{config.title}</h4>
                      <p>{config.description}</p>
                    </div>
                    <span className="chip">{activeLocale.toUpperCase()} · {config.items.length} slots</span>
                  </div>

                  <div className="admin-slot-list">
                    {config.items.map((item, index) => {
                      const slotAsset = item.assetId ? assetMap[item.assetId] : null;
                      const slotUploadId = `${config.id}-${index}`;

                      return (
                        <div className="admin-slot-card" key={`${config.id}-${index}`}>
                          <div className={`admin-slot-preview is-${slotAsset?.kind ?? item.type}`}>
                            {slotAsset ? (
                              slotAsset.kind === "video" ? (
                                <video src={slotAsset.previewUrl} controls muted playsInline />
                              ) : (
                                <img src={slotAsset.previewUrl} alt={item.title} />
                              )
                            ) : (
                              <div className="admin-slot-placeholder">
                                <span>{item.type === "video" ? "Full video area" : "Full image area"}</span>
                              </div>
                            )}
                          </div>

                          <div className="admin-slot-body">
                            <strong>{item.title}</strong>
                            <p>{item.copy}</p>
                            <div className="admin-chip-row">
                              <span className="chip">{item.label}</span>
                              <span className="chip">{item.type}</span>
                              {item.meta ? <span className="chip">{item.meta}</span> : null}
                              {item.size ? <span className="chip">{item.size}</span> : null}
                              {slotAsset ? <span className="chip">{slotAsset.name}</span> : null}
                            </div>
                          </div>

                          <div className="admin-slot-actions">
                            <label className="secondary-button admin-upload-button">
                              {uploadingSlotId === slotUploadId ? "Uploading..." : `Upload ${item.type}`}
                              <input
                                type="file"
                                accept={item.type === "video" ? "video/*" : "image/*"}
                                onChange={(event) => {
                                  const file = event.target.files?.[0];
                                  handleUploadToSlot(config, index, file);
                                  event.target.value = "";
                                }}
                              />
                            </label>
                            <button
                              className="admin-editor-link"
                              type="button"
                              onClick={() => handleClearSlot(config, index)}
                              disabled={!item.assetId}
                            >
                              Clear slot
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>

            <article className="glass-card admin-library-panel">
              <div className="admin-media-panel-head">
                <div>
                  <h4>Uploaded asset library</h4>
                  <p>Recent files stored in the browser for slot-based content previews.</p>
                </div>
              </div>

              <div className="admin-library-list">
                {libraryAssets.length ? libraryAssets.map((asset) => (
                  <div className="admin-library-row" key={asset.id}>
                    <div className={`admin-library-thumb is-${asset.kind}`}>
                      {asset.kind === "video" ? (
                        <video src={asset.previewUrl} muted playsInline />
                      ) : (
                        <img src={asset.previewUrl} alt={asset.name} />
                      )}
                    </div>
                    <div className="admin-library-copy">
                      <strong>{asset.name}</strong>
                      <span>{asset.kind} · {formatBytes(asset.size)} · {formatDate(asset.createdAt)}</span>
                    </div>
                    <button
                      className="admin-editor-link"
                      type="button"
                      onClick={() => handleDeleteAsset(asset.id)}
                    >
                      Delete
                    </button>
                  </div>
                )) : (
                  <div className="admin-empty-state">
                    <strong>No uploads yet</strong>
                    <p>Use the slot uploader above to add the first image or render video.</p>
                  </div>
                )}
              </div>
            </article>
          </section>

          <section className="admin-section" id="pages">
            <div className="admin-section-head">
              <div>
                <span className="metric-label">Site map</span>
                <h3>Public page coverage</h3>
                <p>Quick operational view of the areas that currently shape the public Morphix experience.</p>
              </div>
            </div>

            <div className="admin-card-stack">
              {SITE_PAGE_RECORDS.map((page) => (
                <article className="glass-card admin-coverage-row" key={page.name}>
                  <div>
                    <strong>{page.name}</strong>
                    <p>{page.focus}</p>
                  </div>
                  <div className="admin-coverage-meta">
                    <span>{page.owner}</span>
                    <span>{page.slotCount} media placements</span>
                    <Link to={page.route}>Open</Link>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="admin-section" id="access">
            <div className="admin-section-head">
              <div>
                <span className="metric-label">Access and setup</span>
                <h3>Session and credential notes</h3>
                <p>This admin panel currently runs with client-side auth plus browser storage.</p>
              </div>
            </div>

            <div className="admin-access-grid">
              <article className="glass-card admin-access-card">
                <h4>Current session</h4>
                <p>Signed in as {session?.email}. Active since {formatDate(session?.loginAt)}.</p>
              </article>

              <article className="glass-card admin-access-card">
                <h4>Credential source</h4>
                <p>
                  {credentialConfig.usingFallbackCredentials
                    ? "Using the local default credential set inside the project."
                    : "Using custom admin credentials from Vite environment variables."}
                </p>
              </article>

              <article className="glass-card admin-access-card">
                <h4>Production note</h4>
                <p>
                  For a real production rollout, the next step is moving auth, content persistence,
                  and uploads to a backend service instead of browser storage.
                </p>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;
