import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import sofaUrl from "../../3d models/3d_sofa_rendering.glb";
import phoneUrl from "../../3d models/iphone_14_pro_max.glb";
import headsetUrl from "../../3d models/vr_glasses.glb";

const MODEL_SOURCES = {
  sofa: sofaUrl,
  phone: phoneUrl,
  headset: headsetUrl,
};

const SIZE_SCALE_MAP = {
  sofa: {
    compact: 0.88,
    standard: 1,
    expansive: 1.14,
  },
  phone: {
    pocket: 0.9,
    standard: 1,
    hero: 1.12,
  },
  headset: {
    compact: 0.92,
    standard: 1,
    extended: 1.1,
  },
};

const FINISH_TINT_MAP = {
  sofa: {
    graphite: "#6f7983",
    sand: "#d8d0c6",
    sage: "#7d8977",
  },
  phone: {
    graphite: "#5c6470",
    silver: "#d4d9e1",
    blue: "#5d708e",
  },
  headset: {
    carbon: "#4d5663",
    frost: "#d6dde6",
    neon: "#6f8ffc",
  },
};

const FEATURE_PRESETS = {
  sofa: {
    lounge: { rotationY: -0.45, cameraHeight: 0.54, cameraDistance: 2.25, accent: "#d9cdb8" },
    detail: { rotationY: 0.22, cameraHeight: 0.62, cameraDistance: 1.92, accent: "#8ba0b2" },
    styling: { rotationY: 0.95, cameraHeight: 0.58, cameraDistance: 2.1, accent: "#7d8977" },
  },
  phone: {
    camera: { rotationY: 0.82, cameraHeight: 0.56, cameraDistance: 2.45, accent: "#7a90b2" },
    display: { rotationY: -0.16, cameraHeight: 0.55, cameraDistance: 2.15, accent: "#99c7ff" },
    frame: { rotationY: 0.36, cameraHeight: 0.52, cameraDistance: 2.3, accent: "#bec6d1" },
  },
  headset: {
    gaming: { rotationY: -0.38, cameraHeight: 0.58, cameraDistance: 2.2, accent: "#7d8cff" },
    productivity: { rotationY: 0.18, cameraHeight: 0.6, cameraDistance: 2.04, accent: "#8ba0b2" },
    demo: { rotationY: 0.86, cameraHeight: 0.56, cameraDistance: 2.18, accent: "#d5c4a2" },
  },
};

const ENVIRONMENT_LIGHTING = {
  loft: { background: "#eef1f3", hemisphere: "#f8f4ef", ground: "#d7d1c7", directional: "#ffffff" },
  showroom: { background: "#edf1f7", hemisphere: "#eef4ff", ground: "#d1dae7", directional: "#ffffff" },
  editorial: { background: "#f4f2ee", hemisphere: "#fff7f0", ground: "#ddd4c7", directional: "#ffffff" },
  studio: { background: "#eef2f8", hemisphere: "#eef6ff", ground: "#d5deea", directional: "#ffffff" },
  retail: { background: "#f2f4f7", hemisphere: "#f7f7fa", ground: "#d6dde7", directional: "#ffffff" },
  night: { background: "#dce2ec", hemisphere: "#dfe8f5", ground: "#9ba8bd", directional: "#eef5ff" },
  stage: { background: "#edf2f8", hemisphere: "#e6f1ff", ground: "#c8d5e3", directional: "#ffffff" },
  lab: { background: "#f0f4f8", hemisphere: "#f4fbff", ground: "#dbe3ec", directional: "#ffffff" },
  immersive: { background: "#e6eaf5", hemisphere: "#dde4ff", ground: "#b4bfd8", directional: "#eef2ff" },
};

const DEFAULT_VIEWER_TEXT = {
  loading: "Loading model...",
  error: "This model could not be loaded right now.",
  dragHint: "Drag to orbit. Scroll or pinch to zoom.",
  xrNote: "AR and VR launch on supported browsers and devices with WebXR.",
  arLaunch: "Enter AR",
  arExit: "Exit AR",
  arUnsupported: "AR unavailable",
  vrLaunch: "Enter VR",
  vrExit: "Exit VR",
  vrUnsupported: "VR unavailable",
};

function cloneInstance(scene) {
  return cloneScene(scene);
}

function ensureMaterialClones(root) {
  root.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    const clonedMaterials = materials.map((material) => {
      if (!material) {
        return material;
      }

      const nextMaterial = material.clone();
      if (nextMaterial.color && !nextMaterial.userData.baseColor) {
        nextMaterial.userData.baseColor = nextMaterial.color.clone();
      }
      return nextMaterial;
    });

    node.material = Array.isArray(node.material) ? clonedMaterials : clonedMaterials[0];
    node.castShadow = true;
    node.receiveShadow = true;
  });
}

function applyMaterialTint(root, tintValue, accentValue) {
  const tint = new THREE.Color(tintValue);
  const accent = new THREE.Color(accentValue);

  root.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((material) => {
      if (!material || !material.color) {
        return;
      }

      const baseColor = material.userData.baseColor ?? material.color.clone();
      material.userData.baseColor = baseColor;
      material.color.copy(baseColor).lerp(tint, material.map ? 0.12 : 0.34);

      if ("emissive" in material && material.emissive) {
        material.emissive.copy(accent).multiplyScalar(0.08);
      }

      material.needsUpdate = true;
    });
  });
}

