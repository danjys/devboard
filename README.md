# DevBoard — Lumonus

> **Demo project** for evaluating modern desktop UI development.  
> Architect: Dj · Stack: Electron 32 · React 18 · Vite 5 · Storybook 8

A Kanban task board that demonstrates React as a first-class desktop UI framework, complete with component documentation, automated architecture diagrams, and a full CI/CD pipeline on GitHub Actions free tier.

---

## What This Demos

| Concept | How it's shown |
|---|---|
| React as desktop UI | Electron loads the React/Vite renderer inside a native OS window |
| Component architecture | Every component lives in its own folder with co-located CSS Modules |
| Secure Electron IPC | `contextBridge` + typed `window.electronAPI` — renderer never touches Node APIs |
| State management (no Redux) | React Context + `useReducer` — predictable, zero extra deps |
| Drag and drop | Native HTML5 DnD API — drag cards across Kanban columns |
| Light / Dark theming | CSS custom property tokens switched via `data-theme` on `<html>` |
| Component library (Storybook) | Every component has stories — run in a browser, no Electron needed |
| Auto-updating architecture docs | `npm run update-docs` scans `src/` and rewrites Mermaid diagrams + markdown |
| CI/CD (GitHub Actions free tier) | Lint + test + build on every push; cross-platform installers on version tags |
| Installable desktop app | Electron Forge produces `.dmg` / `.zip` / `.exe` / `.deb` / `.rpm` packages |

---

## Prerequisites

- Node.js ≥ 18
- npm ≥ 9

---

## Development

### Run the app (hot-reload)

```bash
npm install
npm run electron:dev
```

Starts the Vite dev server with HMR, then launches Electron automatically. Saving any file in `src/renderer/` hot-reloads the UI. Changes to `src/main/` restart the Electron process.

### Run tests

```bash
npm test              # single run
npm run test:watch    # watch mode
```

### Lint

```bash
npm run lint          # report
npm run lint:fix      # auto-fix
```

---

## Building an Installable Package

DevBoard uses **Electron Forge** for packaging. A single command handles the entire pipeline.

### Build for your current platform

```bash
npm run make
```

This runs three steps automatically:

1. **Vite build** (triggered by the `generateAssets` hook in `forge.config.cjs`)
   - Compiles the React renderer → `dist/`
   - Compiles Electron main process + preload → `dist-electron/`

2. **Electron Forge packages** the compiled output into an asar archive, excluding all source files, tooling config, and Storybook stories.

3. **Makers produce platform installers** in `out/make/`

### Output locations

| Path | Contents | Use for |
|---|---|---|
| `out/DevBoard-darwin-arm64/DevBoard.app` | Raw packaged `.app` | Quick local testing |
| `out/make/zip/darwin/arm64/*.zip` | Distributable zip | Sharing / distribution |
| `out/make/squirrel.windows/` | Windows NSIS installer | Windows distribution |
| `out/make/deb/` | Linux `.deb` package | Linux distribution |

> **macOS tip:** If the app shows a white screen when launched from `out/make`, you are running the `.app` directly from inside the zip in Finder. Double-click the `.zip` to extract it first, then open the extracted `.app`.

### Just package without making an installer

```bash
npm run package
```

Produces the `.app` / `.exe` / binary in `out/` without creating a zip or installer. Faster for quick testing.

### How the white-flash problem was solved

Vite's default `base: '/'` builds asset paths like `/assets/index-abc.js`. When Electron opens `index.html` via `file://`, that absolute path resolves to the filesystem root — blank white screen. Two fixes are applied:

- `vite.config.js` sets `base: './'` during builds so all asset references are relative.
- `src/main/index.js` uses `show: false` + the `ready-to-show` event so the window stays hidden until React has fully mounted, then appears already rendered. `backgroundColor: '#07080d'` ensures no white flash during startup.

---

## Storybook — Component Library

Storybook provides an interactive component catalogue that runs in a browser — no Electron required. Use it for design review, isolated component development, and onboarding.

### Run Storybook

```bash
npm run storybook
# Opens at http://localhost:6006
```

### Build a static Storybook site

```bash
npm run build-storybook
# Output: storybook-static/  (deployable to GitHub Pages, S3, Netlify, etc.)
```

### Components documented

| Story path | Component | Stories included |
|---|---|---|
| Design System/Badge | `Badge` | High, Medium, Low, All Variants |
| Components/TaskCard | `TaskCard` | High/Medium/Low priority, No Description, Dimmed, Column Preview |
| Components/FilterBar | `FilterBar` | Default, High Active, Medium Active, Interactive (clickable) |
| Components/SearchBar | `SearchBar` | Empty, With Results, No Results, Single Result, Interactive |
| Components/Toast | `Toast` | Success, Error, Warning, Info, Stacked (all four together) |
| Components/StatsPanel | `StatsPanel` | Typical Board, Mostly Complete, Empty Board |

