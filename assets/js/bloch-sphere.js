/* ==========================================================================
   BLOCH SPHERE — Animated 3D hero backdrop
   A dependency-free Canvas 2D rendering of a Bloch sphere with REAL 3D
   rotation (perspective projection + rotation matrices). Shows a dotted
   wireframe globe (meridians + parallels), the X/Y/Z axes with |0>/|1>
   labels, and a precessing state vector. The whole sphere slowly rotates
   in 3D so it reads as a globe, not a flat disc.

   - Theme aware: reads CSS custom properties, re-reads on theme toggle.
   - Accessible: honors prefers-reduced-motion (one static 3D frame).
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
    // Size from the actual rendered box; fall back gracefully.
    var rect = this.canvas.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) || 400;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.size = size;
    this.r = size * 0.32;
    this.cx = size / 2;
    this.cy = size / 2;
    if (this.reduced) this.draw();
  };

  /* Rotate a 3D point by the current animation angles, then project to 2D
     with a simple perspective divide. Returns {x, y, z} (z = camera depth). */
  BlochSphere.prototype.rotateProject = function (x, y, z) {
    var ay = this.t * 0.6; // yaw (around Y)
    var ax = -0.5; // fixed tilt (around X) for a 3/4 view

    // Rotate around Y
    var cosY = Math.cos(ay);
    var sinY = Math.sin(ay);
    var x1 = x * cosY + z * sinY;
    var z1 = -x * sinY + z * cosY;

    // Rotate around X
    var cosX = Math.cos(ax);
    var sinX = Math.sin(ax);
    var y2 = y * cosX - z1 * sinX;
    var z2 = y * sinX + z1 * cosX;

    // Perspective projection
    var distance = 4;
    var scale = distance / (distance - z2);

    return {
      x: this.cx + x1 * this.r * scale,
      y: this.cy - y2 * this.r * scale,
      z: z2, // +toward camera, -away
      scale: scale,
    };
  };

  /* Draw one great circle in a given plane as a series of depth-shaded dots. */
  BlochSphere.prototype.ring = function (plane) {
    var ctx = this.ctx;
    var steps = 72;
    for (var i = 0; i < steps; i++) {
      var a = (i / steps) * Math.PI * 2;
      var ca = Math.cos(a);
      var sa = Math.sin(a);
      var p;
      if (plane === "xy") p = this.rotateProject(ca, sa, 0);
      else if (plane === "xz") p = this.rotateProject(ca, 0, sa);
      else p = this.rotateProject(0, ca, sa); // yz
      var front = p.z >= 0;
      ctx.globalAlpha = front ? 0.75 : 0.18;
      ctx.fillStyle = this.cWire;
      ctx.beginPath();
      ctx.arc(p.x, p.y, front ? 1.3 : 1.0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  BlochSphere.prototype.axis = function (x, y, z, label) {
    var ctx = this.ctx;
    var o = this.rotateProject(0, 0, 0);
    var p = this.rotateProject(x, y, z);
    var front = p.z >= 0;

    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = this.cAxis;
    ctx.globalAlpha = front ? 0.6 : 0.28;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;

    if (label) {
      ctx.fillStyle = this.cText;
      ctx.font = "600 13px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalAlpha = front ? 0.95 : 0.4;
      ctx.fillText(label, p.x, p.y - 10);
      ctx.globalAlpha = 1;
    }
  };

  BlochSphere.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);

    // Wireframe globe: three great circles.
    this.ring("xy");
    this.ring("xz");
    this.ring("yz");

    // Axes: Y up = |0> / |1>, plus X and Z.
    this.axis(0, 1.18, 0, "|0\u27E9");
    this.axis(0, -1.18, 0, "|1\u27E9");
    this.axis(1.18, 0, 0, "x");
    this.axis(0, 0, 1.18, "y");

    // State vector precessing on the sphere.
    var theta = Math.PI / 2 + Math.sin(this.t * 0.5) * 0.85; // polar
    var phi = this.t * 1.3; // azimuth
    var vx = Math.sin(theta) * Math.cos(phi);
    var vz = Math.sin(theta) * Math.sin(phi);
    var vy = Math.cos(theta);

    var o = this.rotateProject(0, 0, 0);
    var tip = this.rotateProject(vx, vy, vz);

    // Glow halo at the tip.
    var halo = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 20);
    halo.addColorStop(0, this.cGlow);
    halo.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Vector line.
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.strokeStyle = this.cVector;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.stroke();

    // Tip + origin dots.
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 4.5, 0, Math.PI * 2);
    ctx.fillStyle = this.cVector;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = this.cAxis;
    ctx.fill();
  };

  BlochSphere.prototype.loop = function () {
    this.t += 0.01;
    this.draw();
    this.raf = requestAnimationFrame(this.loop.bind(this));
  };

  BlochSphere.prototype.start = function () {
    if (this.reduced) {
      this.t = 0.8; // a pleasant static angle
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
