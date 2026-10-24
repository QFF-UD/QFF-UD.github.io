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
      "nav-collaborators": "Collaborators",
      "nav-location": "Location",
      "nav-faq": "FAQ",

      "menu-program": "Program & Calls",
      "nav-program": "Academic Program",
      "nav-cfp": "Short Talks",
      "nav-attendance": "Attendance",

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

      "bloch-caption": "Qubit state on the Bloch sphere",
      "circuit-label": "Quantum Circuit",

      "cd-title": "Countdown to Event",
      "cd-subtitle": "Get ready for October 27, 2026",

      "cd-days": "Days",
      "cd-hours": "Hours",
      "cd-minutes": "Minutes",
      "cd-seconds": "Seconds",

      "collab-heading": "Collaborators",

      "about-title": "About the Festival & Scope",
      "about-subtitle":
        "Fostering education and research in quantum technologies in Colombia",
      "about-framework-head": "The Quantum Experience",
      "about-p1":
        "<strong>Qiskit Fall Fest 2026</strong> is part of the global movement powered by <strong>IBM Quantum</strong>. Selected as an official local node, our university becomes a vibrant hub where students, researchers, and tech enthusiasts dive deep into the foundations and real-world applications of quantum computing.",
      "about-p2":
        "Join us for four days of inspiring keynotes, interactive coding labs with Qiskit, and collaborative spaces designed to spark the next generation of quantum innovators in Colombia.",

      "impact-attendees": "Expected Attendees (+40)",
      "impact-days-unit": "Days",
      "impact-training": "Academic Training",
      "impact-challenge": "Research & Community",
      "impact-cert": "Official Certification",

      "cert-title": "Attendance Certificate",
      "cert-subtitle":
        "Every participant who completes the event receives an official certificate",
      "cert-desc":
        "At the end of Qiskit Fall Fest 2026 we issue an official digital certificate of participation, endorsed by the organizing node at Universidad Distrital Francisco José de Caldas.",
      "cert-feat-1": "Officially endorsed by the organizing node.",
      "cert-feat-2": "Includes the attendee's full name and the event dates.",
      "cert-feat-3": "Delivered digitally after completing the event.",
      "cert-feat-4": "Also endorsed by IBM Quantum.",
      "cert-caption": "Sample certificate — the final design may vary.",
      "nav-certificate": "Certificate",

      "att-banner-title": "Register your attendance",
      "att-banner-desc":
        "Sign in and enter the code shown at each session. Attend 75% or more to receive your certificate.",
      "att-banner-btn": "Go to attendance",

      "program-title": "Academic Program",
      "program-subtitle":
        "Hover over any talk to check full details in the side panel",
      "program-notice":
        "This schedule is subject to change and will be confirmed over the coming days. To stay up to date with talks and speakers, please register for the event and join the WhatsApp channel included in the registration form.",

      "day-1": "Tuesday, Oct 27",
      "day-2": "Wednesday, Oct 28",
      "day-3": "Thursday, Oct 29",
      "day-4": "Friday, Oct 30",

      "th-time": "Time",
      "th-activity": "Activity / Talk",
      "th-type": "Type",

      "act-welcome": "Welcome",
      "act-lunch": "Lunch",
      "act-break": "Break",

      "act-d1-nicolas": "Getting Started with Qiskit: your first program on a real quantum computer",
      "act-d1-daniel": "Qiskit 101 — Daniel Sierra (IBM)",
      "act-d1-john": "From the physical system to the qubit: physical and mathematical foundations of quantum computing — 1",

      "act-d2-camilo": "From quantum phenomena to quantum information",
      "act-d2-enrique": "Quantum Algorithms for Quantum Chemistry",
      "act-d2-john": "From the physical system to the qubit: physical and mathematical foundations of quantum computing — 2",
      "act-d2-mateo": "Quantum brachistochrone: minimum transition time between qubit states",

      "act-d3-claudia": "Non-local quantum games to coordinate financial decisions",
      "act-d3-federico": "Benchmarking quantum computers via genuine multipartite nonlocality",
      "act-d3-juan": "What if knowing more means knowing less? An exploration of the uncertainty principle in quantum mechanics",
      "act-d3-julian": "Ground-state energy of the spin-1/2 Heisenberg antiferromagnet on the Kagome lattice via VQE without Hamiltonian calibration",

      "act-d4-esteban1": "Keynote",
      "act-d4-esteban2": "Cybercolombia",
      "act-d4-jaime": "QDSV: From the problem to quantum execution with Bridge and QRUBA",
      "act-d4-diego": "Quantum error correction: an introduction to topological codes and their challenges",
      "act-d4-samuel": "Quantum Simulation of Neutrino Flavor Oscillations within Few-Qubit Systems",
      "act-d4-clausura": "Closing — Awards & Certificates",

      "tag-open": "Opening",
      "tag-short": "Short Talk",
      "tag-break": "Break",
      "tag-work": "Workshop",
      "tag-closing": "Closing",
      "tag-key": "Keynote",
      "tag-course": "Course",

      "loc-azul": "Blue Auditorium",
      "loc-sistemas": "Computer Labs",
      "loc-206": "Computer Lab 206",
      "loc-205": "Computer Lab 205",
      "loc-na": "—",

      "side-title": "Activity Details",
      "side-hover-hint": "Hover over a talk",
      "side-role": "Speaker / Moderator",
      "desc-example": "Sample description of the selected activity.",

      "desc-welcome": "Opening of Qiskit Fall Fest 2026 by the QFF team.",
      "desc-lunch": "Lunch break.",
      "desc-break": "Short break.",
      "desc-d1-nicolas": "Getting Started with Qiskit: your first program on a real quantum computer.",
      "desc-d1-daniel": "Qiskit 101 hands-on session led by Daniel Sierra (IBM).",
      "desc-d1-john": "From the physical system to the qubit: physical and mathematical foundations of quantum computing — Part 1.",
      "desc-d2-camilo": "From quantum phenomena to quantum information.",
      "desc-d2-enrique": "Quantum Algorithms for Quantum Chemistry.",
      "desc-d2-john": "From the physical system to the qubit: physical and mathematical foundations of quantum computing — Part 2.",
      "desc-d2-mateo": "Quantum brachistochrone: minimum transition time between qubit states.",
      "desc-d3-claudia": "Non-local quantum games to coordinate financial decisions.",
      "desc-d3-federico": "Benchmarking quantum computers via genuine multipartite nonlocality.",
      "desc-d3-juan": "What if knowing more means knowing less? An exploration of the uncertainty principle in quantum mechanics.",
      "desc-d3-julian": "Ground-state energy of the spin-1/2 Heisenberg antiferromagnet on the Kagome lattice via VQE without Hamiltonian calibration.",
      "desc-d4-esteban1": "Keynote by Esteban Hernández.",
      "desc-d4-esteban2": "Cybercolombia session with Esteban Hernández.",
      "desc-d4-jaime": "QDSV: From the problem to quantum execution with Bridge and QRUBA.",
      "desc-d4-diego": "Quantum error correction: an introduction to topological codes and their challenges.",
      "desc-d4-samuel": "Quantum Simulation of Neutrino Flavor Oscillations within Few-Qubit Systems.",
      "desc-d4-clausura": "Closing ceremony, short talk awards and certificate delivery.",

      "cfp-title": "Short Talks Session",
      "cfp-subtitle":
        "Scientific outreach space for students, semilleros, and early-career researchers",
      "cfp-desc":
        "We invite undergraduate, graduate students, and research group members to submit proposals for <strong>Short Talks (25 min)</strong> during the event sessions.",
      "cfp-t1": "Quantum Computing & Information",
      "cfp-t2": "Algorithms & Practical Development with Qiskit",
      "cfp-t3": "Computational Physics, Simulation & Quantum Cryptography",
      "cfp-award":
        "A winner's certificate will be awarded to the best short talk, also endorsed by IBM Quantum.",
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
      "nav-collaborators": "Colaboradores",
      "nav-location": "Ubicación",
      "nav-faq": "Preguntas Frecuentes",

      "menu-program": "Programa y Convocatorias",
      "nav-program": "Programa Académico",
      "nav-cfp": "Charlas Cortas",
      "nav-attendance": "Asistencia",

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

      "bloch-caption": "Estado del qubit en la esfera de Bloch",
      "circuit-label": "Circuito Cuántico",

      "cd-title": "Cuenta Regresiva",
      "cd-subtitle": "Prepárate para el 27 de Octubre, 2026",

      "cd-days": "Días",
      "cd-hours": "Horas",
      "cd-minutes": "Minutos",
      "cd-seconds": "Segundos",

      "collab-heading": "Colaboradores",

      "about-title": "Sobre el Festival y Alcance",
      "about-subtitle":
        "Fomentando la educación e investigación en tecnologías cuánticas en Colombia",
      "about-framework-head": "La Experiencia Cuántica",
      "about-p1":
        "El <strong>Qiskit Fall Fest 2026</strong> forma parte del movimiento global impulsado por <strong>IBM Quantum</strong>. Seleccionados como sede oficial, nuestra universidad se convierte en un punto de encuentro donde estudiantes, investigadores y entusiastas de la tecnología exploran los fundamentos y aplicaciones reales de la computación cuántica.",
      "about-p2":
        "Te invitamos a vivir cuatro días de conferencias magistrales, talleres prácticos de programación con Qiskit y espacios de colaboración diseñados para inspirar a la próxima generación de innovadores cuánticos en Colombia.",

      "impact-attendees": "Asistentes Esperados (+40)",
      "impact-days-unit": "Días",
      "impact-training": "Entrenamiento Académico",
      "impact-challenge": "Investigación y Comunidad",
      "impact-cert": "Certificación Oficial",

      "cert-title": "Certificado de Asistencia",
      "cert-subtitle":
        "Cada participante que complete el evento recibe un certificado oficial",
      "cert-desc":
        "Al finalizar el Qiskit Fall Fest 2026 entregamos un certificado digital oficial de participación, avalado por el nodo organizador de la Universidad Distrital Francisco José de Caldas.",
      "cert-feat-1": "Avalado oficialmente por el nodo organizador.",
      "cert-feat-2": "Incluye el nombre completo del asistente y las fechas del evento.",
      "cert-feat-3": "Se entrega de forma digital tras completar el evento.",
      "cert-feat-4": "También avalado por IBM Quantum.",
      "cert-caption": "Certificado de ejemplo — el diseño final puede variar.",
      "nav-certificate": "Certificado",

      "att-banner-title": "Registra tu asistencia",
      "att-banner-desc":
        "Inicia sesión y escribe el código que aparece en cada sesión. Asiste al 75% o más para recibir tu certificado.",
      "att-banner-btn": "Ir a asistencia",

      "program-title": "Programa Académico",
      "program-subtitle":
        "Pasa el cursor sobre cualquier charla para consultar los detalles completos en el panel lateral",
      "program-notice":
        "Este cronograma está sujeto a cambios y se irá confirmando en los próximos días. Para estar pendiente de las charlas y ponentes, por favor regístrate en el evento y entra al canal de WhatsApp que está dentro del formulario de inscripción.",

      "day-1": "Martes 27 Oct",
      "day-2": "Miércoles 28 Oct",
      "day-3": "Jueves 29 Oct",
      "day-4": "Viernes 30 Oct",

      "th-time": "Hora",
      "th-activity": "Actividad / Charla",
      "th-type": "Tipo",

      "act-welcome": "Bienvenida",
      "act-lunch": "Almuerzo",
      "act-break": "Descanso",

      "act-d1-nicolas": "Iniciación a Qiskit: tu primer programa en un computador cuántico real",
      "act-d1-daniel": "Qiskit 101 — Daniel Sierra (IBM)",
      "act-d1-john": "Del sistema físico al qubit: fundamentos físicos y matemáticos de la computación cuántica — 1",

      "act-d2-camilo": "De los fenómenos cuánticos a la información cuántica",
      "act-d2-enrique": "Quantum Algorithms for Quantum Chemistry",
      "act-d2-john": "Del sistema físico al qubit: fundamentos físicos y matemáticos de la computación cuántica — 2",
      "act-d2-mateo": "Braquistócrona cuántica: tiempo mínimo de transición entre estados de un qubit",

      "act-d3-claudia": "Juegos cuánticos no locales para coordinar decisiones financieras",
      "act-d3-federico": "Evaluación de computadoras cuánticas mediante no localidad multipartita genuina",
      "act-d3-juan": "¿Y si conocer más significa saber menos? — Una exploración del principio de incertidumbre en mecánica cuántica",
      "act-d3-julian": "Energía del estado fundamental del antiferromagneto de Heisenberg de espín 1/2 en la red de Kagome mediante VQE sin calibración hamiltoniana",

      "act-d4-esteban1": "Ponencia",
      "act-d4-esteban2": "Cybercolombia",
      "act-d4-jaime": "QDSV: Del problema a la ejecución cuántica con Bridge y QRUBA",
      "act-d4-diego": "Corrección de errores cuánticos: una introducción a los códigos topológicos y sus desafíos",
      "act-d4-samuel": "Quantum Simulation of Neutrino Flavor Oscillations within Few-Qubit Systems",
      "act-d4-clausura": "Clausura — Premiación y Certificados",

      "tag-open": "Apertura",
      "tag-short": "Charla Corta",
      "tag-break": "Descanso",
      "tag-work": "Workshop",
      "tag-closing": "Clausura",
      "tag-key": "Keynote",
      "tag-course": "Curso",

      "loc-azul": "Auditorio Azul",
      "loc-sistemas": "Salas de sistemas",
      "loc-206": "Sala de sistemas 206",
      "loc-205": "Sala de sistemas 205",
      "loc-na": "—",

      "side-title": "Detalles de la Actividad",
      "side-hover-hint": "Pasa el cursor sobre una charla",
      "side-role": "Ponente / Moderador",
      "desc-example": "Descripción de ejemplo de la actividad seleccionada.",

      "desc-welcome": "Apertura del Qiskit Fall Fest 2026 a cargo del equipo QFF.",
      "desc-lunch": "Pausa para el almuerzo.",
      "desc-break": "Descanso breve.",
      "desc-d1-nicolas": "Iniciación a Qiskit: tu primer programa en un computador cuántico real.",
      "desc-d1-daniel": "Sesión práctica Qiskit 101 dirigida por Daniel Sierra (IBM).",
      "desc-d1-john": "Del sistema físico al qubit: fundamentos físicos y matemáticos de la computación cuántica — Parte 1.",
      "desc-d2-camilo": "De los fenómenos cuánticos a la información cuántica.",
      "desc-d2-enrique": "Quantum Algorithms for Quantum Chemistry.",
      "desc-d2-john": "Del sistema físico al qubit: fundamentos físicos y matemáticos de la computación cuántica — Parte 2.",
      "desc-d2-mateo": "Braquistócrona cuántica: tiempo mínimo de transición entre estados de un qubit.",
      "desc-d3-claudia": "Juegos cuánticos no locales para coordinar decisiones financieras.",
      "desc-d3-federico": "Evaluación de computadoras cuánticas mediante no localidad multipartita genuina.",
      "desc-d3-juan": "¿Y si conocer más significa saber menos? Una exploración del principio de incertidumbre en mecánica cuántica.",
      "desc-d3-julian": "Energía del estado fundamental del antiferromagneto de Heisenberg de espín 1/2 en la red de Kagome mediante VQE sin calibración hamiltoniana.",
      "desc-d4-esteban1": "Ponencia a cargo de Esteban Hernández.",
      "desc-d4-esteban2": "Sesión Cybercolombia con Esteban Hernández.",
      "desc-d4-jaime": "QDSV: Del problema a la ejecución cuántica con Bridge y QRUBA.",
      "desc-d4-diego": "Corrección de errores cuánticos: una introducción a los códigos topológicos y sus desafíos.",
      "desc-d4-samuel": "Quantum Simulation of Neutrino Flavor Oscillations within Few-Qubit Systems.",
      "desc-d4-clausura": "Ceremonia de clausura, premiación de charlas cortas y entrega de certificados.",

      "cfp-title": "Sesión de Charlas Cortas",
      "cfp-subtitle":
        "Espacio de divulgación científica para estudiantes, semilleros e investigadores",
      "cfp-desc":
        "Invitamos a estudiantes de pregrado, posgrado y miembros de grupos de investigación a enviar propuestas para <strong>Charlas Cortas (25 min)</strong> durante las sesiones del evento.",
      "cfp-t1": "Computación e Información Cuántica",
      "cfp-t2": "Algoritmos y Desarrollo Práctico con Qiskit",
      "cfp-t3": "Física Computacional, Simulación y Criptografía Cuántica",
      "cfp-award":
        "Se entregará un certificado de ganador a la mejor charla corta, también avalado por IBM Quantum.",
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
