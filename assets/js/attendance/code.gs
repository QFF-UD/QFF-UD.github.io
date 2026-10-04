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
      return json(handleCheckin(profile, body.code, body.geo));
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

/* ---- TOTP (must mirror assets/js/attendance/totp.js) ---- */
function totpAt(secret, counter) {
  var key = Utilities.newBlob(secret).getBytes();
  var msg = [];
  var c = counter;
  for (var i = 7; i >= 0; i--) {
    msg[i] = c & 0xff;
    c = Math.floor(c / 256);
  }
  var hmac = Utilities.computeHmacSha1Signature(msg, key);
  // bytes are signed in Apps Script; mask to unsigned
  for (var j = 0; j < hmac.length; j++) hmac[j] = hmac[j] & 0xff;
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

/* ---- Record a check-in ---- */
function handleCheckin(profile, code, geo) {
  if (!codeIsValid(code)) {
    return { ok: false, message: "Code expired or incorrect. Try the current code." };
  }

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance")
    || SpreadsheetApp.getActiveSpreadsheet().insertSheet("Attendance");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Timestamp", "Email", "Name", "Day", "Lat", "Lng"]);
  }

  var tz = Session.getScriptTimeZone();
  var today = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd");

  // Prevent duplicate for the same email + day.
  var values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    if (values[i][1] === profile.email && values[i][3] === today) {
      var status0 = buildStatus(profile.email);
      status0.duplicate = true;
      return status0;
    }
  }

  sheet.appendRow([
    new Date(),
    profile.email,
    profile.name || "",
    today,
    geo ? geo.lat : "",
    geo ? geo.lng : "",
  ]);

  return buildStatus(profile.email);
}

/* ---- Build the status (distinct days attended) ---- */
function buildStatus(email) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Attendance");
  var days = {};
  if (sheet && sheet.getLastRow() > 1) {
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (values[i][1] === email) days[values[i][3]] = true;
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
