/* ==========================================================================
   ORGANIZER PANEL
   Shown on the venue screen/projector. Asks the organizer for the shared
   secret (never stored in the repo), then displays the rotating TOTP code
   plus a countdown ring. Students type this code on asistencia.html within
   the window; a forwarded code expires almost immediately.

   Depends on: totp.js, attendance-config.js
   ========================================================================== */

(function () {
  "use strict";

  var CFG = (window.QFF && window.QFF.attendanceConfig) || {};
  var STEP = CFG.totpStepSeconds || 90;
  var DIGITS = CFG.totpDigits || 6;

  var secret = null;
  var timer = null;

  function $(id) {
    return document.getElementById(id);
  }

  async function tick() {
    if (!secret) return;
    var code = await window.QFF.totp.generate(secret, STEP, DIGITS);
    var left = window.QFF.totp.secondsLeft(STEP);

    var codeEl = $("panel-code");
    if (codeEl) {
      // Group digits for readability, e.g. 123 456
      codeEl.textContent =
        DIGITS === 6 ? code.slice(0, 3) + " " + code.slice(3) : code;
    }

    var secEl = $("panel-seconds");
    if (secEl) secEl.textContent = left + "s";

    var ring = $("panel-ring");
    if (ring) {
      var pct = (left / STEP) * 100;
      ring.style.background =
        "conic-gradient(var(--ibm-light-purple) " +
        pct +
        "%, var(--ibm-border) " +
        pct +
        "%)";
    }
  }

  function start() {
    var input = $("panel-secret");
    secret = (input && input.value ? input.value : "").trim();
    if (!secret) {
      alert("Enter the shared secret.");
      return;
    }
    hide($("panel-setup"));
    show($("panel-display"));
    tick();
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  function show(el) {
    if (el) el.hidden = false;
  }
  function hide(el) {
    if (el) el.hidden = true;
  }

  function init() {
    var btn = $("panel-start");
    if (btn) btn.addEventListener("click", start);
    var input = $("panel-secret");
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") start();
      });
    }
    var stepEl = $("panel-step-label");
    if (stepEl) stepEl.textContent = STEP + "s";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
