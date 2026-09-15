import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Camera, FileArrowDown, LinkSimple, ShareNetwork, ArrowCounterClockwise } from "@phosphor-icons/react/dist/ssr";
import { COPY, LANGUAGES, format } from "./copy.js";
import { DEFAULT_CONFIG, MAX_BAY_DEPTH, MAX_BAY_WIDTH, configFromSearch, encodeConfig, formatLength, illustrativeEstimate, normalizeConfig } from "./configModel.js";
import { designText, downloadBlob, estimateRows, shareUrl, specSheetHtml, summaryRows } from "./design.js";
import { initAnalytics, preservedParams, track, trackingConfigured } from "./analytics.js";
import Controls, { OPEN_TAB_EVENT } from "./components/Controls.jsx";
import ViewerStage, { ACTIVATE_EVENT, DEMO_EVENT, preloadViewer } from "./components/ViewerStage.jsx";
import QuoteForm from "./components/QuoteForm.jsx";
import ConsentBanner, { OPEN_CONSENT_EVENT } from "./components/ConsentBanner.jsx";
import Picture from "./components/Picture.jsx";
import SceneGallery from "./components/SceneGallery.jsx";
import DayNightCompare from "./components/DayNightCompare.jsx";
import FeatureStory from "./components/FeatureStory.jsx";
import ComponentStory from "./components/ComponentStory.jsx";
import Toast from "./components/Toast.jsx";
import { useRevealOnce, scrollBehavior } from "./motion.js";

// Example designs behind "Load example design" in the gallery. Each one uses
// only options the configurator really supports.
const EXAMPLES = {
  garden: { width: 4.5, depth: 4, height: 2.7, mount: "freestanding", roof: 45, finish: "ral7016", blade: "match", sides: { front: "none", right: "sliding", rear: "none", left: "none" }, slidingOpen: 20, led: "warm", ledLevel: 60, heaters: 0, environment: "patio", time: "day" },
  villa: { width: 5, depth: 3.6, height: 2.7, mount: "wall", roof: 30, finish: "ral7016", blade: "match", sides: { front: "none", right: "none", rear: "none", left: "zip" }, zipOpen: 70, led: "warm", ledLevel: 70, heaters: 0, environment: "pool", time: "day" },
  rooftop: { width: 7, depth: 4.5, height: 2.8, mount: "freestanding", roof: 20, finish: "ral7016", blade: "match", sides: { front: "none", right: "none", rear: "none", left: "none" }, led: "warm", ledLevel: 80, heaters: 2, environment: "rooftop", time: "night" },
};

function Wordmark() {
  return <span className="pc-wordmark" translate="no">configuro<span>.</span></span>;
}

/**
 * The page renders identically on the server and on first client render
 * (English, default design). URL state is applied after hydration.
 */
