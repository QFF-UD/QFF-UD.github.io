/* ==========================================================================
   QUANTUM CIRCUIT — Animated decorative band
   Draws a small, academically-styled quantum circuit on a <canvas>:
   qubit wires, labelled gates (H, X, Z), a CNOT, and a measurement box.
   A soft light "pulse" travels along the wires to suggest computation.

   - Theme aware (reads CSS variables, updates on theme toggle).
   - Honors prefers-reduced-motion (draws the circuit without the pulse).
   - Attaches to any <canvas data-quantum-circuit>.
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

  function Circuit(canvas) {
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

  Circuit.prototype.readColors = function () {
    this.cWire = cssVar("--ibm-border", "#273146");
    this.cGate = cssVar("--ibm-card-bg", "#171e2e");
    this.cGateBorder = cssVar("--ibm-light-purple", "#8a3ffc");
    this.cText = cssVar("--text-secondary", "#c1c7d0");
    this.cPulse = cssVar("--ibm-soft-purple", "#be95ff");
    this.cAccent = cssVar("--ibm-light-purple", "#8a3ffc");
  };

  Circuit.prototype.resize = function () {
    var dpr = window.devicePixelRatio || 1;
    var w = this.canvas.clientWidth || 800;
    var h = this.canvas.clientHeight || 160;
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;
    if (this.reduced) this.draw();
  };

  Circuit.prototype.gate = function (x, y, label) {
    var ctx = this.ctx;
    var s = 30;
    ctx.fillStyle = this.cGate;
    ctx.strokeStyle = this.cGateBorder;
    ctx.lineWidth = 1.5;
    this.roundRect(x - s / 2, y - s / 2, s, s, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = this.cText;
    ctx.font = "600 14px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 1);
  };

  Circuit.prototype.roundRect = function (x, y, w, h, r) {
    var ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  Circuit.prototype.cnot = function (x, yc, yt) {
    var ctx = this.ctx;
    // control dot
    ctx.beginPath();
    ctx.arc(x, yc, 5, 0, Math.PI * 2);
    ctx.fillStyle = this.cAccent;
    ctx.fill();
    // vertical link
    ctx.beginPath();
    ctx.moveTo(x, yc);
    ctx.lineTo(x, yt);
    ctx.strokeStyle = this.cAccent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // target ring + cross
    ctx.beginPath();
    ctx.arc(x, yt, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 11, yt);
    ctx.lineTo(x + 11, yt);
    ctx.moveTo(x, yt - 11);
    ctx.lineTo(x, yt + 11);
    ctx.stroke();
  };

  Circuit.prototype.measure = function (x, y) {
    var ctx = this.ctx;
    var s = 30;
    ctx.fillStyle = this.cGate;
    ctx.strokeStyle = this.cGateBorder;
    ctx.lineWidth = 1.5;
    this.roundRect(x - s / 2, y - s / 2, s, s, 5);
    ctx.fill();
    ctx.stroke();
    // meter arc + needle
    ctx.beginPath();
    ctx.arc(x, y + 4, 9, Math.PI, 0);
    ctx.strokeStyle = this.cText;
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y + 4);
    ctx.lineTo(x + 6, y - 4);
    ctx.stroke();
  };

  Circuit.prototype.draw = function () {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, this.w, this.h);

    var pad = 40;
    var n = 3; // qubits
    var top = this.h * 0.28;
    var gap = (this.h * 0.5) / (n - 1);
    this.wires = [];
    for (var i = 0; i < n; i++) this.wires.push(top + i * gap);

    var x0 = pad;
    var x1 = this.w - pad;

    // Wires + qubit labels
    for (var w = 0; w < n; w++) {
      var y = this.wires[w];
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.strokeStyle = this.cWire;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = this.cText;
      ctx.font = "500 12px 'IBM Plex Mono', monospace";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText("q" + w, x0 - 8, y);
    }

    // Gate columns laid out proportionally across the width.
    var usable = x1 - x0;
    var col = function (frac) {
      return x0 + usable * frac;
    };

    this.gate(col(0.14), this.wires[0], "H");
    this.gate(col(0.14), this.wires[1], "X");
    this.cnot(col(0.4), this.wires[0], this.wires[1]);
    this.gate(col(0.62), this.wires[2], "H");
    this.cnot(col(0.78), this.wires[1], this.wires[2]);
    this.gate(col(0.9), this.wires[0], "Z");
    this.measure(col(0.98), this.wires[2]);

    // Travelling pulse along the wires.
    if (!this.reduced) {
      var prog = (this.t % 1); // 0..1
      var px = x0 + usable * prog;
      for (var k = 0; k < n; k++) {
        var yy = this.wires[k];
        var grad = ctx.createRadialGradient(px, yy, 0, px, yy, 22);
        grad.addColorStop(0, this.cPulse);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalAlpha = 0.33;
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, yy, 22, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
  };

  Circuit.prototype.loop = function () {
    this.t += 0.0025;
    this.draw();
    this.raf = requestAnimationFrame(this.loop.bind(this));
  };

  Circuit.prototype.start = function () {
    if (this.reduced) {
      this.draw();
      return;
    }
    if (!this.raf) this.loop();
  };

  function init() {
    var canvases = document.querySelectorAll("canvas[data-quantum-circuit]");
    for (var i = 0; i < canvases.length; i++) {
      new Circuit(canvases[i]).start();
    }
  }

  window.QFF.quantumCircuit = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
