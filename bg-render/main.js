// Offline renderer for the Configuro "automation network" backgrounds.
// The whole scene is a pure function of t in [0,1] so the site can scrub it
// with scroll. Driven headlessly by scripts/capture-bg.mjs via window.__seek.
import * as THREE from "three";

const params = new URLSearchParams(window.location.search);
const PALETTES = {
  indigo: {
    accent: 0x7d95ff,
    accent2: 0xa5b6ff,
    packet: 0xd6ddff,
    line: 0x4a5fb8,
    grid: 0x222a52,
  },
  slate: {
    accent: 0x93a9cc,
    accent2: 0xbccbe2,
    packet: 0xe8eef7,
    line: 0x4a5a75,
    grid: 0x1d2635,
  },
};
const palette = PALETTES[params.get("palette")] || PALETTES.indigo;

// --- deterministic RNG -------------------------------------------------
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(Number(params.get("seed") || 1907));

const smoothstep = (a, b, x) => {
  const k = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return k * k * (3 - 2 * k);
};
const easeOutBack = (x) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};

// --- renderer / scene ---------------------------------------------------
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06070a);
scene.fog = new THREE.Fog(0x06070a, 30, 95);

const camera = new THREE.PerspectiveCamera(
  42,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);

// glow texture shared by sprites (radial gradient, additive blending)
function makeGlowTexture(inner, outer) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, inner);
  g.addColorStop(0.25, outer);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const hex = (n) => `#${n.toString(16).padStart(6, "0")}`;
const packetGlowTex = makeGlowTexture("rgba(255,255,255,0.95)", hex(palette.packet) + "");
const nodeGlowTex = makeGlowTexture(hex(palette.accent2), hex(palette.accent));

// --- floor grid ----------------------------------------------------------
const grid = new THREE.GridHelper(160, 64, palette.grid, palette.grid);
grid.material.transparent = true;
grid.position.y = -7.5;
scene.add(grid);

// --- nodes ---------------------------------------------------------------
// Layered cluster: three loose "tiers" reading as design -> build -> automate.
const NODE_COUNT = 30;
const nodes = [];
const nodeGroup = new THREE.Group();
scene.add(nodeGroup);

const coreGeo = new THREE.BoxGeometry(1, 1, 1);
const edgeGeo = new THREE.EdgesGeometry(coreGeo);

