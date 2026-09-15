// Procedural louvered pergola, built from the configuration model.
//
// Draw-call budget: everything static is merged into one mesh per material,
// all roof blades are a single InstancedMesh, and only parts that move
// (sliding panels, ZIP fabric) are separate meshes. A full rebuild happens
// only when a structural value changes; openings, louver angle and colours
// are applied in place by applyDynamic().
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { SIDES, SLIDING_OPEN_MAX, panesForSpan, structureFor } from "../configModel.js";

export const PROFILE = {
  post: 0.15,
  beamHeight: 0.24,
  beamThickness: 0.15,
  innerBeam: 0.1,
  bladePitch: 0.19,
  bladeWidth: 0.2,
  bladeThickness: 0.03,
};

const ZIP_CASSETTE = 0.12;

/** Collects transformed box geometries per material and merges them once. */
class GeometryBatch {
  constructor() { this.parts = new Map(); }
  box(material, sx, sy, sz, x, y, z, matrix) {
    // Extruded aluminium reads as aluminium only with softened edges: main
    // profiles get a small bevel, thin trims and glass stay crisp boxes.
    const bevel = material.userData.bevel && Math.min(sx, sy, sz) > 0.04;
    // RoundedBoxGeometry is non-indexed; plain boxes are converted to match so
    // bevelled and crisp parts can merge into one mesh per material.
    const geometry = bevel ? new RoundedBoxGeometry(sx, sy, sz, 2, Math.min(0.012, Math.min(sx, sy, sz) * 0.12)) : new THREE.BoxGeometry(sx, sy, sz).toNonIndexed();
    geometry.deleteAttribute("uv");
    geometry.translate(x, y, z);
    if (matrix) geometry.applyMatrix4(matrix);
    if (!this.parts.has(material)) this.parts.set(material, []);
    this.parts.get(material).push(geometry);
  }
  meshes() {
    const meshes = [];
    for (const [material, geometries] of this.parts) {
      const merged = mergeGeometries(geometries, false);
      geometries.forEach((g) => g.dispose());
      const mesh = new THREE.Mesh(merged, material);
      mesh.castShadow = !material.transparent;
      mesh.receiveShadow = true;
      meshes.push(mesh);
    }
    return meshes;
  }
}

function bladeGeometry() {
  // Lens-shaped aluminium blade section, extruded to unit length along Z.
  const w = PROFILE.bladeWidth / 2, t = PROFILE.bladeThickness / 2;
  const shape = new THREE.Shape();
  shape.moveTo(-w, 0);
  shape.quadraticCurveTo(0, t * 2.1, w, 0);
  shape.quadraticCurveTo(0, -t * 1.2, -w, 0);
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false, curveSegments: 8 });
  geometry.translate(0, 0, -0.5);
  geometry.computeVertexNormals();
  return geometry;
}

const boundaries = (total, bays, post) => Array.from({ length: bays + 1 }, (_, i) => -total / 2 + post / 2 + (i * (total - post)) / bays);

/**
 * Builds the pergola group. Returned `parts` hold every handle applyDynamic()
 * needs, plus bounds used for camera framing and shadow fitting.
 */
