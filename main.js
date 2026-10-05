/* ==========================================================================
   main.js — preloader, sticky header, mobile nav, search, back to top,
   scroll progress, ripple, custom cursor, page transitions, forms
   ========================================================================== */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* -- Preloader ---------------------------------------------------------- */
  window.addEventListener("load", () => {
    const pre = $("#preloader");
    if (pre) setTimeout(() => pre.classList.add("hidden"), 350);
  });

  /* -- Sticky header + scroll progress + back-to-top ---------------------- */
  const header = $(".site-header");
  const progress = $(".progress-bar");
  const toTop = $(".fab--top");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("solid", y > 60);
    if (toTop) toTop.classList.toggle("show", y > 500);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toTop) toTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* -- Mobile navigation --------------------------------------------------- */
  const mobileNav = $("#mobileNav");
  const overlay = $("#overlay");

  function closeAll() {
    mobileNav && mobileNav.classList.remove("open");
    $("#searchPopup") && $("#searchPopup").classList.remove("open");
    overlay && overlay.classList.remove("show");
    document.body.style.overflow = "";
  }
  $$("[data-nav-open]").forEach((b) =>
    b.addEventListener("click", () => {
      mobileNav && mobileNav.classList.add("open");
      overlay && overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    })
  );
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeAll));
  overlay && overlay.addEventListener("click", closeAll);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });

  /* -- Search popup with simple client-side page index --------------------- */
  const searchPopup = $("#searchPopup");
  const searchInput = $("#searchInput");
  const searchResults = $("#searchResults");
  const PAGES = [
    { t: "Home", u: "index.html", k: "home hero video restaurant" },
    { t: "About Us", u: "about.html", k: "story history mission vision timeline" },
    { t: "Menu", u: "menu.html", k: "food breakfast lunch dinner pizza burger coffee dessert drinks" },
    { t: "Menu Details", u: "menu-details.html", k: "truffle risotto ingredients nutrition reviews" },
    { t: "Our Chefs", u: "chefs.html", k: "chef team kitchen pastry sous" },
    { t: "Gallery", u: "gallery.html", k: "photos interior dishes events" },
    { t: "Reservation", u: "reservation.html", k: "book table booking date time guests" },
    { t: "Blog", u: "blog.html", k: "articles news recipes coffee stories" },
    { t: "Blog Details", u: "blog-details.html", k: "article single post comments" },
    { t: "Contact", u: "contact.html", k: "map address phone email hours" }
  ];
  $$("[data-search-open]").forEach((b) =>
    b.addEventListener("click", () => {
      searchPopup && searchPopup.classList.add("open");
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInput && searchInput.focus(), 150);
    })
  );
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) { searchResults.innerHTML = ""; return; }
      const hits = PAGES.filter((p) => (p.t + " " + p.k).toLowerCase().includes(q));
      searchResults.innerHTML = hits.length
        ? hits.map((p) => `<a href="${p.u}">${p.t}</a>`).join("")
        : `<p style="color:rgba(255,248,231,.6)">No matches for “${q}”.</p>`;
    });
    const form = searchInput.closest("form");
    form && form.addEventListener("submit", (e) => {
      e.preventDefault();
      const first = searchResults.querySelector("a");
      if (first) window.location.href = first.getAttribute("href");
    });
  }

  /* -- Button ripple ------------------------------------------------------- */
  $$(".btn").forEach((btn) =>
    btn.addEventListener("click", function (e) {
      const r = document.createElement("span");
      const size = Math.max(this.offsetWidth, this.offsetHeight);
      const rect = this.getBoundingClientRect();
      r.className = "ripple";
      r.style.width = r.style.height = size + "px";
      r.style.left = e.clientX - rect.left - size / 2 + "px";
      r.style.top = e.clientY - rect.top - size / 2 + "px";
      this.appendChild(r);
      setTimeout(() => r.remove(), 620);
    })
  );

  /* -- Custom cursor (pointer devices only) -------------------------------- */
  if (window.matchMedia("(pointer:fine)").matches) {
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    let rx = 0, ry = 0, mx = 0, my = 0;
    document.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    });
    (function loop() {
      rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      ring.style.transform = ring.classList.contains("grow")
        ? "translate(-50%,-50%) scale(1.6)" : "translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    $$("a, button, .gallery-item, .food-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("grow"));
      el.addEventListener("mouseleave", () => ring.classList.remove("grow"));
    });
  }

  /* -- Smooth in-page scroll ------------------------------------------------ */
  $$('a[href^="#"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
      closeAll();
    })
  );

  /* -- Soft page transitions ------------------------------------------------ */
  $$('a[href$=".html"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      if (a.target === "_blank" || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      document.body.classList.add("is-leaving");
      setTimeout(() => (window.location.href = a.href), 260);
    })
  );

  /* -- Newsletter / generic mini forms -------------------------------------- */
  $$("[data-mini-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const note = form.parentElement.querySelector(".form-note");
      const ok = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(input.value.trim());
      if (!note) return;
      note.textContent = ok
        ? "Thank you! Your table-side newsletter subscription is confirmed."
        : "Please enter a valid email address.";
      note.className = "form-note " + (ok ? "ok" : "bad");
      if (ok) form.reset();
    });
  });

  /* -- Native lazy-loading fallback ----------------------------------------- */
  if (!("loading" in HTMLImageElement.prototype)) {
    $$("img[loading='lazy'][data-src]").forEach((img) => (img.src = img.dataset.src));
  }
})();
