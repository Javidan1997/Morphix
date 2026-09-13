import * as THREE from 'three';

/**
 * Effects translate an option's value into a change on the loaded model.
 *
 * They deliberately mutate the existing scene rather than rebuilding it. A
 * shopper dragging a slider fires dozens of changes a second, and rebuilding
 * geometry on each one is what makes most configurators feel broken.
 */

/** Collects nodes by name, accepting a string, an array, or a /regex/. */
function resolveNodes(root, selector) {
  if (!selector) return [];
  const matches = [];
  const names = Array.isArray(selector) ? selector : [selector];
  const regexes = names.filter(n => n instanceof RegExp);
  const plain = new Set(names.filter(n => typeof n === 'string'));
  root.traverse(node => {
    if (plain.has(node.name) || regexes.some(re => re.test(node.name))) matches.push(node);
  });
  return matches;
}

/** Collects materials, either by material name or from matched nodes. */
function resolveMaterials(root, effect) {
  const materials = new Set();
  if (effect.materials) {
    const names = Array.isArray(effect.materials) ? effect.materials : [effect.materials];
    const plain = new Set(names.filter(n => typeof n === 'string'));
    const regexes = names.filter(n => n instanceof RegExp);
    root.traverse(node => {
      if (!node.isMesh) return;
      for (const material of toArray(node.material)) {
        if (plain.has(material.name) || regexes.some(re => re.test(material.name))) materials.add(material);
      }
    });
  }
  for (const node of resolveNodes(root, effect.nodes)) {
    node.traverse(child => {
      if (child.isMesh) for (const material of toArray(child.material)) materials.add(material);
    });
  }
  // No selector at all means "everything", which is the common case for a
  // single-material product.
  if (!effect.nodes && !effect.materials) {
    root.traverse(node => {
      if (node.isMesh) for (const material of toArray(node.material)) materials.add(material);
    });
  }
  return [...materials];
}

const toArray = value => (Array.isArray(value) ? value : [value]);

/** Maps a range option's value onto the effect's output range. */
function mapRange(value, option, effect) {
  const from = effect.from ?? option.min;
  const to = effect.to ?? option.max;
  const span = option.max - option.min || 1;
  const t = (Number(value) - option.min) / span;
  return from + (to - from) * t;
}

const EFFECT_HANDLERS = {
  /** Recolours matched materials. Colour comes from the effect or the choice. */
  materialColor(root, effect, { value, option, choice }) {
    const color = effect.color || choice?.color || value;
    if (!color) return;
    for (const material of resolveMaterials(root, effect)) {
      if (material.color) material.color.set(color);
      if (effect.metalness !== undefined) material.metalness = effect.metalness;
      if (effect.roughness !== undefined) material.roughness = effect.roughness;
      material.needsUpdate = true;
    }
  },

  /** Shows or hides parts. Inverted by `whenFalse` for "remove X" toggles. */
  visibility(root, effect, { value, option, choice }) {
    let visible;
    if (option.type === 'toggle') visible = effect.invert ? !value : Boolean(value);
    else visible = choice ? effect.nodesFor?.[choice.id] !== undefined || true : true;
    for (const node of resolveNodes(root, effect.nodes)) node.visible = visible;
    // For select/swatch, show only the group matching the chosen id.
    if (effect.nodesFor && choice) {
      for (const [id, selector] of Object.entries(effect.nodesFor)) {
        for (const node of resolveNodes(root, selector)) node.visible = id === choice.id;
      }
    }
  },

  /** Moves, scales or rotates a part. Rotation is authored in degrees. */
  transform(root, effect, { value, option }) {
    const nodes = resolveNodes(root, effect.nodes);
    if (!nodes.length) return;
    const property = effect.property || 'scale';
    const axis = effect.axis || 'y';
    let amount = option.type === 'range' ? mapRange(value, option, effect) : Number(value);
    if (property === 'rotation') amount = THREE.MathUtils.degToRad(amount);
    for (const node of nodes) {
      if (!node.userData.__base) {
        node.userData.__base = {
          position: node.position.clone(),
          scale: node.scale.clone(),
          rotation: node.rotation.clone(),
        };
      }
      const base = node.userData.__base;
      if (property === 'scale') node[property][axis] = base.scale[axis] * amount;
      else if (property === 'position') node[property][axis] = base.position[axis] + amount;
      else node.rotation[axis] = base.rotation[axis] + amount;
    }
  },

  /** Escape hatch: run your own function against the model. */
  custom(root, effect, context) {
    effect.apply?.(root, context);
  },
};

/**
 * Applies one option's current value to the model.
 * A choice may override the option-level effect, which is how a single control
 * can drive different parts per selection.
 */
export function applyOption(root, option, value) {
  const choice = option.choices?.find(c => c.id === value) || null;
  const effects = [];
  if (choice?.effect) effects.push(choice.effect);
  else if (option.effect) effects.push(option.effect);
  for (const effect of effects) {
    const handler = EFFECT_HANDLERS[effect.type];
    if (!handler) {
      console.warn(`[configurator] unknown effect type "${effect.type}" on option "${option.id}"`);
      continue;
    }
    handler(root, effect, { value, option, choice });
  }
}

/** Applies every option — used on load and after any structural change. */
export function applyAll(root, config, state) {
  for (const option of config.options) applyOption(root, option, state[option.id]);
}
