// Three.js viewer for the pergola configurator.
//
// Performance model:
// - Renders on demand. The rAF loop runs only while something moves (camera
//   damping, a tween, an opening animating) and stops itself afterwards.
// - Pauses completely while the canvas is offscreen or the tab is hidden.
// - Pixel ratio and shadow resolution follow a device tier, and the pixel
//   ratio steps down if sustained frames are slow.
// - The shadow map only re-renders when geometry or the sun changes, not on
//   every orbit frame.
// - Environment and accessory GLBs load on first use and are cached.
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { FINISHES, normalizeConfig } from "../configModel.js";
import { PROFILE, applyDynamic, bladeGeometry, buildPergola, disposePergola } from "./buildPergola.js";

const ASSETS = "/pergola-configurators/v2/";
// Source placements from the original configurator, relative to the product
// front edge (see git history of the retired src/components/pergola/PergolaScene.jsx).
const ENVIRONMENTS = {
  patio: { file: "env-patio.glb", z: -0.48, rotation: Math.PI * 1.5, scale: 1 },
  pool: { file: "env-pool.glb", z: 1.5, rotation: Math.PI / 2, scale: 0.9 },
  deck: { file: "env-deck.glb", z: 1.35, rotation: Math.PI / 2, scale: 1 },
  rooftop: { file: "env-rooftop.glb", z: 2, rotation: Math.PI / 2, scale: 1.5 },
};
const STRUCTURAL_KEYS = ["width", "depth", "height", "mount"];
const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const hex = (id) => FINISHES.find((f) => f.id === id)?.hex || FINISHES[0].hex;

export function detectTier() {
  const coarse = matchMedia("(pointer: coarse)").matches;
  const memory = navigator.deviceMemory || 8;
  const cores = navigator.hardwareConcurrency || 8;
  // Phones have dense screens, and thin louvers alias badly without MSAA, so
  // anti-aliasing stays on everywhere and resolution goes to 2x. Only genuinely
  // weak devices start lower. Rendering is on demand and the pixel ratio
  // adapts during motion (see tick), so a still image is always sharp.
  const low = memory <= 2 || (cores <= 4 && memory <= 3);
  return {
    low,
    coarse,
    maxPixelRatio: low ? 1.5 : 2,
    shadowSize: low ? 1024 : 2048,
    antialias: true,
  };
}

export function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

export class PergolaViewer {
  constructor(host, { config, onStatus = () => {}, onSceneStatus = () => {}, label = "" } = {}) {
    this.host = host;
    this.onStatus = onStatus;
    this.onSceneStatus = onSceneStatus;
    this.tier = detectTier();
    this.config = normalizeConfig(config);
    this.shown = { roof: this.config.roof, slidingOpen: this.config.slidingOpen, zipOpen: this.config.zipOpen };
    this.cache = new Map();
    this.disposed = false;
    this.visible = true;
    this.frame = 0;
    this.slowFrames = 0;
    this.view = "overview";

    const renderer = new THREE.WebGLRenderer({ antialias: this.tier.antialias, powerPreference: "high-performance", alpha: false });
    this.targetPixelRatio = Math.min(window.devicePixelRatio || 1, this.tier.maxPixelRatio);
    this.pixelRatio = this.targetPixelRatio;
    renderer.setPixelRatio(this.pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.domElement.className = "pc-canvas";
    renderer.domElement.setAttribute("role", "img");
    renderer.domElement.setAttribute("aria-label", label);
    this.renderer = renderer;
    host.appendChild(renderer.domElement);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 1, 0.05, 400);
    this.controls = new OrbitControls(this.camera, renderer.domElement);
    Object.assign(this.controls, { enableDamping: true, dampingFactor: 0.09, enablePan: false, rotateSpeed: 0.7, zoomSpeed: 0.8, maxPolarAngle: Math.PI / 2 - 0.05 });
    // Vertical swipes keep scrolling the page on touch screens; sideways
    // drags rotate the model. Zoom has buttons, so pinch is not required.
    renderer.domElement.style.touchAction = "pan-y";
    this.controls.addEventListener("start", () => { this.tween = null; this.requestRender(); });
    this.controls.addEventListener("change", () => this.requestRender());

    this.materials = this.createMaterials();
    this.createLights();

    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    this.studioEnv = pmrem.fromScene(room, 0.04).texture;
    room.dispose();
    pmrem.dispose();

    this.floor = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshStandardMaterial({ color: "#d9dad7", roughness: 1 }));
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.y = -0.002;
    this.floor.receiveShadow = true;
    this.scene.add(this.floor);

