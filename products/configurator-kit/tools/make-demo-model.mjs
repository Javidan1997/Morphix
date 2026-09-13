/**
 * Generates the demo chair used by the example config.
 *
 * The kit ships an original, procedurally generated model so there is nothing
 * to license and nothing to attribute. Run:
 *
 *   node tools/make-demo-model.mjs
 *
 * Node names here are what examples/chair.config.js targets, so if you rename
 * one, update the config too.
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'models', 'chair.glb');

/** One axis-aligned box: 24 verts (flat normals per face), 36 indices. */
function box(w, h, d, [cx, cy, cz]) {
  const x = w / 2, y = h / 2, z = d / 2;
  const faces = [
    { n: [0, 0, 1], v: [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]] },
    { n: [0, 0, -1], v: [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]] },
    { n: [1, 0, 0], v: [[x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z]] },
    { n: [-1, 0, 0], v: [[-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z]] },
    { n: [0, 1, 0], v: [[-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]] },
    { n: [0, -1, 0], v: [[-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z]] },
  ];
  const positions = [], normals = [], indices = [];
  faces.forEach((face, f) => {
    face.v.forEach(([vx, vy, vz]) => {
      positions.push(vx + cx, vy + cy, vz + cz);
      normals.push(...face.n);
    });
    const o = f * 4;
    indices.push(o, o + 1, o + 2, o, o + 2, o + 3);
  });
  return { positions, normals, indices };
}

/** Merges boxes into one mesh so each named part is a single draw call. */
function merge(boxes) {
  const positions = [], normals = [], indices = [];
  for (const b of boxes) {
    const offset = positions.length / 3;
    positions.push(...b.positions);
    normals.push(...b.normals);
    indices.push(...b.indices.map(i => i + offset));
  }
  return { positions, normals, indices };
}

// ---- the chair -------------------------------------------------------
// Units are metres. Seat sits at y = 0.42, legs run from the floor up to it.
const LEG = 0.42;
const parts = [
  { name: 'Seat', material: 1, geo: merge([box(0.52, 0.07, 0.5, [0, LEG + 0.035, 0])]) },
  { name: 'Cushion', material: 1, geo: merge([box(0.46, 0.05, 0.44, [0, LEG + 0.095, 0])]) },
  { name: 'Backrest_High', material: 1, geo: merge([box(0.5, 0.5, 0.06, [0, LEG + 0.32, -0.22])]) },
  { name: 'Backrest_Low', material: 1, geo: merge([box(0.5, 0.26, 0.06, [0, LEG + 0.2, -0.22])]) },
  {
    name: 'Legs', material: 0, geo: merge([
      box(0.05, LEG, 0.05, [-0.22, LEG / 2, 0.2]),
      box(0.05, LEG, 0.05, [0.22, LEG / 2, 0.2]),
      box(0.05, LEG, 0.05, [-0.22, LEG / 2, -0.2]),
      box(0.05, LEG, 0.05, [0.22, LEG / 2, -0.2]),
    ]),
  },
  {
    name: 'Armrests', material: 0, geo: merge([
      box(0.05, 0.2, 0.05, [-0.28, LEG + 0.13, -0.05]),
      box(0.05, 0.2, 0.05, [0.28, LEG + 0.13, -0.05]),
      box(0.06, 0.05, 0.42, [-0.28, LEG + 0.25, 0.02]),
      box(0.06, 0.05, 0.42, [0.28, LEG + 0.25, 0.02]),
    ]),
  },
];

// ---- pack into a GLB -------------------------------------------------
const chunks = [];
let byteLength = 0;
const bufferViews = [];
const accessors = [];

function pushView(data, target) {
  const pad = (4 - (byteLength % 4)) % 4;
  if (pad) { chunks.push(Buffer.alloc(pad)); byteLength += pad; }
  bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: data.length, target });
  chunks.push(data);
  byteLength += data.length;
  return bufferViews.length - 1;
}

const meshes = [];
const nodes = [];
for (const part of parts) {
  const { positions, normals, indices } = part.geo;
  const pos = Buffer.from(new Float32Array(positions).buffer);
  const nor = Buffer.from(new Float32Array(normals).buffer);
  const idx = Buffer.from(new Uint16Array(indices).buffer);

  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < positions.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      min[k] = Math.min(min[k], positions[i + k]);
      max[k] = Math.max(max[k], positions[i + k]);
    }
  }

  const posView = pushView(pos, 34962);
  const norView = pushView(nor, 34962);
  const idxView = pushView(idx, 34963);

  accessors.push({ bufferView: posView, componentType: 5126, count: positions.length / 3, type: 'VEC3', min, max });
  accessors.push({ bufferView: norView, componentType: 5126, count: normals.length / 3, type: 'VEC3' });
  accessors.push({ bufferView: idxView, componentType: 5123, count: indices.length, type: 'SCALAR' });
  const base = accessors.length - 3;

  meshes.push({
    name: part.name,
    primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, material: part.material }],
  });
  nodes.push({ name: part.name, mesh: meshes.length - 1 });
}

const json = {
  asset: { version: '2.0', generator: 'configurator-kit demo generator' },
  scene: 0,
  scenes: [{ name: 'Chair', nodes: nodes.map((_, i) => i) }],
  nodes,
  meshes,
  materials: [
    { name: 'Frame', pbrMetallicRoughness: { baseColorFactor: [0.25, 0.26, 0.28, 1], metallicFactor: 0.6, roughnessFactor: 0.45 } },
    { name: 'Upholstery', pbrMetallicRoughness: { baseColorFactor: [0.78, 0.75, 0.7, 1], metallicFactor: 0, roughnessFactor: 0.9 } },
  ],
  accessors,
  bufferViews,
  buffers: [{ byteLength }],
};

const bin = Buffer.concat(chunks);
const jsonBuf = Buffer.from(JSON.stringify(json), 'utf8');
const jsonChunk = Buffer.concat([jsonBuf, Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20)]);
const binChunk = Buffer.concat([bin, Buffer.alloc((4 - (bin.length % 4)) % 4)]);

const total = 12 + 8 + jsonChunk.length + 8 + binChunk.length;
const glb = Buffer.alloc(total);
glb.writeUInt32LE(0x46546c67, 0);
glb.writeUInt32LE(2, 4);
glb.writeUInt32LE(total, 8);
glb.writeUInt32LE(jsonChunk.length, 12);
glb.writeUInt32LE(0x4e4f534a, 16);
jsonChunk.copy(glb, 20);
let o = 20 + jsonChunk.length;
glb.writeUInt32LE(binChunk.length, o);
glb.writeUInt32LE(0x004e4942, o + 4);
binChunk.copy(glb, o + 8);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, glb);
console.log(`wrote ${OUT} (${(total / 1024).toFixed(1)} KB, ${parts.length} named parts)`);
