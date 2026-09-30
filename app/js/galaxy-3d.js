// ══════════════════════════════════════════════════════════════
//  GALAXY 3D — WebGL planet renderer (hybrid layer)
//  Cinematic look (redesign 2026-09): HDR bloom + ACES tone mapping,
//  four planet archetypes by cluster (ocean · verdant · gas giant ·
//  industrial), scattering atmospheres, clouds, night-side lights,
//  component moons, energy-stream edges, nebula + sun backdrop.
//
//  Contract (unchanged): DOM .planet-node owns input, accessibility,
//  drag, pan, keyboard nav, labels and icons. This canvas is cosmetic
//  and pointer-events:none. Positions are read from nodeMap and mapped
//  with the same zoom/pan as the DOM, so hit zones and spheres agree.
//  Init failure → body.no-webgl (CSS matte planets), preserved.
// ══════════════════════════════════════════════════════════════

import * as THREE from "../vendor/three.0.184.min.js";
import { EffectComposer } from "../vendor/three-addons/postprocessing/EffectComposer.js";
import { RenderPass } from "../vendor/three-addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../vendor/three-addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "../vendor/three-addons/postprocessing/ShaderPass.js";
import { OutputPass } from "../vendor/three-addons/postprocessing/OutputPass.js";
import { nodeMap, edges, zoom, panX, panY } from "./physics.js";
import { prefersReducedMotion } from "./state.js";

// ── Module state ──
let _canvas = null;
let _renderer = null;
let _composer = null;
let _bloom = null;
let _lens = null;
let _scene = null;
let _camera = null;
let _nebula = null;
let _sun = null;
let _moons = null;
let _planets = {}; // id → { mesh, atmo, clouds, u, cur, tgt }
let _moonData = [];
let _edgeObjs = [];
let _hoverId = null;
let _focusIds = null; // Set of ids kept bright (hover neighbours, tour stops, search matches)
let _initialized = false;
let _paused = false;
let _lastTime = 0;
let _t = 0;
let _tier = 0;
let _frameTimes = [];

// ── Tunables ──
export const LIGHT_VIEW = new THREE.Vector3(-0.62, 0.5, 0.6).normalize(); // key light (view space)
// The scene clears to black; the visible navy base + nebula are added in the lens
// pass (LENS_FRAG) so they sit under the bloom. BG is what planets dim toward.
const BG = 0x000000;
const DIM_TOWARD = 0x0b1224;
const EDGE_REST = 0.065;
const EDGE_ON = 0.75;
const EDGE_OFF = 0.012;
const HOVER_SCALE = 0.1;
const LERP = 0.001; // per-second residual for exponential smoothing (smaller = snappier)
const TIERS = [
  { pr: 2, bloom: true, clouds: true },
  { pr: 1.25, bloom: true, clouds: true },
  { pr: 1, bloom: false, clouds: false },
];
const SLOW_FRAME_MS = 22;
const WARMUP_S = 4;
const DEBUG = new Set((new URLSearchParams(location.search).get("debug3d") || "").split(",").filter(Boolean));
let _slowWindows = 0;
const GROUP_Z = [80, -40, 0, -110]; // depth per cluster (orthographic: affects only draw order + fog)

// Cluster → planet archetype. Groups beyond 3 wrap.
//   0 ocean world · 1 verdant world · 2 gas giant · 3 industrial rock
export const archetype = (g) => (g == null ? 0 : g % 4);

export const _hash = (s) => [...s].reduce((n, c) => (n * 31 + c.charCodeAt(0)) % 997, 17) / 997;

// ── Shared GLSL ──
const NOISE = `
  float hash(vec3 p){ p=fract(p*.1031); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
  float noise(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
               mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z); }
  float fbm(vec3 p){ float f=0.0,a=.5; for(int i=0;i<5;i++){ f+=a*noise(p); p=p*2.03+3.1; a*=.5; } return f; }`;

export const SPHERE_VERT = `
  uniform float uTime, uSpin; varying vec3 vN; varying vec3 vP; varying vec3 vV;
  void main(){
    vN = normalize(normalMatrix * normal);
    float a = uTime * uSpin; vP = position; vP.xz = mat2(cos(a), -sin(a), sin(a), cos(a)) * vP.xz;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vV = vec3(0.0, 0.0, 1.0); // orthographic view direction
    gl_Position = projectionMatrix * mv;
  }`;

