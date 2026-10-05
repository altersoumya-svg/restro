/* ==========================================================================
   animation.js — scroll reveal observer + light parallax
   ========================================================================== */
(function () {
  "use strict";
  const els = Array.from(document.querySelectorAll("[data-anim]"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in-view");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -60px" }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add("in-view"));
  }

  /* Subtle parallax for decorated blocks (skipped on touch/reduced motion) -- */
  const layers = Array.from(document.querySelectorAll("[data-parallax]"));
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (layers.length && !reduce && window.matchMedia("(pointer:fine)").matches) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = window.scrollY;
          layers.forEach((l) => {
            const speed = parseFloat(l.dataset.parallax) || 0.15;
            const offset = (y - l.offsetTop + window.innerHeight) * speed;
            l.style.transform = `translate3d(0, ${offset * 0.08}px, 0)`;
          });
          ticking = false;
        });
      },
      { passive: true }
    );
  }
})();
