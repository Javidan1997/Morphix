// Human-readable views of a configuration: summary rows, share link, plain
// text for the quote request and a standalone printable spec sheet.
import { FINISHES, SIDES, encodeConfig, formatLength, illustrativeEstimate, structureFor } from "./configModel.js";
import { format } from "./copy.js";

export const PAGE_PATH = "/pergola-configurator";
const LOCALES = { en: "en-US", tr: "tr-TR", az: "az-Latn-AZ" };

export function money(value, lang) {
  return new Intl.NumberFormat(LOCALES[lang] || "en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export function shareUrl(config, lang, origin = typeof window !== "undefined" ? window.location.origin : "https://configuro.studio") {
  const params = new URLSearchParams({ c: encodeConfig(config) });
  if (lang && lang !== "en") params.set("lang", lang);
  return `${origin}${PAGE_PATH}?${params}`;
}

const finishLabel = (id, t) => {
  const finish = FINISHES.find((f) => f.id === id);
  return finish ? `${t.finishNames[id]} (${finish.code})` : t.bladeMatch;
};

export function summaryRows(config, t, units) {
  const { baysX, baysZ, posts } = structureFor(config);
  const sides = SIDES.filter((side) => config.sides[side] !== "none").map((side) => {
    const system = config.sides[side];
    const open = system === "sliding" ? ` ${config.slidingOpen}%` : system === "zip" ? ` ${config.zipOpen}%` : "";
    return `${t.sideNames[side]}: ${t.systems[system]}${open}`;
  });
  return [
    [t.summarySize, `${formatLength(config.width, units)} × ${formatLength(config.depth, units)}`],
    [t.summaryHeight, formatLength(config.height, units)],
    [t.summaryStructure, `${t.mounts[config.mount]}, ${format(t.summaryBays, { bays: baysX * baysZ, posts })}`],
    [t.summaryRoof, `${config.roof}°. ${finishLabel(config.blade === "match" ? config.finish : config.blade, t)}`],
    [t.finish, finishLabel(config.finish, t)],
    [t.summarySides, sides.length ? sides.join(", ") : t.none],
    [t.summaryLighting, config.led === "off" ? t.ledModes.off : `${t.ledModes[config.led]}, ${config.ledLevel}%`],
    [t.summaryHeaters, config.heaters ? String(config.heaters) : t.none],
    [t.summaryScene, `${t.environments[config.environment]}, ${t.times[config.time]}`],
  ];
}

export function estimateRows(config, t, lang) {
  const estimate = illustrativeEstimate(config);
  const label = (key) => (key.startsWith("side.") ? format(t.estimateLines.side, { side: t.sideNames[key.slice(5)] }) : t.estimateLines[key]);
  return { total: money(estimate.total, lang), totalValue: estimate.total, lines: estimate.lines.map(([key, value]) => [label(key), money(value, lang)]) };
}

export function designText(config, t, units, lang) {
  const rows = summaryRows(config, t, units).map(([label, value]) => `${label}: ${value}`);
  const estimate = estimateRows(config, t, lang);
  return [`${t.code}: ${encodeConfig(config)}`, ...rows, `${t.estimate}: ${estimate.total} (${t.estimateNote})`].join("\n");
}

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

/** Self-contained HTML spec sheet; opens in any browser and prints to PDF. */
export function specSheetHtml({ config, t, units, lang, imageUrl }) {
  const url = shareUrl(config, lang);
  const estimate = estimateRows(config, t, lang);
  const rows = summaryRows(config, t, units).map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  const lines = estimate.lines.map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  const date = new Intl.DateTimeFormat(LOCALES[lang] || "en-US", { dateStyle: "long" }).format(new Date());
  return `<!doctype html><html lang="${t.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(t.specTitle)} ${encodeConfig(config)}</title>
<style>body{font:15px/1.5 system-ui,sans-serif;color:#17191c;margin:0;padding:32px;max-width:860px;margin-inline:auto}h1{font-size:28px;letter-spacing:-.02em;margin:0 0 4px}p{margin:0 0 16px;color:#50565d}img{width:100%;border-radius:12px;margin:16px 0;background:#e4e5e3}table{width:100%;border-collapse:collapse;margin:8px 0 24px}th,td{text-align:left;padding:8px 0;vertical-align:top;border-bottom:1px solid #e2e4e6}th{width:34%;font-weight:600}h2{font-size:17px;margin:24px 0 4px}small{color:#50565d}a{color:#2446c7}@media print{body{padding:0}}</style></head>
<body><h1>${escapeHtml(t.specTitle)}</h1><p>${escapeHtml(t.code)} <strong>${encodeConfig(config)}</strong> · ${escapeHtml(date)}</p>
${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(t.viewerLabel)}">` : ""}
<table>${rows}</table>
<h2>${escapeHtml(t.estimate)}: ${escapeHtml(estimate.total)}</h2><table>${lines}</table><p><small>${escapeHtml(t.estimateNote)}</small></p>
<p><a href="${escapeHtml(url)}">${escapeHtml(t.specOpen)}</a><br><small>${escapeHtml(url)}</small></p>
<p><small>${escapeHtml(t.specDisclaimer)}</small></p></body></html>`;
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
