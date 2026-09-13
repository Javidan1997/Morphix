import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';
import { normalizeConfig, initialState, priceFor } from './schema.js';
import { applyAll, applyOption } from './effects.js';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function disposeObject(root) {
  const materials = new Set();
  const textures = new Set();
  root.traverse(node => {
    if (!node.isMesh) return;
    node.geometry?.dispose();
    for (const material of Array.isArray(node.material) ? node.material : [node.material]) {
      if (material) materials.add(material);
    }
  });
  for (const material of materials) {
    for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    material.dispose();
  }
  for (const texture of textures) texture.dispose();
}

/**
 * Creates a configurator inside `container`.
 *
 * Rendering is on demand: the loop runs only while something is actually
 * moving (a tween, an option easing to its new value, the idle orbit) and
 * stops itself otherwise, so an idle configurator costs no frames.
 *
 * @returns {Promise<object>} controller — see README for the full API
 */
export async function createConfigurator({ container, config: rawConfig, onProgress, onChange }) {
  if (!container) throw new Error('createConfigurator needs a container element');
  const config = normalizeConfig(rawConfig);
  const state = initialState(config);

  const scene = new THREE.Scene();
  scene.background = config.background ? new THREE.Color(config.background) : null;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: !config.background });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = config.exposure;
  renderer.shadowMap.enabled = config.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;touch-action:none';
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(config.camera.fov, 1, 0.01, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = false;
  controls.maxPolarAngle = Math.PI / 2 - 0.02;

  const key = new THREE.DirectionalLight(0xfff6ea, 2.4);
  key.position.set(-3, 6, 4);
  key.castShadow = config.shadows;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.normalBias = 0.02;
  scene.add(key, new THREE.HemisphereLight(0xffffff, 0xb9bfc7, 0.9));

  // Neutral studio IBL. Swap for your own .hdr via config.environment.
  const pmrem = new THREE.PMREMGenerator(renderer);
  let environmentTarget = null;
  if (config.environment === 'studio') {
    const room = new RoomEnvironment();
    environmentTarget = pmrem.fromScene(room, 0.04);
    scene.environment = environmentTarget.texture;
    room.dispose();
  } else if (typeof config.environment === 'string') {
    await new Promise(resolve => {
      new HDRLoader().load(
        config.environment,
        texture => {
          texture.mapping = THREE.EquirectangularReflectionMapping;
          environmentTarget = pmrem.fromEquirectangular(texture);
          scene.environment = environmentTarget.texture;
          texture.dispose();
          resolve();
        },
        undefined,
        () => resolve(),
      );
    });
  }

  let ground = null;
  if (config.shadows) {
    ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
  }

  // ---- load the model -------------------------------------------------
  const loader = new GLTFLoader();
  if (config.dracoPath) {
    const draco = new DRACOLoader();
    draco.setDecoderPath(config.dracoPath);
    loader.setDRACOLoader(draco);
  }
  const gltf = await new Promise((resolve, reject) => {
    loader.load(
      config.model,
      resolve,
      event => { if (event.total) onProgress?.(event.loaded / event.total); },
      () => reject(new Error(`Could not load model: ${config.model}`)),
    );
  });
  onProgress?.(1);

  const model = gltf.scene;
  model.traverse(node => {
    if (!node.isMesh) return;
    node.castShadow = config.shadows;
    node.receiveShadow = config.shadows;
    // Cloning keeps two instances of the same product independent.
    node.material = Array.isArray(node.material)
      ? node.material.map(m => m.clone())
      : node.material.clone();
  });
  scene.add(model);

  // Centre on the floor and frame it, unless the config is explicit.
  const bounds = new THREE.Box3().setFromObject(model);
  const size = bounds.getSize(new THREE.Vector3());
  const center = bounds.getCenter(new THREE.Vector3());
  model.position.sub(new THREE.Vector3(center.x, bounds.min.y, center.z));
  if (ground) ground.position.y = 0;

  const radius = Math.max(size.x, size.y, size.z);
  const fitDistance = (radius / 2) / Math.tan((config.camera.fov * Math.PI) / 360) * 1.6;
  const distance = config.camera.distance ?? fitDistance;
  const target = new THREE.Vector3(
    0,
    config.camera.target ?? size.y * 0.45,
    0,
  );
  controls.target.copy(target);
  camera.position.set(distance * 0.62, config.camera.height ?? size.y * 0.85, distance * 0.78);
  controls.minDistance = config.camera.minDistance ?? radius * 0.6;
  controls.maxDistance = config.camera.maxDistance ?? distance * 2.4;
  controls.update();

  applyAll(model, config, state);

  // ---- render loop ----------------------------------------------------
  let disposed = false;
  let running = false;
  let frame = 0;
  let tween = null;
  let idleAt = performance.now() + config.autoRotateDelay;
  let lastTick = performance.now();
  let autoRotate = config.autoRotate && !prefersReducedMotion();

  // Range options ease toward their target so dragging reads as motion
  // rather than teleporting.
  const shown = {};
  for (const option of config.options) {
    if (option.type === 'range') shown[option.id] = Number(state[option.id]);
  }

  const step = () => {
    if (disposed) { running = false; return; }
    const now = performance.now();
    const delta = Math.min(50, now - lastTick);
    lastTick = now;
    let busy = false;

    if (tween) {
      const t = Math.min(1, (now - tween.start) / tween.duration);
      const e = easeInOut(t);
      camera.position.lerpVectors(tween.from, tween.to, e);
      controls.target.lerpVectors(tween.fromTarget, tween.toTarget, e);
      if (t >= 1) tween = null; else busy = true;
    }

    for (const option of config.options) {
      if (option.type !== 'range') continue;
      const goal = Number(state[option.id]);
      const current = shown[option.id];
      const diff = goal - current;
      if (Math.abs(diff) > (option.max - option.min) * 0.001) {
        shown[option.id] = current + diff * 0.2;
        applyOption(model, option, shown[option.id]);
        busy = true;
      } else if (current !== goal) {
        shown[option.id] = goal;
        applyOption(model, option, goal);
      }
    }

    if (autoRotate && !tween && now > idleAt) {
      const offset = camera.position.clone().sub(controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.00022 * delta);
      camera.position.copy(controls.target).add(offset);
      busy = true;
    }

    if (controls.update()) busy = true;
    renderer.render(scene, camera);
    if (busy) frame = requestAnimationFrame(step);
    else running = false;
  };

  const wake = () => {
    if (disposed || running) return;
    running = true;
    lastTick = performance.now();
    frame = requestAnimationFrame(step);
  };
  const nudge = () => { idleAt = performance.now() + config.autoRotateDelay; wake(); };

  controls.addEventListener('start', () => { tween = null; idleAt = Infinity; });
  controls.addEventListener('end', () => { idleAt = performance.now() + config.autoRotateDelay; wake(); });
  controls.addEventListener('change', wake);

  const resize = () => {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    wake();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();
  wake();

  // ---- public API -----------------------------------------------------
  const controller = {
    /** Change one option and re-apply it to the model. */
    set(id, value) {
      const option = config.options.find(o => o.id === id);
      if (!option) { console.warn(`[configurator] no option "${id}"`); return controller; }
      state[id] = value;
      // Ranges are eased by the loop; everything else lands immediately.
      if (option.type !== 'range') applyOption(model, option, value);
      nudge();
      onChange?.(controller.getState(), controller.price());
      return controller;
    },
    getState: () => ({ ...state }),
    getConfig: () => config,
    price: () => priceFor(config, state),

    /** Move the camera to a named view from config.views. */
    setView(name) {
      const view = config.views?.[name];
      if (!view) return controller;
      const to = new THREE.Vector3(...view.position);
      const toTarget = new THREE.Vector3(...(view.target || [0, target.y, 0]));
      if (prefersReducedMotion()) {
        camera.position.copy(to);
        controls.target.copy(toTarget);
        controls.update();
        wake();
        return controller;
      }
      tween = {
        from: camera.position.clone(), to,
        fromTarget: controls.target.clone(), toTarget,
        start: performance.now(), duration: 800,
      };
      idleAt = performance.now() + config.autoRotateDelay + 800;
      wake();
      return controller;
    },

    setAutoRotate(enabled) {
      autoRotate = enabled && !prefersReducedMotion();
      if (autoRotate) nudge();
      return controller;
    },
    get autoRotate() { return autoRotate; },

    /** Renders and reads back in one go, so no preserveDrawingBuffer cost. */
    snapshot(filename = 'configuration.png') {
      renderer.render(scene, camera);
      return new Promise(resolve => {
        renderer.domElement.toBlob(blob => {
          if (!blob) { resolve(null); return; }
          if (filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            // Firefox and Safari only honour a download on an attached anchor.
            document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }
          resolve(blob);
        }, 'image/png');
      });
    },

    /** Everything the shopper chose, ready to attach to an order. */
    summary() {
      return config.options.map(option => {
        const value = state[option.id];
        const choice = option.choices?.find(c => c.id === value);
        return {
          id: option.id,
          label: option.label,
          value,
          display: choice ? choice.label : option.type === 'toggle' ? (value ? 'Yes' : 'No') : `${value}${option.unit}`,
        };
      });
    },

    dispose() {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      disposeObject(scene);
      environmentTarget?.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };

  return controller;
}
