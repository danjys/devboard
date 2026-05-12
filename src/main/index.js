/**
 * src/main/index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Electron MAIN PROCESS
 *
 * Responsibilities:
 *   • Create and manage the BrowserWindow (the OS-level window)
 *   • Load the React renderer (Vite dev-server in dev, built files in prod)
 *   • Register IPC handlers that the renderer calls via contextBridge
 *   • Handle app lifecycle events (ready, activate, window-all-closed)
 *
 * Architecture note:
 *   Main ↔ Renderer communication flows through preload.js using
 *   contextBridge + ipcRenderer, keeping the renderer fully sandboxed.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { app, BrowserWindow, ipcMain, shell, nativeTheme } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-compatible __dirname shim
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── Constants ─────────────────────────────────────────────────────────────────

const IS_DEV        = process.env.NODE_ENV !== 'production';
const VITE_DEV_URL  = process.env.VITE_DEV_SERVER_URL; // injected by vite-plugin-electron
const PRELOAD_PATH  = path.join(__dirname, 'preload.js');
const RENDERER_HTML = path.join(__dirname, '../dist/index.html');

const WINDOW_CONFIG = {
  width:  1280,
  height: 800,
  minWidth:  900,
  minHeight: 600,
  titleBarStyle: 'hiddenInset', // macOS: native traffic-light buttons
  webPreferences: {
    preload:          PRELOAD_PATH,
    contextIsolation: true,   // ✅ security: renderer can't access Node APIs directly
    nodeIntegration:  false,  // ✅ security: Node disabled in renderer
    sandbox:          false,  // Required for preload to work with vite-plugin-electron
  },
};

// ── Window factory ────────────────────────────────────────────────────────────

/**
 * Creates the main application window.
 * In development the Vite dev-server URL is loaded; in production the built
 * index.html is loaded from the dist folder.
 */
function createWindow() {
  const win = new BrowserWindow(WINDOW_CONFIG);

  // Remove the default menu bar (we ship our own header/toolbar in React)
  win.setMenuBarVisibility(false);

  if (VITE_DEV_URL) {
    win.loadURL(VITE_DEV_URL);
    if (IS_DEV) win.webContents.openDevTools({ mode: 'detach' });
  } else {
    win.loadFile(RENDERER_HTML);
  }

  // Open external links in the OS default browser, not a new Electron window
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

// ── App lifecycle ─────────────────────────────────────────────────────────────

app.whenReady().then(() => {
  createWindow();

  // macOS: re-create window when dock icon is clicked and no windows are open
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS where apps stay open)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC Handlers ──────────────────────────────────────────────────────────────
// These are the only ways the renderer (React) can trigger native OS behaviour.
// All handlers are registered once and available for the lifetime of the app.

/**
 * IPC: 'app:get-version'
 * Returns the app version string from package.json
 */
ipcMain.handle('app:get-version', () => app.getVersion());

/**
 * IPC: 'app:get-platform'
 * Returns the OS platform string (darwin | win32 | linux)
 */
ipcMain.handle('app:get-platform', () => process.platform);

/**
 * IPC: 'app:toggle-theme'
 * Switches between light / dark / system native theme
 * @param {Electron.IpcMainInvokeEvent} _event
 * @param {'light'|'dark'|'system'} theme
 */
ipcMain.handle('app:toggle-theme', (_event, theme) => {
  nativeTheme.themeSource = theme;
  return nativeTheme.shouldUseDarkColors;
});

/**
 * IPC: 'app:minimize'  /  'app:maximize'  /  'app:close'
 * Custom window controls exposed for borderless / custom-titlebar windows
 */
ipcMain.on('app:minimize', () => BrowserWindow.getFocusedWindow()?.minimize());
ipcMain.on('app:maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  win?.isMaximized() ? win.unmaximize() : win?.maximize();
});
ipcMain.on('app:close', () => BrowserWindow.getFocusedWindow()?.close());
