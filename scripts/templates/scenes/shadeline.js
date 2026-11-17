// Shadeline — renders posters from the SAME module the live viewer uses.
import { THREE, setup, camera, exportSizes } from "./common.js";
import { buildPergola, buildTerrace, skyTexture, addLights } from "/assets/shadeline-pergola.js";

export const shotList = () => ["hero", "poster-anthracite", "poster-sand", "poster-white", "night", "top"];

const DEFAULT = { width: 4.2, depth: 3.4 };

export async function render(shot) {
  let W = 1600, H = 1200, widths = [480, 800, 1200, 1600];
  let night = false;
  let opts = { ...DEFAULT, finish: "Anthracite", louvre: 0.35 };
  let cam = { fov: 34, position: [6.2, 3.4, 7.4], target: [0, 1.2, -0.3] };
  if (shot === "hero") {
    W = 2000; H = 1125; widths = [640, 960, 1280, 1600, 2000];
    opts = { width: 5, depth: 4, finish: "Sand", louvre: 0.3 };
    cam = { fov: 30, position: [6.2, 2.3, 11.5], target: [-2.6, 1.55, -0.4] };
  } else if (shot.startsWith("poster-")) {
    opts.finish = { anthracite: "Anthracite", sand: "Sand", white: "Signal white" }[shot.split("-")[1]];
  } else if (shot === "night") {
    night = true; W = 1600; H = 1000;
    opts = { ...DEFAULT, finish: "Anthracite", louvre: 0.1, lighting: true, screens: 1 };
    cam = { fov: 34, position: [5.6, 2.5, 6.8], target: [0, 1.2, -0.3] };
  } else if (shot === "top") {
    W = H = 1200; widths = [480, 800, 1200];
    opts = { ...DEFAULT, finish: "Anthracite", louvre: 0.6 };
    cam = { fov: 36, position: [4.6, 7.4, 6.0], target: [0, 1.4, -0.2] };
  }
  const ctx = setup(W, H, { exposure: night ? 1.1 : 0.92, env: night ? 0.08 : 0.35 });
  const { scene, renderer } = ctx;
  scene.background = skyTexture(night);
  scene.fog = new THREE.Fog(night ? "#1d2338" : "#e6e6e0", 18, 46);
  scene.add(buildTerrace({ night }));
  scene.add(buildPergola(opts));
  addLights(scene, { night, shadowSize: 4096 });
  renderer.render(scene, camera(W, H, cam));
  const out = exportSizes(ctx.canvas, `shadeline-${shot}`, widths, { quality: 0.82 });
  renderer.dispose();
  renderer.forceContextLoss();
  return out;
}
