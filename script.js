// Schmackofatzi – kleines Skript ohne externe Abhängigkeiten.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Jahr im Footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Bewertungs-Karussell: rotiert automatisch, pausiert bei Hover/Fokus
  const track = document.querySelector(".carousel-track");
  const reviews = track ? [...track.querySelectorAll(".review")] : [];
  const dotsBox = document.querySelector(".carousel-dots");
  let current = 0;
  let timer = null;
  const INTERVAL = 6500;

  function show(index) {
    current = (index + reviews.length) % reviews.length;
    reviews.forEach((r, i) => {
      const active = i === current;
      r.toggleAttribute("data-active", active);
      r.setAttribute("aria-hidden", String(!active));
    });
    dotsBox?.querySelectorAll("button").forEach((d, i) => {
      d.setAttribute("aria-selected", String(i === current));
    });
  }

  function start() {
    if (reduceMotion || reviews.length < 2) return;
    stop();
    timer = setInterval(() => show(current + 1), INTERVAL);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  if (reviews.length) {
    reviews.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Bewertung ${i + 1} von ${reviews.length}`);
      dot.addEventListener("click", () => { show(i); start(); });
      dotsBox?.appendChild(dot);
    });
    document.querySelector(".carousel-nav.prev")?.addEventListener("click", () => { show(current - 1); start(); });
    document.querySelector(".carousel-nav.next")?.addEventListener("click", () => { show(current + 1); start(); });

    const carousel = document.querySelector(".reviews");
    carousel?.addEventListener("mouseenter", stop);
    carousel?.addEventListener("mouseleave", start);
    carousel?.addEventListener("focusin", stop);
    carousel?.addEventListener("focusout", start);

    // Wischen auf dem Handy
    let touchX = null;
    track.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { show(current + (dx < 0 ? 1 : -1)); start(); }
      touchX = null;
    });

    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    show(0);
    start();
  }

  // „Schmackofatz!“ – lässt Döner regnen
  const funken = document.querySelector(".funken");
  const items = ["🥙", "🌯", "🧅", "🍅", "🥬", "🧄"];

  function doenerRegen() {
    if (!funken || reduceMotion) return;
    for (let i = 0; i < 28; i++) {
      const el = document.createElement("span");
      el.className = "funke";
      el.textContent = items[Math.floor(Math.random() * items.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.animationDuration = `${2 + Math.random() * 2.5}s`;
      el.style.animationDelay = `${Math.random() * 0.8}s`;
      el.addEventListener("animationend", () => el.remove());
      funken.appendChild(el);
    }
  }

  document.getElementById("schmackofatz-btn")?.addEventListener("click", doenerRegen);
  document.querySelector(".chef-art img")?.addEventListener("click", doenerRegen);
})();