export const PLANET_FRAG = `precision highp float; ${NOISE}
  varying vec3 vN; varying vec3 vP; varying vec3 vV;
  uniform vec3 uColor, uLight, uBg; uniform float uSeed, uHover, uDim, uType, uLights;
  void main(){
    vec3 n = normalize(vN), p = normalize(vP), L = normalize(uLight), V = normalize(vV);
    float ndl = dot(n, L);
    float h = fbm(p * 2.3 + uSeed * 7.0), detail = fbm(p * 9.0 + uSeed * 3.0);
    vec3 alb; float ocean = 0.0, land = 0.0;
    if (uType < 1.5) {                                   // ocean / verdant worlds
      float sea = uType < .5 ? .5 : .43;
      land = smoothstep(sea, sea + .025, h); ocean = 1.0 - land;
      vec3 oc = mix(uColor * .22, uColor * .85, smoothstep(sea - .25, sea, h));
      vec3 ground = mix(uColor * .45, mix(uColor, vec3(.86,.8,.66), .3) * .9, detail);
      ground = mix(ground, vec3(.85), smoothstep(.7, .78, h) * .55);
      alb = mix(oc, ground, land);
      alb = mix(alb, vec3(.88,.93,1.0) * .8, smoothstep(.83, .9, abs(p.y) + detail * .08));
    } else if (uType < 2.5) {                            // gas giant
      float b = sin((p.y * 9.0 + fbm(p * vec3(2.0, 7.0, 2.0) + uSeed * 5.0) * 2.4) * 3.14159);
      float storm = smoothstep(.72, .9, fbm(p * 4.0 + uSeed * 11.0));
      alb = mix(uColor * .35, mix(uColor, vec3(1.0,.92,.98), .38) * .8, b * .5 + .5);
      alb = mix(alb, vec3(1.0,.88,.95) * .75, storm * .55);
    } else {                                             // industrial rock
      float cr = fbm(p * 5.0 + uSeed * 13.0);
      alb = uColor * (.38 + .42 * detail) * (1.0 - smoothstep(.55, .62, cr) * .4);
      alb += uColor * .18 * smoothstep(.62, .66, cr);
      land = 1.0;
    }
    float diff = smoothstep(-.1, 1.0, ndl);
    vec3 col = alb * (diff * .95 + .012);
    vec3 H = normalize(L + V);                           // sun glint on water (blooms)
    col += vec3(1.0,.93,.8) * pow(max(dot(n, H), 0.0), 140.0) * ocean * 1.6 * step(0.0, ndl);
    float night = 1.0 - smoothstep(-.3, .05, ndl);             // city / machinery lights on the dark side
    float city = smoothstep(.76, .86, fbm(p * 24.0 + uSeed * 17.0)) * land;
    col += (uType > 2.5 ? vec3(.55,.8,1.0) : vec3(1.0,.7,.36)) * city * night * uLights * 2.6;
    float fr = pow(1.0 - max(dot(n, V), 0.0), 2.4);     // scattering: blue day limb, orange terminator
    vec3 sky = mix(vec3(1.0,.45,.2), mix(uColor, vec3(.55,.78,1.0), .55), smoothstep(-.15, .35, ndl));
    col += sky * fr * smoothstep(-.35, .25, ndl) * (uType > 2.5 ? .4 : .7) * (1.0 + uHover * 1.2);
    col = mix(col, uBg, uDim * .55); // dimmed planets keep ~45% (was 25%)
    gl_FragColor = vec4(col, 1.0);
  }`;

export const CLOUD_FRAG = `precision highp float; ${NOISE}
  varying vec3 vN; varying vec3 vP; varying vec3 vV;
  uniform vec3 uLight; uniform float uSeed, uDim, uTime;
  void main(){
    vec3 n = normalize(vN), p = normalize(vP);
    float c = fbm(p * 3.2 + vec3(uTime * .012, 0.0, uTime * .006) + uSeed * 5.0);
    c = smoothstep(.58, .78, c) * (1.0 - smoothstep(.8, .95, abs(p.y)) * .5);
    float diff = smoothstep(-.12, 1.0, dot(n, normalize(uLight)));
    gl_FragColor = vec4(vec3(1.0) * (diff * 1.05 + .01), c * .6 * (1.0 - uDim * .85));
  }`;

