// Shadeline — procedural louvred pergola + terrace scene.
//
// One module, two consumers: the live configurator viewer
// (shadeline-viewer.js) and the offline renderer that produces the hero and
// poster images (scripts/templates/scenes/shadeline.js). The posters a buyer
// sees before WebGL loads are therefore the exact model the 3D view shows.
import * as THREE from "three";

export const FINISHES = {
  Anthracite: { color: "#2b2e31", roughness: 0.48, metalness: 0.35 },
  Sand: { color: "#c9b99e", roughness: 0.55, metalness: 0.2 },
  "Signal white": { color: "#e9e8e3", roughness: 0.5, metalness: 0.15 },
};

const PROFILE = { post: 0.16, beamH: 0.26, beamT: 0.16, pitch: 0.2, bladeW: 0.2, bladeT: 0.032 };

function bladeGeometry() {
  const w = PROFILE.bladeW / 2, t = PROFILE.bladeT / 2;
  const s = new THREE.Shape();
  s.moveTo(-w, 0);
  s.quadraticCurveTo(0, t * 2.2, w, 0);
  s.quadraticCurveTo(0, -t * 1.1, -w, 0);
  const g = new THREE.ExtrudeGeometry(s, { depth: 1, bevelEnabled: false, curveSegments: 6 });
  g.translate(0, 0, -0.5);
  g.computeVertexNormals();
  return g;
}

function box(mat, sx, sy, sz, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/**
 * @param {object} o { width, depth (metres), height, finish, louvre (0..1 open), lighting, screens (0..3) }
 * @returns THREE.Group with userData.setFinish / setLouvre / setLighting
 */
export function buildPergola(o) {
  const { width: w, depth: d } = o;
  const h = o.height ?? 2.6;
  const { post: p, beamH: bh, beamT: bt } = PROFILE;
  const group = new THREE.Group();
  const finish = FINISHES[o.finish] || FINISHES.Anthracite;
  const frame = new THREE.MeshStandardMaterial({ color: finish.color, roughness: finish.roughness, metalness: finish.metalness });
  const blade = frame.clone();
  const trim = new THREE.MeshStandardMaterial({ color: "#16181a", roughness: 0.6 });

  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    group.add(box(frame, p, h - bh, p, x * (w / 2 - p / 2), (h - bh) / 2, z * (d / 2 - p / 2)));
    group.add(box(trim, p + 0.06, 0.012, p + 0.06, x * (w / 2 - p / 2), 0.006, z * (d / 2 - p / 2)));
  }
  const y = h - bh / 2;
  group.add(box(frame, w, bh, bt, 0, y, d / 2 - bt / 2));
  group.add(box(frame, w, bh, bt, 0, y, -d / 2 + bt / 2));
  group.add(box(frame, bt, bh, d - 2 * bt, -w / 2 + bt / 2, y, 0));
  group.add(box(frame, bt, bh, d - 2 * bt, w / 2 - bt / 2, y, 0));
  group.add(box(trim, w + 0.004, 0.01, bt + 0.004, 0, h - bh - 0.002, d / 2 - bt / 2));
  group.add(box(trim, w + 0.004, 0.01, bt + 0.004, 0, h - bh - 0.002, -d / 2 + bt / 2));

  // Louvre blades span the depth, repeated across the width (one draw call).
  const inner = w - 2 * bt - 0.04;
  const count = Math.max(2, Math.floor(inner / PROFILE.pitch));
  const length = d - 2 * bt - 0.03;
  const blades = new THREE.InstancedMesh(bladeGeometry(), blade, count);
  blades.castShadow = true;
  blades.receiveShadow = true;
  const start = -((count - 1) * PROFILE.pitch) / 2;
  const roofY = h - bh * 0.4;
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, length), pos = new THREE.Vector3();
  const setLouvre = (open) => {
    const angle = THREE.MathUtils.clamp(open, 0, 1) * (Math.PI * 0.42);
    for (let i = 0; i < count; i += 1) {
      pos.set(start + i * PROFILE.pitch, roofY, 0);
      q.setFromAxisAngle(new THREE.Vector3(0, 0, 1), angle);
      blades.setMatrixAt(i, m4.compose(pos, q, s));
    }
    blades.instanceMatrix.needsUpdate = true;
  };
  setLouvre(o.louvre ?? 0.35);
  group.add(blades);

  // LED strip under the inner edge of the beams.
  const led = new THREE.MeshStandardMaterial({ color: "#fff2d6", emissive: "#ffd9a0", emissiveIntensity: 0 });
  const ledY = h - bh - 0.008;
  for (const z of [d / 2 - bt - 0.02, -d / 2 + bt + 0.02]) {
    const strip = box(led, w - 2 * bt, 0.012, 0.025, 0, ledY, z);
    strip.castShadow = false;
    group.add(strip);
  }
  const lights = [];
  const setLighting = (on) => {
    led.emissiveIntensity = on ? 3.2 : 0;
    led.color.set(on ? "#fff6e6" : "#3a3a3a");
    lights.forEach((l) => (l.visible = on));
  };
  const glow = new THREE.PointLight("#ffd29a", 0, 0, 1.6);
  glow.position.set(0, h - bh - 0.25, 0);
  glow.intensity = 6 * w * d * 0.12;
  lights.push(glow);
  group.add(glow);
  setLighting(Boolean(o.lighting));

  // ZIP screens: semi-opaque fabric on the left, right, rear (in that order).
  const fabric = new THREE.MeshStandardMaterial({ color: "#3d3f40", roughness: 0.95, transparent: true, opacity: 0.82, side: THREE.DoubleSide });
  const screens = [
    () => box(fabric, 0.01, h - bh - 0.05, d - 2 * p, -w / 2 + p / 2, (h - bh) / 2 + 0.02, 0),
    () => box(fabric, 0.01, h - bh - 0.05, d - 2 * p, w / 2 - p / 2, (h - bh) / 2 + 0.02, 0),
    () => box(fabric, w - 2 * p, h - bh - 0.05, 0.01, 0, (h - bh) / 2 + 0.02, -d / 2 + p / 2),
  ];
  for (let i = 0; i < Math.min(3, o.screens || 0); i += 1) {
    const sc = screens[i]();
    sc.castShadow = false;
    group.add(sc);
  }

  group.userData = {
    setLouvre,
    setLighting,
    setFinish(name) {
      const f = FINISHES[name] || FINISHES.Anthracite;
      for (const mat of [frame, blade]) {
        mat.color.set(f.color);
        mat.roughness = f.roughness;
        mat.metalness = f.metalness;
      }
    },
    size: { w, d, h },
  };
  return group;
}

