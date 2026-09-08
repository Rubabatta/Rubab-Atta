const nav = document.querySelector("#primary-navigation");
const menu = document.querySelector(".menu-btn");

const closeMenu = () => {
  nav?.classList.remove("open");
  menu?.classList.remove("open");
  menu?.setAttribute("aria-expanded", "false");
};

menu?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") || false;
  menu.classList.toggle("open", isOpen);
  menu.setAttribute("aria-expanded", String(isOpen));
});
document
  .querySelectorAll(".header nav a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

// Reveal every section/card as it enters the viewport
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        const counter = entry.target.querySelector(".counter");
        if (counter && !counter.dataset.done) {
          counter.dataset.done = "1";
          const target = +counter.dataset.target;
          let n = 0;
          const duration = 900,
            start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            n = Math.round(target * (1 - Math.pow(1 - progress, 3)));
            counter.textContent = n;
            if (progress < 1) requestAnimationFrame(tick);
            else counter.textContent = target;
          };
          counter.textContent = "0";
          requestAnimationFrame(tick);
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);
document
  .querySelectorAll(".reveal:not(.project)")
  .forEach((el) => revealObserver.observe(el));

// Scroll progress + active navigation
const progress = document.querySelector("#progress");
const sections = [...document.querySelectorAll("main section[id]")];
const links = [...document.querySelectorAll("nav a")];
function scrollUI() {
  const max = document.documentElement.scrollHeight - innerHeight;

  if (progress) {
    progress.style.width = (max ? (scrollY / max) * 100 : 0) + "%";
  }

  const y = scrollY + innerHeight / 2;
  let current = "home";
  sections.forEach((s) => {
    if (y >= s.offsetTop) current = s.id;
  });
  links.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === "#" + current),
  );
}
addEventListener("scroll", scrollUI, { passive: true });
scrollUI();

// Parallax background blobs
const blobs = [...document.querySelectorAll(".parallax-bg span")];
addEventListener(
  "scroll",
  () =>
    blobs.forEach((b) => {
      const speed = +b.dataset.speed;
      b.style.transform = `translate3d(0,${scrollY * speed}px,0)`;
    }),
  { passive: true },
);

// Custom cursor
const dot = document.querySelector(".cursor-dot"),
  ring = document.querySelector(".cursor-ring");
let mx = innerWidth / 2,
  my = innerHeight / 2,
  rx = mx,
  ry = my;
addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});
function cursorLoop() {
  rx += (mx - rx) * 0.16;
  ry += (my - ry) * 0.16;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(cursorLoop);
}
cursorLoop();
document.querySelectorAll("a,button,.project,.service").forEach((el) => {
  el.addEventListener("mouseenter", () => ring.classList.add("hover"));
  el.addEventListener("mouseleave", () => ring.classList.remove("hover"));
});

/* Simple particle background (lightweight) */
(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0,
    h = 0,
    particles = [];
  function resize() {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
    initParticles();
  }
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
  function initParticles() {
    const count = Math.max(60, Math.round((w * h) / 8000));
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: rand(-0.2, 0.2),
        vy: rand(-0.3, 0.3),
        r: rand(0.6, 2.2),
        alpha: rand(0.06, 0.16),
      });
    }
  }
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,181,253,${p.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  addEventListener("resize", resize, { passive: true });
  resize();
  tick();
})();

// Staggered reveal for projects: show one-by-one with a small delay
(function () {
  const grid = document.querySelector(".project-grid");
  if (!grid) return;
  const projObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const projects = [...grid.querySelectorAll(".project")];
          projects.forEach((p, i) => {
            setTimeout(() => p.classList.add("show"), i * 220);
          });
          projObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  projObserver.observe(grid);
})();
