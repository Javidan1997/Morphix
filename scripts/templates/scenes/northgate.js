// Northgate Supply — kraft packaging product shots and a pallet hero.
import { THREE, setup, cyclorama, sun, camera, shadowAll, loadFont, canvasTexture, exportSizes, rounded, mulberry } from "./common.js";

export const shotList = () => ["hero", "box-s", "box-m", "box-l", "tape", "film", "mailer", "gloves", "paper"];

let ready;
const fonts = () => (ready ||= Promise.all([loadFont("Plex", "font-plex-sans-600.woff2", { weight: "600" }), loadFont("PlexMono", "font-plex-mono-500.woff2", { weight: "500" })]));

const KRAFT = "#b98c5a";
function kraftTexture(label = true, seed = 3) {
  const r = mulberry(seed);
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = KRAFT;
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 9000; i += 1) {
      ctx.fillStyle = `rgba(${r() > 0.5 ? "90,60,30" : "230,200,160"},${r() * 0.08})`;
      ctx.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 3);
    }
    if (!label) return;
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "600 64px Plex";
    ctx.fillText("NORTHGATE", 70, 150);
    ctx.fillStyle = "#ff5a1f";
    ctx.fillRect(70, 175, 120, 14);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "500 30px PlexMono";
    ctx.fillText("DW-CORR · 32 ECT", 70, 250);
    // "This side up" arrows
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#1a1a1a";
    for (const x of [760, 860]) {
      ctx.beginPath();
      ctx.moveTo(x, 260); ctx.lineTo(x, 120); ctx.moveTo(x - 30, 160); ctx.lineTo(x, 120); ctx.lineTo(x + 30, 160);
      ctx.stroke();
    }
  });
}

function box(w, h, d, seed) {
  const tex = kraftTexture(true, seed);
  const plain = kraftTexture(false, seed + 1);
  const side = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.92 });
  const top = new THREE.MeshStandardMaterial({ map: plain, roughness: 0.92 });
  const m = new THREE.Mesh(rounded(w, h, d, 0.01, 2), [side, side]);
  m.geometry = new THREE.BoxGeometry(w, h, d);
  m.material = [side, side, top, top, side, side];
  m.position.y = h / 2;
  const g = new THREE.Group();
  g.add(m);
  // Tape strip over the top seam.
  const tape = new THREE.Mesh(new THREE.BoxGeometry(0.06 * Math.min(w, 1), 0.002, d + 0.002), new THREE.MeshStandardMaterial({ color: "#c79b62", roughness: 0.35 }));
  tape.position.y = h + 0.001;
  g.add(tape);
  return shadowAll(g);
}

function tapeRoll(color = "#c9a06b") {
  const g = new THREE.Group();
  const outer = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.048, 64, 1, true), new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, clearcoat: 0.6, side: THREE.DoubleSide }));
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.038, 0.11, 64), new THREE.MeshStandardMaterial({ color: "#a77e4c", roughness: 0.4, side: THREE.DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.024;
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 48, 1, true), new THREE.MeshStandardMaterial({ color: "#8a6a45", side: THREE.DoubleSide }));
  g.add(outer, ring, core);
  g.position.y = 0.024;
  return shadowAll(g);
}

function filmRoll() {
  const g = new THREE.Group();
  const film = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 64), new THREE.MeshPhysicalMaterial({ color: "#dfe7ea", roughness: 0.15, transmission: 0.55, thickness: 0.08, clearcoat: 1 }));
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.52, 32), new THREE.MeshStandardMaterial({ color: "#9a7650", roughness: 0.8 }));
  g.add(core, film);
  g.rotation.z = Math.PI / 2;
  g.position.y = 0.06;
  return shadowAll(g);
}

function mailer() {
  const tex = canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = "#e9e7e2";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "600 70px Plex";
    ctx.fillText("NORTHGATE", 90, 520);
    ctx.fillStyle = "#ff5a1f";
    ctx.fillRect(90, 550, 140, 16);
    ctx.font = "500 32px PlexMono";
    ctx.fillStyle = "#555";
    ctx.fillText("CO-EX POLY · 60 MU · 325×430", 90, 640);
  });
  const g = new THREE.Group();
  const geo = new THREE.BoxGeometry(0.33, 0.012, 0.43, 8, 1, 8);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i += 1) if (p.getY(i) > 0) p.setY(i, p.getY(i) + 0.01 * Math.cos(p.getX(i) * 8) * Math.cos(p.getZ(i) * 6));
  geo.computeVertexNormals();
  const m = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ map: tex, roughness: 0.45, clearcoat: 0.3 }));
  m.position.y = 0.006;
  g.add(m);
  return shadowAll(g);
}

function glovesBox() {
  const tex = canvasTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = "#f1f1ee";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#2b5fd9";
    ctx.fillRect(0, h - 120, w, 120);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "600 62px Plex";
    ctx.fillText("NITRILE · L", 60, 140);
    ctx.font = "500 30px PlexMono";
    ctx.fillText("100 PCS · POWDER-FREE · 4 MIL", 60, 200);
    ctx.fillStyle = "#fff";
    ctx.font = "600 44px Plex";
    ctx.fillText("NORTHGATE", 60, h - 45);
  });
  const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
  const plain = new THREE.MeshStandardMaterial({ color: "#f1f1ee", roughness: 0.6 });
  const m = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.125), [plain, plain, plain, plain, mat, mat]);
  m.position.y = 0.06;
  const slot = new THREE.Mesh(new THREE.CapsuleGeometry(0.012, 0.12, 4, 12), new THREE.MeshStandardMaterial({ color: "#3a5ba8", roughness: 0.7 }));
  slot.rotation.z = Math.PI / 2;
  slot.position.set(0, 0.121, 0);
  slot.scale.y = 0.4;
  const g = new THREE.Group();
  g.add(m, slot);
  return shadowAll(g);
}

