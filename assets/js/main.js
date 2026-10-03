/* ==========================================================================
   MAIN — Entry point
   Bootstraps every module once the DOM is ready. Load this LAST, after
   config.js, i18n.js, theme.js, countdown.js and schedule.js.
   ========================================================================== */

(function () {
  "use strict";

  var QFF = window.QFF || {};
  var CONFIG = QFF.config || {};

  function wireFormLinks() {
    /* Replace legacy placeholder hrefs with the real Google Form URLs. */
    var map = [
      ['a[href="TU_ENLACE_DE_FORMULARIO"]', CONFIG.registrationFormUrl],
      ['a[href="TU_FORMULARIO_DE_CHARLAS_CORTAS"]', CONFIG.shortTalkFormUrl],
    ];

    map.forEach(function (pair) {
      var selector = pair[0];
      var url = pair[1];
      if (!url) return;
      document.querySelectorAll(selector).forEach(function (link) {
        link.href = url;
      });
    });
  }

  function init() {
    /* Theme first, so the correct palette is applied before paint settles. */
    if (QFF.theme) QFF.theme.applyStored();

    /* Language: restore the saved choice (or default). */
    if (QFF.i18n) {
      var savedLang = CONFIG.defaultLang || "en";
      try {
        savedLang = localStorage.getItem(
          (CONFIG.storageKeys && CONFIG.storageKeys.lang) || "lang"
        ) || savedLang;
      } catch (e) {
        /* Storage unavailable; keep default. */
      }
      QFF.i18n.setLanguage(savedLang);
    }

    wireFormLinks();

    if (QFF.countdown) QFF.countdown.start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
