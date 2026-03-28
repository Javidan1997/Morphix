import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import knowledgeNetworkUrl from "../../3d models/knowledge_network.glb";
import jupiterUrl from "../../3d models/jupiter.glb";
import helixNebulaUrl from "../../3d models/helix_nebula_the_eye_of_god.glb";
import kummerUrl from "../../3d models/kummer_surface_k3_flux__papp.glb";

const ROUTE_SCENE_MAP = {
  "/": "home",
  "/services": "services",
  "/work": "work",
  "/pricing": "pricing",
  "/about": "about",
  "/contact": "contact",
};

const MODEL_CONFIG = {
  home: {
    url: knowledgeNetworkUrl,
    scale: 9.4,
    palette: [0x17324a, 0x476682, 0x89a5be, 0xdbe6ef],
    glow: 0xc8d8e6,
    shadowOpacity: 0.22,
    cameraZ: 9.1,
    baseRotationY: -0.22,
    scrollYaw: 0.95,
    scrollPitch: 0.22,
    clickTwist: 0.16,
    halo: 0xd8e3ee,
    haloBackSize: 9.2,
    haloFrontSize: 6.6,
    haloBackOpacity: 0.14,
    haloFrontOpacity: 0.12,
    shellOpacity: 0.13,
    revealDepth: 2.6,
    revealMinScale: 0.74,
    revealLift: 0.32,
    baseX: 1.05,
    baseY: -0.18,
    tintColor: 0x4f84b5,
    tintStrength: 0.4,
    emissiveBoost: 1.18,
  },
  services: {
    url: helixNebulaUrl,
    scale: 7.2,
    palette: [0x21364d, 0x56708a, 0x98a8b7, 0xe7ecef],
    glow: 0xd4dde7,
    shadowOpacity: 0.2,
    cameraZ: 9.6,
    baseRotationY: 0.12,
    scrollYaw: 1.05,
    scrollPitch: 0.18,
    clickTwist: 0.14,
    halo: 0xe0e6ee,
    haloBackSize: 6.8,
    haloFrontSize: 4.8,
    haloBackOpacity: 0.08,
    haloFrontOpacity: 0.06,
    shellOpacity: 0.06,
    revealDepth: 1.9,
    revealMinScale: 0.86,
    revealLift: 0.12,
  },
  work: {
    url: jupiterUrl,
    scale: 7.1,
    palette: [0x2b425b, 0x6b8296, 0xb6c1c8, 0xdfd1bc],
    glow: 0xd6dde5,
    shadowOpacity: 0.18,
    cameraZ: 9.3,
    baseRotationY: 0.3,
    scrollYaw: 0.82,
    scrollPitch: 0.16,
    clickTwist: 0.12,
    halo: 0xe3e7eb,
    haloBackSize: 6.8,
    haloFrontSize: 4.8,
    haloBackOpacity: 0.08,
    haloFrontOpacity: 0.06,
    shellOpacity: 0.06,
    revealDepth: 1.8,
    revealMinScale: 0.86,
    revealLift: 0.1,
  },
  pricing: {
    url: kummerUrl,
    scale: 4.8,
    palette: [0x27425c, 0x6e88a0, 0xc1ccd4, 0xd7bb95],
    glow: 0xddd5cb,
    shadowOpacity: 0.24,
    cameraZ: 8.8,
    baseRotationY: -0.14,
    scrollYaw: 1.14,
    scrollPitch: 0.25,
    clickTwist: 0.18,
    halo: 0xe5ddd4,
    haloBackSize: 6.4,
    haloFrontSize: 4.6,
    haloBackOpacity: 0.08,
    haloFrontOpacity: 0.06,
    shellOpacity: 0.065,
    revealDepth: 1.75,
    revealMinScale: 0.84,
    revealLift: 0.1,
  },
  about: {
    url: knowledgeNetworkUrl,
    scale: 8.2,
    palette: [0x2e475f, 0x71899f, 0xbbcddb, 0xe6edf2],
    glow: 0xdfe8ef,
    shadowOpacity: 0.2,
    cameraZ: 9.05,
    baseRotationY: 0.2,
    scrollYaw: 0.88,
    scrollPitch: 0.16,
    clickTwist: 0.12,
    halo: 0xe7edf3,
    haloBackSize: 8.5,
    haloFrontSize: 6.2,
    haloBackOpacity: 0.13,
    haloFrontOpacity: 0.1,
    shellOpacity: 0.12,
    revealDepth: 2.35,
    revealMinScale: 0.76,
    revealLift: 0.28,
    baseX: 0.7,
    baseY: -0.12,
    tintColor: 0x6a95bd,
    tintStrength: 0.3,
    emissiveBoost: 1.12,
  },
  contact: {
    url: helixNebulaUrl,
    scale: 5.8,
    palette: [0x314c68, 0x7b8894, 0xc9baa6, 0xe8ecef],
    glow: 0xe3ddd7,
    shadowOpacity: 0.18,
    cameraZ: 9.1,
    baseRotationY: -0.28,
    scrollYaw: 0.96,
    scrollPitch: 0.22,
    clickTwist: 0.16,
    halo: 0xe9e4dd,
    haloBackSize: 6.6,
    haloFrontSize: 4.8,
    haloBackOpacity: 0.08,
    haloFrontOpacity: 0.06,
    shellOpacity: 0.06,
    revealDepth: 1.8,
    revealMinScale: 0.84,
    revealLift: 0.1,
  },
};

