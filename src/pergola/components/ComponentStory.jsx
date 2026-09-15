import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { format } from "../copy.js";
import Picture from "./Picture.jsx";

// Marker positions on the concept illustration, in the order of the callouts:
// front-left post, louver pack, glass enclosure, LED strip. Measured against
// the 1536x1024 artwork.
const MARKERS = [[15, 62], [55, 13], [90, 52], [36, 39]];

/**
 * The exploded illustration stays a single, unmodified image. Callouts reveal
 * progressively beside it and highlight their marker on hover or focus; no
 * part of the artwork is cropped or moved to fake an assembly animation.
 */
export default function ComponentStory({ t, spans, onQuote, onTry }) {
  const [active, setActive] = useState(-1);
  return (
    <section id="components" className="pc-section pc-components" aria-labelledby="pc-components-title">
      <div className="pc-wrap">
        <div className="pc-section-head" data-reveal>
          <h2 id="pc-components-title">{t.componentsTitle}</h2>
          <p>{t.componentsText}</p>
        </div>
        <div className="pc-components-grid">
          <figure className="pc-components-media" data-reveal>
            <div className="pc-components-frame">
              <Picture name="concept-exploded-components" widths={[640, 960, 1536]} sizes="(min-width: 1024px) 58vw, 100vw" alt={t.componentsAlt} width={1536} height={1024} imgClassName="pc-parallax" />
              {MARKERS.map(([x, y], index) => (
                <span key={index} className="pc-marker" data-active={active === index ? "" : undefined} style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">{index + 1}</span>
              ))}
            </div>
            <figcaption className="pc-media-caption">{t.componentsConcept}</figcaption>
          </figure>
          <div className="pc-components-copy">
            <ol className="pc-callouts">
              {t.components.map(([title, text], index) => (
                <li key={title} data-reveal style={{ "--i": index }} data-active={active === index ? "" : undefined}
                  tabIndex={0} onPointerEnter={() => setActive(index)} onPointerLeave={() => setActive(-1)} onFocus={() => setActive(index)} onBlur={() => setActive(-1)}>
                  <span className="pc-callout-num" aria-hidden="true">{index + 1}</span>
                  <div><h3>{title}</h3><p>{format(text, spans)}</p></div>
                </li>
              ))}
            </ol>
            <div className="pc-service" data-reveal style={{ "--i": 4 }}>
              <h3>{t.serviceTitle}</h3>
              <ul>{t.service.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="pc-actions">
                <button type="button" className="pc-btn pc-btn-primary" onClick={onQuote}>
                  {t.ctaQuote}<span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
                </button>
                <button type="button" className="pc-btn pc-btn-secondary" onClick={onTry}>{t.ctaTry}</button>
              </div>
              <p className="pc-links"><a href="/insights/pergola-configurator-sketch-to-sold">{t.footerLinks.guide}</a> · <a href="/services">{t.footerLinks.services}</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
