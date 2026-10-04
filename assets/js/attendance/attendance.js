/* ==========================================================================
   ATTENDANCE APP (student side)
   Flow:
     1. User signs in with Google (Google Identity Services renders the button).
     2. We decode the ID token to greet them (display only; the backend
        re-verifies the token for real).
     3. User enters the rotating code shown on the venue screen.
     4. We POST { credential, code, geo? } to the Apps Script backend, which
        verifies the Google token AND the TOTP code, then records attendance.
     5. We show their progress (sessions attended / required for certificate).

   Depends on: attendance-config.js, i18n (optional for labels).
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};
  var CFG = window.QFF.attendanceConfig || {};

  var state = { credential: null, profile: null };

  /* ---- Small helpers ---- */
  function $(id) {
    return document.getElementById(id);
  }
  function show(el) {
    if (el) el.hidden = false;
  }
  function hide(el) {
    if (el) el.hidden = true;
  }
  function setMsg(text, kind) {
    var box = $("att-message");
    if (!box) return;
    box.textContent = text;
    box.className = "att-message att-" + (kind || "info");
    show(box);
  }

  /* Decode a JWT payload (display only — NOT trusted for auth). */
  function decodeJwt(token) {
    try {
      var payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(decodeURIComponent(escape(atob(payload))));
    } catch (e) {
      return {};
    }
  }

  /* ---- Google Sign-In callback ---- */
  function onCredential(response) {
    state.credential = response.credential;
    state.profile = decodeJwt(response.credential);

    var name = state.profile.name || state.profile.email || "";
    var greet = $("att-greeting");
    if (greet) greet.textContent = name;
    var avatar = $("att-avatar");
    if (avatar && state.profile.picture) avatar.src = state.profile.picture;

    prefillIdentity(name);

    hide($("att-signin"));
    show($("att-panel"));
    setMsg("", "info");
    hide($("att-message"));

    loadProgress();
  }

  /* ---- Identity fields (name + document) ----
     Google gives us name/email, but not the ID document, so we ask for it.
     We remember the values per Google account in localStorage so the user
     only types them once. */
  function identityKey() {
    var email = (state.profile && state.profile.email) || "anon";
    return "qff_identity_" + email;
  }

  function prefillIdentity(googleName) {
    var saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(identityKey()) || "{}");
    } catch (e) {
      saved = {};
    }
    var nameEl = $("att-name");
    var typeEl = $("att-doctype");
    var numEl = $("att-docnum");
    if (nameEl) nameEl.value = saved.name || googleName || "";
    if (typeEl && saved.docType) typeEl.value = saved.docType;
    if (numEl) numEl.value = saved.docNumber || "";
  }

  function readIdentity() {
    var name = ($("att-name") && $("att-name").value || "").trim();
    var docType = ($("att-doctype") && $("att-doctype").value) || "";
    var docNumber = ($("att-docnum") && $("att-docnum").value || "").trim();
    return { name: name, docType: docType, docNumber: docNumber };
  }

  function saveIdentity(id) {
    try {
      localStorage.setItem(identityKey(), JSON.stringify(id));
    } catch (e) {
      /* ignore */
    }
  }

  /* ---- Optional geolocation ---- */
  function getGeo() {
    return new Promise(function (resolve) {
      if (!CFG.geofence || !CFG.geofence.enabled || !navigator.geolocation) {
        resolve(null);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        function () {
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    });
  }

  /* ---- Backend calls ----
     Apps Script web apps accept simple POSTs. We use text/plain to avoid a
     CORS preflight (Apps Script returns the data as JSON in the body). */
  function callBackend(action, extra) {
    var body = Object.assign(
      { action: action, credential: state.credential },
      extra || {}
    );
    return fetch(CFG.backendUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json();
    });
  }

  function renderProgress(data) {
    var attended = data.attended || 0;
    var total = data.total || CFG.totalSessions || 4;
    var required = Math.ceil((CFG.requiredFraction || 0.75) * total);

    var countEl = $("att-count");
    if (countEl) countEl.textContent = attended + " / " + total;

    var bar = $("att-progress-bar");
    if (bar) bar.style.width = Math.min(100, (attended / total) * 100) + "%";

    var status = $("att-status");
    if (status) {
      if (attended >= required) {
        status.textContent =
          "\u2713 You have met the " +
          Math.round((CFG.requiredFraction || 0.75) * 100) +
          "% requirement for the certificate.";
        status.className = "att-status att-ok";
      } else {
        status.textContent =
          "You need " +
          required +
          " of " +
          total +
          " sessions for the certificate (" +
          (required - attended) +
          " to go).";
        status.className = "att-status att-pending";
      }
    }
  }

  function loadProgress() {
    callBackend("status")
      .then(function (data) {
        if (data && data.ok) renderProgress(data);
      })
      .catch(function () {
        /* Non-fatal: progress just won't display. */
      });
  }

  function submitCode() {
    var input = $("att-code");
    var code = (input && input.value ? input.value : "").trim();

    // Validate identity fields first.
    var id = readIdentity();
    if (!id.name) {
      setMsg("Escribe tu nombre completo.", "error");
      return;
    }
    if (!id.docNumber || !/^[0-9A-Za-z-]{4,20}$/.test(id.docNumber)) {
      setMsg("Escribe un número de documento válido.", "error");
      return;
    }
    if (!/^\d{4,8}$/.test(code)) {
      setMsg("Escribe el código numérico que aparece en la pantalla del evento.", "error");
      return;
    }

    saveIdentity(id);

    var btn = $("att-submit");
    if (btn) btn.disabled = true;
    setMsg("Registrando\u2026", "info");

    getGeo().then(function (geo) {
      callBackend("checkin", {
        code: code,
        geo: geo,
        name: id.name,
        docType: id.docType,
        docNumber: id.docNumber,
      })
        .then(function (data) {
          if (btn) btn.disabled = false;
          if (!data || !data.ok) {
            setMsg(
              (data && data.message) ||
                "No se pudo registrar. Verifica que el código sea el actual.",
              "error"
            );
            return;
          }
          if (data.duplicate) {
            setMsg("Ya registraste tu asistencia de hoy.", "info");
          } else {
            setMsg("\u00A1Asistencia registrada! Gracias.", "ok");
          }
          if (input) input.value = "";
          renderProgress(data);
        })
        .catch(function () {
          if (btn) btn.disabled = false;
          setMsg("Error de red. Inténtalo de nuevo.", "error");
        });
    });
  }

  function signOut() {
    state.credential = null;
    state.profile = null;
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
    show($("att-signin"));
    hide($("att-panel"));
  }

  /* ---- Init: render the Google button once GIS has loaded ---- */
  function initGoogle() {
    if (!window.google || !google.accounts || !google.accounts.id) {
      return false;
    }
    if (
      !CFG.googleClientId ||
      CFG.googleClientId.indexOf("TODO") === 0
    ) {
      setMsg(
        "Attendance is not configured yet (missing Google Client ID).",
        "error"
      );
      return true;
    }
    google.accounts.id.initialize({
      client_id: CFG.googleClientId,
      callback: onCredential,
    });
    var mount = $("att-google-btn");
    if (mount) {
      google.accounts.id.renderButton(mount, {
        theme: "filled_blue",
        size: "large",
        text: "signin_with",
        shape: "pill",
      });
    }
    return true;
  }

  function init() {
    var submit = $("att-submit");
    if (submit) submit.addEventListener("click", submitCode);
    var code = $("att-code");
    if (code) {
      code.addEventListener("keydown", function (e) {
        if (e.key === "Enter") submitCode();
      });
    }
    var out = $("att-signout");
    if (out) out.addEventListener("click", signOut);

    // GIS script may still be loading; retry briefly.
    if (!initGoogle()) {
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        if (initGoogle() || tries > 40) clearInterval(timer);
      }, 150);
    }
  }

  window.QFF.attendance = { init: init };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