export const ATMO_FRAG = `precision highp float; varying vec3 vN; varying vec3 vV; uniform vec3 uColor, uLight; uniform float uHover, uDim;
  void main(){
    vec3 n = normalize(vN);
    float a = pow(clamp(-dot(n, normalize(vV)) / .42, 0.0, 1.0), 2.2);
    float lit = smoothstep(-.45, .6, dot(n, normalize(uLight)));
    vec3 sky = mix(vec3(1.0,.5,.25), mix(uColor, vec3(.6,.82,1.0), .55), lit);
    float k = a * (.15 + lit * .85) * (1.0 + uHover * 1.4) * (1.0 - uDim * .9);
    gl_FragColor = vec4(sky * k * 1.5, k);
  }`;

export const MOON_VERT = `varying vec3 vN; varying vec3 vC;
  void main(){
    #ifdef USE_INSTANCING_COLOR
      vC = instanceColor;
    #else
      vC = vec3(1.0);
    #endif
    vN = normalize(normalMatrix * mat3(instanceMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }`;
export const MOON_FRAG = `precision highp float; varying vec3 vN; varying vec3 vC; uniform vec3 uLight;
  void main(){
    vec3 n = normalize(vN);
    float diff = smoothstep(-.1, 1.0, dot(n, normalize(uLight)));
    vec3 alb = mix(vec3(.62,.64,.7), vC, .45);
    vec3 col = alb * (diff * 1.1 + .02) + vC * pow(1.0 - max(n.z, 0.0), 3.0) * .6;
    gl_FragColor = vec4(col * length(vC) / 1.2, 1.0);
  }`;

