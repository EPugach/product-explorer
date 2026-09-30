// ══════════════════════════════════════════════════════════════
//  LANDING UNIVERSE — the homepage hero as a 3D system of products
//  Each product in manifest.js is a planet (size ∝ its domain count),
//  rendered with the same shaders + bloom as the product galaxies, so
//  the homepage previews exactly what you'll explore. DOM <a> links sit
//  over each planet for input + accessibility; the canvas is cosmetic.
//  Returns false when the device can't run it (caller keeps the CSS hero).
// ══════════════════════════════════════════════════════════════

import * as THREE from "../vendor/three.0.184.min.js";
import { EffectComposer } from "../vendor/three-addons/postprocessing/EffectComposer.js";
import { RenderPass } from "../vendor/three-addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "../vendor/three-addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "../vendor/three-addons/postprocessing/OutputPass.js";
import {
  supportsGalaxy3D, LIGHT_VIEW, _hash,
  SPHERE_VERT, PLANET_FRAG, CLOUD_FRAG, ATMO_FRAG,
} from "./galaxy-3d.js";

const BG = 0x020611;
// Orbit ring radii (world units): wide + flat so planets never stack on each other.
const RX = 400, RY = 64, RZ = 300;
const HUES = [199, 173, 280, 218, 205, 330, 45, 150, 260, 15];

