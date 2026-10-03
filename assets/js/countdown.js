/* ==========================================================================
   COUNTDOWN
   Live countdown to the event start date defined in config.js.
   Public API (window.QFF.countdown):
     - start()   begin updating the #cd-* fields every second
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  var CONFIG = window.QFF.config || {};
  var TARGET = new Date(CONFIG.eventStartISO || "2026-10-27T09:00:00-05:00").getTime();

  var MS = {
    day: 1000 * 60 * 60 * 24,
    hour: 1000 * 60 * 60,
    minute: 1000 * 60,
    second: 1000,
  };

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function render(days, hours, minutes, seconds) {
    var fields = {
      "cd-days": days,
      "cd-hours": hours,
      "cd-minutes": minutes,
      "cd-seconds": seconds,
    };

    Object.keys(fields).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.innerText = pad(fields[id]);
    });
  }

  function tick() {
    var diff = TARGET - Date.now();

    if (diff <= 0) {
      render(0, 0, 0, 0);
      return false; /* signal: countdown finished */
    }

    render(
      Math.floor(diff / MS.day),
      Math.floor((diff % MS.day) / MS.hour),
      Math.floor((diff % MS.hour) / MS.minute),
      Math.floor((diff % MS.minute) / MS.second)
    );
    return true;
  }

  function start() {
    if (!tick()) return;

    var timer = setInterval(function () {
      if (!tick()) clearInterval(timer);
    }, 1000);
  }

  window.QFF.countdown = { start: start };
})();
