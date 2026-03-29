import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { localeOptions } from "../locales";
import { useContentAdmin } from "../admin/ContentAdminContext";
import AdminContentField from "../components/AdminContentField";
import AdminShell from "../components/AdminShell";
import {
  PAGE_FILTERS,
  cloneValue,
  formatDate,
  formatSectionLabel,
  getPageFilterLabel,
  getVisibleSectionKeys,
} from "../admin/adminConfig";

const CONTENT_PAGE_FILTERS = PAGE_FILTERS.filter((page) => page.id !== "all");

function AdminContentEditor() {
  const {
    mergedLocales,
    localeCodes,
    getBaseSection,
    hasSectionOverride,
    saveSection,
    resetSection,
  } = useContentAdmin();

  const [activeLocale, setActiveLocale] = useState(localeCodes[0] ?? "en");
  const [activePageFilter, setActivePageFilter] = useState("home");
  const [sectionSearch, setSectionSearch] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const [draftSection, setDraftSection] = useState(null);
  const [lastSavedAt, setLastSavedAt] = useState("");

  const localeContent = mergedLocales[activeLocale] ?? mergedLocales[localeCodes[0]] ?? {};
  const visibleSectionKeys = useMemo(() => getVisibleSectionKeys({
    localeContent,
    activePageFilter,
    sectionSearch,
  }), [activePageFilter, localeContent, sectionSearch]);

  const currentSectionValue = activeSection ? localeContent?.[activeSection] : null;
  const hasUnsavedChanges = JSON.stringify(draftSection) !== JSON.stringify(currentSectionValue);

  useEffect(() => {
    if (!visibleSectionKeys.includes(activeSection)) {
      setActiveSection(visibleSectionKeys[0] ?? "");
    }
  }, [activeSection, visibleSectionKeys]);

  useEffect(() => {
    setDraftSection(cloneValue(currentSectionValue));
  }, [activeLocale, activeSection, currentSectionValue]);

  const handleSaveSection = () => {
    if (!activeSection) return;

    saveSection(activeLocale, activeSection, draftSection);
    setLastSavedAt(new Date().toISOString());
  };

  const handleResetSection = () => {
    if (!activeSection) return;

    const nextBaseSection = getBaseSection(activeLocale, activeSection);
    resetSection(activeLocale, activeSection);
    setDraftSection(nextBaseSection);
    setLastSavedAt(new Date().toISOString());
  };

  return (
    <AdminShell
      eyebrow="Content editor"
      title="Edit one section at a time."
      description="Choose the page first, choose the language second, then open the exact section you want to update."
      badges={[
        { label: getPageFilterLabel(activePageFilter), tone: "scheduled" },
        { label: `${activeLocale.toUpperCase()} locale`, tone: "reviewing" },
      ]}
      topbarActions={(
        <Link className="secondary-button" to="/admin/templates">
          Open batch templates
        </Link>
      )}
    >
      <section className="admin-section">
        <div className="admin-shortcut-grid">
          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Step 1</span>
            <h3>Pick a page</h3>
            <p>Only sections for the chosen page are shown, so the list stays focused.</p>
          </article>

          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Step 2</span>
            <h3>Pick a locale</h3>
            <p>Switch language tabs without leaving the editor.</p>
          </article>

          <article className="glass-card admin-shortcut-card">
            <span className="metric-label">Step 3</span>
            <h3>Edit and save</h3>
            <p>Open one section, make the change, and save it immediately.</p>
          </article>
        </div>
      </section>

      <section className="admin-section">
        <div className="admin-studio-grid">
          <aside className="glass-card admin-studio-sidebar">
            <div className="admin-studio-block">
              <span className="metric-label">Page</span>
              <div className="admin-page-filter-row">
                {CONTENT_PAGE_FILTERS.map((page) => (
                  <button
                    className={`admin-page-filter ${activePageFilter === page.id ? "is-active" : ""}`}
                    key={page.id}
                    type="button"
                    onClick={() => setActivePageFilter(page.id)}
                  >
                    {page.label}
                  </button>
                ))}
              </div>
            </div>

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
                placeholder="Search this page"
                onChange={(event) => setSectionSearch(event.target.value)}
              />
            </div>

            <div className="admin-studio-block">
              <span className="metric-label">Sections</span>
              <p className="admin-studio-note">
                {visibleSectionKeys.length} section{visibleSectionKeys.length === 1 ? "" : "s"} ready to edit for {getPageFilterLabel(activePageFilter)}.
              </p>
              <div className="admin-section-list">
                {visibleSectionKeys.length ? visibleSectionKeys.map((sectionKey) => (
                  <button
                    className={`admin-section-button ${sectionKey === activeSection ? "is-active" : ""}`}
                    key={sectionKey}
                    type="button"
                    onClick={() => setActiveSection(sectionKey)}
                  >
                    <span>{formatSectionLabel(sectionKey)}</span>
                    {hasSectionOverride(activeLocale, sectionKey) ? <em>Custom</em> : <em>Base</em>}
                  </button>
                )) : (
                  <div className="admin-empty-state">
                    <strong>No matching sections</strong>
                    <p>Try another page or clear the search.</p>
                  </div>
                )}
              </div>
            </div>
          </aside>

          <article className="glass-card admin-editor-card">
            <div className="admin-editor-toolbar">
              <div>
                <span className="metric-label">
                  {getPageFilterLabel(activePageFilter)} · {activeLocale.toUpperCase()}
                </span>
                <h4>{activeSection ? formatSectionLabel(activeSection) : "Choose a section"}</h4>
                <p>
                  Keep this page simple: one section open, one locale active, one save button.
                </p>
              </div>

              <div className="admin-editor-actions">
                {hasUnsavedChanges ? <span className="admin-status-badge is-reviewing">Unsaved changes</span> : null}
                {activeSection && hasSectionOverride(activeLocale, activeSection) ? <span className="admin-status-badge is-scheduled">Custom override</span> : null}
                <button className="secondary-button" type="button" onClick={handleResetSection} disabled={!activeSection}>
                  Reset section
                </button>
                <button className="primary-button" type="button" onClick={handleSaveSection} disabled={!activeSection}>
                  Save changes
                </button>
              </div>
            </div>

            <div className="admin-editor-meta">
              <span>Last save: {formatDate(lastSavedAt)}</span>
              <span>Need many edits at once? Use the Templates page for batch CSV work.</span>
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
                  <strong>No section selected</strong>
                  <p>Pick a page and section from the left to start editing.</p>
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </AdminShell>
  );
}

export default AdminContentEditor;
