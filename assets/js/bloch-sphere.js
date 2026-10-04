/* ==========================================================================
   BLOCH SPHERE — Animated hero visual
   A lightweight, dependency-free Canvas 2D rendering of a Bloch sphere:
   wireframe meridians/parallels, X/Y/Z axes with |0> / |1> labels, and a
   state vector that precesses smoothly around the sphere.

   - Theme aware: reads CSS custom properties, re-reads on theme toggle.
   - Accessible: honors prefers-reduced-motion (renders a single static frame).
   - Self-contained: attaches to any <canvas data-bloch-sphere>.
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

  function BlochSphere(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.t = 0;
    this.raf = null;
    this.reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    this.readColors();
    this.resize();

    window.addEventListener("resize", this.resize.bind(this));

    // Re-read palette when the theme changes (data-theme attribute flips).
    var self = this;
    new MutationObserver(function () {
      self.readColors();
      if (self.reduced) self.draw();
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  BlochSphere.prototype.readColors = function () {
    this.cWire = cssVar("--ibm-border", "#273146");
    this.cAxis = cssVar("--text-muted", "#8d96a0");
    this.cVector = cssVar("--ibm-light-purple", "#8a3ffc");
    this.cGlow = cssVar("--ibm-soft-purple", "#be95ff");
    this.cText = cssVar("--text-secondary", "#c1c7d0");
  };

  BlochSphere.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var size = this.canvas.clientWidth || 320;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.size = size;
    this.r = size * 0.34;
    this.cx = size / 2;
    this.cy = size / 2;
    if (this.reduced) this.draw();
  };

  /* Project a 3D point (x,y,z in [-1,1]) to 2D using a fixed isometric tilt.
     Returns {x, y, depth} where depth is used for painter ordering/opacity. */
  BlochSphere.prototype.project = function (x, y, z) {
    // Tilt the sphere slightly for a 3/4 view.
    var tiltX = -0.5; // radians, around X axis
    var cosT = Math.cos(tiltX);
    var sinT = Math.sin(tiltX);
    var y2 = y * cosT - z * sinT;
    var z2 = y * sinT + z * cosT;
    return {
      x: this.cx + x * this.r,
      y: this.cy - y2 * this.r,
      depth: z2, // +front, -back
    };
  };

  BlochSphere.prototype.ellipsePath = function (axis) {
    var ctx = this.ctx;
    var pts = [];
    var steps = 64;
    for (var i = 0; i <= steps; i++) {
      var a = (i / steps) * Math.PI * 2;
      var ca = Math.cos(a);
      var sa = Math.sin(a);
      var p;
      if (axis === "equator") p = this.project(ca, 0, sa);
      else if (axis === "meridian") p = this.project(0, ca, sa);
      else p = this.project(ca, sa, 0); // vertical
      pts.push(p);
    }
    // Draw as two passes (back dimmer, front brighter) for depth.
    for (var pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      var started = false;
      for (var j = 0; j < pts.length; j++) {
        var front = pts[j].depth >= 0;
        if ((pass === 0 && front) || (pass === 1 && !front)) {
          started = false;
          continue;
        }
        if (!started) {
          ctx.moveTo(pts[j].x, pts[j].y);
          started = true;
        } else {
          ctx.lineTo(pts[j].x, pts[j].y);
        }
      }
      ctx.globalAlpha = pass === 1 ? 0.25 : 0.7;
      ctx.strokeStyle = this.cWire;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  };

  BlochSphere.prototype.axis = function (x, y, z, label) {
    var ctx = this.ctx;
    var o = this.project(0, 0, 0);
    var p = this.project(x, y, z);
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = this.cAxis;
    ctx.globalAlpha = p.depth >= 0 ? 0.6 : 0.3;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (label) {
      ctx.fillStyle = this.cText;
      ctx.font = "600 13px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = p.depth >= 0 ? 0.9 : 0.45;
      ctx.fillText(label, p.x, p.y - 10);
      ctx.globalAlpha = 1;
    }
  };

  BlochSphere.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);

    // Wireframe
    this.ellipsePath("equator");
    this.ellipsePath("meridian");
    this.ellipsePath("vertical");

    // Axes (Z up = |0>/|1>, plus X and Y)
    this.axis(0, 1.15, 0, "|0\u27E9");
    this.axis(0, -1.15, 0, "|1\u27E9");
    this.axis(1.15, 0, 0, "x");
    this.axis(0, 0, 1.15, "y");

    // State vector: precesses around the sphere.
    var theta = Math.PI / 2 + Math.sin(this.t * 0.5) * 0.9; // polar
    var phi = this.t; // azimuth
    var vx = Math.sin(theta) * Math.cos(phi);
    var vz = Math.sin(theta) * Math.sin(phi);
    var vy = Math.cos(theta);

    var o = this.project(0, 0, 0);
    var tip = this.project(vx, vy, vz);

    // Glow halo at the tip
    var grad = ctx.createRadialGradient(
      tip.x,
      tip.y,
      0,
      tip.x,
      tip.y,
      18
    );
    grad.addColorStop(0, this.cGlow);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Vector line
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.strokeStyle = this.cVector;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Tip dot
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = this.cVector;
    ctx.fill();

    // Origin dot
    ctx.beginPath();
    ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.cAxis;
    ctx.fill();
  };

  BlochSphere.prototype.loop = function () {
    this.t += 0.012;
    this.draw();
    this.raf = requestAnimationFrame(this.loop.bind(this));
  };

  BlochSphere.prototype.start = function () {
    if (this.reduced) {
      this.t = 0.6; // a pleasant static angle
      this.draw();
      return;
    }
    if (!this.raf) this.loop();
  };

  function init() {
    var canvases = document.querySelectorAll("canvas[data-bloch-sphere]");
    for (var i = 0; i < canvases.length; i++) {
      new BlochSphere(canvases[i]).start();
    }
  }

  window.QFF.blochSphere = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
