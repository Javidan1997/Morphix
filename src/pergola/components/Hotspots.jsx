import { useEffect, useId, useRef, useState } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import { format } from "../copy.js";
import { track } from "../analytics.js";
import Picture from "./Picture.jsx";

/**
 * Image with hotspot buttons at feature positions (percent coordinates).
 * One panel is open at a time; Escape or the close button dismisses it and
 * returns focus to its hotspot. A plain list below repeats every detail so the
 * content stays readable on small screens and without the overlay.
 */
export default function Hotspots({ image, alt, points, items, t, caption, id, widths = [640, 960, 1536], size = [1536, 1024] }) {
  const [open, setOpen] = useState(-1);
  const buttons = useRef([]);
  const panelRef = useRef(null);
  const uid = useId();

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (event) => { if (event.key === "Escape") close(); };
    const onPointer = (event) => {
      if (panelRef.current?.contains(event.target) || buttons.current.some((b) => b?.contains(event.target))) return;
      setOpen(-1);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  });

  function toggle(index) {
    setOpen((current) => (current === index ? -1 : index));
    if (open !== index) track("feature_hotspot", { option: `${id}_${index}` });
  }
  function close() {
    const index = open;
    setOpen(-1);
    buttons.current[index]?.focus();
  }

  const panelSide = (x) => (x > 55 ? "left" : "right");
  return (
    <div className="pc-hotspots">
      <div className="pc-hotspots-frame">
        <Picture name={image} widths={widths} sizes="(min-width: 1024px) 48vw, 100vw" alt={alt} width={size[0]} height={size[1]} />
        {points.map(([x, y], index) => (
          <button
            key={index}
            ref={(node) => { buttons.current[index] = node; }}
            type="button"
            className="pc-hotspot"
            style={{ left: `${x}%`, top: `${y}%` }}
            aria-expanded={open === index}
            aria-controls={`${uid}-panel`}
            aria-label={format(t.hotspotOpen, { name: items[index][0] })}
            onClick={() => toggle(index)}
          >
            <Plus size={14} weight="bold" aria-hidden="true" />
          </button>
        ))}
        {open >= 0 && (
          <div ref={panelRef} id={`${uid}-panel`} className="pc-hotspot-panel" role="dialog" aria-modal="false" aria-label={items[open][0]}
            data-side={panelSide(points[open][0])} style={{ left: `${points[open][0]}%`, top: `${points[open][1]}%` }}>
            <strong>{items[open][0]}</strong>
            <p>{items[open][1]}</p>
            <button type="button" className="pc-icon-btn pc-hotspot-close" aria-label={t.close} onClick={close}><X size={14} weight="bold" aria-hidden="true" /></button>
          </div>
        )}
      </div>
      {caption && <p className="pc-media-caption">{caption}</p>}
      <dl className="pc-hotspot-list" aria-label={t.hotspotsLabel}>
        {items.map(([name, text], index) => (
          <div key={name}><dt><span className="pc-hotspot-num" aria-hidden="true">{index + 1}</span>{name}</dt><dd>{text}</dd></div>
        ))}
      </dl>
    </div>
  );
}
