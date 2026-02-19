// ══════════════════════════════════════════════════════
// Starfield — 350 twinkling stars on dedicated canvas
// ══════════════════════════════════════════════════════

let starfieldCanvas, starfieldCtx;
let stars = [];
let starfieldFrame = 0;
let starfieldRunning = false;

function initStarfield() {
  starfieldCanvas = document.getElementById('starfield');
  starfieldCtx = starfieldCanvas.getContext('2d');
  resizeStarfield();

  stars = [];
  for (let i = 0; i < 350; i++) {
    stars.push({
      x: Math.random() * starfieldCanvas.width / devicePixelRatio,
      y: Math.random() * starfieldCanvas.height / devicePixelRatio,
      sz: Math.random() * 1.5 + 0.3,
      op: Math.random() * 0.8 + 0.2,
      tw: Math.random() * 0.02 + 0.005
    });
  }

  starfieldRunning = true;
  requestAnimationFrame(starfieldTick);
}

function resizeStarfield() {
  starfieldCanvas.width = innerWidth * devicePixelRatio;
  starfieldCanvas.height = innerHeight * devicePixelRatio;
  starfieldCanvas.style.width = innerWidth + 'px';
  starfieldCanvas.style.height = innerHeight + 'px';
}

function starfieldTick() {
  if (!starfieldRunning) return;
  starfieldCtx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  starfieldCtx.clearRect(0, 0, innerWidth, innerHeight);
  starfieldFrame++;

  for (const st of stars) {
    const t = Math.sin(starfieldFrame * st.tw) * 0.3 + 0.7;
    starfieldCtx.beginPath();
    starfieldCtx.arc(st.x, st.y, st.sz, 0, Math.PI * 2);
    starfieldCtx.fillStyle = `rgba(180,200,255,${st.op * t})`;
    starfieldCtx.fill();
  }

  requestAnimationFrame(starfieldTick);
}

function pauseStarfield() { starfieldRunning = false; }
function resumeStarfield() {
  if (!starfieldRunning) { starfieldRunning = true; requestAnimationFrame(starfieldTick); }
}
