/**
 * Configuration schema.
 *
 * A configurator is described entirely by a plain object: which model to load,
 * how to light and frame it, and a list of options. Each option declares the
 * control a shopper sees and the effect it has on the scene, so adding an
 * option never means touching the engine.
 */

export const OPTION_TYPES = ['swatch', 'select', 'toggle', 'range'];

/** Effects an option can have on the loaded model. */
export const EFFECTS = ['materialColor', 'visibility', 'transform', 'custom'];

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Fills in defaults and fails loudly on anything the engine could not honour.
 * Called once at startup — a broken config should be obvious immediately, not
 * a silently dead control three clicks into a demo.
 */
export function normalizeConfig(input) {
  if (!isObject(input)) throw new Error('config must be an object');
  if (!input.model || typeof input.model !== 'string') {
    throw new Error('config.model must be a URL string pointing at a .glb/.gltf file');
  }

  const config = {
    model: input.model,
    name: input.name || 'Product',
    // Draco-compressed models need a decoder; point this at your copy if you
    // compress your assets (recommended — see README, "Preparing models").
    dracoPath: input.dracoPath || null,
    background: input.background ?? '#eceef1',
    environment: input.environment || 'studio',
    exposure: input.exposure ?? 1,
    shadows: input.shadows !== false,
    autoRotate: input.autoRotate !== false,
    autoRotateDelay: input.autoRotateDelay ?? 4000,
    // Auto-frames the model when null, which is almost always what you want.
    camera: {
      fov: input.camera?.fov ?? 35,
      distance: input.camera?.distance ?? null,
      height: input.camera?.height ?? null,
      target: input.camera?.target ?? null,
      minDistance: input.camera?.minDistance ?? null,
      maxDistance: input.camera?.maxDistance ?? null,
    },
    views: input.views || null,
    price: isObject(input.price) ? { base: input.price.base ?? 0, currency: input.price.currency || 'USD' } : null,
    options: [],
  };

  const options = Array.isArray(input.options) ? input.options : [];
  const seen = new Set();
  for (const [index, raw] of options.entries()) {
    if (!isObject(raw)) throw new Error(`options[${index}] must be an object`);
    if (!raw.id) throw new Error(`options[${index}] is missing an id`);
    if (seen.has(raw.id)) throw new Error(`duplicate option id "${raw.id}"`);
    seen.add(raw.id);
    if (!OPTION_TYPES.includes(raw.type)) {
      throw new Error(`options[${index}] ("${raw.id}") has unknown type "${raw.type}". Use one of: ${OPTION_TYPES.join(', ')}`);
    }
    config.options.push(normalizeOption(raw, index));
  }
  return config;
}

function normalizeOption(raw, index) {
  const option = {
    id: raw.id,
    type: raw.type,
    label: raw.label || raw.id,
    help: raw.help || '',
    effect: raw.effect || null,
    price: raw.price ?? 0,
  };

  if (raw.type === 'range') {
    option.min = raw.min ?? 0;
    option.max = raw.max ?? 1;
    option.step = raw.step ?? 0.01;
    option.unit = raw.unit || '';
    option.value = raw.value ?? option.min;
    if (option.min >= option.max) throw new Error(`options[${index}] ("${raw.id}"): min must be less than max`);
    return option;
  }

  if (raw.type === 'toggle') {
    option.value = Boolean(raw.value);
    return option;
  }

  // swatch and select both choose from a list.
  const choices = Array.isArray(raw.choices) ? raw.choices : [];
  if (!choices.length) throw new Error(`options[${index}] ("${raw.id}") needs a choices array`);
  option.choices = choices.map((choice, i) => {
    if (!isObject(choice)) throw new Error(`options[${index}].choices[${i}] must be an object`);
    if (!choice.id) throw new Error(`options[${index}].choices[${i}] is missing an id`);
    return {
      id: choice.id,
      label: choice.label || choice.id,
      color: choice.color || null,
      price: choice.price ?? 0,
      effect: choice.effect || null,
    };
  });
  option.value = raw.value ?? option.choices[0].id;
  return option;
}

/** The starting state, derived from each option's declared default. */
export function initialState(config) {
  const state = {};
  for (const option of config.options) state[option.id] = option.value;
  return state;
}

/** Base price plus whatever the current selections add. */
export function priceFor(config, state) {
  if (!config.price) return null;
  let total = config.price.base;
  for (const option of config.options) {
    const value = state[option.id];
    if (option.type === 'toggle') {
      if (value) total += option.price;
    } else if (option.type === 'range') {
      total += option.price * Number(value || 0);
    } else {
      const choice = option.choices.find(c => c.id === value);
      total += option.price + (choice?.price ?? 0);
    }
  }
  return Math.round(total * 100) / 100;
}