export function buildPergola(config, materials) {
  const group = new THREE.Group();
  group.name = "pergola";
  const { width: w, depth: d, height: h } = config;
  const { post: p, beamHeight: bh, beamThickness: bt, innerBeam: ib } = PROFILE;
  const { baysX, baysZ } = structureFor(config);
  const xs = boundaries(w, baysX, p);
  const zs = boundaries(d, baysZ, p);
  const wall = config.mount === "wall";
  const rearZ = zs[0];
  const batch = new GeometryBatch();
  const parts = { sliding: [], zips: [], blades: null, bladeData: [], ledStrips: null, bays: [], bounds: { w, d, h } };

  // Posts and base plates on the perimeter only; wall-mounted structures drop
  // the wall-side row.
  const postSpots = new Map();
  const addPost = (x, z) => postSpots.set(`${x.toFixed(3)}:${z.toFixed(3)}`, [x, z]);
  for (const x of xs) { addPost(x, zs[0]); addPost(x, zs[baysZ]); }
  for (const z of zs) { addPost(xs[0], z); addPost(xs[baysX], z); }
  for (const [x, z] of postSpots.values()) {
    if (wall && Math.abs(z - rearZ) < 1e-6) continue;
    batch.box(materials.frame, p, h - bh / 2, p, x, (h - bh / 2) / 2, z);
    batch.box(materials.frame, p + 0.07, 0.012, p + 0.07, x, 0.006, z);
    // Shadow gap under the beam reads as a separate extrusion.
    batch.box(materials.trim, p + 0.004, 0.012, p + 0.004, x, h - bh - 0.006, z);
  }

  // Perimeter gutter beams, then internal bay beams.
  const beamY = h - bh / 2;
  batch.box(materials.frame, w, bh, bt, 0, beamY, d / 2 - bt / 2);
  batch.box(materials.frame, w, bh, bt, 0, beamY, -d / 2 + bt / 2);
  batch.box(materials.frame, bt, bh, d - 2 * bt, -w / 2 + bt / 2, beamY, 0);
  batch.box(materials.frame, bt, bh, d - 2 * bt, w / 2 - bt / 2, beamY, 0);
  // Top cap lip on every perimeter beam.
  batch.box(materials.trim, w + 0.01, 0.012, 0.03, 0, h + 0.006, d / 2 - 0.015);
  batch.box(materials.trim, w + 0.01, 0.012, 0.03, 0, h + 0.006, -d / 2 + 0.015);
  for (let i = 1; i < baysX; i++) batch.box(materials.frame, ib, bh * 0.92, d - 2 * bt, xs[i], h - (bh * 0.92) / 2, 0);
  for (let j = 1; j < baysZ; j++) batch.box(materials.frame, w - 2 * bt, bh * 0.92, ib, 0, h - (bh * 0.92) / 2, zs[j]);

  // LED strip along the inner lower edge of each perimeter beam.
  const led = new GeometryBatch();
  const ledY = h - bh - 0.004, inset = 0.035;
  led.box(materials.led, w - 2 * bt - 0.04, 0.008, 0.02, 0, ledY, d / 2 - bt + inset);
  led.box(materials.led, w - 2 * bt - 0.04, 0.008, 0.02, 0, ledY, -d / 2 + bt - inset);
  led.box(materials.led, 0.02, 0.008, d - 2 * bt - 0.04, -w / 2 + bt - inset, ledY, 0);
  led.box(materials.led, 0.02, 0.008, d - 2 * bt - 0.04, w / 2 - bt + inset, ledY, 0);
  parts.ledStrips = led.meshes()[0];
  parts.ledStrips.castShadow = false;
  group.add(parts.ledStrips);

  // Roof blades: one instanced mesh for every bay.
  const roofY = h - bh * 0.42;
  for (let i = 0; i < baysX; i++) {
    for (let j = 0; j < baysZ; j++) {
      const x0 = xs[i] + (i === 0 ? bt - p / 2 : ib / 2), x1 = xs[i + 1] - (i === baysX - 1 ? bt - p / 2 : ib / 2);
      const z0 = zs[j] + (j === 0 ? bt - p / 2 : ib / 2), z1 = zs[j + 1] - (j === baysZ - 1 ? bt - p / 2 : ib / 2);
      const span = x1 - x0 - 0.02;
      const count = Math.max(1, Math.floor(span / PROFILE.bladePitch));
      const start = (x0 + x1) / 2 - ((count - 1) * PROFILE.bladePitch) / 2;
      const length = z1 - z0 - 0.03;
      for (let k = 0; k < count; k++) parts.bladeData.push({ x: start + k * PROFILE.bladePitch, z: (z0 + z1) / 2, length });
      parts.bays.push({ x: (x0 + x1) / 2, z: (z0 + z1) / 2 });
    }
  }
  parts.blades = new THREE.InstancedMesh(materials.bladeGeometry, materials.blade, parts.bladeData.length);
  parts.blades.castShadow = true;
  parts.blades.receiveShadow = true;
  parts.bladeY = roofY;
  group.add(parts.blades);

  // Side systems, built in a local frame per side: u along the side, v up,
  // positive local z facing outward.
  const clear = h - bh;
  for (const side of SIDES) {
    const system = config.sides[side];
    if (system === "none") continue;
    const alongX = side === "front" || side === "rear";
    const list = alongX ? xs : zs;
    const frame = new THREE.Matrix4();
    if (side === "front") frame.makeTranslation(0, 0, zs[baysZ]);
    if (side === "rear") frame.makeRotationY(Math.PI).setPosition(0, 0, zs[0]);
    if (side === "right") frame.makeRotationY(Math.PI / 2).setPosition(xs[baysX], 0, 0);
    if (side === "left") frame.makeRotationY(-Math.PI / 2).setPosition(xs[0], 0, 0);
    for (let k = 0; k < list.length - 1; k++) {
      const u0 = list[k] + p / 2, u1 = list[k + 1] - p / 2;
      const L = u1 - u0, uc = (u0 + u1) / 2;
      if (system === "sliding") buildSliding(group, batch, materials, frame, parts, uc, L, clear);
      if (system === "fixed") buildFixed(batch, materials, frame, uc, L, clear);
      if (system === "zip") buildZip(group, batch, materials, frame, parts, uc, L, clear);
      if (system === "panel") {
        batch.box(materials.panel, L, clear, 0.03, uc, clear / 2, 0, frame);
        for (let s = 1; s < 4; s++) batch.box(materials.trim, L, 0.006, 0.034, uc, (clear * s) / 4, 0, frame);
      }
    }
  }

  if (wall) {
    const wallH = h + 0.9;
    batch.box(materials.wall, w + 2.4, wallH, 0.24, 0, wallH / 2, -d / 2 - 0.12);
    batch.box(materials.coping, w + 2.44, 0.05, 0.3, 0, wallH + 0.025, -d / 2 - 0.12);
  }

  for (const mesh of batch.meshes()) group.add(mesh);
  group.userData.parts = parts;
  return group;
}

