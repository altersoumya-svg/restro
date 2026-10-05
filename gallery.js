/* ==========================================================================
   gallery.js — category filter + accessible lightbox with keyboard nav
   ========================================================================== */
(function () {
  "use strict";
  const grid = document.querySelector("[data-gallery]");
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll(".gallery-item"));
  const bar = document.querySelector("[data-gallery-filter]");

  /* Filtering ------------------------------------------------------------- */
  if (bar) {
    bar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      bar.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("active", b === btn));
      const f = btn.dataset.filter;
      items.forEach((it, i) => {
        const show = f === "all" || it.dataset.category.split(" ").includes(f);
        it.style.display = show ? "" : "none";
        if (show) {
          it.style.animation = "none";
          void it.offsetWidth;
          it.style.animation = `zoomIn .5s var(--ease) ${Math.min(i, 8) * 0.04}s both`;
        }
      });
    });
  }

  /* Lightbox --------------------------------------------------------------- */
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector(".lb-caption");
  let current = 0;

  const visible = () => items.filter((i) => i.style.display !== "none");

  function open(i) {
    const list = visible();
    current = (i + list.length) % list.length;
    const img = list[current].querySelector("img");
    lbImg.src = img.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = img.alt;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-close").focus();
  }
  function close() {
    lb.classList.remove("open");
    document.body.style.overflow = "";
  }

  items.forEach((it) =>
    it.addEventListener("click", () => open(visible().indexOf(it)))
  );
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", () => open(current - 1));
  lb.querySelector(".lb-next").addEventListener("click", () => open(current + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") open(current - 1);
    if (e.key === "ArrowRight") open(current + 1);
  });
})();
