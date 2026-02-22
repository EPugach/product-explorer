// ==============================================================
//  ICONS - Circuit-Cosmic SVG icon system
//  All SVG path data as strings. No external files.
//  Canvas icons pre-loaded as Image objects for drawImage().
//  HTML icons returned as inline SVG strings with currentColor.
// ==============================================================

// ── Domain icon paths (18) ──
// ViewBox: 0 0 24 24 | Stroke: 1.5px | Style: Circuit-Cosmic
// Each value is the inner SVG elements (paths, circles, rects)
const DOMAIN_PATHS = {
  donations:
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 6.5v11"/>' +
    '<path d="M14.5 8c-.7-.5-1.5-.8-2.5-.8-2 0-3 .9-3 2.1 0 1.2 1 1.8 3 2.2s3 1 3 2.3c0 1.2-1 2.1-3 2.1-1 0-1.8-.3-2.5-.8"/>',

  contacts:
    '<circle cx="9" cy="7" r="3"/>' +
    '<path d="M3 20v-1a5 5 0 015-5h2a5 5 0 015 5v1"/>' +
    '<circle cx="17.5" cy="8.5" r="2.5"/>' +
    '<path d="M21 20v-.5c0-1.5-.7-2.8-1.8-3.7"/>',

  recurring:
    '<path d="M3 12a9 9 0 0115-6.7L21 8"/>' +
    '<path d="M21 3v5h-5"/>' +
    '<path d="M21 12a9 9 0 01-15 6.7L3 16"/>' +
    '<path d="M3 21v-5h5"/>',

  rollups:
    '<rect x="4" y="14" width="4" height="8" rx="1"/>' +
    '<rect x="10" y="8" width="4" height="14" rx="1"/>' +
    '<rect x="16" y="3" width="4" height="19" rx="1"/>',

  softcredits:
    '<circle cx="8.5" cy="12" r="6"/>' +
    '<circle cx="15.5" cy="12" r="6"/>',

  allocations:
    '<circle cx="4" cy="12" r="2"/>' +
    '<circle cx="20" cy="5" r="2"/>' +
    '<circle cx="20" cy="12" r="2"/>' +
    '<circle cx="20" cy="19" r="2"/>' +
    '<path d="M6 12h4"/>' +
    '<path d="M10 12l8-7"/>' +
    '<path d="M10 12h8"/>' +
    '<path d="M10 12l8 7"/>',

  tdtm:
    '<path d="M13 2L3 14h9l-1 8 10-12h-9z"/>',

  batch:
    '<rect x="4" y="13" width="16" height="6" rx="1.5"/>' +
    '<rect x="4" y="8" width="16" height="6" rx="1.5"/>' +
    '<rect x="4" y="3" width="16" height="6" rx="1.5"/>',

  relationships:
    '<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>' +
    '<path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>',

  addresses:
    '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>' +
    '<circle cx="12" cy="10" r="3"/>',

  affiliations:
    '<rect x="5" y="2" width="14" height="20" rx="2"/>' +
    '<path d="M9 6h2m-2 4h2m-2 4h2m2-8h2m-2 4h2m-2 4h2"/>' +
    '<path d="M10 22v-4h4v4"/>',

  engagement:
    '<path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>' +
    '<rect x="8" y="2" width="8" height="4" rx="1"/>' +
    '<path d="M9 14l2 2 4-4"/>',

  bdi:
    '<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>' +
    '<path d="M7 10l5 5 5-5"/>' +
    '<path d="M12 15V3"/>',

  giftentry:
    '<rect x="3" y="10" width="18" height="12" rx="2"/>' +
    '<path d="M2 7h20v3H2z"/>' +
    '<path d="M12 7v15"/>' +
    '<path d="M7.5 7c-1-2.5 0-4.5 2-4.5s2.5 2 2.5 4.5"/>' +
    '<path d="M16.5 7c1-2.5 0-4.5-2-4.5s-2.5 2-2.5 4.5"/>',

  levels:
    '<path d="M7 3h10v5c0 3.3-2.2 6-5 6s-5-2.7-5-6V3z"/>' +
    '<path d="M7 5H5a2 2 0 000 4h2"/>' +
    '<path d="M17 5h2a2 2 0 010 4h-2"/>' +
    '<path d="M12 14v4"/>' +
    '<path d="M8 22h8"/><path d="M9 18h6"/>',

  errors:
    '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>' +
    '<path d="M12 9v4"/>' +
    '<circle cx="12" cy="17" r="0.5"/>',

  settings:
    '<path d="M4 21v-7m0-4V3"/>' +
    '<path d="M12 21v-9m0-4V3"/>' +
    '<path d="M20 21v-5m0-4V3"/>' +
    '<circle cx="4" cy="10" r="2.5"/>' +
    '<circle cx="12" cy="8" r="2.5"/>' +
    '<circle cx="20" cy="12" r="2.5"/>',

  elevate:
    '<rect x="2" y="5" width="20" height="14" rx="2"/>' +
    '<path d="M2 10h20"/>' +
    '<path d="M6 15h4"/>',
};

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
