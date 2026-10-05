/* ==========================================================================
   reservation.js — validation for reservation & contact forms + success modal
   ========================================================================== */
(function () {
  "use strict";
  const forms = Array.from(document.querySelectorAll("[data-validate]"));
  if (!forms.length) return;

  const RULES = {
    text: (v) => v.trim().length >= 2 || "Please enter at least 2 characters.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) || "Please enter a valid email address.",
    tel: (v) => /^[+()\d\s-]{7,20}$/.test(v.trim()) || "Please enter a valid phone number.",
    date: (v) => (!!v && new Date(v) >= new Date(new Date().toDateString())) || "Choose today or a future date.",
    time: (v) => !!v || "Please choose a time.",
    number: (v) => (+v >= 1 && +v <= 30) || "Guests must be between 1 and 30.",
    "select-one": (v) => !!v || "Please make a selection.",
    textarea: (v) => v.trim().length >= 10 || "Please write at least 10 characters."
  };

  function validateField(el) {
    const wrap = el.closest(".field");
    const msg = wrap && wrap.querySelector(".error-msg");
    const type = el.tagName === "TEXTAREA" ? "textarea" : el.type;
    if (!el.required && !el.value.trim()) {
      wrap && wrap.classList.remove("invalid");
      if (msg) msg.textContent = "";
      return true;
    }
    const rule = RULES[type] || RULES.text;
    const res = rule(el.value);
    const ok = res === true;
    wrap && wrap.classList.toggle("invalid", !ok);
    if (msg) msg.textContent = ok ? "" : res;
    return ok;
  }

  forms.forEach((form) => {
    const fields = Array.from(form.querySelectorAll("input, select, textarea"));

    // Block past dates in the picker itself.
    const dateEl = form.querySelector('input[type="date"]');
    if (dateEl) dateEl.min = new Date().toISOString().split("T")[0];

    fields.forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => {
        if (f.closest(".field").classList.contains("invalid")) validateField(f);
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = fields.map(validateField).every(Boolean);
      if (!valid) {
        const bad = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        bad && bad.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const label = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      // Simulated async submit — swap for your backend endpoint when available.
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.textContent = label; }
        form.reset();
        const modal = document.getElementById(form.dataset.successModal || "successModal");
        if (modal) {
          modal.classList.add("open");
          document.body.style.overflow = "hidden";
        }
      }, 900);
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach((b) =>
    b.addEventListener("click", () => {
      const m = b.closest(".modal");
      m && m.classList.remove("open");
      document.body.style.overflow = "";
    })
  );
})();
