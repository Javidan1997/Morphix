import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { format } from "../copy.js";
import { track } from "../analytics.js";
import Picture, { IMG } from "./Picture.jsx";

// Concept renders and the live demo scene each one maps to. The live scenes
// are simpler than the artwork, which the copy says plainly.
export const GALLERY_SCENES = [
  { id: "garden", image: "concept-garden-terrace-day", live: "patio" },
  { id: "villa", image: "concept-poolside-villa", live: "pool" },
  { id: "rooftop", image: "concept-hospitality-rooftop", live: "rooftop" },
];

export default function SceneGallery({ t, onExplore, onExample, onDiscuss }) {
  const [active, setActive] = useState(0);
  // Only the active large image renders at first; the next one is added when
  // the gallery nears the viewport, others on hover, focus or selection.
  const [loaded, setLoaded] = useState(() => new Set([0]));
  const sectionRef = useRef(null);
  const load = (index) => setLoaded((old) => (old.has(index) ? old : new Set([...old, index])));

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { load(1); observer.disconnect(); }
    }, { rootMargin: "400px 0px" });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  function select(index) {
    load(index);
    load((index + 1) % GALLERY_SCENES.length);
    setActive(index);
    track("environment_select", { setting: GALLERY_SCENES[index].id });
  }

  const scene = GALLERY_SCENES[active];
  const copy = t.scenes[scene.id];
  const liveName = t.environments[scene.live];

  return (
    <section id="settings" className="pc-section pc-gallery" ref={sectionRef} aria-labelledby="pc-gallery-title">
      <div className="pc-wrap">
        <div className="pc-section-head" data-reveal>
          <h2 id="pc-gallery-title">{t.galleryTitle}</h2>
          <p>{t.galleryText}</p>
        </div>
        <div className="pc-gallery-grid">
          <figure className="pc-gallery-media" data-reveal>
            <div className="pc-gallery-frame">
              {GALLERY_SCENES.map((item, index) => (loaded.has(index) ? (
                <div key={item.id} className="pc-crossfade" data-active={index === active ? "" : undefined} aria-hidden={index === active ? undefined : "true"}>
                  <Picture name={item.image} widths={[640, 960, 1536]} sizes="(min-width: 1024px) 64vw, 100vw"
                    alt={t.scenes[item.id].alt} width={1536} height={1024} className="pc-gallery-picture" imgClassName="pc-parallax" />
                </div>
              ) : null))}
            </div>
            <figcaption>{t.galleryConcept}</figcaption>
          </figure>

          <div className="pc-gallery-copy" data-reveal style={{ "--i": 1 }}>
            <div className="pc-gallery-thumbs" role="group" aria-label={t.gallerySelect}>
              {GALLERY_SCENES.map((item, index) => (
                <button key={item.id} type="button" className="pc-thumb" aria-pressed={index === active}
                  onClick={() => select(index)} onPointerEnter={() => load(index)} onFocus={() => load(index)}>
                  <img src={`${IMG}/${item.image}-thumb.webp`} alt="" width="160" height="107" loading="lazy" decoding="async" />
                  <span>{t.scenes[item.id].name}</span>
                </button>
              ))}
            </div>
            <div className="pc-gallery-detail" key={scene.id}>
              <h3>{copy.title}</h3>
              <p>{copy.text}</p>
              <div className="pc-gallery-actions">
                <button type="button" className="pc-btn pc-btn-primary" onClick={() => onExplore(scene)}>
                  {t.exploreSetting}<span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
                </button>
                <button type="button" className="pc-btn pc-btn-secondary" onClick={() => onDiscuss(scene)}>{t.discussEnvironment}</button>
              </div>
              <p className="pc-note">{format(t.exploreNote, { scene: liveName })}</p>
              <p className="pc-note">
                <button type="button" className="pc-linklike" onClick={() => onExample(scene)}>{t.loadExample}</button>
                {" "}{t.exampleNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
