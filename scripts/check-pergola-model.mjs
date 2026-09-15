// Fast checks for the pergola configuration model: share-code round trips,
// clamping, product rules and legacy link migration.
// Usage: node scripts/check-pergola-model.mjs
import * as m from "../src/pergola/configModel.js";

let failures = 0;
const check = (condition, label) => {
  console.log(`${condition ? "ok  " : "FAIL"} ${label}`);
  if (!condition) failures += 1;
};
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const base = m.normalizeConfig(m.DEFAULT_CONFIG);
check(same(m.decodeConfig(m.encodeConfig(base)), base), `default round trip (${m.encodeConfig(base)})`);

let broken = 0;
for (let i = 0; i < 5000; i += 1) {
  const raw = { sides: {} };
  for (const field of Object.values(m.FIELD_SPECS)) {
    const pick = Math.floor(Math.random() * field.count);
    const value = field.type === "range" ? field.min + pick * field.step : field.values[pick];
    if (field.key.startsWith("side.")) raw.sides[field.key.slice(5)] = value;
    else raw[field.key] = value;
  }
  const config = m.normalizeConfig(raw);
  if (!same(m.decodeConfig(m.encodeConfig(config)), config)) broken += 1;
  if (config.mount === "wall" && config.sides.rear !== "none") broken += 1;
  if (config.slidingOpen > m.SLIDING_OPEN_MAX) broken += 1;
}
check(broken === 0, "5000 random configurations round trip and respect rules");

check(m.decodeConfig("not-a-code") === null, "garbage code rejected");
check(m.decodeConfig(`1${"z".repeat(11)}`) === null, "out-of-range code rejected");

const clamped = m.normalizeConfig({ width: 99, depth: -4, height: "tall", roof: 47, slidingOpen: 100, heaters: 9 });
check(clamped.width === m.WIDTH_RANGE.max && clamped.depth === m.DEPTH_RANGE.min, "dimensions clamp to limits");
check(clamped.height === m.DEFAULT_CONFIG.height && clamped.roof === 45 && clamped.slidingOpen === 75 && clamped.heaters === 2, "invalid values snap or fall back");

const wide = m.structureFor(m.normalizeConfig({ width: 7, depth: 6.5 }));
check(wide.baysX === 2 && wide.baysZ === 2 && wide.posts === 8, "large footprint splits into bays with extra posts");
const wall = m.structureFor(m.normalizeConfig({ width: 4, depth: 3, mount: "wall" }));
check(wall.posts === 2, "wall mount removes the wall-side posts");

const legacySearch = `?package=custom&lang=tr&design=${encodeURIComponent(JSON.stringify({ width: 4.5, depth: 3.5, height: 2.7, finish: "sand", roof: 15, glass: true, glassOpen: 15, screen: true, screenOpen: 20, led: false, attached: true, environment: "pool", time: "night" }))}`;
const legacy = m.configFromSearch(legacySearch);
check(legacy.source === "legacy" && legacy.config.finish === "ral1015" && legacy.config.mount === "wall" && legacy.config.sides.front === "sliding" && legacy.config.sides.right === "zip" && legacy.config.time === "night", "legacy design links migrate");

check(m.configFromSearch("").source === "default", "empty query opens the default design");
check(m.illustrativeEstimate(base).total > 0, "illustrative estimate computes");

if (failures) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
}
