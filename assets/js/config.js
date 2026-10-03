/* ==========================================================================
   CONFIG
   Central place for external URLs and site-wide constants.
   Exposed on window.QFF so every module can read the same values.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  window.QFF.config = {
    /* Google Form — general registration */
    registrationFormUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSdIPCCZqMLmc59LAYObOcMxxhM1h4F9Ovhmpxf3Az8NHvDZSg/viewform?usp=preview",

    /* Google Form — short talk submissions */
    shortTalkFormUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSc4ouQLQd1dVipejWvjjs4e5Kq-15ZxlmD9sudzsdnS42kzwA/viewform?usp=sharing&ouid=116179917224997068196",

    /* Countdown target: Oct 27, 2026, 09:00 (Bogota, UTC-5) */
    eventStartISO: "2026-10-27T09:00:00-05:00",

    /* Default language and persistence keys */
    defaultLang: "en",
    storageKeys: {
      lang: "lang",
      theme: "theme",
    },
  };
})();
