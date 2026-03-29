import { useEffect, useMemo, useState } from "react";
import { localeOptions } from "../locales";
import { useContentAdmin } from "../admin/ContentAdminContext";
import {
  buildContentTemplateCsv,
  buildContentTemplateRows,
  coerceTemplateValue,
  parseContentTemplateCsv,
  parseTemplatePath,
} from "../admin/contentSpreadsheet";
import AdminShell from "../components/AdminShell";
import {
  PAGE_FILTERS,
  cloneValue,
  formatSectionLabel,
  getPageFilterLabel,
  getVisibleSectionKeys,
  resolveSectionPageId,
  slugify,
  setValueAtPath,
} from "../admin/adminConfig";

function AdminTemplates() {
  const { mergedLocales, localeCodes, saveSection } = useContentAdmin();
  const [activeLocale, setActiveLocale] = useState(localeCodes[0] ?? "en");
  const [activePageFilter, setActivePageFilter] = useState("home");
  const [activeSection, setActiveSection] = useState("");
  const [batchStatus, setBatchStatus] = useState({ tone: "", message: "" });

  const localeContent = mergedLocales[activeLocale] ?? mergedLocales[localeCodes[0]] ?? {};
  const visibleSectionKeys = useMemo(() => getVisibleSectionKeys({
    localeContent,
    activePageFilter,
    sectionSearch: "",
  }), [activePageFilter, localeContent]);

  useEffect(() => {
    if (!visibleSectionKeys.includes(activeSection)) {
      setActiveSection(visibleSectionKeys[0] ?? "");
    }
  }, [activeSection, visibleSectionKeys]);

  const downloadTemplate = (scope) => {
    const targetSectionKeys = scope === "section"
      ? [activeSection].filter(Boolean)
      : visibleSectionKeys;

    if (!targetSectionKeys.length) {
      setBatchStatus({
        tone: "error",
        message: "There are no sections available in the current filter to export.",
      });
      return;
    }

    const rows = buildContentTemplateRows({
      localeCode: activeLocale,
      sections: targetSectionKeys.map((key) => ({
        key,
        value: localeContent?.[key],
      })),
      resolvePageId: resolveSectionPageId,
    });

    const csv = buildContentTemplateCsv(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const scopeLabel = scope === "section"
      ? slugify(formatSectionLabel(activeSection))
      : slugify(getPageFilterLabel(activePageFilter));

    link.href = url;
    link.download = `morphix-content-${activeLocale}-${scopeLabel}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    setBatchStatus({
      tone: "success",
      message: `Downloaded ${rows.length} template rows for ${scope === "section" ? formatSectionLabel(activeSection) : getPageFilterLabel(activePageFilter)}.`,
    });
  };

  const handleTemplateUpload = async (file) => {
    if (!file) return;

    try {
      const text = await file.text();
      const rows = parseContentTemplateCsv(text);

      if (!rows.length) {
        throw new Error("The uploaded template does not contain any editable rows.");
      }

      const nextSections = new Map();

      rows.forEach((row) => {
        const localeCode = row.locale || activeLocale;
        const sectionKey = row.section;
        const sectionValue = mergedLocales[localeCode]?.[sectionKey];

        if (!sectionValue) {
          throw new Error(`Unknown section in template: ${sectionKey}`);
        }

        const mapKey = `${localeCode}::${sectionKey}`;
        const currentDraft = nextSections.has(mapKey)
          ? nextSections.get(mapKey)
          : cloneValue(sectionValue);

        nextSections.set(
          mapKey,
          setValueAtPath(
            currentDraft,
            parseTemplatePath(row.path),
            coerceTemplateValue(row.type, row.value),
          ),
        );
      });

      nextSections.forEach((sectionValue, mapKey) => {
        const [localeCode, sectionKey] = mapKey.split("::");
        saveSection(localeCode, sectionKey, sectionValue);
      });

      setBatchStatus({
        tone: "success",
        message: `Imported ${rows.length} rows across ${nextSections.size} section${nextSections.size === 1 ? "" : "s"}.`,
      });
    } catch (error) {
      setBatchStatus({
        tone: "error",
        message: error instanceof Error ? error.message : "The template could not be imported.",
      });
    }
  };

  return (
    <AdminShell
      eyebrow="Batch templates"
      title="Edit many content rows in Excel."
      description="Download a page or section template, edit only the value column in Excel or Google Sheets, then upload it back in one step."
      badges={[
        { label: "CSV for Excel", tone: "scheduled" },
        { label: getPageFilterLabel(activePageFilter), tone: "reviewing" },
      ]}
    >
      <section className="admin-section">
        <div className="admin-studio-grid">
          <aside className="glass-card admin-studio-sidebar">
            <div className="admin-studio-block">
              <span className="metric-label">Step 1 · Locale</span>
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
              <span className="metric-label">Step 2 · Page</span>
              <div className="admin-page-filter-row">
                {PAGE_FILTERS.map((page) => (
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
              <span className="metric-label">Step 3 · Section</span>
              <p className="admin-studio-note">
                Pick one section for a narrow template, or use the full page export for everything visible.
              </p>
              <div className="admin-section-list">
                {visibleSectionKeys.map((sectionKey) => (
                  <button
                    className={`admin-section-button ${sectionKey === activeSection ? "is-active" : ""}`}
                    key={sectionKey}
                    type="button"
                    onClick={() => setActiveSection(sectionKey)}
                  >
                    <span>{formatSectionLabel(sectionKey)}</span>
                    <em>CSV</em>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <article className="glass-card admin-editor-card">
            <div className="admin-editor-toolbar">
              <div>
                <span className="metric-label">Step 4 · Download or upload</span>
                <h4>Batch editing made simpler</h4>
                <p>
                  Export just one section or everything for the selected page. Keep the
                  structure columns intact and edit only the value column.
                </p>
              </div>
            </div>

            <div className="admin-shortcut-grid">
              <article className="glass-card admin-shortcut-card">
                <span className="metric-label">Selected page</span>
                <h3>{getPageFilterLabel(activePageFilter)}</h3>
                <p>{visibleSectionKeys.length} visible section{visibleSectionKeys.length === 1 ? "" : "s"} ready for export.</p>
              </article>

              <article className="glass-card admin-shortcut-card">
                <span className="metric-label">Selected section</span>
                <h3>{activeSection ? formatSectionLabel(activeSection) : "None selected"}</h3>
                <p>Use the section template when only one block needs spreadsheet editing.</p>
              </article>
            </div>

            <div className="glass-card admin-batch-panel">
              <p>
                Download an Excel-friendly CSV, update the text values, then upload the completed file for batch changes.
              </p>
              <div className="admin-batch-actions">
                <button className="secondary-button" type="button" onClick={() => downloadTemplate("section")} disabled={!activeSection}>
                  Download section template
                </button>
                <button className="secondary-button" type="button" onClick={() => downloadTemplate("page")} disabled={!visibleSectionKeys.length}>
                  Download page template
                </button>
              </div>
              <label className="primary-button admin-batch-upload">
                Upload completed template
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    handleTemplateUpload(file);
                    event.target.value = "";
                  }}
                />
              </label>
              <p className="admin-batch-note">
                Keep `locale`, `page`, `section`, `path`, and `type` unchanged. Edit only `value`.
              </p>
              {batchStatus.message ? (
                <div className={`admin-batch-status is-${batchStatus.tone || "neutral"}`}>
                  {batchStatus.message}
                </div>
              ) : null}
            </div>
          </article>
        </div>
      </section>
    </AdminShell>
  );
}

export default AdminTemplates;
