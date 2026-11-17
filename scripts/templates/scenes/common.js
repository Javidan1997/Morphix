// Shared helpers for the product-shot scenes (runs in the browser).
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export { THREE };

export function setup(width, height, { background = "#ffffff", exposure = 1, shadows = true, env = 0.45 } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = env;
  return { renderer, scene, canvas };
}

/** Seamless studio sweep: floor that curves up into a back wall. */
export function cyclorama(color, { width = 60, depth = 30, height = 30, radius = 8, roughness = 0.95 } = {}) {
  const shape = [];
  const steps = 24;
  shape.push(new THREE.Vector2(depth, 0));
  shape.push(new THREE.Vector2(0, 0));
  for (let i = 1; i <= steps; i += 1) {
    const a = (i / steps) * (Math.PI / 2);
    shape.push(new THREE.Vector2(-Math.sin(a) * radius, radius - Math.cos(a) * radius));
  }
  shape.push(new THREE.Vector2(-radius, height));
  // Build as a ruled surface along X.
  const positions = [];
  const indices = [];
  for (let i = 0; i < shape.length; i += 1) {
    positions.push(-width / 2, shape[i].y, shape[i].x, width / 2, shape[i].y, shape[i].x);
    if (i > 0) {
      const a = (i - 1) * 2;
      indices.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, roughness, side: THREE.DoubleSide }));
  mesh.receiveShadow = true;
  return mesh;
}

export function sun(scene, { position = [6, 10, 6], intensity = 2.4, color = "#ffffff", size = 6, mapSize = 2048, radius = 6, target = [0, 0, 0] } = {}) {
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  light.target.position.set(...target);
  light.castShadow = true;
  light.shadow.mapSize.set(mapSize, mapSize);
  light.shadow.camera.left = -size;
  light.shadow.camera.right = size;
  light.shadow.camera.top = size;
  light.shadow.camera.bottom = -size;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 60;
  light.shadow.radius = radius;
  light.shadow.bias = -0.0004;
  light.shadow.normalBias = 0.02;
  scene.add(light, light.target);
  return light;
}

export function camera(width, height, { fov = 30, position = [0, 2, 8], target = [0, 1, 0] } = {}) {
  const cam = new THREE.PerspectiveCamera(fov, width / height, 0.05, 200);
  cam.position.set(...position);
  cam.lookAt(...target);
  return cam;
}

export function shadowAll(object) {
  object.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
  return object;
}

export async function loadFont(family, file, descriptors = {}) {
  const face = new FontFace(family, `url(/assets/${file})`, descriptors);
  await face.load();
  document.fonts.add(face);
}

export function canvasTexture(width, height, draw) {
  const c = document.createElement("canvas");
  c.width = width;
  c.height = height;
  draw(c.getContext("2d"), width, height);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Export the rendered canvas at several widths (WebP), optionally cropped. */
export function exportSizes(canvas, name, widths, { quality = 0.84, png = false } = {}) {
  const out = {};
  for (const w of widths) {
    if (w > canvas.width) continue;
    const h = Math.round((canvas.height * w) / canvas.width);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, w, h);
    out[`${name}-${w}`] = c.toDataURL("image/webp", quality);
  }
  if (png) out[`${name}-src`] = canvas.toDataURL("image/png");
  return out;
}

export function rounded(w, h, d, r = 0.05, seg = 4) {
  const shape = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  const bevel = Math.min(r * 0.6, d * 0.3);
  const geo = new THREE.ExtrudeGeometry(shape, { depth: d - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: seg, curveSegments: seg * 2 });
  geo.translate(0, 0, -(d - bevel * 2) / 2);
  return geo;
}

export function mulberry(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
