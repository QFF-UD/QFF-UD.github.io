/* ==========================================================================
   I18N — Internationalization
   Holds every translation string and applies them to [data-i18n] elements.
   Public API (window.QFF.i18n):
     - translations        the full dictionary
     - setLanguage(lang)    switch active language, persist and re-render
     - getLanguage()        current language ('en' | 'es')
     - t(key)               look up a single string in the active language
   A global setLanguage() alias is kept for the inline onclick handlers.
   ========================================================================== */

(function () {
  "use strict";

  window.QFF = window.QFF || {};

  var CONFIG = (window.QFF.config) || {};
  var LANG_KEY = (CONFIG.storageKeys && CONFIG.storageKeys.lang) || "lang";
  var DEFAULT_LANG = CONFIG.defaultLang || "en";

  var translations = {
    en: {
      "nav-home": "Home",
      "menu-event": "Event",
      "nav-about": "About Us",
      "nav-collaborators": "Sponsors & Collaborators",
      "nav-location": "Location",
      "nav-faq": "FAQ",

      "menu-program": "Program & Calls",
      "nav-program": "Academic Program",
      "nav-cfp": "Short Talks",

      "menu-people": "People",
      "nav-speakers": "Speakers & Mentors",
      "nav-organizers": "Organizing Committee",

      "btn-register-nav": "Register",

      "hero-node": "Bogota Node, Colombia",
      "hero-date": "October 27 - 30, 2026 | In-Person Mode",

      "hero-desc":
        "Academic and research gathering in quantum computing and information. Four days of keynote lectures, hands-on workshops with Qiskit SDK, short talk sessions, and an in-person meeting at Universidad Distrital.",

      "btn-register": "Register for Free",
      "btn-program": "View Academic Program",

      "cd-title": "Countdown to Event",
      "cd-subtitle": "Get ready for October 27, 2026",

      "cd-days": "Days",
      "cd-hours": "Hours",
      "cd-minutes": "Minutes",
      "cd-seconds": "Seconds",

      "spon-1": "Global Event Sponsor",
      "spon-2": "Cloud Partner",

      "about-title": "About the Festival & Scope",
      "about-subtitle":
        "Fostering education and research in quantum technologies in Colombia",
      "about-framework-head": "The Quantum Experience",
      "about-p1":
        "<strong>Qiskit Fall Fest 2026</strong> is part of the global movement powered by <strong>IBM Quantum</strong>. Selected as an official local node, our university becomes a vibrant hub where students, researchers, and tech enthusiasts dive deep into the foundations and real-world applications of quantum computing.",
      "about-p2":
        "Join us for four days of inspiring keynotes, interactive coding labs with Qiskit, and collaborative spaces designed to spark the next generation of quantum innovators in Colombia.",

      "impact-attendees": "Expected Attendees (+70)",
      "impact-days-unit": "Days",
      "impact-training": "Academic Training",
      "impact-challenge": "Research & Community",
      "impact-cert": "Official Certification",

      "program-title": "Academic Program",
      "program-subtitle":
        "Hover over any talk to check full details in the side panel",

      "day-1": "Tuesday, Oct 27",
      "day-2": "Wednesday, Oct 28",
      "day-3": "Thursday, Oct 29",
      "day-4": "Friday, Oct 30",

      "th-time": "Time",
      "th-activity": "Activity / Talk",
      "th-type": "Type",

      "act-reg": "Registration",
      "act-welcome": "Welcome",
      "act-pon1": "Keynote Lecture 1",
      "act-pon2": "Keynote Lecture 2",
      "act-pon3": "Keynote Lecture 3",
      "act-pon4": "Keynote Lecture 4",
      "act-pon5": "Keynote Lecture 5",
      "act-pon6": "Keynote Lecture 6",
      "act-talk1": "Short Talk 1",
      "act-talk2": "Short Talk 2",
      "act-talk3": "Short Talk 3",
      "act-talk4": "Short Talk 4",
      "act-talk5": "Short Talk 5",
      "act-talk6": "Short Talk 6",
      "act-talk7": "Short Talk 7",
      "act-lunch": "Lunch",
      "act-curso1": "Workshop 1",
      "act-curso2": "Workshop 2",
      "act-cyber": "Charla corta E.",
      "act-break": "Break",
      "act-paredon": "Paredón",
      "act-conv": "Panel Discussion",
      "act-clausura": "Closing & Awards",
      "act-integ": "Social & Networking",

      "tag-reg": "Registration",
      "tag-open": "Opening",
      "tag-short": "Short Talk",
      "tag-break": "Break",
      "tag-work": "Workshop",
      "tag-panel": "Panel",
      "tag-closing": "Closing",
      "tag-social": "Social",
      "tag-key": "Keynote",

      "loc-aud": "Main Auditorium",
      "loc-caf": "Cafeteria",
      "loc-lab": "Computer Laboratory",
      "loc-lobby": "Lobby",
      "loc-plaza": "Plaza / Auditorium",

      "side-title": "Activity Details",
      "side-hover-hint": "Hover over a talk",
      "side-role": "Speaker / Moderator",
      "desc-example": "Sample description of the selected activity.",

      "cfp-title": "Short Talks Session",
      "cfp-subtitle":
        "Scientific outreach space for students, semilleros, and early-career researchers",
      "cfp-desc":
        "We invite undergraduate, graduate students, and research group members to submit proposals for <strong>Short Talks (25 min)</strong> during the event sessions.",
      "cfp-t1": "Quantum Computing & Information",
      "cfp-t2": "Algorithms & Practical Development with Qiskit",
      "cfp-t3": "Computational Physics, Simulation & Quantum Cryptography",
      "cfp-box-head": "Submit Your Proposal",
      "cfp-box-sub":
        "Present your research project or work in progress to the community.",
      "cfp-btn": "Submission Form (Short Talk)",

      "speakers-title": "Speakers & Special Guests",
      "speakers-subtitle":
        "Researchers, professors, and specialists in quantum science",

      "org-title": "Organizing Committee",
      "org-subtitle": "Node Universidad Distrital Francisco José de Caldas",
      "role-lead": "Lead Organizer & Qiskit Advocate",
      "role-co": "Official Co-organizer",

      "sp-1-name": "Dr. Quantum Guest",
      "sp-1-role": "Quantum Information Researcher",
      "sp-1-desc":
        "Specialist in information theory and advanced quantum algorithms.",
      "sp-2-name": "Sponsor 1 Specialist",
      "sp-2-role": "Quantum Computing Specialist",
      "sp-2-desc":
        "Developer and maintainer of tools within the computing ecosystem.",

      "loc-title": "Event Location",
      "loc-subtitle":
        "Faculty of Mathematical and Natural Sciences – Universidad Distrital Francisco José de Caldas",
      "loc-uni": "Universidad Distrital Francisco José de Caldas, Bogotá",
      "loc-bus": "Near Plaza de Bolívar and TransMilenio stations.",
      "loc-btn": "Open in Google Maps",

      "faq-title": "Technical Requirements & FAQ",
      "faq-subtitle": "Key information for festival attendees",
      "faq-python-desc":
        "We recommend installing the basic environment for the workshops:",
      "faq-q1": "Is participation free?",
      "faq-a1": "Yes, 100% free with prior registration.",
      "faq-q2": "Is a certificate provided?",
      "faq-a2": "Yes, an official attendance certificate upon completion.",

      "contact-title": "Contact Us",
      "contact-name": "Full Name",
      "contact-email": "Email Address",
      "contact-subject": "Subject",
      "contact-message": "Message",
      "contact-btn": "Send Message",

      "footer-text":
        "&copy; 2026 Qiskit Fall Fest Node Universidad Distrital. All rights reserved.",
    },

    es: {
      "nav-home": "Inicio",
      "menu-event": "Evento",
      "nav-about": "Acerca de",
      "nav-collaborators": "Patrocinadores y Colaboradores",
      "nav-location": "Ubicación",
      "nav-faq": "Preguntas Frecuentes",

      "menu-program": "Programa y Convocatorias",
      "nav-program": "Programa Académico",
      "nav-cfp": "Charlas Cortas",

      "menu-people": "Personas",
      "nav-speakers": "Ponentes y Mentores",
      "nav-organizers": "Comité Organizador",

      "btn-register-nav": "Registrarse",

      "hero-node": "Nodo Bogotá, Colombia",
      "hero-date": "27 - 30 de Octubre, 2026 | Modalidad Presencial",
      "hero-desc":
        "Encuentro académico y de investigación en computación e información cuántica. Cuatro días de conferencias magistrales, talleres prácticos con Qiskit SDK y sesiones de charlas cortas en la Universidad Distrital.",

      "btn-register": "Regístrate Gratis",
      "btn-program": "Ver Programa Académico",

      "cd-title": "Cuenta Regresiva",
      "cd-subtitle": "Prepárate para el 27 de Octubre, 2026",

      "cd-days": "Días",
      "cd-hours": "Horas",
      "cd-minutes": "Minutos",
      "cd-seconds": "Segundos",

      "spon-1": "Patrocinador Global del Evento",
      "spon-2": "Socio Cloud",

      "about-title": "Sobre el Festival y Alcance",
      "about-subtitle":
        "Fomentando la educación e investigación en tecnologías cuánticas en Colombia",
      "about-framework-head": "La Experiencia Cuántica",
      "about-p1":
        "El <strong>Qiskit Fall Fest 2026</strong> forma parte del movimiento global impulsado por <strong>IBM Quantum</strong>. Seleccionados como sede oficial, nuestra universidad se convierte en un punto de encuentro donde estudiantes, investigadores y entusiastas de la tecnología exploran los fundamentos y aplicaciones reales de la computación cuántica.",
      "about-p2":
        "Te invitamos a vivir cuatro días de conferencias magistrales, talleres prácticos de programación con Qiskit y espacios de colaboración diseñados para inspirar a la próxima generación de innovadores cuánticos en Colombia.",

      "impact-attendees": "Asistentes Esperados (+70)",
      "impact-days-unit": "Días",
      "impact-training": "Entrenamiento Académico",
      "impact-challenge": "Investigación y Comunidad",
      "impact-cert": "Certificación Oficial",

      "program-title": "Programa Académico",
      "program-subtitle":
        "Pasa el cursor sobre cualquier charla para consultar los detalles completos en el panel lateral",

      "day-1": "Martes 27 Oct",
      "day-2": "Miércoles 28 Oct",
      "day-3": "Jueves 29 Oct",
      "day-4": "Viernes 30 Oct",

      "th-time": "Hora",
      "th-activity": "Actividad / Charla",
      "th-type": "Tipo",

      "act-reg": "Registro",
      "act-welcome": "Bienvenida",
      "act-pon1": "Ponencia 1",
      "act-pon2": "Ponencia 2",
      "act-pon3": "Ponencia 3",
      "act-pon4": "Ponencia 4",
      "act-pon5": "Ponencia 5",
      "act-pon6": "Ponencia 6",
      "act-talk1": "Charla corta 1",
      "act-talk2": "Charla corta 2",
      "act-talk3": "Charla corta 3",
      "act-talk4": "Charla corta 4",
      "act-talk5": "Charla corta 5",
      "act-talk6": "Charla corta 6",
      "act-talk7": "Charla corta 7",
      "act-lunch": "Almuerzo",
      "act-curso1": "Curso 1",
      "act-curso2": "Curso 2",
      "act-cyber": "Charla corta E.",
      "act-break": "Descanso",
      "act-paredon": "Paredón",
      "act-conv": "Conversatorio",
      "act-clausura": "Clausura - Premiación",
      "act-integ": "Integración",

      "tag-reg": "Registro",
      "tag-open": "Apertura",
      "tag-short": "Charla Corta",
      "tag-break": "Descanso",
      "tag-work": "Workshop",
      "tag-panel": "Panel",
      "tag-closing": "Clausura",
      "tag-social": "Social",
      "tag-key": "Keynote",

      "loc-aud": "Auditorio Principal",
      "loc-caf": "Cafetería",
      "loc-lab": "Laboratorio de Cómputo",
      "loc-lobby": "Lobby",
      "loc-plaza": "Plazoleta",

      "side-title": "Detalles de la Actividad",
      "side-hover-hint": "Pasa el cursor sobre una charla",
      "side-role": "Ponente / Moderador",
      "desc-example": "Descripción de ejemplo de la actividad seleccionada.",

      "cfp-title": "Sesión de Charlas Cortas",
      "cfp-subtitle":
        "Espacio de divulgación científica para estudiantes, semilleros e investigadores",
      "cfp-desc":
        "Invitamos a estudiantes de pregrado, posgrado y miembros de grupos de investigación a enviar propuestas para <strong>Charlas Cortas (25 min)</strong> durante las sesiones del evento.",
      "cfp-t1": "Computación e Información Cuántica",
      "cfp-t2": "Algoritmos y Desarrollo Práctico con Qiskit",
      "cfp-t3": "Física Computacional, Simulación y Criptografía Cuántica",
      "cfp-box-head": "Envía tu Propuesta",
      "cfp-box-sub": "Presenta tu proyecto de investigación a la comunidad.",
      "cfp-btn": "Formulario de Envío (Charla Corta)",

      "speakers-title": "Ponentes e Invitados Especiales",
      "speakers-subtitle":
        "Investigadores, profesores y especialistas en ciencia cuántica",

      "org-title": "Comité Organizador",
      "org-subtitle": "Nodo Universidad Distrital Francisco José de Caldas",
      "role-lead": "Organizador Principal y Qiskit Advocate",
      "role-co": "Co-organizador Oficial",

      "sp-1-name": "Dr. Invitado Quantum",
      "sp-1-role": "Investigador en Información Cuántica",
      "sp-1-desc":
        "Especialista en teoría de información y algoritmos cuánticos avanzados.",
      "sp-2-name": "Especialista Sponsor 1",
      "sp-2-role": "Especialista en Computación Cuántica",
      "sp-2-desc":
        "Desarrollador y mantenedor de herramientas en el ecosistema de cómputo.",

      "loc-title": "Ubicación del Evento",
      "loc-subtitle":
        "Facultad de Ciencias Matemáticas y Naturales – Universidad Distrital Francisco José de Caldas",
      "loc-uni": "Universidad Distrital Francisco José de Caldas, Bogotá",
      "loc-bus": "Cerca a la Plaza de Bolívar y estaciones de TransMilenio.",
      "loc-btn": "Abrir en Google Maps",

      "faq-title": "Requisitos Técnicos y FAQ",
      "faq-subtitle": "Información clave para los asistentes al festival",
      "faq-python-desc":
        "Recomendamos instalar el entorno básico para los talleres:",
      "faq-q1": "¿Es gratuita la participación?",
      "faq-a1": "Sí, 100% gratuito con registro previo.",
      "faq-q2": "¿Se entrega certificado?",
      "faq-a2": "Sí, certificado de asistencia oficial al finalizar el evento.",

      "contact-title": "Contáctanos",
      "contact-name": "Nombre Completo",
      "contact-email": "Correo Electrónico",
      "contact-subject": "Asunto",
      "contact-message": "Mensaje",
      "contact-btn": "Enviar Mensaje",

      "footer-text":
        "&copy; 2026 Qiskit Fall Fest Node Universidad Distrital. Todos los derechos reservados.",
    },
  };

  /* Keys whose values contain HTML markup and must be rendered as HTML.
     Everything else is rendered as plain text (safer and faster). */
  var HTML_KEYS = {
    "about-p1": true,
    "about-p2": true,
    "cfp-desc": true,
    "footer-text": true,
  };

  var currentLang = DEFAULT_LANG;

  function normalizeLang(lang) {
    return translations[lang] ? lang : DEFAULT_LANG;
  }

  function t(key, lang) {
    var dict = translations[normalizeLang(lang || currentLang)];
    return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
  }

  function getLanguage() {
    return currentLang;
  }

  function setLanguage(lang) {
    lang = normalizeLang(lang);
    currentLang = lang;

    var dict = translations[lang];

    /* Toggle the active state on the language buttons, if present. */
    var btnEn = document.getElementById("btn-en");
    var btnEs = document.getElementById("btn-es");
    if (btnEn) btnEn.classList.toggle("active", lang === "en");
    if (btnEs) btnEs.classList.toggle("active", lang === "es");

    /* Reflect the language on the document for accessibility / SEO. */
    document.documentElement.lang = lang;

    /* Apply every translatable string. */
    var nodes = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      if (!Object.prototype.hasOwnProperty.call(dict, key)) continue;

      if (HTML_KEYS[key]) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }

    /* Persist the choice. */
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {
      /* Storage may be unavailable (private mode); ignore gracefully. */
    }
  }

  window.QFF.i18n = {
    translations: translations,
    setLanguage: setLanguage,
    getLanguage: getLanguage,
    t: t,
  };

  /* Backwards-compatible global for inline onclick="setLanguage('es')". */
  window.setLanguage = setLanguage;
})();
