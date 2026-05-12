/**
 * forge.config.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Electron Forge configuration for building installable packages.
 *
 * Named .cjs because the project uses "type":"module" in package.json,
 * so all plain .js files are treated as ES modules — Forge requires CommonJS.
 *
 * Build pipeline (npm run make):
 *   1. generateAssets hook  → runs `vite build`
 *                              compiles renderer  → dist/
 *                              compiles main+preload → dist-electron/
 *   2. Forge packages dist/ + dist-electron/ + node_modules into an asar
 *   3. Makers produce platform installers (dmg/zip, squirrel, deb, rpm)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const { execSync }    = require('child_process');
const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');

module.exports = {

  // ── Packager config ──────────────────────────────────────────────────────────
  packagerConfig: {
    name:    'DevBoard',
    asar: true,

    // Only ship compiled output. Regex patterns tested against each file path.
    // Excluding source + tooling keeps the package lean and avoids confusion.
    ignore: [
      /^\/src/,                         // source — compiled into dist/ + dist-electron/
      /^\/\.storybook/,                 // Storybook config
      /^\/scripts/,                     // build scripts
      /^\/docs/,                        // architecture docs
      /^\/\.github/,                    // CI workflows
      /^\/forge\.config/,               // this file
      /^\/vite\.config/,                // Vite config (not needed at runtime)
      /^\/index\.html$/,                // source HTML (runtime uses dist/index.html)
      /^\/\.eslint/,                    // linter config
      /node_modules\/\.cache/,          // build caches
      /\.stories\.(jsx?|tsx?)$/,        // Storybook stories
    ],
  },

  rebuildConfig: {},

  // ── Hook: Vite build runs before packaging ────────────────────────────────────
  // Electron Forge has no native Vite support, so we trigger it here.
  // `vite build` compiles both the renderer (→ dist/) and the Electron
  // main + preload scripts (→ dist-electron/) in one pass.
  hooks: {
    generateAssets: async () => {
      console.log('\n  Running Vite build before packaging...\n');
      execSync('npx vite build', { stdio: 'inherit' });
      console.log('\n  Vite build complete.\n');
    },
  },

  // ── Makers (platform installers) ─────────────────────────────────────────────
  makers: [
    {
      name: '@electron-forge/maker-squirrel',   // Windows installer
      config: { name: 'DevBoard' },
    },
    {
      name: '@electron-forge/maker-zip',         // macOS zip (works without code-signing)
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',         // Linux .deb
      config: {
        options: {
          name:        'devboard',
          productName: 'DevBoard',
          description: 'Lumonus DevBoard — Kanban Task Manager demo',
          categories:  ['Utility'],
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',         // Linux .rpm
      config: {},
    },
  ],

  // ── Plugins ───────────────────────────────────────────────────────────────────
  plugins: [
    {
      // Unpacks native Node modules from the asar at runtime
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },

    // Electron Fuses — harden the binary at build time (before code-signing)
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]:                             false,
      [FuseV1Options.EnableCookieEncryption]:                true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]:  false,
      [FuseV1Options.EnableNodeCliInspectArguments]:         false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]:                   true,
    }),
  ],
};
