import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as cloneScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight.js";
import { XRPlanes } from "three/examples/jsm/webxr/XRPlanes.js";

import sofaUrl from "../../3d models/3d_sofa_rendering.glb";
import phoneUrl from "../../3d models/iphone_14_pro_max.glb";
import headsetUrl from "../../3d models/vr_glasses.glb";
import networkUrl from "../../3d models/knowledge_network.glb";
import nebulaUrl from "../../3d models/helix_nebula_the_eye_of_god.glb";
import jupiterUrl from "../../3d models/jupiter.glb";
import kummerUrl from "../../3d models/kummer_surface_k3_flux__papp.glb";

const tempBox = new THREE.Box3();
const tempVectorA = new THREE.Vector3();
const tempVectorB = new THREE.Vector3();
const tempVectorC = new THREE.Vector3();
const tempVectorD = new THREE.Vector3();

const SNAPSHOT_STORAGE_KEY = "morphix-playground-snapshots:v2";
const ROOT_SELECTION_KEY = "__asset__";

const BUILTIN_LIBRARY = [
  {
    key: "headset",
    label: "VR Headset",
    category: "XR hardware",
    description: "Wearable product review and WebXR session testing.",
    fitSize: 3.2,
    source: headsetUrl,
  },
  {
    key: "phone",
    label: "iPhone 14 Pro Max",
    category: "Consumer tech",
    description: "Glass, metal, reflections, and close-up camera studies.",
    fitSize: 3,
    source: phoneUrl,
  },
  {
    key: "sofa",
    label: "Lounge Sofa",
    category: "Furniture",
    description: "Larger silhouette, grounding, and environment staging tests.",
    fitSize: 3.9,
    source: sofaUrl,
  },
  {
    key: "network",
    label: "Knowledge Network",
    category: "Abstract object",
    description: "Complex structure visibility, color separation, and narrative staging.",
    fitSize: 4.3,
    source: networkUrl,
  },
  {
    key: "nebula",
    label: "Helix Nebula",
    category: "Spatial form",
    description: "Volumetric read, atmospheric lighting, and hero reveal testing.",
    fitSize: 4,
    source: nebulaUrl,
  },
  {
    key: "jupiter",
    label: "Jupiter",
    category: "Planetary form",
    description: "Large-scale spherical presentation and motion study.",
    fitSize: 3.7,
    source: jupiterUrl,
  },
  {
    key: "surface",
    label: "Kummer Surface",
    category: "Mathematical geometry",
    description: "Surface complexity, silhouette read, and specular inspection.",
    fitSize: 3.5,
    source: kummerUrl,
  },
];

const ENVIRONMENT_PRESETS = {
  studio: {
    label: "Studio",
    background: "#edf3f8",
    fog: "#edf3f8",
    floor: "#d7e1ea",
    hemiSky: "#f7fbff",
    hemiGround: "#d2dbe4",
    key: "#ffffff",
    fill: "#abc0d4",
    rim: "#ffffff",
    accent: "#c6d8e8",
    grid: "#9eb3c6",
  },
  gallery: {
    label: "Gallery",
    background: "#f4f2ee",
    fog: "#f4f2ee",
    floor: "#ddd3c4",
    hemiSky: "#fffbf5",
    hemiGround: "#d8cdbd",
    key: "#fffdf8",
    fill: "#d6c5af",
    rim: "#ffffff",
    accent: "#eadbc8",
    grid: "#b39c82",
  },
  blueprint: {
    label: "Blueprint",
    background: "#e8eef7",
    fog: "#e8eef7",
    floor: "#cad8e8",
    hemiSky: "#f2f7ff",
    hemiGround: "#b6c8dd",
    key: "#eef6ff",
    fill: "#8aa7c7",
    rim: "#ffffff",
    accent: "#9bb6d5",
    grid: "#7f9bbb",
  },
  contrast: {
    label: "Contrast",
    background: "#ebeff4",
    fog: "#ebeff4",
    floor: "#c6d0db",
    hemiSky: "#fdfefe",
    hemiGround: "#adb9c7",
    key: "#ffffff",
    fill: "#7f9ab5",
    rim: "#ffffff",
    accent: "#d3dee7",
    grid: "#71879d",
  },
  immersive: {
    label: "Immersive",
    background: "#e2e8f4",
    fog: "#e2e8f4",
    floor: "#a9b8d0",
    hemiSky: "#ecf3ff",
    hemiGround: "#90a4c1",
    key: "#eef6ff",
    fill: "#7692b6",
    rim: "#f5f9ff",
    accent: "#b8cae3",
    grid: "#6f88aa",
  },
};

const RENDER_MODES = [
  { value: "native", label: "Native" },
  { value: "clay", label: "Clay" },
  { value: "wireframe", label: "Wireframe" },
  { value: "normals", label: "Normals" },
  { value: "xray", label: "X-Ray" },
];

const CAMERA_VIEWS = [
  { value: "iso", label: "Iso" },
  { value: "front", label: "Front" },
  { value: "side", label: "Side" },
  { value: "top", label: "Top" },
];

const TRANSFORM_MODES = [
  { value: "off", label: "Off" },
  { value: "translate", label: "Move" },
  { value: "rotate", label: "Rotate" },
  { value: "scale", label: "Scale" },
];

const EXPERIENCE_PRESETS = [
  {
    key: "hero-orbit",
    label: "Hero Orbit",
    description: "Presentation-first turntable for clean product review.",
    config: {
      assetKey: "phone",
      environmentKey: "studio",
      renderMode: "native",
      cameraView: "iso",
      autoRotate: true,
      autoRotateSpeed: 0.78,
      showGrid: false,
      showAxes: false,
      showBounds: false,
      showFloor: true,
      showPlanes: true,
      lightIntensity: 1.08,
      exposure: 1.16,
      explodeFactor: 0,
      transformMode: "rotate",
    },
  },
  {
    key: "wire-audit",
    label: "Wire Audit",
    description: "Blueprint-style geometry inspection with stronger structure read.",
    config: {
      assetKey: "network",
      environmentKey: "blueprint",
      renderMode: "wireframe",
      cameraView: "front",
      autoRotate: false,
      autoRotateSpeed: 0.35,
      showGrid: true,
      showAxes: true,
      showBounds: true,
      showFloor: false,
      showPlanes: true,
      lightIntensity: 0.92,
      exposure: 1.02,
      explodeFactor: 0.22,
      transformMode: "off",
    },
  },
  {
    key: "exploded-review",
    label: "Exploded Review",
    description: "Spread structure apart for component-level silhouette checks.",
    config: {
      assetKey: "surface",
      environmentKey: "contrast",
      renderMode: "clay",
      cameraView: "iso",
      autoRotate: false,
      autoRotateSpeed: 0.2,
      showGrid: true,
      showAxes: false,
      showBounds: true,
      showFloor: true,
      showPlanes: true,
      lightIntensity: 1.04,
      exposure: 1.08,
      explodeFactor: 0.34,
      transformMode: "scale",
    },
  },
  {
    key: "xr-placement",
    label: "XR Placement",
    description: "Grounded staging pass before moving into AR or VR.",
    config: {
      assetKey: "headset",
      environmentKey: "immersive",
      renderMode: "native",
      cameraView: "front",
      autoRotate: false,
      autoRotateSpeed: 0.5,
      showGrid: true,
      showAxes: false,
      showBounds: false,
      showFloor: true,
      showPlanes: true,
      lightIntensity: 1.12,
      exposure: 1.18,
      explodeFactor: 0,
      transformMode: "translate",
    },
  },
];

