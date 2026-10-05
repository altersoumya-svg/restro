/* ==========================================================================
   menu-filter.js — category filtering for menu cards (home + menu page)
   ========================================================================== */
(function () {
  "use strict";
  const bars = Array.from(document.querySelectorAll("[data-filter-bar]"));
  if (!bars.length) return;

  bars.forEach((bar) => {
    const targetSel = bar.getAttribute("data-filter-target");
    const items = Array.from(document.querySelectorAll(targetSel + " [data-category]"));
    const empty = document.querySelector(targetSel + "-empty");

    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      bar.querySelectorAll(".filter-btn").forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-pressed", b === btn ? "true" : "false");
      });

      const filter = btn.dataset.filter;
      let visible = 0;

      items.forEach((item, i) => {
        const match = filter === "all" || item.dataset.category.split(" ").includes(filter);
        if (match) {
          visible++;
          item.style.display = "";
          // restart the reveal animation for a lively re-flow
          item.classList.remove("in-view");
          item.style.animation = "none";
          void item.offsetWidth;
          item.style.animation = `zoomIn .55s var(--ease) ${Math.min(i, 8) * 0.05}s both`;
        } else {
          item.style.display = "none";
        }
      });

      if (empty) empty.hidden = visible !== 0;
    });
  });
})();
