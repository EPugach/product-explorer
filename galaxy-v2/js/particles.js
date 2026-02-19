// ══════════════════════════════════════════════════════
// Particle Swarm — ambient cosmic dust orbiting cursor
// ══════════════════════════════════════════════════════

const PARTICLE_COUNT = 60;
let particleCanvas, particleCtx;
let particles = [];
let cursorTarget = { x: -1000, y: -1000 };
let cursorSmooth = { x: -1000, y: -1000 };
let cursorInViewport = false;
let cursorFadeAlpha = 0; // 0 = hidden, 1 = fully visible
let particlesVisible = true;

function initParticles() {
  particleCanvas = document.getElementById('particle-canvas');
  particleCtx = particleCanvas.getContext('2d');
  resizeParticleCanvas();

  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      angle: Math.random() * Math.PI * 2,
      orbitRadius: 80 + Math.random() * 70,
      angularSpeed: (0.005 + Math.random() * 0.015) * (Math.random() < 0.5 ? 1 : -1),
      size: 0.8 + Math.random() * 2.2,
      opacity: 0.2 + Math.random() * 0.5,
      hue: 210 + Math.random() * 40 - 20,
      saturation: 40 + Math.random() * 40,
      lightness: 70 + Math.random() * 20,
      noisePhase: Math.random() * Math.PI * 2,
      noiseSpeed: 0.01 + Math.random() * 0.02,
      noiseAmp: 5 + Math.random() * 15,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.02 + Math.random() * 0.03,
      x: 0, y: 0, currentOpacity: 0
    });
  }

  document.addEventListener('mousemove', (e) => {
    cursorTarget.x = e.clientX;
    cursorTarget.y = e.clientY;
    cursorInViewport = true;
  });

  document.addEventListener('mouseleave', () => {
    cursorInViewport = false;
  });
}

function resizeParticleCanvas() {
  particleCanvas.width = innerWidth * devicePixelRatio;
  particleCanvas.height = innerHeight * devicePixelRatio;
  particleCanvas.style.width = innerWidth + 'px';
  particleCanvas.style.height = innerHeight + 'px';
}

function updateParticles() {
  // Smooth cursor tracking with lag
  const lag = 0.08;
  cursorSmooth.x += (cursorTarget.x - cursorSmooth.x) * lag;
  cursorSmooth.y += (cursorTarget.y - cursorSmooth.y) * lag;

  // Fade in/out based on cursor in viewport
  if (cursorInViewport && particlesVisible) {
    cursorFadeAlpha = Math.min(1, cursorFadeAlpha + 0.02);
  } else {
    cursorFadeAlpha = Math.max(0, cursorFadeAlpha - 0.015);
  }

  // Dim when hovering a graph node
  const hoverDim = hoveredNode ? 0.3 : 1.0;

  for (const p of particles) {
    p.angle += p.angularSpeed;
    p.noisePhase += p.noiseSpeed;
    p.twinklePhase += p.twinkleSpeed;

    const noiseOffset = Math.sin(p.noisePhase) * p.noiseAmp;
    const r = p.orbitRadius + noiseOffset;
    p.x = cursorSmooth.x + Math.cos(p.angle) * r;
    p.y = cursorSmooth.y + Math.sin(p.angle) * r;

    p.currentOpacity = p.opacity * (0.5 + 0.5 * Math.sin(p.twinklePhase)) * cursorFadeAlpha * hoverDim;
  }
}

function renderParticles() {
  particleCtx.save();
  particleCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  particleCtx.clearRect(0, 0, innerWidth, innerHeight);

  if (cursorFadeAlpha < 0.01) { particleCtx.restore(); return; }

  for (const p of particles) {
    if (p.currentOpacity < 0.02) continue;
    particleCtx.beginPath();
    particleCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    particleCtx.fillStyle = `hsla(${p.hue}, ${p.saturation}%, ${p.lightness}%, ${p.currentOpacity})`;
    particleCtx.fill();
  }

  particleCtx.restore();
}

function showParticles() { particlesVisible = true; }
function hideParticles() { particlesVisible = false; }