for (let i = 0; i < NODE_COUNT; i += 1) {
  const tier = i % 3;
  const pos = new THREE.Vector3(
    (rand() - 0.5) * 44,
    (tier - 1) * 5.4 + (rand() - 0.5) * 3.2,
    (rand() - 0.5) * 30
  );
  const size = 0.7 + rand() * 1.5;

  const group = new THREE.Group();
  group.position.copy(pos);

  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x0a0d16,
    transparent: true,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.scale.setScalar(size);
  group.add(core);

  const wireMat = new THREE.LineBasicMaterial({
    color: palette.accent,
    transparent: true,
  });
  const wire = new THREE.LineSegments(edgeGeo, wireMat);
  wire.scale.setScalar(size * 1.001);
  group.add(wire);

  const glowMat = new THREE.SpriteMaterial({
    map: nodeGlowTex,
    color: palette.accent,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.setScalar(size * 5);
  group.add(glow);

  nodeGroup.add(group);
  // A third of the network is already alive at t=0 so the top of the page
  // never reads as an empty frame; the rest assembles as the user scrolls.
  const appearAt = i < 10 ? 0 : 0.02 + 0.48 * ((i - 10) / (NODE_COUNT - 10));
  nodes.push({
    group,
    core,
    wire,
    glow,
    size,
    pos,
    appearAt,
    spinSpeed: (rand() - 0.5) * 1.6,
    bobPhase: rand() * Math.PI * 2,
  });
}

// --- links + packets -----------------------------------------------------
// Each node links to its 2 nearest earlier nodes: a growing pipeline graph.
const links = [];
const linkGroup = new THREE.Group();
scene.add(linkGroup);

for (let i = 2; i < NODE_COUNT; i += 1) {
  const candidates = nodes
    .slice(0, i)
    .map((n, j) => ({ j, d: n.pos.distanceTo(nodes[i].pos) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, 2);

  for (const { j } of candidates) {
    const a = nodes[j].pos;
    const b = nodes[i].pos;
    const geo = new THREE.BufferGeometry().setFromPoints([a.clone(), a.clone()]);
    const mat = new THREE.LineBasicMaterial({
      color: palette.line,
      transparent: true,
    });
    const line = new THREE.Line(geo, mat);
    linkGroup.add(line);

    const packetMat = new THREE.SpriteMaterial({
      map: packetGlowTex,
      color: palette.packet,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const packet = new THREE.Sprite(packetMat);
    packet.scale.setScalar(1.35);
    packet.visible = false;
    linkGroup.add(packet);

    const drawAt = Math.max(nodes[i].appearAt, nodes[j].appearAt) + 0.05;
    links.push({
      a,
      b,
      line,
      packet,
      drawAt,
      speed: 0.6 + rand() * 1.4,
      phase: rand(),
    });
  }
}

// --- dust: faint ambient particles for depth ------------------------------
const dustCount = 260;
const dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i += 1) {
  dustPos[i * 3] = (rand() - 0.5) * 90;
  dustPos[i * 3 + 1] = (rand() - 0.5) * 40;
  dustPos[i * 3 + 2] = (rand() - 0.5) * 70;
}
const dustGeo = new THREE.BufferGeometry();
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dustMat = new THREE.PointsMaterial({
  color: palette.accent2,
  size: 0.14,
  transparent: true,
  opacity: 0.35,
  sizeAttenuation: true,
});
scene.add(new THREE.Points(dustGeo, dustMat));

// --- timeline ------------------------------------------------------------
const camStart = new THREE.Vector3(6, -2.5, 34);
const camEnd = new THREE.Vector3(-4, 7.5, 52);
const lookStart = new THREE.Vector3(4, -1, 0);
const lookEnd = new THREE.Vector3(0, 0.5, 0);
const tmpLook = new THREE.Vector3();
const tmpVec = new THREE.Vector3();

function setTime(t) {
  // camera: one slow continuous pull-back and rise
  const ct = smoothstep(0, 1, t);
  camera.position.lerpVectors(camStart, camEnd, ct);
  tmpLook.lerpVectors(lookStart, lookEnd, ct);
  camera.lookAt(tmpLook);

  grid.material.opacity = 0.09 + 0.07 * smoothstep(0, 0.3, t);

  for (const n of nodes) {
    const local = n.appearAt === 0 ? 1 : smoothstep(n.appearAt, n.appearAt + 0.09, t);
    n.group.visible = local > 0;
    if (!n.group.visible) continue;
    const s = Math.max(0.0001, easeOutBack(local));
    n.group.scale.setScalar(s);
    n.group.position.y = n.pos.y + Math.sin(t * Math.PI * 2 + n.bobPhase) * 0.35;
    n.wire.rotation.y = t * n.spinSpeed * Math.PI;
    n.core.rotation.y = n.wire.rotation.y;
    n.wire.material.opacity = 0.35 + 0.65 * local;
    n.core.material.opacity = 0.9 * local;
    // cores "power up" late: the automation comes alive
    const powered = smoothstep(0.55, 0.9, t);
    n.glow.material.opacity = 0.14 + 0.4 * local * (0.45 + 0.55 * powered);
  }

  // some packets already flow at t=0; traffic densifies down the page
  const flowRamp = 0.35 + 0.65 * smoothstep(0.35, 0.75, t);
  for (const l of links) {
    const draw = l.drawAt <= 0.06 ? 1 : smoothstep(l.drawAt, l.drawAt + 0.1, t);
    l.line.visible = draw > 0;
    if (draw > 0) {
      tmpVec.lerpVectors(l.a, l.b, draw);
      const attr = l.line.geometry.attributes.position;
      attr.setXYZ(1, tmpVec.x, tmpVec.y, tmpVec.z);
      attr.needsUpdate = true;
      l.line.material.opacity = 0.22 + 0.3 * draw;
    }
    const flowing = draw >= 1 && flowRamp > 0.01;
    l.packet.visible = flowing;
    if (flowing) {
      const p = (t * 6 * l.speed + l.phase) % 1;
      l.packet.position.lerpVectors(l.a, l.b, p);
      l.packet.material.opacity = flowRamp * (0.55 + 0.45 * Math.sin(p * Math.PI));
    }
  }

  renderer.render(scene, camera);
}

// --- capture API -----------------------------------------------------------
window.__seek = (frame, total) => {
  setTime(total <= 1 ? 0 : frame / (total - 1));
  return renderer.domElement.toDataURL("image/png");
};
window.__ready = true;

// live preview when opened in a normal browser
if (!params.has("headless")) {
  const loop = (ms) => {
    setTime((ms / 12000) % 1);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
