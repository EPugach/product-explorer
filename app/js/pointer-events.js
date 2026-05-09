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

export function setupPointerEvents({
  enterPlanet,
  showTooltip,
  hideTooltip,
  setParticleHover,
}) {
  const container = document.getElementById("galaxyContainer");
  if (!container) return;

  let dragNode = null;
  let isDragging = false;
  let isPanning = false;
  let startPos = { x: 0, y: 0 };
  let lastPos = { x: 0, y: 0 };
  let hoveredId = null;
  let activePointerId = null;

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
  });

  container.addEventListener("pointermove", (e) => {
    if (hoveredId && !dragNode && !isPanning) {
      const node = nodeMap[hoveredId];
      if (node) showTooltip(node, e.clientX, e.clientY);
    }
  });

  // ── Down: start drag or pan ──
  container.addEventListener("pointerdown", (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (activePointerId !== null) return;

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
      isPanning = true;
      container.classList.add("dragging");
    }
  });

  // ── Move: drag planet or pan ──
  container.addEventListener("pointermove", (e) => {
    if (e.pointerId !== activePointerId) return;
    if (!dragNode && !isPanning) return;

    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    const totalDx = e.clientX - startPos.x;
    const totalDy = e.clientY - startPos.y;

    if (dragNode) {
      if (Math.abs(totalDx) + Math.abs(totalDy) > 5) isDragging = true;
      dragNode.x += dx / zoom;
      dragNode.y += dy / zoom;
      dragNode.fx = dragNode.x;
      dragNode.fy = dragNode.y;
      updatePlanetPosition(dragNode);
      hideTooltip();
    } else if (isPanning) {
      setPanX(panX + dx);
      setPanY(panY + dy);
      updateGalaxyTransform();
      hideTooltip();
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
