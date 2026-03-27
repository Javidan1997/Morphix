import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import knowledgeNetworkUrl from "../../3d models/knowledge_network.glb";
import jupiterUrl from "../../3d models/jupiter.glb";
import helixNebulaUrl from "../../3d models/helix_nebula_the_eye_of_god.glb";
import kummerUrl from "../../3d models/kummer_surface_k3_flux__papp.glb";

function SceneCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const getLowPowerMode = () =>
      window.innerWidth < 1280 || window.devicePixelRatio > 1.4;
    let lowPowerMode = getLowPowerMode();
    const particleMultiplier = lowPowerMode ? 0.45 : 0.68;
    const curveSegments = lowPowerMode ? 96 : 136;
    const loopSegments = lowPowerMode ? 72 : 108;
    const torusTubularSegments = lowPowerMode ? 84 : 120;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !lowPowerMode,
      powerPreference: "high-performance",
    });
    const syncRendererQuality = () => {
      lowPowerMode = getLowPowerMode();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, lowPowerMode ? 1 : 1.25));
    };
    syncRendererQuality();
    renderer.setClearAlpha(0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.96;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      140,
    );
    camera.position.set(0, 0, 10);

    const clock = new THREE.Clock();
    const mouse = { x: 0, y: 0 };
    let scrollProgress = 0;
    let prevScrollProgress = 0;
    let scrollSpeed = 0;
    let activeSceneKey = "hero";

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.48);
    const keyLight = new THREE.PointLight(0x304864, 7.2, 42);
    const fillLight = new THREE.PointLight(0x6f8295, 5.1, 36);
    const rimLight = new THREE.PointLight(0xc5cdd3, 4.6, 30);
    keyLight.position.set(4, 4, 6);
    fillLight.position.set(-4, -3, 5);
    rimLight.position.set(0, 5, -3);
    scene.add(ambientLight, keyLight, fillLight, rimLight);

    const lightTargets = {
      hero: {
        key: new THREE.Color(0x304864),
        fill: new THREE.Color(0x6f8295),
        rim: new THREE.Color(0xc5cdd3),
      },
      services: {
        key: new THREE.Color(0x36506a),
        fill: new THREE.Color(0x7e91a3),
        rim: new THREE.Color(0xd0d7dd),
      },
      portfolio: {
        key: new THREE.Color(0x314a64),
        fill: new THREE.Color(0x77889a),
        rim: new THREE.Color(0xcfd6dc),
      },
      pricing: {
        key: new THREE.Color(0x304762),
        fill: new THREE.Color(0x9f8764),
        rim: new THREE.Color(0xd4d8d6),
      },
      about: {
        key: new THREE.Color(0x35506b),
        fill: new THREE.Color(0x74889a),
        rim: new THREE.Color(0xd6dde2),
      },
      contact: {
        key: new THREE.Color(0x3f5e79),
        fill: new THREE.Color(0x808991),
        rim: new THREE.Color(0xd6dce0),
      },
    };

    const makeGlassMaterial = (color, opacity, wireframe = false) => {
      const material = new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity,
        roughness: 0.24,
        metalness: 0.08,
        wireframe,
      });
      material.userData.baseOpacity = opacity;
      return material;
    };

    const makeGlowMaterial = (color, opacity) => {
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
      });
      material.userData.baseOpacity = opacity;
      return material;
    };

    const makePointsMaterial = (color, size, opacity) => {
      const material = new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      material.userData.baseOpacity = opacity;
      return material;
    };

    const makeParticleField = (count, spread, color, size = 0.04, opacity = 0.58) => {
      const geometry = new THREE.BufferGeometry();
      const finalCount = Math.max(24, Math.floor(count * particleMultiplier));
      const positions = new Float32Array(finalCount * 3);
      for (let index = 0; index < finalCount * 3; index += 1) {
        positions[index] = (Math.random() - 0.5) * spread;
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return new THREE.Points(geometry, makePointsMaterial(color, size, opacity));
    };

    const makeHalo = (radius, color, opacity) => {
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(radius, lowPowerMode ? 10 : 14, lowPowerMode ? 8 : 12),
        makeGlowMaterial(color, opacity),
      );
      return halo;
    };

    const makeRibbon = (points, color, opacity, radius = 0.04) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const geometry = new THREE.TubeGeometry(
        curve,
        curveSegments,
        radius,
        lowPowerMode ? 8 : 10,
        true,
      );
      const material = makeGlowMaterial(color, opacity);
      return new THREE.Mesh(geometry, material);
    };

    const makeEllipseLoop = (radiusX, radiusZ, color, opacity, segments = loopSegments) => {
      const points = [];
      for (let index = 0; index < segments; index += 1) {
        const angle = (index / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radiusX, 0, Math.sin(angle) * radiusZ));
      }
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        blending: THREE.AdditiveBlending,
      });
      material.userData.baseOpacity = opacity;
      return new THREE.LineLoop(geometry, material);
    };

    const applyOpacity = (group, opacity) => {
      group.visible = opacity > 0.01;
      if (!group.visible) {
        return;
      }

      group.traverse((item) => {
        if (!item.material) {
          return;
        }

        const materials = Array.isArray(item.material) ? item.material : [item.material];
        materials.forEach((material) => {
          if (material.transparent) {
            material.opacity = (material.userData.baseOpacity ?? 1) * opacity;
          }
        });
      });
    };

    const atmosphereGroup = new THREE.Group();
    [
      { color: 0x4f6782, scale: 1.9, x: -5.2, y: 2.3, z: -7 },
      { color: 0x8f9aaa, scale: 1.5, x: 5.4, y: -2.1, z: -6 },
      { color: 0xc4ccd2, scale: 1.3, x: 0.3, y: 4.4, z: -8 },
    ].forEach((item, index) => {
      const blob = new THREE.Mesh(
        new THREE.IcosahedronGeometry(item.scale, lowPowerMode ? 1 : 2),
        makeGlowMaterial(item.color, 0.055),
      );
      blob.position.set(item.x, item.y, item.z);
      blob.userData = {
        spinX: 0.001 + index * 0.0004,
        spinY: 0.0016 + index * 0.0005,
        drift: 0.18 + index * 0.04,
        originalY: item.y,
        phase: index * 1.8,
      };
      atmosphereGroup.add(blob);
    });
    scene.add(atmosphereGroup);

    const heroGroup = new THREE.Group();
    heroGroup.add(makeHalo(1.35, 0x62788f, 0.04));
    heroGroup.add(makeParticleField(280, 14, 0x7f93ab, 0.016));
    heroGroup.add(makeParticleField(120, 10, 0xc6ced5, 0.011));

    let knowledgeModel = null;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(knowledgeNetworkUrl, (gltf) => {
      knowledgeModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(knowledgeModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 7 / maxDim;
      knowledgeModel.scale.setScalar(scale);
      knowledgeModel.userData.maxDim = maxDim;
      const center = box.getCenter(new THREE.Vector3());
      knowledgeModel.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );
      knowledgeModel.traverse((child) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.transparent = true;
            mat.opacity = 0.35;
            mat.userData.baseOpacity = 0.35;
          });
        }
      });
      heroGroup.add(knowledgeModel);
    });
    scene.add(heroGroup);

    const jupiterGroup = new THREE.Group();
    jupiterGroup.visible = false;
    let jupiterModel = null;
    gltfLoader.load(jupiterUrl, (gltf) => {
      jupiterModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(jupiterModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 7 / maxDim;
      jupiterModel.scale.setScalar(scale);
      jupiterModel.userData.maxDim = maxDim;
      const center = box.getCenter(new THREE.Vector3());
      jupiterModel.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );
      const jupiterPalette = [
        new THREE.Color(0x24466d),
        new THREE.Color(0x4d6684),
        new THREE.Color(0x96a4b4),
        new THREE.Color(0x314c67),
        new THREE.Color(0x5c6877),
      ];
      let colorIndex = 0;
      jupiterModel.traverse((child) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.color.copy(jupiterPalette[colorIndex % jupiterPalette.length]);
            mat.transparent = true;
            mat.opacity = 0.35;
            mat.roughness = 0.35;
            mat.metalness = 0.12;
            mat.depthWrite = false;
            mat.userData.baseOpacity = 0.35;
            colorIndex += 1;
          });
        }
      });
      jupiterGroup.add(jupiterModel);
    });
    jupiterGroup.add(makeParticleField(200, 16, 0x8a9bb0, 0.014));
    jupiterGroup.add(makeHalo(2.2, 0x6a7d90, 0.035));
    scene.add(jupiterGroup);

    const servicesGroup = new THREE.Group();
    let helixModel = null;
    gltfLoader.load(helixNebulaUrl, (gltf) => {
      helixModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(helixModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 7 / maxDim;
      helixModel.scale.setScalar(scale);
      helixModel.userData.maxDim = maxDim;
      const center = box.getCenter(new THREE.Vector3());
      helixModel.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );
      const helixPalette = [
        new THREE.Color(0x24466d),
        new THREE.Color(0x4d6684),
        new THREE.Color(0x96a4b4),
        new THREE.Color(0x314c67),
        new THREE.Color(0x5c6877),
        new THREE.Color(0x132033),
        new THREE.Color(0x7f93ab),
      ];
      let helixColorIndex = 0;
      helixModel.traverse((child) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.color.copy(helixPalette[helixColorIndex % helixPalette.length]);
            mat.transparent = true;
            mat.opacity = 0.35;
            mat.roughness = 0.35;
            mat.metalness = 0.12;
            mat.depthWrite = false;
            mat.userData.baseOpacity = 0.35;
            helixColorIndex += 1;
          });
        }
      });
      servicesGroup.add(helixModel);
    });
    servicesGroup.add(makeParticleField(210, 14, 0x8a9bb0, 0.014, 0.22));
    servicesGroup.add(makeHalo(2.0, 0x6a7d90, 0.035));
    servicesGroup.visible = false;
    scene.add(servicesGroup);

    const kummerGroup = new THREE.Group();
    let kummerModel = null;
    gltfLoader.load(kummerUrl, (gltf) => {
      kummerModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(kummerModel);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 4.5 / maxDim;
      kummerModel.scale.setScalar(scale);
      kummerModel.userData.maxDim = maxDim;
      kummerModel.userData.baseSize = 4.5;
      const center = box.getCenter(new THREE.Vector3());
      kummerModel.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );
      const kummerPalette = [
        new THREE.Color(0x24466d),
        new THREE.Color(0x4d6684),
        new THREE.Color(0x96a4b4),
        new THREE.Color(0x314c67),
        new THREE.Color(0x5c6877),
      ];
      let kummerColorIndex = 0;
      kummerModel.traverse((child) => {
        if (child.isMesh) {
          const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          materials.forEach((mat) => {
            mat.color.copy(kummerPalette[kummerColorIndex % kummerPalette.length]);
            mat.transparent = true;
            mat.opacity = 0.2;
            mat.roughness = 0.35;
            mat.metalness = 0.12;
            mat.depthWrite = false;
            mat.userData.baseOpacity = 0.2;
            kummerColorIndex += 1;
          });
        }
      });
      kummerGroup.add(kummerModel);
    });
    kummerGroup.add(makeParticleField(200, 14, 0x8a9bb0, 0.014));
    kummerGroup.add(makeHalo(2.0, 0x6a7d90, 0.035));
    kummerGroup.visible = false;
    scene.add(kummerGroup);

    const portfolioGroup = new THREE.Group();
    const portfolioLayouts = [
      { position: [-4.1, 1.45, -1.15], size: [2.15, 1.32], color: 0x44627f, rotation: [0.02, 0.34, -0.04] },
      { position: [-1.25, 0.9, -0.2], size: [2.0, 1.24], color: 0x6f8397, rotation: [-0.04, 0.12, 0.05] },
      { position: [1.85, 1.1, 0.25], size: [2.7, 1.58], color: 0xb0bcc7, rotation: [0.03, -0.18, -0.03] },
      { position: [-3.05, -1.25, -0.55], size: [2.3, 1.42], color: 0x4e6a86, rotation: [0.05, 0.22, -0.02] },
      { position: [0.45, -1.02, 0.72], size: [3.0, 1.82], color: 0x8396a8, rotation: [-0.02, -0.08, 0.02] },
      { position: [3.95, -1.35, -0.9], size: [1.95, 1.22], color: 0xc0c8cf, rotation: [0.06, -0.28, 0.05] },
    ];
    const portfolioLinePoints = [];
    portfolioLayouts.forEach((item, index) => {
      const plane = new THREE.PlaneGeometry(item.size[0], item.size[1]);
      const panel = new THREE.Mesh(plane, makeGlassMaterial(item.color, 0.11));
      panel.position.set(item.position[0], item.position[1], item.position[2]);
      panel.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
      panel.userData = {
        isPortfolioPanel: true,
        originalY: item.position[1],
        originalRotationY: item.rotation[1],
        phase: index * 0.72,
      };
      portfolioGroup.add(panel);

      const outline = new THREE.Mesh(plane, makeGlassMaterial(item.color, 0.24, true));
      outline.position.copy(panel.position);
      outline.rotation.copy(panel.rotation);
      outline.userData = panel.userData;
      portfolioGroup.add(outline);

      portfolioLinePoints.push(new THREE.Vector3(item.position[0], item.position[1], item.position[2]));
    });

    const railGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-5.2, 2.05, -1.65),
      new THREE.Vector3(5.2, 1.45, -1.65),
      new THREE.Vector3(-4.8, -0.05, -0.55),
      new THREE.Vector3(4.9, -0.55, -0.55),
      new THREE.Vector3(-4.2, -2.1, 0.55),
      new THREE.Vector3(4.2, -2.55, 0.55),
    ]);
    const railMaterial = new THREE.LineBasicMaterial({
      color: 0x8398ab,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    railMaterial.userData.baseOpacity = 0.1;
    const rails = new THREE.LineSegments(railGeometry, railMaterial);
    rails.userData.isPortfolioRail = true;
    portfolioGroup.add(rails);

    const networkGeometry = new THREE.BufferGeometry().setFromPoints([
      portfolioLinePoints[0], portfolioLinePoints[1],
      portfolioLinePoints[1], portfolioLinePoints[2],
      portfolioLinePoints[1], portfolioLinePoints[4],
      portfolioLinePoints[3], portfolioLinePoints[4],
      portfolioLinePoints[4], portfolioLinePoints[5],
    ]);
    const networkMaterial = new THREE.LineBasicMaterial({
      color: 0x94a7b8,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    });
    networkMaterial.userData.baseOpacity = 0.12;
    const networkLines = new THREE.LineSegments(networkGeometry, networkMaterial);
    networkLines.userData.isPortfolioRail = true;
    portfolioGroup.add(networkLines);
    portfolioGroup.add(makeHalo(1.5, 0x8091a0, 0.03));
    portfolioGroup.add(makeParticleField(220, 13, 0xaebac5, 0.014, 0.22));
    portfolioGroup.visible = false;
    scene.add(portfolioGroup);

    const pricingGroup = new THREE.Group();
    const pricingBaseRing = new THREE.Mesh(
      new THREE.TorusGeometry(4.6, 0.05, 12, torusTubularSegments),
      makeGlowMaterial(0x93a3b2, 0.09),
    );
    pricingBaseRing.rotation.x = Math.PI / 2.22;
    pricingBaseRing.position.y = -1.75;
    pricingBaseRing.userData.isPricingBase = true;
    pricingGroup.add(pricingBaseRing);

    [
      { color: 0x37577a, height: 2.2, x: -3.45 },
      { color: 0x748596, height: 3.2, x: 0 },
      { color: 0xa28764, height: 2.7, x: 3.45 },
    ].forEach((item, index) => {
      const columnGeometry = new THREE.BoxGeometry(1.18, item.height, 1.18);
      const column = new THREE.Mesh(columnGeometry, makeGlassMaterial(item.color, 0.16));
      column.position.set(item.x, item.height / 2 - 1.25, 0);
      column.userData = {
        isPricingColumn: true,
        baseY: item.height / 2 - 1.25,
        phase: index * 1.2,
      };
      pricingGroup.add(column);

      const columnOutline = new THREE.Mesh(columnGeometry, makeGlassMaterial(item.color, 0.24, true));
      columnOutline.position.copy(column.position);
      columnOutline.userData = column.userData;
      pricingGroup.add(columnOutline);

      const cap = new THREE.Mesh(
        new THREE.TorusGeometry(0.95, 0.03, 10, lowPowerMode ? 72 : 96),
        makeGlowMaterial(item.color, 0.16),
      );
      cap.position.set(item.x, item.height - 1.22, 0);
      cap.rotation.x = Math.PI / 2.1;
      cap.userData = {
        isPricingRing: true,
        baseY: item.height - 1.22,
        phase: index * 1.4,
      };
      pricingGroup.add(cap);

      const secondaryRing = new THREE.Mesh(
        new THREE.TorusGeometry(1.42, 0.022, 10, lowPowerMode ? 72 : 96),
        makeGlowMaterial(item.color, 0.1),
      );
      secondaryRing.position.set(item.x, 0.08, 0);
      secondaryRing.rotation.x = Math.PI / (2.4 + index * 0.15);
      secondaryRing.userData = {
        isPricingRing: true,
        baseY: 0.08,
        phase: index * 1.1 + 0.8,
      };
      pricingGroup.add(secondaryRing);
    });
    pricingGroup.add(makeParticleField(170, 11, 0xb7c3cd, 0.013, 0.18));
    pricingGroup.add(makeHalo(1.8, 0x8899a8, 0.03));
    pricingGroup.visible = false;
    scene.add(pricingGroup);

    const aboutGroup = new THREE.Group();
    [
      { radiusX: 4.2, radiusZ: 2.6, color: 0x8ca0b4, opacity: 0.1, rotation: [Math.PI / 2.4, 0.1, 0] },
      { radiusX: 3.1, radiusZ: 1.95, color: 0xa9916e, opacity: 0.08, rotation: [Math.PI / 2.1, 0.55, 0.35] },
      { radiusX: 5.0, radiusZ: 3.0, color: 0xc3ccd3, opacity: 0.08, rotation: [Math.PI / 2.5, -0.48, -0.18] },
    ].forEach((item, index) => {
      const loop = makeEllipseLoop(item.radiusX, item.radiusZ, item.color, item.opacity, 140);
      loop.rotation.set(item.rotation[0], item.rotation[1], item.rotation[2]);
      loop.userData = {
        isAboutLoop: true,
        spinSpeed: 0.0012 + index * 0.0005,
      };
      aboutGroup.add(loop);
    });

    const aboutNodePositions = [];
    for (let index = 0; index < 12; index += 1) {
      const angle = (index / 12) * Math.PI * 2;
      const radiusX = index % 2 === 0 ? 3.55 : 2.55;
      const radiusZ = index % 2 === 0 ? 2.2 : 1.6;
      const y = Math.sin(angle * 1.6) * 0.72;
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(
          index % 3 === 0 ? 0.13 : 0.1,
          lowPowerMode ? 10 : 16,
          lowPowerMode ? 10 : 16,
        ),
        makeGlowMaterial(index % 4 === 0 ? 0xa68f6f : 0x91a5b8, 0.18),
      );
      node.position.set(Math.cos(angle) * radiusX, y, Math.sin(angle) * radiusZ);
      node.userData = {
        isAboutNode: true,
        phase: index * 0.55,
        baseScale: 1,
        baseY: y,
      };
      aboutNodePositions.push(node.position.clone());
      aboutGroup.add(node);
    }

    const aboutConnectionGeometry = new THREE.BufferGeometry().setFromPoints([
      aboutNodePositions[0], aboutNodePositions[2],
      aboutNodePositions[2], aboutNodePositions[5],
      aboutNodePositions[5], aboutNodePositions[7],
      aboutNodePositions[7], aboutNodePositions[10],
      aboutNodePositions[1], aboutNodePositions[4],
      aboutNodePositions[4], aboutNodePositions[8],
      aboutNodePositions[3], aboutNodePositions[9],
      aboutNodePositions[6], aboutNodePositions[11],
    ]);
    const aboutConnectionMaterial = new THREE.LineBasicMaterial({
      color: 0x96a9ba,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
    });
    aboutConnectionMaterial.userData.baseOpacity = 0.09;
    const aboutConnections = new THREE.LineSegments(aboutConnectionGeometry, aboutConnectionMaterial);
    aboutConnections.userData.isAboutConnections = true;
    aboutGroup.add(aboutConnections);
    aboutGroup.add(makeParticleField(280, 12, 0x9db0c1, 0.014, 0.2));
    aboutGroup.add(makeParticleField(120, 8, 0xcfd6db, 0.01, 0.16));
    aboutGroup.add(makeHalo(1.15, 0x8898a8, 0.04));
    aboutGroup.visible = false;
    scene.add(aboutGroup);

    const contactGroup = new THREE.Group();
    const beam = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 4.9, lowPowerMode ? 12 : 18),
      makeGlassMaterial(0x4c6b88, 0.24),
    );
    beam.userData = {
      isContactBeam: true,
      baseScaleY: 1,
    };
    contactGroup.add(beam);

    const beaconCore = new THREE.Mesh(
      new THREE.SphereGeometry(0.36, lowPowerMode ? 12 : 20, lowPowerMode ? 12 : 20),
      makeGlassMaterial(0xa18b67, 0.32),
    );
    beaconCore.userData.isCore = true;
    contactGroup.add(beaconCore);

    [-1.05, 0.15, 1.2].forEach((y, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.95 + index * 0.55, 0.03, 10, lowPowerMode ? 72 : 96),
        makeGlowMaterial(index === 1 ? 0xa79270 : 0x9fb0bf, 0.12 - index * 0.018),
      );
      ring.position.y = y;
      ring.rotation.x = Math.PI / (2.15 + index * 0.22);
      ring.userData = {
        isContactRing: true,
        baseY: y,
        baseScale: 1,
        spinSpeed: 0.0016 + index * 0.0005,
        phase: index * 0.85,
      };
      contactGroup.add(ring);
    });

    const signalGeometry = new THREE.BufferGeometry();
    const signalPositions = new Float32Array(220 * 3);
    for (let index = 0; index < 220; index += 1) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.35 + Math.random() * 0.75;
      signalPositions[index * 3] = Math.cos(angle) * radius;
      signalPositions[index * 3 + 1] = Math.random() * 4.8 - 2.4;
      signalPositions[index * 3 + 2] = Math.sin(angle) * radius;
    }
    signalGeometry.setAttribute("position", new THREE.BufferAttribute(signalPositions, 3));
    const signalField = new THREE.Points(signalGeometry, makePointsMaterial(0xbcc7d0, 0.024, 0.24));
    signalField.userData.isContactSignal = true;
    contactGroup.add(signalField);

    for (let index = 0; index < 5; index += 1) {
      const node = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + index * 0.01, lowPowerMode ? 10 : 14, lowPowerMode ? 10 : 14),
        makeGlowMaterial(index % 2 === 0 ? 0xa48d69 : 0x8fa4b8, 0.16),
      );
      node.userData = {
        isContactOrbiter: true,
        orbitRadius: 1.15 + index * 0.34,
        angleOffset: index * 1.1,
        orbitHeight: -1.2 + index * 0.6,
      };
      contactGroup.add(node);
    }
    contactGroup.add(makeHalo(0.95, 0x8a98a6, 0.04));
    contactGroup.visible = false;
    scene.add(contactGroup);

    const groups = {};

    const currentOpacity = {
      hero: 1,
      services: 0,
      portfolio: 0,
      pricing: 0,
      about: 0,
      contact: 0,
    };

    const targetOpacity = { ...currentOpacity };

    const getActiveScene = () => {
      const markers = [...document.querySelectorAll("[data-scene-marker]")];
      let nextScene = "hero";
      const threshold = window.innerHeight * 0.42;

      markers.forEach((marker) => {
        const top = marker.getBoundingClientRect().top;
        if (top <= threshold) {
          nextScene = marker.dataset.sceneMarker ?? nextScene;
        }
      });

      return nextScene;
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      scrollProgress = window.scrollY / maxScroll;
      activeSceneKey = getActiveScene();
      Object.keys(targetOpacity).forEach((key) => {
        targetOpacity[key] = key === activeSceneKey ? 1 : 0;
      });
    };

    const onPointerMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const resize = () => {
      syncRendererQuality();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };

    resize();
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onPointerMove, { passive: true });
    window.addEventListener("resize", resize);

    let animationFrameId = 0;
    const animate = () => {
      animationFrameId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      atmosphereGroup.children.forEach((blob) => {
        blob.rotation.x += blob.userData.spinX;
        blob.rotation.y += blob.userData.spinY;
        blob.position.y =
          blob.userData.originalY +
          Math.sin(elapsed * blob.userData.drift + blob.userData.phase) * 0.26;
      });

      Object.keys(currentOpacity).forEach((key) => {
        currentOpacity[key] += (targetOpacity[key] - currentOpacity[key]) * 0.028;
        if (currentOpacity[key] < 0.005) currentOpacity[key] = 0;
      });

      scrollSpeed += (Math.abs(scrollProgress - prevScrollProgress) * 60 - scrollSpeed) * 0.06;
      prevScrollProgress = scrollProgress;
      const scrollDrive = Math.min(1, scrollSpeed * 10);

      const modelGroups = [
        {
          group: kummerGroup,
          model: kummerModel,
          opacity: currentOpacity.hero,
        },
        {
          group: jupiterGroup,
          model: jupiterModel,
          opacity: currentOpacity.services,
        },
        {
          group: heroGroup,
          model: knowledgeModel,
          opacity: Math.max(currentOpacity.portfolio, currentOpacity.pricing),
        },
        {
          group: servicesGroup,
          model: helixModel,
          opacity: Math.max(currentOpacity.about, currentOpacity.contact),
        },
      ];

      modelGroups.forEach(({ group, model, opacity }) => {
        group.visible = opacity > 0.01;
        if (!group.visible) return;

        applyOpacity(group, opacity);

        const easeOpacity = opacity * opacity * (3 - 2 * opacity);
        group.scale.setScalar(0.85 + easeOpacity * 0.15);
        group.position.z = (1 - easeOpacity) * 2.5;
        group.position.y += (0 - group.position.y) * 0.03;

        if (model) {
          model.rotation.y += 0.0005 + scrollDrive * 0.015;

          const idlePulse = 1 + Math.sin(elapsed * 0.4) * 0.02;
          const scrollPulse = 1 + scrollDrive * Math.sin(elapsed * 1.4) * 0.06;
          const baseScale = (model.userData.baseSize || 7) / (model.userData.maxDim || 1);
          model.scale.setScalar(baseScale * idlePulse * scrollPulse);

          model.rotation.x +=
            (Math.sin(elapsed * 0.15) * 0.015 - model.rotation.x) * 0.015;
          model.rotation.z +=
            (Math.cos(elapsed * 0.12) * 0.01 - model.rotation.z) * 0.015;
        }

        group.children.forEach((item) => {
          if (item.isPoints) {
            item.rotation.y += 0.00012;
          }
        });
      });

      const targetLight = lightTargets[activeSceneKey];
      keyLight.color.lerp(targetLight.key, 0.04);
      fillLight.color.lerp(targetLight.fill, 0.04);
      rimLight.color.lerp(targetLight.rim, 0.04);

      keyLight.position.set(4, 4, 6);
      fillLight.position.set(-4, -3, 5);
      rimLight.position.set(0, 5, -3);

      const targetCameraZ = 9.4 + scrollProgress * 1.2;
      camera.position.x += (mouse.x * 0.15 - camera.position.x) * 0.02;
      camera.position.y += (-mouse.y * 0.1 - camera.position.y) * 0.02;
      camera.position.z += (targetCameraZ - camera.position.z) * 0.025;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.traverse((item) => {
        if (item.geometry) {
          item.geometry.dispose();
        }
        if (item.material) {
          const materials = Array.isArray(item.material) ? item.material : [item.material];
          materials.forEach((material) => material.dispose());
        }
      });
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
