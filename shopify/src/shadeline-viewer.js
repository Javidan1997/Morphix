// Shadeline 3D viewer = Configuro's production pergola configurator engine
// (src/pergola/viewer/engine.js), wrapped for the Shopify theme.
//
// Built by `npm run theme:viewer` into shopify/theme/assets/shadeline-viewer.js.
// `three` stays external (the theme's importmap serves it); the engine's
// environment/sky files load from window.CFG_PERGOLA_ASSETS (set in Liquid to
// the theme's asset folder) instead of the site's /pergola-configurators/v2/.
import { PergolaViewer, supportsWebGL } from "../../src/pergola/viewer/engine.js";

const FINISH = { Anthracite: "ral7016", Sand: "ral1015", "Signal white": "ral9016" };
const SCREEN_SIDES = ["right", "left", "rear"];

/** Shadeline configurator state → engine config. */
export function toEngineConfig(state) {
  const sides = { front: "none", right: "none", rear: "none", left: "none" };
  SCREEN_SIDES.slice(0, Math.min(3, state.screens || 0)).forEach((side) => (sides[side] = "zip"));
  return {
    width: state.width / 100,
    depth: state.depth / 100,
    height: 2.6,
    mount: "freestanding",
    roof: 35,
    finish: FINISH[state.finish] || "ral7016",
    blade: "match",
    sides,
    zipOpen: 30,
    led: state.lighting ? "warm" : "off",
    heaters: 0,
    environment: "patio",
    time: "day",
  };
}

export function mountViewer(container, state, { onStatus } = {}) {
  if (!supportsWebGL()) throw new Error("WebGL unavailable");
  const viewer = new PergolaViewer(container, {
    config: toEngineConfig(state),
    label: "3D preview of your configured pergola",
    onStatus: (status) => onStatus?.(status),
  });
  return {
    update: (next) => viewer.setConfig(toEngineConfig(next)),
    dispose: () => viewer.dispose(),
  };
}
