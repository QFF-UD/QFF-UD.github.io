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
      "act-d1-daniel": "Introduction to IBM Quantum and Qiskit",
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
      "desc-d1-nicolas": "A hands-on first step into quantum computing with Qiskit. Starting from the essentials (qubits, superposition, entanglement and measurement) we build a Bell state —the quantum \"hello world\"— and run it both on a simulator and on a real IBM quantum processor to see the effect of noise. We explore transpilation and the Sampler and Estimator primitives, and compute the expectation value of a simple Hamiltonian. No prior quantum experience required, just curiosity and basic Python.<br><br><em>Nicolás Avilán — Physicist (Universidad Nacional) and PhD in Physics (Universidad de los Andes). Professor at Universidad del Rosario, where he leads the Applied Mathematics and Computer Science program. Works on quantum computing and artificial intelligence.</em>",
      "desc-d1-daniel": "An introduction to quantum computing and the IBM Quantum and Qiskit ecosystem. Starting from qubits, superposition, entanglement and quantum circuits, we explain how these systems work and what sets them apart from classical computing. We review possible applications, current limitations and the role of hybrid approaches, and explore the tools in IBM Quantum and Qiskit to learn, develop and run circuits on real quantum computers.<br><br><em>Dr. Daniel Sierra-Sosa — Assistant Professor of Computer Science at The Catholic University of America and lead of RIFT Labs. Qiskit Advocate researching quantum computing, machine learning and their scientific applications.</em>",
      "desc-d1-john": "A pedagogical introduction to the physical and mathematical principles behind quantum computing, going from physical systems to their representation as qubits — Part 1. No prior knowledge of quantum mechanics or computing is required; familiarity with elementary linear algebra, calculus, complex numbers and basic university physics is helpful, though the needed concepts are introduced along the way.<br><br><em>John Hernán Díaz Forero — Physics professor at Universidad Distrital Francisco José de Caldas, specialist and MSc in Physical Sciences (Universidad Nacional de Colombia) with doctoral studies in Engineering. Member of the GEFEM group and leader of the Multiscale Natural Systems Modeling and Simulation research seedbed.</em>",
      "desc-d2-camilo": "A review of the quantum phenomena of superposition and entanglement, from their origin in the physical world to their use in the quantum version of tic-tac-toe. The measurement problem and its implications for quantum computing are addressed. An introductory talk on the formalism of quantum mechanics.<br><br><em>Camilo Andrés Espejo Pabón — Associate Professor in the Department of Mathematics, Physics and Data Science at Universidad del Norte. PhD in Nanoscience and Nanotechnology (CINVESTAV, Mexico); MSc and Physicist from Universidad Nacional de Colombia.</em>",
      "desc-d2-enrique": "Quantum computing offers, from an algorithmic perspective, powerful tools to study systems describable through an energy map. This talk explores how to exploit that structure to extract relevant information, surveying optimization and quantum diagonalization strategies — from foundational methods such as the Variational Quantum Eigensolver (VQE) to more advanced, current techniques like Orthogonal Quantum Krylov Diagonalization and Counterdiabatic ADAPT-VQE, analyzing their possibilities and applications.<br><br><em>Enrique Anguiano Vara — Quantum Machine Learning Research Assistant at the Materials Science Institute of Madrid (ICMM-CSIC). Winner of MIT iQuHACK'26, IQM Quantum Hack and the EPFL Quantum Hackathon; national finalist and sub-European (SWERC) competitor in competitive programming.</em>",
      "desc-d2-john": "A pedagogical introduction to the physical and mathematical principles behind quantum computing, going from physical systems to their representation as qubits — Part 2. No prior knowledge of quantum mechanics or computing is required; familiarity with elementary linear algebra, calculus, complex numbers and basic university physics is helpful, though the needed concepts are introduced along the way.<br><br><em>John Hernán Díaz Forero — Physics professor at Universidad Distrital Francisco José de Caldas, specialist and MSc in Physical Sciences (Universidad Nacional de Colombia) with doctoral studies in Engineering. Member of the GEFEM group and leader of the Multiscale Natural Systems Modeling and Simulation research seedbed.</em>",
      "desc-d2-mateo": "Quantum brachistochrone: minimum transition time between qubit states.",
      "desc-d3-claudia": "Non-local quantum games to coordinate financial decisions.",
      "desc-d3-federico": "Benchmarking quantum computers via genuine multipartite nonlocality.",
      "desc-d3-juan": "What if knowing more means knowing less? An exploration of the uncertainty principle in quantum mechanics.",
      "desc-d3-julian": "A study of the antiferromagnetic Heisenberg model on the Kagome lattice using VQE, developed during QWorld's QIntern 2026 under Prof. Muhammad Ahsan. SU(2)-symmetry-preserving ansätze achieved a 0.52% energy error over 19 sites with no prior calibration. Using a lattice fragmentation-and-recombination strategy, a 0.938% error was reached over 26 sites, reducing the dependence on quantum hardware calibration.<br><br><em>Julián Armando Aros — Final-year Physics student at Universidad Distrital, with experience in 2D materials for water decontamination. QWorld intern (QIntern 2026) working on ground-state energy estimation of the antiferromagnetic Heisenberg model via hardware-efficient VQE. Interested in condensed matter physics and quantum computing.</em>",
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
      "act-d1-daniel": "Introduction to IBM Quantum and Qiskit",
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
      "desc-d1-nicolas": "Taller práctico para dar los primeros pasos en computación cuántica con Qiskit. Partimos de los conceptos esenciales (qubits, superposición, entrelazamiento y medición) y construimos un estado de Bell, el «hola mundo» cuántico, ejecutándolo en un simulador y luego en un procesador cuántico real de IBM para comparar resultados y entender el efecto del ruido. Exploramos la transpilación y las primitivas Sampler y Estimator, y calculamos el valor esperado de un Hamiltoniano sencillo. No se requiere experiencia previa en física cuántica, solo curiosidad y conocimientos básicos de Python.<br><br><em>Nicolás Avilán — Físico (Universidad Nacional) y doctor en Física (Universidad de los Andes). Profesor de la Universidad del Rosario, donde dirige el programa de Matemáticas Aplicadas y Ciencias de la Computación. Trabaja en computación cuántica e inteligencia artificial.</em>",
      "desc-d1-daniel": "Introducción a la computación cuántica y al ecosistema de IBM Quantum y Qiskit. A partir de los cúbits, la superposición, el entrelazamiento y los circuitos cuánticos, se explica cómo funcionan estos sistemas y qué los diferencia de la computación clásica. Se presentan posibles aplicaciones, limitaciones actuales y el papel de los enfoques híbridos, y se exploran las herramientas de IBM Quantum y Qiskit para aprender, desarrollar y ejecutar circuitos en computadores cuánticos reales.<br><br><em>Dr. Daniel Sierra-Sosa — Profesor asistente de Ciencias de la Computación en The Catholic University of America y líder de RIFT Labs. Qiskit Advocate; investiga en computación cuántica, aprendizaje automático y sus aplicaciones científicas.</em>",
      "desc-d1-john": "Introducción pedagógica a los principios físicos y matemáticos que sustentan la computación cuántica, desde los sistemas físicos hasta su representación mediante qubits — Parte 1. No se requieren conocimientos previos de mecánica ni computación cuántica; se recomienda familiaridad con álgebra lineal elemental, cálculo diferencial e integral, números complejos y física básica universitaria, aunque los conceptos necesarios se introducen durante el cursillo.<br><br><em>John Hernán Díaz Forero — Profesor de Física de la Universidad Distrital Francisco José de Caldas, especialista y magíster en Ciencias Físicas (Universidad Nacional de Colombia) con estudios doctorales en Ingeniería. Integrante del grupo GEFEM y líder del Semillero de Modelamiento y Simulación de Sistemas Naturales Multiescala.</em>",
      "desc-d2-camilo": "Revisión de los fenómenos cuánticos de superposición y entrelazamiento, desde su origen en el mundo físico hasta su aplicación en la versión cuántica del juego de triqui. Se aborda el problema de la medición y sus implicaciones en computación cuántica. Es una charla introductoria al formalismo de la mecánica cuántica.<br><br><em>Camilo Andrés Espejo Pabón — Profesor asociado del Departamento de Matemáticas, Física y Ciencia de Datos de la Universidad del Norte. Doctor en Nanociencias y Nanotecnología (CINVESTAV, México); magíster y físico de la Universidad Nacional de Colombia.</em>",
      "desc-d2-enrique": "La computación cuántica ofrece, desde una perspectiva algorítmica, herramientas muy interesantes para estudiar sistemas describibles mediante un mapa de energías. La charla explora cómo aprovechar esa estructura para extraer información relevante del sistema, recorriendo estrategias de optimización y diagonalización cuántica: desde métodos fundamentales como el Variational Quantum Eigensolver (VQE) hasta técnicas más avanzadas y actuales como Orthogonal Quantum Krylov Diagonalization y Counterdiabatic ADAPT-VQE, analizando sus posibilidades y aplicaciones.<br><br><em>Enrique Anguiano Vara — Quantum Machine Learning Research Assistant en el Instituto de Ciencias de Materiales de Madrid (ICMM-CSIC). Ganador de MIT iQuHACK'26, IQM Quantum Hack y EPFL Quantum Hackathon; finalista nacional y subeuropeo (SWERC) en programación competitiva.</em>",
      "desc-d2-john": "Introducción pedagógica a los principios físicos y matemáticos que sustentan la computación cuántica, desde los sistemas físicos hasta su representación mediante qubits — Parte 2. No se requieren conocimientos previos de mecánica ni computación cuántica; se recomienda familiaridad con álgebra lineal elemental, cálculo diferencial e integral, números complejos y física básica universitaria, aunque los conceptos necesarios se introducen durante el cursillo.<br><br><em>John Hernán Díaz Forero — Profesor de Física de la Universidad Distrital Francisco José de Caldas, especialista y magíster en Ciencias Físicas (Universidad Nacional de Colombia) con estudios doctorales en Ingeniería. Integrante del grupo GEFEM y líder del Semillero de Modelamiento y Simulación de Sistemas Naturales Multiescala.</em>",
      "desc-d2-mateo": "Braquistócrona cuántica: tiempo mínimo de transición entre estados de un qubit.",
      "desc-d3-claudia": "Juegos cuánticos no locales para coordinar decisiones financieras.",
      "desc-d3-federico": "Evaluación de computadoras cuánticas mediante no localidad multipartita genuina.",
      "desc-d3-juan": "¿Y si conocer más significa saber menos? Una exploración del principio de incertidumbre en mecánica cuántica.",
      "desc-d3-julian": "Estudio del modelo de Heisenberg antiferromagnético en la red Kagome mediante VQE, desarrollado durante QIntern 2026 de QWorld bajo la tutoría del Prof. Muhammad Ahsan. Se diseñaron ansätze que preservan la simetría SU(2), logrando un error energético del 0,52 % en 19 sitios sin calibración previa. Mediante una estrategia de fragmentación y recombinación de la red, se alcanzó un error del 0,938 % en 26 sitios, reduciendo la dependencia de la calibración del hardware cuántico.<br><br><em>Julián Armando Aros — Estudiante de último semestre de Física en la Universidad Distrital, con experiencia en materiales bidimensionales aplicados a la descontaminación del agua. Pasante de QWorld (QIntern 2026), donde trabajó en la estimación de la energía fundamental del modelo de Heisenberg antiferromagnético mediante VQE eficiente en hardware. Interesado en la física de la materia condensada y la computación cuántica.</em>",
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
    "desc-d1-nicolas": true,
    "desc-d1-daniel": true,
    "desc-d1-john": true,
    "desc-d2-camilo": true,
    "desc-d2-enrique": true,
    "desc-d2-john": true,
    "desc-d3-julian": true,
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