function canvasTex(w, h, draw, repeat) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  if (repeat) t.repeat.set(...repeat);
  t.anisotropy = 8;
  return t;
}

function rand(seed) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** Terrace: stone pavers, rendered back wall, lawn, simple outdoor furniture. */
export function buildTerrace({ furniture = true, night = false } = {}) {
  const g = new THREE.Group();
  const r = rand(11);
  const pavers = canvasTex(1024, 1024, (ctx, w, h) => {
    const n = 8;
    for (let i = 0; i < n; i += 1)
      for (let j = 0; j < n; j += 1) {
        const v = 196 + Math.floor(r() * 18);
        ctx.fillStyle = `rgb(${v},${v - 6},${v - 16})`;
        ctx.fillRect((i * w) / n, (j * h) / n, w / n, h / n);
      }
    ctx.strokeStyle = "rgba(90,80,70,.55)";
    ctx.lineWidth = 3;
    for (let i = 0; i <= n; i += 1) {
      ctx.beginPath(); ctx.moveTo((i * w) / n, 0); ctx.lineTo((i * w) / n, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i * h) / n); ctx.lineTo(w, (i * h) / n); ctx.stroke();
    }
  }, [3, 3]);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.MeshStandardMaterial({ map: pavers, roughness: 0.9 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  g.add(floor);
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), new THREE.MeshStandardMaterial({ color: night ? "#1f2a1e" : "#6e7b55", roughness: 1 }));
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = -0.02;
  lawn.receiveShadow = true;
  g.add(lawn);

  const wall = new THREE.Mesh(new THREE.BoxGeometry(16, 5.5, 0.4), new THREE.MeshStandardMaterial({ color: night ? "#a8a196" : "#ddd3c4", roughness: 0.95 }));
  wall.position.set(0, 2.75, -4.2);
  wall.receiveShadow = true;
  wall.castShadow = true;
  g.add(wall);
  const glassMat = new THREE.MeshStandardMaterial({ color: night ? "#f3c98b" : "#2f3a40", roughness: 0.15, metalness: 0.3, emissive: night ? "#f0b56a" : "#000000", emissiveIntensity: night ? 0.9 : 0 });
  for (const x of [-4.6, 4.6]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 0.05), glassMat);
    win.position.set(x, 1.5, -3.98);
    g.add(win);
    const fr = new THREE.Mesh(new THREE.BoxGeometry(2.34, 2.74, 0.04), new THREE.MeshStandardMaterial({ color: "#2b2e31", roughness: 0.5 }));
    fr.position.set(x, 1.5, -3.99);
    g.add(fr);
  }

  if (furniture) {
    const fabric = new THREE.MeshStandardMaterial({ color: "#e4ddd0", roughness: 0.95 });
    const teak = new THREE.MeshStandardMaterial({ color: "#8a6142", roughness: 0.6 });
    const sofa = new THREE.Group();
    sofa.add(box(teak, 2.2, 0.1, 0.9, 0, 0.18, 0));
    sofa.add(box(fabric, 2.1, 0.2, 0.82, 0, 0.33, 0.02));
    sofa.add(box(fabric, 2.1, 0.45, 0.18, 0, 0.55, -0.34));
    sofa.add(box(fabric, 0.18, 0.32, 0.82, -1.0, 0.46, 0.02));
    sofa.add(box(fabric, 0.18, 0.32, 0.82, 1.0, 0.46, 0.02));
    for (const x of [-1.05, 1.05]) for (const z of [-0.4, 0.4]) sofa.add(box(teak, 0.06, 0.13, 0.06, x, 0.065, z));
    sofa.position.set(-0.2, 0, -0.75);
    g.add(sofa);
    const table = new THREE.Group();
    table.add(box(teak, 1.1, 0.05, 0.6, 0, 0.38, 0));
    for (const x of [-0.5, 0.5]) for (const z of [-0.25, 0.25]) table.add(box(teak, 0.05, 0.36, 0.05, x, 0.18, z));
    table.position.set(-0.2, 0, 0.45);
    g.add(table);
    const pot = new THREE.MeshStandardMaterial({ color: "#6f6a63", roughness: 0.85 });
    const leaf = new THREE.MeshStandardMaterial({ color: night ? "#2c3b25" : "#56703f", roughness: 0.9 });
    for (const [x, z, s] of [[2.6, -1.4, 1], [-3.0, 1.6, 0.8]]) {
      const pp = new THREE.Mesh(new THREE.CylinderGeometry(0.28 * s, 0.22 * s, 0.6 * s, 24), pot);
      pp.position.set(x, 0.3 * s, z);
      pp.castShadow = pp.receiveShadow = true;
      g.add(pp);
      for (let i = 0; i < 7; i += 1) {
        const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28 * s, 1), leaf);
        b.position.set(x + (r() - 0.5) * 0.4 * s, (0.75 + r() * 0.6) * s, z + (r() - 0.5) * 0.4 * s);
        b.castShadow = b.receiveShadow = true;
        g.add(b);
      }
    }
  }
  return g;
}

export function skyTexture(night = false) {
  return canvasTex(16, 512, (ctx, w, h) => {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (night) {
      grad.addColorStop(0, "#0b1020");
      grad.addColorStop(0.6, "#1d2338");
      grad.addColorStop(1, "#3a3346");
    } else {
      grad.addColorStop(0, "#8fa7bd");
      grad.addColorStop(0.5, "#c9d3da");
      grad.addColorStop(1, "#e9e3d8");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });
}

/** Lights for day (low sun, crisp louvre shadows) or night. */
export function addLights(scene, { night = false, shadowSize = 2048 } = {}) {
  const sun = new THREE.DirectionalLight(night ? "#8ea3d6" : "#ffe9cc", night ? 0.25 : 3.6);
  // Low afternoon sun from the left: long, crisp louvre stripes on the pavers.
  sun.position.set(-7, 7.5, 4);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowSize, shadowSize);
  Object.assign(sun.shadow.camera, { left: -7, right: 7, top: 7, bottom: -7, near: 1, far: 30 });
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  scene.add(new THREE.HemisphereLight(night ? "#2c3555" : "#dfe9f2", night ? "#1a1a1a" : "#a89a82", night ? 0.25 : 0.45));
  return sun;
}
