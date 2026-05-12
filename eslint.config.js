/**
 * eslint.config.js
 * Flat config format (ESLint 9+)
 */

import js           from '@eslint/js';
import reactPlugin  from 'eslint-plugin-react';
import reactHooks   from 'eslint-plugin-react-hooks';
import globals      from 'globals';

export default [
  // ── Ignore built artefacts ───────────────────────────────────────────────
  {
    ignores: ['dist/', 'dist-electron/', 'release/', 'coverage/'],
  },

  // ── Base JS rules ────────────────────────────────────────────────────────
  js.configs.recommended,

  // ── React + hooks rules ──────────────────────────────────────────────────
  {
    files: ['src/renderer/**/*.{js,jsx}'],
    plugins: {
      react:        reactPlugin,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types':      'off',     // TypeScript would handle this; skip for demo
      'react/react-in-jsx-scope': 'off',  // Not needed with React 17+ new JSX transform
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console':     'warn',
    },
  },

  // ── Node / Electron main process rules ───────────────────────────────────
  {
    files: ['src/main/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType:  'module',
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