function paperRoll() {
  const g = new THREE.Group();
  const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.38, 64), new THREE.MeshStandardMaterial({ map: kraftTexture(false, 9), roughness: 0.95 }));
  roll.rotation.z = Math.PI / 2;
  roll.position.y = 0.16;
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.385, 32), new THREE.MeshStandardMaterial({ color: "#3a2a1a" }));
  core.rotation.z = Math.PI / 2;
  core.position.y = 0.16;
  g.add(roll, core);
  return shadowAll(g);
}

function pallet() {
  const wood = new THREE.MeshStandardMaterial({ color: "#c9a77a", roughness: 0.9 });
  const g = new THREE.Group();
  for (let i = 0; i < 7; i += 1) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.022, 0.1), wood);
    b.position.set(0, 0.133, -0.4 + i * 0.133);
    g.add(b);
  }
  for (const x of [-0.55, 0, 0.55]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.8), wood);
    s.position.set(x, 0.07, 0);
    g.add(s);
    const f = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.022, 0.8), wood);
    f.position.set(x, 0.011, 0);
    g.add(f);
  }
  return shadowAll(g);
}

export async function render(shot) {
  await fonts();
  let W = 1200, H = 1200, widths = [480, 800, 1200];
  const ctx = (() => {
    if (shot === "hero") { W = 1600; H = 1200; widths = [480, 800, 1200, 1600]; }
    return setup(W, H, { background: "#e7e5df", exposure: 0.95, env: 0.4 });
  })();
  const { scene } = ctx;
  scene.add(cyclorama("#e2e0d9", { radius: 5 }));
  let cam;
  if (shot === "hero") {
    const p = pallet();
    scene.add(p);
    const r = mulberry(4);
    const layer = (y, size) => {
      const [bw, bh, bd] = size;
      for (let x = -0.6 + bw / 2; x <= 0.6 - bw / 2 + 0.001; x += bw)
        for (let z = -0.4 + bd / 2; z <= 0.4 - bd / 2 + 0.001; z += bd) {
          const b = box(bw - 0.006, bh, bd - 0.006, Math.floor(r() * 100));
          b.position.set(x, y, z);
          b.rotation.y = (r() - 0.5) * 0.02;
          scene.add(b);
        }
    };
    layer(0.144, [0.4, 0.3, 0.4]);
    layer(0.444, [0.4, 0.3, 0.4]);
    layer(0.744, [0.3, 0.25, 0.4]);
    const wrap = new THREE.Mesh(new THREE.BoxGeometry(1.215, 0.86, 0.815), new THREE.MeshPhysicalMaterial({ color: "#eef3f5", roughness: 0.2, transmission: 0.9, thickness: 0.01, transparent: true, opacity: 0.35 }));
    wrap.position.y = 0.144 + 0.43;
    scene.add(wrap);
    const t = tapeRoll();
    t.position.set(1.0, 0, 0.5);
    scene.add(t);
    const bx = box(0.4, 0.3, 0.3, 77);
    bx.position.set(-1.05, 0, 0.35);
    bx.rotation.y = 0.5;
    scene.add(bx);
    sun(scene, { position: [-4, 7, 5], intensity: 2.6, size: 3, radius: 6 });
    scene.add(new THREE.HemisphereLight("#ffffff", "#bfb6a6", 0.6));
    cam = camera(W, H, { fov: 30, position: [2.6, 1.9, 3.6], target: [0, 0.48, 0] });
  } else {
    let obj, dist = 1.4, ty = 0.1;
    if (shot === "box-s") { obj = box(0.3, 0.15, 0.2, 11); dist = 1.1; ty = 0.08; }
    if (shot === "box-m") { obj = box(0.4, 0.25, 0.3, 12); dist = 1.45; ty = 0.12; }
    if (shot === "box-l") { obj = box(0.6, 0.4, 0.4, 13); dist = 2.0; ty = 0.2; }
    if (shot === "tape") {
      obj = new THREE.Group();
      [[-0.09, 0, 0], [0.12, 0, 0.06]].forEach(([x, y, z]) => { const t = tapeRoll(); t.position.set(x, 0, z); obj.add(t); });
      const stand = tapeRoll(); stand.rotation.x = Math.PI / 2; stand.position.set(0.02, 0.11, -0.12); obj.add(stand);
      dist = 0.85; ty = 0.06;
    }
    if (shot === "film") { obj = filmRoll(); dist = 1.0; ty = 0.06; }
    if (shot === "mailer") { obj = mailer(); obj.rotation.y = 0.25; dist = 0.95; ty = 0.0; }
    if (shot === "gloves") { obj = glovesBox(); obj.rotation.y = -0.35; dist = 0.7; ty = 0.06; }
    if (shot === "paper") { obj = paperRoll(); obj.rotation.y = 0.5; dist = 1.0; ty = 0.14; }
    scene.add(obj);
    sun(scene, { position: [-3, 6, 4], intensity: 2.6, size: 1.5, radius: 5 });
    scene.add(new THREE.HemisphereLight("#ffffff", "#bfb6a6", 0.6));
    cam = camera(W, H, { fov: 30, position: [dist * 0.7, dist * 0.6, dist], target: [0, ty, 0] });
  }
  ctx.renderer.render(scene, cam);
  const out = exportSizes(ctx.canvas, `northgate-${shot}`, widths, { quality: 0.82 });
  ctx.renderer.dispose();
  ctx.renderer.forceContextLoss();
  return out;
}
