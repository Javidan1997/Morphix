// Linkcore — anodised docks and hubs on a dark studio sweep with rim lights.
import { THREE, setup, cyclorama, camera, shadowAll, loadFont, canvasTexture, exportSizes, rounded } from "./common.js";

export const shotList = () => ["hero", "dock12", "dock8", "hub7", "dl2"];

let ready;
const fonts = () => (ready ||= loadFont("Grotesk", "font-space-grotesk.woff2", { weight: "300 700" }));

const PORT = {
  tb: [46, 18, 9], usbc: [40, 15, 7], usba: [56, 24, 3], hdmi: [62, 22, 4], dp: [58, 22, 4], rj45: [60, 50, 3], sd: [70, 10, 2], audio: [22, 22, 11],
};
function faceTexture(ports, { body = "#1b2029", label = "LINKCORE" } = {}) {
  return canvasTexture(2048, 256, (ctx, w, h) => {
    ctx.fillStyle = body;
    ctx.fillRect(0, 0, w, h);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "rgba(255,255,255,.07)");
    g.addColorStop(1, "rgba(0,0,0,.18)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const total = ports.reduce((n, p) => n + PORT[p][0] * 3 + 34, 0);
    let x = (w - total) / 2;
    for (const p of ports) {
      const [pw, ph, r] = PORT[p].map((v) => v * 3);
      const y = h / 2 - ph / 2;
      ctx.fillStyle = "#05070a";
      ctx.beginPath();
      ctx.roundRect(x, y, pw, ph, r);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,.18)";
      ctx.lineWidth = 3;
      ctx.stroke();
      if (p === "tb" || p === "usbc") {
        ctx.fillStyle = p === "tb" ? "#c6f432" : "#3a4250";
        ctx.fillRect(x + pw * 0.2, h / 2 - 3, pw * 0.6, 6);
      }
      if (p === "usba") { ctx.fillStyle = "#2f7cf6"; ctx.fillRect(x + 12, h / 2 - 4, pw - 24, 10); }
      if (p === "rj45") { ctx.fillStyle = "#c6f432"; ctx.fillRect(x + 8, y + 8, 14, 8); }
      x += pw + 34 * 3;
    }
    ctx.fillStyle = "#c6f432";
    ctx.beginPath();
    ctx.arc(70, h / 2, 9, 0, Math.PI * 2);
    ctx.fill();
  });
}
function topTexture(name, body) {
  return canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = body;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.font = "600 44px Grotesk";
    ctx.fillText("linkcore", 60, h - 70);
    ctx.font = "500 30px Grotesk";
    ctx.fillStyle = "rgba(255,255,255,.3)";
    ctx.fillText(name, 60, h - 28);
  });
}

function device({ w, h, d, front, back = [], name, body = "#1b2029", metal = 0.75 }) {
  const side = new THREE.MeshPhysicalMaterial({ color: body, metalness: metal, roughness: 0.38, clearcoat: 0.3 });
  const geo = rounded(w, d, h, Math.min(w, d) * 0.12, 4);
  // rounded() extrudes along Z; rotate so the extrusion is the device height.
  geo.rotateX(-Math.PI / 2);
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  geo.translate(0, -bb.min.y, 0);
  const H = bb.max.y - bb.min.y, D = bb.max.z;
  const m = new THREE.Mesh(geo, side);
  const g = new THREE.Group();
  g.add(m);
  const faceMat = new THREE.MeshStandardMaterial({ map: faceTexture(front, { body }), metalness: 0.4, roughness: 0.45 });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.62), faceMat);
  face.position.set(0, H / 2, D + 0.002);
  g.add(face);
  if (back.length) {
    const backFace = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, h * 0.62), new THREE.MeshStandardMaterial({ map: faceTexture(back, { body }), metalness: 0.4, roughness: 0.45 }));
    backFace.position.set(0, H / 2, -D - 0.002);
    backFace.rotation.y = Math.PI;
    g.add(backFace);
  }
  const top = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.86, d * 0.8), new THREE.MeshStandardMaterial({ map: topTexture(name, body), metalness: metal, roughness: 0.4, transparent: true }));
  top.rotation.x = -Math.PI / 2;
  top.position.y = H + 0.002;
  g.add(top);
  return shadowAll(g);
}

