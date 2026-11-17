// Aurel — the Meridian solitaire ring: gold band, faceted lab diamond,
// travertine pedestal on a warm ivory sweep.
import { THREE, setup, cyclorama, sun, camera, shadowAll, canvasTexture, exportSizes, mulberry } from "./common.js";

export const shotList = () => ["hero", "ring-yellow", "ring-white", "ring-rose", "band", "trio"];

const METALS = {
  yellow: { color: "#e9c27a", roughness: 0.14 },
  white: { color: "#e7e7e4", roughness: 0.12 },
  rose: { color: "#eab49a", roughness: 0.14 },
};

function diamond() {
  // Round brilliant approximation: lathe with 16 facets, flat shaded.
  const pts = [
    new THREE.Vector2(0, -0.26),
    new THREE.Vector2(0.17, -0.06),
    new THREE.Vector2(0.2, 0),
    new THREE.Vector2(0.2, 0.012),
    new THREE.Vector2(0.12, 0.085),
    new THREE.Vector2(0, 0.085),
  ];
  const geo = new THREE.LatheGeometry(pts, 16);
  const mat = new THREE.MeshPhysicalMaterial({ color: "#ffffff", metalness: 0, roughness: 0, transmission: 1, thickness: 0.4, ior: 2.42, specularIntensity: 1, envMapIntensity: 2.5, flatShading: true });
  if ("dispersion" in mat) mat.dispersion = 5;
  return new THREE.Mesh(geo, mat);
}

function ring(metal = "yellow", { stone = true } = {}) {
  const m = METALS[metal];
  const gold = new THREE.MeshPhysicalMaterial({ color: m.color, metalness: 1, roughness: m.roughness, clearcoat: 0.3, envMapIntensity: 1.4 });
  const g = new THREE.Group();
  const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.085, 48, 220), gold);
  band.scale.set(1, 1, 1.9); // comfort-fit, wider than tall
  g.add(band);
  if (stone) {
    const head = new THREE.Group();
    const basket = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.14, 24, 1, true), gold);
    basket.position.y = 1.12;
    head.add(basket);
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const prong = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.4, 12), gold);
      prong.position.set(Math.cos(a) * 0.17, 1.24, Math.sin(a) * 0.17);
      prong.rotation.set(Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25);
      head.add(prong);
    }
    const d = diamond();
    d.position.y = 1.36;
    head.add(d);
    g.add(head);
  }
  return shadowAll(g);
}

function travertine(seed = 5) {
  const r = mulberry(seed);
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = "#e3d8c6";
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i += 1) {
      ctx.strokeStyle = `rgba(${150 + r() * 40},${130 + r() * 30},${100 + r() * 20},${0.12 + r() * 0.18})`;
      ctx.lineWidth = 1 + r() * 4;
      const y = r() * h;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += 64) ctx.lineTo(x, y + Math.sin(x * 0.01 + r()) * 6);
      ctx.stroke();
    }
    for (let i = 0; i < 400; i += 1) {
      ctx.fillStyle = `rgba(120,100,80,${r() * 0.2})`;
      ctx.beginPath();
      ctx.ellipse(r() * w, r() * h, 1 + r() * 6, 0.5 + r() * 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export async function render(shot) {
  let W = 1200, H = 1200, widths = [480, 800, 1200];
  if (shot === "hero") { W = 1600; H = 2000; widths = [480, 800, 1200, 1600]; }
  if (shot === "trio") { W = 1600; H = 1000; widths = [480, 800, 1200, 1600]; }
  const ctx = setup(W, H, { background: "#efe8dc", exposure: 1.0, env: 1.1 });
  const { scene } = ctx;
  const sweep = cyclorama("#e6dccb", { radius: 6, roughness: 1 });
  sweep.material.envMapIntensity = 0.25; // keep the ivory warm; metal still gets full reflections
  scene.add(sweep);
  let cam;
  if (shot === "hero") {
    const ped = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 2.2, 96), new THREE.MeshStandardMaterial({ map: travertine(), roughness: 0.85, envMapIntensity: 0.3 }));
    ped.position.y = 1.1;
    ped.castShadow = ped.receiveShadow = true;
    scene.add(ped);
    const r = ring("yellow");
    r.position.set(0, 2.2 + 1.09 * 0.98, 0.1);
    r.rotation.set(0, -0.55, 0);
    r.scale.setScalar(0.98);
    scene.add(r);
    const back = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 3.4, 96), new THREE.MeshStandardMaterial({ color: "#d6c8b1", roughness: 0.9, envMapIntensity: 0.3 }));
    back.position.set(-2.4, 1.7, -2.6);
    back.castShadow = back.receiveShadow = true;
    scene.add(back);
    sun(scene, { position: [-5, 9, 4], intensity: 2.3, color: "#fff2df", size: 4, radius: 8 });
    cam = camera(W, H, { fov: 26, position: [0.8, 4.6, 11.2], target: [0, 2.95, 0] });
  } else if (shot === "trio") {
    ["white", "yellow", "rose"].forEach((metal, i) => {
      const r = ring(metal);
      r.position.set((i - 1) * 2.5, 1.09, (i % 2) * -0.4);
      r.rotation.y = -0.5 + i * 0.3;
      scene.add(r);
    });
    sun(scene, { position: [-4, 8, 5], intensity: 2.0, color: "#fff2df", size: 5, radius: 8 });
    cam = camera(W, H, { fov: 24, position: [0, 3.2, 12.5], target: [0, 1.25, 0] });
  } else if (shot === "band") {
    const r = ring("yellow", { stone: false });
    r.position.y = 0.162;
    r.rotation.x = -Math.PI / 2;
    scene.add(r);
    sun(scene, { position: [-3, 7, 4], intensity: 2.0, size: 3, radius: 8 });
    cam = camera(W, H, { fov: 26, position: [0, 3.6, 3.8], target: [0, 0.1, 0] });
  } else {
    const metal = shot.split("-")[1];
    const r = ring(metal);
    r.position.y = 1.09;
    r.rotation.y = -0.6;
    scene.add(r);
    sun(scene, { position: [-4, 8, 5], intensity: 2.0, color: "#fff2df", size: 3, radius: 8 });
    cam = camera(W, H, { fov: 24, position: [0.9, 2.6, 7.8], target: [0, 1.28, 0] });
  }
  ctx.renderer.render(scene, cam);
  const out = exportSizes(ctx.canvas, `aurel-${shot}`, widths, { quality: 0.86 });
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  return out;
}
