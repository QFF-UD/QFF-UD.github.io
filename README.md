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
│   │   └── sections.css    # Cards, stats, program table, tabs, marquees
│   └── js/
│       ├── config.js       # URLs & constants (window.QFF.config)
│       ├── i18n.js         # Translations + setLanguage() (window.QFF.i18n)
│       ├── theme.js        # Light/dark toggle + logo swap (window.QFF.theme)
│       ├── countdown.js    # Live event countdown (window.QFF.countdown)
│       ├── schedule.js     # Program table + side panel (window.QFF.schedule)
│       └── main.js         # Bootstrap — wires everything on DOMContentLoaded
├── Logos/                  # Light/dark logos
└── Org_team/               # Organizing committee photos
```

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
