/**
 * Example configuration — a lounge chair.
 *
 * This one file drives the whole configurator: the 3D scene, every control in
 * the panel, and the price. Copy it, point `model` at your own .glb, rename
 * the node/material selectors to match your file, and you have a new product.
 *
 * Tip: open your .glb in https://gltf-viewer.donmccurdy.com to read the node
 * and material names you need for the selectors below.
 */
export default {
  name: 'Lounge Chair',
  model: '/models/chair.glb',

  background: '#eceef1',
  environment: 'studio',   // or a URL to your own .hdr
  exposure: 1.05,
  shadows: true,
  autoRotate: true,

  camera: { fov: 35 },

  // Named camera positions, rendered as buttons over the stage.
  views: {
    front: { position: [0, 0.75, 2.4], target: [0, 0.5, 0] },
    side: { position: [2.4, 0.7, 0], target: [0, 0.5, 0] },
    detail: { position: [0.9, 0.95, 1.1], target: [0, 0.6, 0] },
  },

  price: { base: 480, currency: 'USD' },

  options: [
    {
      id: 'upholstery',
      type: 'swatch',
      label: 'Upholstery',
      help: 'Recolours every mesh using the "Upholstery" material.',
      effect: { type: 'materialColor', materials: 'Upholstery' },
      value: 'sand',
      choices: [
        { id: 'sand', label: 'Sand', color: '#c7bfb1' },
        { id: 'olive', label: 'Olive', color: '#6f7358', price: 40 },
        { id: 'rust', label: 'Rust', color: '#9c5a3c', price: 40 },
        { id: 'ink', label: 'Ink', color: '#2d3239', price: 60 },
      ],
    },
    {
      id: 'frame',
      type: 'swatch',
      label: 'Frame finish',
      effect: { type: 'materialColor', materials: 'Frame' },
      value: 'graphite',
      choices: [
        { id: 'graphite', label: 'Graphite', color: '#3f4348' },
        { id: 'brass', label: 'Brass', color: '#b08d57', price: 85 },
        { id: 'oak', label: 'Oak', color: '#b28e5d', price: 55 },
      ],
    },
    {
      id: 'back',
      type: 'select',
      label: 'Backrest',
      // One control, two part groups: only the chosen group stays visible.
      effect: {
        type: 'visibility',
        nodesFor: { high: 'Backrest_High', low: 'Backrest_Low' },
      },
      value: 'high',
      choices: [
        { id: 'high', label: 'High back' },
        { id: 'low', label: 'Low back', price: -45 },
      ],
    },
    {
      id: 'armrests',
      type: 'toggle',
      label: 'Armrests',
      effect: { type: 'visibility', nodes: 'Armrests' },
      value: true,
      price: 120,
    },
    {
      id: 'height',
      type: 'range',
      label: 'Seat height',
      help: 'Scales the "Legs" group between 90% and 125% of its modelled height.',
      effect: { type: 'transform', nodes: 'Legs', property: 'scale', axis: 'y', from: 0.9, to: 1.25 },
      min: 38, max: 52, step: 1, unit: 'cm',
      value: 42,
    },
  ],
};
