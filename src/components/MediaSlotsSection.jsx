import { useEffect, useState } from "react";
import { assetKindFromType, readMediaAsset } from "../admin/mediaStore";

const FALLBACK_MEDIA_SLOTS = {
  eyebrow: "Media plan",
  title: "Reserved space for launch visuals and supporting media.",
  copy:
    "Use these placements for final stills, launch motion, walkthrough captures, and supporting proof as the project media library grows.",
  layout: "showcase",
  highlights: ["Structured placements", "Stills and motion", "Easy to replace later"],
  items: [
    {
      type: "image",
      label: "Hero still",
      meta: "Lead frame",
      title: "Primary image or polished render",
      copy: "Use this for the main product frame, hero render, or strongest still that anchors the section.",
      size: "hero",
    },
    {
      type: "video",
      label: "Motion slot",
      meta: "Supporting proof",
      title: "Motion render or walkthrough",
      copy: "Use this for an orbit clip, feature reveal, or short walkthrough that adds movement and credibility.",
      size: "standard",
    },
  ],
  note:
    "These placements are designed to be swapped with final assets later without restructuring the page.",
};

function MediaSlotsSection({ copy, className = "" }) {
  const section = copy ?? FALLBACK_MEDIA_SLOTS;
  const layout = section.layout ?? "showcase";
  const sectionClassName = ["section-block", "media-slots-section", `is-${layout}`, className]
    .filter(Boolean)
    .join(" ");
  const items = Array.isArray(section.items) ? section.items : [];
  const highlights = Array.isArray(section.highlights) ? section.highlights : [];
  const [assetMap, setAssetMap] = useState({});

  useEffect(() => {
    let isMounted = true;
    const activeUrls = [];
    const assetIds = [...new Set(items.map((item) => item.assetId).filter(Boolean))];

    if (!assetIds.length) {
      setAssetMap({});
      return undefined;
    }

    const loadAssets = async () => {
      const entries = await Promise.all(assetIds.map(async (assetId) => {
        const record = await readMediaAsset(assetId);
        if (!record?.blob) return null;

        const url = URL.createObjectURL(record.blob);
        activeUrls.push(url);

        return [
          assetId,
          {
            id: assetId,
            url,
            kind: assetKindFromType(record.type),
            name: record.name,
          },
        ];
      }));

      if (!isMounted) return;

      setAssetMap(
        Object.fromEntries(entries.filter(Boolean)),
      );
    };

    loadAssets();

    return () => {
      isMounted = false;
      activeUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [items]);

  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="section-head reveal">
          <div className="eyebrow">{section.eyebrow}</div>
          <h2>{section.title}</h2>
          <p>{section.copy}</p>
        </div>

        {highlights.length ? (
          <div className="services-media-summary reveal">
            {highlights.map((item) => (
              <span className="tag services-media-tag" key={item}>{item}</span>
            ))}
          </div>
        ) : null}

        <div className={`services-media-grid is-${layout}`}>
          {items.map((item, index) => (
            <article
              className={`glass-card services-media-card reveal is-${item.size ?? "standard"}`}
              key={item.title}
              style={{ transitionDelay: `${index * 0.07}s` }}
            >
              <div className={`services-media-frame is-${item.type} is-${item.size ?? "standard"}`} aria-hidden="true">
                <div className="services-media-frame-head">
                  <span className="services-media-badge">{item.label}</span>
                  {item.meta ? <span className="services-media-meta">{item.meta}</span> : null}
                </div>
                {item.assetId && assetMap[item.assetId] ? (
                  <div className={`services-media-preview is-${assetMap[item.assetId].kind}`}>
                    {assetMap[item.assetId].kind === "video" ? (
                      <video
                        className="services-media-video"
                        src={assetMap[item.assetId].url}
                        controls
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        className="services-media-image"
                        src={assetMap[item.assetId].url}
                        alt={item.title}
                      />
                    )}
                  </div>
                ) : (
                  <div className={`services-media-placeholder is-${item.type} is-${item.size ?? "standard"}`}>
                    <div className={`services-media-placeholder-surface is-${item.type}`}>
                      {item.type === "video" ? <span className="services-media-play" /> : null}
                      <span className="services-media-placeholder-label">
                        {item.type === "video" ? "Video area" : "Image area"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="services-media-body">
                {item.meta ? <span className="services-media-body-meta">{item.meta}</span> : null}
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="services-media-note reveal">{section.note}</p>
      </div>
    </section>
  );
}

export default MediaSlotsSection;
