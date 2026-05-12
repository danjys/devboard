import { defineConfig } from 'vite';
import react    from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({

  // ── Critical for packaged Electron apps ──────────────────────────────────
  // Default base '/' makes Vite write asset paths like /assets/index-abc.js.
  // When Electron loads index.html via file://, those absolute paths resolve
  // to the filesystem root and the renderer gets a blank white screen.
  // './' makes all asset references relative, so they resolve correctly from
  // wherever index.html lives inside the asar archive.
  base: command === 'build' ? './' : '/',

  plugins: [
    react(),

    electron([
      {
        // ── Main process ────────────────────────────────────────────────────
        // vite-plugin-electron compiles src/main/index.js → dist-electron/index.js
        // and injects VITE_DEV_SERVER_URL into the spawned Electron process.
        entry: 'src/main/index.js',
        onstart(options) {
          // Launch (or restart) Electron once the main-process bundle is ready.
          // The plugin passes VITE_DEV_SERVER_URL automatically — no wait-on needed.
          options.startup();
        },
      },
      {
        // ── Preload script ──────────────────────────────────────────────────
        entry: 'src/main/preload.js',
        onstart(options) {
          // Notify Electron that the preload changed so it reloads the renderer
          options.reload();
        },
      },
    ]),

    // Allows renderer process to use Node.js / Electron APIs via the contextBridge
    renderer(),
  ],
}));
