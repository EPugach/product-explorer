// ==============================================================
//  ICONS - Shared SVG icon system
//  Domain icons are loaded from product config (products/{id}/icons.js)
//  UI icons and entity icons are shared across all products.
//  Canvas icons pre-loaded as Image objects for drawImage().
//  HTML icons returned as inline SVG strings with currentColor.
// ==============================================================

// ── Domain icon paths (set dynamically per product) ──
let DOMAIN_PATHS = {};

export function setDomainPaths(paths) {
  DOMAIN_PATHS = paths || {};
}

// ── UI icon paths (navbar, help) ──
const UI_PATHS = {
  search:
    '<circle cx="11" cy="11" r="7"/>' +
    '<path d="M21 21l-4.35-4.35"/>',

  tour:
    '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/>' +
    '<path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/>' +
    '<path d="M9 12H4s.55-3.03 2-4c1.62-1.08 3 0 3 0"/>' +
    '<path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-3 0-3"/>',

  moon:
    '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>',

  sun:
    '<circle cx="12" cy="12" r="5"/>' +
    '<path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42m12.72-12.72l1.42-1.42"/>',

  help:
    '<circle cx="12" cy="12" r="10"/>' +
    '<path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>' +
    '<circle cx="12" cy="17" r="0.5"/>',

  feedback:
    '<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>',
};

// ── Entity type badge paths ──
const ENTITY_PATHS = {
  'class':
    '<path d="M8 3H6a2 2 0 00-2 2v4c0 1.1-.9 2-2 2 1.1 0 2 .9 2 2v4a2 2 0 002 2h2"/>' +
    '<path d="M16 3h2a2 2 0 012 2v4c0 1.1.9 2 2 2-1.1 0-2 .9-2 2v4a2 2 0 01-2 2h-2"/>',

  object:
    '<rect x="3" y="3" width="18" height="18" rx="2"/>' +
    '<path d="M3 9h18M9 3v18"/>',

  trigger:
    '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',

  lwc:
    '<path d="M16 18l6-6-6-6"/>' +
    '<path d="M8 6l-6 6 6 6"/>',

  metadata:
    '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>' +
    '<path d="M14 2v6h6"/>' +
    '<path d="M8 13h8m-8 4h8"/>',
};


// ── SVG builder ──

function buildSvg(paths, { color = 'currentColor', size = 24, strokeWidth = 1.5 } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" ` +
    `viewBox="0 0 24 24" fill="none" stroke="${color}" ` +
    `stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">` +
    `${paths}</svg>`;
}

function svgToDataUri(svgString) {
  return `data:image/svg+xml,${encodeURIComponent(svgString)}`;
}


// ── Public API: inline SVG strings for HTML ──

export function domainSvg(id, size = 24) {
  const paths = DOMAIN_PATHS[id];
  if (!paths) return '';
  return buildSvg(paths, { size });
}

export function uiSvg(name, size = 20) {
  const paths = UI_PATHS[name];
  if (!paths) return '';
  return buildSvg(paths, { size });
}

export function entitySvg(type, size = 14) {
  const paths = ENTITY_PATHS[type];
  if (!paths) return '';
  return buildSvg(paths, { size, strokeWidth: 1.8 });
}


// ── Canvas icon pre-loading ──
// Domain icons are loaded as white-stroke Image objects for ctx.drawImage()

const _canvasCache = {};

export function preloadCanvasIcons() {
  const entries = Object.entries(DOMAIN_PATHS);
  let loaded = 0;
  return new Promise((resolve) => {
    if (entries.length === 0) { resolve(); return; }
    for (const [id, paths] of entries) {
      const svg = buildSvg(paths, { color: '#ffffff', strokeWidth: 2 });
      const img = new Image();
      img.onload = img.onerror = () => {
        _canvasCache[id] = img;
        loaded++;
        if (loaded >= entries.length) resolve();
      };
      img.src = svgToDataUri(svg);
    }
  });
}

export function getCanvasIcon(id) {
  return _canvasCache[id] || null;
}