function disposeInstanceMaterials(root) {
  root.traverse((node) => {
    if (!node.isMesh) {
      return;
    }

    const materials = Array.isArray(node.material) ? node.material : [node.material];
    materials.forEach((material) => {
      if (material?.dispose) {
        material.dispose();
      }
    });
  });
}

function focusCamera({ camera, controls, size, preset }) {
  const frameSize = Math.max(size.x, size.y, size.z, 1);
  const distance = frameSize * (preset?.cameraDistance ?? 2.2);
  const height = size.y * (preset?.cameraHeight ?? 0.56) + frameSize * 0.18;

  controls.target.set(0, size.y * 0.36, 0);
  camera.position.set(distance, height, distance);
  camera.near = 0.01;
  camera.far = Math.max(40, distance * 8);
  camera.updateProjectionMatrix();
  controls.minDistance = frameSize * 1.05;
  controls.maxDistance = frameSize * 5;
  controls.update();
}

function ConfiguratorExperience({ product, selections, viewerText }) {
  const copy = useMemo(() => ({ ...DEFAULT_VIEWER_TEXT, ...(viewerText ?? {}) }), [viewerText]);
  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const controlsRef = useRef(null);
  const productGroupRef = useRef(null);
  const floorRef = useRef(null);
  const keyLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  const activeModelRef = useRef(null);
  const activeXrModeRef = useRef(null);
  const resizeFrameRef = useRef(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [xrSupport, setXrSupport] = useState({ checked: false, ar: false, vr: false });
  const [xrMode, setXrMode] = useState("");

  useEffect(() => {
    const root = rootRef.current;
    const canvasHost = canvasRef.current;
    if (!root || !canvasHost) {
      return undefined;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, 1, 0.01, 120);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.xr.enabled = true;
    renderer.setClearAlpha(0);
    canvasHost.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;
    controls.enablePan = false;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = Math.PI / 1.72;
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight("#ffffff", 1.15);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight("#f5f7fb", "#c2cedd", 1.25);
    hemiLight.position.set(0, 8, 0);
    hemiLightRef.current = hemiLight;
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight("#ffffff", 1.8);
    keyLight.position.set(6, 9, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0001;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 28;
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLightRef.current = keyLight;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#cddaf3", 0.65);
    fillLight.position.set(-6, 4, -6);
    scene.add(fillLight);

    const productGroup = new THREE.Group();
    productGroupRef.current = productGroup;
    scene.add(productGroup);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(5.5, 72),
      new THREE.ShadowMaterial({ color: "#657487", opacity: 0.16 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.001;
    floor.receiveShadow = true;
    floorRef.current = floor;
    scene.add(floor);

    const resize = () => {
      if (!root || !cameraRef.current || !rendererRef.current) {
        return;
      }

      const { width, height } = root.getBoundingClientRect();
      if (!width || !height) {
        return;
      }

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height, false);
    };

    resize();

    const onSessionStart = () => {
      setXrMode(activeXrModeRef.current ?? "");
      if (activeXrModeRef.current === "immersive-ar") {
        renderer.setClearAlpha(0);
        if (floorRef.current) {
          floorRef.current.visible = false;
        }
      }
    };

    const onSessionEnd = () => {
      setXrMode("");
      activeXrModeRef.current = null;
      if (floorRef.current) {
        floorRef.current.visible = true;
      }
    };

    renderer.xr.addEventListener("sessionstart", onSessionStart);
    renderer.xr.addEventListener("sessionend", onSessionEnd);

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    const onWindowResize = () => {
      window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(resize);
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.cancelAnimationFrame(resizeFrameRef.current);
      renderer.setAnimationLoop(null);
      renderer.xr.removeEventListener("sessionstart", onSessionStart);
      renderer.xr.removeEventListener("sessionend", onSessionEnd);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function checkXrSupport() {
      if (!navigator.xr) {
        if (!cancelled) {
          setXrSupport({ checked: true, ar: false, vr: false });
        }
        return;
      }

      try {
        const [ar, vr] = await Promise.all([
          navigator.xr.isSessionSupported("immersive-ar"),
          navigator.xr.isSessionSupported("immersive-vr"),
        ]);

        if (!cancelled) {
          setXrSupport({ checked: true, ar, vr });
        }
      } catch {
        if (!cancelled) {
          setXrSupport({ checked: true, ar: false, vr: false });
        }
      }
    }

    checkXrSupport();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const productGroup = productGroupRef.current;
    if (!productGroup) {
      return undefined;
    }

    async function loadActiveModel() {
      const source = MODEL_SOURCES[product.key];
      if (!source) {
        setError(copy.error);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      if (activeModelRef.current) {
        disposeInstanceMaterials(activeModelRef.current);
        activeModelRef.current = null;
      }
      productGroup.clear();

      try {
        let templateScene = modelCacheRef.current.get(product.key);
        if (!templateScene) {
          const loader = new GLTFLoader();
          const gltf = await loader.loadAsync(source);
          templateScene = gltf.scene;
          modelCacheRef.current.set(product.key, templateScene);
        }

        if (cancelled) {
          return;
        }

        const instance = cloneInstance(templateScene);
        ensureMaterialClones(instance);
        productGroup.add(instance);
        activeModelRef.current = instance;
        setLoading(false);
      } catch {
        if (!cancelled) {
          productGroup.clear();
          activeModelRef.current = null;
          setError(copy.error);
          setLoading(false);
        }
      }
    }

    loadActiveModel();

    return () => {
      cancelled = true;
      if (activeModelRef.current) {
        disposeInstanceMaterials(activeModelRef.current);
        activeModelRef.current = null;
      }
    };
  }, [copy.error, product.key]);

  useEffect(() => {
    const model = activeModelRef.current;
    const productGroup = productGroupRef.current;
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const keyLight = keyLightRef.current;
    const hemiLight = hemiLightRef.current;
    const floor = floorRef.current;

    if (!model || !productGroup || !camera || !controls || !keyLight || !hemiLight || !floor) {
      return;
    }

    const featurePreset = FEATURE_PRESETS[product.key]?.[selections.feature] ?? {};
    const tint = FINISH_TINT_MAP[product.key]?.[selections.finish] ?? "#8193a3";
    const accent = featurePreset.accent ?? tint;
    const sizeScale = SIZE_SCALE_MAP[product.key]?.[selections.size] ?? 1;
    const environmentTheme =
      ENVIRONMENT_LIGHTING[selections.environment] ?? ENVIRONMENT_LIGHTING.loft;

    applyMaterialTint(model, tint, accent);

    model.rotation.set(0, featurePreset.rotationY ?? 0, 0);
    model.position.set(0, 0, 0);
    model.scale.setScalar(1);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 0.001);
    const baseScale = (product.key === "phone" ? 2.45 : 3.2) / maxDim;
    const finalScale = baseScale * sizeScale;

    model.scale.setScalar(finalScale);
    model.position.set(-center.x * finalScale, -box.min.y * finalScale, -center.z * finalScale);

    const scaledSize = size.multiplyScalar(finalScale);
    focusCamera({
      camera,
      controls,
      size: scaledSize,
      preset: featurePreset,
    });

    keyLight.color.set(environmentTheme.directional);
    hemiLight.color.set(environmentTheme.hemisphere);
    hemiLight.groundColor.set(environmentTheme.ground);
    floor.material.color.set(environmentTheme.ground);
    floor.material.opacity = selections.environment === "night" ? 0.24 : 0.16;
  }, [product, selections]);

  const launchXrSession = async (mode) => {
    const renderer = rendererRef.current;
    if (!renderer || !navigator.xr) {
      return;
    }

    const activeSession = renderer.xr.getSession();
    if (activeSession) {
      if (xrMode === mode) {
        await activeSession.end();
      }
      return;
    }

    try {
      const init =
        mode === "immersive-ar"
          ? {
              optionalFeatures: ["local-floor", "light-estimation", "dom-overlay"],
              domOverlay: { root: rootRef.current },
            }
          : {
              optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
            };

      activeXrModeRef.current = mode;
      const session = await navigator.xr.requestSession(mode, init);
      await renderer.xr.setSession(session);
      setXrMode(mode);
    } catch {
      activeXrModeRef.current = null;
      setXrMode("");
    }
  };

  return (
    <div className={`configurator-viewer env-${selections.environment}`} ref={rootRef}>
      <div className="configurator-canvas" ref={canvasRef} />

      <div className="configurator-viewer-topbar">
        <div className="configurator-xr-actions">
          <button
            className={`configurator-xr-button ${xrMode === "immersive-ar" ? "is-active" : ""}`}
            type="button"
            disabled={!xrSupport.checked || !xrSupport.ar}
            onClick={() => launchXrSession("immersive-ar")}
            title={copy.xrNote}
          >
            {xrSupport.ar
              ? xrMode === "immersive-ar"
                ? copy.arExit
                : copy.arLaunch
              : copy.arUnsupported}
          </button>
          <button
            className={`configurator-xr-button ${xrMode === "immersive-vr" ? "is-active" : ""}`}
            type="button"
            disabled={!xrSupport.checked || !xrSupport.vr}
            onClick={() => launchXrSession("immersive-vr")}
            title={copy.xrNote}
          >
            {xrSupport.vr
              ? xrMode === "immersive-vr"
                ? copy.vrExit
                : copy.vrLaunch
              : copy.vrUnsupported}
          </button>
        </div>
      </div>

      <div className="configurator-viewer-meta">
        <p className="configurator-viewer-note">{product.previewNote}</p>
        <span className="configurator-viewer-hint">{copy.dragHint}</span>
      </div>

      {loading ? <div className="configurator-viewer-state">{copy.loading}</div> : null}
      {error ? <div className="configurator-viewer-state is-error">{error}</div> : null}
    </div>
  );
}

export default ConfiguratorExperience;
