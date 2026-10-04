/* ==========================================================================
   QUANTUM FIELD — Global ambient background
   A subtle, full-page "constellation" of drifting qubits (dots) linked by
   faint lines when near each other, plus a soft parallax reaction to the
   pointer. Sits fixed behind all content at low opacity to tie the whole
   page together without competing with text.

   - Theme aware (reads CSS variables, updates on theme toggle).
   - Honors prefers-reduced-motion: renders ONE static frame, no animation
     loop and no pointer reaction.
   - Pauses when the tab is hidden to save battery/CPU.
   - Attaches to <canvas data-quantum-field>.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
    return v || fallback;
  }

  /* Parse "#rrggbb" into "r,g,b" for use in rgba(). */
  function hexToRgb(hex) {
    hex = (hex || "").replace("#", "");
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var n = parseInt(hex, 16);
    if (isNaN(n) || hex.length !== 6) return "138, 63, 252";
    return ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
  }

  function Field(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.raf = null;
    this.particles = [];
    this.pointer = { x: null, y: null };
    this.reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.readColors();
    this.resize();

    window.addEventListener("resize", this.debounce(this.resize.bind(this), 150));

    var self = this;

    // Pointer parallax (skip under reduced motion).
    if (!this.reduced) {
      window.addEventListener("pointermove", function (e) {
        self.pointer.x = e.clientX;
        self.pointer.y = e.clientY;
      });
      window.addEventListener("pointerleave", function () {
        self.pointer.x = self.pointer.y = null;
      });
    }

    // Theme change -> refresh palette.
    new MutationObserver(function () {
      self.readColors();
      if (self.reduced) self.draw();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Pause when the tab is not visible.
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) self.stop();
      else self.start();
    });
  }

  Field.prototype.debounce = function (fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  };

  Field.prototype.readColors = function () {
    this.rgb = hexToRgb(cssVar("--ibm-light-purple", "#8a3ffc"));
  };

  Field.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;

    // Particle count scales with area, capped for performance.
    var target = Math.min(90, Math.round((w * h) / 18000));
    this.particles = [];
    for (var i = 0; i < target; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      });
    }
    if (this.reduced) this.draw();
  };

  Field.prototype.draw = function () {
    var ctx = this.ctx;
    var p = this.particles;
    var rgb = this.rgb;
    ctx.clearRect(0, 0, this.w, this.h);

    // Pointer parallax offset (very small).
    var ox = 0;
    var oy = 0;
    if (this.pointer.x !== null) {
      ox = (this.pointer.x - this.w / 2) * 0.01;
      oy = (this.pointer.y - this.h / 2) * 0.01;
    }

    var LINK = 130; // px distance to draw a link

    // Links first (behind dots).
    for (var i = 0; i < p.length; i++) {
      for (var j = i + 1; j < p.length; j++) {
        var dx = p[i].x - p[j].x;
        var dy = p[i].y - p[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK) {
          var a = (1 - dist / LINK) * 0.18;
          ctx.strokeStyle = "rgba(" + rgb + "," + a.toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p[i].x + ox, p[i].y + oy);
          ctx.lineTo(p[j].x + ox, p[j].y + oy);
          ctx.stroke();
        }
      }
    }

    // Dots.
    for (var k = 0; k < p.length; k++) {
      ctx.beginPath();
      ctx.arc(p[k].x + ox, p[k].y + oy, p[k].r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(" + rgb + ",0.5)";
      ctx.fill();
    }
  };

  Field.prototype.step = function () {
    var p = this.particles;
    for (var i = 0; i < p.length; i++) {
      p[i].x += p[i].vx;
      p[i].y += p[i].vy;
      // Wrap around the edges.
      if (p[i].x < -5) p[i].x = this.w + 5;
      else if (p[i].x > this.w + 5) p[i].x = -5;
      if (p[i].y < -5) p[i].y = this.h + 5;
      else if (p[i].y > this.h + 5) p[i].y = -5;
    }
  };

  Field.prototype.loop = function () {
    this.step();
    this.draw();
    this.raf = requestAnimationFrame(this.loop.bind(this));
  };

  Field.prototype.start = function () {
    if (this.reduced) {
      this.draw();
      return;
    }
    if (!this.raf) this.loop();
  };

  Field.prototype.stop = function () {
    if (this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  };

  function init() {
    var canvas = document.querySelector("canvas[data-quantum-field]");
    if (!canvas) return;
    new Field(canvas).start();
  }

  window.QFF.quantumField = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
