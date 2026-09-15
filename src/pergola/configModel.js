// Configuration model for the /pergola-configurator demo.
//
// Every value a visitor can choose is defined here once: its range, step and
// allowed options. normalizeConfig() is the only way a configuration enters the
// app (defaults, URL codes, legacy links, UI patches), so the viewer, summary,
// share link and quote form can never see an invalid combination.
//
// Product rules are taken from the Glass Group pergola configurator sources
// (pergola-configurator-pwa/src/main.js); each constant below names the source
// constant it mirrors. See docs/pergola-configurator/ASSET-MAP.md.

const IN = 0.0254;
const round = (value, digits = 2) => Number(value.toFixed(digits));

// ---- Structural rules (source: pergola-configurator-pwa) -------------------
// DIMENSION_LIMITS.height = 84-132 in.
export const HEIGHT_RANGE = { min: 2.15, max: 3.35, step: 0.05 };
// DIMENSION_CATALOGS start at 78.75 in (width) and 88 in (projection). The
// demo caps the upper end at two structural bays so every size stays buildable
// from the geometry rules below.
export const WIDTH_RANGE = { min: 2, max: 7, step: 0.05 };
export const DEPTH_RANGE = { min: 2.25, max: 6.5, step: 0.05 };
// MAX_MODULE_WIDTH_IN = 177.1875 in: wider structures split into bays with an
// intermediate post line.
export const MAX_BAY_WIDTH = round(177.1875 * IN, 3);
// MAX_STRUCTURE_UNIT_PROJECTION_IN = 168 in: deeper structures get a middle
// post on each side.
export const MAX_BAY_DEPTH = round(168 * IN, 3);
// SLIDING_GLASS_OPEN_MAX_DEFAULT = 75: panels stack inside the bay.
export const SLIDING_OPEN_MAX = 75;
// FIXED_GLASS_PANE_COUNT_BY_LENGTH: 10 ft bays use 3 panes, longer bays 4.
export const panesForSpan = (span) => (span <= 10 * 0.3048 + 0.05 ? 3 : 4);

// ---- Options ---------------------------------------------------------------
// Frame finishes are a curated subset of the source RAL_CLASSIC table.
export const FINISHES = [
  { id: "ral7016", code: "RAL 7016", hex: "#383E42" },
  { id: "ral9005", code: "RAL 9005", hex: "#1B1C1E" },
  { id: "ral9016", code: "RAL 9016", hex: "#E7E7E2" },
  { id: "ral9006", code: "RAL 9006", hex: "#A5A5A5" },
  { id: "ral8019", code: "RAL 8019", hex: "#3F3A3A" },
  { id: "ral1015", code: "RAL 1015", hex: "#E6D2B5" },
];
export const BLADE_FINISHES = ["match", ...FINISHES.map((f) => f.id)];
// SUBSYSTEM_TYPES in the source, minus guillotine glass (its GLBs are only on
// a remote store CDN and were not part of the local asset set).
export const SIDE_SYSTEMS = ["none", "sliding", "fixed", "zip", "panel"];
export const SIDES = ["front", "right", "rear", "left"];
export const LED_MODES = ["off", "warm", "color"];
export const ENVIRONMENTS = ["studio", "patio", "pool", "deck", "rooftop"];
export const TIMES = ["day", "night"];

export const DEFAULT_CONFIG = Object.freeze({
  width: 4.5,
  depth: 3.6,
  height: 2.6,
  mount: "freestanding",
  roof: 35,
  finish: "ral7016",
  blade: "match",
  sides: Object.freeze({ front: "none", right: "zip", rear: "sliding", left: "none" }),
  slidingOpen: 30,
  zipOpen: 40,
  led: "warm",
  ledHue: 195,
  ledLevel: 70,
  heaters: 0,
  environment: "studio",
  time: "day",
});

