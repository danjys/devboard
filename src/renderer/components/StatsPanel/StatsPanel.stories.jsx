/**
 * StatsPanel.stories.jsx
 * Showcases the analytics view in realistic data scenarios.
 * Because StatsPanel reads from TaskContext, data is controlled
 * by seeding the context via a custom decorator rather than props.
 */

import React from 'react';
import { TaskProvider } from '../../context/TaskContext';
import StatsPanel from './StatsPanel';

// ── Seed helpers ───────────────────────────────────────────────────────────

/** Wraps stories in a TaskProvider pre-seeded with custom tasks via localStorage */
function withSeedData(tasks) {
  return (Story) => {
    // Inject seed tasks directly into localStorage so TaskContext picks them up
    const key = 'devboard-tasks';
    const prev = localStorage.getItem(key);
    localStorage.setItem(key, JSON.stringify(tasks));

    return (
      <TaskProvider>
        <div style={{ padding: 24, minHeight: '100vh' }}>
          <Story />
        </div>
        {/* Restore previous value after render (story isolation) */}
        {prev !== null && (() => { localStorage.setItem(key, prev); return null; })()}
      </TaskProvider>
    );
  };
}

// ── Sample datasets ────────────────────────────────────────────────────────

const now   = Date.now();
const t     = (offset) => new Date(now - offset).toISOString();

const FULL_BOARD = [
  { id: '1', title: 'Design dashboard layout',    description: 'Wireframes',       status: 'done',  priority: 'high',   createdAt: t(86_400_000 * 3) },
  { id: '2', title: 'Set up CI pipeline',          description: '',                  status: 'done',  priority: 'high',   createdAt: t(86_400_000 * 2) },
  { id: '3', title: 'Write unit tests',            description: 'Vitest suite',      status: 'doing', priority: 'medium', createdAt: t(3_600_000 * 5)  },
  { id: '4', title: 'Refactor Column component',   description: '',                  status: 'doing', priority: 'medium', createdAt: t(3_600_000 * 2)  },
  { id: '5', title: 'Add drag-and-drop support',   description: 'HTML5 DnD API',     status: 'todo',  priority: 'high',   createdAt: t(3_600_000)      },
  { id: '6', title: 'Update README screenshots',   description: '',                  status: 'todo',  priority: 'low',    createdAt: t(1_800_000)      },
  { id: '7', title: 'Integrate Storybook',          description: 'Component library', status: 'todo',  priority: 'medium', createdAt: t(900_000)        },
  { id: '8', title: 'Publish release v1.0',         description: '',                  status: 'todo',  priority: 'low',    createdAt: t(300_000)        },
];

const MOSTLY_DONE = FULL_BOARD.map(t => ({ ...t, status: 'done' }));

const EMPTY_BOARD = [];

// ── Default export ─────────────────────────────────────────────────────────

export default {
  title:     'Components/StatsPanel',
  component:  StatsPanel,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Analytics view rendered when the user selects "Analytics" in the Sidebar. ' +
          'Shows KPI cards (total/todo/doing/done), priority and status breakdowns, ' +
          'a CSS completion ring, and a recent-activity feed. ' +
          'All data sourced from `TaskContext` — no props required.',
      },
    },
    layout: 'fullscreen',
  },
};

// ── Stories ────────────────────────────────────────────────────────────────

export const TypicalBoard = {
  name: 'Typical Board (mixed states)',
  decorators: [withSeedData(FULL_BOARD)],
  render: () => <StatsPanel />,
};

export const MostlyComplete = {
  name: 'Mostly Complete (high % done)',
  decorators: [withSeedData(MOSTLY_DONE)],
  render: () => <StatsPanel />,
};

export const EmptyBoard = {
  name: 'Empty Board (no tasks)',
  decorators: [withSeedData(EMPTY_BOARD)],
  render: () => <StatsPanel />,
  parameters: {
    docs: {
      description: {
        story:
          'Handles the zero-task edge case gracefully — progress bars show 0%, ' +
          'KPI values show 0, and the completion ring is empty.',
      },
    },
  },
};
