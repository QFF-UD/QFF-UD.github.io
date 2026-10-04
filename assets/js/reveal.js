/* ==========================================================================
   REVEAL — Scroll-triggered entrance animations
   Adds a subtle fade/slide-up as elements enter the viewport, using
   IntersectionObserver. Opt-in via the .reveal class in the markup.

   - Honors prefers-reduced-motion: elements are shown immediately, no motion.
   - Degrades gracefully if IntersectionObserver is unavailable.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  function revealAll(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].classList.add("is-visible");
    }
  }

  function init() {
    var nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;

    var reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || !("IntersectionObserver" in window)) {
      revealAll(nodes);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger slightly by index among siblings for a refined feel.
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    for (var i = 0; i < nodes.length; i++) observer.observe(nodes[i]);
  }

  window.QFF.reveal = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