// Ordered field list drives normalization and the compact share code. Append
// only: reordering or resizing a field changes every existing share code, so
// bump CODE_VERSION if that ever becomes necessary.
const range = ({ min, max, step }) => ({ type: "range", min, max, step, count: Math.round((max - min) / step) + 1 });
const FIELDS = [
  ["width", range(WIDTH_RANGE)],
  ["depth", range(DEPTH_RANGE)],
  ["height", range(HEIGHT_RANGE)],
  ["mount", { type: "enum", values: ["freestanding", "wall"] }],
  ["roof", range({ min: 0, max: 90, step: 5 })],
  ["finish", { type: "enum", values: FINISHES.map((f) => f.id) }],
  ["blade", { type: "enum", values: BLADE_FINISHES }],
  ["side.front", { type: "enum", values: SIDE_SYSTEMS }],
  ["side.right", { type: "enum", values: SIDE_SYSTEMS }],
  ["side.rear", { type: "enum", values: SIDE_SYSTEMS }],
  ["side.left", { type: "enum", values: SIDE_SYSTEMS }],
  ["slidingOpen", range({ min: 0, max: SLIDING_OPEN_MAX, step: 5 })],
  ["zipOpen", range({ min: 0, max: 100, step: 5 })],
  ["led", { type: "enum", values: LED_MODES }],
  ["ledHue", range({ min: 0, max: 345, step: 15 })],
  ["ledLevel", range({ min: 10, max: 100, step: 10 })],
  ["heaters", range({ min: 0, max: 2, step: 1 })],
  ["environment", { type: "enum", values: ENVIRONMENTS }],
  ["time", { type: "enum", values: TIMES }],
].map(([key, spec]) => ({ key, ...spec, count: spec.count ?? spec.values.length }));

export const FIELD_SPECS = Object.fromEntries(FIELDS.map((f) => [f.key, f]));

const read = (config, key) => (key.startsWith("side.") ? config?.sides?.[key.slice(5)] : config?.[key]);

function snap(value, { min, max, step }, fallback) {
  const n = typeof value === "string" ? Number(value) : value;
  if (typeof n !== "number" || !Number.isFinite(n)) return fallback;
  const clamped = Math.min(max, Math.max(min, n));
  return round(min + Math.round((clamped - min) / step) * step, 2);
}

/** Returns a complete, valid configuration for any input. */
export function normalizeConfig(input = {}) {
  const source = input && typeof input === "object" ? input : {};
  const out = { ...DEFAULT_CONFIG, sides: { ...DEFAULT_CONFIG.sides } };
  for (const field of FIELDS) {
    const fallback = read(DEFAULT_CONFIG, field.key);
    const raw = read(source, field.key);
    const value = field.type === "range" ? snap(raw, field, fallback) : field.values.includes(raw) ? raw : fallback;
    if (field.key.startsWith("side.")) out.sides[field.key.slice(5)] = value;
    else out[field.key] = value;
  }
  // A wall-mounted structure has no posts or side system on the wall side.
  if (out.mount === "wall") out.sides.rear = "none";
  return out;
}

/** Bay layout derived from the source structural span limits. */
export function structureFor(config) {
  const baysX = Math.max(1, Math.ceil((config.width - 0.001) / MAX_BAY_WIDTH));
  const baysZ = Math.max(1, Math.ceil((config.depth - 0.001) / MAX_BAY_DEPTH));
  const sideBays = { front: baysX, rear: baysX, left: baysZ, right: baysZ };
  const postsAlong = (bays) => bays + 1;
  let posts = 2 * postsAlong(baysX) + 2 * (baysZ - 1);
  if (config.mount === "wall") posts -= postsAlong(baysX);
  return { baysX, baysZ, sideBays, posts };
}

export const sideSpan = (config, side) => (side === "front" || side === "rear" ? config.width : config.depth);

// ---- Compact share codes ---------------------------------------------------
// The whole configuration packs into one mixed-radix integer, written in
// base62: about a dozen characters, no backend round trip, and a shared link
// opens identically on any device.
const CODE_VERSION = "1";
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const CAPACITY = FIELDS.reduce((acc, f) => acc * BigInt(f.count), 1n);
const CODE_LENGTH = (() => { let n = 0, v = CAPACITY - 1n; do { n++; v /= 62n; } while (v > 0n); return n; })();

const indexOf = (field, value) => (field.type === "range" ? Math.round((value - field.min) / field.step) : field.values.indexOf(value));
const valueAt = (field, index) => (field.type === "range" ? round(field.min + index * field.step, 2) : field.values[index]);

export function encodeConfig(config) {
  const c = normalizeConfig(config);
  let n = 0n;
  for (const field of FIELDS) n = n * BigInt(field.count) + BigInt(indexOf(field, read(c, field.key)));
  let text = "";
  for (let i = 0; i < CODE_LENGTH; i++) { text = ALPHABET[Number(n % 62n)] + text; n /= 62n; }
  return CODE_VERSION + text;
}