export default function PergolaPage() {
  const [lang, setLang] = useState("en");
  const [units, setUnits] = useState("imperial");
  const [config, setConfig] = useState(() => normalizeConfig(DEFAULT_CONFIG));
  const [notice, setNotice] = useState("");
  const [toast, setToast] = useState(null);
  const [interest, setInterest] = useState("");
  const [shareFallback, setShareFallback] = useState("");
  const [canShare, setCanShare] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const stageRef = useRef(null);
  const headerSentinel = useRef(null);
  const [condensed, setCondensed] = useState(false);
  const t = COPY[lang];

  // ---- URL state ------------------------------------------------------------
  useEffect(() => {
    initAnalytics();
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("lang");
    if (LANGUAGES.includes(requested) && requested !== "en") {
      setLang(requested);
      setUnits("metric");
    }
    const { config: fromUrl, source } = configFromSearch(window.location.search);
    if (source !== "default") setConfig(fromUrl);
    const copy = COPY[LANGUAGES.includes(requested) ? requested : "en"];
    if (source === "invalid") setNotice(copy.linkInvalid);
    if (source === "legacy") setNotice(copy.linkLegacy);
    if (source === "code" || source === "legacy") track("configuration_open", { method: source });
    setCanShare(typeof navigator.share === "function" && matchMedia("(pointer: coarse)").matches);
    setHydrated(true);
  }, []);

  // Keeps the address bar shareable: design code + language + campaign tags.
  useEffect(() => {
    if (!hydrated) return undefined;
    const timer = setTimeout(() => {
      const params = preservedParams();
      const isDefault = encodeConfig(config) === encodeConfig(DEFAULT_CONFIG);
      if (!isDefault) params.set("c", encodeConfig(config));
      if (lang !== "en") params.set("lang", lang); else params.delete("lang");
      const query = params.toString();
      const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
      if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(window.history.state, "", next);
    }, 250);
    return () => clearTimeout(timer);
  }, [config, lang, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.lang = t.htmlLang;
    document.title = t.title;
  }, [t, hydrated]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(""), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  // Header condenses once the hero top scrolls away (no scroll listener).
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setCondensed(!entry.isIntersecting));
    observer.observe(headerSentinel.current);
    return () => observer.disconnect();
  }, []);

  // Section reveals play once; reduced motion (including a live change to the
  // preference) shows everything immediately.
  useRevealOnce();
  const closeToast = useCallback(() => setToast(null), []);
  const showToast = (text, action) => setToast({ id: Date.now(), text, action });

  const update = useCallback((patch) => setConfig((old) => normalizeConfig({ ...old, ...patch })), []);
  const onStart = useCallback(() => track("configurator_start", {}, { once: true }), []);

  const design = useCallback(() => ({
    code: encodeConfig(config),
    url: shareUrl(config, lang),
    config,
    estimate: illustrativeEstimate(config),
    summary: designText(config, t, units, lang),
  }), [config, lang, t, units]);

  function goTo(id, { focus } = {}) {
    const node = document.getElementById(id);
    if (!node) return;
    node.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    if (focus) setTimeout(() => document.querySelector(focus)?.focus({ preventScroll: true }), 450);
  }

  function tryConfigurator(source) {
    track("cta_click", { option: `${source}_try` });
    window.dispatchEvent(new Event(ACTIVATE_EVENT));
    goTo("configurator");
  }

  function requestQuote(source) {
    track("cta_click", { option: `${source}_quote` });
    goTo("quote", { focus: "#pc-q-name" });
  }

  /** Brings the configurator into view on a given panel tab and starts 3D. */
  function openConfigurator(tab, side) {
    window.dispatchEvent(new CustomEvent(OPEN_TAB_EVENT, { detail: { tab, side } }));
    window.dispatchEvent(new Event(ACTIVATE_EVENT));
    goTo("configurator");
  }

  function exploreScene(scene) {
    update({ environment: scene.live });
    track("environment_explore", { setting: scene.id });
    showToast(format(t.openedScene, { scene: t.environments[scene.live] }));
    openConfigurator("scene");
  }

  function loadExample(scene) {
    const previous = config;
    setConfig(normalizeConfig(EXAMPLES[scene.id]));
    track("example_design_load", { setting: scene.id });
    showToast(t.exampleLoaded, { label: t.undo, run: () => { setConfig(previous); showToast(t.undoDone); } });
    openConfigurator("size");
  }

  function discussScene(scene) {
    setInterest(format(t.interestScene, { scene: t.scenes[scene.id].name }));
    track("environment_interest", { setting: scene.id });
    requestQuote("gallery");
  }

  function tryNight() {
    update({ time: "night" });
    track("cta_click", { option: "compare_night" });
    showToast(t.nightApplied);
    openConfigurator("scene");
  }

  function playDemo() {
    track("cta_click", { option: "story_demo" });
    goTo("configurator");
    window.dispatchEvent(new Event(DEMO_EVENT));
  }

  async function copyLink() {
    const url = shareUrl(config, lang);
    setShareFallback("");
    if (canShare) {
      try {
        await navigator.share({ title: t.specTitle, url });
        track("configuration_share", { method: "native", design_code: encodeConfig(config) });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNotice(t.shareDone);
    } catch {
      setShareFallback(url);
    }
    track("configuration_share", { method: "copy", design_code: encodeConfig(config) });
  }

  async function saveImage() {
    const blob = await stageRef.current?.snapshot(`Configuro pergola configurator  ${encodeConfig(config)}  (illustrative)`);
    if (!blob) { setNotice(t.snapshotUnavailable); window.dispatchEvent(new Event(ACTIVATE_EVENT)); return; }
    downloadBlob(blob, `configuro-pergola-${encodeConfig(config)}.png`);
    setNotice(t.snapshotDone);
    track("screenshot_export", { design_code: encodeConfig(config) });
  }

  async function downloadSpec() {
    let imageUrl = "";
    const blob = await stageRef.current?.snapshot(`Configuro  ${encodeConfig(config)}`);
    if (blob) imageUrl = await new Promise((resolve) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.readAsDataURL(blob); });
    const html = specSheetHtml({ config, t, units, lang, imageUrl });
    downloadBlob(new Blob([html], { type: "text/html;charset=utf-8" }), `configuro-pergola-spec-${encodeConfig(config)}.html`);
    setNotice(t.specDone);
    track("spec_export", { design_code: encodeConfig(config) });
  }

  function resetDesign() {
    setConfig(normalizeConfig(DEFAULT_CONFIG));
    setNotice(t.resetDone);
  }

  const rows = summaryRows(config, t, units);
  const estimate = estimateRows(config, t, lang);
  const code = encodeConfig(config);
  const len = (m) => formatLength(m, units);

  return (
    <div className="pc-page">
      <a className="pc-skip" href="#main">{t.skip}</a>
      <header className="pc-header" data-condensed={condensed ? "" : undefined}>
        <div className="pc-wrap pc-header-row">
          <a className="pc-logo" href="/" aria-label={t.home}><Wordmark /></a>
          <nav className="pc-nav" aria-label="Page">
            <a href="#configurator">{t.nav.configurator}</a>
            <a href="#features">{t.nav.features}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="#faq">{t.nav.faq}</a>
          </nav>
          <label className="pc-lang">
            <span className="pc-sr">{t.language}</span>
            <select value={lang} onChange={(event) => { const next = event.target.value; setLang(next); setUnits(next === "en" ? "imperial" : "metric"); track("language_change", { language: next }); }}>
              <option value="en">EN</option>
              <option value="tr">TR</option>
              <option value="az">AZ</option>
            </select>
          </label>
          <button type="button" className="pc-btn pc-btn-primary pc-header-cta" onClick={() => requestQuote("header")}>{t.ctaQuote}</button>
        </div>
      </header>

      <main id="main">
        <span ref={headerSentinel} className="pc-sentinel" aria-hidden="true" />
        <section className="pc-hero pc-wrap" aria-labelledby="pc-hero-title">
          <div className="pc-hero-copy">
            <p className="pc-eyebrow">{t.heroEyebrow}</p>
            <h1 id="pc-hero-title">{t.heroTitle}</h1>
            <p className="pc-lede">{t.heroText}</p>
            <div className="pc-actions">
              <a className="pc-btn pc-btn-primary" href="#configurator" onPointerEnter={preloadViewer} onFocus={preloadViewer}
                onClick={(event) => { event.preventDefault(); tryConfigurator("hero"); }}>
                {t.ctaTry}<span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
              </a>
              <a className="pc-btn pc-btn-secondary" href="#quote" onClick={(event) => { event.preventDefault(); requestQuote("hero"); }}>{t.ctaQuote}</a>
            </div>
          </div>
          <figure className="pc-hero-media">
            <Picture name="hero" widths={[640, 960, 1280, 1920]} sizes="(min-width: 1024px) 56vw, 100vw" alt={t.heroAlt} width={1536} height={1024} priority className="pc-hero-picture" />
            <figcaption>{t.heroCaption}</figcaption>
          </figure>
        </section>

        <ul className="pc-facts pc-wrap" aria-label={t.heroEyebrow}>
          {t.heroFacts.map((fact) => <li key={fact}>{fact}</li>)}
        </ul>

        <section id="configurator" className="pc-config pc-section" aria-labelledby="pc-config-title">
          <div className="pc-wrap">
            <div className="pc-section-head" data-reveal>
              <h2 id="pc-config-title">{t.configTitle}</h2>
              <p>{t.configText}</p>
            </div>
            <div className="pc-workspace">
              <div className="pc-stage-col">
                <ViewerStage ref={stageRef} config={config} t={t} onInteract={onStart} onKeepDemo={(next) => setConfig(normalizeConfig(next))} />
              </div>
              <div className="pc-side-col">
                <Controls config={config} update={update} units={units} setUnits={setUnits} t={t} onStart={onStart} />
                <section className="pc-summary" aria-labelledby="pc-summary-title">
                  <div className="pc-summary-head">
                    <h3 id="pc-summary-title">{t.summary}</h3>
                    <p className="pc-code">{t.code} <code translate="no">{code}</code></p>
                  </div>
                  <dl className="pc-summary-list">
                    {rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                  <div className="pc-estimate">
                    <div className="pc-estimate-total"><span>{t.estimate}</span><strong>{estimate.total}</strong></div>
                    <details>
                      <summary>{t.estimateNote}</summary>
                      <dl>{estimate.lines.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
                    </details>
                  </div>
                  <div className="pc-tools">
                    <button type="button" className="pc-tool" onClick={copyLink}>{canShare ? <ShareNetwork size={18} aria-hidden="true" /> : <LinkSimple size={18} aria-hidden="true" />}{t.share}</button>
                    <button type="button" className="pc-tool" onClick={saveImage}><Camera size={18} aria-hidden="true" />{t.snapshot}</button>
                    <button type="button" className="pc-tool" onClick={downloadSpec}><FileArrowDown size={18} aria-hidden="true" />{t.spec}</button>
                    <button type="button" className="pc-tool" onClick={resetDesign}><ArrowCounterClockwise size={18} aria-hidden="true" />{t.resetDesign}</button>
                  </div>
                  {shareFallback && (
                    <label className="pc-input pc-share-fallback">
                      <span>{t.shareFallback}</span>
                      <input readOnly value={shareFallback} onFocus={(event) => event.target.select()} />
                    </label>
                  )}
                  <p className="pc-notice" role="status" aria-live="polite">{notice}</p>
                  <button type="button" className="pc-btn pc-btn-primary pc-summary-cta" onClick={() => requestQuote("summary")}>
                    {t.ctaQuote}<span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
                  </button>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="pc-section pc-wrap" aria-labelledby="pc-features-title">
          <h2 id="pc-features-title" className="pc-h2" data-reveal>{t.featuresTitle}</h2>
          <div className="pc-bento">
            <article className="pc-bento-cell pc-bento-image" data-reveal>
              <Picture name="night" widths={[640, 960, 1440]} sizes="(min-width: 1024px) 60vw, 100vw" alt={t.nightAlt} width={1536} height={1024} />
              <div className="pc-bento-text"><h3>{t.features[2][0]}</h3><p>{t.features[2][1]}</p></div>
            </article>
            <article className="pc-bento-cell" data-reveal>
              <h3>{t.features[0][0]}</h3><p>{t.features[0][1]}</p>
              <p className="pc-bento-metric" translate="no">{len(2)} - {len(7)}</p>
            </article>
            <article className="pc-bento-cell pc-bento-tint" data-reveal>
              <h3>{t.features[3][0]}</h3><p>{t.features[3][1]}</p>
              <p className="pc-bento-code"><code translate="no">{code}</code></p>
            </article>
            <article className="pc-bento-cell pc-bento-detail" data-reveal>
              <Picture name="detail" widths={[480, 800]} sizes="(min-width: 1024px) 30vw, 100vw" alt={t.detailAlt} width={1024} height={1024} />
              <div className="pc-bento-text"><h3>{t.features[1][0]}</h3><p>{t.features[1][1]}</p></div>
            </article>
          </div>
        </section>

        <SceneGallery t={t} onExplore={exploreScene} onExample={loadExample} onDiscuss={discussScene} />

        <DayNightCompare t={t} onTryNight={tryNight} />

        <FeatureStory t={t} onDemo={playDemo} onTry={(tab, id) => { track("cta_click", { option: `story_${id}` }); openConfigurator(tab, tab === "sides" ? "front" : undefined); }} />

        <ComponentStory t={t} spans={{ width: len(MAX_BAY_WIDTH), depth: len(MAX_BAY_DEPTH) }} onQuote={() => requestQuote("components")} onTry={() => tryConfigurator("components")} />

        <section className="pc-section pc-wrap" aria-labelledby="pc-process-title">
          <div className="pc-section-head" data-reveal>
            <h2 id="pc-process-title">{t.processTitle}</h2>
            <p>{t.deliveryText}</p>
          </div>
          <ol className="pc-timeline" data-reveal>
            {t.weeks.map(([title, text], index) => (
              <li key={title}><span className="pc-week">{t.week} {index + 1}</span><h3>{title}</h3><p>{text}</p></li>
            ))}
          </ol>
          <p className="pc-note pc-inputs">{t.inputs}</p>
        </section>

        <section id="pricing" className="pc-section pc-wrap" aria-labelledby="pc-pricing-title">
          <div className="pc-section-head" data-reveal>
            <h2 id="pc-pricing-title">{t.pricingTitle}</h2>
            <p>{t.pricingText}</p>
          </div>
          <div className="pc-pricing">
            {t.services.map(([name, price, text, items], index) => (
              <article key={name} className="pc-price" data-featured={index === 0 ? "" : undefined} data-reveal>
                <h3>{name}</h3>
                <p className="pc-price-value"><span>{t.startingAt}</span> <strong>{price}</strong> <span>USD</span></p>
                <p>{text}</p>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
          <p className="pc-note pc-scope">{t.scopeNote}</p>
        </section>

        <section id="faq" className="pc-section pc-wrap" aria-labelledby="pc-faq-title">
          <h2 id="pc-faq-title" className="pc-h2" data-reveal>{t.faqTitle}</h2>
          <dl className="pc-faq">
            {t.faqs.map(([question, answer]) => (
              <div key={question} data-reveal><dt>{question}</dt><dd>{answer}</dd></div>
            ))}
          </dl>
        </section>

        <section id="quote" className="pc-section pc-quote" aria-labelledby="pc-quote-title">
          <div className="pc-wrap pc-quote-grid">
            <div className="pc-quote-intro">
              <h2 id="pc-quote-title" className="pc-h2">{t.quoteTitle}</h2>
              <p className="pc-lede">{t.quoteText}</p>
              <div className="pc-quote-design">
                <p className="pc-code">{t.code} <code translate="no">{code}</code></p>
                <dl className="pc-summary-list pc-summary-compact">
                  {rows.slice(0, 6).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
                </dl>
              </div>
            </div>
            <QuoteForm t={t} lang={lang} design={design} interest={interest} onClearInterest={() => setInterest("")} />
          </div>
        </section>

        <section id="privacy" className="pc-section pc-wrap pc-privacy" aria-labelledby="pc-privacy-title">
          <h2 id="pc-privacy-title" className="pc-h3">{t.privacyTitle}</h2>
          {t.privacy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      </main>

      <footer className="pc-footer">
        <div className="pc-wrap pc-footer-row">
          <a className="pc-logo" href="/" aria-label={t.home}><Wordmark /></a>
          <p>{t.footerNote}</p>
          <nav aria-label="Configuro">
            <a href="/services">{t.footerLinks.services}</a>
            <a href="/work">{t.footerLinks.work}</a>
            <a href="/insights/pergola-configurator-sketch-to-sold">{t.footerLinks.guide}</a>
            <a href="/contact">{t.footerLinks.contact}</a>
            {trackingConfigured && <button type="button" className="pc-linklike" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>{t.consentSettings}</button>}
          </nav>
          <p className="pc-copyright">© {new Date().getFullYear()} Configuro · <a href="mailto:hello@configuro.studio">hello@configuro.studio</a></p>
        </div>
      </footer>
      {hydrated && <ConsentBanner t={t} />}
      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