function buildSliding(group, batch, materials, frame, parts, uc, L, H) {
  const panes = panesForSpan(L);
  const overlap = 0.04;
  const pw = L / panes + overlap;
  batch.box(materials.frame, L, 0.05, 0.11, uc, H - 0.025, 0, frame);
  batch.box(materials.frame, L, 0.02, 0.11, uc, 0.01, 0, frame);
  const panelH = H - 0.07;
  const frameGeometry = mergeGeometries([
    new THREE.BoxGeometry(0.035, panelH, 0.028).translate(-pw / 2 + 0.0175, panelH / 2, 0),
    new THREE.BoxGeometry(0.035, panelH, 0.028).translate(pw / 2 - 0.0175, panelH / 2, 0),
    new THREE.BoxGeometry(pw, 0.05, 0.028).translate(0, 0.025, 0),
    new THREE.BoxGeometry(pw, 0.04, 0.028).translate(0, panelH - 0.02, 0),
  ]);
  const glassGeometry = new THREE.BoxGeometry(pw - 0.07, panelH - 0.09, 0.008).translate(0, panelH / 2 + 0.005, 0);
  const segment = { panels: [], closed: [], stacked: [] };
  for (let i = 0; i < panes; i++) {
    const panel = new THREE.Group();
    const frameMesh = new THREE.Mesh(frameGeometry, materials.frame);
    frameMesh.castShadow = true;
    const glassMesh = new THREE.Mesh(glassGeometry, materials.glass);
    glassMesh.renderOrder = 2;
    panel.add(frameMesh, glassMesh);
    panel.userData = { frame, z: (i - (panes - 1) / 2) * 0.024, y: 0.02 };
    segment.closed.push(uc - L / 2 + pw / 2 + (i * (L - pw)) / (panes - 1));
    segment.stacked.push(uc - L / 2 + pw / 2 + i * 0.035);
    segment.panels.push(panel);
    group.add(panel);
  }
  segment.geometries = [frameGeometry, glassGeometry];
  parts.sliding.push(segment);
}

