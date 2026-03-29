import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
import { TDSLoader } from "three/examples/jsm/loaders/TDSLoader.js";
import { clone as cloneScene } from "three/examples/jsm/utils/SkeletonUtils.js";
import { XREstimatedLight } from "three/examples/jsm/webxr/XREstimatedLight.js";
import { XRPlanes } from "three/examples/jsm/webxr/XRPlanes.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

import sofaUrl from "../../3d models/3d_sofa_rendering.glb";
import phoneUrl from "../../3d models/iphone_14_pro_max.glb";
import headsetUrl from "../../3d models/vr_glasses.glb";
import networkUrl from "../../3d models/knowledge_network.glb";
import nebulaUrl from "../../3d models/helix_nebula_the_eye_of_god.glb";
import jupiterUrl from "../../3d models/jupiter.glb";
import kummerUrl from "../../3d models/kummer_surface_k3_flux__papp.glb";

/* ── temp math objects ── */
const tempBox = new THREE.Box3();
const tempVectorA = new THREE.Vector3();
const tempVectorB = new THREE.Vector3();
const tempVectorC = new THREE.Vector3();
const tempVectorD = new THREE.Vector3();

const SNAPSHOT_STORAGE_KEY = "morphix-playground-snapshots:v2";
const ROOT_SELECTION_KEY = "__asset__";
const DIRECT_UPLOAD_EXTENSIONS = new Set(["glb", "gltf", "fbx", "dae", "3ds"]);
const CONVERSION_REQUIRED_EXTENSIONS = new Set(["skp", "dwg"]);
const UPLOAD_ACCEPT_ATTR = ".glb,.gltf,.fbx,.dae,.3ds,.skp,.dwg,model/gltf-binary";

/* ── built-in asset library ── */
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

