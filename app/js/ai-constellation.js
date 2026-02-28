// ══════════════════════════════════════════════════════════════
//  AI CONSTELLATION — Self-contained mini force-directed canvas
//  for the AI answer exploration view. No imports from physics.js
//  or renderer.js to keep it fully independent.
// ══════════════════════════════════════════════════════════════

const TYPE_COLORS = {
  domain: '#00d4ff', component: '#4d8bff', class: '#4d8bff',
  object: '#22c55e', trigger: '#ef4444', lwc: '#a855f7',
  metadata: '#f59e0b', planet: '#00d4ff', tag: '#64748b'
};

const TYPE_RADII = {
  domain: 22, planet: 22, component: 18, class: 14,
  object: 14, trigger: 14, lwc: 14, metadata: 14, tag: 12
};

let _canvas = null;
let _ctx = null;
let _nodes = [];
let _hoveredNode = null;
let _onNodeClick = null;
let _dpr = 1;
let _w = 0;
let _h = 0;

// Event handler references for cleanup
let _onMouseMove = null;
let _onClick = null;
let _onTouchEnd = null;

function buildNodes(results) {
  const cx = _w / 2;
  const cy = _h / 2;
  return results.map((r, i) => {
    const angle = (2 * Math.PI * i) / results.length;
    const spread = Math.min(_w, _h) * 0.3;
    return {
      x: cx + Math.cos(angle) * spread + (Math.random() - 0.5) * 40,
      y: cy + Math.sin(angle) * spread + (Math.random() - 0.5) * 40,
      vx: 0, vy: 0,
      radius: TYPE_RADII[r.type] || 14,
      color: TYPE_COLORS[r.type] || '#64748b',
      label: r.name.length > 18 ? r.name.slice(0, 17) + '\u2026' : r.name,
      result: r
    };
  });
}

function runSimulation() {
  const cx = _w / 2;
  const cy = _h / 2;

  for (let iter = 0; iter < 100; iter++) {
    // Repulsion between all pairs
    for (let i = 0; i < _nodes.length; i++) {
      for (let j = i + 1; j < _nodes.length; j++) {
        const a = _nodes[i], b = _nodes[j];
        let dx = b.x - a.x, dy = b.y - a.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = 800 / (dist * dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        a.vx -= fx; a.vy -= fy;
        b.vx += fx; b.vy += fy;
      }
    }

    // Center gravity
    for (const n of _nodes) {
      n.vx += (cx - n.x) * 0.01;
      n.vy += (cy - n.y) * 0.01;
    }

    // Apply velocity + damping
    for (const n of _nodes) {
      n.vx *= 0.85;
      n.vy *= 0.85;
      n.x += n.vx;
      n.y += n.vy;
    }
  }
}

function render() {
  if (!_ctx) return;
  _ctx.clearRect(0, 0, _canvas.width, _canvas.height);
  _ctx.save();
  _ctx.scale(_dpr, _dpr);

  for (const n of _nodes) {
    const isHovered = n === _hoveredNode;

    // Glow ring on hover
    if (isHovered) {
      _ctx.beginPath();
      _ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
      _ctx.strokeStyle = n.color + '66';
      _ctx.lineWidth = 2;
      _ctx.stroke();
    }

    // Radial gradient fill
    const grad = _ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
    grad.addColorStop(0, 'rgba(255,255,255,0.3)');
    grad.addColorStop(1, n.color);
    _ctx.beginPath();
    _ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
    _ctx.fillStyle = grad;
    _ctx.fill();

    // Label
    _ctx.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
    _ctx.textAlign = 'center';
    _ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255,255,255,0.7)';
    _ctx.fillText(n.label, n.x, n.y + n.radius + 14);
  }

  _ctx.restore();
}

function hitTestNode(mx, my) {
  for (let i = _nodes.length - 1; i >= 0; i--) {
    const n = _nodes[i];
    const dx = mx - n.x, dy = my - n.y;
    if (dx * dx + dy * dy <= (n.radius + 4) * (n.radius + 4)) return n;
  }
  return null;
}

function getMousePos(e) {
  const rect = _canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function initConstellation(canvas, results, onNodeClick) {
  _canvas = canvas;
  _ctx = canvas.getContext('2d');
  _onNodeClick = onNodeClick;
  _dpr = window.devicePixelRatio || 1;

  const container = canvas.parentElement;
  _w = container.clientWidth;
  _h = canvas.height / _dpr || Math.min(400, Math.max(250, _w * 0.5));

  canvas.width = _w * _dpr;
  canvas.height = _h * _dpr;
  canvas.style.width = _w + 'px';
  canvas.style.height = _h + 'px';

  _nodes = buildNodes(results);
  runSimulation();
  render();

  // Event handlers
  _onMouseMove = (e) => {
    const pos = getMousePos(e);
    const node = hitTestNode(pos.x, pos.y);
    if (node !== _hoveredNode) {
      _hoveredNode = node;
      canvas.style.cursor = node ? 'pointer' : 'default';
      render();
    }
  };

  _onClick = (e) => {
    const pos = getMousePos(e);
    const node = hitTestNode(pos.x, pos.y);
    if (node && _onNodeClick) _onNodeClick(node.result);
  };

  _onTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const touch = e.changedTouches[0];
      const rect = canvas.getBoundingClientRect();
      const pos = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
      const node = hitTestNode(pos.x, pos.y);
      if (node && _onNodeClick) _onNodeClick(node.result);
    }
  };

  canvas.addEventListener('mousemove', _onMouseMove);
  canvas.addEventListener('click', _onClick);
  canvas.addEventListener('touchend', _onTouchEnd);

  return { destroy: destroyConstellation };
}

export function destroyConstellation() {
  if (_canvas) {
    if (_onMouseMove) _canvas.removeEventListener('mousemove', _onMouseMove);
    if (_onClick) _canvas.removeEventListener('click', _onClick);
    if (_onTouchEnd) _canvas.removeEventListener('touchend', _onTouchEnd);
  }
  _canvas = null;
  _ctx = null;
  _nodes = [];
  _hoveredNode = null;
  _onNodeClick = null;
  _onMouseMove = null;
  _onClick = null;
  _onTouchEnd = null;
}