    // Soft contact shadow: grounds the structure where the shadow map is too
    // coarse to show occlusion at the post bases.
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 128;
    const ctx = shadowCanvas.getContext("2d");
    const gradient = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    gradient.addColorStop(0, "rgba(0,0,0,0.55)");
    gradient.addColorStop(0.55, "rgba(0,0,0,0.28)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    this.contactTexture = new THREE.CanvasTexture(shadowCanvas);
    this.contact = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: this.contactTexture, transparent: true, depthWrite: false, opacity: 0.6, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2 }));
    this.contact.rotation.x = -Math.PI / 2;
    this.contact.position.y = 0.004;
    this.contact.renderOrder = 1;
    this.scene.add(this.contact);
    this.animationRate = 9;

    this.onContextLost = (event) => { event.preventDefault(); this.onStatus("error"); };
    renderer.domElement.addEventListener("webglcontextlost", this.onContextLost);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(host);
    this.intersection = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible) this.requestRender();
    });
    this.intersection.observe(host);
    this.onVisibility = () => { if (!document.hidden) this.requestRender(); };
    document.addEventListener("visibilitychange", this.onVisibility);

    this.rebuild();
    this.applyScene();
    this.setView("overview", { instant: true });
    this.resize();
    // Compile shaders off the main thread where KHR_parallel_shader_compile is
    // available, so the first frame does not stall input.
    // Every material is compiled up front, including ones the default design
    // does not use (glass, fabric, panels, wall), so choosing an option later
    // never stalls the next paint on a shader compile.
    const warmup = new THREE.Group();
    const tiny = new THREE.BoxGeometry(0.001, 0.001, 0.001);
    for (const material of Object.values(this.materials)) if (material?.isMaterial) warmup.add(new THREE.Mesh(tiny, material));
    warmup.position.y = -50;
    this.scene.add(warmup);
    const compile = renderer.compileAsync ? renderer.compileAsync(this.scene, this.camera) : Promise.resolve();
    compile.catch(() => {}).then(() => {
      this.scene.remove(warmup);
      tiny.dispose();
      if (this.disposed) return;
      this.onStatus("ready");
      this.requestRender();
    });
  }

  createMaterials() {
    const finish = hex(this.config.finish);
    const m = {
      frame: new THREE.MeshStandardMaterial({ color: finish, roughness: 0.52, metalness: 0.35 }),
      trim: new THREE.MeshStandardMaterial({ color: "#1d1f21", roughness: 0.7, metalness: 0.2 }),
      blade: new THREE.MeshStandardMaterial({ color: finish, roughness: 0.46, metalness: 0.4 }),
      glass: new THREE.MeshPhysicalMaterial({ color: "#dfeef0", roughness: 0.04, metalness: 0, transparent: true, opacity: 0.2, depthWrite: false, side: THREE.DoubleSide, envMapIntensity: 1.4 }),
      fabric: new THREE.MeshStandardMaterial({ color: "#4f5153", roughness: 1, transparent: true, opacity: 0.86, side: THREE.DoubleSide }),
      panel: new THREE.MeshStandardMaterial({ color: finish, roughness: 0.62, metalness: 0.2 }),
      led: new THREE.MeshStandardMaterial({ color: "#fff4e2", emissive: "#ffd7a1", emissiveIntensity: 0, roughness: 0.4 }),
      wall: new THREE.MeshStandardMaterial({ color: "#d9d6cf", roughness: 0.95 }),
      coping: new THREE.MeshStandardMaterial({ color: "#bdb9b0", roughness: 0.9 }),
      bladeGeometry: bladeGeometry(),
    };
    m.frame.userData.bevel = true;
    m.panel.userData.bevel = true;
    m.wall.userData.bevel = false;
    m.bladeGeometry.userData.shared = true;
    return m;
  }

  createLights() {
    this.hemi = new THREE.HemisphereLight("#ffffff", "#b9b6ae", 0.6);
    this.sun = new THREE.DirectionalLight("#fff6e8", 2.6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(this.tier.shadowSize, this.tier.shadowSize);
    this.sun.shadow.normalBias = 0.02;
    this.sun.shadow.bias = -0.0004;
    this.sun.shadow.radius = 3;
    this.scene.add(this.hemi, this.sun, this.sun.target);
    // A fixed light count avoids shader recompiles when LEDs toggle.
    this.ledLights = Array.from({ length: 4 }, () => {
      const light = new THREE.PointLight("#ffd7a1", 0, 9, 1.6);
      this.scene.add(light);
      return light;
    });
  }

  // ---- Configuration ------------------------------------------------------
  // Changes are recorded here and applied at most once per animation frame,
  // so dragging a size slider never rebuilds geometry inside the input event.
  setConfig(next) {
    const config = normalizeConfig(next);
    const previous = this.config;
    this.config = config;
    const pending = (this.pending ||= {});
    const sized = ["width", "depth", "height"].some((key) => previous[key] !== config[key]);
    if (STRUCTURAL_KEYS.some((key) => previous[key] !== config[key]) || JSON.stringify(previous.sides) !== JSON.stringify(config.sides)) pending.rebuild = true;
    if (sized) pending.reframe = true;
    if (previous.heaters !== config.heaters) pending.heaters = true;
    if (previous.environment !== config.environment || previous.time !== config.time) pending.scene = true;
    pending.materials = true;
    this.requestRender();
  }

  flushPending() {
    const pending = this.pending;
    if (!pending) return;
    this.pending = null;
    if (pending.rebuild) this.rebuild();
    else if (pending.heaters) this.placeHeaters();
    if (pending.scene) this.applyScene();
    if (pending.materials) this.applyMaterials();
    if (pending.reframe) {
      this.fitShadow();
      this.setView(this.view, { keepDirection: true, instant: true });
    }
  }

  rebuild() {
    if (this.product) {
      this.scene.remove(this.product);
      disposePergola(this.product);
    }
    this.product = buildPergola(this.config, this.materials);
    this.scene.add(this.product);
    applyDynamic(this.product, { ...this.config, ...this.shown });
    this.applyMaterials();
    this.fitShadow();
    this.placeHeaters();
    if (this.environmentModel) this.positionEnvironment();
  }

  applyMaterials() {
    const c = this.config;
    this.materials.frame.color.set(hex(c.finish));
    this.materials.panel.color.set(hex(c.finish)).offsetHSL(0, 0, 0.04);
    this.materials.blade.color.set(hex(c.blade === "match" ? c.finish : c.blade));
    const night = c.time === "night";
    const level = c.ledLevel / 100;
    const color = c.led === "color" ? new THREE.Color().setHSL(c.ledHue / 360, 0.85, 0.55) : new THREE.Color("#ffd7a1");
    this.materials.led.emissive.copy(color);
    this.materials.led.emissiveIntensity = c.led === "off" ? 0 : (night ? 6 : 1.2) * level;
    const bays = this.product?.userData.parts.bays || [];
    this.ledLights.forEach((light, i) => {
      const bay = bays[i];
      light.color.copy(color);
      // Point lights only read after dark; by day the emissive strip is enough.
      light.intensity = bay && c.led !== "off" && night ? 7 * level : 0;
      if (bay) light.position.set(bay.x, c.height * 0.5, bay.z);
    });
  }

  fitShadow() {
    const { w, d } = this.product.userData.parts.bounds;
    this.contact.scale.set(w * 1.35 + 0.8, d * 1.35 + 0.8, 1);
    const extent = Math.max(w, d) / 2 + 2.2;
    // Late-morning sun from the front left, so shadows fall on visible ground.
    this.sun.position.set(-6, 11, 7.5);
    this.sun.target.position.set(0, 0, 0);
    Object.assign(this.sun.shadow.camera, { left: -extent, right: extent, top: extent, bottom: -extent, near: 0.5, far: 40 });
    this.sun.shadow.camera.updateProjectionMatrix();
    this.renderer.shadowMap.needsUpdate = true;
  }

  // ---- Scene: environment + light ------------------------------------------
  applyScene() {
    const { environment, time } = this.config;
    const night = time === "night";
    const outdoor = environment !== "studio";
    this.floor.visible = !outdoor || !this.environmentModel;
    this.floor.material.color.set(night ? "#2a3240" : "#d9dad7");
    this.hemi.intensity = night ? 0.9 : 0.6;
    this.hemi.color.set(night ? "#8fa4d6" : "#ffffff");
    this.sun.intensity = night ? 0.6 : 2.6;
    this.sun.color.set(night ? "#9fb6e8" : "#fff6e8");
    this.scene.environmentIntensity = night ? 0.38 : outdoor ? 0.9 : 0.75;
    this.renderer.toneMappingExposure = night ? 1.05 : 1;

    if (outdoor && !night && this.skyTexture) {
      this.scene.background = this.skyTexture;
      this.scene.backgroundBlurriness = 0.04;
      this.scene.backgroundIntensity = 0.85;
    } else {
      this.scene.background = new THREE.Color(night ? "#131b28" : outdoor ? "#bcd0de" : "#e4e5e3");
    }
    // Fade the studio floor into the backdrop so there is no horizon line.
    // Fog stays attached outdoors (pushed out of range) because adding or
    // removing it would recompile every shader.
    this.scene.fog ||= new THREE.Fog("#e4e5e3", 18, 46);
    this.scene.fog.color.set(night ? "#131b28" : "#e4e5e3");
    this.scene.fog.near = outdoor ? 900 : 18;
    this.scene.fog.far = outdoor ? 1000 : 46;
    this.scene.environment = outdoor && !night && this.skyEnv ? this.skyEnv : this.studioEnv;
    if (outdoor && !this.skyTexture) this.loadSky();
    this.loadEnvironment(environment);
    this.applyMaterials();
    this.renderer.shadowMap.needsUpdate = true;
    this.requestRender();
  }

  load(url) {
    if (!this.cache.has(url)) {
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      this.cache.set(url, loader.loadAsync(url).then((gltf) => gltf.scene).catch((error) => { this.cache.delete(url); throw error; }));
    }
    return this.cache.get(url);
  }

  loadSky() {
    if (this.skyPromise) return;
    this.skyPromise = new HDRLoader().loadAsync(`${ASSETS}sky-1k.hdr`).then((texture) => {
      if (this.disposed) { texture.dispose(); return; }
      texture.mapping = THREE.EquirectangularReflectionMapping;
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.skyEnv = pmrem.fromEquirectangular(texture).texture;
      pmrem.dispose();
      this.skyTexture = texture;
      this.applyScene();
    }).catch(() => { this.skyPromise = null; });
  }

  loadEnvironment(id) {
    if (this.environmentModel && this.environmentModel.userData.id !== id) {
      this.scene.remove(this.environmentModel);
      this.environmentModel = null;
      this.floor.visible = true;
    }
    if (id === "studio") { this.environmentPending = null; this.onSceneStatus("ready"); return; }
    // Already shown, or already on its way: applyScene() runs again when the
    // sky finishes loading and must not restart this request.
    if (this.environmentModel || this.environmentPending === id) return;
    this.environmentPending = id;
    const token = (this.environmentToken = Symbol(id));
    this.onSceneStatus("loading");
    const placement = ENVIRONMENTS[id];
    this.load(`${ASSETS}${placement.file}`).then((model) => {
      if (this.disposed || this.environmentToken !== token || this.config.environment !== id) return null;
      if (!model.userData.prepared) {
        model.traverse((node) => { if (node.isMesh) { node.castShadow = true; node.receiveShadow = true; } });
        model.userData.prepared = true;
      }
      model.userData.id = id;
      return (this.renderer.compileAsync ? this.renderer.compileAsync(model, this.camera, this.scene) : Promise.resolve()).catch(() => {}).then(() => model);
    }).then((model) => {
      // Still "pending" through shader compilation so a repeat call cannot
      // start a second request for the same setting.
      if (this.environmentToken === token) this.environmentPending = null;
      if (!model || this.disposed || this.environmentToken !== token || this.config.environment !== id) return;
      model.rotation.y = placement.rotation;
      model.scale.setScalar(placement.scale);
      this.environmentModel = model;
      this.positionEnvironment();
      this.scene.add(model);
      this.floor.visible = false;
      this.onSceneStatus("ready");
      this.applyScene();
    }).catch(() => {
      if (this.environmentToken !== token) return;
      this.environmentPending = null;
      this.floor.visible = true;
      this.onSceneStatus("error");
      this.requestRender();
    });
  }

  positionEnvironment() {
    const placement = ENVIRONMENTS[this.environmentModel.userData.id];
    this.environmentModel.position.set(0, 0, placement.z + this.config.depth / 2);
    this.renderer.shadowMap.needsUpdate = true;
  }

  placeHeaters() {
    if (this.heaters) { this.scene.remove(this.heaters); this.heaters = null; }
    const count = this.config.heaters;
    if (!count) { this.requestRender(); return; }
    const token = (this.heaterToken = Symbol("heaters"));
    this.load(`${ASSETS}heater.glb`).then((source) => {
      if (this.disposed || this.heaterToken !== token) return;
      const group = new THREE.Group();
      const bounds = new THREE.Box3().setFromObject(source);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const { width: w, height: h } = this.config;
      const sides = count === 1 ? [-1] : [-1, 1];
      for (const side of sides) {
        const pivot = new THREE.Group();
        const heater = source.clone();
        heater.traverse((node) => { if (node.isMesh) node.castShadow = true; });
        // Long axis runs along the side beam, element tilted toward the centre.
        heater.position.copy(center).multiplyScalar(-1);
        pivot.add(heater);
        pivot.scale.setScalar(0.62 / Math.max(size.x, size.y, size.z) * 1);
        pivot.rotation.set(-side * 0.6, Math.PI / 2, 0, "YXZ");
        // Hung on a short bracket below the beam so it reads from outside too.
        pivot.position.set(side * (w / 2 - PROFILE.beamThickness - 0.2), h - PROFILE.beamHeight - 0.2, 0);
        group.add(pivot);
      }
      this.heaters = group;
      this.scene.add(group);
      this.renderer.shadowMap.needsUpdate = true;
      this.requestRender();
    }).catch(() => {});
  }

  // ---- Camera ---------------------------------------------------------------
  frameFor(view) {
    const { width: w, depth: d, height: h } = this.config;
    const radius = Math.sqrt(w * w + d * d + h * h) / 2;
    // Fit the bounding sphere inside whichever field of view is narrower, so
    // square and portrait phone stages frame the whole pergola, with extra
    // room on small stages where camera chips and buttons overlay the edges.
    const halfV = THREE.MathUtils.degToRad(this.camera.fov / 2);
    const halfH = Math.atan(Math.tan(halfV) * this.camera.aspect);
    const compact = this.host.clientWidth < 640;
    const fit = (radius / Math.sin(Math.min(halfV, halfH))) * (compact ? 1.16 : 1.04);
    const target = new THREE.Vector3(0, h * 0.42, 0);
    const outdoor = this.config.environment !== "studio" ? 1.1 : 1;
    if (view === "detail") {
      // Eye-level close-up of a front corner: post, beam, LED and blade ends.
      const corner = new THREE.Vector3(w / 2 - 0.15, h - 0.45, d / 2 - 0.1);
      return { position: new THREE.Vector3(w / 2 + 1.1, h - 0.15, d / 2 + 1.5), target: corner, min: 0.4, max: radius * 5 };
    }
    const directions = {
      roof: new THREE.Vector3(0.7, 1.05, 1),
      overview: new THREE.Vector3(0.78, 0.46, 1),
      front: new THREE.Vector3(0, 0.22, 1),
      side: new THREE.Vector3(1, 0.22, 0.02),
      top: new THREE.Vector3(0.001, 1, 0.12),
    };
    if (view === "inside") {
      return { position: new THREE.Vector3(0, 1.55, d / 2 - 0.45), target: new THREE.Vector3(0, 1.45, -d / 2), min: 0.05, max: radius * 5 };
    }
    const direction = (directions[view] || directions.overview).clone().normalize();
    const pull = view === "roof" ? 1.18 : 1;
    return { position: target.clone().add(direction.multiplyScalar(fit * outdoor * pull)), target, min: radius * 1.05, max: radius * 5 };
  }

  /** Speed of option animations (louvers, glass, screens). Demo uses slower. */
  setAnimationRate(rate) {
    this.animationRate = rate;
  }

  setView(view, { instant = false, keepDirection = false, duration = 700 } = {}) {
    this.view = view;
    // Human-scale inside view needs a wider lens than the product shots.
    const fov = view === "inside" ? 62 : 35;
    if (this.camera.fov !== fov) { this.camera.fov = fov; this.camera.updateProjectionMatrix(); }
    const frame = this.frameFor(view);
    if (keepDirection && view !== "inside") {
      const direction = this.camera.position.clone().sub(this.controls.target).normalize();
      frame.position = frame.target.clone().add(direction.multiplyScalar(frame.position.distanceTo(frame.target)));
    }
    this.controls.minDistance = frame.min;
    this.controls.maxDistance = frame.max;
    if (instant || reducedMotion()) {
      this.tween = null;
      this.camera.position.copy(frame.position);
      this.controls.target.copy(frame.target);
      this.controls.update();
    } else {
      this.tween = { from: this.camera.position.clone(), to: frame.position, fromTarget: this.controls.target.clone(), toTarget: frame.target, start: performance.now(), duration };
    }
    this.requestRender();
  }

  rotateBy(azimuth, polar = 0) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta += azimuth;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + polar, 0.1, this.controls.maxPolarAngle);
    this.camera.position.copy(this.controls.target).add(new THREE.Vector3().setFromSpherical(spherical));
    this.tween = null;
    this.controls.update();
    this.requestRender();
  }

  zoomBy(factor) {
    const offset = this.camera.position.clone().sub(this.controls.target);
    const distance = THREE.MathUtils.clamp(offset.length() * factor, this.controls.minDistance, this.controls.maxDistance);
    this.camera.position.copy(this.controls.target).add(offset.setLength(distance));
    this.tween = null;
    this.controls.update();
    this.requestRender();
  }

  // ---- Loop -----------------------------------------------------------------
  requestRender() {
    if (this.disposed || this.frame || !this.visible || document.hidden) return;
    this.lastTime = performance.now();
    this.frame = requestAnimationFrame((now) => this.tick(now));
  }

  tick(now) {
    this.frame = 0;
    if (this.disposed) return;
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;
    let busy = false;
    this.flushPending();

    if (this.tween) {
      const t = Math.min(1, (now - this.tween.start) / this.tween.duration);
      const e = easeInOut(t);
      this.camera.position.lerpVectors(this.tween.from, this.tween.to, e);
      this.controls.target.lerpVectors(this.tween.fromTarget, this.tween.toTarget, e);
      if (t >= 1) this.tween = null; else busy = true;
    }
    if (this.controls.update(dt)) busy = true;

    let moved = false;
    const snap = reducedMotion();
    for (const key of ["roof", "slidingOpen", "zipOpen"]) {
      const diff = this.config[key] - this.shown[key];
      if (Math.abs(diff) < 0.2 || snap) {
        if (this.shown[key] !== this.config[key]) { this.shown[key] = this.config[key]; moved = true; }
      } else {
        this.shown[key] += diff * (1 - Math.exp(-dt * this.animationRate));
        moved = true;
        busy = true;
      }
    }
    if (moved) {
      applyDynamic(this.product, { ...this.config, ...this.shown });
      this.renderer.shadowMap.needsUpdate = true;
    }

    this.renderer.render(this.scene, this.camera);

    // Sustained slow frames while animating: step the pixel ratio down.
    if (busy && dt > 0.034) this.slowFrames += 1; else this.slowFrames = Math.max(0, this.slowFrames - 1);
    if (this.slowFrames > 12 && this.pixelRatio > 1) {
      this.pixelRatio = Math.max(1, this.pixelRatio - 0.25);
      this.renderer.setPixelRatio(this.pixelRatio);
      this.resize();
      this.slowFrames = 0;
    }
    if (busy) {
      this.lastBusy = now;
      this.requestRender();
    } else if (this.pixelRatio < this.targetPixelRatio) {
      // Motion has stopped: restore full resolution for a sharp still frame.
      this.pixelRatio = this.targetPixelRatio;
      this.renderer.setPixelRatio(this.pixelRatio);
      this.resize();
    }
  }

  resize() {
    const { width, height } = this.host.getBoundingClientRect();
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.requestRender();
  }

  // ---- Export ---------------------------------------------------------------
  /** Renders the current view and returns a PNG blob with a caption band. */
  snapshot(caption) {
    this.renderer.render(this.scene, this.camera);
    const source = this.renderer.domElement;
    const band = Math.round(source.height * 0.07);
    const canvas = document.createElement("canvas");
    canvas.width = source.width;
    canvas.height = source.height + band;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(source, 0, 0);
    ctx.fillStyle = "#15171a";
    ctx.fillRect(0, source.height, canvas.width, band);
    ctx.fillStyle = "#f2f3f1";
    ctx.font = `500 ${Math.round(band * 0.36)}px system-ui, sans-serif`;
    ctx.textBaseline = "middle";
    ctx.fillText(caption, Math.round(band * 0.5), source.height + band / 2);
    return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver.disconnect();
    this.intersection.disconnect();
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.renderer.domElement.removeEventListener("webglcontextlost", this.onContextLost);
    this.controls.dispose();
    disposePergola(this.product);
    const textures = new Set();
    const materials = new Set(Object.values(this.materials).filter((m) => m?.isMaterial));
    this.scene.traverse((node) => {
      if (!node.isMesh) return;
      node.geometry?.dispose();
      for (const material of [].concat(node.material)) materials.add(material);
    });
    Promise.allSettled([...this.cache.values()]).then((results) => {
      for (const result of results) result.value?.traverse?.((node) => {
        if (!node.isMesh) return;
        node.geometry.dispose();
        for (const material of [].concat(node.material)) materials.add(material);
      });
      for (const material of materials) {
        for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
        material.dispose();
      }
      textures.forEach((texture) => texture.dispose());
    });
    this.materials.bladeGeometry.dispose();
    this.contactTexture.dispose();
    this.studioEnv?.dispose();
    this.skyEnv?.dispose();
    this.skyTexture?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