const LIGHT_TARGETS = {
  home: { key: 0x527596, fill: 0xa7bbcf, rim: 0xf8fbff, accent: 0xe0ebf5 },
  services: { key: 0x4d6b88, fill: 0x9dafbf, rim: 0xf7fafc, accent: 0xdce5ed },
  work: { key: 0x5f7489, fill: 0xb3b9bf, rim: 0xfcfbfa, accent: 0xe1d3c0 },
  pricing: { key: 0x57718c, fill: 0xc0ab8d, rim: 0xfaf8f6, accent: 0xe4d7c8 },
  about: { key: 0x63819c, fill: 0xb2c3d1, rim: 0xf8fbfd, accent: 0xe7eef5 },
  contact: { key: 0x5c748c, fill: 0xc3b39f, rim: 0xfbfbfa, accent: 0xe7ddd2 },
};

const tempBox = new THREE.Box3();

function setMaterialBaseOpacity(material, opacity, options = {}) {
  const { forceTransparent = true } = options;
  material.userData.originalTransparent = material.transparent ?? false;
  material.userData.originalDepthWrite = material.depthWrite ?? true;
  material.opacity = opacity;
  material.userData.baseOpacity = opacity;
  if (forceTransparent) {
    material.transparent = true;
  }
}

function createSoftGlowDisc(size, color, opacity) {
  const material = new THREE.SpriteMaterial({
    color,
    transparent: true,
    opacity,
    depthWrite: false,
    depthTest: false,
  });
  setMaterialBaseOpacity(material, opacity);

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(size, size, 1);
  return sprite;
}

function createDustCloud(count, bounds, color, size, opacity) {
  const positions = new Float32Array(count * 3);
  const geometry = new THREE.BufferGeometry();

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * bounds.x;
    positions[i3 + 1] = (Math.random() - 0.5) * bounds.y;
    positions[i3 + 2] = (Math.random() - 0.5) * bounds.z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color,
    size,
    transparent: true,
    opacity,
    depthWrite: false,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
  });
  setMaterialBaseOpacity(material, opacity);

  return new THREE.Points(geometry, material);
}

function createShadowPlane(opacity = 0.2) {
  const geometry = new THREE.PlaneGeometry(12, 12);
  const material = new THREE.ShadowMaterial({
    color: 0x000000,
    transparent: true,
    opacity,
  });
  setMaterialBaseOpacity(material, opacity);

  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -3.2;
  plane.receiveShadow = true;
  return plane;
}