function buildFixed(batch, materials, frame, uc, L, H) {
  const panes = panesForSpan(L);
  const pw = L / panes;
  batch.box(materials.frame, L, 0.05, 0.06, uc, H - 0.025, 0, frame);
  batch.box(materials.frame, L, 0.05, 0.06, uc, 0.025, 0, frame);
  for (let i = 0; i <= panes; i++) batch.box(materials.frame, 0.04, H - 0.1, 0.06, uc - L / 2 + i * pw, H / 2, 0, frame);
  for (let i = 0; i < panes; i++) batch.box(materials.glass, pw - 0.04, H - 0.1, 0.01, uc - L / 2 + pw * (i + 0.5), H / 2, 0, frame);
}

function buildZip(group, batch, materials, frame, parts, uc, L, H) {
  batch.box(materials.frame, L, ZIP_CASSETTE, ZIP_CASSETTE, uc, H - ZIP_CASSETTE / 2, 0.02, frame);
  for (const s of [-1, 1]) batch.box(materials.frame, 0.045, H - ZIP_CASSETTE, 0.06, uc + s * (L / 2 - 0.0225), (H - ZIP_CASSETTE) / 2, 0.02, frame);
  const fabricGeometry = new THREE.PlaneGeometry(L - 0.09, 1).translate(0, -0.5, 0);
  const barGeometry = new THREE.BoxGeometry(L - 0.07, 0.035, 0.04);
  const fabric = new THREE.Mesh(fabricGeometry, materials.fabric);
  const bar = new THREE.Mesh(barGeometry, materials.frame);
  fabric.castShadow = true;
  bar.castShadow = true;
  for (const mesh of [fabric, bar]) {
    mesh.matrixAutoUpdate = false;
    group.add(mesh);
  }
  parts.zips.push({ fabric, bar, frame, uc, top: H - ZIP_CASSETTE, travel: H - ZIP_CASSETTE - 0.03, geometries: [fabricGeometry, barGeometry] });
}

const tmp = new THREE.Object3D();
const tmpMatrix = new THREE.Matrix4();

/** Applies louver angle and openings to an existing structure. */
export function applyDynamic(group, state) {
  const parts = group?.userData.parts;
  if (!parts) return;
  const angle = THREE.MathUtils.degToRad(state.roof);
  parts.bladeData.forEach((blade, index) => {
    tmp.position.set(blade.x, parts.bladeY, blade.z);
    tmp.rotation.set(0, 0, angle);
    tmp.scale.set(1, 1, blade.length);
    tmp.updateMatrix();
    parts.blades.setMatrixAt(index, tmp.matrix);
  });
  parts.blades.instanceMatrix.needsUpdate = true;
  parts.blades.computeBoundingSphere();

  const slide = Math.min(1, state.slidingOpen / SLIDING_OPEN_MAX);
  for (const segment of parts.sliding) {
    segment.panels.forEach((panel, i) => {
      const u = segment.closed[i] + (segment.stacked[i] - segment.closed[i]) * slide;
      panel.matrixAutoUpdate = false;
      panel.matrix.copy(panel.userData.frame).multiply(tmpMatrix.makeTranslation(u, panel.userData.y, panel.userData.z));
      panel.matrixWorldNeedsUpdate = true;
    });
  }

  const drop = 1 - state.zipOpen / 100;
  for (const zip of parts.zips) {
    const length = zip.travel * drop;
    const visible = length > 0.01;
    zip.fabric.visible = visible;
    zip.bar.visible = visible;
    zip.fabric.matrix.copy(zip.frame).multiply(tmpMatrix.compose(new THREE.Vector3(zip.uc, zip.top, 0.02), tmp.quaternion.identity(), new THREE.Vector3(1, Math.max(length, 0.001), 1)));
    zip.bar.matrix.copy(zip.frame).multiply(tmpMatrix.makeTranslation(zip.uc, zip.top - length - 0.0175, 0.02));
    zip.fabric.matrixWorldNeedsUpdate = true;
    zip.bar.matrixWorldNeedsUpdate = true;
  }
}

export function disposePergola(group) {
  if (!group) return;
  const parts = group.userData.parts;
  group.traverse((node) => {
    // Shared blade geometry and materials belong to the engine.
    if (node.isMesh && node !== parts?.blades && !node.geometry.userData.shared) node.geometry.dispose();
  });
  parts?.blades?.dispose();
}

export { bladeGeometry };
