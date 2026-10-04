/* ==========================================================================
   BLOCH SPHERE — Polished animated 3D hero backdrop
   A dependency-free Canvas 2D rendering of a Bloch sphere with real 3D
   rotation (rotation matrices + perspective projection):

     - a soft shaded sphere body (radial gradient) for volume,
     - a full globe of meridians + parallels with depth-based shading,
       drawn back-to-front so lines read with proper occlusion,
     - X / Y / Z axes with |0> / |1> labels,
     - a glowing state vector with an arrowhead and a faint trajectory arc,
     - a subtle rim highlight.

   Theme aware (reads CSS variables, updates on theme toggle) and honors
   prefers-reduced-motion (renders a single static 3D frame).
   Attaches to any <canvas data-bloch-sphere>.
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

  function hexToRgb(hex) {
    hex = (hex || "").replace("#", "");
    if (hex.length === 3) hex = hex.replace(/(.)/g, "$1$1");
    var n = parseInt(hex, 16);
    if (isNaN(n) || hex.length !== 6) return [138, 63, 252];
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(c, a) {
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")";
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
    this.wire = hexToRgb(cssVar("--ibm-border", "#273146"));
    this.axisC = hexToRgb(cssVar("--text-muted", "#8d96a0"));
    this.vec = hexToRgb(cssVar("--ibm-light-purple", "#8a3ffc"));
    this.glow = hexToRgb(cssVar("--ibm-soft-purple", "#be95ff"));
    this.textC = hexToRgb(cssVar("--text-secondary", "#c1c7d0"));
    this.body = hexToRgb(cssVar("--ibm-purple", "#6929c4"));
  };

  BlochSphere.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var rect = this.canvas.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) || 440;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.size = size;
    this.r = size * 0.3;
    this.cx = size / 2;
    this.cy = size / 2;
    if (this.reduced) this.draw();
  };

  /* Rotate a unit-ish 3D point by the animation angles and project to 2D with
     a perspective divide. Returns {x, y, z, scale}; z is camera depth. */
  BlochSphere.prototype.rp = function (x, y, z) {
    var ay = this.t * 0.55; // yaw
    var ax = -0.42; // fixed tilt for a 3/4 view

    var cy = Math.cos(ay), sy = Math.sin(ay);
    var x1 = x * cy + z * sy;
    var z1 = -x * sy + z * cy;

    var cx = Math.cos(ax), sx = Math.sin(ax);
    var y2 = y * cx - z1 * sx;
    var z2 = y * sx + z1 * cx;

    var dist = 4.2;
    var scale = dist / (dist - z2);
    return {
      x: this.cx + x1 * this.r * scale,
      y: this.cy - y2 * this.r * scale,
      z: z2,
      scale: scale,
    };
  };

  /* Shaded sphere body: a radial gradient offset toward the light. */
  BlochSphere.prototype.body3d = function () {
    var ctx = this.ctx;
    var R = this.r;
    var g = ctx.createRadialGradient(
      this.cx - R * 0.35,
      this.cy - R * 0.4,
      R * 0.1,
      this.cx,
      this.cy,
      R * 1.05
    );
    g.addColorStop(0, rgba(this.glow, 0.1));
    g.addColorStop(0.55, rgba(this.body, 0.07));
    g.addColorStop(1, rgba(this.body, 0.015));
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Rim highlight.
    ctx.strokeStyle = rgba(this.glow, 0.18);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, R, 0, Math.PI * 2);
    ctx.stroke();
  };

  /* Build the polyline for a latitude (parallel) or longitude (meridian). */
  BlochSphere.prototype.circlePoints = function (type, angle) {
    var pts = [];
    var steps = 60;
    for (var i = 0; i <= steps; i++) {
      var a = (i / steps) * Math.PI * 2;
      var ca = Math.cos(a), sa = Math.sin(a);
      var x, y, z;
      if (type === "lat") {
        // parallel at polar angle `angle`
        var ringR = Math.sin(angle);
        var y0 = Math.cos(angle);
        x = ringR * ca;
        z = ringR * sa;
        y = y0;
      } else {
        // meridian rotated by `angle` around the vertical (Y) axis
        x = Math.sin(a) * Math.cos(angle);
        z = Math.sin(a) * Math.sin(angle);
        y = Math.cos(a);
      }
      pts.push(this.rp(x, y, z));
    }
    return pts;
  };

  /* Draw a projected circle as short segments shaded by average depth,
     so back-facing parts fade out (fake occlusion). */
  BlochSphere.prototype.strokeCircle = function (pts) {
    var ctx = this.ctx;
    for (var i = 0; i < pts.length - 1; i++) {
      var a = pts[i], b = pts[i + 1];
      var depth = (a.z + b.z) / 2; // -1 back .. +1 front
      var alpha = 0.12 + Math.max(0, depth) * 0.5;
      ctx.strokeStyle = rgba(this.wire, alpha);
      ctx.lineWidth = depth > 0 ? 1.1 : 0.7;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  };

  BlochSphere.prototype.wireframe = function () {
    // Meridians.
    for (var m = 0; m < 6; m++) {
      this.strokeCircle(this.circlePoints("mer", (m / 6) * Math.PI));
    }
    // Parallels.
    for (var p = 1; p < 6; p++) {
      this.strokeCircle(this.circlePoints("lat", (p / 6) * Math.PI));
    }
  };

  BlochSphere.prototype.axis = function (x, y, z, label) {
    var ctx = this.ctx;
    var o = this.rp(0, 0, 0);
    var p = this.rp(x, y, z);
    var front = p.z >= 0;

    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = rgba(this.axisC, front ? 0.55 : 0.22);
    ctx.lineWidth = 1;
    ctx.stroke();

    if (label) {
      ctx.fillStyle = rgba(this.textC, front ? 0.95 : 0.4);
      ctx.font = "600 13px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, p.x, p.y - 11);
    }
  };

  /* The precessing state-vector direction at time t. */
  BlochSphere.prototype.stateDir = function (t) {
    var theta = Math.PI / 2 + Math.sin(t * 0.45) * 0.8; // polar
    var phi = t * 1.2; // azimuth
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.cos(theta),
      z: Math.sin(theta) * Math.sin(phi),
    };
  };

  BlochSphere.prototype.trajectory = function () {
    // Faint arc tracing recent positions of the state vector.
    var ctx = this.ctx;
    ctx.beginPath();
    var started = false;
    for (var k = 0; k <= 40; k++) {
      var tt = this.t - (k / 40) * 2.2;
      var d = this.stateDir(tt);
      var p = this.rp(d.x, d.y, d.z);
      if (!started) {
        ctx.moveTo(p.x, p.y);
        started = true;
      } else {
        ctx.lineTo(p.x, p.y);
      }
    }
    ctx.strokeStyle = rgba(this.glow, 0.22);
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  BlochSphere.prototype.vector = function () {
    var ctx = this.ctx;
    var o = this.rp(0, 0, 0);
    var d = this.stateDir(this.t);
    var tip = this.rp(d.x, d.y, d.z);

    // Glow halo at the tip.
    var halo = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, 22);
    halo.addColorStop(0, rgba(this.glow, 0.6));
    halo.addColorStop(1, rgba(this.glow, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(tip.x, tip.y, 22, 0, Math.PI * 2);
    ctx.fill();

    // Vector shaft.
    ctx.strokeStyle = rgba(this.vec, 0.95);
    ctx.lineWidth = 2.6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(o.x, o.y);
    ctx.lineTo(tip.x, tip.y);
    ctx.stroke();

    // Arrowhead at the tip, pointing away from origin.
    var ang = Math.atan2(tip.y - o.y, tip.x - o.x);
    var ah = 10;
    ctx.fillStyle = rgba(this.vec, 1);
    ctx.beginPath();
    ctx.moveTo(tip.x, tip.y);
    ctx.lineTo(
      tip.x - ah * Math.cos(ang - 0.4),
      tip.y - ah * Math.sin(ang - 0.4)
    );
    ctx.lineTo(
      tip.x - ah * Math.cos(ang + 0.4),
      tip.y - ah * Math.sin(ang + 0.4)
    );
    ctx.closePath();
    ctx.fill();

    // Origin dot.
    ctx.fillStyle = rgba(this.axisC, 0.9);
    ctx.beginPath();
    ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  BlochSphere.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.size, this.size);
    ctx.lineJoin = "round";

    this.body3d();
    this.wireframe();

    // Axes: Y up = |0>/|1>, plus X and Z.
    this.axis(0, 1.25, 0, "|0\u27E9");
    this.axis(0, -1.25, 0, "|1\u27E9");
    this.axis(1.25, 0, 0, "x");
    this.axis(0, 0, 1.25, "y");

    this.trajectory();
    this.vector();
  };

  BlochSphere.prototype.loop = function () {
    this.t += 0.009;
    this.draw();
    this.raf = requestAnimationFrame(this.loop.bind(this));
  };

  BlochSphere.prototype.start = function () {
    if (this.reduced) {
      this.t = 0.9;
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
