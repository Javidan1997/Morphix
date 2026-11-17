// Shadeline live 3D viewer. Renders on demand (no idle render loop), so it
// costs nothing while the buyer reads the price.
import * as THREE from "three";
import { buildPergola, buildTerrace, skyTexture, addLights } from "./shadeline-pergola.js";

export function mountViewer(container, initial) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.domElement.setAttribute("role", "img");
  renderer.domElement.setAttribute("aria-label", "3D preview of your configured pergola");
  renderer.domElement.tabIndex = 0;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = skyTexture(false);
  scene.fog = new THREE.Fog("#e6e6e0", 18, 46);
  scene.add(buildTerrace({ furniture: true }));
  addLights(scene, { shadowSize: 2048 });
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
  const target = new THREE.Vector3(0, 1.2, -0.2);
  const orbit = { theta: 0.72, phi: 1.2, radius: 10 };

  let pergola = null;
  let key = "";
  let frame = 0;
  const requestRender = () => {
    if (!frame) frame = requestAnimationFrame(draw);
  };
  function draw() {
    frame = 0;
    const r = orbit.radius;
    camera.position.set(target.x + r * Math.sin(orbit.phi) * Math.sin(orbit.theta), target.y + r * Math.cos(orbit.phi), target.z + r * Math.sin(orbit.phi) * Math.cos(orbit.theta));
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  function update(state) {
    const k = `${state.width}|${state.depth}|${state.screens}`;
    if (k !== key) {
      key = k;
      if (pergola) {
        scene.remove(pergola);
        pergola.traverse((o) => o.geometry?.dispose());
      }
      pergola = buildPergola({ width: state.width / 100, depth: state.depth / 100, finish: state.finish, louvre: 0.35, lighting: state.lighting, screens: state.screens });
      scene.add(pergola);
      orbit.radius = 6.5 + Math.max(state.width, state.depth) / 100;
    }
    pergola.userData.setFinish(state.finish);
    pergola.userData.setLighting(state.lighting);
    requestRender();
  }

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    requestRender();
  }
  new ResizeObserver(resize).observe(container);

  // Drag / touch to orbit, arrow keys for keyboard users.
  let drag = null;
  const el = renderer.domElement;
  el.addEventListener("pointerdown", (e) => {
    drag = { x: e.clientX, y: e.clientY, theta: orbit.theta, phi: orbit.phi };
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!drag) return;
    orbit.theta = drag.theta - (e.clientX - drag.x) * 0.008;
    orbit.phi = THREE.MathUtils.clamp(drag.phi - (e.clientY - drag.y) * 0.006, 0.55, 1.45);
    requestRender();
  });
  el.addEventListener("pointerup", () => (drag = null));
  el.addEventListener("keydown", (e) => {
    const step = { ArrowLeft: [0.12, 0], ArrowRight: [-0.12, 0], ArrowUp: [0, -0.06], ArrowDown: [0, 0.06] }[e.key];
    if (!step) return;
    e.preventDefault();
    orbit.theta += step[0];
    orbit.phi = THREE.MathUtils.clamp(orbit.phi + step[1], 0.55, 1.45);
    requestRender();
  });

  update(initial);
  resize();
  return { update };
}
