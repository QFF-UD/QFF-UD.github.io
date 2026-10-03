/* ==========================================================================
   THEME
   Dark (default) / light mode toggle with persistence and logo swap.
   Public API (window.QFF.theme):
     - toggleTheme()   flip between dark and light
     - applyStored()   apply the persisted (or default) theme on load
     - update()        sync icon + logo to the current theme
   A global toggleTheme() alias is kept for the inline onclick handler.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  var CONFIG = window.QFF.config || {};
  var THEME_KEY = (CONFIG.storageKeys && CONFIG.storageKeys.theme) || "theme";

  var LOGOS = {
    light: "Logos/logo_claro.png",
    dark: "Logos/logo_oscuro.png",
  };

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }

  function update() {
    var theme = getTheme();
    var icon = document.getElementById("themeIcon");
    var logo = document.getElementById("dynamicNavLogo");

    if (icon) {
      icon.className = theme === "light" ? "fas fa-sun" : "fas fa-moon";
    }
    if (logo) {
      logo.src = theme === "light" ? LOGOS.light : LOGOS.dark;
    }
  }

  function setTheme(theme) {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {
      /* Storage unavailable; ignore. */
    }

    update();
  }

  function toggleTheme() {
    setTheme(getTheme() === "light" ? "dark" : "light");
  }

  function applyStored() {
    var stored;
    try {
      stored = localStorage.getItem(THEME_KEY);
    } catch (e) {
      stored = null;
    }

    if (stored === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }

    update();
  }

  window.QFF.theme = {
    toggleTheme: toggleTheme,
    applyStored: applyStored,
    update: update,
  };

  /* Backwards-compatible global for inline onclick="toggleTheme()". */
  window.toggleTheme = toggleTheme;
})();