function SceneCanvas() {
  const canvasRef = useRef(null);
  const location = useLocation();
  const sceneKeyRef = useRef("home");

  useEffect(() => {
    sceneKeyRef.current = ROUTE_SCENE_MAP[location.pathname] || "home";
  }, [location.pathname]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const getLowPower = () =>
      window.innerWidth < 1200 || window.devicePixelRatio > 1.4;

    let lowPower = getLowPower();

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !lowPower,
      powerPreference: "high-performance",
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.setClearColor(0xffffff, 0);
    renderer.shadowMap.enabled = !lowPower;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 0, MODEL_CONFIG.home.cameraZ);

    const timer = new THREE.Timer();
    timer.connect(document);
    timer.reset();
    const loader = new GLTFLoader();

    const interaction = {
      scrollProgress: 0,
      targetScrollProgress: 0,
      scrollVelocity: 0,
      clickImpulse: 0,
      routeImpulse: 0.55,
      globalLift: 0,
      targetLift: 0,
    };

    let lastScrollY = window.scrollY;
    let lastWheelDir = 1;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.85);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xf3f4f6, 1.35);

    const keyLight = new THREE.DirectionalLight(0x56718d, 3.8);
    keyLight.position.set(4.5, 5.5, 7.5);
    keyLight.castShadow = !lowPower;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0004;

    const fillLight = new THREE.PointLight(0xa1b4c6, 14, 30, 2);
    fillLight.position.set(-5, -1.2, 8);

    const rimLight = new THREE.PointLight(0xffffff, 10, 30, 2);
    rimLight.position.set(0, 5.5, -5);

    const accentLight = new THREE.PointLight(0xe6edf4, 8, 24, 2);
    accentLight.position.set(2.8, -2, 7);

    scene.add(
      ambientLight,
      hemiLight,
      keyLight,
      fillLight,
      rimLight,
      accentLight
    );

    const backgroundGroup = new THREE.Group();

    const leftGlow = createSoftGlowDisc(9.5, 0xe8f0f6, 0.2);
    leftGlow.position.set(-5.8, 2.8, -14);

    const rightGlow = createSoftGlowDisc(8.2, 0xf2eee9, 0.14);
    rightGlow.position.set(5.5, -2.1, -13);

    const topGlow = createSoftGlowDisc(7.8, 0xecf2f8, 0.16);
    topGlow.position.set(0, 4.8, -16);

    backgroundGroup.add(leftGlow, rightGlow, topGlow);
    scene.add(backgroundGroup);

    const shadowPlane = createShadowPlane(MODEL_CONFIG.home.shadowOpacity);
    scene.add(shadowPlane);

    const routeGroups = {};
    const modelSlots = {};
    const groupOpacity = {};
    const groupTargetOpacity = {};

    Object.keys(MODEL_CONFIG).forEach((key) => {
      const cfg = MODEL_CONFIG[key];
      const group = new THREE.Group();
      group.visible = false;

      const haloBack = createSoftGlowDisc(
        cfg.haloBackSize ?? 6.8,
        cfg.halo,
        cfg.haloBackOpacity ?? 0.08
      );
      haloBack.position.set(0, 0.25, -1.8);

      const haloFront = createSoftGlowDisc(
        cfg.haloFrontSize ?? 4.8,
        cfg.glow,
        cfg.haloFrontOpacity ?? 0.06
      );
      haloFront.position.set(0, 0.05, 1.2);

      const dust = createDustCloud(
        lowPower ? 42 : 70,
        new THREE.Vector3(8.5, 6.5, 5.5),
        cfg.glow,
        lowPower ? 0.04 : 0.05,
        0.08
      );

      haloBack.userData.kind = "haloBack";
      haloFront.userData.kind = "haloFront";
      dust.userData.kind = "dust";

      group.add(haloBack, haloFront, dust);

      routeGroups[key] = group;
      modelSlots[key] = null;
      groupOpacity[key] = key === "home" ? 1 : 0;
      groupTargetOpacity[key] = key === "home" ? 1 : 0;

      scene.add(group);

      loader.load(cfg.url, (gltf) => {
        const modelRoot = new THREE.Group();
        const model = gltf.scene;
        const shellEntries = [];

        tempBox.setFromObject(model);
        const size = tempBox.getSize(new THREE.Vector3());
        const center = tempBox.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const scale = cfg.scale / maxDim;

        model.position.set(
          -center.x * scale,
          -center.y * scale + 0.05,
          -center.z * scale
        );
        model.scale.setScalar(scale);

        const edgeMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(cfg.glow),
          transparent: true,
          opacity: cfg.shellOpacity ?? 0.06,
          depthWrite: false,
          side: THREE.BackSide,
          roughness: 0.7,
          metalness: 0.06,
          clearcoat: 0.2,
          clearcoatRoughness: 0.8,
        });
        setMaterialBaseOpacity(edgeMaterial, cfg.shellOpacity ?? 0.06);

        model.updateWorldMatrix(true, true);

        model.traverse((child) => {
          if (!child.isMesh) return;

          child.castShadow = !lowPower;
          child.receiveShadow = false;
          const sourceMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          const nextMaterials = sourceMaterials.map((sourceMaterial) => {
            if (!sourceMaterial) return sourceMaterial;

            const material = sourceMaterial.clone();
            const sourceOpacity = sourceMaterial.opacity ?? 1;
            const boostedOpacity = sourceMaterial.transparent
              ? Math.min(1, sourceOpacity + 0.28)
              : Math.max(sourceOpacity, 0.985);

            setMaterialBaseOpacity(material, boostedOpacity, {
              forceTransparent: sourceMaterial.transparent ?? false,
            });
            material.depthWrite = sourceMaterial.depthWrite;

             if (cfg.tintColor && material.color) {
              material.color.lerp(
                new THREE.Color(cfg.tintColor),
                cfg.tintStrength ?? 0.22
              );
            }

            if ("emissiveIntensity" in material && material.emissiveIntensity !== undefined) {
              material.emissiveIntensity =
                (sourceMaterial.emissiveIntensity ?? 1) * (cfg.emissiveBoost ?? 1);
            }

            if ("emissive" in material && material.emissive && cfg.tintColor) {
              material.emissive.lerp(
                new THREE.Color(cfg.tintColor),
                Math.min(0.35, (cfg.tintStrength ?? 0.22) * 0.7)
              );
            }

            return material;
          });

          child.material = Array.isArray(child.material)
            ? nextMaterials
            : nextMaterials[0];

          if (child.parent) {
            const shell = new THREE.Mesh(child.geometry, edgeMaterial.clone());
            shell.position.copy(child.position);
            shell.quaternion.copy(child.quaternion);
            shell.scale.copy(child.scale).multiplyScalar(1.025);
            shell.renderOrder = -1;
            shell.castShadow = false;
            shell.receiveShadow = false;
            shell.matrixAutoUpdate = true;
            shell.userData.isModelShell = true;
            shellEntries.push({ parent: child.parent, shell });
          }
        });

        shellEntries.forEach(({ parent, shell }) => {
          parent.add(shell);
        });

        modelRoot.add(model);
        modelRoot.userData.baseRotationY = cfg.baseRotationY;
        modelRoot.userData.baseScale = scale;
        modelRoot.userData.scrollYaw = cfg.scrollYaw;
        modelRoot.userData.scrollPitch = cfg.scrollPitch;
        modelRoot.userData.clickTwist = cfg.clickTwist;
        modelRoot.userData.cameraZ = cfg.cameraZ;
        modelRoot.userData.shadowOpacity = cfg.shadowOpacity;
        modelRoot.userData.baseY = cfg.baseY ?? 0;
        modelRoot.userData.baseX = cfg.baseX ?? 0;
        modelRoot.userData.lastAppliedProgress = 0;

        group.add(modelRoot);
        modelSlots[key] = modelRoot;
      });
    });

    function setGroupOpacity(group, opacity) {
      group.visible = opacity > 0.01;
      if (!group.visible) return;

      group.traverse((obj) => {
        if (!obj.material) return;
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach((mat) => {
          const base = mat.userData.baseOpacity ?? 1;
          const nextOpacity = base * opacity;
          const shouldBeTransparent =
            opacity < 0.999 ||
            (mat.userData.originalTransparent ?? false) ||
            base < 0.999;

          mat.transparent = shouldBeTransparent;
          mat.opacity = nextOpacity;

          if ("depthWrite" in mat) {
            mat.depthWrite = shouldBeTransparent
              ? false
              : (mat.userData.originalDepthWrite ?? true);
          }
        });
      });
    }

    function resize() {
      lowPower = getLowPower();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPower ? 1 : 1.35));
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    function onWheel(event) {
      const dir = event.deltaY >= 0 ? 1 : -1;
      lastWheelDir = dir;
      interaction.scrollVelocity = THREE.MathUtils.clamp(
        interaction.scrollVelocity + dir * 0.24,
        -1.2,
        1.2
      );
      interaction.targetLift = THREE.MathUtils.clamp(
        interaction.targetLift + dir * 0.08,
        -0.4,
        0.4
      );
    }

    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;

      const maxScrollable = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const normalized = y / maxScrollable;

      interaction.targetScrollProgress = normalized * 2 - 1;

      const dir = delta === 0 ? lastWheelDir : Math.sign(delta);
      interaction.scrollVelocity = THREE.MathUtils.clamp(
        interaction.scrollVelocity + dir * Math.min(Math.abs(delta) * 0.0025, 0.22),
        -1.25,
        1.25
      );
      interaction.targetLift = THREE.MathUtils.clamp(
        interaction.targetLift + dir * Math.min(Math.abs(delta) * 0.0009, 0.1),
        -0.42,
        0.42
      );
    }

    function onPointerDown() {
      interaction.clickImpulse = Math.min(interaction.clickImpulse + 1, 1.25);
      interaction.routeImpulse = Math.min(interaction.routeImpulse + 0.08, 0.8);
      interaction.targetLift = Math.min(interaction.targetLift + 0.1, 0.45);
    }

    resize();
    onScroll();

    window.addEventListener("resize", resize);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

    let frameId = 0;

    const animate = (time) => {
      frameId = requestAnimationFrame(animate);

      timer.update(time);
      const elapsed = timer.getElapsed();
      const activeKey = sceneKeyRef.current;
      const activeConfig = MODEL_CONFIG[activeKey] || MODEL_CONFIG.home;
      const activeLight = LIGHT_TARGETS[activeKey] || LIGHT_TARGETS.home;

      Object.keys(groupTargetOpacity).forEach((key) => {
        groupTargetOpacity[key] = key === activeKey ? 1 : 0;
      });

      interaction.scrollProgress +=
        (interaction.targetScrollProgress - interaction.scrollProgress) * 0.08;
      interaction.globalLift +=
        (interaction.targetLift - interaction.globalLift) * 0.08;

      interaction.scrollVelocity *= 0.9;
      interaction.clickImpulse *= 0.92;
      interaction.routeImpulse *= 0.94;
      interaction.targetLift *= 0.96;

      leftGlow.position.x = -5.8 + interaction.scrollProgress * 0.18;
      leftGlow.position.y = 2.8 + interaction.globalLift * 0.2;

      rightGlow.position.x = 5.5 - interaction.scrollProgress * 0.12;
      rightGlow.position.y = -2.1 - interaction.globalLift * 0.16;

      topGlow.position.y = 4.8 + interaction.globalLift * 0.1;

      Object.keys(routeGroups).forEach((key) => {
        groupOpacity[key] += (groupTargetOpacity[key] - groupOpacity[key]) * 0.08;
        if (groupOpacity[key] < 0.003) groupOpacity[key] = 0;

        const group = routeGroups[key];
        const opacity = groupOpacity[key];
        setGroupOpacity(group, opacity);

        if (!group.visible) return;

        const ease = opacity * opacity * (3 - 2 * opacity);
        const cfg = MODEL_CONFIG[key];
        const revealDepth = cfg.revealDepth ?? 1.8;
        const revealLift = cfg.revealLift ?? 0.1;
        const revealMinScale = cfg.revealMinScale ?? 0.86;
        group.position.z = (1 - ease) * revealDepth;
        group.position.y = interaction.globalLift * 0.12 * ease + (1 - ease) * revealLift;
        group.scale.setScalar(revealMinScale + ease * (1 - revealMinScale));

        group.children.forEach((child) => {
          if (child.userData.kind === "haloBack") {
            child.scale.setScalar(1 + interaction.clickImpulse * 0.03 + Math.abs(interaction.scrollVelocity) * 0.04);
            child.position.y = 0.25 + interaction.globalLift * 0.24;
          }
          if (child.userData.kind === "haloFront") {
            child.scale.setScalar(1 + interaction.clickImpulse * 0.05 + Math.abs(interaction.scrollVelocity) * 0.06);
            child.position.y = 0.05 + interaction.globalLift * 0.18;
          }
          if (child.userData.kind === "dust") {
            child.rotation.z += interaction.scrollVelocity * 0.008;
            child.rotation.y += interaction.clickImpulse * 0.01;
            child.position.y = interaction.globalLift * 0.28;
          }
        });

        const modelRoot = modelSlots[key];
        if (!modelRoot) return;

        const isActive = key === activeKey;
        const focus = isActive ? 1 : 0;
        const scrollYaw = interaction.scrollProgress * modelRoot.userData.scrollYaw;
        const scrollPitch = interaction.scrollProgress * modelRoot.userData.scrollPitch * 0.6;
        const clickTwist = interaction.clickImpulse * modelRoot.userData.clickTwist;
        const velocityTwist = interaction.scrollVelocity * 0.12;

        const targetRotY =
          modelRoot.userData.baseRotationY + scrollYaw + clickTwist + velocityTwist;
        const targetRotX = scrollPitch - Math.abs(interaction.scrollVelocity) * 0.04;
        const targetRotZ = interaction.scrollVelocity * 0.05 - interaction.clickImpulse * 0.04;

        modelRoot.rotation.y += (targetRotY - modelRoot.rotation.y) * 0.08;
        modelRoot.rotation.x += (targetRotX - modelRoot.rotation.x) * 0.08;
        modelRoot.rotation.z += (targetRotZ - modelRoot.rotation.z) * 0.08;

        const targetY = modelRoot.userData.baseY + interaction.globalLift * 0.42 + Math.abs(interaction.scrollVelocity) * 0.08;
        const targetX = modelRoot.userData.baseX + interaction.scrollProgress * 0.22;
        modelRoot.position.x += (targetX - modelRoot.position.x) * 0.08;
        modelRoot.position.y += (targetY - modelRoot.position.y) * 0.08;

        const scaleBoost =
          1 + Math.abs(interaction.scrollVelocity) * 0.018 + interaction.clickImpulse * 0.028;
        const revealScale = revealMinScale + ease * (1 - revealMinScale);
        const targetScale = scaleBoost * (isActive ? 1 : 0.985) * revealScale;
        modelRoot.scale.x += (targetScale - modelRoot.scale.x) * 0.08;
        modelRoot.scale.y += (targetScale - modelRoot.scale.y) * 0.08;
        modelRoot.scale.z += (targetScale - modelRoot.scale.z) * 0.08;

        modelRoot.traverse((obj) => {
          if (!obj.isMesh || !obj.material) return;
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((mat) => {
            if ("emissiveIntensity" in mat) {
              mat.emissiveIntensity =
                1 + Math.abs(interaction.scrollVelocity) * 0.18 + interaction.clickImpulse * 0.2;
            }
          });
        });

        if (focus > 0) {
          shadowPlane.material.opacity +=
            (activeConfig.shadowOpacity +
              Math.abs(interaction.scrollVelocity) * 0.04 +
              interaction.clickImpulse * 0.03 -
              shadowPlane.material.opacity) *
            0.08;
        }
      });

      hemiLight.color.lerp(new THREE.Color(activeLight.rim), 0.06);
      keyLight.color.lerp(new THREE.Color(activeLight.key), 0.06);
      fillLight.color.lerp(new THREE.Color(activeLight.fill), 0.06);
      rimLight.color.lerp(new THREE.Color(activeLight.rim), 0.06);
      accentLight.color.lerp(new THREE.Color(activeLight.accent), 0.06);

      keyLight.position.x = 4.5 + interaction.scrollProgress * 0.7;
      keyLight.position.y = 5.5 + interaction.globalLift * 0.35;

      fillLight.position.x = -5 - interaction.scrollProgress * 0.5;
      fillLight.position.y = -1.2 - interaction.globalLift * 0.25;

      accentLight.position.x = 2.8 + interaction.scrollVelocity * 0.9;
      accentLight.position.y = -2 + interaction.globalLift * 0.4;

      camera.position.x += (interaction.scrollProgress * 0.18 - camera.position.x) * 0.06;
      camera.position.y += ((interaction.globalLift * 0.18) - camera.position.y) * 0.06;
      camera.position.z += (activeConfig.cameraZ - camera.position.z) * 0.06;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onPointerDown);

      scene.traverse((item) => {
        if (item.geometry) item.geometry.dispose();

        if (item.material) {
          const mats = Array.isArray(item.material) ? item.material : [item.material];
          mats.forEach((mat) => {
            if (mat.map) mat.map.dispose();
            mat.dispose();
          });
        }
      });

      timer.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="scene-layer" aria-hidden="true">
      <div className="scene-gradient scene-gradient-a" />
      <div className="scene-gradient scene-gradient-b" />
      <div className="scene-gradient scene-gradient-c" />
      <canvas ref={canvasRef} className="scene-canvas" />
    </div>
  );
}

export default SceneCanvas;
