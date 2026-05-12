/**
 * SearchBar.stories.jsx
 * Shows the empty, active (with query + results), and no-results states.
 */

import React, { useState } from 'react';
import SearchBar from './SearchBar';

export default {
  title:     'Components/SearchBar',
  component:  SearchBar,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Real-time task search bar rendered in the Board toolbar. ' +
          'Controlled by App — passes the query up via `onSearch`. ' +
          'Escape clears. Shows a live result count when a query is active.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    value:       { control: 'text' },
    resultCount: { control: { type: 'number', min: 0 } },
    onChange:    { action: 'changed' },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Stories ────────────────────────────────────────────────────────────────

export const Empty = {
  args: {
    value:       '',
    resultCount: 0,
    onChange:    () => {},
  },
};

export const WithResults = {
  name: 'With Query + Results',
  args: {
    value:       'dashboard',
    resultCount: 3,
    onChange:    () => {},
  },
};

export const NoResults = {
  name: 'No Results',
  args: {
    value:       'xyz123',
    resultCount: 0,
    onChange:    () => {},
  },
};

export const SingleResult = {
  name: 'Single Result',
  args: {
    value:       'ci pipeline',
    resultCount: 1,
    onChange:    () => {},
  },
};

/** Fully interactive — type and watch the result count update */
export const Interactive = {
  name: 'Interactive (type to search)',
  render: () => {
    const TASKS = [
      'Design the analytics dashboard',
      'Set up CI pipeline',
      'Write unit tests for reducer',
      'Refactor Column component props',
      'Update README screenshots',
    ];

    const [query, setQuery] = useState('');
    const matches = query
      ? TASKS.filter(t => t.toLowerCase().includes(query.toLowerCase()))
      : TASKS;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 24 }}>
        <SearchBar value={query} onChange={setQuery} resultCount={matches.length} />
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {matches.map(t => (
            <li
              key={t}
              style={{
                padding: '8px 12px',
                background: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              }}
            >
              {t}
            </li>
          ))}
          {matches.length === 0 && (
            <li style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', padding: '8px 12px' }}>
              No tasks match "{query}"
            </li>
          )}
        </ul>
      </div>
    );
  },
};
