// ══════════════════════════════════════════════════════════════
//  GALAXY 3D — WebGL planet renderer (hybrid layer)
//  Renders luminous-orb spheres positioned to match the DOM
//  .planet-node hit zones. DOM owns input, accessibility, drag,
//  pan, keyboard nav; this layer is purely cosmetic. Pointer
//  events do not reach this canvas (pointer-events: none in CSS).
// ══════════════════════════════════════════════════════════════

import * as THREE from "../vendor/three.0.184.min.js";
import { nodeMap, zoom, panX, panY } from "./physics.js";
import { prefersReducedMotion } from "./state.js";
import { lightenColor } from "./utils.js";

// ── Module state ──
let _canvas = null;
let _renderer = null;
let _scene = null;
let _camera = null;
let _geometry = null; // shared SphereGeometry
let _ambient = null;
let _directional = null;
let _meshes = {}; // id → THREE.Mesh
let _hoverId = null;
let _theme = "dark";
let _initialized = false;
let _paused = false;
let _lastTime = 0;

// ── Tunables ──
const BASE_EMISSIVE_DARK = 0.42;
const BASE_EMISSIVE_LIGHT = 0.24; // enough self-color to read vivid (not gray) on white, matte material keeps it solid
const HOVER_EMISSIVE_BUMP = 0.3;
const HOVER_SCALE = 1.04;
const HOVER_LERP_SPEED = 15; // exponential lerp speed (per second)
const SPIN_BASE = 0.00045; // rad/ms — slow Y-axis spin
const SPIN_JITTER = 0.0004; // ± randomized per planet
const BREATH_SPEED = 0.0009; // rad/ms — emissive breath
const BREATH_AMPLITUDE = 0.04; // ± of emissive intensity

