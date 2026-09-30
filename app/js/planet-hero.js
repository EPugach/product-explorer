// ══════════════════════════════════════════════════════════════
//  PLANET HERO — the domain view's rotating planet + component moons
//  Small second WebGL renderer, reusing galaxy-3d.js's planet shaders
//  so the planet you dive into is the same one you saw in the galaxy.
//  Cosmetic only: moon names and clicks live in the accessible DOM
//  component list, not on this canvas. One instance, re-targeted per
//  domain; paused whenever the domain view isn't showing.
// ══════════════════════════════════════════════════════════════

import * as THREE from "../vendor/three.0.184.min.js";
import {
  LIGHT_VIEW, archetype, _hash,
  SPHERE_VERT, PLANET_FRAG, CLOUD_FRAG, ATMO_FRAG, MOON_VERT, MOON_FRAG,
} from "./galaxy-3d.js";
import { prefersReducedMotion } from "./state.js";

let _renderer = null, _scene = null, _camera = null;
let _planet = null, _atmo = null, _clouds = null, _moons = null;
let _moonData = [];
let _u = null;
let _raf = 0, _running = false, _t = 0, _last = 0;
let _highlight = -1;
let _canvas = null;
const BG = 0x010207;

function _ensure(canvas) {
  if (_renderer && _canvas === canvas) return true;
  try {
    _canvas = canvas;
    _renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    _renderer.toneMapping = THREE.ACESFilmicToneMapping;
    _renderer.toneMappingExposure = 1.1;
    _renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    _scene = new THREE.Scene();
    _camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    _camera.position.set(0, 1.3, 9.6); // wide enough that the outer moon orbit stays in frame
    _camera.lookAt(0, 0, 0);
    return true;
  } catch (err) {
    console.warn("[planet-hero] WebGL unavailable:", err);
    _renderer = null;
    return false;
  }
}

function _clear() {
  for (const o of [_planet, _moons]) {
    if (!o) continue;
    _scene.remove(o);
    o.traverse((c) => { c.material?.dispose?.(); });
  }
  _planet = _atmo = _clouds = _moons = null;
  _moonData = [];
}

// Build the hero for one domain. Returns false when WebGL isn't available
// (the caller keeps the flat CSS orb instead).
export function showPlanetHero(canvas, { id, color, group, components }) {
  if (!_ensure(canvas)) return false;
  _clear();
  const type = archetype(group);
  _u = {
    uColor: { value: new THREE.Color(color) },
    uLight: { value: LIGHT_VIEW.clone() },
    uSeed: { value: _hash(id) },
    uHover: { value: 0.25 }, uDim: { value: 0 }, uTime: { value: 0 },
  };
  const hi = new THREE.SphereGeometry(1, 128, 96), lo = new THREE.SphereGeometry(1, 48, 32);
  _planet = new THREE.Mesh(hi, new THREE.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: PLANET_FRAG,
    uniforms: {
      ..._u, uBg: { value: new THREE.Color(BG) }, uType: { value: type },
      uLights: { value: THREE.MathUtils.clamp(components.length / 7, 0.35, 1) },
      uSpin: { value: prefersReducedMotion ? 0 : 0.06 },
    },
  }));
  _atmo = new THREE.Mesh(lo, new THREE.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: ATMO_FRAG, side: THREE.BackSide,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { ..._u, uSpin: { value: 0 } },
  }));
  _atmo.scale.setScalar(1.1);
  _planet.add(_atmo);
  if (type < 2) {
    _clouds = new THREE.Mesh(lo, new THREE.ShaderMaterial({
      vertexShader: SPHERE_VERT, fragmentShader: CLOUD_FRAG, transparent: true, depthWrite: false,
      uniforms: { ..._u, uSpin: { value: prefersReducedMotion ? 0 : 0.09 } },
    }));
    _clouds.scale.setScalar(1.018);
    _planet.add(_clouds);
  }
  _scene.add(_planet);

  // One moon per component on a tilted orbit; brightened when its DOM row is hovered.
  const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.32, 0, 0.12));
  _moonData = components.map((_, i) => ({
    phase: (i / Math.max(components.length, 1)) * Math.PI * 2,
    orbit: 1.9 + (i % 2) * 0.45, tilt,
  }));
  if (_moonData.length) {
    _moons = new THREE.InstancedMesh(lo, new THREE.ShaderMaterial({
      vertexShader: MOON_VERT, fragmentShader: MOON_FRAG, uniforms: { uLight: _u.uLight },
    }), _moonData.length);
    _moonData.forEach((_, i) => _moons.setColorAt(i, _u.uColor.value));
    _moons.frustumCulled = false;
    _scene.add(_moons);
  }
  _highlight = -1;
  _resize();
  resumePlanetHero();
  return true;
}

// Highlight the moon for component index i (-1 clears) — wired to the DOM list.
export function highlightMoon(i) { _highlight = i; }

function _resize() {
  if (!_renderer || !_canvas) return;
  const w = _canvas.clientWidth || 1, h = _canvas.clientHeight || 1;
  _renderer.setSize(w, h, false);
  _camera.aspect = w / h;
  _camera.updateProjectionMatrix();
}

const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _p = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
function _frame(now) {
  if (!_running) return;
  const dt = Math.min((now - _last) / 1000, 0.1);
  _last = now;
  if (!prefersReducedMotion) _t += dt;
  _u.uTime.value = _t;
  if (_moons) {
    _moonData.forEach((m, i) => {
      const a = m.phase + _t * 0.18;
      _p.set(Math.cos(a) * m.orbit, 0, Math.sin(a) * m.orbit).applyQuaternion(m.tilt);
      const on = i === _highlight;
      _m.compose(_p, _q, _s.setScalar(on ? 0.2 : 0.12));
      _moons.setMatrixAt(i, _m);
      _moons.setColorAt(i, _c.copy(_u.uColor.value).multiplyScalar(on ? 1.8 : 1.0));
    });
    _moons.instanceMatrix.needsUpdate = true;
    _moons.instanceColor.needsUpdate = true;
  }
  if (_canvas.clientWidth && (_canvas.width !== Math.round(_canvas.clientWidth * _renderer.getPixelRatio()))) _resize();
  _renderer.render(_scene, _camera);
  _raf = requestAnimationFrame(_frame);
}

export function resumePlanetHero() {
  if (!_renderer || _running || !_planet) return;
  _running = true;
  _last = performance.now();
  _raf = requestAnimationFrame(_frame);
}
export function pausePlanetHero() {
  _running = false;
  cancelAnimationFrame(_raf);
}
