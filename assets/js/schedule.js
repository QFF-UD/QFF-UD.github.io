/* ==========================================================================
   SCHEDULE
   Program table day switching and the hover side-detail panel.
   Public API (window.QFF.schedule):
     - switchDayTable(dayId, btn)   show one day's table, highlight its tab
     - showSideDetails(...)         fill the side panel for a hovered row
   Global aliases are kept for the inline onclick / onmouseover handlers.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  function i18n() {
    return window.QFF.i18n;
  }

  function switchDayTable(dayId, btn) {
    document.querySelectorAll(".day-table-container").forEach(function (c) {
      c.style.display = "none";
    });

    var selected = document.getElementById("table-" + dayId);
    if (selected) selected.style.display = "block";

    document.querySelectorAll(".schedule-tabs .tab-btn").forEach(function (b) {
      b.classList.remove("active");
    });

    if (btn) btn.classList.add("active");
  }

  function showSideDetails(
    descKey,
    badgeKey,
    time,
    locationKey,
    speakerName,
    speakerImg
  ) {
    /* Translate the keys using the active language, falling back to the key. */
    var t = i18n() ? i18n().t : function (k) { return k; };

    var descText = t(descKey);
    var badgeText = t(badgeKey);
    var locationText = t(locationKey);

    var description = document.getElementById("sideDescription");
    var badge = document.getElementById("sideBadge");
    var location = document.getElementById("sideLocation");
    var speakerNameEl = document.getElementById("sideSpeakerName");
    var speakerImage = document.getElementById("sideSpeakerImg");

    if (description) description.innerHTML = descText;
    if (badge) badge.innerText = badgeText;
    if (location) {
      location.innerHTML =
        '<i class="fas fa-map-marker-alt"></i> ' + locationText + " | " + time;
    }
    if (speakerNameEl) speakerNameEl.innerText = speakerName;
    if (speakerImage) speakerImage.src = speakerImg;
  }

  /* Speaker-downloads section: show one day's download panel, highlight tab.
     Scoped to #speaker-downloads so it never touches the program schedule. */
  function switchDownloadDay(dayId, btn) {
    var section = document.getElementById("speaker-downloads");
    if (!section) return;

    section.querySelectorAll(".download-day").forEach(function (d) {
      d.style.display = "none";
    });

    var selected = document.getElementById(dayId);
    if (selected) selected.style.display = "block";

    section.querySelectorAll(".download-tabs .tab-btn").forEach(function (b) {
      b.classList.remove("active");
    });

    if (btn) btn.classList.add("active");
  }

  window.QFF.schedule = {
    switchDayTable: switchDayTable,
    showSideDetails: showSideDetails,
    switchDownloadDay: switchDownloadDay,
  };

  /* Backwards-compatible globals for inline handlers in the markup. */
  window.switchDayTable = switchDayTable;
  window.showSideDetails = showSideDetails;
  window.switchDownloadDay = switchDownloadDay;
})();