function cable(points, color = "#c6f432") {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
  const m = new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.022, 16), new THREE.MeshPhysicalMaterial({ color, roughness: 0.5, clearcoat: 0.4 }));
  return shadowAll(m);
}

const PRODUCTS = {
  dock12: () => device({ w: 2.2, h: 0.32, d: 0.85, front: ["tb", "usba", "usba", "sd", "audio"], back: ["tb", "tb", "hdmi", "dp", "rj45", "usba"], name: "Dock 12 · Thunderbolt 4" }),
  dock8: () => device({ w: 1.6, h: 0.28, d: 0.7, front: ["usbc", "usba", "audio"], back: ["usbc", "hdmi", "hdmi", "rj45"], name: "Dock 8 · USB-C", body: "#262c36" }),
  hub7: () => device({ w: 1.1, h: 0.16, d: 0.45, front: ["usba", "usba", "hdmi", "sd"], name: "Hub 7", body: "#3a4049", metal: 0.85 }),
  dl2: () => device({ w: 1.25, h: 0.26, d: 0.8, front: ["usbc", "usba", "audio"], back: ["hdmi", "hdmi", "rj45"], name: "DualLink DL", body: "#9aa2ad", metal: 0.9 }),
};

function rims(scene) {
  const key = new THREE.DirectionalLight("#ffffff", 3.0);
  key.position.set(-2, 4, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4 });
  key.shadow.radius = 6;
  scene.add(key);
  const lime = new THREE.DirectionalLight("#c6f432", 2.4);
  lime.position.set(4, 1.5, -3);
  const cyan = new THREE.DirectionalLight("#4cc9ff", 1.6);
  cyan.position.set(-4, 1.2, -3);
  scene.add(lime, cyan, new THREE.HemisphereLight("#9fb3d1", "#05070a", 0.35));
}

export async function render(shot) {
  await fonts();
  let W = 1200, H = 1200, widths = [480, 800, 1200];
  if (shot === "hero") { W = 1600; H = 1200; widths = [480, 800, 1200, 1600]; }
  const ctx = setup(W, H, { background: "#0a0e15", exposure: 1.2, env: 0.5 });
  const { scene } = ctx;
  scene.add(cyclorama("#0f141d", { radius: 6, roughness: 0.7 }));
  rims(scene);
  let cam;
  if (shot === "hero") {
    const dock = PRODUCTS.dock12();
    dock.rotation.y = -0.28;
    scene.add(dock);
    const hub = PRODUCTS.hub7();
    hub.position.set(-1.9, 0, 1.0);
    hub.rotation.y = 0.5;
    scene.add(hub);
    scene.add(cable([[0.85, 0.16, -0.7], [1.6, 0.03, -1.3], [2.6, 0.03, -0.6], [3.2, 0.03, 0.8]]));
    scene.add(cable([[-1.45, 0.08, 0.75], [-1.6, 0.03, 0.1], [-2.6, 0.03, -0.6], [-3.4, 0.03, -0.4]], "#2a313c"));
    cam = camera(W, H, { fov: 30, position: [0.4, 1.6, 4.9], target: [-0.25, 0.15, 0.1] });
  } else {
    const p = PRODUCTS[shot]();
    p.rotation.y = -0.45;
    scene.add(p);
    const size = new THREE.Box3().setFromObject(p).getSize(new THREE.Vector3());
    const dist = Math.max(size.x, size.z) * 1.75 + 0.5;
    cam = camera(W, H, { fov: 28, position: [dist * 0.3, dist * 0.34, dist], target: [0, size.y * 0.35, 0] });
  }
  ctx.renderer.render(scene, cam);
  const out = exportSizes(ctx.canvas, `linkcore-${shot}`, widths, { quality: 0.84 });
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  return out;
}