### How the global setup works

`.storybook/preview.jsx` wraps every story automatically with `TaskProvider` + `ToastProvider`, so components that call `useTasks()` or `useToast()` work without any boilerplate in individual story files. The Lumonus dark and light themes are selectable from the Storybook toolbar.

### Future: Python + C# documentation

When the codebase grows to include Python and C#, the documentation strategy is:

| Language | Tool | Output |
|---|---|---|
| React / TypeScript | **Storybook** | Interactive component library |
| Python | **Sphinx** + autodoc | API reference from docstrings |
| C# | **DocFX** | XML-doc API reference |
| Combined hub | **Docusaurus** | Single site linking all three |

---

## Auto-Updating Architecture Documentation

The `scripts/update-docs.js` script scans the source tree and regenerates two files automatically.

### Run manually

```bash
npm run update-docs
```

### What it generates

| File | Format | Contents |
|---|---|---|
| `docs/architecture.mmd` | Mermaid | Component dependency diagram — rendered natively by GitHub |
| `docs/architecture.md` | Markdown | Human-readable architecture guide with component descriptions |

> Do not edit these files by hand — they are overwritten every time the script runs.

### What gets scanned

| Source path | Maps to |
|---|---|
| `src/renderer/components/*/` | One diagram node per component folder |
| `src/renderer/context/*.jsx` | One node per context (test/spec files excluded) |
| `src/renderer/hooks/*.jsx` | One node per custom hook |

### Viewing the diagram

Push to GitHub and open `docs/architecture.mmd` in the file browser — it renders automatically. Or install the **Mermaid Preview** extension in VS Code to view it locally.

---

## CI/CD — GitHub Actions

All workflows are in `.github/workflows/` and run on the **GitHub Actions free tier** (2,000 minutes/month on public repos, 500 on private).

### Pipeline overview

```
Every push or PR to main
    │
    ├── ci.yml          → Lint · Test · Build  (3 parallel jobs)
    └── update-docs.yml → Auto-regenerate architecture docs (runs after CI passes)

git tag v1.2.3 && git push --tags
    │
    └── release.yml     → macOS + Windows + Linux installers → GitHub Release
```

---

### Workflow 1: `ci.yml` — Continuous Integration

**Trigger:** Every `push` and pull request to `main`

**Jobs (run in parallel):**

| Job | Command | Catches |
|---|---|---|
| `lint` | `npm run lint` | Code style errors, unused imports |
| `test` | `npm test` | Failing unit tests |
| `build` | `npm run build` | Compile errors in the renderer |

**Demo talking point:** Open a pull request with any change and within ~60 seconds you see green or red check marks on the PR. The branch cannot be merged to `main` while any check is failing.

**How to trigger for a live demo:**

```bash
git checkout -b demo/trigger-ci
echo "// demo" >> src/renderer/App.jsx
git add . && git commit -m "demo: trigger CI pipeline"
git push origin demo/trigger-ci
# Open a PR on GitHub — watch the checks appear in real time
```

---

### Workflow 2: `release.yml` — Cross-Platform Installer Release

**Trigger:** Any tag matching `v*.*.*` pushed to GitHub

**What happens:**

Three build jobs run in parallel, each on a different OS runner:

```
tag v1.0.0 pushed
    │
    ├── macOS runner   → DevBoard-1.0.0.dmg  +  DevBoard-1.0.0-mac.zip
    ├── Windows runner → DevBoard-1.0.0-Setup.exe  +  DevBoard-1.0.0-win.zip
    └── Ubuntu runner  → DevBoard-1.0.0.AppImage   +  DevBoard-1.0.0.deb
         │
         └── GitHub Release created automatically
             All installer files attached as downloadable assets
```

**How to trigger a release:**

```bash
# 1. Bump the version in package.json
# 2. Commit and tag
git add package.json
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push origin main --tags

# GitHub Actions builds all three platforms in ~5–8 minutes.
# A Release page appears at: github.com/<your-repo>/releases/tag/v1.0.1
```

**Demo talking point:** One `git push` produces downloadable installers for all three platforms with zero local build environment. macOS, Windows, and Linux — from the same pipeline, for free.

---

### Workflow 3: `update-docs.yml` — Automatic Documentation

**Trigger:** After `ci.yml` passes on `main` (uses `workflow_run` event — not triggered by the doc commit itself)

**What happens:**

