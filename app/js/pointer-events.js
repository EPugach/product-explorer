// ══════════════════════════════════════════════════════════════
//  POINTER EVENTS — Unified mouse/touch/pen input for galaxy view
//  Replaces separate mouse + touch handlers in main.js with the
//  Pointer Events API. Pinch-to-zoom kept as touch supplement.
// ══════════════════════════════════════════════════════════════

import {
  nodeMap,
  zoom,
  panX,
  panY,
  setZoom,
  setPanX,
  setPanY,
} from "./physics.js";
import {
  updateGalaxyTransform,
  updatePlanetPosition,
  applyHoverState,
  clearHoverState,
  getSortedPlanetEls,
  getPlanetEl,
  hideEdgeTooltip,
} from "./galaxy-renderer.js";
import { tourState } from "./state.js";
import { track } from "./utils.js";

// Hit zone radius as a multiple of a planet's visual radius. The planet's
// box-shadow has two layers (inner halo at 0.8r blur, outer aura at 1.6r
// blur) that visually extend ~3r from the center but don't enter hit-testing.
// 2.0× catches the visually-strong portion. Safe against overlap: physics
// enforces a center-to-center minimum of ≥310px (radius+labelPad sum + 220
// repulsion), so even at r=52 (max) the 2.0× zones can't collide.
const HIT_RADIUS_FACTOR = 2.0;

// Pan deadzone: ignore pointer drift below this many pixels before committing
// to a canvas pan. Mirrors the click-vs-drag threshold used for planets.
const PAN_THRESHOLD_PX = 5;

