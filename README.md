# Qiskit Fall Fest 2026

Official website of **Qiskit Fall Fest 2026** — Universidad Distrital Francisco José de Caldas (Bogotá Node, Colombia).

A static, bilingual (EN / ES) site with light & dark themes, hosted on GitHub Pages.

## Project structure

```
.
├── index.html              # Markup only (no inline CSS/JS)
├── assets/
│   ├── css/
│   │   ├── main.css        # Entry point — @imports the modules below in order
│   │   ├── variables.css   # Design tokens (dark default + light overrides)
│   │   ├── base.css        # Reset, typography, layout, containers
│   │   ├── navbar.css      # Navbar, dropdowns, language/theme switchers
│   │   ├── hero.css        # Hero section + countdown card
│   │   ├── sections.css    # Cards, stats, program table, tabs, marquees
│   │   └── animations.css  # Bloch/circuit visuals + scroll-reveal + hovers
│   └── js/
│       ├── config.js       # URLs & constants (window.QFF.config)
│       ├── i18n.js         # Translations + setLanguage() (window.QFF.i18n)
│       ├── theme.js        # Light/dark toggle + logo swap (window.QFF.theme)
│       ├── countdown.js    # Live event countdown (window.QFF.countdown)
│       ├── schedule.js     # Program table + side panel (window.QFF.schedule)
│       ├── quantum-field.js # Global ambient constellation background
│       ├── bloch-sphere.js # Animated Bloch sphere (hero backdrop)
│       ├── quantum-circuit.js # Animated quantum-circuit band
│       ├── reveal.js       # Scroll-triggered entrance animations (staggered)
│       └── main.js         # Bootstrap — wires everything on DOMContentLoaded
├── Logos/                  # Light/dark logos
├── Org_team/               # Organizing committee photos
├── speakers/               # Speaker / guest photos (see speakers/README.md)
└── certificados/           # Sample attendance certificate image
```

## Editing common content

- **Schedule / cronograma** — in `index.html`, section `#program`. A step-by-step
  guide comment at the top of the program explains the row pattern. Days are
  `#table-day1` … `#table-day4`; each row uses `showSideDetails(...)` to feed the
  side panel.
- **Organizing committee** — section `#organizers`. Cards use the reusable
  `.team-card` / `.member-*` classes. The marquee has two tracks (the second is an
  `aria-hidden` clone for the infinite-scroll effect), so edit **both**.
- **Speakers** — section `#speakers`; put photos in `speakers/` and use
  `class="member-avatar"`.
- **Certificate** — section `#certificate`; image lives in `certificados/`.
- **Contact form** — section `#location-contact`. Replace `tu-form-id` in the form
  `action` with your real Formspree endpoint. Fields use `.form-field` / `.form-*`
  classes (styled in `assets/css/sections.css`).
- **Text / translations** — every translatable element has `data-i18n="key"`; add
  the key to **both** `en` and `es` in `assets/js/i18n.js`.

## Animations

All visuals are dependency-free Canvas 2D and respect `prefers-reduced-motion`
(they render a single static frame when motion is reduced):

- **Quantum field** — `assets/js/quantum-field.js`, a fixed, low-opacity
  constellation of drifting qubits behind the whole page (`<canvas
  data-quantum-field>`). Reacts subtly to the pointer and pauses when the tab is
  hidden.
- **Bloch sphere** — `assets/js/bloch-sphere.js`, attaches to any
  `<canvas data-bloch-sphere>`. Used as a large faded backdrop behind the hero
  title.
- **Quantum circuit band** — `assets/js/quantum-circuit.js`, attaches to any
  `<canvas data-quantum-circuit>`. Shown as a separator after the hero.
- **Scroll reveal** — `assets/js/reveal.js`; add the `reveal` class to any element
  and it fades/slides in when it enters the viewport. Direct children cascade in
  with a staggered delay.

Section polish (elegant title ornaments, per-section radial glows, gradient card
edges and refined hovers) lives in `assets/css/animations.css`. All visuals read
their colors from the CSS theme variables and update on theme toggle.

## Architecture notes

- **Single CSS entry point.** `index.html` links only `assets/css/main.css`, which
  `@import`s the modules in cascade order (tokens → base → components).
- **Namespaced JS.** Every module attaches its public API to a shared `window.QFF`
  object. Load order matters: `config` → feature modules → `main`.
- **Inline handlers.** The markup uses `onclick="setLanguage('es')"`,
  `toggleTheme()`, `switchDayTable(...)` and `showSideDetails(...)`. These remain
  exposed as globals for backwards compatibility.
- **i18n.** Translatable elements carry a `data-i18n="key"` attribute. Plain strings
  are applied with `textContent`; the few strings containing markup are listed in
  `HTML_KEYS` and applied with `innerHTML`.

## Local preview

It's a static site — open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```
