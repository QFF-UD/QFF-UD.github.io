/**
 * ============================================================================
 * QFF ATTENDANCE — Google Apps Script backend
 * ============================================================================
 * Deploy this as a Web App (Deploy > New deployment > Web app, "Anyone").
 * It receives POSTs from asistencia.html, verifies the Google ID token AND
 * the rotating TOTP code, then records attendance in the bound Google Sheet.
 *
 * The Sheet gets one row per (email, session). A session is the TOTP time-step,
 * but we also stamp the day so you can count "days attended" easily.
 *
 * SET THESE in Project Settings > Script Properties (NOT in code):
 *   TOTP_SECRET      the shared secret (same string typed in the panel)
 *   GOOGLE_CLIENT_ID your OAuth client id (to validate the token audience)
 *
 * Config constants below must match assets/js/attendance/attendance-config.js
 * ============================================================================
 */

var STEP_SECONDS = 90;   // must match attendance-config.js totpStepSeconds
var TOTP_DIGITS = 6;     // must match totpDigits
var ALLOWED_SKEW = 1;    // accept the current step +/- this many steps
var TOTAL_SESSIONS = 4;  // event days (for the status response)
var REQUIRED_FRACTION = 0.75;

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var action = body.action;

    var profile = verifyGoogleToken(body.credential);
    if (!profile) {
      return json({ ok: false, message: "Invalid session. Sign in again." });
    }

    if (action === "status") {
      return json(buildStatus(profile.email));
    }

    if (action === "checkin") {
      return json(
        handleCheckin(profile, body.code, body.geo, {
          name: body.name,
          docType: body.docType,
          docNumber: body.docNumber,
        })
      );
    }

    return json({ ok: false, message: "Unknown action." });
  } catch (err) {
    return json({ ok: false, message: "Server error: " + err });
  }
}

/* ---- Verify the Google ID token via Google's tokeninfo endpoint ---- */
function verifyGoogleToken(credential) {
  if (!credential) return null;
  var clientId = PropertiesService.getScriptProperties().getProperty(
    "GOOGLE_CLIENT_ID"
  );
  var resp = UrlFetchApp.fetch(
    "https://oauth2.googleapis.com/tokeninfo?id_token=" +
      encodeURIComponent(credential),
    { muteHttpExceptions: true }
  );
  if (resp.getResponseCode() !== 200) return null;
  var data = JSON.parse(resp.getContentText());
  // Audience must match our client id; token must be from Google.
  if (clientId && data.aud !== clientId) return null;
  if (data.iss !== "accounts.google.com" && data.iss !== "https://accounts.google.com") {
    return null;
  }
  return { email: data.email, name: data.name, picture: data.picture };
}

/* ---- TOTP (must mirror assets/js/attendance/totp.js) ----
   Self-contained HMAC-SHA1 so it works on every Apps Script runtime
   (Utilities.computeHmacSha1Signature is unavailable in some V8 setups). */

/* --- Pure SHA-1: takes an array of bytes, returns an array of 20 bytes. --- */
function sha1Bytes(bytes) {
  function rotl(n, s) { return ((n << s) | (n >>> (32 - s))) & 0xffffffff; }

  var ml = bytes.length * 8;
  var msg = bytes.slice();
  msg.push(0x80);
  while (msg.length % 64 !== 56) msg.push(0);
  // append 64-bit big-endian length (high 32 bits are 0 for our sizes)
  for (var i = 7; i >= 0; i--) {
    msg.push(i < 4 ? (ml >>> (i * 8)) & 0xff : 0);
  }

  var h0 = 0x67452301, h1 = 0xEFCDAB89, h2 = 0x98BADCFE,
      h3 = 0x10325476, h4 = 0xC3D2E1F0;

  for (var off = 0; off < msg.length; off += 64) {
    var w = new Array(80);
    for (var t = 0; t < 16; t++) {
      w[t] =
        ((msg[off + t * 4] & 0xff) << 24) |
        ((msg[off + t * 4 + 1] & 0xff) << 16) |
        ((msg[off + t * 4 + 2] & 0xff) << 8) |
        (msg[off + t * 4 + 3] & 0xff);
    }
    for (var t2 = 16; t2 < 80; t2++) {
      w[t2] = rotl(w[t2 - 3] ^ w[t2 - 8] ^ w[t2 - 14] ^ w[t2 - 16], 1);
    }

    var a = h0, b = h1, c = h2, d = h3, e = h4;
    for (var t3 = 0; t3 < 80; t3++) {
      var f, k;
      if (t3 < 20) { f = (b & c) | (~b & d); k = 0x5A827999; }
      else if (t3 < 40) { f = b ^ c ^ d; k = 0x6ED9EBA1; }
      else if (t3 < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8F1BBCDC; }
      else { f = b ^ c ^ d; k = 0xCA62C1D6; }
      var tmp = (rotl(a, 5) + f + e + k + w[t3]) & 0xffffffff;
      e = d; d = c; c = rotl(b, 30); b = a; a = tmp;
    }
    h0 = (h0 + a) & 0xffffffff;
    h1 = (h1 + b) & 0xffffffff;
    h2 = (h2 + c) & 0xffffffff;
    h3 = (h3 + d) & 0xffffffff;
    h4 = (h4 + e) & 0xffffffff;
  }

  var out = [];
  [h0, h1, h2, h3, h4].forEach(function (h) {
    out.push((h >>> 24) & 0xff, (h >>> 16) & 0xff, (h >>> 8) & 0xff, h & 0xff);
  });
  return out;
}

