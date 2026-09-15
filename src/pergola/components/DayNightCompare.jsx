import { useRef, useState } from "react";
import { ArrowRight, CaretLeft, CaretRight } from "@phosphor-icons/react/dist/ssr";
import { track } from "../analytics.js";
import Picture from "./Picture.jsx";

// The day and evening derivatives share identical crops and sizes (checked:
// zero-pixel edge offset), so a hard divider lines up without ghosting.
export default function DayNightCompare({ t, onTryNight }) {
  const [split, setSplit] = useState(50);
  const [animate, setAnimate] = useState(false);
  const counted = useRef(false);

  const interact = () => {
    if (counted.current) return;
    counted.current = true;
    track("compare_interaction", { option: "day_night" });
  };
  const jump = (value) => { setAnimate(true); setSplit(value); interact(); };

  return (
    <section id="day-night" className="pc-section pc-compare" aria-labelledby="pc-compare-title">
      <div className="pc-wrap">
        <div className="pc-compare-head" data-reveal>
          <div className="pc-section-head">
            <h2 id="pc-compare-title">{t.compareTitle}</h2>
            <p>{t.compareText}</p>
          </div>
          <div className="pc-compare-toggle" role="group" aria-label={t.compareSlider}>
            <button type="button" className="pc-chip-btn" aria-pressed={split === 100} onClick={() => jump(100)}>{t.compareDay}</button>
            <button type="button" className="pc-chip-btn" aria-pressed={split === 0} onClick={() => jump(0)}>{t.compareEvening}</button>
          </div>
        </div>

        <figure className="pc-compare-figure" data-reveal style={{ "--i": 1 }}>
          <div className="pc-compare-frame" style={{ "--split": `${split}%` }} data-animate={animate ? "" : undefined}>
            <Picture name="concept-garden-terrace-evening" widths={[640, 960, 1536]} sizes="(min-width: 1320px) 1320px, 100vw" alt={t.compareEveningAlt} width={1536} height={1024} className="pc-compare-base" />
            <div className="pc-compare-top">
              <Picture name="concept-garden-terrace-day" widths={[640, 960, 1536]} sizes="(min-width: 1320px) 1320px, 100vw" alt={t.compareDayAlt} width={1536} height={1024} />
            </div>
            <span className="pc-compare-label pc-compare-label-day" aria-hidden="true">{t.compareDay}</span>
            <span className="pc-compare-label pc-compare-label-evening" aria-hidden="true">{t.compareEvening}</span>
            <span className="pc-compare-handle" aria-hidden="true">
              <span className="pc-compare-knob"><CaretLeft size={14} weight="bold" /><CaretRight size={14} weight="bold" /></span>
            </span>
            <input
              className="pc-compare-range"
              type="range"
              min="0"
              max="100"
              step="1"
              value={split}
              aria-label={t.compareSlider}
              aria-valuetext={`${t.compareDay} ${split}%, ${t.compareEvening} ${100 - split}%`}
              onPointerDown={() => setAnimate(false)}
              onKeyDown={() => setAnimate(false)}
              onChange={(event) => { setSplit(Number(event.target.value)); interact(); }}
            />
          </div>
          <figcaption className="pc-compare-caption">
            <span>{t.compareConcept}</span>
            <button type="button" className="pc-btn pc-btn-secondary" onClick={onTryNight}>
              {t.compareCta}<span className="pc-btn-icon" aria-hidden="true"><ArrowRight size={16} weight="bold" /></span>
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