/* ── environment presets ── */
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
  midnight: {
    label: "Midnight",
    background: "#1a1e2e",
    fog: "#1a1e2e",
    floor: "#0e1118",
    hemiSky: "#2a3045",
    hemiGround: "#0d1018",
    key: "#6b8aad",
    fill: "#2a3858",
    rim: "#8eaacc",
    accent: "#1e2538",
    grid: "#2a3552",
  },
  sunset: {
    label: "Sunset",
    background: "#f5e6d8",
    fog: "#f5e6d8",
    floor: "#e0c4a8",
    hemiSky: "#fff0e0",
    hemiGround: "#d4a880",
    key: "#ffe8cc",
    fill: "#c89060",
    rim: "#ffddbb",
    accent: "#e8c8a0",
    grid: "#c4a080",
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

/* ── render modes ── */
const RENDER_MODES = [
  { value: "native", label: "Lit" },
  { value: "clay", label: "Clay" },
  { value: "wireframe", label: "Wire" },
  { value: "normals", label: "Normal" },
  { value: "xray", label: "X-Ray" },
];

/* ── camera views ── */
const CAMERA_VIEWS = [
  { value: "iso", label: "Persp", shortcut: "4" },
  { value: "front", label: "Front", shortcut: "1" },
  { value: "side", label: "Right", shortcut: "2" },
  { value: "top", label: "Top", shortcut: "3" },
];

/* ── transform gizmo modes ── */
const TRANSFORM_MODES = [
  { value: "off", label: "Select", shortcut: "Q" },
  { value: "translate", label: "Move", shortcut: "W" },
  { value: "rotate", label: "Rotate", shortcut: "E" },
  { value: "scale", label: "Scale", shortcut: "R" },
];

/* ── experience presets ── */
const EXPERIENCE_PRESETS = [
  {
    key: "hero-orbit",
    label: "Hero Orbit",
    description: "Presentation turntable.",
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
    description: "Blueprint geometry inspection.",
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
    description: "Component spacing study.",
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
    description: "Grounded AR/VR staging.",
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
  {
    key: "midnight-glow",
    label: "Midnight Glow",
    description: "Dark scene with bloom.",
    config: {
      assetKey: "nebula",
      environmentKey: "midnight",
      renderMode: "native",
      cameraView: "iso",
      autoRotate: true,
      autoRotateSpeed: 0.4,
      showGrid: false,
      showAxes: false,
      showBounds: false,
      showFloor: false,
      showPlanes: false,
      lightIntensity: 1.2,
      exposure: 1.3,
      explodeFactor: 0,
      transformMode: "off",
    },
  },
];

const RAL_COLOR_OPTIONS = [
  { key: "ral-9016", code: "RAL 9016", label: "Traffic white", hex: "#F1F0EA" },
  { key: "ral-7035", code: "RAL 7035", label: "Light grey", hex: "#C5C7C4" },
  { key: "ral-7016", code: "RAL 7016", label: "Anthracite grey", hex: "#383E42" },
  { key: "ral-3020", code: "RAL 3020", label: "Traffic red", hex: "#BB1E10" },
  { key: "ral-5015", code: "RAL 5015", label: "Sky blue", hex: "#007CB0" },
  { key: "ral-6005", code: "RAL 6005", label: "Moss green", hex: "#114232" },
];

const DEFAULT_CUSTOM_MATERIAL_COLOR = RAL_COLOR_OPTIONS[1].hex;
const DEFAULT_MAIN_MATERIAL_COLOR = RAL_COLOR_OPTIONS[1].hex;
const DEFAULT_SUB_MATERIAL_COLOR = RAL_COLOR_OPTIONS[3].hex;
const DEFAULT_SUB_COLOR_RATIO = 20;

/* ── keyboard shortcuts reference ── */
const SHORTCUTS = [
  { keys: "Q", action: "Select mode" },
  { keys: "W", action: "Move tool" },
  { keys: "E", action: "Rotate tool" },
  { keys: "R", action: "Scale tool" },
  { keys: "1", action: "Front view" },
  { keys: "2", action: "Right view" },
  { keys: "3", action: "Top view" },
  { keys: "4", action: "Perspective view" },
  { keys: "F", action: "Frame selection" },
  { keys: "G", action: "Toggle grid" },
  { keys: "B", action: "Toggle bloom" },
  { keys: "I", action: "Isolate selection" },
  { keys: "T", action: "Toggle left panel" },
  { keys: "N", action: "Toggle right panel" },
  { keys: "P", action: "Export PNG" },
  { keys: "M", action: "Measurement tool" },
  { keys: "Space", action: "Toggle auto-rotate" },
  { keys: "?", action: "Show shortcuts" },
  { keys: "Esc", action: "Close dialogs" },
];

const DEFAULT_VIEWER_TEXT = {
  loading: "Loading model\u2026",
  error: "This model could not be loaded right now.",
  dragHint: "Orbit: drag \u00B7 Zoom: scroll \u00B7 Pan: right-drag \u00B7 Select: click",
  xrNote: "AR and VR launch on supported browsers and devices with WebXR.",
  arLaunch: "Enter AR",
  arExit: "Exit AR",
  arUnsupported: "AR N/A",
  vrLaunch: "Enter VR",
  vrExit: "Exit VR",
  vrUnsupported: "VR N/A",
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

/* ══════════════════════════════════════
   UTILITY FUNCTIONS
   ══════════════════════════════════════ */

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
      if (clone.color && !clone.userData.baseColor) clone.userData.baseColor = clone.color.clone();
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
  const sourceColor = sourceMaterial?.color ? `#${sourceMaterial.color.getHexString()}` : "#d7dde4";
  let nextMaterial;
  switch (mode) {
    case "clay":
      nextMaterial = new THREE.MeshStandardMaterial({ color: sourceColor, roughness: 0.92, metalness: 0.03 });
      break;
    case "wireframe":
      nextMaterial = new THREE.MeshBasicMaterial({ color: sourceColor, wireframe: true, transparent: true, opacity: 0.95 });
      break;
    case "normals":
      return new THREE.MeshNormalMaterial();
    case "xray":
      nextMaterial = new THREE.MeshPhysicalMaterial({
        color: sourceColor,
        transparent: true,
        opacity: 0.26,
        roughness: 0.14,
        metalness: 0.08,
        transmission: 0.18,
        thickness: 0.5,
        side: THREE.DoubleSide,
      });
      break;
    default:
      return sourceMaterial;
  }
  if (nextMaterial.color) {
    nextMaterial.userData.baseColor = (sourceMaterial?.userData?.baseColor ?? sourceMaterial?.color ?? nextMaterial.color).clone();
  }
  return nextMaterial;
}

function applyRenderMode(root, mode) {
  root.traverse((node) => {
    if (!node.isMesh || !node.userData.originalMaterials) return;
    node.userData.runtimeMaterials?.forEach((material) => {
      if (material && !node.userData.originalMaterials.includes(material)) disposeMaterial(material);
    });
    if (mode === "native") {
      node.material = node.userData.originalMaterialIsArray
        ? node.userData.originalMaterials
        : node.userData.originalMaterials[0];
      node.userData.runtimeMaterials = [];
      return;
    }
    const nextMaterials = node.userData.originalMaterials.map((src) => createRenderMaterial(src, mode));
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
    if (material.color) material.color.set(color);
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

function buildNodeOverrideKey(node, stopRoot) {
  const parts = [];
  let current = node;
  while (current && current !== stopRoot) {
    const label = current.name?.trim() || current.type;
    const siblingIndex = current.parent ? current.parent.children.indexOf(current) : 0;
    parts.unshift(`${label}:${siblingIndex}`);
    current = current.parent;
  }
  return parts.join("/");
}

function getNodeWorldCenter(node, target) {
  if (node.isMesh && node.geometry) {
    if (!node.geometry.boundingBox) node.geometry.computeBoundingBox();
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
    if (node === root) return;
    const path = buildNodePath(node, root);
    const overrideKey = buildNodeOverrideKey(node, root);
    const label = node.name?.trim() || node.type;
    node.userData.editorPath = path;
    node.userData.editorOverrideKey = overrideKey;
    node.userData.editorLabel = label;
    nodes.push({ path, label, type: node.type, childCount: node.children.length, isMesh: Boolean(node.isMesh), depth: path.split("/").length });
  });
  tempBox.setFromObject(root);
  const size = tempBox.getSize(tempVectorB);
  return { meshCount, materialCount, size: { x: size.x.toFixed(2), y: size.y.toFixed(2), z: size.z.toFixed(2) }, nodes };
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
      direction.set(Math.sin(seed * 1.9), 0.35 + (seed % 3) * 0.16, Math.cos(seed * 1.3));
    }
    direction.normalize();
    node.userData.editorExplodeDirection = direction.clone();
    node.userData.editorExplodeDistance = Math.max(scaleBasis * 0.06, distance * 0.38 + scaleBasis * 0.045);
    seed += 1;
  });
}

function applyExplode(root, factor) {
  root.traverse((node) => {
    if (node === root || !node.userData.editorBasePosition) return;
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
    if (node.userData.editorBasePosition) node.position.copy(node.userData.editorBasePosition);
    if (node.userData.editorBaseQuaternion) node.quaternion.copy(node.userData.editorBaseQuaternion);
    if (node.userData.editorBaseScale) node.scale.copy(node.userData.editorBaseScale);
    if (typeof node.userData.editorBaseVisible === "boolean") node.visible = node.userData.editorBaseVisible;
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
    if (node.userData.editorPath === path) match = node;
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
    case "front": direction.set(0, 0.16, 1); break;
    case "side": direction.set(1, 0.18, 0); break;
    case "top": direction.set(0.001, 1, 0.001); break;
    default: direction.set(1, 0.68, 1);
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
  const stamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${assetLabel} \u00B7 ${stamp}`;
}

function getMaterialList(material) {
  if (!material) return [];
  return (Array.isArray(material) ? material : [material]).filter(Boolean);
}

function getNodeOriginalMaterials(node) {
  return node?.userData?.originalMaterials?.filter(Boolean) ?? [];
}

function getNodeDisplayedMaterials(node) {
  return getMaterialList(node?.material);
}

function getNodeEditableMaterials(node) {
  return [...new Set([...getNodeOriginalMaterials(node), ...getNodeDisplayedMaterials(node)])];
}

function normalizeColorValue(color) {
  return `#${new THREE.Color(color).getHexString()}`;
}

function nodeSupportsColorOverride(node) {
  return getNodeEditableMaterials(node).some((material) => material?.color);
}

function getNodeMaterialColor(node) {
  const material = getNodeEditableMaterials(node).find((item) => item?.color);
  return material?.color ? `#${material.color.getHexString()}` : "";
}

function getNodeMaterialBaseColor(node) {
  const material = getNodeOriginalMaterials(node).find((item) => item?.color);
  const baseColor = material?.userData?.baseColor;
  return baseColor ? `#${baseColor.getHexString()}` : getNodeMaterialColor(node);
}

function setNodeMaterialColor(node, color) {
  const normalizedColor = normalizeColorValue(color);
  getNodeEditableMaterials(node).forEach((material) => {
    if (!material?.color) return;
    if (!material.userData.baseColor) material.userData.baseColor = material.color.clone();
    material.color.set(normalizedColor);
    material.needsUpdate = true;
  });
}

function resetNodeMaterialColor(node) {
  getNodeEditableMaterials(node).forEach((material) => {
    if (!material?.color || !material.userData.baseColor) return;
    material.color.copy(material.userData.baseColor);
    material.needsUpdate = true;
  });
}

function applyMaterialOverrides(root, overrides) {
  if (!root) return;
  root.traverse((node) => {
    if (!node.isMesh) return;
    const overrideKey = node.userData.editorOverrideKey ?? buildNodeOverrideKey(node, root);
    node.userData.editorOverrideKey = overrideKey;
    if (overrides[overrideKey]) {
      setNodeMaterialColor(node, overrides[overrideKey]);
      return;
    }
    resetNodeMaterialColor(node);
  });
}

function getColorOverrideTargets(selectedNode, activeModel) {
  const root = selectedNode ?? activeModel;
  if (!root) return [];
  if (root.isMesh) {
    return nodeSupportsColorOverride(root) ? [root] : [];
  }
  const targets = [];
  root.traverse((node) => {
    if (node.isMesh && nodeSupportsColorOverride(node)) targets.push(node);
  });
  return targets;
}

function getSharedTargetColor(targets) {
  if (!targets.length) return "";
  const colors = targets.map((node) => getNodeMaterialColor(node)).filter(Boolean);
  if (!colors.length) return "";
  return colors[0];
}

function getMeshTriangleWeight(node) {
  if (!node?.geometry) return 1;
  if (node.geometry.index?.count) return Math.max(1, node.geometry.index.count / 3);
  if (node.geometry.attributes?.position?.count) return Math.max(1, node.geometry.attributes.position.count / 3);
  return 1;
}

function splitTargetsByRatio(targets, subColorRatio) {
  if (!targets.length) return { mainTargets: [], subTargets: [] };
  if (targets.length === 1) return { mainTargets: targets, subTargets: [] };

  const normalizedRatio = THREE.MathUtils.clamp(subColorRatio / 100, 0, 1);
  if (normalizedRatio <= 0) return { mainTargets: targets, subTargets: [] };
  if (normalizedRatio >= 1) return { mainTargets: [], subTargets: targets };

  const weightedTargets = targets
    .map((node) => ({ node, weight: getMeshTriangleWeight(node) }))
    .sort((left, right) => left.weight - right.weight);

  const totalWeight = weightedTargets.reduce((sum, item) => sum + item.weight, 0);
  const targetSubWeight = totalWeight * normalizedRatio;
  const subTargets = [];
  let subWeight = 0;

  for (let index = 0; index < weightedTargets.length; index += 1) {
    const item = weightedTargets[index];
    const isLastRemainingTarget = index === weightedTargets.length - 1;
    if (subTargets.length > 0 && subWeight >= targetSubWeight) break;
    if (isLastRemainingTarget) break;
    subTargets.push(item.node);
    subWeight += item.weight;
  }

  if (!subTargets.length) subTargets.push(weightedTargets[0].node);

  const subKeys = new Set(subTargets.map((node) => node.userData.editorOverrideKey).filter(Boolean));
  const mainTargets = targets.filter((node) => !subKeys.has(node.userData.editorOverrideKey));
  return { mainTargets, subTargets };
}

function getInitialMobileLayout() {
  return typeof window !== "undefined" && window.matchMedia?.("(max-width: 640px)").matches;
}

function getFileExtension(value = "") {
  const cleanValue = value.split("?")[0].split("#")[0];
  const match = cleanValue.match(/\.([a-z0-9]+)$/i);
  return match ? match[1].toLowerCase() : "";
}

function getFormatLabel(extension) {
  return extension ? extension.toUpperCase() : "3D";
}

async function loadSceneAsset(source, format) {
  switch (format) {
    case "glb":
    case "gltf": {
      const gltf = await new GLTFLoader().loadAsync(source);
      return { scene: gltf.scene, animations: gltf.animations ?? [] };
    }
    case "fbx": {
      const scene = await new FBXLoader().loadAsync(source);
      return { scene, animations: scene.animations ?? [] };
    }
    case "dae": {
      const collada = await new ColladaLoader().loadAsync(source);
      return { scene: collada.scene, animations: collada.animations ?? collada.scene?.animations ?? [] };
    }
    case "3ds": {
      const scene = await new TDSLoader().loadAsync(source);
      return { scene, animations: [] };
    }
    default:
      throw new Error(`Unsupported asset format: ${format}`);
  }
}

/* ══════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════ */

function PlaygroundExperience({ viewerText, libraryProducts }) {
  const copy = useMemo(() => ({ ...DEFAULT_VIEWER_TEXT, ...(viewerText ?? {}) }), [viewerText]);
  const builtInLibrary = useMemo(() => {
    const overrides = new Map((libraryProducts ?? []).map((item) => [item.key, item]));
    return BUILTIN_LIBRARY.map((item) => ({
      ...item,
      label: overrides.get(item.key)?.label ?? item.label,
      category: overrides.get(item.key)?.category ?? item.category,
      description: overrides.get(item.key)?.previewNote ?? item.description,
    }));
  }, [libraryProducts]);

  /* ── refs ── */
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
  const statsFrameRef = useRef({ lastSample: 0, frameCount: 0 });
  const composerRef = useRef(null);
  const bloomPassRef = useRef(null);
  const bloomEnabledRef = useRef(false);
  const measureLineRef = useRef(null);
  const measureDot1Ref = useRef(null);
  const measureDot2Ref = useRef(null);
  const measurePointsDataRef = useRef([]);
  const measureModeRef = useRef(false);
  const keyboardHandlerRef = useRef(null);

  /* ── state ── */
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
  const [stats, setStats] = useState({ fps: "--", calls: 0, triangles: 0, geometries: 0, textures: 0 });
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
  const [isMobileLayout, setIsMobileLayout] = useState(getInitialMobileLayout);

  /* new state */
  const [leftPanelOpen, setLeftPanelOpen] = useState(() => !getInitialMobileLayout());
  const [rightPanelOpen, setRightPanelOpen] = useState(() => !getInitialMobileLayout());
  const [leftTab, setLeftTab] = useState("assets");
  const [rightTab, setRightTab] = useState("inspector");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showCodeExport, setShowCodeExport] = useState(false);
  const [bloomEnabled, setBloomEnabled] = useState(false);
  const [bloomStrength, setBloomStrength] = useState(0.35);
  const [bloomRadius, setBloomRadius] = useState(0.4);
  const [bloomThreshold, setBloomThreshold] = useState(0.85);
  const [cameraFov, setCameraFov] = useState(40);
  const [customMaterialColor, setCustomMaterialColor] = useState(DEFAULT_CUSTOM_MATERIAL_COLOR);
  const [mainMaterialColor, setMainMaterialColor] = useState(DEFAULT_MAIN_MATERIAL_COLOR);
  const [subMaterialColor, setSubMaterialColor] = useState(DEFAULT_SUB_MATERIAL_COLOR);
  const [subColorRatio, setSubColorRatio] = useState(DEFAULT_SUB_COLOR_RATIO);
  const [materialOverrides, setMaterialOverrides] = useState({});
  const [measureMode, setMeasureMode] = useState(false);
  const [measureResult, setMeasureResult] = useState(null);
  const [shadowQuality, setShadowQuality] = useState("medium");

  /* ── derived ── */
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
  bloomEnabledRef.current = bloomEnabled;
  measureModeRef.current = measureMode;

  const filteredNodes = useMemo(() => {
    const query = nodeQuery.trim().toLowerCase();
    if (!query) return sceneInfo.nodes.slice(0, 120);
    return sceneInfo.nodes
      .filter((node) => `${node.label} ${node.type}`.toLowerCase().includes(query))
      .slice(0, 120);
  }, [nodeQuery, sceneInfo.nodes]);
  const materialColorTargets = getColorOverrideTargets(selectedObjectRef.current, activeModelRef.current);
  const activeRalColorKey =
    RAL_COLOR_OPTIONS.find((option) => option.hex.toLowerCase() === customMaterialColor.toLowerCase())?.key ?? "";
  const activeMainRalColorKey =
    RAL_COLOR_OPTIONS.find((option) => option.hex.toLowerCase() === mainMaterialColor.toLowerCase())?.key ?? "";
  const activeSubRalColorKey =
    RAL_COLOR_OPTIONS.find((option) => option.hex.toLowerCase() === subMaterialColor.toLowerCase())?.key ?? "";
  const canEditSelectedMaterialColor = materialColorTargets.length > 0;
  const canApplyTwoToneSplit = materialColorTargets.length > 1;

  /* ── action helpers ── */
  const pushActionMessage = (message) => setActionMessage(message);
  const closePanels = () => {
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  };

  const toggleLeftPanel = () => {
    setLeftPanelOpen((current) => {
      const next = !current;
      if (isMobileLayout && next) setRightPanelOpen(false);
      return next;
    });
  };

  const toggleRightPanel = () => {
    setRightPanelOpen((current) => {
      const next = !current;
      if (isMobileLayout && next) setLeftPanelOpen(false);
      return next;
    });
  };

  const updateSelectionState = (node) => {
    const transformControls = transformControlsRef.current;
    const workbenchGroup = workbenchGroupRef.current;
    const activeModel = activeModelRef.current;
    if (!transformControls || !workbenchGroup || !activeModel) return;
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
    frameCamera({ camera, controls, object: target, view: viewPresetRef.current, distanceFactor: target === activeModelRef.current ? 2.15 : 1.65 });
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
    materialOverrides,
    mainMaterialColor,
    subMaterialColor,
    subColorRatio,
    bloomEnabled,
    bloomStrength,
    bloomRadius,
    bloomThreshold,
    cameraFov,
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
    setMaterialOverrides(
      config.materialOverrides && typeof config.materialOverrides === "object" && !Array.isArray(config.materialOverrides)
        ? config.materialOverrides
        : {}
    );
    if (typeof config.mainMaterialColor === "string") setMainMaterialColor(config.mainMaterialColor);
    if (typeof config.subMaterialColor === "string") setSubMaterialColor(config.subMaterialColor);
    if (typeof config.subColorRatio === "number") setSubColorRatio(config.subColorRatio);
    if (typeof config.bloomEnabled === "boolean") setBloomEnabled(config.bloomEnabled);
    if (typeof config.bloomStrength === "number") setBloomStrength(config.bloomStrength);
    if (typeof config.cameraFov === "number") setCameraFov(config.cameraFov);
    setIsolateSelection(false);
    setNodeQuery("");
    const nextView = config.cameraView ?? viewPresetRef.current;
    viewPresetRef.current = nextView;
    setCameraView(nextView);
    window.requestAnimationFrame(() => frameActiveCamera(nextView));
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
    pushActionMessage("PNG exported.");
  };

  const copyConfiguration = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(getCurrentConfiguration(), null, 2));
      pushActionMessage("Config copied to clipboard.");
    } catch {
      pushActionMessage("Clipboard access blocked.");
    }
  };

  const saveSnapshot = () => {
    const snapshot = {
      id: `snapshot-${Date.now()}`,
      label: createSnapshotLabel(activeAsset?.label ?? "Scene"),
      config: getCurrentConfiguration(),
    };
    setSavedSnapshots((current) => [snapshot, ...current].slice(0, 8));
    pushActionMessage("Snapshot saved.");
  };

  const handlePresetApply = (preset) => {
    setActivePresetKey(preset.key);
    applyConfiguration({ ...preset.config, presetKey: preset.key });
    if (isMobileLayout) setLeftPanelOpen(false);
    pushActionMessage(`${preset.label} loaded.`);
  };

  const handleFileLoad = (file) => {
    if (!file) return;
    const extension = getFileExtension(file.name);
    if (CONVERSION_REQUIRED_EXTENSIONS.has(extension)) {
      pushActionMessage(`${getFormatLabel(extension)} needs conversion to GLB, FBX, DAE, or 3DS before preview.`);
      return;
    }
    if (!DIRECT_UPLOAD_EXTENSIONS.has(extension)) {
      pushActionMessage("Use GLB, GLTF, FBX, DAE, or 3DS. SKP and DWG need conversion first.");
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
      description: `${getFormatLabel(extension)} asset uploaded from your machine for staging and review.`,
      fitSize: 3.7,
      source: objectUrl,
      sourceType: "upload",
      format: extension,
    });
    setActivePresetKey("");
    setMaterialOverrides({});
    setSelectedPath(ROOT_SELECTION_KEY);
    setSelectionInfo(EMPTY_SELECTION);
    if (isMobileLayout) setLeftPanelOpen(false);
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
    setMaterialOverrides({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSelectedMaterialColorChange = (nextColor) => {
    if (!materialColorTargets.length) {
      pushActionMessage("Load an asset to change its material color.");
      return;
    }
    const normalizedColor = normalizeColorValue(nextColor);
    setCustomMaterialColor(normalizedColor);
    setMaterialOverrides((current) => {
      const nextOverrides = { ...current };
      materialColorTargets.forEach((node) => {
        const key = node.userData.editorOverrideKey;
        if (key) nextOverrides[key] = normalizedColor;
      });
      return nextOverrides;
    });
    pushActionMessage(selectionInfo.isMesh ? "Material color updated." : "Material color applied to the asset.");
  };

  const resetSelectedMaterialColor = () => {
    if (!materialColorTargets.length) {
      pushActionMessage("Load an asset to reset its material color.");
      return;
    }
    setMaterialOverrides((current) => {
      const nextOverrides = { ...current };
      materialColorTargets.forEach((node) => {
        const key = node.userData.editorOverrideKey;
        if (key) delete nextOverrides[key];
      });
      return nextOverrides;
    });
    setCustomMaterialColor(getNodeMaterialBaseColor(materialColorTargets[0]) || DEFAULT_CUSTOM_MATERIAL_COLOR);
    pushActionMessage("Material color reset.");
  };

  const applyTwoToneMaterialSplit = () => {
    if (!materialColorTargets.length) {
      pushActionMessage("Load an asset to apply main and sub colors.");
      return;
    }
    if (materialColorTargets.length < 2) {
      pushActionMessage("Select the full asset or a group with multiple meshes to apply a main/sub color split.");
      return;
    }

    const normalizedMainColor = normalizeColorValue(mainMaterialColor);
    const normalizedSubColor = normalizeColorValue(subMaterialColor);
    const { subTargets } = splitTargetsByRatio(materialColorTargets, subColorRatio);

    setMaterialOverrides((current) => {
      const nextOverrides = { ...current };
      materialColorTargets.forEach((node) => {
        const key = node.userData.editorOverrideKey;
        if (!key) return;
        nextOverrides[key] = normalizedMainColor;
      });
      subTargets.forEach((node) => {
        const key = node.userData.editorOverrideKey;
        if (!key) return;
        nextOverrides[key] = normalizedSubColor;
      });
      return nextOverrides;
    });

    const mainShare = Math.max(0, 100 - subColorRatio);
    pushActionMessage(`Applied ${mainShare}/${subColorRatio} main/sub color split.`);
  };

  const resetTwoToneControls = () => {
    setMainMaterialColor(DEFAULT_MAIN_MATERIAL_COLOR);
    setSubMaterialColor(DEFAULT_SUB_MATERIAL_COLOR);
    setSubColorRatio(DEFAULT_SUB_COLOR_RATIO);
  };

  const toggleFullscreen = () => {
    const el = rootRef.current?.closest(".pg-workspace");
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  const generateThreeJsCode = () => {
    const cfg = getCurrentConfiguration();
    const env = ENVIRONMENT_PRESETS[cfg.environmentKey] ?? ENVIRONMENT_PRESETS.studio;
    return `// Morphix Playground \u2014 Three.js Scene Export
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color('${env.background}');
scene.fog = new THREE.Fog('${env.fog}', 10, 28);

const camera = new THREE.PerspectiveCamera(${cfg.cameraFov}, window.innerWidth / window.innerHeight, 0.01, 120);
camera.position.set(5, 3.5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = ${cfg.exposure};
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = ${cfg.autoRotate};
controls.autoRotateSpeed = ${cfg.autoRotateSpeed};

// Lighting
const hemi = new THREE.HemisphereLight('${env.hemiSky}', '${env.hemiGround}', ${(1.15 * cfg.lightIntensity).toFixed(2)});
scene.add(hemi);
const key = new THREE.DirectionalLight('${env.key}', ${(2.2 * cfg.lightIntensity).toFixed(2)});
key.position.set(6, 8, 7);
key.castShadow = true;
scene.add(key);

// Load model
const loader = new GLTFLoader();
loader.load('YOUR_MODEL.glb', (gltf) => {
  scene.add(gltf.scene);
});

function animate() {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
`;
  };

  const clearMeasure = () => {
    measurePointsDataRef.current = [];
    setMeasureResult(null);
    if (measureLineRef.current) measureLineRef.current.visible = false;
    if (measureDot1Ref.current) measureDot1Ref.current.visible = false;
    if (measureDot2Ref.current) measureDot2Ref.current.visible = false;
  };

  /* ── keyboard handler ref (always up-to-date) ── */
  keyboardHandlerRef.current = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.tagName === "SELECT") return;
    const k = e.key.toLowerCase();
    switch (k) {
      case "q": setTransformMode("off"); break;
      case "w": setTransformMode("translate"); break;
      case "e": setTransformMode("rotate"); break;
      case "r": setTransformMode("scale"); break;
      case "1": frameActiveCamera("front"); break;
      case "2": frameActiveCamera("side"); break;
      case "3": frameActiveCamera("top"); break;
      case "4": frameActiveCamera("iso"); break;
      case "f": focusSelection(); break;
      case "g": setShowGrid((v) => !v); break;
      case "b": setBloomEnabled((v) => !v); break;
      case "i": setIsolateSelection((v) => !v); break;
      case "t": setLeftPanelOpen((v) => !v); break;
      case "n": setRightPanelOpen((v) => !v); break;
      case "p": if (!e.ctrlKey && !e.metaKey) exportViewportImage(); break;
      case "m": setMeasureMode((v) => { if (v) clearMeasure(); return !v; }); break;
      case " ": e.preventDefault(); setAutoRotate((v) => !v); break;
      case "?": setShowShortcuts(true); break;
      case "escape": setShowShortcuts(false); setShowCodeExport(false); break;
      default: break;
    }
  };

  /* ══════════════════════════════════════
     EFFECTS
     ══════════════════════════════════════ */

  /* snapshot persistence */
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SNAPSHOT_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setSavedSnapshots(parsed.slice(0, 8));
    } catch { setSavedSnapshots([]); }
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem(SNAPSHOT_STORAGE_KEY, JSON.stringify(savedSnapshots)); } catch {}
  }, [savedSnapshots]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const media = window.matchMedia("(max-width: 640px)");
    const syncLayout = () => setIsMobileLayout(media.matches);
    syncLayout();
    if (media.addEventListener) {
      media.addEventListener("change", syncLayout);
      return () => media.removeEventListener("change", syncLayout);
    }
    media.addListener(syncLayout);
    return () => media.removeListener(syncLayout);
  }, []);

  useEffect(() => {
    if (!isMobileLayout) return;
    setLeftPanelOpen(false);
    setRightPanelOpen(false);
  }, [isMobileLayout]);

  /* toast auto-dismiss */
  useEffect(() => {
    if (!actionMessage) return undefined;
    const id = window.setTimeout(() => setActionMessage(""), 2200);
    return () => window.clearTimeout(id);
  }, [actionMessage]);

  /* ── main scene setup ── */
  useEffect(() => {
    const root = rootRef.current;
    const canvasHost = canvasHostRef.current;
    if (!root || !canvasHost) return undefined;

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
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setClearAlpha(1);
    renderer.xr.enabled = true;
    renderer.domElement.style.touchAction = "none";
    canvasHost.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    /* post-processing */
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(800, 600), 0.35, 0.4, 0.85);
    composer.addPass(bloomPass);
    const outputPass = new OutputPass();
    composer.addPass(outputPass);
    composerRef.current = composer;
    bloomPassRef.current = bloomPass;

    /* controls */
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.08;
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 0.6;
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

    /* lighting */
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

    /* workbench */
    const workbenchGroup = new THREE.Group();
    scene.add(workbenchGroup);
    workbenchGroupRef.current = workbenchGroup;
    transformControls.attach(workbenchGroup);

    /* floor & helpers */
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

    const selectionHelper = new THREE.BoxHelper(new THREE.Object3D(), "#5b9cf5");
    selectionHelper.visible = false;
    scene.add(selectionHelper);
    selectionHelperRef.current = selectionHelper;

    /* measurement helpers */
    const measureMat = new THREE.LineBasicMaterial({ color: "#ff6b35", linewidth: 2, depthTest: false });
    const measureGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
    const measureLine = new THREE.Line(measureGeom, measureMat);
    measureLine.visible = false;
    measureLine.renderOrder = 999;
    scene.add(measureLine);
    measureLineRef.current = measureLine;

    const dotGeom = new THREE.SphereGeometry(0.04, 12, 12);
    const dotMat = new THREE.MeshBasicMaterial({ color: "#ff6b35", depthTest: false });
    const dot1 = new THREE.Mesh(dotGeom, dotMat);
    const dot2 = new THREE.Mesh(dotGeom, dotMat);
    dot1.visible = false;
    dot2.visible = false;
    dot1.renderOrder = 999;
    dot2.renderOrder = 999;
    scene.add(dot1, dot2);
    measureDot1Ref.current = dot1;
    measureDot2Ref.current = dot2;

    /* XR helpers */
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

    /* resize */
    const resize = () => {
      const { width, height } = root.getBoundingClientRect();
      if (!width || !height || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height, false);
      if (composerRef.current) composerRef.current.setSize(width, height);
    };

    const onWindowResize = () => {
      window.cancelAnimationFrame(resizeFrameRef.current);
      resizeFrameRef.current = window.requestAnimationFrame(resize);
    };

    /* XR session events */
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
      xrModeRef.current = "";
      setXrMode("");
      renderer.setClearAlpha(1);
      if (xrEstimatedLightRef.current) xrEstimatedLightRef.current.visible = false;
      if (xrPlanesRef.current) xrPlanesRef.current.visible = false;
      if (floorRef.current) floorRef.current.visible = showFloorRef.current;
      if (gridRef.current) gridRef.current.visible = showGridRef.current;
      if (boundsHelperRef.current) boundsHelperRef.current.visible = showBoundsRef.current;
    };

    /* pointer: selection & measurement */
    const pickSelection = (event) => {
      const model = activeModelRef.current;
      if (!model || !cameraRef.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera({ x, y }, cameraRef.current);

      if (measureModeRef.current) {
        const intersections = raycaster.intersectObject(model, true);
        if (intersections.length) {
          const point = intersections[0].point.clone();
          const pts = measurePointsDataRef.current;
          if (pts.length === 0) {
            pts.push(point);
            if (measureDot1Ref.current) {
              measureDot1Ref.current.position.copy(point);
              measureDot1Ref.current.visible = true;
            }
          } else if (pts.length === 1) {
            pts.push(point);
            if (measureDot2Ref.current) {
              measureDot2Ref.current.position.copy(point);
              measureDot2Ref.current.visible = true;
            }
            if (measureLineRef.current) {
              const geom = measureLineRef.current.geometry;
              const positions = geom.attributes.position;
              positions.setXYZ(0, pts[0].x, pts[0].y, pts[0].z);
              positions.setXYZ(1, pts[1].x, pts[1].y, pts[1].z);
              positions.needsUpdate = true;
              measureLineRef.current.visible = true;
            }
            const dist = pts[0].distanceTo(pts[1]);
            setMeasureResult(dist.toFixed(3));
          } else {
            measurePointsDataRef.current = [point];
            setMeasureResult(null);
            if (measureDot1Ref.current) {
              measureDot1Ref.current.position.copy(point);
              measureDot1Ref.current.visible = true;
            }
            if (measureDot2Ref.current) measureDot2Ref.current.visible = false;
            if (measureLineRef.current) measureLineRef.current.visible = false;
          }
        }
        return;
      }

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
      if (transformDraggingRef.current || deltaX > 6 || deltaY > 6) return;
      pickSelection(event);
    };

    /* keyboard */
    const onKeyDown = (e) => {
      keyboardHandlerRef.current?.(e);
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.xr.addEventListener("sessionstart", onSessionStart);
    renderer.xr.addEventListener("sessionend", onSessionEnd);
    window.addEventListener("keydown", onKeyDown);

    resize();

    /* render loop */
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

      /* render with or without bloom */
      if (!renderer.xr.isPresenting && bloomEnabledRef.current && composerRef.current) {
        composerRef.current.render();
      } else {
        renderer.render(scene, camera);
      }

      /* stats */
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
      window.removeEventListener("keydown", onKeyDown);
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
      composer.dispose();
      if (renderer.domElement.parentNode === canvasHost) canvasHost.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  /* ── asset loading ── */
  useEffect(() => {
    let cancelled = false;
    const workbenchGroup = workbenchGroupRef.current;
    const transformControls = transformControlsRef.current;
    if (!workbenchGroup || !transformControls || !activeAsset) return undefined;

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
        const assetFormat = activeAsset.format || getFileExtension(activeAsset.source) || "glb";

        if (activeAsset.sourceType === "upload") {
          const uploadedAsset = await loadSceneAsset(activeAsset.source, assetFormat);
          templateScene = uploadedAsset.scene;
          animations = uploadedAsset.animations;
        } else {
          const cached = modelCacheRef.current.get(activeAsset.key);
          if (cached) {
            templateScene = cached.scene;
            animations = cached.animations;
          } else {
            const libraryAsset = await loadSceneAsset(activeAsset.source, assetFormat);
            templateScene = libraryAsset.scene;
            animations = libraryAsset.animations;
            modelCacheRef.current.set(activeAsset.key, { scene: templateScene, animations });
          }
        }

        if (cancelled) return;

        const instance = activeAsset.sourceType === "upload" ? templateScene : cloneInstance(templateScene);
        ensureWorkbenchMaterials(instance);
        applyMaterialOverrides(instance, materialOverrides);
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
          setActiveClip((current) => (current && actions.has(current) ? current : animations[0].name));
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
    return () => { cancelled = true; };
  }, [activeAsset, copy.error]);

  /* render mode */
  useEffect(() => {
    if (!activeModelRef.current) return;
    applyRenderMode(activeModelRef.current, renderMode);
  }, [renderMode]);

  /* environment, lighting, floor, grid */
  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const floor = floorRef.current;
    const grid = gridRef.current;
    const hemiLight = hemiLightRef.current;
    const keyLight = keyLightRef.current;
    const fillLight = fillLightRef.current;
    const rimLight = rimLightRef.current;
    if (!scene || !renderer || !floor || !grid || !hemiLight || !keyLight || !fillLight || !rimLight) return;

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

  /* XR planes */
  useEffect(() => {
    if (xrPlanesRef.current) xrPlanesRef.current.visible = showPlanes && xrMode === "immersive-ar";
  }, [showPlanes, xrMode]);

  /* axes */
  useEffect(() => {
    if (axesRef.current) axesRef.current.visible = showAxes;
  }, [showAxes]);

  /* bounds helper */
  useEffect(() => {
    if (boundsHelperRef.current) {
      boundsHelperRef.current.visible = showBounds && xrMode !== "immersive-ar";
      if (showBounds && workbenchGroupRef.current) boundsHelperRef.current.setFromObject(workbenchGroupRef.current);
    }
  }, [showBounds, xrMode]);

  /* transform mode */
  useEffect(() => {
    const tc = transformControlsRef.current;
    if (!tc) return;
    tc.setMode(transformMode === "off" ? "rotate" : transformMode);
    tc.visible = transformMode !== "off";
  }, [transformMode]);

  /* explode */
  useEffect(() => {
    const activeModel = activeModelRef.current;
    if (!activeModel) return;
    restoreNodeTransforms(activeModel);
    applyExplode(activeModel, explodeFactor);
    applyIsolation(activeModel, selectedObjectRef.current, isolateSelection);
  }, [explodeFactor]);

  /* isolation */
  useEffect(() => {
    if (!activeModelRef.current) return;
    applyIsolation(activeModelRef.current, selectedObjectRef.current, isolateSelection);
  }, [selectedPath, isolateSelection]);

  /* animation clip */
  useEffect(() => {
    const mixer = animationMixerRef.current;
    const actions = animationActionsRef.current;
    if (!mixer || !actions.size) return;
    actions.forEach((action, name) => {
      if (name === activeClip) { action.enabled = true; action.reset(); action.play(); }
      else action.stop();
    });
  }, [activeClip]);

  /* XR support check */
  useEffect(() => {
    if (!navigator.xr) {
      setXrSupport({ checked: true, ar: false, vr: false });
      return undefined;
    }
    let cancelled = false;
    async function check() {
      try {
        const [ar, vr] = await Promise.all([
          navigator.xr.isSessionSupported("immersive-ar"),
          navigator.xr.isSessionSupported("immersive-vr"),
        ]);
        if (!cancelled) setXrSupport({ checked: true, ar, vr });
      } catch {
        if (!cancelled) setXrSupport({ checked: true, ar: false, vr: false });
      }
    }
    check();
    return () => { cancelled = true; };
  }, []);

  /* upload URL cleanup */
  useEffect(() => {
    return () => {
      if (activeUploadUrlRef.current) URL.revokeObjectURL(activeUploadUrlRef.current);
    };
  }, []);

  /* bloom parameters sync */
  useEffect(() => {
    if (bloomPassRef.current) {
      bloomPassRef.current.strength = bloomStrength;
      bloomPassRef.current.radius = bloomRadius;
      bloomPassRef.current.threshold = bloomThreshold;
    }
  }, [bloomStrength, bloomRadius, bloomThreshold]);

  /* camera FOV */
  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.fov = cameraFov;
      cameraRef.current.updateProjectionMatrix();
    }
  }, [cameraFov]);

  /* shadow quality */
  useEffect(() => {
    const kl = keyLightRef.current;
    if (!kl) return;
    const size = shadowQuality === "high" ? 2048 : shadowQuality === "low" ? 512 : 1024;
    kl.shadow.mapSize.set(size, size);
    if (kl.shadow.map) {
      kl.shadow.map.dispose();
      kl.shadow.map = null;
    }
  }, [shadowQuality]);

  /* material color overrides */
  useEffect(() => {
    if (!activeModelRef.current) return;
    applyMaterialOverrides(activeModelRef.current, materialOverrides);
  }, [materialOverrides]);

  useEffect(() => {
    const targets = getColorOverrideTargets(selectedObjectRef.current, activeModelRef.current);
    if (targets.length) {
      setCustomMaterialColor(getSharedTargetColor(targets) || DEFAULT_CUSTOM_MATERIAL_COLOR);
      return;
    }
    setCustomMaterialColor(DEFAULT_CUSTOM_MATERIAL_COLOR);
  }, [selectedPath, materialOverrides, sceneInfo.meshCount]);

  /* measure mode cleanup */
  useEffect(() => {
    if (!measureMode) clearMeasure();
  }, [measureMode]);

  /* XR launcher */
  const launchXrSession = async (mode) => {
    const renderer = rendererRef.current;

    /* Guard: WebXR API must exist */
    if (!renderer) return;
    if (!navigator.xr) {
      pushActionMessage("WebXR is not available in this browser.");
      return;
    }

    /* If a session is already running, end it */
    const activeSession = renderer.xr.getSession();
    if (activeSession) {
      try {
        await activeSession.end();
      } catch {
        /* session already ended */
      }
      return;
    }

    /* Check support before requesting — give user a clear message */
    try {
      const supported = await navigator.xr.isSessionSupported(mode);
      if (!supported) {
        const hint =
          mode === "immersive-ar"
            ? "AR requires an Android device with ARCore (Chrome) or iOS with WebXR support."
            : "VR requires a connected headset or browser WebXR extension.";
        pushActionMessage(hint);
        return;
      }
    } catch {
      /* isSessionSupported failed — still attempt the session below */
    }

    /* Build session init — keep it minimal to avoid rejection on strict browsers */
    const arInit = {
      requiredFeatures: ["local-floor"],
      optionalFeatures: ["light-estimation", "plane-detection"],
    };

    /* Only add dom-overlay when the root element is in the DOM */
    const overlayRoot = rootRef.current?.closest(".pg-workspace") ?? rootRef.current;
    if (overlayRoot && document.contains(overlayRoot)) {
      arInit.optionalFeatures.push("dom-overlay");
      arInit.domOverlay = { root: overlayRoot };
    }

    const vrInit = {
      requiredFeatures: ["local-floor"],
      optionalFeatures: ["bounded-floor", "hand-tracking"],
    };

    try {
      activeXrModeRef.current = mode;
      const session = await navigator.xr.requestSession(
        mode,
        mode === "immersive-ar" ? arInit : vrInit
      );
      await renderer.xr.setSession(session);
      xrModeRef.current = mode;
      setXrMode(mode);
    } catch (err) {
      activeXrModeRef.current = null;
      xrModeRef.current = "";
      setXrMode("");
      const msg =
        err?.name === "NotAllowedError"
          ? "XR permission denied — allow camera/motion access and retry."
          : err?.name === "NotSupportedError"
          ? "This XR mode is not supported on your device."
          : "XR session could not start. Make sure you are on HTTPS and using a supported device.";
      pushActionMessage(msg);
    }
  };

  /* ══════════════════════════════════════
     RENDER — Blender-style full-screen editor
     ══════════════════════════════════════ */

  return (
    <div className={`pg-workspace ${isMobileLayout ? "is-mobile-layout" : ""}`}>
      {/* ── Header Bar ── */}
      <header className="pg-header">
        <div className="pg-header-section pg-header-brand">
          <span className="pg-logo">Morphix</span>
          <span className="pg-sep">/</span>
          <span className="pg-header-label">Playground</span>
        </div>

        <div className="pg-header-section pg-header-tools">
          <div className="pg-btn-group" data-label="Transform">
            {TRANSFORM_MODES.map((item) => (
              <button
                key={item.value}
                className={`pg-btn ${transformMode === item.value ? "is-active" : ""}`}
                type="button"
                onClick={() => setTransformMode(item.value)}
                title={`${item.label} (${item.shortcut})`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="pg-divider" />
          <div className="pg-btn-group" data-label="Render">
            {RENDER_MODES.map((item) => (
              <button
                key={item.value}
                className={`pg-btn ${renderMode === item.value ? "is-active" : ""}`}
                type="button"
                onClick={() => setRenderMode(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <span className="pg-divider" />
          <div className="pg-btn-group" data-label="View">
            {CAMERA_VIEWS.map((item) => (
              <button
                key={item.value}
                className={`pg-btn ${cameraView === item.value ? "is-active" : ""}`}
                type="button"
                onClick={() => frameActiveCamera(item.value)}
                title={`${item.label} (${item.shortcut})`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pg-header-section pg-header-actions">
          <button className="pg-btn" type="button" onClick={exportViewportImage} title="Export PNG (P)">Export</button>
          <button className="pg-btn" type="button" onClick={saveSnapshot} title="Save Snapshot">Snap</button>
          <button className="pg-btn" type="button" onClick={() => setShowCodeExport(true)} title="Code Export">Code</button>
          <button className="pg-btn" type="button" onClick={toggleFullscreen} title="Fullscreen">
            {"\u26F6"}
          </button>
          <button className="pg-btn" type="button" onClick={() => setShowShortcuts(true)} title="Keyboard Shortcuts (?)">
            {"?"}
          </button>
          <span className="pg-divider" />
          <button
            className={`pg-btn pg-btn-xr ${xrMode === "immersive-ar" ? "is-active" : ""} ${!xrSupport.checked ? "is-checking" : ""}`}
            type="button"
            disabled={!xrSupport.checked}
            onClick={() => launchXrSession("immersive-ar")}
            title={
              !xrSupport.checked
                ? "Checking AR support…"
                : !xrSupport.ar
                ? "AR unavailable on this device — click for details"
                : copy.xrNote
            }
          >
            {!xrSupport.checked
              ? "AR…"
              : xrMode === "immersive-ar"
              ? copy.arExit
              : xrSupport.ar
              ? copy.arLaunch
              : copy.arUnsupported}
          </button>
          <button
            className={`pg-btn pg-btn-xr ${xrMode === "immersive-vr" ? "is-active" : ""} ${!xrSupport.checked ? "is-checking" : ""}`}
            type="button"
            disabled={!xrSupport.checked}
            onClick={() => launchXrSession("immersive-vr")}
            title={
              !xrSupport.checked
                ? "Checking VR support…"
                : !xrSupport.vr
                ? "VR unavailable on this device — click for details"
                : copy.xrNote
            }
          >
            {!xrSupport.checked
              ? "VR…"
              : xrMode === "immersive-vr"
              ? copy.vrExit
              : xrSupport.vr
              ? copy.vrLaunch
              : copy.vrUnsupported}
          </button>
        </div>
      </header>

      {/* ── Body: panels + viewport ── */}
      <div className="pg-body">
        {isMobileLayout && (leftPanelOpen || rightPanelOpen) && (
          <button
            aria-label="Close playground panels"
            className="pg-mobile-backdrop"
            type="button"
            onClick={closePanels}
          />
        )}

        {/* Left panel toggle */}
        <button
          className="pg-panel-toggle pg-panel-toggle-left"
          type="button"
          onClick={toggleLeftPanel}
          title="Toggle panel (T)"
        >
          {leftPanelOpen ? "\u25C0" : "\u25B6"}
        </button>

        {/* ── Left Panel ── */}
        {leftPanelOpen && (
          <aside className="pg-panel pg-panel-left">
            <div className="pg-panel-tabs">
              {[
                { key: "assets", label: "Assets" },
                { key: "presets", label: "Presets" },
                { key: "upload", label: "Upload" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`pg-tab ${leftTab === tab.key ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setLeftTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pg-panel-scroll">
              {leftTab === "assets" && (
                <div className="pg-section">
                  <div className="pg-section-label">Built-in Library</div>
                  <div className="pg-item-list">
                    {builtInLibrary.map((item) => (
                      <button
                        key={item.key}
                        className={`pg-item ${!uploadedAsset && assetKey === item.key ? "is-active" : ""}`}
                        type="button"
                        onClick={() => {
                          setUploadedAsset(null);
                          setAssetKey(item.key);
                          setActivePresetKey("");
                          setMaterialOverrides({});
                          if (isMobileLayout) setLeftPanelOpen(false);
                        }}
                      >
                        <strong>{item.label}</strong>
                        <span>{item.category}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {leftTab === "presets" && (
                <div className="pg-section">
                  <div className="pg-section-label">Scene Recipes</div>
                  <div className="pg-item-list">
                    {EXPERIENCE_PRESETS.map((preset) => (
                      <button
                        key={preset.key}
                        className={`pg-item ${activePresetKey === preset.key ? "is-active" : ""}`}
                        type="button"
                        onClick={() => handlePresetApply(preset)}
                      >
                        <strong>{preset.label}</strong>
                        <span>{preset.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {leftTab === "upload" && (
                <div className="pg-section">
                  <div className="pg-section-label">Local Asset</div>
                  <p className="pg-muted">Drop a GLB, GLTF, FBX, DAE, or 3DS file into the viewport. SKP and DWG still need conversion first.</p>
                  <input
                    ref={fileInputRef}
                    className="pg-file-input"
                    type="file"
                    accept={UPLOAD_ACCEPT_ATTR}
                    onChange={(e) => handleFileLoad(e.target.files?.[0])}
                  />
                  <div className="pg-upload-actions">
                    <button className="pg-btn pg-btn-accent" type="button" onClick={() => fileInputRef.current?.click()}>
                      Browse files
                    </button>
                    {uploadedAsset && (
                      <button className="pg-btn" type="button" onClick={clearUpload}>Clear</button>
                    )}
                  </div>
                  {uploadedAsset && (
                    <div className="pg-upload-info">
                      <strong>{uploadedAsset.label}</strong>
                      <span>{uploadedAsset.category}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Snapshots (always visible in left panel) */}
              <div className="pg-section">
                <div className="pg-section-label">Snapshots</div>
                {savedSnapshots.length ? (
                  <div className="pg-item-list">
                    {savedSnapshots.map((snapshot) => (
                      <div className="pg-snapshot-row" key={snapshot.id}>
                        <button
                          className="pg-item pg-item-snap"
                          type="button"
                          onClick={() => {
                            applyConfiguration(snapshot.config);
                            if (isMobileLayout) setLeftPanelOpen(false);
                          }}
                        >
                          <strong>{snapshot.label}</strong>
                          <span>{snapshot.config.assetKey === "upload" ? snapshot.config.uploadLabel || "Upload" : snapshot.config.assetKey}</span>
                        </button>
                        <button
                          className="pg-btn pg-btn-sm"
                          type="button"
                          onClick={() => setSavedSnapshots((c) => c.filter((s) => s.id !== snapshot.id))}
                        >
                          \u00D7
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="pg-muted">No snapshots yet. Use Snap to save scene states.</p>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* ── Viewport ── */}
        <div className="pg-viewport-wrapper">
          <div
            className={`pg-viewport ${isDropActive ? "is-drop-active" : ""} ${measureMode ? "is-measure" : ""}`}
            ref={rootRef}
            onDragEnter={(e) => { e.preventDefault(); setIsDropActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setIsDropActive(true); }}
            onDragLeave={(e) => { e.preventDefault(); if (e.currentTarget.contains(e.relatedTarget)) return; setIsDropActive(false); }}
            onDrop={(e) => { e.preventDefault(); setIsDropActive(false); handleFileLoad(e.dataTransfer.files?.[0]); }}
          >
            <div className="pg-canvas-host" ref={canvasHostRef} />

            {/* Top-left badges */}
            <div className="pg-badges">
              <span className="pg-badge">{activeAsset?.label ?? "Asset"}</span>
              <span className="pg-badge">{ENVIRONMENT_PRESETS[environmentKey]?.label ?? "Studio"}</span>
              <span className="pg-badge">{renderMode !== "native" ? renderMode : ""}</span>
              {selectedPath !== ROOT_SELECTION_KEY && (
                <span className="pg-badge pg-badge-sel">{selectionInfo.label}</span>
              )}
              {measureMode && (
                <span className="pg-badge pg-badge-measure">
                  Measure {measureResult ? `\u2014 ${measureResult} units` : "\u2014 click two points"}
                </span>
              )}
            </div>

            {/* Right-side floating tool strip */}
            <div className="pg-float-strip">
              <button className={`pg-float-btn ${autoRotate ? "is-active" : ""}`} type="button" onClick={() => setAutoRotate((v) => !v)} title="Auto Rotate (Space)">{"\u21BB"}</button>
              <button className={`pg-float-btn ${showGrid ? "is-active" : ""}`} type="button" onClick={() => setShowGrid((v) => !v)} title="Grid (G)">{"#"}</button>
              <button className={`pg-float-btn ${showAxes ? "is-active" : ""}`} type="button" onClick={() => setShowAxes((v) => !v)} title="Axes">{"\u2726"}</button>
              <button className={`pg-float-btn ${showBounds ? "is-active" : ""}`} type="button" onClick={() => setShowBounds((v) => !v)} title="Bounds">{"\u25A1"}</button>
              <button className={`pg-float-btn ${showFloor ? "is-active" : ""}`} type="button" onClick={() => setShowFloor((v) => !v)} title="Floor">{"\u2B21"}</button>
              <span className="pg-float-sep" />
              <button className={`pg-float-btn ${bloomEnabled ? "is-active" : ""}`} type="button" onClick={() => setBloomEnabled((v) => !v)} title="Bloom (B)">{"\u2728"}</button>
              <button className={`pg-float-btn ${isolateSelection ? "is-active" : ""}`} type="button" onClick={() => setIsolateSelection((v) => !v)} title="Isolate (I)">{"\u25C9"}</button>
              <button className={`pg-float-btn ${measureMode ? "is-active" : ""}`} type="button" onClick={() => setMeasureMode((v) => !v)} title="Measure (M)">{"\u2195"}</button>
              <span className="pg-float-sep" />
              <button className="pg-float-btn" type="button" onClick={() => updateSelectionState(activeModelRef.current)} title="Select Root">{"\u2302"}</button>
              <button className="pg-float-btn" type="button" onClick={focusSelection} title="Frame (F)">{"\u2316"}</button>
              <button className="pg-float-btn" type="button" onClick={resetTransforms} title="Reset Transforms">{"\u27F3"}</button>
            </div>

            {/* Toast */}
            {actionMessage && <div className="pg-toast">{actionMessage}</div>}

            {/* Drop overlay */}
            {isDropActive && (
              <div className="pg-drop-overlay">
                <strong>Drop your model here</strong>
                <span>GLB, GLTF, FBX, DAE, and 3DS files stage directly into the workbench.</span>
              </div>
            )}

            {/* Loading / error */}
            {loading && <div className="pg-state-overlay">{copy.loading}</div>}
            {error && <div className="pg-state-overlay is-error">{error}</div>}
          </div>
        </div>

        {isMobileLayout && (
          <div className="pg-mobile-dock">
            <button
              className={`pg-mobile-dock-btn ${leftPanelOpen ? "is-active" : ""}`}
              type="button"
              onClick={toggleLeftPanel}
            >
              <strong>Library</strong>
              <span>Assets</span>
            </button>
            <button
              className={`pg-mobile-dock-btn ${rightPanelOpen ? "is-active" : ""}`}
              type="button"
              onClick={toggleRightPanel}
            >
              <strong>Controls</strong>
              <span>Scene</span>
            </button>
            <button className="pg-mobile-dock-btn" type="button" onClick={focusSelection}>
              <strong>Frame</strong>
              <span>Focus</span>
            </button>
            <button className="pg-mobile-dock-btn" type="button" onClick={resetTransforms}>
              <strong>Reset</strong>
              <span>Pose</span>
            </button>
          </div>
        )}

        {/* Right panel toggle */}
        <button
          className="pg-panel-toggle pg-panel-toggle-right"
          type="button"
          onClick={toggleRightPanel}
          title="Toggle panel (N)"
        >
          {rightPanelOpen ? "\u25B6" : "\u25C0"}
        </button>

        {/* ── Right Panel ── */}
        {rightPanelOpen && (
          <aside className="pg-panel pg-panel-right">
            <div className="pg-panel-tabs">
              {[
                { key: "inspector", label: "Inspect" },
                { key: "scene", label: "Scene" },
                { key: "animation", label: "Anim" },
                { key: "effects", label: "FX" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`pg-tab ${rightTab === tab.key ? "is-active" : ""}`}
                  type="button"
                  onClick={() => setRightTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="pg-panel-scroll">
              {/* ── Inspector Tab ── */}
              {rightTab === "inspector" && (
                <>
                  <div className="pg-section">
                    <div className="pg-section-label">{selectionInfo.label}</div>
                    <p className="pg-muted">
                      {selectedPath === ROOT_SELECTION_KEY
                        ? activeAsset?.description
                        : "Selected node. Use gizmo, isolate, or frame for review."}
                    </p>
                    <div className="pg-props">
                      <div className="pg-prop"><span>Type</span><strong>{selectionInfo.type}</strong></div>
                      <div className="pg-prop"><span>Children</span><strong>{selectionInfo.childCount}</strong></div>
                      <div className="pg-prop"><span>Meshes</span><strong>{sceneInfo.meshCount}</strong></div>
                      <div className="pg-prop"><span>Materials</span><strong>{sceneInfo.materialCount}</strong></div>
                      <div className="pg-prop"><span>Bounds</span><strong>{sceneInfo.size.x} \u00D7 {sceneInfo.size.y} \u00D7 {sceneInfo.size.z}</strong></div>
                    </div>
                  </div>

                  {/* Outliner */}
                  <div className="pg-section">
                    <div className="pg-section-label">Outliner</div>
                    <input
                      className="pg-search"
                      type="text"
                      value={nodeQuery}
                      onChange={(e) => setNodeQuery(e.target.value)}
                      placeholder="Search nodes\u2026"
                    />
                    <div className="pg-outliner">
                      {filteredNodes.length ? (
                        filteredNodes.map((node, idx) => (
                          <button
                            className={`pg-outliner-row ${selectedPath === node.path ? "is-selected" : ""}`}
                            key={node.path}
                            type="button"
                            onClick={() => {
                              const n = findNodeByPath(activeModelRef.current, node.path);
                              if (n) updateSelectionState(n);
                            }}
                          >
                            <span className="pg-outliner-idx">{String(idx + 1).padStart(2, "0")}</span>
                            <div className="pg-outliner-meta">
                              <strong>{node.label}</strong>
                              <small>{node.type}{node.isMesh ? " \u00B7 Mesh" : ""}{node.childCount ? ` \u00B7 ${node.childCount}ch` : ""}</small>
                            </div>
                          </button>
                        ))
                      ) : (
                        <p className="pg-muted">No nodes to display.</p>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* ── Scene Tab ── */}
              {rightTab === "scene" && (
                <>
                  <div className="pg-section">
                    <div className="pg-section-label">Environment</div>
                    <div className="pg-chip-row">
                      {Object.entries(ENVIRONMENT_PRESETS).map(([key, preset]) => (
                        <button
                          key={key}
                          className={`pg-chip ${environmentKey === key ? "is-active" : ""}`}
                          type="button"
                          onClick={() => setEnvironmentKey(key)}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">Lighting & Camera</div>
                    <label className="pg-slider">
                      <span>Exposure</span>
                      <input type="range" min="0.5" max="2" step="0.02" value={exposure} onChange={(e) => setExposure(Number(e.target.value))} />
                      <strong>{exposure.toFixed(2)}</strong>
                    </label>
                    <label className="pg-slider">
                      <span>Light</span>
                      <input type="range" min="0.3" max="2" step="0.05" value={lightIntensity} onChange={(e) => setLightIntensity(Number(e.target.value))} />
                      <strong>{lightIntensity.toFixed(2)}</strong>
                    </label>
                    <label className="pg-slider">
                      <span>FOV</span>
                      <input type="range" min="15" max="120" step="1" value={cameraFov} onChange={(e) => setCameraFov(Number(e.target.value))} />
                      <strong>{cameraFov}\u00B0</strong>
                    </label>
                    <label className="pg-slider">
                      <span>Rotate speed</span>
                      <input type="range" min="0" max="3" step="0.05" value={autoRotateSpeed} onChange={(e) => setAutoRotateSpeed(Number(e.target.value))} />
                      <strong>{autoRotateSpeed.toFixed(2)}</strong>
                    </label>
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">Structure</div>
                    <label className="pg-slider">
                      <span>Explode</span>
                      <input type="range" min="0" max="1" step="0.02" value={explodeFactor} onChange={(e) => setExplodeFactor(Number(e.target.value))} />
                      <strong>{explodeFactor.toFixed(2)}</strong>
                    </label>
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">Shadow Quality</div>
                    <div className="pg-chip-row">
                      {["low", "medium", "high"].map((q) => (
                        <button
                          key={q}
                          className={`pg-chip ${shadowQuality === q ? "is-active" : ""}`}
                          type="button"
                          onClick={() => setShadowQuality(q)}
                        >
                          {q.charAt(0).toUpperCase() + q.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">XR Planes</div>
                    <div className="pg-chip-row">
                      <button
                        className={`pg-chip ${showPlanes ? "is-active" : ""}`}
                        type="button"
                        onClick={() => setShowPlanes((v) => !v)}
                      >
                        {showPlanes ? "Visible" : "Hidden"}
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* ── Animation Tab ── */}
              {rightTab === "animation" && (
                <div className="pg-section">
                  <div className="pg-section-label">Clip Playback</div>
                  {availableClips.length ? (
                    <>
                      <div className="pg-chip-row">
                        {availableClips.map((clipName) => (
                          <button
                            key={clipName}
                            className={`pg-chip ${activeClip === clipName ? "is-active" : ""}`}
                            type="button"
                            onClick={() => setActiveClip(clipName)}
                          >
                            {clipName}
                          </button>
                        ))}
                      </div>
                      <div className="pg-chip-row">
                        <button
                          className={`pg-chip ${animationPlaying ? "is-active" : ""}`}
                          type="button"
                          onClick={() => setAnimationPlaying((v) => !v)}
                        >
                          {animationPlaying ? "\u23F8 Pause" : "\u25B6 Play"}
                        </button>
                        <button className="pg-chip" type="button" onClick={restartAnimation}>
                          {"\u21BA"} Restart
                        </button>
                      </div>
                      <label className="pg-slider">
                        <span>Speed</span>
                        <input type="range" min="0.1" max="3" step="0.05" value={animationSpeed} onChange={(e) => setAnimationSpeed(Number(e.target.value))} />
                        <strong>{animationSpeed.toFixed(2)}x</strong>
                      </label>
                    </>
                  ) : (
                    <p className="pg-muted">No animation clips in this asset. Upload a GLB with animations to use this panel.</p>
                  )}
                </div>
              )}

              {/* ── Effects Tab ── */}
              {rightTab === "effects" && (
                <>
                  <div className="pg-section">
                    <div className="pg-section-label">Post-Processing</div>
                    <div className="pg-chip-row">
                      <button
                        className={`pg-chip ${bloomEnabled ? "is-active" : ""}`}
                        type="button"
                        onClick={() => setBloomEnabled((v) => !v)}
                      >
                        {bloomEnabled ? "Bloom ON" : "Bloom OFF"}
                      </button>
                    </div>
                    {bloomEnabled && (
                      <>
                        <label className="pg-slider">
                          <span>Strength</span>
                          <input type="range" min="0" max="2" step="0.05" value={bloomStrength} onChange={(e) => setBloomStrength(Number(e.target.value))} />
                          <strong>{bloomStrength.toFixed(2)}</strong>
                        </label>
                        <label className="pg-slider">
                          <span>Radius</span>
                          <input type="range" min="0" max="1" step="0.05" value={bloomRadius} onChange={(e) => setBloomRadius(Number(e.target.value))} />
                          <strong>{bloomRadius.toFixed(2)}</strong>
                        </label>
                        <label className="pg-slider">
                          <span>Threshold</span>
                          <input type="range" min="0" max="1" step="0.05" value={bloomThreshold} onChange={(e) => setBloomThreshold(Number(e.target.value))} />
                          <strong>{bloomThreshold.toFixed(2)}</strong>
                        </label>
                      </>
                    )}
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">Material Color</div>
                    <p className="pg-muted">
                      {canEditSelectedMaterialColor
                        ? selectionInfo.isMesh
                          ? "Apply one of the RAL presets or fine-tune the selected mesh with a custom color."
                          : "Apply one of the RAL presets or a custom color to the current asset or selected group."
                        : "Load an asset to change its material color."}
                    </p>
                    <div className="pg-ral-grid">
                      {RAL_COLOR_OPTIONS.map((option) => (
                        <button
                          key={option.key}
                          className={`pg-ral-option ${activeRalColorKey === option.key ? "is-active" : ""}`}
                          type="button"
                          onClick={() => handleSelectedMaterialColorChange(option.hex)}
                          disabled={!canEditSelectedMaterialColor}
                          title={`${option.code} ${option.label}`}
                        >
                          <span className="pg-ral-swatch" style={{ backgroundColor: option.hex }} />
                          <span className="pg-ral-copy">
                            <strong>{option.code}</strong>
                            <small>{option.label}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="pg-tint-row">
                      <label className={`pg-color-picker ${!canEditSelectedMaterialColor ? "is-disabled" : ""}`}>
                        <span>Custom</span>
                        <input
                          className="pg-color-input"
                          type="color"
                          value={customMaterialColor}
                          onChange={(e) => handleSelectedMaterialColorChange(e.target.value)}
                          disabled={!canEditSelectedMaterialColor}
                        />
                      </label>
                      <span className="pg-tint-value">{customMaterialColor.toUpperCase()}</span>
                      <button className="pg-btn pg-btn-sm" type="button" onClick={resetSelectedMaterialColor} disabled={!canEditSelectedMaterialColor}>
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">Main + Sub Color</div>
                    <p className="pg-muted">
                      {canApplyTwoToneSplit
                        ? "Set a main color, a sub color, and the accent share for multi-part models like 80/20 product finishes."
                        : "Select the full asset or a group with multiple meshes to apply a main/sub color split."}
                    </p>

                    <div className="pg-color-split-grid">
                      <div className="pg-color-card">
                        <div className="pg-color-card-head">
                          <strong>Main color</strong>
                          <span>{mainMaterialColor.toUpperCase()}</span>
                        </div>
                        <div className="pg-swatch-row">
                          {RAL_COLOR_OPTIONS.map((option) => (
                            <button
                              key={`main-${option.key}`}
                              className={`pg-swatch-btn ${activeMainRalColorKey === option.key ? "is-active" : ""}`}
                              type="button"
                              onClick={() => setMainMaterialColor(option.hex)}
                              title={`${option.code} ${option.label}`}
                            >
                              <span className="pg-swatch-btn-fill" style={{ backgroundColor: option.hex }} />
                            </button>
                          ))}
                        </div>
                        <div className="pg-tint-row">
                          <label className="pg-color-picker">
                            <span>Custom</span>
                            <input
                              className="pg-color-input"
                              type="color"
                              value={mainMaterialColor}
                              onChange={(e) => setMainMaterialColor(e.target.value)}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="pg-color-card">
                        <div className="pg-color-card-head">
                          <strong>Sub color</strong>
                          <span>{subMaterialColor.toUpperCase()}</span>
                        </div>
                        <div className="pg-swatch-row">
                          {RAL_COLOR_OPTIONS.map((option) => (
                            <button
                              key={`sub-${option.key}`}
                              className={`pg-swatch-btn ${activeSubRalColorKey === option.key ? "is-active" : ""}`}
                              type="button"
                              onClick={() => setSubMaterialColor(option.hex)}
                              title={`${option.code} ${option.label}`}
                            >
                              <span className="pg-swatch-btn-fill" style={{ backgroundColor: option.hex }} />
                            </button>
                          ))}
                        </div>
                        <div className="pg-tint-row">
                          <label className="pg-color-picker">
                            <span>Custom</span>
                            <input
                              className="pg-color-input"
                              type="color"
                              value={subMaterialColor}
                              onChange={(e) => setSubMaterialColor(e.target.value)}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <label className="pg-slider">
                      <span>Sub share</span>
                      <input
                        type="range"
                        min="5"
                        max="95"
                        step="5"
                        value={subColorRatio}
                        onChange={(e) => setSubColorRatio(Number(e.target.value))}
                      />
                      <strong>{subColorRatio}%</strong>
                    </label>

                    <div className="pg-color-actions">
                      <button className="pg-btn pg-btn-accent" type="button" onClick={applyTwoToneMaterialSplit} disabled={!canApplyTwoToneSplit}>
                        Apply {100 - subColorRatio}/{subColorRatio} Split
                      </button>
                      <button className="pg-btn" type="button" onClick={resetTwoToneControls}>
                        Reset Split
                      </button>
                    </div>
                  </div>

                  <div className="pg-section">
                    <div className="pg-section-label">Config</div>
                    <div className="pg-chip-row">
                      <button className="pg-chip" type="button" onClick={copyConfiguration}>Copy JSON</button>
                      <button className="pg-chip" type="button" onClick={() => setShowCodeExport(true)}>View Code</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* ── Footer Status Bar ── */}
      <footer className="pg-footer">
        <div className="pg-footer-section">
          <span className="pg-stat">FPS <strong>{stats.fps}</strong></span>
          <span className="pg-stat">Tris <strong>{stats.triangles.toLocaleString()}</strong></span>
          <span className="pg-stat">Draw <strong>{stats.calls}</strong></span>
          <span className="pg-stat">Tex <strong>{stats.textures}</strong></span>
          <span className="pg-stat">Geo <strong>{stats.geometries}</strong></span>
        </div>
        <div className="pg-footer-section pg-footer-hint">
          <span>{copy.dragHint}</span>
        </div>
        <div className="pg-footer-section">
          <span className="pg-stat">Meshes <strong>{sceneInfo.meshCount}</strong></span>
          <span className="pg-stat">Mats <strong>{sceneInfo.materialCount}</strong></span>
          <span className="pg-stat">Size <strong>{sceneInfo.size.x}\u00D7{sceneInfo.size.y}\u00D7{sceneInfo.size.z}</strong></span>
        </div>
      </footer>

      {/* ── Keyboard Shortcuts Modal ── */}
      {showShortcuts && (
        <div className="pg-modal-backdrop" onClick={() => setShowShortcuts(false)}>
          <div className="pg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pg-modal-header">
              <h3>Keyboard Shortcuts</h3>
              <button className="pg-btn pg-btn-sm" type="button" onClick={() => setShowShortcuts(false)}>{"\u00D7"}</button>
            </div>
            <div className="pg-shortcut-grid">
              {SHORTCUTS.map((s) => (
                <div className="pg-shortcut-row" key={s.keys}>
                  <kbd className="pg-kbd">{s.keys}</kbd>
                  <span>{s.action}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Code Export Modal ── */}
      {showCodeExport && (
        <div className="pg-modal-backdrop" onClick={() => setShowCodeExport(false)}>
          <div className="pg-modal pg-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="pg-modal-header">
              <h3>Three.js Scene Export</h3>
              <button className="pg-btn pg-btn-sm" type="button" onClick={() => setShowCodeExport(false)}>{"\u00D7"}</button>
            </div>
            <pre className="pg-code-block">{generateThreeJsCode()}</pre>
            <div className="pg-modal-actions">
              <button className="pg-btn pg-btn-accent" type="button" onClick={() => {
                navigator.clipboard.writeText(generateThreeJsCode()).then(() => pushActionMessage("Code copied.")).catch(() => {});
              }}>
                Copy Code
              </button>
              <button className="pg-btn" type="button" onClick={copyConfiguration}>
                Copy Config JSON
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaygroundExperience;
