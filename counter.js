/* ==========================================================================
   counter.js — animated statistics counters + offer countdown timer
   ========================================================================== */
(function () {
  "use strict";

  /* Counters --------------------------------------------------------------- */
  const counters = Array.from(document.querySelectorAll("[data-count]"));
  function run(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const dur = 1800;
    const start = performance.now();
    (function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) =>
          entries.forEach((en) => {
            if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
          }),
        { threshold: 0.4 }
      );
      counters.forEach((c) => io.observe(c));
    } else counters.forEach(run);
  }

  /* Countdown -------------------------------------------------------------- */
  const cd = document.getElementById("countdown");
  if (cd) {
    // Rolling 7-day offer window so the timer never expires on a static site.
    const KEY = "caferio-offer-deadline";
    let deadline = parseInt(localStorage.getItem(KEY) || "0", 10);
    if (!deadline || deadline < Date.now()) {
      deadline = Date.now() + 7 * 24 * 60 * 60 * 1000;
      try { localStorage.setItem(KEY, String(deadline)); } catch (e) {}
    }
    const out = {
      d: cd.querySelector("[data-d]"), h: cd.querySelector("[data-h]"),
      m: cd.querySelector("[data-m]"), s: cd.querySelector("[data-s]")
    };
    const pad = (n) => String(n).padStart(2, "0");

    (function tick() {
      const diff = Math.max(deadline - Date.now(), 0);
      const sec = Math.floor(diff / 1000);
      out.d.textContent = pad(Math.floor(sec / 86400));
      out.h.textContent = pad(Math.floor((sec % 86400) / 3600));
      out.m.textContent = pad(Math.floor((sec % 3600) / 60));
      out.s.textContent = pad(sec % 60);
      setTimeout(tick, 1000);
    })();
  }
})();
