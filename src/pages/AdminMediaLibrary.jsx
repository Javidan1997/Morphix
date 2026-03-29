import { useEffect, useMemo, useState } from "react";
import { localeOptions } from "../locales";
import { useContentAdmin } from "../admin/ContentAdminContext";
import {
  assetKindFromType,
  deleteMediaAsset,
  readAllMediaAssets,
  saveMediaAsset,
} from "../admin/mediaStore";
import AdminShell from "../components/AdminShell";
import {
  MEDIA_SLOT_CONFIGS,
  PAGE_FILTERS,
  formatBytes,
  formatDate,
  getPageFilterLabel,
  getValueAtPath,
  resolveSectionPageId,
  setValueAtPath,
} from "../admin/adminConfig";

const MEDIA_PAGE_FILTERS = PAGE_FILTERS.filter((page) => !["all", "global"].includes(page.id));

function AdminMediaLibrary() {
  const { mergedLocales, localeCodes, saveSection } = useContentAdmin();
  const [activeLocale, setActiveLocale] = useState(localeCodes[0] ?? "en");
  const [activePageFilter, setActivePageFilter] = useState("home");
  const [assetVersion, setAssetVersion] = useState(0);
  const [uploadingSlotId, setUploadingSlotId] = useState("");
  const [libraryAssets, setLibraryAssets] = useState([]);

  const localeContent = mergedLocales[activeLocale] ?? mergedLocales[localeCodes[0]] ?? {};

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

  const mediaGroups = useMemo(() => (
    MEDIA_SLOT_CONFIGS
      .filter((config) => resolveSectionPageId(config.sectionKey) === activePageFilter)
      .map((config) => {
        const sectionValue = localeContent?.[config.sectionKey];
        const items = getValueAtPath(sectionValue, config.itemPath) ?? [];

        return {
          ...config,
          sectionValue,
          items,
        };
      })
  ), [activePageFilter, localeContent]);

  const assetMap = useMemo(() => Object.fromEntries(
    libraryAssets.map((asset) => [asset.id, asset]),
  ), [libraryAssets]);

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
    <AdminShell
      eyebrow="Media library"
      title="Manage full-size images and videos."
      description="Each page gets its own media placement list, so uploads feel organized instead of mixed together."
      badges={[
        { label: getPageFilterLabel(activePageFilter), tone: "scheduled" },
        { label: `${libraryAssets.length} assets`, tone: "reviewing" },
      ]}
    >
      <section className="admin-section">
        <div className="admin-studio-grid">
          <aside className="glass-card admin-studio-sidebar">
            <div className="admin-studio-block">
              <span className="metric-label">Page</span>
              <div className="admin-page-filter-row">
                {MEDIA_PAGE_FILTERS.map((page) => (
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
              <span className="metric-label">How to use</span>
              <p className="admin-studio-note">
                Upload one strong image or one strong video per slot. The public site will render it as one clean full-size media area.
              </p>
            </div>
          </aside>

          <div className="admin-card-stack">
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
                    <p>Upload a file into any slot above and it will appear here.</p>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}

export default AdminMediaLibrary;