export function setupPointerEvents({
  enterPlanet,
  showTooltip,
  hideTooltip,
  setParticleHover,
  setHover3D,
  syncSphere,
}) {
  const noop = () => {};
  const _setHover3D = setHover3D || noop;
  const _syncSphere = syncSphere || noop;
  const container = document.getElementById("galaxyContainer");
  if (!container) return;

  let dragNode = null;
  let isDragging = false;
  let isPanning = false;
  let pendingPan = false;
  let startPos = { x: 0, y: 0 };
  let lastPos = { x: 0, y: 0 };
  let hoveredId = null;
  let activePointerId = null;

  // Distance-based hit fallback (Fix D): nearest planet whose center is
  // within HIT_RADIUS_FACTOR × its visual radius of the click point. Returns
  // null if no planet qualifies. Voronoi-style: closest center wins, so
  // overlapping hit zones resolve deterministically.
  function nearestPlanetWithin(clientX, clientY, factor) {
    let best = null;
    let bestDist = Infinity;
    for (const id in nodeMap) {
      const n = nodeMap[id];
      const sx = n.x * zoom + panX;
      const sy = n.y * zoom + panY;
      const dx = clientX - sx;
      const dy = clientY - sy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hitR = n.radius * zoom * factor;
      if (dist <= hitR && dist < bestDist) {
        best = n;
        bestDist = dist;
      }
    }
    return best;
  }

  // ── Hover ──
  container.addEventListener("pointerover", (e) => {
    const planet = e.target.closest(".planet-node");
    if (!planet || dragNode || isPanning) return;
    const id = planet.dataset.domain;
    if (id === hoveredId) return;
    hoveredId = id;
    const node = nodeMap[id];
    if (node) {
      hideEdgeTooltip();
      showTooltip(node, e.clientX, e.clientY);
      applyHoverState(id);
      setParticleHover(node);
      _setHover3D(id);
    }
  });

  container.addEventListener("pointerout", (e) => {
    const planet = e.target.closest(".planet-node");
    if (!planet) return;
    const related = e.relatedTarget;
    if (related && planet.contains(related)) return;
    hoveredId = null;
    hideTooltip();
    clearHoverState();
    setParticleHover(null);
    _setHover3D(null);
  });

  container.addEventListener("pointermove", (e) => {
    if (hoveredId && !dragNode && !isPanning) {
      const node = nodeMap[hoveredId];
      if (node) showTooltip(node, e.clientX, e.clientY);
    }
  });

  // ── Belt-and-suspenders: kill HTML5 native drag-and-drop. CSS user-select
  // already prevents new selections from forming, but if any descendant
  // becomes draggable in the future (an image, a link, a [draggable=true]
  // element) this guarantees the gesture stays in our pointer handler.
  container.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  // ── Down: start drag or pan ──
  container.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (activePointerId !== null) return;

    // Defensive: clear any text selection that lives inside the galaxy
    // before we start a gesture. Only scoped to selections rooted in the
    // galaxy container — selections in the search box / breadcrumb stay.
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (container.contains(range.commonAncestorContainer)) {
        sel.removeAllRanges();
      }
    }

    activePointerId = e.pointerId;
    container.setPointerCapture(e.pointerId);

    const planet = e.target.closest(".planet-node");
    startPos = { x: e.clientX, y: e.clientY };
    lastPos = { x: e.clientX, y: e.clientY };
    isDragging = false;

    if (planet) {
      const id = planet.dataset.domain;
      dragNode = nodeMap[id] || null;
      if (dragNode) {
        dragNode.fx = dragNode.x;
        dragNode.fy = dragNode.y;
        planet.style.willChange = "left, top";
        container.classList.add("dragging");
      }
    } else {
      // Fix D: glow-edge fallback before falling through to pan.
      const fallback = nearestPlanetWithin(
        e.clientX,
        e.clientY,
        HIT_RADIUS_FACTOR,
      );
      if (fallback) {
        dragNode = fallback;
        dragNode.fx = dragNode.x;
        dragNode.fy = dragNode.y;
        const div = getPlanetEl(fallback.id);
        if (div) div.style.willChange = "left, top";
        container.classList.add("dragging");
      } else {
        // Fix A: arm pan but don't commit until the cursor crosses the
        // movement threshold. Also defer the "dragging" class so a stationary
        // mis-click doesn't flicker the cursor or hide the tooltip.
        pendingPan = true;
      }
    }
  });

  // ── Move: drag planet or pan ──
  container.addEventListener("pointermove", (e) => {
    if (e.pointerId !== activePointerId) return;
    if (!dragNode && !isPanning && !pendingPan) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    const totalDx = e.clientX - startPos.x;
    const totalDy = e.clientY - startPos.y;

    if (dragNode) {
      if (Math.abs(totalDx) + Math.abs(totalDy) > PAN_THRESHOLD_PX)
        isDragging = true;
      dragNode.x += dx / zoom;
      dragNode.y += dy / zoom;
      dragNode.fx = dragNode.x;
      dragNode.fy = dragNode.y;
      updatePlanetPosition(dragNode);
      _syncSphere(dragNode.id);
      hideTooltip();
    } else if (pendingPan || isPanning) {
      // Fix A: commit to panning only after the cursor crosses the deadzone.
      // The first ~5px of motion is intentionally swallowed (standard drag
      // threshold). Keeps a stationary mis-click — including the click that
      // triggered Fix D's lookup but landed too far from any planet — from
      // jiggling the canvas.
      if (
        !isPanning &&
        Math.abs(totalDx) + Math.abs(totalDy) > PAN_THRESHOLD_PX
      ) {
        isPanning = true;
        pendingPan = false;
        container.classList.add("dragging");
      }
      if (isPanning) {
        setPanX(panX + dx);
        setPanY(panY + dy);
        updateGalaxyTransform();
        hideTooltip();
      }
    }
    lastPos = { x: e.clientX, y: e.clientY };
  });

  // ── Up: end drag/pan, detect tap ──
  container.addEventListener("pointerup", (e) => {
    if (e.pointerId !== activePointerId) return;
    container.releasePointerCapture(e.pointerId);
    activePointerId = null;
    container.classList.remove("dragging");

    if (dragNode) {
      const div = getPlanetEl(dragNode.id);
      if (div) div.style.willChange = "";

      if (!isDragging) {
        const id = dragNode.id;
        dragNode.fx = null;
        dragNode.fy = null;
        dragNode = null;
        isPanning = false;
        pendingPan = false;
        hideTooltip();
        if (!tourState.active) {
          enterPlanet(id);
          track("planet_click", { planet: id });
        }
        return;
      }
      track("planet_drag", { planet: dragNode.id });
      dragNode.fx = null;
      dragNode.fy = null;
    }
    dragNode = null;
    isPanning = false;
    pendingPan = false;
  });

  // ── Pointer cancel ──
  container.addEventListener("pointercancel", (e) => {
    if (e.pointerId !== activePointerId) return;
    activePointerId = null;
    container.classList.remove("dragging");
    if (dragNode) {
      const div = getPlanetEl(dragNode.id);
      if (div) div.style.willChange = "";
      dragNode.fx = null;
      dragNode.fy = null;
    }
    dragNode = null;
    isPanning = false;
    pendingPan = false;
  });

  // ── Leave container ──
  container.addEventListener("pointerleave", () => {
    if (hoveredId && !dragNode) {
      hoveredId = null;
      hideTooltip();
      clearHoverState();
      setParticleHover(null);
    }
  });

  // ── Wheel zoom ──
  container.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const oldZoom = zoom;
      let newZoom = zoom * (e.deltaY < 0 ? 1.1 : 0.9);
      newZoom = Math.max(0.3, Math.min(3, newZoom));
      setZoom(newZoom);
      setPanX(e.clientX - (e.clientX - panX) * (newZoom / oldZoom));
      setPanY(e.clientY - (e.clientY - panY) * (newZoom / oldZoom));
      updateGalaxyTransform();
    },
    { passive: false },
  );

  // ── Pinch-to-zoom (touch supplement — pointer events don't easily
  //    support multi-touch zoom, so this handles the two-finger gesture) ──
  let lastTouchDist = 0;

  container.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist = Math.sqrt(dx * dx + dy * dy);
      }
    },
    { passive: true },
  );

  container.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastTouchDist > 0) {
          const scale = dist / lastTouchDist;
          const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
          const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;
          const oldZoom = zoom;
          let newZoom = Math.max(0.3, Math.min(3, zoom * scale));
          setZoom(newZoom);
          setPanX(cx - (cx - panX) * (newZoom / oldZoom));
          setPanY(cy - (cy - panY) * (newZoom / oldZoom));
          updateGalaxyTransform();
        }
        lastTouchDist = dist;
        e.preventDefault();
      }
    },
    { passive: false },
  );

  container.addEventListener("touchend", () => {
    lastTouchDist = 0;
  });
}