```
CI passes on main
    │
    └── npm run update-docs
         │
         ├── Scan src/ → discover components, contexts, hooks
         ├── Regenerate docs/architecture.mmd
         └── Regenerate docs/architecture.md
              │
              ├── No changes → workflow exits cleanly, no commit
              └── Changes detected → git commit + push
                  commit: "docs: auto-update architecture [skip ci]"
```

The `[skip ci]` tag in the commit message prevents the doc commit from re-triggering CI in an infinite loop.

**Demo talking point:** Add a new component file to `src/renderer/components/`, push to `main`, and within ~2 minutes the architecture diagram in the repo is updated automatically. No human needed, no documentation debt.

---

## Project Structure

```
devboard/
├── .github/
│   └── workflows/
│       ├── ci.yml              ← Lint + test + build on every push / PR
│       ├── release.yml         ← Cross-platform installers on version tags
│       └── update-docs.yml     ← Auto-regenerate docs after CI passes on main
│
├── .storybook/
│   ├── main.js                 ← Storybook framework config (@storybook/react-vite)
│   └── preview.jsx             ← Global decorators, theme toggle, background colours
│
├── src/
│   ├── main/
│   │   ├── index.js            ← Electron main process — BrowserWindow, IPC handlers
│   │   └── preload.js          ← contextBridge — the only bridge between Node and React
│   └── renderer/
│       ├── main.jsx            ← React entry point
│       ├── App.jsx             ← Root layout + global state wiring
│       ├── components/
│       │   ├── Header/         ← Lumonus branded app bar, progress bar, theme toggle
│       │   ├── Sidebar/        ← Interactive view / column / filter navigation
│       │   ├── Board/          ← Kanban board + drag-and-drop orchestration
│       │   ├── Column/         ← Drop-target column with highlight state
│       │   ├── TaskCard/       ← Draggable card (edit / delete on hover)
│       │   ├── TaskModal/      ← Add / Edit task dialog
│       │   ├── FilterBar/      ← Priority filter pills with live task counts
│       │   ├── SearchBar/      ← Real-time task search with result count
│       │   ├── StatsPanel/     ← Analytics view: KPIs, progress bars, activity feed
│       │   ├── Toast/          ← Slide-in notification system (4 types)
│       │   ├── Badge/          ← Priority colour chip (all colour logic centralised here)
│       │   └── LumonusLogo/    ← Brand mark (halo SVG) + wordmark component
│       ├── context/
│       │   ├── TaskContext.jsx ← Global task state: Context + useReducer + localStorage
│       │   └── ToastContext.jsx← Global toast queue: show / auto-dismiss from anywhere
│       └── styles/
│           └── globals.css     ← Lumonus design tokens (DM Sans, dark/light themes)
│
├── docs/
│   ├── architecture.mmd        ← Mermaid diagram  (auto-generated — do not edit)
│   └── architecture.md         ← Architecture guide (auto-generated — do not edit)
│
├── scripts/
│   └── update-docs.js          ← Doc generator: scans src/, writes docs/
│
├── forge.config.cjs            ← Electron Forge packaging + hooks
├── vite.config.js              ← Vite config (base: './' on build for file:// compat)
├── package.json
└── README.md
```

---

## Key Design Decisions

**Why Electron over Tauri?**
Electron is the most mature React desktop framework with the largest ecosystem. For a demo and evaluation it has the best developer experience and tooling support. Tauri is the natural next comparison — it offers significantly smaller bundles (~5 MB vs ~150 MB) and lower memory usage at the cost of Rust knowledge.

**Why Electron Forge over electron-builder?**
Electron Forge is the officially recommended packaging tool from the Electron team (Electron 27+). It has cleaner Vite integration via hooks, and its Squirrel-based Windows installer handles auto-updates more reliably out of the box.

**Why Context + useReducer over Redux?**
Redux adds boilerplate and an extra dependency. For an app of this scale, `useReducer` gives the same unidirectional data flow with less ceremony and is easier to step through in a demo.

**Why CSS Modules over Tailwind?**
CSS Modules keep styles co-located and scoped with zero runtime cost. The design-token approach in `globals.css` gives a consistent system without a compile-step dependency, and makes the Lumonus brand theming transparent and easy to follow.

**Why HTML5 DnD over a library?**
Shows that React does not need `react-beautiful-dnd` or similar for straightforward drag-and-drop. Keeps dependencies minimal and the implementation visible.

**Why Storybook with `@storybook/react-vite`?**
The Vite-based Storybook framework shares the same Vite config as the app — same transforms, same CSS Modules handling. No separate Webpack configuration to maintain, and stories compile as fast as the app itself.
