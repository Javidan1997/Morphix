import { useEffect, useId, useRef, useState } from "react";
import {
  BLADE_FINISHES, DEPTH_RANGE, ENVIRONMENTS, FIELD_SPECS, FINISHES, HEIGHT_RANGE, LED_MODES, MAX_BAY_DEPTH, MAX_BAY_WIDTH,
  SIDES, SIDE_SYSTEMS, TIMES, WIDTH_RANGE, formatLength, structureFor,
} from "../configModel.js";
import { format } from "../copy.js";

const TABS = ["size", "roof", "sides", "extras", "scene"];
const limits = (name) => { const { min, max, step } = FIELD_SPECS[name]; return { min, max, step }; };
const THUMBS = { sliding: "side-sliding", fixed: "side-fixed", zip: "side-zip", panel: "side-panel" };
// Other sections can open a tab (and optionally a side) on the panel.
export const OPEN_TAB_EVENT = "configuro:open-tab";

function Range({ label, value, min, max, step, display, valueText, onChange, note, noteActive, id }) {
  const autoId = useId();
  const inputId = id || autoId;
  const noteId = note ? `${inputId}-note` : undefined;
  return (
    <div className="pc-field">
      <div className="pc-field-head">
        <label htmlFor={inputId}>{label}</label>
        <output htmlFor={inputId}>{display ?? value}</output>
      </div>
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={valueText ?? String(display ?? value)}
        aria-describedby={noteId}
        style={{ "--fill": `${((value - min) / (max - min)) * 100}%` }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {note && <p className="pc-note" data-active={noteActive ? "" : undefined} id={noteId}>{note}</p>}
    </div>
  );
}

function Segmented({ legend, name, options, value, onChange, labelFor, disabled }) {
  return (
    <fieldset className="pc-field pc-segmented" disabled={disabled}>
      <legend>{legend}</legend>
      <div className="pc-segmented-row">
        {options.map((option) => (
          <label key={String(option)} className="pc-segment">
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
            <span>{labelFor(option)}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function Swatches({ legend, name, value, onChange, t, includeMatch }) {
  const options = includeMatch ? BLADE_FINISHES : FINISHES.map((f) => f.id);
  return (
    <fieldset className="pc-field">
      <legend>{legend}</legend>
      <div className="pc-swatches">
        {options.map((id) => {
          const finish = FINISHES.find((f) => f.id === id);
          const label = finish ? `${t.finishNames[id]}, ${finish.code}` : t.bladeMatch;
          return (
            <label key={id} className="pc-swatch" title={label}>
              <input type="radio" name={name} value={id} checked={value === id} onChange={() => onChange(id)} aria-label={label} />
              <span className="pc-swatch-color" data-match={finish ? undefined : ""} style={finish ? { background: finish.hex } : undefined} aria-hidden="true" />
            </label>
          );
        })}
      </div>
      <p className="pc-note">{value === "match" ? t.bladeMatch : `${t.finishNames[value]} · ${FINISHES.find((f) => f.id === value)?.code}`}</p>
    </fieldset>
  );
}

function PlanDiagram({ config, side, onSide, t }) {
  // Plan view for pointer users; the side radio group beside it is the
  // accessible control for the same choice.
  const w = 200, d = Math.round(200 * Math.min(1, config.depth / config.width)) || 140;
  const pad = 26;
  const edges = {
    front: { x1: pad, y1: pad + d, x2: pad + w, y2: pad + d },
    rear: { x1: pad, y1: pad, x2: pad + w, y2: pad },
    left: { x1: pad, y1: pad, x2: pad, y2: pad + d },
    right: { x1: pad + w, y1: pad, x2: pad + w, y2: pad + d },
  };
  return (
    <svg className="pc-plan" viewBox={`0 0 ${w + pad * 2} ${d + pad * 2}`} aria-hidden="true">
      <rect x={pad} y={pad} width={w} height={d} className="pc-plan-roof" />
      {SIDES.map((name) => {
        const e = edges[name];
        const system = config.sides[name];
        const wall = name === "rear" && config.mount === "wall";
        return (
          <g key={name} className="pc-plan-edge" data-active={side === name ? "" : undefined} data-system={wall ? "wall" : system}
            onClick={() => onSide(name)}>
            <line {...e} className="pc-plan-hit" />
            <line {...e} className="pc-plan-line" />
          </g>
        );
      })}
    </svg>
  );
}

export default function Controls({ config, update, units, setUnits, t, onStart }) {
  const [tab, setTab] = useState("size");
  const [side, setSide] = useState("front");
  const tabRefs = useRef({});
  const baseId = useId();
  useEffect(() => {
    const onOpen = (event) => {
      if (TABS.includes(event.detail?.tab)) setTab(event.detail.tab);
      if (SIDES.includes(event.detail?.side)) setSide(event.detail.side);
    };
    window.addEventListener(OPEN_TAB_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_TAB_EVENT, onOpen);
  }, []);
  const { baysX, baysZ } = structureFor(config);
  const change = (patch) => { update(patch); onStart(); };
  const len = (value) => formatLength(value, units);
  const hasSystem = (system) => SIDES.some((s) => config.sides[s] === system);
  const wallSide = side === "rear" && config.mount === "wall";

  function onTabKey(event) {
    const index = TABS.indexOf(tab);
    const next = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TABS.length - 1 }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    const target = TABS[(next + TABS.length) % TABS.length];
    setTab(target);
    tabRefs.current[target]?.focus();
  }

  const panels = {
    size: (
      <>
        <Segmented legend={t.units} name="pc-units" options={["imperial", "metric"]} value={units} onChange={setUnits} labelFor={(u) => t.unitNames[u]} />
        <Range label={t.width} {...WIDTH_RANGE} value={config.width} display={len(config.width)} onChange={(v) => change({ width: v })}
          note={format(t.bayNoteX, { size: len(MAX_BAY_WIDTH) })} noteActive={baysX > 1} />
        <Range label={t.depth} {...DEPTH_RANGE} value={config.depth} display={len(config.depth)} onChange={(v) => change({ depth: v })}
          note={format(t.bayNoteZ, { size: len(MAX_BAY_DEPTH) })} noteActive={baysZ > 1} />
        <Range label={t.height} {...HEIGHT_RANGE} value={config.height} display={len(config.height)} onChange={(v) => change({ height: v })} />
        <Segmented legend={t.mount} name="pc-mount" options={["freestanding", "wall"]} value={config.mount} onChange={(v) => change({ mount: v })} labelFor={(m) => t.mounts[m]} />
      </>
    ),
    roof: (
      <>
        <Range label={t.roof} {...limits("roof")} value={config.roof} display={`${config.roof}°`}
          onChange={(v) => change({ roof: v })} note={`${t.roofEnds[0]} 0° · ${t.roofEnds[1]} 90°`} />
        <Swatches legend={t.finish} name="pc-finish" value={config.finish} onChange={(v) => change({ finish: v })} t={t} />
        <Swatches legend={t.blade} name="pc-blade" value={config.blade} onChange={(v) => change({ blade: v })} t={t} includeMatch />
      </>
    ),
    sides: (
      <>
        <div className="pc-sides-top">
          <PlanDiagram config={config} side={side} onSide={setSide} t={t} />
          <Segmented legend={t.side} name="pc-side" options={SIDES} value={side} onChange={setSide} labelFor={(s) => t.sideNames[s]} />
        </div>
        {wallSide ? <p className="pc-note pc-note-box">{t.wallSide}</p> : (
          <fieldset className="pc-field">
            <legend>{t.sideNames[side]}</legend>
            <div className="pc-systems">
              {SIDE_SYSTEMS.map((system) => (
                <label key={system} className="pc-system">
                  <input type="radio" name="pc-system" value={system} checked={config.sides[side] === system}
                    onChange={() => change({ sides: { ...config.sides, [side]: system } })} />
                  <span className="pc-system-card">
                    {THUMBS[system]
                      ? <img src={`/pergola-configurators/v2/img/${THUMBS[system]}.webp`} alt="" width="56" height="56" loading="lazy" decoding="async" />
                      : <span className="pc-system-empty" aria-hidden="true" />}
                    <span className="pc-system-text"><strong>{t.systems[system]}</strong><small>{t.systemHints[system]}</small></span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}
        {hasSystem("sliding") && <Range label={t.slidingOpen} {...limits("slidingOpen")} value={config.slidingOpen} display={`${config.slidingOpen}%`} onChange={(v) => change({ slidingOpen: v })} />}
        {hasSystem("zip") && <Range label={t.zipOpen} {...limits("zipOpen")} value={config.zipOpen} display={`${config.zipOpen}%`} onChange={(v) => change({ zipOpen: v })} />}
      </>
    ),
    extras: (
      <>
        <Segmented legend={t.led} name="pc-led" options={LED_MODES} value={config.led} onChange={(v) => change({ led: v })} labelFor={(m) => t.ledModes[m]} />
        {config.led === "color" && (
          <div className="pc-hue">
            <Range label={t.ledHue} {...limits("ledHue")} value={config.ledHue} display={<span className="pc-hue-dot" style={{ background: `hsl(${config.ledHue} 85% 55%)` }} />} valueText={`${config.ledHue}°`} onChange={(v) => change({ ledHue: v })} />
          </div>
        )}
        {config.led !== "off" && <Range label={t.ledLevel} {...limits("ledLevel")} value={config.ledLevel} display={`${config.ledLevel}%`} onChange={(v) => change({ ledLevel: v })} />}
        <Segmented legend={t.heaters} name="pc-heaters" options={[0, 1, 2]} value={config.heaters} onChange={(v) => change({ heaters: v })} labelFor={(n) => (n ? String(n) : t.none)} />
        <p className="pc-note">{t.heatersNote}</p>
      </>
    ),
    scene: (
      <>
        <fieldset className="pc-field">
          <legend>{t.environment}</legend>
          <div className="pc-scenes">
            {ENVIRONMENTS.map((env) => (
              <label key={env} className="pc-scene">
                <input type="radio" name="pc-environment" value={env} checked={config.environment === env} onChange={() => change({ environment: env })} />
                <span className="pc-scene-card">
                  {/* Thumbnails are captured from the live viewer, not concept art. */}
                  <img src={`/pergola-configurators/v2/img/scene-${env}-thumb.webp`} alt="" width="160" height="100" loading="lazy" decoding="async" />
                  <span>{t.environments[env]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <Segmented legend={t.time} name="pc-time" options={TIMES} value={config.time} onChange={(v) => change({ time: v })} labelFor={(v) => t.times[v]} />
      </>
    ),
  };

  return (
    <div className="pc-controls">
      <div className="pc-tabs" role="tablist" aria-label={t.tabsLabel} onKeyDown={onTabKey}>
        {TABS.map((name) => (
          <button
            key={name}
            ref={(node) => { tabRefs.current[name] = node; }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${name}`}
            aria-selected={tab === name}
            aria-controls={`${baseId}-panel-${name}`}
            tabIndex={tab === name ? 0 : -1}
            className="pc-tab"
            onClick={() => setTab(name)}
          >
            {t.tabs[name]}
          </button>
        ))}
      </div>
      {TABS.map((name) => (
        <div key={name} role="tabpanel" id={`${baseId}-panel-${name}`} aria-labelledby={`${baseId}-tab-${name}`} hidden={tab !== name} className="pc-panel">
          {tab === name && panels[name]}
        </div>
      ))}
    </div>
  );
}
