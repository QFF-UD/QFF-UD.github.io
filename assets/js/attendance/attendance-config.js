/* ==========================================================================
   ATTENDANCE CONFIG
   Central settings for the attendance system. Fill in the two values marked
   TODO after you set up Google Sign-In and the Apps Script backend (see
   assets/js/attendance/SETUP.md). Everything else can stay as-is.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  window.QFF.attendanceConfig = {
    /* ---- Google Sign-In ----
       OAuth Client ID from Google Cloud Console. */
    googleClientId:
      "981790589897-5s28odtlslogq3th2cdeg1343tn0h49a.apps.googleusercontent.com",

    /* ---- Backend ----
       Apps Script Web App URL (ends with /exec). */
    backendUrl:
      "https://script.google.com/macros/s/AKfycbwLhuLIWmgxenpcWndfVLPpOhLJHluyHQpXLTQyXm0TpZSy_b8zcaMA2Vo4wRJSmXtY/exec",

    /* ---- Event settings ----
       Total number of attendance sessions (one per day here) and the minimum
       fraction required for a certificate. 75% of 4 days = 3 days. These are
       shown to the user; the authoritative calculation lives in the Sheet. */
    totalSessions: 4,
    requiredFraction: 0.75,

    /* ---- TOTP (must EXACTLY match the backend code.gs) ----
       stepSeconds: how long each rotating code stays valid.
       The actual SECRET is NOT stored here (it must stay private on the
       backend). The organizer panel asks for it at runtime instead. */
    totpStepSeconds: 90,
    totpDigits: 6,

    /* ---- Optional: campus geofence ----
       Set enabled:true and the campus coordinates to also require the user to
       be near the venue. Radius in meters. Off by default. */
    geofence: {
      enabled: false,
      lat: 4.5982846,
      lng: -74.0754854,
      radiusMeters: 400,
    },
  };
})();
