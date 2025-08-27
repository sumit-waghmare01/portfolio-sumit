

// Active menu item on click
document.querySelectorAll('nav ul li a').forEach(link => {
  link.addEventListener('click', function() {
    document.querySelectorAll('nav ul li a').forEach(a => a.classList.remove('active'));
    this.classList.add('active');
  });
});




// pentagon-bg animation - script.js

(function() {
  const canvas = document.getElementById('pentagonCanvas');
  const ctx = canvas.getContext('2d');

  // handle high-DPI screens
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  // settings
  const COUNT = 40;            // number of pentagons
  const MIN_SIZE = 30;         // min radius
  const MAX_SIZE = 100;        // max radius
  const SPEED = 2;          // base speed multiplier
  const STROKE_COLOR = 'rgba(255, 172, 47, 0.85)'; // orange-ish
  const LINE_WIDTH = 3;

  // polygon objects
  const polys = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makePentagonPoints(cx, cy, r, rot = 0) {
    const points = [];
    for (let i=0;i<5;i++) {
      const angle = rot + (i * (2 * Math.PI / 5)) - Math.PI/2;
      points.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
    }
    return points;
  }

  function createPolys() {
    polys.length = 0;
    for (let i=0;i<COUNT;i++) {
      const size = rand(MIN_SIZE, MAX_SIZE);
      polys.push({
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        r: size,
        rot: rand(0, Math.PI*2),
        vx: rand(-1, 1) * SPEED * rand(0.3, 1.2),
        vy: rand(-1, 1) * SPEED * rand(0.3, 1.2),
        alpha: rand(0.15, 0.6),    // opacity for softer look
        stroke: STROKE_COLOR,
        linewidth: LINE_WIDTH * (size > 120 ? 1.1 : 1)
      });
    }
  }
  createPolys();

  // draw a single pentagon outline with small inner connector lines (to look like line-art)
  function drawPentagon(p) {
    const pts = makePentagonPoints(p.x, p.y, p.r, p.rot);
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.lineWidth = p.linewidth;
    ctx.strokeStyle = p.stroke;

    // outer pentagon
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i=1;i<pts.length;i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.stroke();

    // optional star-like inner lines for extra style
    ctx.beginPath();
    for (let i=0;i<5;i++){
      const a = pts[i];
      const b = pts[(i+2)%5];
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    ctx.restore();
  }

  // animation loop
  let lastTime = performance.now();
  function animate(now) {
    const dt = (now - lastTime) / 16.666; // normalized to 60fps units
    lastTime = now;

    ctx.clearRect(0,0,canvas.width, canvas.height);
    // subtle background tint (optional)
    // ctx.fillStyle = 'rgba(250,250,250,0.01)';
    // ctx.fillRect(0,0,canvas.width, canvas.height);

    // update and draw polys
    for (let p of polys) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += 0.0015 * dt; // slow rotation

      // wrap-around for continuous flow (if goes off-screen, appear other side)
      if (p.x < -p.r) p.x = window.innerWidth + p.r;
      if (p.x > window.innerWidth + p.r) p.x = -p.r;
      if (p.y < -p.r) p.y = window.innerHeight + p.r;
      if (p.y > window.innerHeight + p.r) p.y = -p.r;

      drawPentagon(p);
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  // regenerate on demand (e.g., if you want different pattern)
  window.regeneratePentagons = function() {
    createPolys();
  };

})();




// script.js

// सगळे images select करतो
const images = document.querySelectorAll('.card img');

// popup तयार करतो
const popup = document.createElement('div');
popup.id = 'imagePopup';
popup.style.position = 'fixed';
popup.style.top = '0';
popup.style.left = '0';
popup.style.width = '100%';
popup.style.height = '100%';
popup.style.background = 'rgba(0, 0, 0, 0.8)';
popup.style.display = 'flex';
popup.style.alignItems = 'center';
popup.style.justifyContent = 'center';
popup.style.zIndex = '9999';
popup.style.visibility = 'hidden';

// popup image
const popupImage = document.createElement('img');
popupImage.style.maxWidth = '90%';
popupImage.style.maxHeight = '90%';
popupImage.style.borderRadius = '10px';
popup.appendChild(popupImage);

// close button
const closeBtn = document.createElement('span');
closeBtn.innerHTML = '&times;';
closeBtn.style.position = 'absolute';
closeBtn.style.top = '20px';
closeBtn.style.right = '40px';
closeBtn.style.fontSize = '40px';
closeBtn.style.color = '#fff';
closeBtn.style.cursor = 'pointer';
popup.appendChild(closeBtn);

// document मध्ये add करतो
document.body.appendChild(popup);

// image वर click event
images.forEach(img => {
    img.addEventListener('click', () => {
        popupImage.src = img.src;
        popup.style.visibility = 'visible';
    });
});

// close button वर click
closeBtn.addEventListener('click', () => {
    popup.style.visibility = 'hidden';
});


// Scroll to top button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 200) {
    scrollToTopBtn.style.display = "block";
  } else {
    scrollToTopBtn.style.display = "none";
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
