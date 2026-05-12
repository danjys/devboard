/**
 * FilterBar.stories.jsx
 * Interactive story — use the Controls panel to change activeFilter.
 */

import React, { useState } from 'react';
import FilterBar from './FilterBar';

export default {
  title:     'Components/FilterBar',
  component:  FilterBar,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Priority filter pill-bar rendered above the Kanban columns. ' +
          'Each chip shows a live task count sourced from TaskContext. ' +
          'The active filter is highlighted and updates the Board via `onFilterChange`.',
      },
    },
    layout: 'padded',
  },
  argTypes: {
    activeFilter: {
      control: 'select',
      options: ['all', 'high', 'medium', 'low'],
    },
    onFilterChange: { action: 'filter changed' },
  },
};

// ── Stories ────────────────────────────────────────────────────────────────

export const Default = {
  args: {
    activeFilter:   'all',
    onFilterChange: () => {},
  },
};

export const HighActive = {
  name: 'High Priority Active',
  args: {
    activeFilter:   'high',
    onFilterChange: () => {},
  },
};

export const MediumActive = {
  name: 'Medium Priority Active',
  args: {
    activeFilter:   'medium',
    onFilterChange: () => {},
  },
};

/** Fully interactive version — click the chips and the selection updates */
export const Interactive = {
  name: 'Interactive (click chips)',
  render: () => {
    const [filter, setFilter] = useState('all');
    return (
      <div style={{ padding: 24 }}>
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--color-text-muted)' }}>
          Active filter: <strong style={{ color: 'var(--color-primary)' }}>{filter}</strong>
        </p>
      </div>
    );
  },
};
