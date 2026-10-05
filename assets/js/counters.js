/* ==========================================================================
   COUNTERS — Animated number count-up
   Any element with data-count="N" animates from 0 to N the first time it
   scrolls into view. Optional data-prefix / data-suffix wrap the number.

   - Uses IntersectionObserver; animates once per element.
   - Honors prefers-reduced-motion (shows the final value immediately).
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  function animate(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var prefix = el.getAttribute("data-prefix") || "";
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1200;
    var start = null;

    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      // easeOutCubic
      var eased = 1 - Math.pow(1 - p, 3);
      var value = Math.round(target * eased);
      el.textContent = prefix + value + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = prefix + target + suffix;
    }
    requestAnimationFrame(frame);
  }

  function init() {
    var nodes = document.querySelectorAll("[data-count]");
    if (!nodes.length) return;

    var reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || !("IntersectionObserver" in window)) {
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        el.textContent =
          (el.getAttribute("data-prefix") || "") +
          el.getAttribute("data-count") +
          (el.getAttribute("data-suffix") || "");
      }
      return;
    }

    var obs = new IntersectionObserver(
      function (entries, o) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animate(entry.target);
            o.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    for (var j = 0; j < nodes.length; j++) obs.observe(nodes[j]);
  }

  window.QFF.counters = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
