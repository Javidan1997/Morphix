import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { TEMPLATES_PATH, templateFilters, templates } from "../data/templateGallery";

const COPY = {
  en: {
    eyebrow: "Shopify templates",
    title: "Five concept stores. Each one ships as real theme code.",
    subtitle:
      "Every demo is an invented brand with its own design, rendered from the same Online Store 2.0 theme you could install on a Shopify development store today — sections, blocks, JSON templates and metafields included.",
    points: [
      ["OS 2.0 sections", "Custom sections and blocks with full schema, editable in the theme editor."],
      ["One codebase", "The public demo runs the exact CSS and JavaScript the Shopify theme ships."],
      ["No paid apps", "Native selling plans, metafields, customer tags and the Ajax Cart API. No jQuery."],
    ],
    filterLabel: "Filter templates",
    open: "Open demo",
    hook: "Engineering",
    empty: "No templates in this category yet.",
    note: "Concept demos: invented brands, generated imagery, sample testimonials. Cart and forms work visually; nothing is sent and checkout is off.",
    studioTitle: "Want to sketch your own layout first?",
    studioCopy: "Template Studio lets you stack sections, swap palettes and send the result to us.",
    studioCta: "Open Template Studio",
    ctaTitle: "Need one of these on your store?",
    ctaCopy: "We build custom Shopify sections, configurators and B2B flows on your existing theme.",
  },
  az: {
    eyebrow: "Shopify şablonları",
    title: "Beş konsept mağaza. Hər biri real tema kodu ilə.",
    subtitle:
      "Hər demo öz dizaynı olan uydurma brenddir və bu gün Shopify development mağazasına quraşdıra biləcəyiniz eyni Online Store 2.0 temasından render olunur.",
    points: [
      ["OS 2.0 bölmələri", "Tam schema ilə xüsusi bölmələr və bloklar, tema redaktorunda redaktə olunur."],
      ["Bir kod bazası", "İctimai demo Shopify temasının eyni CSS və JavaScript fayllarını işlədir."],
      ["Ödənişli tətbiq yoxdur", "Selling plan-lar, metafield-lər, müştəri teqləri və Ajax Cart API. jQuery yoxdur."],
    ],
    filterLabel: "Şablonları filtrlə",
    open: "Demonu aç",
    hook: "Mühəndislik",
    empty: "Bu kateqoriyada hələ şablon yoxdur.",
    note: "Konsept demolar: uydurma brendlər, generasiya olunmuş təsvirlər, nümunə rəylər. Səbət və formalar vizual işləyir; heç nə göndərilmir.",
    studioTitle: "Əvvəlcə öz layout-unuzu qurmaq istəyirsiniz?",
    studioCopy: "Şablon Studiyasında bölmələri yığın, palitranı dəyişin və nəticəni bizə göndərin.",
    studioCta: "Şablon Studiyasını aç",
    ctaTitle: "Bunlardan biri mağazanızda lazımdır?",
    ctaCopy: "Mövcud temanızda xüsusi Shopify bölmələri, konfiquratorlar və B2B axınları qururuq.",
  },
};

function TemplateGallery({ content, language }) {
  const t = COPY[language] || COPY.en;
  const [filter, setFilter] = useState("all");
  const visible = useMemo(
    () => (filter === "all" ? templates : templates.filter((item) => item.filters.includes(filter))),
    [filter],
  );

  return (
    <main className="page-templates">
      <section className="page-header section-block">
        <div className="container">
          <div className="eyebrow reveal">{t.eyebrow}</div>
          <h1 className="page-title reveal">{t.title}</h1>
          <p className="page-subtitle reveal">{t.subtitle}</p>
          <ul className="tpl-points reveal">
            {t.points.map(([title, copy]) => (
              <li key={title}>
                <strong>{title}</strong>
                <span>{copy}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-block tpl-gallery">
        <div className="container">
          <div className="work-filter reveal" role="group" aria-label={t.filterLabel}>
            {templateFilters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                className={`work-filter-pill${filter === f.id ? " is-active" : ""}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <p className="tpl-count" aria-live="polite">
            {visible.length} / {templates.length}
          </p>

          {visible.length ? (
            <ul className="tpl-grid">
              {visible.map((item, i) => (
                <li className="tpl-card reveal" key={item.slug} style={{ "--tpl-accent": item.accent, transitionDelay: `${(i % 2) * 0.08}s` }}>
                  {/* Demos are standalone HTML pages, so these are full page loads. */}
                  <a className="tpl-card-cover" href={`${TEMPLATES_PATH}/${item.slug}`} tabIndex={-1} aria-hidden="true">
                    <img
                      src={`${TEMPLATES_PATH}/covers/${item.slug}-800.webp`}
                      srcSet={`${TEMPLATES_PATH}/covers/${item.slug}-800.webp 800w, ${TEMPLATES_PATH}/covers/${item.slug}-1200.webp 1200w`}
                      sizes="(min-width: 960px) 540px, 100vw"
                      width="1200"
                      height="750"
                      alt=""
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </a>
                  <div className="tpl-card-body">
                    <p className="tpl-card-sector">{item.sector}</p>
                    <h2 className="tpl-card-title">{item.name}</h2>
                    <p className="tpl-card-copy">{item.oneLiner}</p>
                    <p className="tpl-card-tags">{item.tags.join(" · ")}</p>
                    <p className="tpl-card-hook">
                      <span>{t.hook}</span> {item.hook}
                    </p>
                    <a className="primary-button tpl-card-cta" href={`${TEMPLATES_PATH}/${item.slug}`}>
                      {t.open}
                      <span className="visually-hidden">: {item.name}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="tpl-empty">{t.empty}</p>
          )}

          <p className="tpl-note">{t.note}</p>

          <div className="tpl-studio reveal">
            <div>
              <h2>{t.studioTitle}</h2>
              <p>{t.studioCopy}</p>
            </div>
            <Link className="secondary-button" to="/templates">
              {t.studioCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section-block cta-section">
        <div className="container cta-container reveal">
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaCopy}</p>
          <Link className="primary-button" to="/contact">
            {content.nav.cta}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default TemplateGallery;