const DEFAULT_VIEWER_TEXT = {
  loading: "Loading model...",
  error: "This model could not be loaded right now.",
  dragHint: "Orbit with drag, zoom with scroll, click to select, and use the gizmo to transform.",
  xrNote: "AR and VR launch on supported browsers and devices with WebXR.",
  arLaunch: "Enter AR",
  arExit: "Exit AR",
  arUnsupported: "AR unavailable",
  vrLaunch: "Enter VR",
  vrExit: "Exit VR",
  vrUnsupported: "VR unavailable",
};

const EMPTY_SCENE_INFO = {
  meshCount: 0,
  materialCount: 0,
  size: { x: "0.00", y: "0.00", z: "0.00" },
  nodes: [],
};

const EMPTY_SELECTION = {
  label: "Scene Root",
  type: "Group",
  path: ROOT_SELECTION_KEY,
  childCount: 0,
  isMesh: false,
};

function cloneInstance(scene) {
  return cloneScene(scene);
}

function disposeMaterial(material) {
  if (!material) return;
  if (material.map) material.map.dispose();
  material.dispose?.();
}

function ensureWorkbenchMaterials(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;

    const sourceMaterials = Array.isArray(node.material) ? node.material : [node.material];
    const originals = sourceMaterials.map((material) => {
      if (!material) return material;
      const clone = material.clone();
      clone.userData.originalTransparent = clone.transparent ?? false;
      clone.userData.originalDepthWrite = clone.depthWrite ?? true;
      return clone;
    });

    node.userData.originalMaterialIsArray = Array.isArray(node.material);
    node.userData.originalMaterials = originals;
    node.userData.runtimeMaterials = [];
    node.material = node.userData.originalMaterialIsArray ? originals : originals[0];
    node.castShadow = true;
    node.receiveShadow = true;
  });
}

function createRenderMaterial(sourceMaterial, mode) {
  switch (mode) {
    case "clay":
      return new THREE.MeshStandardMaterial({
        color: "#d7dde4",
        roughness: 0.92,
        metalness: 0.03,
      });
    case "wireframe":
      return new THREE.MeshBasicMaterial({
        color: "#5a7897",
        wireframe: true,
        transparent: true,
        opacity: 0.95,
      });
    case "normals":
      return new THREE.MeshNormalMaterial();
    case "xray":
      return new THREE.MeshPhysicalMaterial({
        color: "#8eabc8",
        transparent: true,
        opacity: 0.26,
        roughness: 0.14,
        metalness: 0.08,
        transmission: 0.18,
        thickness: 0.5,
        side: THREE.DoubleSide,
      });
    default:
      return sourceMaterial;
  }
}

function applyRenderMode(root, mode) {
  root.traverse((node) => {
    if (!node.isMesh || !node.userData.originalMaterials) return;

    node.userData.runtimeMaterials?.forEach((material) => {
      if (material && !node.userData.originalMaterials.includes(material)) {
        disposeMaterial(material);
      }
    });

    if (mode === "native") {
      node.material = node.userData.originalMaterialIsArray
        ? node.userData.originalMaterials
        : node.userData.originalMaterials[0];
      node.userData.runtimeMaterials = [];
      return;
    }

    const nextMaterials = node.userData.originalMaterials.map((sourceMaterial) =>
      createRenderMaterial(sourceMaterial, mode)
    );

    node.userData.runtimeMaterials = nextMaterials;
    node.material = node.userData.originalMaterialIsArray ? nextMaterials : nextMaterials[0];
  });
}

function disposeWorkbenchMaterials(root) {
  root.traverse((node) => {
    if (!node.isMesh) return;

    node.userData.runtimeMaterials?.forEach(disposeMaterial);
    node.userData.originalMaterials?.forEach(disposeMaterial);
    node.userData.runtimeMaterials = [];
    node.userData.originalMaterials = [];
  });
}

function updateGridAppearance(grid, color, opacity) {
  if (!grid) return;
  const materials = Array.isArray(grid.material) ? grid.material : [grid.material];
  materials.forEach((material) => {
    material.transparent = true;
    material.opacity = opacity;
    if (material.color) {
      material.color.set(color);
    }
  });
}

function buildNodePath(node, stopRoot) {
  const parts = [];
  let current = node;

  while (current && current !== stopRoot) {
    const label = current.name?.trim() || current.type;
    parts.unshift(`${label}:${current.id}`);
    current = current.parent;
  }

  return parts.join("/");
}

function getNodeWorldCenter(node, target) {
  if (node.isMesh && node.geometry) {
    if (!node.geometry.boundingBox) {
      node.geometry.computeBoundingBox();
    }

    target.copy(node.geometry.boundingBox.getCenter(tempVectorA));
    target.applyMatrix4(node.matrixWorld);
    return target;
  }

  tempBox.setFromObject(node);
  return tempBox.getCenter(target);
}

function captureNodeBaseline(node) {
  node.userData.editorBasePosition = node.position.clone();
  node.userData.editorBaseQuaternion = node.quaternion.clone();
  node.userData.editorBaseScale = node.scale.clone();
  node.userData.editorBaseVisible = node.visible;
}

function inspectScene(root) {
  let meshCount = 0;
  let materialCount = 0;
  const nodes = [];

  root.traverse((node) => {
    if (node.isMesh) {
      meshCount += 1;
      const materials = Array.isArray(node.material) ? node.material : [node.material];
      materialCount += materials.filter(Boolean).length;
    }

    if (node === root) {
      return;
    }

    const path = buildNodePath(node, root);
    const label = node.name?.trim() || node.type;
    node.userData.editorPath = path;
    node.userData.editorLabel = label;

    nodes.push({
      path,
      label,
      type: node.type,
      childCount: node.children.length,
      isMesh: Boolean(node.isMesh),
      depth: path.split("/").length,
    });
  });

  tempBox.setFromObject(root);
  const size = tempBox.getSize(tempVectorB);

  return {
    meshCount,
    materialCount,
    size: {
      x: size.x.toFixed(2),
      y: size.y.toFixed(2),
      z: size.z.toFixed(2),
    },
    nodes,
  };
}

function prepareExplodeData(root) {
  root.updateWorldMatrix(true, true);
  tempBox.setFromObject(root);
  const rootSize = tempBox.getSize(tempVectorA);
  const rootCenterWorld = tempBox.getCenter(tempVectorB);
  const rootCenterLocal = root.worldToLocal(rootCenterWorld.clone());
  const scaleBasis = Math.max(rootSize.x, rootSize.y, rootSize.z, 1);
  let seed = 0;

  root.traverse((node) => {
    if (node === root) return;

    captureNodeBaseline(node);
    const worldCenter = getNodeWorldCenter(node, tempVectorC);
    const localCenter = root.worldToLocal(worldCenter.clone());
    const direction = localCenter.sub(rootCenterLocal);
    const distance = direction.length();

    if (direction.lengthSq() < 0.00001) {
      direction.set(
        Math.sin(seed * 1.9),
        0.35 + (seed % 3) * 0.16,
        Math.cos(seed * 1.3)
      );
    }

    direction.normalize();
    node.userData.editorExplodeDirection = direction.clone();
    node.userData.editorExplodeDistance = Math.max(scaleBasis * 0.06, distance * 0.38 + scaleBasis * 0.045);
    seed += 1;
  });
}

function applyExplode(root, factor) {
  root.traverse((node) => {
    if (node === root || !node.userData.editorBasePosition) {
      return;
    }

    node.position.copy(node.userData.editorBasePosition);

    if (factor > 0) {
      node.position.addScaledVector(
        node.userData.editorExplodeDirection ?? tempVectorD.set(0, 1, 0),
        (node.userData.editorExplodeDistance ?? 0.2) * factor
      );
    }
  });

  root.updateWorldMatrix(true, true);
}

