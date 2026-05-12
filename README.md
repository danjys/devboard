# DevBoard

> **Demo project** — React + Electron desktop app for the Modern Desktop UI evaluation.
> Architect: Dj · Stack: Electron 32 · React 18 · Vite 5

A Kanban task board that demonstrates:

| Concept | How it's shown |
|---------|---------------|
| React as desktop UI | Electron loads the React/Vite renderer inside a native window |
| Clean component architecture | 7 focused components, each in its own folder with co-located CSS |
| Secure Electron IPC | `contextBridge` + typed `window.electronAPI` — renderer never touches Node APIs directly |
| State management (no Redux) | React Context + `useReducer` — predictable, testable, zero extra deps |
| Drag and drop | Native HTML5 DnD API — drag cards between columns |
| Light / Dark theme | CSS custom property tokens switched via `data-theme` on `<html>` |
| Auto-updating docs | `npm run update-docs` scans `src/` and rewrites `docs/architecture.mmd` + `.md` |
| CI/CD via GitHub Actions (free) | Lint + test + build on every push; release installers on version tags |

---

## Quick Start

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Run in development

```bash
npm install
npm run electron:dev
```

This starts the Vite dev server (port 5173) with HMR, then launches Electron pointing at it.

### Run tests

```bash
npm test
```

### Lint

```bash
npm run lint
```

### Build installer

```bash
npm run build
# Output: release/  (dmg/exe/AppImage depending on platform)
```

### Regenerate docs manually

```bash
npm run update-docs
# Rewrites docs/architecture.mmd and docs/architecture.md
```

---

## Project Structure

```
devboard/
├── .github/
│   └── workflows/
│       ├── ci.yml              ← Lint + test + build on push/PR
│       ├── release.yml         ← Cross-platform installers on version tags
│       └── update-docs.yml     ← Auto-update docs after CI passes on main
│
├── src/
│   ├── main/
│   │   ├── index.js            ← Electron main process
│   │   └── preload.js          ← contextBridge API surface
│   └── renderer/
│       ├── main.jsx            ← React entry point
│       ├── App.jsx             ← Root layout
│       ├── components/
│       │   ├── Header/         ← App bar
│       │   ├── Sidebar/        ← Status + priority nav
│       │   ├── Board/          ← Kanban board + DnD orchestration
│       │   ├── Column/         ← Drop-target column
│       │   ├── TaskCard/       ← Draggable task card
│       │   ├── TaskModal/      ← Add/Edit dialog
│       │   └── Badge/          ← Priority chip
│       ├── context/
│       │   └── TaskContext.jsx ← Global state (Context + useReducer)
│       └── styles/
│           └── globals.css     ← Design tokens + CSS reset
│
├── docs/
│   ├── architecture.mmd        ← Mermaid diagram (auto-generated)
│   └── architecture.md         ← Architecture guide (auto-generated)
│
├── scripts/
│   └── update-docs.js          ← Auto-doc generator
│
├── package.json
├── vite.config.js
└── README.md
```

---

## CI/CD — How it works

### 1. `ci.yml` — Runs on every push and PR

```
push / PR → main
    │
    ├── lint   ESLint on src/
    ├── test   Vitest unit tests
    └── build  Vite renderer build
```

All three jobs run in parallel. A PR is blocked from merging if any fails.

### 2. `release.yml` — Triggered by version tags

```bash
git tag v1.0.0
git push origin v1.0.0
```

```
tag v*.*.*
    │
    ├── build (macOS)   → DevBoard.dmg + .zip
    ├── build (Windows) → DevBoard-Setup.exe + .zip
    └── build (Linux)   → DevBoard.AppImage + .deb
         │
         └── GitHub Release created automatically with all installers attached
```

### 3. `update-docs.yml` — Triggered after CI passes on `main`

```
CI passes on main
    │
    └── npm run update-docs
         │
         ├── Scan src/renderer/components/  → component list
         ├── Scan src/renderer/context/     → context list
         ├── Scan src/renderer/hooks/       → hooks list
         ├── Write docs/architecture.mmd    ← Mermaid diagram
         └── Write docs/architecture.md     ← Architecture guide
              │
              └── git commit + push (only if files changed)
                  commit message: "docs: auto-update architecture [skip ci]"
```

---

## Architecture Diagram

See [`docs/architecture.mmd`](docs/architecture.mmd) — rendered by GitHub automatically.
Full guide: [`docs/architecture.md`](docs/architecture.md)

---

## Key Design Decisions

**Why Electron over Tauri?**
Electron is the most mature React desktop framework with the largest ecosystem.
For a demo/evaluation, it has the best developer experience and widest tooling support.
Tauri (Rust-based) is worth evaluating next — it offers smaller bundles and better performance.

**Why Context + useReducer over Redux?**
Redux adds boilerplate and an extra dependency. For an app of this size, `useReducer` gives
the same unidirectional data flow with less ceremony and is easier to demo.

**Why CSS Modules over Tailwind?**
CSS Modules keep component styles co-located and scoped with zero runtime cost.
The design-token approach (`globals.css` custom properties) gives a consistent system
without a build-step dependency.

**Why HTML5 DnD over a library?**
Demonstrates that React doesn't need `react-beautiful-dnd` or similar for basic drag-and-drop.
Keeps dependencies minimal and the implementation transparent.
