/* ==========================================================================
   TOTP — Time-based One-Time Code (browser side)
   Generates a short, rotating numeric code from a shared secret + the current
   time, using HMAC-SHA1 over a time counter (RFC 6238 style). The organizer
   panel shows this code; the Google Apps Script backend recomputes the SAME
   code to validate a check-in, so a forwarded code expires almost immediately.

   IMPORTANT: the SECRET and STEP here must EXACTLY match the ones in the
   Apps Script backend (code.gs). Uses the Web Crypto API (async).

   Public API: window.QFF.totp.generate(secret, stepSeconds, digits) -> Promise<string>
               window.QFF.totp.secondsLeft(stepSeconds) -> number
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  function strToBytes(str) {
    return new TextEncoder().encode(str);
  }

  /* Counter = floor(epochSeconds / step), encoded as 8-byte big-endian. */
  function counterBytes(counter) {
    var buf = new ArrayBuffer(8);
    var view = new DataView(buf);
    // JS bitwise is 32-bit; split into high/low 32 bits.
    view.setUint32(0, Math.floor(counter / 0x100000000));
    view.setUint32(4, counter >>> 0);
    return new Uint8Array(buf);
  }

  async function hmacSha1(keyBytes, msgBytes) {
    var key = await crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: "SHA-1" },
      false,
      ["sign"]
    );
    var sig = await crypto.subtle.sign("HMAC", key, msgBytes);
    return new Uint8Array(sig);
  }

  /* Dynamic truncation (RFC 4226) -> `digits`-length numeric string. */
  function truncate(hmac, digits) {
    var offset = hmac[hmac.length - 1] & 0x0f;
    var bin =
      ((hmac[offset] & 0x7f) << 24) |
      ((hmac[offset + 1] & 0xff) << 16) |
      ((hmac[offset + 2] & 0xff) << 8) |
      (hmac[offset + 3] & 0xff);
    var mod = Math.pow(10, digits);
    return String(bin % mod).padStart(digits, "0");
  }

  async function generate(secret, stepSeconds, digits) {
    stepSeconds = stepSeconds || 90;
    digits = digits || 6;
    var counter = Math.floor(Date.now() / 1000 / stepSeconds);
    var hmac = await hmacSha1(strToBytes(secret), counterBytes(counter));
    return truncate(hmac, digits);
  }

  function secondsLeft(stepSeconds) {
    stepSeconds = stepSeconds || 90;
    var now = Math.floor(Date.now() / 1000);
    return stepSeconds - (now % stepSeconds);
  }

  window.QFF.totp = { generate: generate, secondsLeft: secondsLeft };
})();
