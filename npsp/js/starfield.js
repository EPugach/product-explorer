// ══════════════════════════════════════════════════════════════
//  STARFIELD — Twinkling stars + mouse repulsion + bright flares
// ══════════════════════════════════════════════════════════════

let starfieldCanvas, starfieldCtx;
const stars = [];
const STAR_COUNT = 350;
const REPULSE_RADIUS = 80;
const REPULSE_STRENGTH = 18;
const RETURN_SPEED = 0.02;
const BRIGHT_STAR_COUNT = 3;

let mouseX = -9999;
let mouseY = -9999;
let brightStars = [];

function initStarfield() {
  starfieldCanvas = document.getElementById('starfield');
  starfieldCtx = starfieldCanvas.getContext('2d');
  resizeStarfield();

  // Regular stars with varied colors
  for (let i = 0; i < STAR_COUNT; i++) {
    const x = Math.random() * starfieldCanvas.width;
    const y = Math.random() * starfieldCanvas.height;
    // Vary colors: mostly cool blues/whites, some warm
    const hue = Math.random() < 0.85
      ? 210 + (Math.random() - 0.5) * 40  // Blue-white
      : 30 + Math.random() * 20;           // Warm gold
    const sat = Math.random() * 30;
    const light = 80 + Math.random() * 20;
    stars.push({
      baseX: x, baseY: y,
      x: x, y: y,
      sz: Math.random() * 1.5 + 0.3,
      op: Math.random() * 0.7 + 0.2,
      tw: Math.random() * 0.02 + 0.005,
      hue, sat, light
    });
  }

  // Bright stars with cross flares
  for (let i = 0; i < BRIGHT_STAR_COUNT; i++) {
    brightStars.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      size: 2 + Math.random() * 1.5,
      flareLength: 8 + Math.random() * 12,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.008 + Math.random() * 0.01
    });
  }

  // Track mouse for repulsion
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', function() {
    mouseX = -9999;
    mouseY = -9999;
  });

  let frame = 0;
  (function animate() {
    starfieldCtx.clearRect(0, 0, starfieldCanvas.width, starfieldCanvas.height);
    frame++;

    // Regular stars
    for (const star of stars) {
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPULSE_RADIUS && dist > 0) {
        const force = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
        const angle = Math.atan2(dy, dx);
        const targetX = star.baseX + Math.cos(angle) * force;
        const targetY = star.baseY + Math.sin(angle) * force;
        star.x += (targetX - star.x) * 0.1;
        star.y += (targetY - star.y) * 0.1;
      } else {
        star.x += (star.baseX - star.x) * RETURN_SPEED;
        star.y += (star.baseY - star.y) * RETURN_SPEED;
      }

      const twinkle = Math.sin(frame * star.tw) * 0.3 + 0.7;
      starfieldCtx.beginPath();
      starfieldCtx.arc(star.x, star.y, star.sz, 0, Math.PI * 2);
      starfieldCtx.fillStyle = `hsla(${star.hue}, ${star.sat}%, ${star.light}%, ${star.op * twinkle})`;
      starfieldCtx.fill();
    }

    // Bright stars with cross flares
    for (const bs of brightStars) {
      bs.twinklePhase += bs.twinkleSpeed;
      const glow = 0.4 + Math.sin(bs.twinklePhase) * 0.3;
      const fl = bs.flareLength * glow;

      // Core
      starfieldCtx.beginPath();
      starfieldCtx.arc(bs.x, bs.y, bs.size * glow, 0, Math.PI * 2);
      starfieldCtx.fillStyle = `rgba(200, 220, 255, ${glow * 0.8})`;
      starfieldCtx.fill();

      // Cross flare (4 points)
      starfieldCtx.strokeStyle = `rgba(200, 220, 255, ${glow * 0.3})`;
      starfieldCtx.lineWidth = 0.5;
      starfieldCtx.beginPath();
      starfieldCtx.moveTo(bs.x - fl, bs.y);
      starfieldCtx.lineTo(bs.x + fl, bs.y);
      starfieldCtx.moveTo(bs.x, bs.y - fl);
      starfieldCtx.lineTo(bs.x, bs.y + fl);
      starfieldCtx.stroke();
    }

    requestAnimationFrame(animate);
  })();
}

function resizeStarfield() {
  starfieldCanvas.width = innerWidth;
  starfieldCanvas.height = innerHeight;
  for (const star of stars) {
    if (star.baseX > starfieldCanvas.width) {
      star.baseX = Math.random() * starfieldCanvas.width;
      star.x = star.baseX;
    }
    if (star.baseY > starfieldCanvas.height) {
      star.baseY = Math.random() * starfieldCanvas.height;
      star.y = star.baseY;
    }
  }
  for (const bs of brightStars) {
    if (bs.x > innerWidth) bs.x = Math.random() * innerWidth;
    if (bs.y > innerHeight) bs.y = Math.random() * innerHeight;
  }
}
