// ══════════════════════════════════════════════════════════════
//  STARFIELD — Canvas animation with mouse anti-gravity
// ══════════════════════════════════════════════════════════════

let starfieldCanvas, starfieldCtx;
const stars = [];
const STAR_COUNT = 350;
const REPULSE_RADIUS = 80;
const REPULSE_STRENGTH = 18;
const RETURN_SPEED = 0.02;

let mouseX = -9999;
let mouseY = -9999;

function initStarfield() {
  starfieldCanvas = document.getElementById('starfield');
  starfieldCtx = starfieldCanvas.getContext('2d');
  starfieldCanvas.width = innerWidth;
  starfieldCanvas.height = innerHeight;

  for (let i = 0; i < STAR_COUNT; i++) {
    const x = Math.random() * starfieldCanvas.width;
    const y = Math.random() * starfieldCanvas.height;
    stars.push({
      baseX: x,
      baseY: y,
      x: x,
      y: y,
      sz: Math.random() * 1.5 + 0.3,
      op: Math.random() * 0.8 + 0.2,
      tw: Math.random() * 0.02 + 0.005
    });
  }

  // Track mouse for anti-gravity effect
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

    for (const star of stars) {
      // Calculate distance to mouse
      const dx = star.x - mouseX;
      const dy = star.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < REPULSE_RADIUS && dist > 0) {
        // Push star away from cursor
        const force = (1 - dist / REPULSE_RADIUS) * REPULSE_STRENGTH;
        const angle = Math.atan2(dy, dx);
        const targetX = star.baseX + Math.cos(angle) * force;
        const targetY = star.baseY + Math.sin(angle) * force;
        star.x += (targetX - star.x) * 0.1;
        star.y += (targetY - star.y) * 0.1;
      } else {
        // Drift back to base position
        star.x += (star.baseX - star.x) * RETURN_SPEED;
        star.y += (star.baseY - star.y) * RETURN_SPEED;
      }

      // Twinkling
      const twinkle = Math.sin(frame * star.tw) * 0.3 + 0.7;
      starfieldCtx.beginPath();
      starfieldCtx.arc(star.x, star.y, star.sz, 0, Math.PI * 2);
      starfieldCtx.fillStyle = `rgba(180,200,255,${star.op * twinkle})`;
      starfieldCtx.fill();
    }

    requestAnimationFrame(animate);
  })();

  addEventListener('resize', function() {
    starfieldCanvas.width = innerWidth;
    starfieldCanvas.height = innerHeight;
    // Reposition stars that are now outside bounds
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
  });
}
