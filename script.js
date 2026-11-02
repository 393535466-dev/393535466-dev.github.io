const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const currentYear = document.querySelector("#current-year");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute("aria-label", isExpanded ? "打开导航菜单" : "关闭导航菜单");
    siteNav.classList.toggle("is-open", !isExpanded);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "打开导航菜单");
      siteNav.classList.remove("is-open");
    }
  });
}

if (currentYear) {
  currentYear.textContent = `© ${new Date().getFullYear()}`;
}

const canvas = document.querySelector("#constellation-canvas");

if (canvas) {
  const context = canvas.getContext("2d");
  const colors = ["#8052ff", "#ffb829", "#15846e", "#bd67ff", "#55a8ff", "#f06cae"];
  let particles = [];
  let width = 0;
  let height = 0;
  let animationFrame;

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio || 1, 2);
    const bounds = canvas.getBoundingClientRect();
    width = Math.max(bounds.width, 320);
    height = Math.max(bounds.height, 320);
    canvas.width = width * scale;
    canvas.height = height * scale;
    context.setTransform(scale, 0, 0, scale, 0, 0);
    particles = Array.from({ length: Math.min(520, Math.round((width * height) / 650)) }, (_, index) => {
      const angle = index * 2.39996;
      const radius = Math.sqrt(index / 520) * Math.min(width, height) * 0.46;
      return {
        x: width / 2 + Math.cos(angle) * radius * (0.75 + Math.random() * 0.38),
        y: height / 2 + Math.sin(angle) * radius * (0.5 + Math.random() * 0.42),
        size: 0.65 + Math.random() * 1.8,
        color: colors[index % colors.length],
        phase: Math.random() * Math.PI * 2,
        speed: 0.0008 + Math.random() * 0.0016,
      };
    });
  };

  const draw = (time) => {
    context.clearRect(0, 0, width, height);
    particles.forEach((particle) => {
      const pulse = 0.55 + Math.sin(time * particle.speed + particle.phase) * 0.35;
      const drift = Math.sin(time * 0.00018 + particle.phase) * 3;
      context.globalAlpha = Math.max(0.18, pulse);
      context.fillStyle = particle.color;
      context.beginPath();
      context.moveTo(particle.x + drift, particle.y - particle.size);
      context.lineTo(particle.x + particle.size + drift, particle.y + particle.size);
      context.lineTo(particle.x - particle.size + drift, particle.y + particle.size);
      context.closePath();
      context.fill();
    });
    context.globalAlpha = 1;
    animationFrame = requestAnimationFrame(draw);
  };

  resize();
  window.addEventListener("resize", resize);
  animationFrame = requestAnimationFrame(draw);

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cancelAnimationFrame(animationFrame);
    draw(0);
  }
}
