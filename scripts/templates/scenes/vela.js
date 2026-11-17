// Vela — plum ceramic supplement jar with champagne lid, cream sweep.
import { THREE, setup, cyclorama, sun, camera, shadowAll, loadFont, canvasTexture, exportSizes, mulberry } from "./common.js";

const PLUM = "#3b2741";
const CREAM = "#efe3d3";
const CHAMPAGNE = "#d8bf98";

export const shotList = () => ["hero", "pack-1", "pack-2", "pack-3", "capsules", "ritual"];

let fontsReady;
async function fonts() {
  fontsReady ||= Promise.all([
    loadFont("Fraunces", "font-fraunces.woff2", { weight: "100 900" }),
    loadFont("Inter", "font-inter.woff2", { weight: "100 900" }),
  ]);
  return fontsReady;
}

function labelTexture() {
  return canvasTexture(2048, 760, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f3e7d6";
    ctx.textAlign = "center";
    ctx.font = "500 230px Fraunces";
    ctx.fillText("vela", w / 2, 300);
    ctx.font = "italic 400 74px Fraunces";
    ctx.fillStyle = CHAMPAGNE;
    ctx.fillText("Evening Calm", w / 2, 430);
    ctx.fillStyle = "#e9dccb";
    ctx.font = "600 34px Inter";
    ctx.letterSpacing = "10px";
    ctx.fillText("MAGNESIUM  ·  L-THEANINE  ·  ASHWAGANDHA", w / 2, 540);
    ctx.font = "500 30px Inter";
    ctx.fillText("60 CAPSULES  ·  DIETARY SUPPLEMENT", w / 2, 640);
    ctx.strokeStyle = "rgba(216,191,152,.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 260, 480);
    ctx.lineTo(w / 2 + 260, 480);
    ctx.stroke();
  });
}

function jar(label) {
  const g = new THREE.Group();
  const R = 0.62, H = 1.25;
  // Body profile: rounded base, straight wall, soft shoulder into a neck.
  const pts = [];
  pts.push(new THREE.Vector2(0, 0));
  for (let i = 0; i <= 8; i += 1) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - 0.06 + Math.sin(a) * 0.06, 0.06 - Math.cos(a) * 0.06));
  }
  pts.push(new THREE.Vector2(R, H - 0.1));
  for (let i = 1; i <= 8; i += 1) {
    const a = (i / 8) * (Math.PI / 2);
    pts.push(new THREE.Vector2(R - 0.1 + Math.cos(a) * 0.1, H - 0.1 + Math.sin(a) * 0.1));
  }
  pts.push(new THREE.Vector2(0.5, H + 0.02));
  pts.push(new THREE.Vector2(0.5, H + 0.08));
  pts.push(new THREE.Vector2(0, H + 0.08));
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 96), new THREE.MeshPhysicalMaterial({ color: PLUM, roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.25 }));
  g.add(body);
  const labelMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(R + 0.003, R + 0.003, 0.72, 96, 1, true, -Math.PI / 2, Math.PI),
    new THREE.MeshStandardMaterial({ map: label, transparent: true, roughness: 0.6, metalness: 0.0 }),
  );
  labelMesh.position.y = 0.6;
  g.add(labelMesh);
  // Ribbed champagne lid.
  const lidPts = [new THREE.Vector2(0, H + 0.05), new THREE.Vector2(0.655, H + 0.05), new THREE.Vector2(0.66, H + 0.07), new THREE.Vector2(0.66, H + 0.4), new THREE.Vector2(0.64, H + 0.43), new THREE.Vector2(0, H + 0.43)];
  const lidGeo = new THREE.LatheGeometry(lidPts, 160);
  const pos = lidGeo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i);
    const r = Math.hypot(x, z);
    if (r > 0.64 && y > H + 0.08 && y < H + 0.39) {
      const a = Math.atan2(z, x);
      const k = 1 + 0.006 * Math.cos(a * 80);
      pos.setX(i, x * k);
      pos.setZ(i, z * k);
    }
  }
  lidGeo.computeVertexNormals();
  g.add(new THREE.Mesh(lidGeo, new THREE.MeshStandardMaterial({ color: CHAMPAGNE, metalness: 0.85, roughness: 0.3 })));
  return shadowAll(g);
}

function capsule(rand) {
  // One capsule, two-tone via vertex colours (lavender cap, cream body).
  const geo = new THREE.CapsuleGeometry(0.072, 0.14, 8, 24);
  const colors = [];
  const pos = geo.attributes.position;
  const a = new THREE.Color("#c3a9d3"), b = new THREE.Color("#f1e9f0");
  for (let i = 0; i < pos.count; i += 1) {
    const c = pos.getY(i) > 0.005 ? a : b;
    colors.push(c.r, c.g, c.b);
  }
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2 }));
  const g = new THREE.Group();
  g.add(m);
  g.rotation.set(Math.PI / 2, 0, rand() * Math.PI * 2);
  return shadowAll(g);
}

function scatter(group, rand, count, area, origin = [0, 0]) {
  for (let i = 0; i < count; i += 1) {
    const c = capsule(rand);
    c.position.set(origin[0] + (rand() - 0.5) * area[0], 0.072, origin[1] + (rand() - 0.5) * area[1]);
    group.add(c);
  }
}

