// node scripts/templates/test-linkcore-compat.mjs — checks the compatibility rules.
import assert from "node:assert/strict";
import { evaluate, rank } from "../../shopify/theme/assets/linkcore-compat.js";
import fixture from "../../shopify/demo/linkcore.mjs";

const blocks = JSON.parse((await import("node:fs")).readFileSync(new URL("../../shopify/theme/templates/collection.linkcore.json", import.meta.url), "utf8")).sections.checker.blocks;
const profile = (id) => blocks[id].settings;
const compat = (h) => fixture.products[h].metafields.custom.compatibility.value;
const needs = (o = {}) => ({ monitors: 2, resolution: "4K", ethernet: true, charge: true, ...o });

// Base Apple-silicon Mac + 2 monitors: only DisplayLink drives both.
assert.equal(evaluate(profile("mac_base"), needs(), compat("dock-12")).status, "limited");
assert.equal(evaluate(profile("mac_base"), needs(), compat("dock-12")).displays, 1);
assert.equal(evaluate(profile("mac_base"), needs({ resolution: "1440p" }), compat("duallink-dl")).displays, 2);
// MST dock on a Pro Mac mirrors instead of extending.
assert.match(evaluate(profile("mac_pro"), needs(), compat("dock-8")).notes.join(" "), /MST/);
// Thunderbolt-only dock on a data-only USB-C port won't work at all.
assert.equal(evaluate(profile("usbc_data"), needs(), compat("dock-12")).status, "no");
// Windows TB4 laptop, 2 × 4K, ethernet, charging: Dock 12 is a clean fit.
assert.equal(evaluate(profile("win_tb4"), needs(), compat("dock-12")).status, "ok");
// Ranking puts working products first.
const ranked = rank(Object.keys(fixture.products).map((h) => ({ h, price: fixture.products[h].price, result: evaluate(profile("win_tb4"), needs(), compat(h)) })));
assert.equal(ranked[0].h, "dock-12");
console.log("linkcore-compat: all assertions passed");
