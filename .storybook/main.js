/**
 * .storybook/main.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Storybook configuration for DevBoard (React + Vite).
 *
 * Framework: @storybook/react-vite
 *   Uses the same Vite config as the app — CSS Modules, path aliases, and
 *   HMR all work identically in Storybook as they do in the Electron renderer.
 *
 * Story discovery:
 *   Looks for *.stories.jsx alongside each component file.
 *   Convention: src/renderer/components/Badge/Badge.stories.jsx
 *
 * Future languages (Python / C#):
 *   Storybook covers React components only.
 *   For a unified multi-language docs hub, plug this Storybook build into
 *   Docusaurus via @docusaurus/plugin-content-docs or as an iframe embed.
 *   Python docs → Sphinx / pdoc → same Docusaurus site
 *   C# docs     → DocFX        → same Docusaurus site
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  // ── Story file locations ──────────────────────────────────────────────────
  stories: [
    '../src/**/*.mdx',                   // MDX documentation pages
    '../src/**/*.stories.@(js|jsx|ts|tsx)', // Component stories
  ],

  // ── Addons ────────────────────────────────────────────────────────────────
  addons: [
    '@storybook/addon-essentials',   // Controls, Actions, Docs, Viewport, Backgrounds
    '@storybook/addon-interactions', // Play functions / interaction testing
    '@storybook/addon-links',        // Cross-story navigation
  ],

  // ── Framework: React + Vite ───────────────────────────────────────────────
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // ── Docs ──────────────────────────────────────────────────────────────────
  docs: {
    autodocs: 'tag', // Generate docs page for stories tagged with autodocs
  },
};

export default config;