/* --- HMAC-SHA1(keyBytes, msgBytes) -> array of 20 bytes --- */
function hmacSha1Bytes(keyBytes, msgBytes) {
  var block = 64;
  var key = keyBytes.slice();
  if (key.length > block) key = sha1Bytes(key);
  while (key.length < block) key.push(0);

  var oKey = [], iKey = [];
  for (var i = 0; i < block; i++) {
    oKey.push(key[i] ^ 0x5c);
    iKey.push(key[i] ^ 0x36);
  }
  var inner = sha1Bytes(iKey.concat(msgBytes));
  return sha1Bytes(oKey.concat(inner));
}

function strBytes(str) {
  var b = [];
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i);
    if (c < 128) {
      b.push(c);
    } else if (c < 2048) {
      b.push(192 | (c >> 6), 128 | (c & 63));
    } else {
      b.push(224 | (c >> 12), 128 | ((c >> 6) & 63), 128 | (c & 63));
    }
  }
  return b;
}

function totpAt(secret, counter) {
  var msg = [];
  var c = counter;
  for (var i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  var hmac = hmacSha1Bytes(strBytes(secret), msg);
  var offset = hmac[hmac.length - 1] & 0x0f;
  var bin =
    ((hmac[offset] & 0x7f) * 0x1000000) +
    ((hmac[offset + 1] & 0xff) * 0x10000) +
    ((hmac[offset + 2] & 0xff) * 0x100) +
    (hmac[offset + 3] & 0xff);
  var mod = Math.pow(10, TOTP_DIGITS);
  var code = String(bin % mod);
  while (code.length < TOTP_DIGITS) code = "0" + code;
  return code;
}

function codeIsValid(code) {
  var secret = PropertiesService.getScriptProperties().getProperty(
    "TOTP_SECRET"
  );
  if (!secret) return false;
  var current = Math.floor(Date.now() / 1000 / STEP_SECONDS);
  for (var d = -ALLOWED_SKEW; d <= ALLOWED_SKEW; d++) {
    if (totpAt(secret, current + d) === String(code)) return true;
  }
  return false;
}

/* ---- Resolve the target spreadsheet reliably ----
   In a deployed web app, getActiveSpreadsheet() can be null, so prefer an
   explicit SHEET_ID script property. Set SHEET_ID to the id in your Sheet URL:
   https://docs.google.com/spreadsheets/d/THIS_IS_THE_ID/edit  */
function getSpreadsheet() {
  var id = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (id) return SpreadsheetApp.openById(id);
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getAttendanceSheet() {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName("Attendance");
  if (!sheet) sheet = ss.insertSheet("Attendance");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Email",
      "Name",
      "DocType",
      "DocNumber",
      "Day",
      "Lat",
      "Lng",
    ]);
  }
  return sheet;
}

/* ---- Record a check-in ----
   Columns: Timestamp(0) Email(1) Name(2) DocType(3) DocNumber(4) Day(5)
            Lat(6) Lng(7) */
function handleCheckin(profile, code, geo, fields) {
  if (!codeIsValid(code)) {
    return { ok: false, message: "Code expired or incorrect. Try the current code." };
  }

  fields = fields || {};
  var sheet = getAttendanceSheet();

  var tz = Session.getScriptTimeZone();
  var today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  // Prevent duplicate for the same email + day (Day is column index 5).
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === profile.email && values[i][5] === today) {
      var status0 = buildStatus(profile.email);
      status0.duplicate = true;
      return status0;
    }
  }

  sheet.appendRow([
    new Date(),
    profile.email,
    fields.name || profile.name || "",
    fields.docType || "",
    fields.docNumber ? "'" + fields.docNumber : "", // leading quote keeps long IDs as text
    today,
    geo ? geo.lat : "",
    geo ? geo.lng : "",
  ]);

  return buildStatus(profile.email);
}

/* ---- Build the status (distinct days attended) ----
   Day is column index 5. */
function buildStatus(email) {
  var sheet = getAttendanceSheet();
  var days = {};
  if (sheet && sheet.getLastRow() > 1) {
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][1] === email) days[values[i][5]] = true;
    }
  }
  var attended = Object.keys(days).length;
  return {
    ok: true,
    attended: attended,
    total: TOTAL_SESSIONS,
    required: Math.ceil(REQUIRED_FRACTION * TOTAL_SESSIONS),
    qualifies: attended >= Math.ceil(REQUIRED_FRACTION * TOTAL_SESSIONS),
  };
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/* ---- Health check: open the /exec URL in a browser to confirm it's alive ---- */
function doGet() {
  return json({ ok: true, service: "QFF attendance", time: new Date() });
}

/* ---- Diagnostic: run this directly in the Apps Script editor (Run > testWrite)
   to confirm the script can write to your sheet. It appends a test row with a
   fake email; delete that row afterwards. If it throws, the error tells you
   exactly what's wrong (permissions, wrong sheet, etc.). ---- */
function testWrite() {
  var sheet = getAttendanceSheet();
  sheet.appendRow([
    new Date(),
    "test@example.com",
    "TEST ROW",
    "CC",
    "'0000000000",
    "DIAGNOSTIC",
    "",
    "",
  ]);
  Logger.log("Wrote a test row to: " + getSpreadsheet().getName());
}
