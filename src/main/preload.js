/**
 * src/main/preload.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Electron PRELOAD SCRIPT
 *
 * This script runs in a special context that has access to BOTH Node.js APIs
 * and the renderer's DOM.  We use `contextBridge.exposeInMainWorld` to inject
 * a safe, explicitly-typed API surface (`window.electronAPI`) into the React
 * renderer — without leaking the full ipcRenderer object.
 *
 * Security model:
 *   Renderer → preload (window.electronAPI.xxx) → ipcRenderer → main process
 *   The renderer never touches ipcRenderer directly.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { contextBridge, ipcRenderer } from 'electron';

// ── Exposed API ───────────────────────────────────────────────────────────────

contextBridge.exposeInMainWorld('electronAPI', {

  // ── App info ────────────────────────────────────────────────────────────────

  /** @returns {Promise<string>} app version, e.g. "1.0.0" */
  getVersion: () => ipcRenderer.invoke('app:get-version'),

  /** @returns {Promise<'darwin'|'win32'|'linux'>} */
  getPlatform: () => ipcRenderer.invoke('app:get-platform'),

  // ── Theme ───────────────────────────────────────────────────────────────────

  /**
   * Toggle the native OS theme.
   * @param {'light'|'dark'|'system'} theme
   * @returns {Promise<boolean>} true if dark colours are now active
   */
  toggleTheme: (theme) => ipcRenderer.invoke('app:toggle-theme', theme),

  // ── Window controls ─────────────────────────────────────────────────────────
  // Used by custom title-bar components on Windows / Linux

  minimizeWindow: () => ipcRenderer.send('app:minimize'),
  maximizeWindow: () => ipcRenderer.send('app:maximize'),
  closeWindow:    () => ipcRenderer.send('app:close'),
});