const TUBE_VERT = `varying vec2 vUv; varying vec3 vN;
  void main(){ vUv = uv; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const TUBE_FRAG = `precision highp float; varying vec2 vUv; varying vec3 vN;
  uniform vec3 uA, uB; uniform float uVis, uDir, uPhase, uPulse;
  void main(){
    float x = uDir > 0.0 ? vUv.x : 1.0 - vUv.x;
    // uPhase is accumulated on the CPU (phase += dt*speed). Computing time*speed
    // here made pulses leap many cycles whenever the speed eased up on hover.
    float pulse = pow(fract(x * 2.0 - uPhase), 12.0) * uPulse;
    float core = pow(abs(normalize(vN).z), 1.4);
    vec3 col = mix(uA, uB, vUv.x) * mix(vec3(1.0), vec3(1.2), pulse);
    gl_FragColor = vec4(col * (.4 + pulse * 2.4) * core * uVis, 1.0);
  }`;

const NEBULA_FRAG = `precision highp float; varying vec2 vUv; uniform float uTime; uniform vec3 uA, uB, uC; ${NOISE}
  void main(){
    vec2 p = (vUv - .5) * vec2(3.2, 2.0); float t = uTime * .012;
    float warp = fbm(vec3(p * 1.3, t));
    float d = fbm(vec3(p * 1.8 + warp * 1.5, t * 1.7 + 4.0));
    float band = exp(-pow((p.y + p.x * .35 - .1) * 1.3, 2.0));
    float cloud = smoothstep(.36, .95, d) * (.3 + band);
    vec3 col = mix(uA, uB, smoothstep(.3, .8, warp));
    col = mix(col, uC, smoothstep(.55, .9, fbm(vec3(p * 2.4, t + 9.0))) * .6);
    float dust = smoothstep(.6, .9, fbm(vec3(p * 5.0, t))) * band;
    vec3 c = col * cloud * 1.6 * (1.0 - dust * .6);
    c += vec3(1.0, .85, .7) * pow(band, 6.0) * smoothstep(.5, .9, d) * .12;
    gl_FragColor = vec4(max(c, 0.0) * (1.0 - smoothstep(.3, 1.9, length(p * vec2(.8, 1.0)))), 1.0);
  }`;

// The nebula is rendered separately (low-res, ~10 fps, see _renderNebula) and
// composited UNDER the bloomed scene here, so bloom can never make it shimmer.
// The scene clears to black, so "scene + nebula" layers correctly.
const LENS_FRAG = `precision highp float; uniform sampler2D tDiffuse, tNebula; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
  void main(){
    vec2 c = vUv - .5; float d = length(c);
    // Lifted navy base (not near-black) + nebula + bloomed scene.
    // Values here are LINEAR (OutputPass tone-maps + converts to sRGB after this pass).
    // Base ≈ sRGB #1b2645 lifted navy; nebula kept to a subtle wash on top.
    // Chromatic aberration applies to the SCENE only. (It used to overwrite the r/b
    // channels of the combined colour with scene-only samples, which stripped the
    // navy base + nebula out of red and blue and tinted the whole backdrop green.)
    float ca = .0009 * d;
    vec3 scene = texture2D(tDiffuse, vUv).rgb;
    scene.r = mix(scene.r, texture2D(tDiffuse, .5 + c * (1.0 + ca * 2.0)).r, .7);
    scene.b = mix(scene.b, texture2D(tDiffuse, .5 + c * (1.0 - ca * 2.0)).b, .7);
    vec3 col = vec3(.012, .022, .06) + texture2D(tNebula, vUv).rgb * .3 + scene;
    // Softer vignette (the old one made the whole frame feel heavy).
    col *= 1.0 - smoothstep(.45, 1.15, d * 1.22) * .55;
    // Static dither (screen-space only, no time term): hides banding in the dark
    // gradients without the frame-to-frame shimmer the animated grain caused.
    col += (fract(sin(dot(floor(vUv * uRes), vec2(12.9898, 78.233))) * 43758.5453) - .5) / 255.0;
    gl_FragColor = vec4(col, 1.0);
  }`;

// ── Capability gate: the cinematic layer needs WebGL2-class hardware ──
export function supportsGalaxy3D() {
  try {
    if (new URLSearchParams(location.search).has("lite")) return false;
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    const mem = navigator.deviceMemory;
    if (mem && mem < 4) return false;
    return true;
  } catch {
    return false;
  }
}

// ── Init ──
export function initGalaxy3D(nodes, _nm, opts = {}) {
  if (_initialized) return true;
  _canvas = document.getElementById("galaxy-3d");
  if (!_canvas) return false;
  try {
    const groups = opts.groups || {};
    const components = opts.components || {};
    const clusterHues = opts.clusterHues || [199, 173, 280, 218];

    _renderer = new THREE.WebGLRenderer({ canvas: _canvas, antialias: false, powerPreference: "high-performance" });
    _renderer.toneMapping = THREE.ACESFilmicToneMapping;
    _renderer.toneMappingExposure = 1.25;
    _renderer.setClearColor(BG, 1);

    _scene = new THREE.Scene();
    _scene.background = new THREE.Color(BG);
    const w = innerWidth, h = innerHeight;
    _camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 1, 5000);
    _camera.position.set(0, 0, 2000);
    _camera.lookAt(0, 0, 0);

    _composer = new EffectComposer(_renderer);
    _composer.addPass(new RenderPass(_scene, _camera));
    _bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.7, 0.5, 0.88);
    _composer.addPass(_bloom);
    _lens = new ShaderPass({
      uniforms: { tDiffuse: { value: null }, tNebula: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(w, h) } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: LENS_FRAG,
    });
    _composer.addPass(_lens);
    _composer.addPass(new OutputPass());

    _buildBackdrop(clusterHues);

    const lightU = { value: LIGHT_VIEW.clone() };
    const bgU = { value: new THREE.Color(DIM_TOWARD) };
    const sphereHi = new THREE.SphereGeometry(1, 96, 64);
    const sphereLo = new THREE.SphereGeometry(1, 48, 32);

    for (const n of nodes) {
      const type = archetype(groups[n.id]);
      const color = new THREE.Color(n.color);
      const base = {
        uColor: { value: color }, uLight: lightU, uSeed: { value: _hash(n.id) },
        uHover: { value: 0 }, uDim: { value: 0 }, uTime: { value: 0 },
      };
      const mesh = new THREE.Mesh(sphereHi, new THREE.ShaderMaterial({
        vertexShader: SPHERE_VERT, fragmentShader: PLANET_FRAG,
        uniforms: {
          ...base, uBg: bgU, uType: { value: type },
          uLights: { value: THREE.MathUtils.clamp((n.componentCount || 3) / 7, 0.35, 1) },
          uSpin: { value: prefersReducedMotion ? 0 : 0.04 + _hash(n.id) * 0.05 },
        },
      }));
      const atmo = new THREE.Mesh(sphereLo, new THREE.ShaderMaterial({
        vertexShader: SPHERE_VERT, fragmentShader: ATMO_FRAG, side: THREE.BackSide,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
        uniforms: { ...base, uSpin: { value: 0 } },
      }));
      atmo.scale.setScalar(1.1);
      mesh.add(atmo);
      let clouds = null;
      if (type < 2) {
        clouds = new THREE.Mesh(sphereLo, new THREE.ShaderMaterial({
          vertexShader: SPHERE_VERT, fragmentShader: CLOUD_FRAG, transparent: true, depthWrite: false,
          uniforms: { ...base, uSpin: { value: prefersReducedMotion ? 0 : 0.07 + _hash(n.id) * 0.05 } },
        }));
        clouds.scale.setScalar(1.018);
        mesh.add(clouds);
      }
      mesh.position.z = GROUP_Z[type];
      _scene.add(mesh);
      _planets[n.id] = { mesh, clouds, u: base, cur: { hover: 0, dim: 0 }, tgt: { hover: 0, dim: 0 } };
    }

    // Moons: one per real component, small and dim; brighten on the focused planet.
    for (const n of nodes) {
      const list = components[n.id] || [];
      const h0 = _hash(n.id);
      const tilt = new THREE.Quaternion().setFromEuler(new THREE.Euler(1.05 + h0 * 0.35, h0 * 6.28, 0.2));
      if (!_planets[n.id]) continue;
      list.forEach((_, i) => _moonData.push({
        pid: n.id, tilt, lane: i % 2, phase: (i / list.length) * Math.PI * 2 + h0 * 3,
        speed: (i % 2 ? 0.12 : 0.2) * (0.8 + h0 * 0.4), pos: new THREE.Vector3(),
      }));
    }
    if (_moonData.length) {
      _moons = new THREE.InstancedMesh(sphereLo, new THREE.ShaderMaterial({
        vertexShader: MOON_VERT, fragmentShader: MOON_FRAG, uniforms: { uLight: lightU },
      }), _moonData.length);
      _moonData.forEach((m, i) => _moons.setColorAt(i, _planets[m.pid].u.uColor.value));
      _moons.frustumCulled = false;
      _scene.add(_moons);
    }

    // Energy-stream edges (geometry rebuilt when layout changes — see _rebuildEdge).
    for (const e of edges) {
      if (!_planets[e.source] || !_planets[e.target]) continue;
      const u = {
        uA: { value: _planets[e.source].u.uColor.value }, uB: { value: _planets[e.target].u.uColor.value },
        uVis: { value: 0 }, uDir: { value: 1 },
        uPulse: { value: 0 }, uPhase: { value: _hash(e.source + e.target) },
      };
      const tube = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.ShaderMaterial({
        vertexShader: TUBE_VERT, fragmentShader: TUBE_FRAG, uniforms: u,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      }));
      tube.renderOrder = -1;
      _scene.add(tube);
      _edgeObjs.push({ e, tube, u, cur: EDGE_REST, tgt: EDGE_REST, key: "" });
    }

    _applyTier();
    _lastTime = performance.now();
    _initialized = true;
    document.body.classList.remove("no-webgl");
    document.body.classList.add("webgl-galaxy");
    return true;
  } catch (err) {
    console.warn("[galaxy-3d] init failed, falling back to CSS planets:", err);
    try { _composer?.dispose(); _renderer?.dispose(); } catch {}
    _renderer = _composer = _bloom = _lens = null;
    _planets = {}; _moonData = []; _edgeObjs = []; _moons = null;
    document.body.classList.add("no-webgl");
    _initialized = false;
    return false;
  }
}

// Nebula lives in its own tiny scene rendered to a quarter-res target, refreshed
// ~10×/s (its drift is glacial). Linear upsampling smooths the fine fbm detail
// that shimmered at full res, and it never passes through bloom.
let _nebScene = null, _nebCam = null, _nebTarget = null, _nebLast = -1;
const NEB_SCALE = 0.25, NEB_INTERVAL = 0.1;
function _buildBackdrop(hues) {
  // Nebula tints are fixed cool blues/violet (not the cluster hues): a teal cluster
  // turned the whole backdrop green and competed with the planets for attention.
  const cols = [218, 262, 200].map((h) => new THREE.Color().setHSL(h / 360, 0.5, 0.2));
  _nebula = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
    depthWrite: false, depthTest: false, toneMapped: false,
    uniforms: { uTime: { value: 0 }, uA: { value: cols[0] }, uB: { value: cols[2 % cols.length] }, uC: { value: cols[1 % cols.length] } },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
    fragmentShader: NEBULA_FRAG,
  }));
  _nebScene = new THREE.Scene();
  _nebScene.add(_nebula);
  _nebCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  _nebTarget = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType, depthBuffer: false });
  _nebTarget.texture.minFilter = _nebTarget.texture.magFilter = THREE.LinearFilter;
  _lens.uniforms.tNebula.value = _nebTarget.texture;

  const glow = (stops) => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    stops.forEach(([o, col]) => grd.addColorStop(o, col));
    g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  };
  _sun = new THREE.Sprite(new THREE.SpriteMaterial({
    map: glow([[0, "rgba(255,255,255,1)"], [0.06, "rgba(255,245,225,1)"], [0.2, "rgba(255,210,160,.35)"], [1, "rgba(255,170,110,0)"]]),
    color: new THREE.Color(4, 3.6, 3.1), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true,
  }));
  _sun.renderOrder = -5;
  _sun.position.z = -1400;
  _scene.add(_sun);
}

// Edge geometry follows the planets; only rebuilt when an endpoint moves.
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _m = new THREE.Vector3();
function _rebuildEdge(o) {
  const A = _planets[o.e.source].mesh.position, B = _planets[o.e.target].mesh.position;
  const key = `${A.x | 0},${A.y | 0},${B.x | 0},${B.y | 0},${zoom.toFixed(3)}`;
  if (key === o.key) return;
  const now = performance.now();
  if (o.key && now - (o.built || 0) < 33) return; // throttle rebuilds while a planet is dragged
  o.key = key; o.built = now;
  _a.copy(A); _b.copy(B);
  // Same bend as the DOM SVG edge (edgeBezier in galaxy-renderer.js), in world space.
  _m.set((_a.x + _b.x) / 2 + (_b.y - _a.y) * 0.1, (_a.y + _b.y) / 2 - (_b.x - _a.x) * 0.1, Math.min(_a.z, _b.z) - 5);
  const curve = new THREE.QuadraticBezierCurve3(_a.clone(), _m.clone(), _b.clone());
  o.tube.geometry.dispose();
  o.tube.geometry = new THREE.TubeGeometry(curve, 32, Math.max(0.8, 1.1 * zoom), 5, false);
}

function _applyTier() {
  const T = TIERS[_tier];
  const pr = Math.min(devicePixelRatio || 1, T.pr);
  _renderer.setPixelRatio(pr);
  _composer.setPixelRatio(pr);
  resizeGalaxy3D();
  _bloom.enabled = T.bloom && !DEBUG.has("nobloom");
  for (const id in _planets) if (_planets[id].clouds) _planets[id].clouds.visible = T.clouds;
}

// ── Render (called every frame from main.js particleTick) ──
const _mtx = new THREE.Matrix4(), _q = new THREE.Quaternion(), _sc = new THREE.Vector3(), _tc = new THREE.Color();
export function renderGalaxy3D() {
  if (!_initialized || _paused) return;
  const now = performance.now();
  const dt = Math.min((now - _lastTime) / 1000, 0.1);
  _lastTime = now;
  _t += dt;
  const reduced = prefersReducedMotion;
  const k = reduced ? 1 : 1 - Math.pow(LERP, dt);
  const W = innerWidth, H = innerHeight;

  // Nebula: re-render its low-res target only a few times a second (or once, under reduced motion).
  // ?debug3d=nonebula|nobloom isolates layers when tuning the look.
  if (DEBUG.has("nonebula")) {
    if (_nebLast < 0) { _nebLast = 0; _renderer.setRenderTarget(_nebTarget); _renderer.clear(); _renderer.setRenderTarget(null); }
  } else if (_nebLast < 0 || (!reduced && _t - _nebLast >= NEB_INTERVAL)) {
    _nebLast = _t;
    _nebula.material.uniforms.uTime.value = reduced ? 0 : _t;
    _renderer.setRenderTarget(_nebTarget);
    _renderer.render(_nebScene, _nebCam);
    _renderer.setRenderTarget(null);
  }
  _sun.position.set(-W * 0.47, H * 0.44, -1400); // far upper-left, where the key light comes from
  _sun.scale.setScalar(Math.min(W, H) * 0.16);

  for (const id in _planets) {
    const p = _planets[id], n = nodeMap[id];
    if (!n) continue;
    p.cur.hover += (p.tgt.hover - p.cur.hover) * k;
    p.cur.dim += (p.tgt.dim - p.cur.dim) * k;
    p.u.uHover.value = p.cur.hover;
    p.u.uDim.value = p.cur.dim;
    p.u.uTime.value = reduced ? 0 : _t;
    _syncMeshPosition(p.mesh, n, p.cur.hover);
  }

  if (_moons) {
    _moonData.forEach((m, i) => {
      const p = _planets[m.pid], n = nodeMap[m.pid];
      const r = n.radius * zoom, orbit = r * (1.85 + m.lane * 0.6);
      const a = m.phase + (reduced ? 0 : _t * m.speed);
      m.pos.set(Math.cos(a) * orbit, 0, Math.sin(a) * orbit).applyQuaternion(m.tilt).add(p.mesh.position);
      const on = m.pid === _hoverId;
      _mtx.compose(m.pos, _q, _sc.setScalar(THREE.MathUtils.clamp(r * 0.1, 1.6, 4) * (on ? 1.5 : 1)));
      _moons.setMatrixAt(i, _mtx);
      _tc.copy(p.u.uColor.value).multiplyScalar((on ? 1.1 : 0.38) * (1 - p.cur.dim * 0.85));
      _moons.setColorAt(i, _tc);
    });
    _moons.instanceMatrix.needsUpdate = true;
    _moons.instanceColor.needsUpdate = true;
  }

  for (const o of _edgeObjs) {
    _rebuildEdge(o);
    o.cur += (o.tgt - o.cur) * k;
    o.u.uVis.value = o.cur;
    if (!reduced) o.u.uPhase.value = (o.u.uPhase.value + dt * (0.08 + o.cur * 0.22)) % 1000;
  }

  _lens.uniforms.uTime.value = reduced ? 0 : _t;
  _stepFly(now);
  _composer.render(dt);

  // Auto quality: step down a tier if the median frame is slow.
  // Skip the first seconds (shader compile + uploads look like slowness), and only
  // step down after TWO consecutive slow windows, so one hiccup can't pop the
  // resolution mid-session. Never steps back up (no ping-pong).
  if (_t < WARMUP_S) return;
  _frameTimes.push(dt * 1000);
  if (_frameTimes.length >= 120) {
    const med = _frameTimes.sort((a, b) => a - b)[60];
    _slowWindows = med > SLOW_FRAME_MS ? _slowWindows + 1 : 0;
    if (_slowWindows >= 2 && _tier < TIERS.length - 1) { _tier++; _slowWindows = 0; _applyTier(); }
    _frameTimes = [];
  }
}

function _syncMeshPosition(mesh, n, hover = 0) {
  mesh.position.x = n.x * zoom + panX - innerWidth / 2;
  mesh.position.y = -(n.y * zoom + panY - innerHeight / 2);
  mesh.scale.setScalar(Math.max(n.radius * zoom * (1 + hover * HOVER_SCALE), 0.001));
}

// ── Focus / hover (called from pointer-events.js, keyboard focus, tours, search) ──
function _applyFocus() {
  const nb = new Set();
  if (_hoverId) {
    for (const e of edges) {
      if (e.source === _hoverId) nb.add(e.target);
      if (e.target === _hoverId) nb.add(e.source);
    }
  }
  for (const id in _planets) {
    const p = _planets[id];
    const isF = id === _hoverId, isN = nb.has(id);
    const inSet = !_focusIds || _focusIds.has(id);
    p.tgt.hover = isF ? 1 : isN ? 0.35 : 0;
    p.tgt.dim = _hoverId ? (isF || isN ? 0 : 0.82) : inSet ? 0 : 0.82;
  }
  for (const o of _edgeObjs) {
    const on = _hoverId && (o.e.source === _hoverId || o.e.target === _hoverId);
    const inSet = !_focusIds || (_focusIds.has(o.e.source) && _focusIds.has(o.e.target));
    o.tgt = _hoverId ? (on ? EDGE_ON : EDGE_OFF) : inSet ? (_focusIds ? EDGE_ON * 0.7 : EDGE_REST) : EDGE_OFF;
    o.u.uPulse.value = on || (_focusIds && inSet) ? 1 : 0;
    o.u.uDir.value = _hoverId && o.e.target === _hoverId ? -1 : 1;
  }
}

// ── Camera fly (replaces CSS-scaling the canvas during fly-in/out) ──
// The DOM container animates `translate(tx,ty) scale(s)` about its top-left.
// The matching orthographic camera shows the world region that transform
// brings on screen: zoom = s, centred on the world point now at screen centre.
// Timed with the same duration + easing as the CSS so labels and spheres agree.
let _fly = null; // { from:{x,y,z}, to:{x,y,z}, t0, dur }
// easeOutExpo-like: the move starts decisively (reads as a dive) and settles softly.
const _ease = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -9 * t));
export function flyCamera3D(transform, durationMs) {
  if (!_initialized) return;
  const m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)\s*scale\(([-\d.]+)\)/.exec(transform || "");
  const W = innerWidth, H = innerHeight;
  let to = { x: 0, y: 0, z: 1 };
  if (m) {
    const tx = +m[1], ty = +m[2], s = +m[3];
    // Screen centre maps back to DOM point ((W/2 - tx)/s, (H/2 - ty)/s); convert to world coords.
    const dx = (W / 2 - tx) / s, dy = (H / 2 - ty) / s;
    to = { x: dx - W / 2, y: -(dy - H / 2), z: s };
  }
  const from = { x: _camera.position.x, y: _camera.position.y, z: _camera.zoom };
  if (prefersReducedMotion || !durationMs) {
    _fly = null;
    _setCam(to);
    return;
  }
  _fly = { from, to, t0: performance.now(), dur: durationMs };
}
function _setCam(c) {
  _camera.position.x = c.x;
  _camera.position.y = c.y;
  _camera.zoom = c.z;
  _camera.updateProjectionMatrix();
}
function _stepFly(now) {
  if (!_fly) return;
  const k = Math.min(1, (now - _fly.t0) / _fly.dur), e = _ease(k), f = _fly.from, t = _fly.to;
  _setCam({ x: f.x + (t.x - f.x) * e, y: f.y + (t.y - f.y) * e, z: f.z + (t.z - f.z) * e });
  if (k >= 1) _fly = null;
}

export function setHover3D(id) {
  _hoverId = id || null;
  if (_initialized) _applyFocus();
}

// Keep a subset bright (tour stops, search matches). null clears.
export function setFocusSet3D(ids) {
  _focusIds = ids || null;
  if (_initialized) _applyFocus();
}

// ── Synchronous sphere update during drag (no 1-frame lag vs DOM) ──
export function syncSphere(id) {
  if (!_initialized) return;
  const p = _planets[id], n = nodeMap[id];
  if (p && n) _syncMeshPosition(p.mesh, n, p.cur.hover);
}

// Release bounce was a scale pulse on the old orbs; the new planets settle
// without one (it read as jitter). Kept as a no-op to preserve the contract.
export function triggerReleaseBounce() {}

// The cinematic galaxy is dark-only by design; the CSS fallback keeps both themes.
export function setTheme3D() {}

// ── Resize ──
export function resizeGalaxy3D() {
  if (!_renderer || !_composer || !_lens) return;
  const w = innerWidth, h = innerHeight;
  _renderer.setSize(w, h, false);
  _composer.setSize(w, h);
  _lens.uniforms.uRes.value.set(w, h);
  if (_nebTarget) {
    _nebTarget.setSize(Math.max(2, Math.round(w * NEB_SCALE)), Math.max(2, Math.round(h * NEB_SCALE)));
    _nebLast = -1; // redraw at the new size
  }
  _camera.left = -w / 2; _camera.right = w / 2; _camera.top = h / 2; _camera.bottom = -h / 2;
  _camera.updateProjectionMatrix();
}

export function pauseGalaxy3D() { _paused = true; }
export function resumeGalaxy3D() { _paused = false; _lastTime = performance.now(); }

export function disposeGalaxy3D() {
  if (!_initialized) return;
  _scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
  _composer?.dispose?.();
  _renderer?.dispose();
  _planets = {}; _moonData = []; _edgeObjs = [];
  _initialized = false;
}
