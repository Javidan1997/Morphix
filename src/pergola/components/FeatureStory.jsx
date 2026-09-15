import { useRef, useState } from "react";
import { ArrowRight, Play } from "@phosphor-icons/react/dist/ssr";
import { format } from "../copy.js";
import { track } from "../analytics.js";
import { useActiveSection, scrollBehavior } from "../motion.js";
import Hotspots from "./Hotspots.jsx";
import { IMG } from "./Picture.jsx";

// Frames are rendered by the live configurator (scripts/capture-pergola-renders.mjs),
// so every movement shown here is real model output, not the concept art.
export const STORY_CHAPTERS = [
  { id: "roof", tab: "roof", frames: ["story-roof-closed", "story-roof-half", "story-roof-open"] },
  {
    id: "enclosure", tab: "sides", frames: ["story-enclosure-open", "story-enclosure-glass", "story-enclosure-screen"],
    detail: { image: "concept-glass-screen-detail", hotspots: "glass", points: [[24, 50], [28, 87], [80, 46], [40, 27]] },
  },
  {
    id: "atmosphere", tab: "extras", frames: ["story-atmosphere-anthracite", "story-atmosphere-white", "story-atmosphere-warm", "story-atmosphere-color"],
    detail: { image: "detail", hotspots: "detail", points: [[36, 70], [72, 45], [78, 14]], widths: [480, 800] },
  },
];

function StoryMedia({ chapter, t, compact }) {
  const [mode, setMode] = useState("model");
  const [state, setState] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0]));
  const copy = t.chapters[chapter.id];
  const load = (index) => setLoaded((old) => (old.has(index) ? old : new Set([...old, index])));
  const pick = (index) => {
    load(index);
    setState(index);
    track("story_state", { option: `${chapter.id}_${index}` });
  };

  return (
    <div className="pc-story-media" data-compact={compact ? "" : undefined}>
      {chapter.detail && (
        <div className="pc-story-mode" role="group" aria-label={copy.title}>
          <button type="button" className="pc-chip-btn" aria-pressed={mode === "model"} onClick={() => setMode("model")}>{t.storyModel}</button>
          <button type="button" className="pc-chip-btn" aria-pressed={mode === "detail"} onClick={() => setMode("detail")}>{t.storyDetail}</button>
        </div>
      )}
      {mode === "model" ? (
        <>
          <div className="pc-story-frame">
            {chapter.frames.map((frame, index) => (loaded.has(index) ? (
              <picture key={frame} className="pc-crossfade" data-active={index === state ? "" : undefined} aria-hidden={index === state ? undefined : "true"}>
                <source type="image/avif" srcSet={`${IMG}/${frame}-960.avif 960w, ${IMG}/${frame}-1440.avif 1440w`} sizes="(min-width: 1024px) 50vw, 100vw" />
                <img src={`${IMG}/${frame}-960.webp`} srcSet={`${IMG}/${frame}-960.webp 960w, ${IMG}/${frame}-1440.webp 1440w`} sizes="(min-width: 1024px) 50vw, 100vw"
                  alt={`${copy.title}: ${copy.states[index]}`} width="1440" height="1080" loading="lazy" decoding="async" />
              </picture>
            ) : null))}
          </div>
          <div className="pc-story-states" role="group" aria-label={t.storyStates}>
            {copy.states.map((label, index) => (
              <button key={label} type="button" className="pc-chip-btn" aria-pressed={index === state}
                onClick={() => pick(index)} onPointerEnter={() => load(index)} onFocus={() => load(index)}>{label}</button>
            ))}
          </div>
          <p className="pc-media-caption">{t.storyCaptured}</p>
        </>
      ) : (
        <Hotspots id={chapter.id} t={t} image={chapter.detail.image} points={chapter.detail.points} items={t.hotspots[chapter.detail.hotspots]}
          widths={chapter.detail.widths} size={chapter.detail.image === "detail" ? [1024, 1024] : undefined}
          alt={chapter.detail.image === "detail" ? t.detailAlt : t.hotspots.glass.map((h) => h[0]).join(", ")}
          caption={chapter.detail.image === "detail" ? null : t.storyConcept} />
      )}
    </div>
  );
}

export default function FeatureStory({ t, onTry, onDemo }) {
  const refs = useRef([]);
  const [active] = useActiveSection(refs, STORY_CHAPTERS.length);
  const total = STORY_CHAPTERS.length;

  const goToChapter = (index) => refs.current[index]?.scrollIntoView({ behavior: scrollBehavior(), block: "center" });

  return (
    <section id="in-action" className="pc-section pc-story" aria-labelledby="pc-story-title">
      <div className="pc-wrap">
        <div className="pc-story-head" data-reveal>
          <div className="pc-section-head">
            <h2 id="pc-story-title">{t.storyTitle}</h2>
            <p>{t.storyText}</p>
          </div>
          <button type="button" className="pc-btn pc-btn-secondary" onClick={onDemo}>
            <Play size={16} weight="fill" aria-hidden="true" />{t.demoCta}
          </button>
        </div>

        <div className="pc-story-grid">
          {/* Larger screens: one sticky visual that follows the active chapter. */}
          <div className="pc-story-sticky">
            <div className="pc-story-stack">
              {STORY_CHAPTERS.map((chapter, index) => (
                <div key={chapter.id} className="pc-story-layer" data-active={index === active ? "" : undefined} inert={index === active ? undefined : true}>
                  <StoryMedia chapter={chapter} t={t} />
                </div>
              ))}
            </div>
            <ol className="pc-story-progress" aria-label={format(t.storyProgress, { n: active + 1, total })}>
              {STORY_CHAPTERS.map((chapter, index) => (
                <li key={chapter.id}>
                  <button type="button" aria-current={index === active ? "step" : undefined} onClick={() => goToChapter(index)}>
                    <span className="pc-sr">{format(t.storyProgress, { n: index + 1, total })}: </span>{t.chapters[chapter.id].title}
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <div className="pc-story-chapters">
            {STORY_CHAPTERS.map((chapter, index) => {
              const copy = t.chapters[chapter.id];
              return (
                <article key={chapter.id} ref={(node) => { refs.current[index] = node; }} data-index={index}
                  className="pc-story-chapter" data-active={index === active ? "" : undefined} aria-labelledby={`pc-chapter-${chapter.id}`}>
                  <h3 id={`pc-chapter-${chapter.id}`}>{copy.title}</h3>
                  <p>{copy.text}</p>
                  {/* Small screens: each chapter carries its own visual and tap controls. */}
                  <div className="pc-story-inline"><StoryMedia chapter={chapter} t={t} compact /></div>
                  <button type="button" className="pc-btn pc-btn-secondary" onClick={() => onTry(chapter.tab, chapter.id)}>
                    {copy.cta}<span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
