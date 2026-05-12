/**
 * .storybook/preview.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global Storybook configuration.
 *
 * Decorators:
 *   Every story is automatically wrapped with TaskProvider + ToastProvider
 *   so components that call useTasks() or useToast() work without any
 *   boilerplate in each story file.
 *
 * Theme:
 *   The data-theme attribute is set on <html> matching the Storybook
 *   background selector, so the Lumonus light/dark tokens apply correctly.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect } from 'react';
import { TaskProvider }  from '../src/renderer/context/TaskContext';
import { ToastProvider } from '../src/renderer/context/ToastContext';
import '../src/renderer/styles/globals.css';

// ── Theme sync decorator ──────────────────────────────────────────────────────
// Watches Storybook's background selection and mirrors it to data-theme on <html>
// so all CSS custom-property tokens update automatically.

function ThemeDecorator({ children, globals }) {
  const isDark = globals?.backgrounds?.value === '#07080d' || globals?.backgrounds?.value === undefined;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {children}
    </div>
  );
}

// ── Global decorators ─────────────────────────────────────────────────────────
// Applied to every story in the project — no need to repeat in individual files.

export const decorators = [
  (Story, context) => (
    <TaskProvider>
      <ToastProvider>
        <ThemeDecorator globals={context.globals}>
          <Story />
        </ThemeDecorator>
      </ToastProvider>
    </TaskProvider>
  ),
];

// ── Global parameters ─────────────────────────────────────────────────────────

export const parameters = {
  // Background colours matching the Lumonus design system
  backgrounds: {
    default: 'lumonus-dark',
    values: [
      { name: 'lumonus-dark',  value: '#07080d' },
      { name: 'lumonus-light', value: '#f0f2f8' },
      { name: 'surface',       value: '#0e1018' },
    ],
  },

  // Responsive viewports for desktop-app sizing
  viewport: {
    viewports: {
      desktop:      { name: 'Desktop 1280',  styles: { width: '1280px', height: '800px'  } },
      desktopLarge: { name: 'Desktop 1440',  styles: { width: '1440px', height: '900px'  } },
      compact:      { name: 'Compact 900',   styles: { width: '900px',  height: '600px'  } },
    },
    defaultViewport: 'desktop',
  },

  // Auto-docs layout
  docs: {
    theme: undefined, // uses Storybook default; swap for @storybook/theming custom theme
  },

  // Suppress the "missing controls" warning for components with no props
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date:  /Date$/i,
    },
  },
};

export const globalTypes = {
  theme: {
    name:        'Theme',
    description: 'Lumonus colour theme',
    defaultValue: 'dark',
    toolbar: {
      icon:  'circlehollow',
      items: ['dark', 'light'],
      showName: true,
    },
  },
};
