// ══════════════════════════════════════════════════════════════
//  UTILS — Shared utilities module
//  B3: Extracted to break cross-file dependencies
// ══════════════════════════════════════════════════════════════

// Safe localStorage wrapper (Safari private browsing throws)
export const safeLSGet = (key) => {
  try { return localStorage.getItem(key); } catch (e) { return null; }
};

export const safeLSSet = (key, val) => {
  try { localStorage.setItem(key, val); } catch (e) { /* silent */ }
};

// Screen reader announcements
export const announce = (text) => {
  const el = document.getElementById('sr-announcer');
  if (el) {
    el.textContent = '';
    void el.offsetHeight; // Force reflow so screen reader registers the change
    el.textContent = text;
  }
};

// Analytics helper
export const track = (event, params) => {
  if (typeof gtag === 'function') gtag('event', event, params || {});
};

// Hex to RGBA conversion (single source of truth, was duplicated in renderer.js and particles.js)
export const hexToRgba = (hex, alpha = 1) => {
  if (!hex || hex[0] !== '#') return `rgba(77,139,255,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};
