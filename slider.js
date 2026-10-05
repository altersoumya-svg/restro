/* ==========================================================================
   slider.js — hero video control, testimonial auto slider, video popup
   ========================================================================== */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* -- Hero video: lazy source attach + fade in + pause when offscreen ----- */
  const heroVideo = $("#heroVideo");
  if (heroVideo) {
    const attach = () => {
      $$("source[data-src]", heroVideo).forEach((s) => {
        s.src = s.dataset.src;
        s.removeAttribute("data-src");
      });
      heroVideo.load();
      const play = heroVideo.play();
      if (play && play.catch) play.catch(() => {/* autoplay blocked → poster stays */});
    };
    if ("requestIdleCallback" in window) requestIdleCallback(attach, { timeout: 1200 });
    else setTimeout(attach, 400);

    heroVideo.addEventListener("playing", () => heroVideo.classList.add("loaded"));
    heroVideo.addEventListener("loadeddata", () => heroVideo.classList.add("loaded"));

    // Save battery: pause the loop when the hero scrolls away.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        (entries) => entries.forEach((en) => (en.isIntersecting ? heroVideo.play().catch(() => {}) : heroVideo.pause())),
        { threshold: 0.1 }
      ).observe(heroVideo);
    }
  }

  /* -- Testimonial slider --------------------------------------------------- */
  const track = $("#testiTrack");
  if (track) {
    const slides = $$(".testi-slide", track);
    const dotsWrap = $("#testiDots");
    let index = 0, timer = null;

    slides.forEach((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show testimonial " + (i + 1));
      b.addEventListener("click", () => go(i, true));
      dotsWrap.appendChild(b);
    });

    function go(i, manual) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      $$("button", dotsWrap).forEach((d, di) => d.classList.toggle("active", di === index));
      if (manual) restart();
    }
    function restart() { clearInterval(timer); timer = setInterval(() => go(index + 1), 6000); }

    go(0);
    restart();
    track.parentElement.addEventListener("mouseenter", () => clearInterval(timer));
    track.parentElement.addEventListener("mouseleave", restart);
  }

  /* -- Video popup player ---------------------------------------------------- */
  const modal = $("#videoModal");
  if (modal) {
    const player = $("video", modal);
    $$("[data-video-open]").forEach((btn) =>
      btn.addEventListener("click", () => {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        player.play().catch(() => {});
      })
    );
    const close = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      player.pause();
    };
    $$("[data-video-close]", modal).forEach((b) => b.addEventListener("click", close));
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }
})();