// ── Init ──
export function initGalaxy3D(nodes, _nodeMap, opts = {}) {
  if (_initialized) return true;
  _canvas = document.getElementById("galaxy-3d");
  if (!_canvas) {
    console.warn("[galaxy-3d] #galaxy-3d canvas not found, skipping init");
    return false;
  }

  try {
    _renderer = new THREE.WebGLRenderer({
      canvas: _canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    _renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    _renderer.setSize(window.innerWidth, window.innerHeight, false);
    _renderer.setClearColor(0x000000, 0);

    _scene = new THREE.Scene();

    const w = window.innerWidth;
    const h = window.innerHeight;
    _camera = new THREE.OrthographicCamera(
      -w / 2,
      w / 2,
      h / 2,
      -h / 2,
      1,
      2000,
    );
    _camera.position.set(0, 0, 1000);
    _camera.lookAt(0, 0, 0);

    // Geometry shared across all spheres (one allocation)
    _geometry = new THREE.SphereGeometry(1, 48, 32);

    // Lights — top-left directional + soft ambient
    _ambient = new THREE.AmbientLight(0x404060, 0.6);
    _scene.add(_ambient);
    _directional = new THREE.DirectionalLight(0xffffff, 1.4);
    _directional.position.set(-300, 300, 500);
    _scene.add(_directional);

    // One mesh per node
    for (const n of nodes) {
      const mesh = _createPlanetMesh(n);
      _meshes[n.id] = mesh;
      _scene.add(mesh);
    }

    _lastTime = performance.now();
    _initialized = true;
    document.body.classList.remove("no-webgl");
    return true;
  } catch (err) {
    console.warn("[galaxy-3d] init failed, falling back to CSS planets:", err);
    document.body.classList.add("no-webgl");
    _initialized = false;
    return false;
  }
}

function _createPlanetMesh(n) {
  const color = new THREE.Color(n.color);
  const sheenC = new THREE.Color(lightenColor(n.color, 30));

  const mat = new THREE.MeshPhysicalMaterial({
    color,
    emissive: color.clone(),
    emissiveIntensity: BASE_EMISSIVE_DARK,
    roughness: 0.5,
    metalness: 0.0,
    clearcoat: 0.12,
    clearcoatRoughness: 0.5,
    sheen: 0.1,
    sheenColor: sheenC,
    sheenRoughness: 0.7,
  });

  const mesh = new THREE.Mesh(_geometry, mat);

  // Per-planet state
  mesh.userData.spinRate = SPIN_BASE + (Math.random() - 0.5) * 2 * SPIN_JITTER;
  mesh.userData.tilt = (Math.random() - 0.5) * 0.3;
  mesh.userData.breathPhase = Math.random() * Math.PI * 2;
  mesh.userData.hoverScale = 1.0;
  mesh.userData.hoverEmissive = 0.0; // 0 → 1 hover progress
  mesh.userData.bouncePhase = 0.0; // set to 1.0 on release, decays each frame
  mesh.userData.id = n.id;
  mesh.rotation.x = mesh.userData.tilt;

  // Initial position (will be re-synced every frame)
  _syncMeshPosition(mesh, n);
  return mesh;
}

function _syncMeshPosition(mesh, n) {
  mesh.position.x = n.x * zoom + panX - window.innerWidth / 2;
  mesh.position.y = -(n.y * zoom + panY - window.innerHeight / 2);
  // mesh.position.z stays 0
  // visual scale = node radius × zoom × hover spring × release bounce
  const baseR = n.radius * zoom;
  // Release bounce: a single damped scale pulse on drop. bouncePhase decays
  // from 1.0 → 0; the sin(phase·π) shape gives a 0→peak→0 hump that fades.
  const bp = mesh.userData.bouncePhase;
  const bounceScale = bp > 0.001 ? 1 + Math.sin(bp * Math.PI) * 0.12 * bp : 1.0;
  mesh.scale.setScalar(baseR * mesh.userData.hoverScale * bounceScale);
}

// ── Render (called every frame from main.js particleTick) ──
export function renderGalaxy3D() {
  if (!_initialized || _paused) return;

  const now = performance.now();
  let dt = now - _lastTime; // milliseconds
  _lastTime = now;
  // Clamp dt to avoid huge jumps after tab switch / hidden phase
  if (dt > 100) dt = 16;
  const dtSec = dt / 1000;
  const reduced = prefersReducedMotion;

  for (const id in _meshes) {
    const mesh = _meshes[id];
    const n = nodeMap[id];
    if (!n) continue;

    // Idle spin (skipped under reduced motion)
    if (!reduced) {
      mesh.rotation.y += mesh.userData.spinRate * dt;
    }

    // Hover spring (exponential lerp toward target)
    const isHovered = id === _hoverId;
    const targetEmissive = isHovered ? 1.0 : 0.0;
    const targetScale = isHovered ? HOVER_SCALE : 1.0;
    const lerpAlpha = reduced ? 1 : Math.min(1, dtSec * HOVER_LERP_SPEED);
    mesh.userData.hoverEmissive +=
      (targetEmissive - mesh.userData.hoverEmissive) * lerpAlpha;
    mesh.userData.hoverScale +=
      (targetScale - mesh.userData.hoverScale) * lerpAlpha;

    // Breath modulation (skipped under reduced motion)
    let breathAdd = 0;
    if (!reduced) {
      mesh.userData.breathPhase += BREATH_SPEED * dt;
      breathAdd = Math.sin(mesh.userData.breathPhase) * BREATH_AMPLITUDE;
    }

    // Release bounce decay: phase drops from 1.0 → 0 over ~250ms.
    // Visual contribution lives in _syncMeshPosition (scale factor).
    if (mesh.userData.bouncePhase > 0.001) {
      mesh.userData.bouncePhase *= 0.85;
    } else if (mesh.userData.bouncePhase !== 0) {
      mesh.userData.bouncePhase = 0;
    }

    // Combine: base emissive + hover bump + breath
    const baseEmissive =
      _theme === "light" ? BASE_EMISSIVE_LIGHT : BASE_EMISSIVE_DARK;
    mesh.material.emissiveIntensity =
      baseEmissive +
      mesh.userData.hoverEmissive * HOVER_EMISSIVE_BUMP +
      breathAdd;

    // Position + scale sync (DOM nodeMap is the source of truth)
    _syncMeshPosition(mesh, n);
  }

  _renderer.render(_scene, _camera);
}

// ── Synchronous sphere update (called from pointer-events.js during drag
//    to eliminate the 1-frame lag between DOM .left/.top write and the next
//    rAF render) ──
export function syncSphere(id) {
  if (!_initialized) return;
  const mesh = _meshes[id];
  const n = nodeMap[id];
  if (mesh && n) _syncMeshPosition(mesh, n);
}

// ── Hover state (called from pointer-events.js pointerover/pointerout) ──
export function setHover3D(id) {
  _hoverId = id || null;
}

// ── Release bounce (called from pointer-events.js pointerup after a drag) ──
// Triggers a brief scale pulse on the named sphere so the user gets a tiny
// visual cue when they drop a planet — without the system relaxing back to
// its original layout. Pure cosmetic, no physics involvement.
export function triggerReleaseBounce(id) {
  if (!_initialized) return;
  const mesh = _meshes[id];
  if (mesh) mesh.userData.bouncePhase = 1.0;
}

// ── Theme (called from main.js toggleTheme) ──
export function setTheme3D(theme) {
  _theme = theme === "light" ? "light" : "dark";
  if (!_initialized) return;
  if (_theme === "light") {
    _ambient.color.setHex(0xffffff);
    _ambient.intensity = 0.7;
    _directional.intensity = 1.2;
  } else {
    _ambient.color.setHex(0x404060);
    _ambient.intensity = 0.6;
    _directional.intensity = 1.4;
  }
}

// ── Resize ──
export function resizeGalaxy3D() {
  if (!_initialized) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  _renderer.setSize(w, h, false);
  _camera.left = -w / 2;
  _camera.right = w / 2;
  _camera.top = h / 2;
  _camera.bottom = -h / 2;
  _camera.updateProjectionMatrix();
}

// ── Pause / resume (loop is gated externally via main.js particleTick;
//    these are convenience hooks for explicit external pausing) ──
export function pauseGalaxy3D() {
  _paused = true;
}
export function resumeGalaxy3D() {
  _paused = false;
  _lastTime = performance.now();
}

// ── Dispose ──
export function disposeGalaxy3D() {
  if (!_initialized) return;
  for (const id in _meshes) {
    const m = _meshes[id];
    _scene.remove(m);
    m.material.dispose();
  }
  _meshes = {};
  if (_geometry) _geometry.dispose();
  if (_renderer) _renderer.dispose();
  _initialized = false;
}