function restoreNodeTransforms(root) {
  root.traverse((node) => {
    if (node === root) return;
    if (node.userData.editorBasePosition) {
      node.position.copy(node.userData.editorBasePosition);
    }
    if (node.userData.editorBaseQuaternion) {
      node.quaternion.copy(node.userData.editorBaseQuaternion);
    }
    if (node.userData.editorBaseScale) {
      node.scale.copy(node.userData.editorBaseScale);
    }
    if (typeof node.userData.editorBaseVisible === "boolean") {
      node.visible = node.userData.editorBaseVisible;
    }
  });

  root.updateWorldMatrix(true, true);
}

function isRelatedNode(node, selectedNode) {
  let current = node;
  while (current) {
    if (current === selectedNode) return true;
    current = current.parent;
  }

  current = selectedNode;
  while (current) {
    if (current === node) return true;
    current = current.parent;
  }

  return false;
}

function applyIsolation(root, selectedNode, isolate) {
  root.traverse((node) => {
    if (node === root) return;

    const baseVisible = node.userData.editorBaseVisible ?? true;

    if (!isolate || !selectedNode || selectedNode === root) {
      node.visible = baseVisible;
      return;
    }

    node.visible = baseVisible && isRelatedNode(node, selectedNode);
  });

  root.updateWorldMatrix(true, true);
}

function findNodeByPath(root, path) {
  if (!root || !path) return null;
  let match = null;

  root.traverse((node) => {
    if (node.userData.editorPath === path) {
      match = node;
    }
  });

  return match;
}

function frameCamera({ camera, controls, object, view = "iso", distanceFactor = 2.3 }) {
  tempBox.setFromObject(object);
  const size = tempBox.getSize(tempVectorA);
  const center = tempBox.getCenter(tempVectorB);
  const frameSize = Math.max(size.x, size.y, size.z, 1);
  const distance = frameSize * distanceFactor;

  const direction = new THREE.Vector3();
  switch (view) {
    case "front":
      direction.set(0, 0.16, 1);
      break;
    case "side":
      direction.set(1, 0.18, 0);
      break;
    case "top":
      direction.set(0.001, 1, 0.001);
      break;
    default:
      direction.set(1, 0.68, 1);
  }

  direction.normalize();
  camera.position.copy(center).addScaledVector(direction, distance);
  camera.near = 0.01;
  camera.far = Math.max(40, distance * 8);
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = frameSize * 0.55;
  controls.maxDistance = frameSize * 7;
  controls.update();
}