/** Decodes a share code, or returns null when it is not a valid code. */
export function decodeConfig(code) {
  if (typeof code !== "string" || code.length !== CODE_LENGTH + 1 || code[0] !== CODE_VERSION) return null;
  let n = 0n;
  for (const char of code.slice(1)) {
    const digit = ALPHABET.indexOf(char);
    if (digit < 0) return null;
    n = n * 62n + BigInt(digit);
  }
  if (n >= CAPACITY) return null;
  const raw = { sides: {} };
  for (const field of [...FIELDS].reverse()) {
    const count = BigInt(field.count);
    const value = valueAt(field, Number(n % count));
    n /= count;
    if (field.key.startsWith("side.")) raw.sides[field.key.slice(5)] = value;
    else raw[field.key] = value;
  }
  return normalizeConfig(raw);
}

// Links shared from the retired /pergola-configurators page carried the design
// as JSON (`?package=…&design={…}`). Map what still has a meaning.
const LEGACY_FINISH = { black: "ral9005", white: "ral9016", sand: "ral1015" };
export function configFromLegacy(params) {
  let design;
  try { design = JSON.parse(params.get("design") || "null"); } catch { design = null; }
  if (!design || typeof design !== "object") return null;
  return normalizeConfig({
    width: design.width,
    depth: design.depth,
    height: design.height,
    mount: design.attached ? "wall" : "freestanding",
    roof: design.roof,
    finish: LEGACY_FINISH[design.finish],
    sides: { front: design.glass ? "sliding" : "none", right: design.screen ? "zip" : "none", rear: "none", left: "none" },
    slidingOpen: design.glassOpen,
    zipOpen: design.screenOpen,
    led: design.led ? "warm" : "off",
    environment: design.environment,
    time: design.time === "night" ? "night" : "day",
  });
}

/** Reads a configuration from a query string: new code first, then legacy. */
export function configFromSearch(search) {
  const params = new URLSearchParams(search);
  const decoded = decodeConfig(params.get("c"));
  if (decoded) return { config: decoded, source: "code" };
  const legacy = configFromLegacy(params);
  if (legacy) return { config: legacy, source: "legacy" };
  return { config: normalizeConfig(DEFAULT_CONFIG), source: params.has("c") ? "invalid" : "default" };
}

// ---- Illustrative estimate -------------------------------------------------
// Deliberately round demo rates. They are NOT taken from any manufacturer's
// price list and must never be presented as a pergola quotation or as the
// price of Configuro's software service.
export const ILLUSTRATIVE_RATES = Object.freeze({
  structurePerM2: 520,
  tallFramePerM2: 40,
  extraBay: 650,
  sidePerM: { none: 0, sliding: 700, fixed: 520, zip: 420, panel: 360 },
  led: { off: 0, warm: 450, color: 700 },
  heater: 800,
});

export function illustrativeEstimate(config) {
  const c = normalizeConfig(config);
  const r = ILLUSTRATIVE_RATES;
  const { baysX, baysZ } = structureFor(c);
  const lines = [];
  const area = c.width * c.depth;
  lines.push(["structure", area * r.structurePerM2 + (c.height > 3 ? area * r.tallFramePerM2 : 0) + (baysX * baysZ - 1) * r.extraBay]);
  for (const side of SIDES) {
    const system = c.sides[side];
    if (system !== "none") lines.push([`side.${side}`, sideSpan(c, side) * r.sidePerM[system]]);
  }
  if (c.led !== "off") lines.push(["led", r.led[c.led]]);
  if (c.heaters) lines.push(["heaters", c.heaters * r.heater]);
  const total = lines.reduce((sum, [, value]) => sum + value, 0);
  const to50 = (v) => Math.round(v / 50) * 50;
  return { lines: lines.map(([key, value]) => [key, to50(value)]), total: to50(total) };
}

// ---- Units -----------------------------------------------------------------
export function formatLength(meters, units) {
  if (units === "metric") return `${meters.toFixed(2)} m`;
  const inches = Math.round(meters / IN);
  const feet = Math.floor(inches / 12);
  const rest = inches % 12;
  return rest ? `${feet}′ ${rest}″` : `${feet}′`;
}
