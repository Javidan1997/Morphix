import { useEffect, useRef } from "react";
import * as THREE from "three";

// Full-bleed procedural background: a precision array of thin machined rods,
// seen at a low angle, standing on a dark polished surface. A wave travels
// through the array and a band of light sweeps across it, leaving a slowly
// fading wake — the optical-bench idea rebuilt as geometry.
//
// Scroll advances the wave, drives the camera across the field, and energises
// the surface. The pointer adds a little parallax. Every driver runs on its
// own unrelated frequency, so there is no cycle to notice.
//
// Deliberately dark and low-contrast: this sits under body copy on every
// public page, so the type has to win. Fog does the heavy lifting — far rows
// and the reflection dissolve into the background rather than ending at an edge.

const COLS = 40;
const ROWS = 26;
const SPACING = 0.42;
const ROD = 0.11;

// Rod albedo. Instance colours multiply the material, so the material itself
// stays white and every rod's tone is set per-instance.
const BASE = new THREE.Color(0x2f3644);
const CREST = new THREE.Color(0x59657f);
const WARM = new THREE.Color(0xd8c7a8);
const COOL = new THREE.Color(0x93a9e8);

function AmbientBackground() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch (error) {
      // No WebGL: the CSS gradient on .cinematic-bg is a complete look on its own.
      return undefined;
    }

    const BG = 0x0b0c0f;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(BG, 1);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(BG, 7, 24);

    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 60);

    // Key from the upper left, matching the light direction of the reference
    // stills; ambient only keeps the shadow sides from going flat.
    const key = new THREE.DirectionalLight(0xdfe6ff, 1.35);
    key.position.set(-5, 8, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8fa2c8, 0.35);
    fill.position.set(6, 3, -5);
    scene.add(fill);
    scene.add(new THREE.AmbientLight(0x2a3040, 0.7));

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BoxGeometry(ROD, 1, ROD);
    // Anchor at the base so scaling Y grows the rod upward, not from its centre.
    geometry.translate(0, 0.5, 0);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.6,
      metalness: 0.25,
    });

    const count = COLS * ROWS;
    const mesh = new THREE.InstancedMesh(geometry, material, count);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(mesh);

    // Mirrored copy hanging below y=0: reads as a reflection in a dark polished
    // surface. Flat and dim, so it costs one extra matrix write per rod and no
    // per-instance colour work. Fog fades it out before it can draw attention.
    const reflectionMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b2029,
      roughness: 0.85,
      metalness: 0.1,
      transparent: true,
      opacity: 0.34,
      side: THREE.DoubleSide,
    });
    const reflection = new THREE.InstancedMesh(geometry, reflectionMaterial, count);
    reflection.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const reflectionGroup = new THREE.Group();
    reflectionGroup.scale.y = -1;
    reflectionGroup.add(reflection);
    group.add(reflectionGroup);

    // Precompute each rod's grid position once; only height, twist and tone
    // change per frame.
    const positions = new Float32Array(count * 2);
    for (let i = 0; i < count; i += 1) {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      positions[i * 2] = (col - (COLS - 1) / 2) * SPACING;
      positions[i * 2 + 1] = (row - (ROWS - 1) / 2) * SPACING;
    }
    const spanX = (COLS - 1) * SPACING;

    // How much of the light band each rod is still holding. Decays slowly, so
    // the band drags a wake behind it instead of lighting rods instantaneously.
    const charge = new Float32Array(count);

    const dummy = new THREE.Object3D();
    const tone = new THREE.Color();
    const tint = new THREE.Color();

    // Set an initial colour for every instance so instanceColor exists.
    for (let i = 0; i < count; i += 1) mesh.setColorAt(i, BASE);

    const BAND_WIDTH = 1.5;

    const writeInstances = (t, scroll, energy) => {
      const phase = t * 0.35 + scroll * 7.0;
      const amplitude = 0.34 + energy * 0.22;

      // Coherence drifts slowly in and out. Near 1 the two wave systems lock
      // into clean parallel ridges; near 0 they interfere and the surface
      // breaks up. The array keeps finding order and losing it again.
      const coherence = 0.5 + 0.5 * Math.sin(t * 0.037);

      // The light band sweeps across on its own slow drift, and scroll pushes
      // it further — the beam passing through the bench.
      const bandX = Math.sin(t * 0.08 + scroll * 2.4) * spanX * 0.55;

      for (let i = 0; i < count; i += 1) {
        const x = positions[i * 2];
        const z = positions[i * 2 + 1];

        const ordered = Math.sin(x * 0.42 + phase);
        const broken =
          Math.sin(x * 0.42 + phase) * Math.cos(z * 0.31 - phase * 0.63) +
          Math.sin((x + z) * 0.17 + phase * 0.41) * 0.5;
        const wave = broken + (ordered - broken) * coherence;

        const crest = (wave + 1.5) / 3.0; // roughly 0..1
        const height = 0.28 + (wave + 1.5) * amplitude;

        dummy.position.set(x, 0, z);
        dummy.scale.set(1, height, 1);
        // A few degrees of twist on the crests catches the key light and stops
        // the array reading as a flat extruded grid.
        dummy.rotation.y = wave * 0.16;
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        reflection.setMatrixAt(i, dummy.matrix);

        // Distance from the light band, and which side of it this rod is on.
        const offset = (x - bandX) / BAND_WIDTH;
        const glow = Math.exp(-offset * offset);
        charge[i] = Math.max(charge[i] * 0.965, glow);

        // Warm on one edge of the band, cool on the other — the narrow
        // dispersion of the optics idea, kept to a whisper.
        tint.copy(WARM).lerp(COOL, Math.min(1, Math.max(0, offset * 0.5 + 0.5)));

        tone.copy(BASE).lerp(CREST, crest * 0.55);
        tone.lerp(tint, charge[i] * 0.5);
        mesh.setColorAt(i, tone);
      }

      mesh.instanceMatrix.needsUpdate = true;
      reflection.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    };

    const setSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    setSize();

    const scrollProgress = () => {
      const root = document.documentElement;
      const maxScroll = root.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.min(1, Math.max(0, (window.scrollY || root.scrollTop || 0) / maxScroll));
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let scrollTarget = scrollProgress();
    let scrollEased = scrollTarget;
    let energy = 0;
    let lastY = window.scrollY;
    let pointerX = 0;
    let pointerY = 0;
    let pointerEasedX = 0;
    let pointerEasedY = 0;
    let frameId = 0;
    const started = performance.now();

    const placeCamera = (scroll) => {
      // Drop and push in as the reader moves down: the array flattens toward
      // the horizon, keeping the upper half of frame clear for headlines.
      // Pointer parallax is small on purpose — presence, not a toy.
      camera.position.set(
        pointerEasedX * 0.8,
        3.4 - scroll * 1.5 + pointerEasedY * 0.35,
        9.2 - scroll * 4.2
      );
      camera.lookAt(0, 0.35, -scroll * 2.0);
      group.rotation.y = -0.22 + scroll * 0.3;
    };

    const renderFrame = () => {
      scrollEased += (scrollTarget - scrollEased) * 0.07;
      pointerEasedX += (pointerX - pointerEasedX) * 0.045;
      pointerEasedY += (pointerY - pointerEasedY) * 0.045;
      energy *= 0.94; // settle back to calm when the reader stops
      const t = prefersReducedMotion ? 0 : (performance.now() - started) / 1000;
      writeInstances(t, scrollEased, energy);
      placeCamera(scrollEased);
      renderer.render(scene, camera);
    };

    const loop = () => {
      renderFrame();
      frameId = window.requestAnimationFrame(loop);
    };

    if (prefersReducedMotion) {
      renderFrame();
    } else {
      frameId = window.requestAnimationFrame(loop);
    }

    const handleScroll = () => {
      const y = window.scrollY;
      energy = Math.min(1, energy + Math.abs(y - lastY) * 0.004);
      lastY = y;
      scrollTarget = scrollProgress();
      // Reduced motion still tracks scroll, it just has no idle animation.
      if (prefersReducedMotion) renderFrame();
    };

    const handlePointerMove = (event) => {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    const handleResize = () => {
      setSize();
      scrollTarget = scrollProgress();
      if (prefersReducedMotion) renderFrame();
    };

    const handleVisibilityChange = () => {
      if (prefersReducedMotion) return;
      if (document.hidden) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
        return;
      }
      if (!frameId) frameId = window.requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    if (!prefersReducedMotion) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
    }

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      geometry.dispose();
      material.dispose();
      reflectionMaterial.dispose();
      mesh.dispose();
      reflection.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="cinematic-bg" ref={hostRef} aria-hidden="true">
      <div className="cinematic-vig" />
    </div>
  );
}

export default AmbientBackground;