export function startLandingUniverse(stage, products, { base = "" } = {}) {
  if (!supportsGalaxy3D()) return false;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer, composer, bloom;
  try {
    const canvas = document.createElement("canvas");
    canvas.className = "universe-canvas";
    canvas.setAttribute("aria-hidden", "true");
    stage.prepend(canvas);
    renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  } catch (err) {
    console.warn("[landing-universe] WebGL unavailable:", err);
    return false;
  }

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  const camera = new THREE.PerspectiveCamera(34, 1, 1, 8000);
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.75, 0.5, 0.86);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  // ── Backdrop: stars + a soft sun up-left (the key light's source) ──
  const dot = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.25, "rgba(255,255,255,.7)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c);
  })();
  {
    const N = 1600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3), c = new THREE.Color();
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 5200; pos[i * 3 + 1] = (Math.random() - 0.5) * 2800; pos[i * 3 + 2] = -800 - Math.random() * 2600;
      c.setHSL(0.55 + Math.random() * 0.12, 0.5, 0.7).multiplyScalar(Math.random() < 0.04 ? 2.4 : 0.9);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3)); g.setAttribute("color", new THREE.BufferAttribute(col, 3));
    scene.add(new THREE.Points(g, new THREE.PointsMaterial({ map: dot, size: 7, vertexColors: true, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false })));
  }
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color: new THREE.Color(3.2, 2.9, 2.5),
    blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
  sun.position.set(-1500, 700, -2400); sun.scale.setScalar(420);
  scene.add(sun);

  // ── Planets: one per product on a tilted orbit band, flagship near centre ──
  const lightU = { value: LIGHT_VIEW.clone() }, bgU = { value: new THREE.Color(BG) };
  const hi = new THREE.SphereGeometry(1, 96, 64), lo = new THREE.SphereGeometry(1, 48, 32);
  const domainsOf = (p) => (p.stats.find(([l]) => l === "Domains") || [0, 12])[1];
  const flagshipId = "nonprofitcloud";
  const ordered = [...products].sort((a, b) => (b.id === flagshipId) - (a.id === flagshipId));
  const planets = ordered.map((p, i) => {
    const color = new THREE.Color().setHSL(HUES[i % HUES.length] / 360, 0.8, 0.56);
    const u = { uColor: { value: color }, uLight: lightU, uSeed: { value: _hash(p.id) },
      uHover: { value: 0 }, uDim: { value: 0 }, uTime: { value: 0 } };
    const type = i % 4;
    const mesh = new THREE.Mesh(hi, new THREE.ShaderMaterial({ vertexShader: SPHERE_VERT, fragmentShader: PLANET_FRAG,
      uniforms: { ...u, uBg: bgU, uType: { value: type }, uLights: { value: 0.8 }, uSpin: { value: reduced ? 0 : 0.05 + _hash(p.id) * 0.05 } } }));
    const atmo = new THREE.Mesh(lo, new THREE.ShaderMaterial({ vertexShader: SPHERE_VERT, fragmentShader: ATMO_FRAG, side: THREE.BackSide,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { ...u, uSpin: { value: 0 } } }));
    atmo.scale.setScalar(1.1); mesh.add(atmo);
    if (type < 2) {
      const clouds = new THREE.Mesh(lo, new THREE.ShaderMaterial({ vertexShader: SPHERE_VERT, fragmentShader: CLOUD_FRAG,
        transparent: true, depthWrite: false, uniforms: { ...u, uSpin: { value: reduced ? 0 : 0.08 } } }));
      clouds.scale.setScalar(1.018); mesh.add(clouds);
    }
    const r = p.id === flagshipId ? 74 : 26 + domainsOf(p) * 1.3;
    // Flagship at the centre; the rest evenly spaced on a flat, tilted ring around it.
    const k = i === 0 ? null : (i - 1) / (ordered.length - 1);
    const ang = k == null ? 0 : k * Math.PI * 2 + 0.35;
    const home = new THREE.Vector3();
    scene.add(mesh);
    return { p, mesh, u, r, home, ang, cur: { hover: 0, dim: 0 }, tgt: { hover: 0, dim: 0 } };
  });

  // ── DOM links over each planet (keyboard + screen reader + click) ──
  const layer = document.createElement("nav");
  layer.className = "universe-links";
  layer.setAttribute("aria-label", "Products");
  stage.appendChild(layer);
  // The CSS hero stage is decorative (aria-hidden); with real links inside it no longer is.
  stage.removeAttribute("aria-hidden");
  let hovered = null;
  const links = planets.map((pl) => {
    const a = document.createElement("a");
    a.className = "universe-planet";
    a.href = `${base}${pl.p.id}/`;
    const d = domainsOf(pl.p), comps = (pl.p.stats.find(([l]) => l === "Components") || [0, ""])[1];
    a.setAttribute("aria-label", `Explore ${pl.p.fullName}: ${d} domains${comps ? `, ${comps} components` : ""}`);
    a.innerHTML = `<span class="universe-label">${pl.p.name}<small>${d} domains</small></span>`;
    a.addEventListener("pointerenter", () => setHover(pl));
    a.addEventListener("pointerleave", () => setHover(null));
    a.addEventListener("focus", () => setHover(pl));
    a.addEventListener("blur", () => setHover(null));
    a.addEventListener("click", (e) => {
      if (reduced || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      dive(pl, a.href);
    });
    layer.appendChild(a);
    return a;
  });
  function setHover(pl) {
    hovered = pl;
    for (const q of planets) {
      q.tgt.hover = q === pl ? 1 : 0;
      q.tgt.dim = pl && q !== pl ? 0.6 : 0;
    }
    links.forEach((a, i) => a.classList.toggle("dim", !!pl && planets[i] !== pl));
  }

  // ── Camera: slow orbit; scroll dollies back as you leave the hero ──
  let W = 1, H = 1, t = 0, last = performance.now(), running = true, diving = null, warp = 0;
  const look = new THREE.Vector3(), target = new THREE.Vector3(), v = new THREE.Vector3(), right = new THREE.Vector3();
  let camDist = 1500;
  function resize() {
    const r = stage.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setSize(W, H, false); composer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    // Frame the system in the right ~60% of the hero (headline lives on the left).
    camDist = W < 900 ? 1500 * Math.max(1, 700 / W) : 1180 * Math.max(1, 1100 / W);
    stage.classList.toggle("universe-narrow", W < 900);
  }
  function dive(pl, href) {
    diving = pl; warp = 0;
    target.copy(pl.mesh.position);
    setTimeout(() => { location.href = href; }, 900);
  }
  addEventListener("pageshow", (e) => { if (e.persisted) { diving = null; target.set(0, 0, 0); } });
  new IntersectionObserver(([e]) => {
    running = e.isIntersecting;
    if (running) { last = performance.now(); requestAnimationFrame(frame); }
  }).observe(stage);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && running) { last = performance.now(); requestAnimationFrame(frame); }
  });

  const project = (p) => { v.copy(p).project(camera); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H, v.z]; };
  function frame(now) {
    if (!running || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.1); last = now;
    if (!reduced) t += dt;
    const k = reduced ? 1 : 1 - Math.pow(diving ? 0.02 : 0.05, dt);
    look.lerp(target, k);
    const scrollBack = Math.min(1, scrollY / (H || 1));
    const dist = diving ? Math.max(diving.r * 4, camDist * 0.12) : camDist * (1 + scrollBack * 0.6);
    if (diving) warp = Math.min(1, warp + dt * 1.4);
    const yaw = reduced ? 0 : Math.sin(t * 0.07) * 0.12, pitch = 0.36;
    camera.position.set(look.x + Math.sin(yaw) * dist * Math.cos(pitch),
      look.y + dist * Math.sin(pitch), look.z + Math.cos(yaw) * dist * Math.cos(pitch));
    camera.lookAt(look);
    // Shift the framing so the system sits right of the headline (off when diving).
    // Desktop: shift the system right of the headline. Narrow: drop it below the text.
    const narrow = W < 900;
    camera.setViewOffset(W, H, diving || narrow ? 0 : -W * 0.27, diving || !narrow ? 0 : -H * 0.4, W, H);
    camera.updateMatrixWorld();
    right.setFromMatrixColumn(camera.matrixWorld, 0);
    bloom.strength = 0.75 + warp * 1.6;

    planets.forEach((pl, i) => {
      pl.cur.hover += (pl.tgt.hover - pl.cur.hover) * (reduced ? 1 : 1 - Math.pow(0.001, dt));
      pl.cur.dim += (pl.tgt.dim - pl.cur.dim) * (reduced ? 1 : 1 - Math.pow(0.001, dt));
      pl.u.uHover.value = pl.cur.hover; pl.u.uDim.value = pl.cur.dim; pl.u.uTime.value = t;
      // Gentle orbital drift along the band (flagship holds the centre); paused on hover.
      const a = pl.ang + (hovered || reduced ? 0 : t * 0.02);
      if (i === 0) pl.mesh.position.copy(pl.home);
      else pl.mesh.position.set(Math.cos(a) * RX, Math.sin(a) * RY, Math.sin(a) * RZ);
      pl.mesh.scale.setScalar(pl.r * (1 + pl.cur.hover * 0.08));
      const [sx, sy, sz] = project(pl.mesh.position);
      const [ex] = project(v.copy(pl.mesh.position).addScaledVector(right, pl.r));
      const size = Math.max(Math.abs(ex - sx) * 2, 40);
      const el = links[i];
      el.style.transform = `translate(${(sx - size / 2).toFixed(1)}px, ${(sy - size / 2).toFixed(1)}px)`;
      el.style.width = el.style.height = `${size.toFixed(0)}px`;
      el.style.zIndex = String(1000 - Math.round(sz * 1000));
      // Planets on the far side of the ring get quiet labels so names never pile up.
      el.classList.toggle("back", i !== 0 && Math.sin(pl.ang + (hovered || reduced ? 0 : t * 0.02)) < -0.15);
    });
    composer.render(dt);
    requestAnimationFrame(frame);
  }
  addEventListener("resize", resize, { passive: true });
  resize();
  stage.classList.add("universe-on");
  requestAnimationFrame(frame);
  return true;
}