function createSnapshotLabel(assetLabel) {
  const stamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${assetLabel} · ${stamp}`;
}

function PlaygroundExperience({ viewerText, libraryProducts }) {
  const copy = useMemo(
    () => ({ ...DEFAULT_VIEWER_TEXT, ...(viewerText ?? {}) }),
    [viewerText]
  );
  const builtInLibrary = useMemo(() => {
    const overrides = new Map((libraryProducts ?? []).map((item) => [item.key, item]));
    return BUILTIN_LIBRARY.map((item) => ({
      ...item,
      label: overrides.get(item.key)?.label ?? item.label,
      category: overrides.get(item.key)?.category ?? item.category,
      description: overrides.get(item.key)?.previewNote ?? item.description,
    }));
  }, [libraryProducts]);

  const rootRef = useRef(null);
  const canvasHostRef = useRef(null);
  const fileInputRef = useRef(null);
  const modelCacheRef = useRef(new Map());
  const activeModelRef = useRef(null);
  const activeUploadUrlRef = useRef("");
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const transformControlsRef = useRef(null);
  const workbenchGroupRef = useRef(null);
  const floorRef = useRef(null);
  const gridRef = useRef(null);
  const axesRef = useRef(null);
  const boundsHelperRef = useRef(null);
  const selectionHelperRef = useRef(null);
  const keyLightRef = useRef(null);
  const fillLightRef = useRef(null);
  const rimLightRef = useRef(null);
  const hemiLightRef = useRef(null);
  const xrEstimatedLightRef = useRef(null);
  const xrPlanesRef = useRef(null);
  const timerRef = useRef(null);
  const resizeFrameRef = useRef(0);
  const activeXrModeRef = useRef(null);
  const viewPresetRef = useRef("iso");
  const selectedObjectRef = useRef(null);
  const updateSelectionStateRef = useRef(() => {});
  const animationMixerRef = useRef(null);
  const animationActionsRef = useRef(new Map());
  const transformDraggingRef = useRef(false);
  const pointerDownRef = useRef({ x: 0, y: 0 });
  const autoRotateRef = useRef(true);
  const autoRotateSpeedRef = useRef(0.6);
  const showBoundsRef = useRef(false);
  const showGridRef = useRef(true);
  const showFloorRef = useRef(true);
  const showPlanesRef = useRef(true);
  const animationPlayingRef = useRef(true);
  const animationSpeedRef = useRef(1);
  const xrModeRef = useRef("");
  const statsFrameRef = useRef({
    lastSample: 0,
    frameCount: 0,
  });

  const [assetKey, setAssetKey] = useState("headset");
  const [uploadedAsset, setUploadedAsset] = useState(null);
  const [environmentKey, setEnvironmentKey] = useState("studio");
  const [renderMode, setRenderMode] = useState("native");
  const [transformMode, setTransformMode] = useState("rotate");
  const [cameraView, setCameraView] = useState("iso");
  const [autoRotate, setAutoRotate] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(false);
  const [showBounds, setShowBounds] = useState(false);
  const [showFloor, setShowFloor] = useState(true);
  const [showPlanes, setShowPlanes] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exposure, setExposure] = useState(1.12);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.6);
  const [explodeFactor, setExplodeFactor] = useState(0);
  const [xrSupport, setXrSupport] = useState({ checked: false, ar: false, vr: false });
  const [xrMode, setXrMode] = useState("");
  const [stats, setStats] = useState({
    fps: "--",
    calls: 0,
    triangles: 0,
    geometries: 0,
    textures: 0,
  });
  const [sceneInfo, setSceneInfo] = useState(EMPTY_SCENE_INFO);
  const [selectionInfo, setSelectionInfo] = useState(EMPTY_SELECTION);
  const [selectedPath, setSelectedPath] = useState(ROOT_SELECTION_KEY);
  const [isolateSelection, setIsolateSelection] = useState(false);
  const [nodeQuery, setNodeQuery] = useState("");
  const [availableClips, setAvailableClips] = useState([]);
  const [activeClip, setActiveClip] = useState("");
  const [animationPlaying, setAnimationPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [savedSnapshots, setSavedSnapshots] = useState([]);
  const [actionMessage, setActionMessage] = useState("");
  const [activePresetKey, setActivePresetKey] = useState("");
  const [isDropActive, setIsDropActive] = useState(false);

  const activeAsset = uploadedAsset
    ? uploadedAsset
    : builtInLibrary.find((item) => item.key === assetKey) ?? builtInLibrary[0];

  autoRotateRef.current = autoRotate;
  autoRotateSpeedRef.current = autoRotateSpeed;
  showBoundsRef.current = showBounds;
  showGridRef.current = showGrid;
  showFloorRef.current = showFloor;
  showPlanesRef.current = showPlanes;
  animationPlayingRef.current = animationPlaying;
  animationSpeedRef.current = animationSpeed;
  xrModeRef.current = xrMode;

  const filteredNodes = useMemo(() => {
    const query = nodeQuery.trim().toLowerCase();
    if (!query) return sceneInfo.nodes.slice(0, 120);
    return sceneInfo.nodes
      .filter((node) => {
        const haystack = `${node.label} ${node.type}`.toLowerCase();
        return haystack.includes(query);
      })
      .slice(0, 120);
  }, [nodeQuery, sceneInfo.nodes]);

  const pushActionMessage = (message) => {
    setActionMessage(message);
  };

  const updateSelectionState = (node) => {
    const transformControls = transformControlsRef.current;
    const workbenchGroup = workbenchGroupRef.current;
    const activeModel = activeModelRef.current;
    if (!transformControls || !workbenchGroup || !activeModel) {
      return;
    }

    const focusTarget = node && node !== workbenchGroup ? node : activeModel;
    const transformTarget = node && node !== activeModel ? node : workbenchGroup;

    selectedObjectRef.current = focusTarget;
    transformControls.attach(transformTarget);

    if (focusTarget === activeModel) {
      setSelectedPath(ROOT_SELECTION_KEY);
      setSelectionInfo({
        label: activeAsset?.label ?? "Scene Root",
        type: activeModel.type,
        path: ROOT_SELECTION_KEY,
        childCount: activeModel.children.length,
        isMesh: false,
      });
      return;
    }

    setSelectedPath(focusTarget.userData.editorPath ?? ROOT_SELECTION_KEY);
    setSelectionInfo({
      label: focusTarget.userData.editorLabel ?? focusTarget.name?.trim() ?? focusTarget.type,
      type: focusTarget.type,
      path: focusTarget.userData.editorPath ?? ROOT_SELECTION_KEY,
      childCount: focusTarget.children.length,
      isMesh: Boolean(focusTarget.isMesh),
    });
  };

  updateSelectionStateRef.current = updateSelectionState;

  const frameActiveCamera = (view) => {
    const camera = cameraRef.current;
    const controls = orbitControlsRef.current;
    const model = activeModelRef.current;
    if (!camera || !controls || !model) return;

    viewPresetRef.current = view;
    setCameraView(view);
    frameCamera({
      camera,
      controls,
      object: model,
      view,
      distanceFactor: activeAsset.fitSize ? 0.72 + activeAsset.fitSize * 0.45 : 2.3,
    });
  };

  const focusSelection = () => {
    const camera = cameraRef.current;
    const controls = orbitControlsRef.current;
    const target = selectedObjectRef.current ?? activeModelRef.current;
    if (!camera || !controls || !target) return;

    frameCamera({
      camera,
      controls,
      object: target,
      view: viewPresetRef.current,
      distanceFactor: target === activeModelRef.current ? 2.15 : 1.65,
    });
  };

  const getCurrentConfiguration = () => ({
    assetKey: uploadedAsset ? "upload" : assetKey,
    environmentKey,
    renderMode,
    transformMode,
    cameraView: viewPresetRef.current,
    autoRotate,
    autoRotateSpeed,
    showGrid,
    showAxes,
    showBounds,
    showFloor,
    showPlanes,
    lightIntensity,
    exposure,
    explodeFactor,
    animationSpeed,
    activeClip,
    animationPlaying,
    presetKey: activePresetKey,
    uploadLabel: uploadedAsset?.label ?? "",
  });

  const applyConfiguration = (config) => {
    if (config.assetKey && config.assetKey !== "upload") {
      setUploadedAsset(null);
      setAssetKey(config.assetKey);
    } else if (config.assetKey === "upload" && !uploadedAsset) {
      pushActionMessage("Upload that asset again to restore this snapshot.");
    }

    if (config.environmentKey) setEnvironmentKey(config.environmentKey);
    if (config.renderMode) setRenderMode(config.renderMode);
    if (config.transformMode) setTransformMode(config.transformMode);
    if (typeof config.autoRotate === "boolean") setAutoRotate(config.autoRotate);
    if (typeof config.autoRotateSpeed === "number") setAutoRotateSpeed(config.autoRotateSpeed);
    if (typeof config.showGrid === "boolean") setShowGrid(config.showGrid);
    if (typeof config.showAxes === "boolean") setShowAxes(config.showAxes);
    if (typeof config.showBounds === "boolean") setShowBounds(config.showBounds);
    if (typeof config.showFloor === "boolean") setShowFloor(config.showFloor);
    if (typeof config.showPlanes === "boolean") setShowPlanes(config.showPlanes);
    if (typeof config.lightIntensity === "number") setLightIntensity(config.lightIntensity);
    if (typeof config.exposure === "number") setExposure(config.exposure);
    if (typeof config.explodeFactor === "number") setExplodeFactor(config.explodeFactor);
    if (typeof config.animationSpeed === "number") setAnimationSpeed(config.animationSpeed);
    if (typeof config.animationPlaying === "boolean") setAnimationPlaying(config.animationPlaying);
    if (typeof config.activeClip === "string") setActiveClip(config.activeClip);
    if (typeof config.presetKey === "string") setActivePresetKey(config.presetKey);
    setIsolateSelection(false);
    setNodeQuery("");

    const nextView = config.cameraView ?? viewPresetRef.current;
    viewPresetRef.current = nextView;
    setCameraView(nextView);
    window.requestAnimationFrame(() => {
      frameActiveCamera(nextView);
    });
  };

  const resetTransforms = () => {
    const workbenchGroup = workbenchGroupRef.current;
    const activeModel = activeModelRef.current;
    if (!workbenchGroup || !activeModel) return;

    workbenchGroup.position.set(0, 0, 0);
    workbenchGroup.rotation.set(0, 0, 0);
    workbenchGroup.scale.set(1, 1, 1);
    restoreNodeTransforms(activeModel);
    applyExplode(activeModel, explodeFactor);
    applyIsolation(activeModel, selectedObjectRef.current, isolateSelection);
    focusSelection();
    pushActionMessage("Transforms reset.");
  };

  const restartAnimation = () => {
    const action = animationActionsRef.current.get(activeClip);
    if (!action) return;

    action.reset();
    action.play();
    pushActionMessage("Clip restarted.");
  };

  const exportViewportImage = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const link = document.createElement("a");
    link.href = renderer.domElement.toDataURL("image/png");
    link.download = `morphix-playground-${Date.now()}.png`;
    link.click();
    pushActionMessage("PNG export ready.");
  };

  const copyConfiguration = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getCurrentConfiguration(), null, 2));
      pushActionMessage("Configuration copied.");
    } catch {
      pushActionMessage("Clipboard access was blocked.");
    }
  };

  const saveSnapshot = () => {
    const snapshot = {
      id: `snapshot-${Date.now()}`,
      label: createSnapshotLabel(activeAsset?.label ?? "Scene"),
      config: getCurrentConfiguration(),
    };

    setSavedSnapshots((current) => [snapshot, ...current].slice(0, 6));
    pushActionMessage("Snapshot saved.");
  };

  const handlePresetApply = (preset) => {
    setActivePresetKey(preset.key);
    applyConfiguration({ ...preset.config, presetKey: preset.key });
    pushActionMessage(`${preset.label} loaded.`);
  };

  const handleFileLoad = (file) => {
    if (!file) return;

    const isModelFile = /\.(glb|gltf)$/i.test(file.name);
    if (!isModelFile) {
      pushActionMessage("Use a .glb or .gltf file.");
      return;
    }

    if (activeUploadUrlRef.current) {
      URL.revokeObjectURL(activeUploadUrlRef.current);
      activeUploadUrlRef.current = "";
    }

    const objectUrl = URL.createObjectURL(file);
    activeUploadUrlRef.current = objectUrl;
    setUploadedAsset({
      key: "upload",
      label: file.name.replace(/\.[^/.]+$/, ""),
      category: "Local asset",
      description: "Uploaded from your machine for quick staging, transforms, and review.",
      fitSize: 3.7,
      source: objectUrl,
      sourceType: "upload",
    });
    setActivePresetKey("");
    setSelectedPath(ROOT_SELECTION_KEY);
    setSelectionInfo(EMPTY_SELECTION);
    pushActionMessage("Local asset staged.");
  };

  const clearUpload = () => {
    if (activeUploadUrlRef.current) {
      URL.revokeObjectURL(activeUploadUrlRef.current);
      activeUploadUrlRef.current = "";
    }

    setUploadedAsset(null);
    setAssetKey("headset");
    setActivePresetKey("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
      if (!raw) return;

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setSavedSnapshots(parsed.slice(0, 6));
      }
    } catch {
      setSavedSnapshots([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(savedSnapshots));
    } catch {
      // Ignore quota or privacy mode issues.
    }
  }, [savedSnapshots]);

  useEffect(() => {
    if (!actionMessage) return undefined;
    const timeoutId = window.setTimeout(() => {
      setActionMessage("");
    }, 2200);
    return () => window.clearTimeout(timeoutId);
  }, [actionMessage]);

  useEffect(() => {
    const root = rootRef.current;
    const canvasHost = canvasHostRef.current;
    if (!root || !canvasHost) {
      return undefined;
    }

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.Fog("#edf3f8", 10, 28);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 120);
    camera.position.set(5, 3.5, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearAlpha(1);
    renderer.xr.enabled = true;
    renderer.domElement.style.touchAction = "none";
    canvasHost.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.08;
    orbitControls.autoRotate = autoRotate;
    orbitControls.autoRotateSpeed = autoRotateSpeed;
    orbitControls.enablePan = true;
    orbitControls.minPolarAngle = 0.1;
    orbitControls.maxPolarAngle = Math.PI / 1.92;
    orbitControlsRef.current = orbitControls;

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setMode("rotate");
    transformControls.visible = true;
    transformControls.addEventListener("dragging-changed", (event) => {
      transformDraggingRef.current = event.value;
      orbitControls.enabled = !event.value;
    });
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    const hemiLight = new THREE.HemisphereLight("#f6fbff", "#cad4de", 1.2);
    hemiLight.position.set(0, 8, 0);
    const keyLight = new THREE.DirectionalLight("#ffffff", 2.2);
    keyLight.position.set(6, 8, 7);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -8;
    keyLight.shadow.camera.right = 8;
    keyLight.shadow.camera.top = 8;
    keyLight.shadow.camera.bottom = -8;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 35;
    keyLight.shadow.bias = -0.00015;
    const fillLight = new THREE.DirectionalLight("#abc0d4", 1.25);
    fillLight.position.set(-6, 3, -4);
    const rimLight = new THREE.PointLight("#ffffff", 12, 24, 2);
    rimLight.position.set(0, 5, -6);
    scene.add(hemiLight, keyLight, fillLight, rimLight);
    hemiLightRef.current = hemiLight;
    keyLightRef.current = keyLight;
    fillLightRef.current = fillLight;
    rimLightRef.current = rimLight;

    const workbenchGroup = new THREE.Group();
    scene.add(workbenchGroup);
    workbenchGroupRef.current = workbenchGroup;
    transformControls.attach(workbenchGroup);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(7.5, 96),
      new THREE.ShadowMaterial({ color: "#74869b", opacity: 0.16 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.001;
    floor.receiveShadow = true;
    scene.add(floor);
    floorRef.current = floor;

    const grid = new THREE.GridHelper(10, 10, "#8ea5ba", "#b8c7d4");
    updateGridAppearance(grid, "#8ea5ba", 0.24);
    grid.position.y = 0.001;
    scene.add(grid);
    gridRef.current = grid;

    const axes = new THREE.AxesHelper(2.6);
    axes.visible = false;
    scene.add(axes);
    axesRef.current = axes;

    const boundsHelper = new THREE.BoxHelper(new THREE.Object3D(), "#6088af");
    boundsHelper.visible = false;
    scene.add(boundsHelper);
    boundsHelperRef.current = boundsHelper;

    const selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), "#315f97");
    selectionHelper.visible = false;
    scene.add(selectionHelper);
    selectionHelperRef.current = selectionHelper;

    const xrEstimatedLight = new XREstimatedLight(renderer, true);
    xrEstimatedLight.visible = false;
    scene.add(xrEstimatedLight);
    xrEstimatedLightRef.current = xrEstimatedLight;

    const xrPlanes = new XRPlanes(renderer);
    xrPlanes.visible = false;
    scene.add(xrPlanes);
    xrPlanesRef.current = xrPlanes;

    const timer = new THREE.Timer();
    timer.connect(document);
    timer.reset();
    timerRef.current = timer;

    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height || !cameraRef.current || !rendererRef.current) {
        return;
      }

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height, false);
    };

    const onWindowResize = () => {
      window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(resize);
    };

    const onSessionStart = () => {
      const mode = activeXrModeRef.current ?? "";
      setXrMode(mode);

      if (mode === "immersive-ar") {
        renderer.setClearAlpha(0);
        if (floorRef.current) floorRef.current.visible = false;
        if (gridRef.current) gridRef.current.visible = false;
        if (boundsHelperRef.current) boundsHelperRef.current.visible = false;
        if (selectionHelperRef.current) selectionHelperRef.current.visible = false;
        if (xrEstimatedLightRef.current) xrEstimatedLightRef.current.visible = true;
        if (xrPlanesRef.current) xrPlanesRef.current.visible = showPlanesRef.current;
      }
    };

    const onSessionEnd = () => {
      activeXrModeRef.current = null;
      setXrMode("");
      renderer.setClearAlpha(1);
      if (xrEstimatedLightRef.current) xrEstimatedLightRef.current.visible = false;
      if (xrPlanesRef.current) xrPlanesRef.current.visible = false;
      if (floorRef.current) floorRef.current.visible = showFloorRef.current;
      if (gridRef.current) gridRef.current.visible = showGridRef.current;
      if (boundsHelperRef.current) boundsHelperRef.current.visible = showBoundsRef.current;
    };

    const pickSelection = (event) => {
      const model = activeModelRef.current;
      if (!model || !cameraRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, cameraRef.current);
      const intersections = raycaster.intersectObject(model, true);
      const nextSelection = intersections.find((entry) => entry.object?.isMesh)?.object ?? null;
      updateSelectionStateRef.current(nextSelection);
    };

    const onPointerDown = (event) => {
      pointerDownRef.current = { x: event.clientX, y: event.clientY };
    };

    const onPointerUp = (event) => {
      const deltaX = Math.abs(event.clientX - pointerDownRef.current.x);
      const deltaY = Math.abs(event.clientY - pointerDownRef.current.y);
      if (transformDraggingRef.current || deltaX > 6 || deltaY > 6) {
        return;
      }

      pickSelection(event);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.xr.addEventListener("sessionstart", onSessionStart);
    renderer.xr.addEventListener("sessionend", onSessionEnd);

    resize();

    renderer.setAnimationLoop((time) => {
      timer.update(time);
      const delta = timer.getDelta();

      orbitControls.autoRotate = autoRotateRef.current;
      orbitControls.autoRotateSpeed = autoRotateSpeedRef.current;
      orbitControls.update();

      if (animationMixerRef.current && animationPlayingRef.current) {
        animationMixerRef.current.update(delta * animationSpeedRef.current);
      }

      if (showBoundsRef.current && boundsHelperRef.current && workbenchGroupRef.current) {
        boundsHelperRef.current.setFromObject(workbenchGroupRef.current);
      }

      if (selectionHelperRef.current && selectedObjectRef.current && xrModeRef.current !== "immersive-ar") {
        selectionHelperRef.current.visible = true;
        selectionHelperRef.current.setFromObject(selectedObjectRef.current);
      } else if (selectionHelperRef.current) {
        selectionHelperRef.current.visible = false;
      }

      renderer.render(scene, camera);

      const statsFrame = statsFrameRef.current;
      statsFrame.frameCount += 1;

      if (time - statsFrame.lastSample > 350) {
        const fps = Math.round((statsFrame.frameCount * 1000) / Math.max(time - statsFrame.lastSample, 1));
        statsFrame.frameCount = 0;
        statsFrame.lastSample = time;

        setStats({
          fps,
          calls: renderer.info.render.calls,
          triangles: renderer.info.render.triangles,
          geometries: renderer.info.memory.geometries,
          textures: renderer.info.memory.textures,
        });
      }
    });

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
      window.cancelAnimationFrame(resizeFrameRef.current);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.setAnimationLoop(null);
      renderer.xr.removeEventListener("sessionstart", onSessionStart);
      renderer.xr.removeEventListener("sessionend", onSessionEnd);
      transformControls.dispose();
      orbitControls.dispose();
      timer.dispose();
      xrEstimatedLight.dispose();
      if (renderer.domElement.parentNode === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const workbenchGroup = workbenchGroupRef.current;
    const transformControls = transformControlsRef.current;
    if (!workbenchGroup || !transformControls || !activeAsset) {
      return undefined;
    }

    async function loadAsset() {
      setLoading(true);
      setError("");
      setIsolateSelection(false);
      setSceneInfo(EMPTY_SCENE_INFO);
      setSelectionInfo(EMPTY_SELECTION);
      setSelectedPath(ROOT_SELECTION_KEY);
      setNodeQuery("");
      setAvailableClips([]);
      setActiveClip("");
      selectedObjectRef.current = null;

      if (animationMixerRef.current && activeModelRef.current) {
        animationMixerRef.current.stopAllAction();
        animationMixerRef.current.uncacheRoot(activeModelRef.current);
      }
      animationMixerRef.current = null;
      animationActionsRef.current = new Map();

      if (activeModelRef.current) {
        disposeWorkbenchMaterials(activeModelRef.current);
        workbenchGroup.clear();
        activeModelRef.current = null;
      }

      workbenchGroup.position.set(0, 0, 0);
      workbenchGroup.rotation.set(0, 0, 0);
      workbenchGroup.scale.set(1, 1, 1);
      transformControls.attach(workbenchGroup);

      try {
        let templateScene;
        let animations = [];

        if (activeAsset.sourceType === "upload") {
          const loader = new GLTFLoader();
          const gltf = await loader.loadAsync(activeAsset.source);
          templateScene = gltf.scene;
          animations = gltf.animations ?? [];
        } else {
          const cached = modelCacheRef.current.get(activeAsset.key);
          if (cached) {
            templateScene = cached.scene;
            animations = cached.animations;
          } else {
            const loader = new GLTFLoader();
            const gltf = await loader.loadAsync(activeAsset.source);
            templateScene = gltf.scene;
            animations = gltf.animations ?? [];
            modelCacheRef.current.set(activeAsset.key, {
              scene: templateScene,
              animations,
            });
          }
        }

        if (cancelled) return;

        const instance =
          activeAsset.sourceType === "upload"
            ? templateScene
            : cloneInstance(templateScene);

        ensureWorkbenchMaterials(instance);
        applyRenderMode(instance, renderMode);
        workbenchGroup.add(instance);
        activeModelRef.current = instance;

        tempBox.setFromObject(instance);
        const size = tempBox.getSize(new THREE.Vector3());
        const center = tempBox.getCenter(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z, 0.001);
        const fitScale = (activeAsset.fitSize ?? 3.4) / maxDim;

        instance.scale.setScalar(fitScale);
        instance.position.set(-center.x * fitScale, -tempBox.min.y * fitScale, -center.z * fitScale);
        captureNodeBaseline(instance);
        prepareExplodeData(instance);
        applyExplode(instance, explodeFactor);

        const summary = inspectScene(instance);
        setSceneInfo(summary);
        updateSelectionState(instance);

        if (animations.length) {
          const mixer = new THREE.AnimationMixer(instance);
          const actions = new Map();
          animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            action.clampWhenFinished = false;
            action.setLoop(THREE.LoopRepeat);
            actions.set(clip.name, action);
          });
          animationMixerRef.current = mixer;
          animationActionsRef.current = actions;
          setAvailableClips(animations.map((clip) => clip.name));
          setActiveClip((current) => current && actions.has(current) ? current : animations[0].name);
        }

        frameActiveCamera(viewPresetRef.current);
        setLoading(false);
      } catch {
        if (!cancelled) {
          workbenchGroup.clear();
          activeModelRef.current = null;
          setSceneInfo(EMPTY_SCENE_INFO);
          setSelectionInfo(EMPTY_SELECTION);
          setError(copy.error);
          setLoading(false);
        }
      }
    }

    loadAsset();

    return () => {
      cancelled = true;
    };
  }, [activeAsset, copy.error]);

  useEffect(() => {
    if (!activeModelRef.current) return;
    applyRenderMode(activeModelRef.current, renderMode);
  }, [renderMode]);

  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const floor = floorRef.current;
    const grid = gridRef.current;
    const hemiLight = hemiLightRef.current;
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const rimLight = rimLightRef.current;
    if (!scene || !renderer || !floor || !grid || !hemiLight || !keyLight || !fillLight || !rimLight) {
      return;
    }

    const preset = ENVIRONMENT_PRESETS[environmentKey] ?? ENVIRONMENT_PRESETS.studio;
    scene.background = new THREE.Color(preset.background);
    scene.fog.color.set(preset.fog);
    renderer.toneMappingExposure = exposure;

    floor.material.color.set(preset.floor);
    floor.material.opacity = 0.14 * lightIntensity;
    floor.visible = showFloor && xrMode !== "immersive-ar";

    updateGridAppearance(grid, preset.grid, showGrid ? 0.24 : 0);
    grid.visible = showGrid && xrMode !== "immersive-ar";

    hemiLight.color.set(preset.hemiSky);
    hemiLight.groundColor.set(preset.hemiGround);
    hemiLight.intensity = 1.15 * lightIntensity;

    keyLight.color.set(preset.key);
    keyLight.intensity = 2.2 * lightIntensity;
    fillLight.color.set(preset.fill);
    fillLight.intensity = 1.2 * lightIntensity;
    rimLight.color.set(preset.rim);
    rimLight.intensity = 11 * lightIntensity;
  }, [environmentKey, exposure, lightIntensity, showFloor, showGrid, xrMode]);

  useEffect(() => {
    if (xrPlanesRef.current) {
      xrPlanesRef.current.visible = showPlanes && xrMode === "immersive-ar";
    }
  }, [showPlanes, xrMode]);

  useEffect(() => {
    if (axesRef.current) {
      axesRef.current.visible = showAxes;
    }
  }, [showAxes]);

  useEffect(() => {
    if (boundsHelperRef.current) {
      boundsHelperRef.current.visible = showBounds && xrMode !== "immersive-ar";
      if (showBounds && workbenchGroupRef.current) {
        boundsHelperRef.current.setFromObject(workbenchGroupRef.current);
      }
    }
  }, [showBounds, xrMode]);

  useEffect(() => {
    const transformControls = transformControlsRef.current;
    if (!transformControls) return;
    transformControls.setMode(transformMode === "off" ? "rotate" : transformMode);
    transformControls.visible = transformMode !== "off";
  }, [transformMode]);

  useEffect(() => {
    const activeModel = activeModelRef.current;
    if (!activeModel) return;

    restoreNodeTransforms(activeModel);
    applyExplode(activeModel, explodeFactor);
    applyIsolation(activeModel, selectedObjectRef.current, isolateSelection);
  }, [explodeFactor]);

  useEffect(() => {
    if (!activeModelRef.current) return;
    applyIsolation(activeModelRef.current, selectedObjectRef.current, isolateSelection);
  }, [selectedPath, isolateSelection]);

  useEffect(() => {
    const mixer = animationMixerRef.current;
    const actions = animationActionsRef.current;
    if (!mixer || !actions.size) return;

    actions.forEach((action, name) => {
      if (name === activeClip) {
        action.enabled = true;
        action.reset();
        action.play();
      } else {
        action.stop();
      }
    });
  }, [activeClip]);

  useEffect(() => {
    if (!navigator.xr) {
      setXrSupport({ checked: true, ar: false, vr: false });
      return undefined;
    }

    let cancelled = false;

    async function checkXrSupport() {
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
    return () => {
      if (activeUploadUrlRef.current) {
        URL.revokeObjectURL(activeUploadUrlRef.current);
      }
    };
  }, []);

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
              optionalFeatures: [
                "local-floor",
                "light-estimation",
                "dom-overlay",
                "plane-detection",
              ],
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
      pushActionMessage("XR session could not start on this device.");
    }
  };

  return (
    <div className="playground-editor reveal">
      <aside className="playground-editor-sidebar playground-editor-sidebar-library">
        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Asset Library</span>
            <strong>Switch scenes quickly</strong>
          </div>
          <div className="playground-asset-library">
            {builtInLibrary.map((item) => (
              <button
                key={item.key}
                className={`playground-asset-button ${!uploadedAsset && assetKey === item.key ? "is-active" : ""}`}
                type="button"
                onClick={() => {
                  setUploadedAsset(null);
                  setAssetKey(item.key);
                  setActivePresetKey("");
                }}
              >
                <strong>{item.label}</strong>
                <span>{item.category}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Examples</span>
            <strong>Preset scene recipes</strong>
          </div>
          <p className="playground-editor-panel-copy">
            Jump into advanced review states inspired by editor workflows and examples-style scene exploration.
          </p>
          <div className="playground-example-grid">
            {EXPERIENCE_PRESETS.map((preset) => (
              <button
                key={preset.key}
                className={`playground-example-card ${activePresetKey === preset.key ? "is-active" : ""}`}
                type="button"
                onClick={() => handlePresetApply(preset)}
              >
                <strong>{preset.label}</strong>
                <span>{preset.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Upload</span>
            <strong>Drop your own GLB later</strong>
          </div>
          <p className="playground-editor-panel-copy">
            Use a local `.glb` or `.gltf` file to review custom assets inside the same workbench.
          </p>
          <input
            ref={fileInputRef}
            className="playground-file-input"
            type="file"
            accept=".glb,.gltf,model/gltf-binary"
            onChange={(event) => handleFileLoad(event.target.files?.[0])}
          />
          <div className="playground-upload-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload asset
            </button>
            {uploadedAsset ? (
              <button className="control-pill" type="button" onClick={clearUpload}>
                Clear upload
              </button>
            ) : null}
          </div>
          {uploadedAsset ? (
            <div className="playground-upload-state">
              <strong>{uploadedAsset.label}</strong>
              <span>{uploadedAsset.category}</span>
            </div>
          ) : (
            <div className="playground-upload-state">
              <strong>Drag and drop works too</strong>
              <span>Drop a file anywhere into the viewport.</span>
            </div>
          )}
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Workbench</span>
            <strong>Editor-style tooling</strong>
          </div>
          <ul className="playground-note-list">
            <li>Click-to-select meshes and move between root-level and node-level transforms.</li>
            <li>Exploded review mode for structure reads and component spacing studies.</li>
            <li>Snapshots, config export, PNG export, and scene recipes for fast review loops.</li>
            <li>Animation clip playback, outliner search, and XR launch on supported hardware.</li>
          </ul>
        </div>
      </aside>

      <section className="playground-editor-main">
        <div className="playground-editor-toolbar">
          <div className="playground-toolbar-group">
            <span className="metric-label">Camera</span>
            <div className="control-options">
              {CAMERA_VIEWS.map((item) => (
                <button
                  key={item.value}
                  className={`control-pill ${cameraView === item.value ? "is-active" : ""}`}
                  type="button"
                  onClick={() => frameActiveCamera(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-toolbar-group">
            <span className="metric-label">Transform</span>
            <div className="control-options">
              {TRANSFORM_MODES.map((item) => (
                <button
                  key={item.value}
                  className={`control-pill ${transformMode === item.value ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setTransformMode(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-toolbar-group playground-toolbar-group-wide">
            <span className="metric-label">Render</span>
            <div className="control-options">
              {RENDER_MODES.map((item) => (
                <button
                  key={item.value}
                  className={`control-pill ${renderMode === item.value ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setRenderMode(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="playground-toolbar-group playground-toolbar-group-wide">
            <span className="metric-label">Actions</span>
            <div className="playground-toolbar-actions">
              <button className="control-pill" type="button" onClick={() => updateSelectionState(activeModelRef.current)}>
                Select asset
              </button>
              <button className="control-pill" type="button" onClick={focusSelection}>
                Frame selection
              </button>
              <button className="control-pill" type="button" onClick={resetTransforms}>
                Reset transforms
              </button>
              <button className="control-pill" type="button" onClick={exportViewportImage}>
                Export PNG
              </button>
              <button className="control-pill" type="button" onClick={copyConfiguration}>
                Copy config
              </button>
              <button className="control-pill" type="button" onClick={saveSnapshot}>
                Save snapshot
              </button>
            </div>
          </div>
        </div>

        <div className="playground-viewport-shell">
          <div
            className={`playground-viewport ${isDropActive ? "is-drop-active" : ""}`}
            ref={rootRef}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDropActive(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDropActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              if (event.currentTarget.contains(event.relatedTarget)) return;
              setIsDropActive(false);
            }}
            onDrop={(event) => {
              event.preventDefault();
              setIsDropActive(false);
              handleFileLoad(event.dataTransfer.files?.[0]);
            }}
          >
            <div className="playground-canvas-host" ref={canvasHostRef} />

            <div className="playground-viewport-top">
              <div className="playground-status-stack">
                <span className="stage-badge">Workbench viewport</span>
                <span className="hero-shell-chip">{activeAsset?.label ?? "Asset"}</span>
                <span className="hero-shell-chip">{ENVIRONMENT_PRESETS[environmentKey]?.label ?? "Studio"}</span>
                {selectedPath !== ROOT_SELECTION_KEY ? (
                  <span className="hero-shell-chip">Selection: {selectionInfo.label}</span>
                ) : null}
              </div>

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

            <div className="playground-viewport-bottom">
              <div className="playground-hud-card">
                <span className="metric-label">Hints</span>
                <p>{copy.dragHint}</p>
              </div>
              <div className="playground-hud-stats">
                <div className="playground-hud-stat">
                  <span>FPS</span>
                  <strong>{stats.fps}</strong>
                </div>
                <div className="playground-hud-stat">
                  <span>Calls</span>
                  <strong>{stats.calls}</strong>
                </div>
                <div className="playground-hud-stat">
                  <span>Triangles</span>
                  <strong>{stats.triangles.toLocaleString()}</strong>
                </div>
                <div className="playground-hud-stat">
                  <span>Textures</span>
                  <strong>{stats.textures}</strong>
                </div>
              </div>
            </div>

            {actionMessage ? <div className="playground-viewport-toast">{actionMessage}</div> : null}
            {isDropActive ? (
              <div className="playground-drop-overlay">
                <strong>Drop your model here</strong>
                <span>GLB and GLTF files stage directly into the workbench.</span>
              </div>
            ) : null}
            {loading ? <div className="configurator-viewer-state">{copy.loading}</div> : null}
            {error ? <div className="configurator-viewer-state is-error">{error}</div> : null}
          </div>
        </div>
      </section>

      <aside className="playground-editor-sidebar playground-editor-sidebar-inspector">
        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Inspector</span>
            <strong>{selectionInfo.label}</strong>
          </div>
          <p className="playground-editor-panel-copy">
            {selectedPath === ROOT_SELECTION_KEY
              ? activeAsset?.description
              : "Use the gizmo on this selected node, isolate it, or frame it for a more precise review."}
          </p>
          <div className="playground-summary-list">
            <div className="playground-summary-row">
              <span>Selection type</span>
              <strong>{selectionInfo.type}</strong>
            </div>
            <div className="playground-summary-row">
              <span>Children</span>
              <strong>{selectionInfo.childCount}</strong>
            </div>
            <div className="playground-summary-row">
              <span>Meshes</span>
              <strong>{sceneInfo.meshCount}</strong>
            </div>
            <div className="playground-summary-row">
              <span>Materials</span>
              <strong>{sceneInfo.materialCount}</strong>
            </div>
            <div className="playground-summary-row">
              <span>Bounds</span>
              <strong>{sceneInfo.size.x} × {sceneInfo.size.y} × {sceneInfo.size.z}</strong>
            </div>
          </div>
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Scene Tuning</span>
            <strong>Environment and pacing</strong>
          </div>
          <div className="control-group">
            <span className="control-label">Environment</span>
            <div className="control-options">
              {Object.entries(ENVIRONMENT_PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  className={`control-pill ${environmentKey === key ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setEnvironmentKey(key)}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <label className="playground-slider">
            <span>Exposure</span>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.02"
              value={exposure}
              onChange={(event) => setExposure(Number(event.target.value))}
            />
            <strong>{exposure.toFixed(2)}</strong>
          </label>

          <label className="playground-slider">
            <span>Light intensity</span>
            <input
              type="range"
              min="0.55"
              max="1.6"
              step="0.05"
              value={lightIntensity}
              onChange={(event) => setLightIntensity(Number(event.target.value))}
            />
            <strong>{lightIntensity.toFixed(2)}</strong>
          </label>

          <label className="playground-slider">
            <span>Auto-rotate speed</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={autoRotateSpeed}
              onChange={(event) => setAutoRotateSpeed(Number(event.target.value))}
            />
            <strong>{autoRotateSpeed.toFixed(2)}</strong>
          </label>

          <label className="playground-slider">
            <span>Explode</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={explodeFactor}
              onChange={(event) => setExplodeFactor(Number(event.target.value))}
            />
            <strong>{explodeFactor.toFixed(2)}</strong>
          </label>
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Animation</span>
            <strong>Clip playback</strong>
          </div>
          {availableClips.length ? (
            <>
              <div className="control-group">
                <span className="control-label">Clip</span>
                <div className="control-options">
                  {availableClips.map((clipName) => (
                    <button
                      key={clipName}
                      className={`control-pill ${activeClip === clipName ? "is-active" : ""}`}
                      type="button"
                      onClick={() => setActiveClip(clipName)}
                    >
                      {clipName}
                    </button>
                  ))}
                </div>
              </div>

              <div className="playground-toggle-grid">
                <button
                  className={`control-pill ${animationPlaying ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setAnimationPlaying((value) => !value)}
                >
                  {animationPlaying ? "Pause" : "Play"}
                </button>
                <button className="control-pill" type="button" onClick={restartAnimation}>
                  Restart clip
                </button>
              </div>

              <label className="playground-slider">
                <span>Playback speed</span>
                <input
                  type="range"
                  min="0.2"
                  max="2"
                  step="0.05"
                  value={animationSpeed}
                  onChange={(event) => setAnimationSpeed(Number(event.target.value))}
                />
                <strong>{animationSpeed.toFixed(2)}</strong>
              </label>
            </>
          ) : (
            <p className="playground-editor-panel-copy">
              This asset does not currently expose animation clips, but the workbench is ready for them when you add animated GLBs later.
            </p>
          )}
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Helpers</span>
            <strong>Debug visibility</strong>
          </div>
          <div className="playground-toggle-grid">
            <button
              className={`control-pill ${autoRotate ? "is-active" : ""}`}
              type="button"
              onClick={() => setAutoRotate((value) => !value)}
            >
              Auto rotate
            </button>
            <button
              className={`control-pill ${showGrid ? "is-active" : ""}`}
              type="button"
              onClick={() => setShowGrid((value) => !value)}
            >
              Grid
            </button>
            <button
              className={`control-pill ${showAxes ? "is-active" : ""}`}
              type="button"
              onClick={() => setShowAxes((value) => !value)}
            >
              Axes
            </button>
            <button
              className={`control-pill ${showBounds ? "is-active" : ""}`}
              type="button"
              onClick={() => setShowBounds((value) => !value)}
            >
              Bounds
            </button>
            <button
              className={`control-pill ${showFloor ? "is-active" : ""}`}
              type="button"
              onClick={() => setShowFloor((value) => !value)}
            >
              Floor
            </button>
            <button
              className={`control-pill ${showPlanes ? "is-active" : ""}`}
              type="button"
              onClick={() => setShowPlanes((value) => !value)}
            >
              XR planes
            </button>
            <button
              className={`control-pill ${isolateSelection ? "is-active" : ""}`}
              type="button"
              onClick={() => setIsolateSelection((value) => !value)}
            >
              Isolate selection
            </button>
          </div>
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Snapshots</span>
            <strong>Recent scene states</strong>
          </div>
          {savedSnapshots.length ? (
            <div className="playground-snapshot-list">
              {savedSnapshots.map((snapshot) => (
                <div className="playground-snapshot-row" key={snapshot.id}>
                  <button
                    className="playground-snapshot-button"
                    type="button"
                    onClick={() => applyConfiguration(snapshot.config)}
                  >
                    <strong>{snapshot.label}</strong>
                    <span>{snapshot.config.assetKey === "upload" ? snapshot.config.uploadLabel || "Upload" : snapshot.config.assetKey}</span>
                  </button>
                  <button
                    className="control-pill"
                    type="button"
                    onClick={() => {
                      setSavedSnapshots((current) => current.filter((item) => item.id !== snapshot.id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="playground-editor-panel-copy">
              Save a few states to jump between camera, render, helper, and pacing setups during review.
            </p>
          )}
        </div>

        <div className="playground-editor-panel">
          <div className="playground-editor-panel-head">
            <span className="metric-label">Outliner</span>
            <strong>Scene nodes</strong>
          </div>
          <input
            className="playground-search-input"
            type="text"
            value={nodeQuery}
            onChange={(event) => setNodeQuery(event.target.value)}
            placeholder="Search nodes"
          />
          <div className="playground-outliner">
            {filteredNodes.length ? (
              filteredNodes.map((node, index) => (
                <button
                  className={`playground-outliner-row ${selectedPath === node.path ? "is-selected" : ""}`}
                  key={node.path}
                  type="button"
                  onClick={() => {
                    const nextNode = findNodeByPath(activeModelRef.current, node.path);
                    if (nextNode) {
                      updateSelectionState(nextNode);
                    }
                  }}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="playground-outliner-meta">
                    <strong>{node.label}</strong>
                    <small>
                      {node.type}
                      {node.isMesh ? " · Mesh" : ""}
                      {node.childCount ? ` · ${node.childCount} child` : ""}
                    </small>
                  </div>
                </button>
              ))
            ) : (
              <p className="playground-editor-panel-copy">Load an asset to inspect the current scene graph.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default PlaygroundExperience;