function moon(scene, color, r, pos) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 96), new THREE.MeshBasicMaterial({ color }));
  m.position.set(...pos);
  scene.add(m);
}

export async function render(shot) {
  await fonts();
  const label = labelTexture();
  const rand = mulberry(7);
  let W = 1600, H = 1600, widths = [480, 800, 1200, 1600], name = `vela-${shot}`;
  let ctx, cam;

  if (shot === "hero") {
    ctx = setup(W, H, { background: "#dcbfa5", exposure: 0.95 });
    const { scene } = ctx;
    scene.add(cyclorama("#d9b99c", { radius: 6 }));
    moon(scene, "#ecd6bf", 1.55, [0.7, 3.0, -5.85]);
    const j = jar(label);
    j.rotation.y = -0.12;
    scene.add(j);
    scatter(scene, rand, 9, [2.6, 1.4], [-0.5, 0.9]);
    sun(scene, { position: [-5, 7, 5], intensity: 2.2, color: "#fff1e2", size: 4, radius: 10 });
    scene.add(new THREE.HemisphereLight("#fff4ea", "#c79c80", 0.6));
    cam = camera(W, H, { fov: 28, position: [0.4, 2.0, 6.8], target: [0.15, 0.85, 0] });
  } else if (shot.startsWith("pack-")) {
    const n = Number(shot.split("-")[1]);
    W = H = 1200;
    widths = [480, 800, 1200];
    ctx = setup(W, H, { background: "#e6d4c1", exposure: 0.95 });
    const { scene } = ctx;
    scene.add(cyclorama("#e4d0bb", { radius: 5 }));
    const layout = { 1: [[0, 0]], 2: [[-0.72, 0.1], [0.72, -0.05]], 3: [[-1.35, 0.2], [0, -0.15], [1.35, 0.2]] }[n];
    layout.forEach(([x, z], i) => {
      const j = jar(label);
      j.position.set(x, 0, z);
      j.rotation.y = (i - (n - 1) / 2) * -0.18;
      scene.add(j);
    });
    sun(scene, { position: [-4, 8, 6], intensity: 2.1, color: "#fff4e6", size: 4, radius: 9 });
    scene.add(new THREE.HemisphereLight("#fff8f0", "#cfa98c", 0.55));
    const dist = { 1: 6.4, 2: 7.8, 3: 10.6 }[n];
    cam = camera(W, H, { fov: 26, position: [0, 1.6, dist], target: [0, 0.78, 0] });
  } else if (shot === "capsules") {
    W = 1600; H = 1200;
    ctx = setup(W, H, { background: "#d8b9a0", exposure: 0.95 });
    const { scene } = ctx;
    scene.add(cyclorama("#d6b69c", { radius: 4 }));
    scatter(scene, rand, 26, [2.4, 1.6], [0, 0.2]);
    const j = jar(label);
    j.position.set(1.9, 0, -1.6);
    scene.add(j);
    sun(scene, { position: [-3, 6, 3], intensity: 2.4, color: "#fff2e2", size: 3, radius: 8 });
    scene.add(new THREE.HemisphereLight("#fff4ea", "#c79c80", 0.5));
    cam = camera(W, H, { fov: 30, position: [0, 2.4, 3.6], target: [0.3, 0.3, 0] });
  } else if (shot === "ritual") {
    W = 1600; H = 1100;
    ctx = setup(W, H, { background: "#241a2b", exposure: 0.9, env: 0.25 });
    const { scene } = ctx;
    scene.add(cyclorama("#2c2033", { radius: 6, roughness: 1 }));
    moon(scene, "#e9c9a6", 1.3, [-1.7, 3.2, -5.85]);
    const j = jar(label);
    j.position.set(0.35, 0, 0);
    j.rotation.y = -0.2;
    scene.add(j);
    const glass = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.3, 1.1, 64, 1, true),
      new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.05, transmission: 1, thickness: 0.05, ior: 1.45, side: THREE.DoubleSide }),
    );
    glass.position.set(-0.85, 0.55, 0.3);
    const water = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.29, 0.7, 64), new THREE.MeshPhysicalMaterial({ color: "#e8eef7", roughness: 0.05, transmission: 0.95, thickness: 0.6, ior: 1.33 }));
    water.position.set(-0.85, 0.36, 0.3);
    scene.add(glass, water);
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.36, 0.07, 64), new THREE.MeshStandardMaterial({ color: "#d9c3a6", roughness: 0.5 }));
    dish.position.set(1.35, 0.035, 0.55);
    scene.add(shadowAll(dish));
    for (let i = 0; i < 3; i += 1) {
      const c = capsule(rand);
      c.position.set(1.35 + (i - 1) * 0.14, 0.13, 0.55 + (i % 2) * 0.08);
      scene.add(c);
    }
    sun(scene, { position: [4, 6, 4], intensity: 1.9, color: "#ffd9b0", size: 4, radius: 12 });
    scene.add(new THREE.HemisphereLight("#8f7aa8", "#2a1d30", 0.35));
    cam = camera(W, H, { fov: 28, position: [0, 1.7, 7], target: [0.1, 0.75, 0] });
  }
  ctx.renderer.render(ctx.scene, cam);
  const out = exportSizes(ctx.canvas, name, widths, { png: false });
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  return out;
}
