/**
 * TaskCard.stories.jsx
 * Shows all meaningful card states: priorities, with/without description,
 * and the dimmed (filtered-out) state.
 */

import React from 'react';
import TaskCard from './TaskCard';

// ── Sample data ───────────────────────────────────────────────────────────────

const BASE_TASK = {
  id:          'story-1',
  title:       'Design the analytics dashboard layout',
  description: 'Create wireframes and get sign-off before implementation begins.',
  status:      'todo',
  priority:    'high',
  createdAt:   new Date(Date.now() - 2 * 3600 * 1000).toISOString(), // 2h ago
};

const noop = () => {};

export default {
  title:     'Components/TaskCard',
  component:  TaskCard,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A draggable task card. Edit and delete actions appear on hover. ' +
          'The `isDimmed` prop is set by the Board when a priority filter is active ' +
          'and this card does not match — it dims rather than hides to preserve board structure.',
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320, margin: '0 auto', padding: 24 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    priority: { control: 'select', options: ['high', 'medium', 'low'] },
    isDimmed: { control: 'boolean' },
  },
};

// ── Stories ────────────────────────────────────────────────────────────────

export const HighPriority = {
  name: 'High Priority',
  args: {
    task: { ...BASE_TASK, priority: 'high' },
    isDragging: false,
    isDimmed:   false,
    onDragStart: noop,
    onDragEnd:   noop,
    onEdit:      noop,
  },
};

export const MediumPriority = {
  name: 'Medium Priority',
  args: {
    task: { ...BASE_TASK, priority: 'medium', title: 'Refactor the Column component props', description: '' },
    isDragging: false,
    isDimmed:   false,
    onDragStart: noop,
    onDragEnd:   noop,
    onEdit:      noop,
  },
};

export const LowPriority = {
  name: 'Low Priority',
  args: {
    task: { ...BASE_TASK, priority: 'low', title: 'Update the README screenshots' },
    isDragging: false,
    isDimmed:   false,
    onDragStart: noop,
    onDragEnd:   noop,
    onEdit:      noop,
  },
};

export const NoDescription = {
  name: 'No Description',
  args: {
    task: { ...BASE_TASK, description: '' },
    isDragging:  false,
    isDimmed:    false,
    onDragStart: noop,
    onDragEnd:   noop,
    onEdit:      noop,
  },
};

export const Dimmed = {
  name: 'Dimmed (filtered out)',
  args: {
    task:        BASE_TASK,
    isDragging:  false,
    isDimmed:    true,
    onDragStart: noop,
    onDragEnd:   noop,
    onEdit:      noop,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When a priority filter is active in the FilterBar and this card does not match, ' +
          '`isDimmed` is set to `true`. The card stays visible at low opacity so users can ' +
          'still see the board structure.',
      },
    },
  },
};

/** Show three cards together to simulate a real column */
export const ColumnPreview = {
  name: 'Column Preview (3 cards)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
      <TaskCard task={{ ...BASE_TASK, id: 'a', priority: 'high'   }} isDragging={false} isDimmed={false} onDragStart={noop} onDragEnd={noop} onEdit={noop} />
      <TaskCard task={{ ...BASE_TASK, id: 'b', priority: 'medium', title: 'Write unit tests for reducer' }} isDragging={false} isDimmed={false} onDragStart={noop} onDragEnd={noop} onEdit={noop} />
      <TaskCard task={{ ...BASE_TASK, id: 'c', priority: 'low',    title: 'Update changelog' }} isDragging={false} isDimmed={true}  onDragStart={noop} onDragEnd={noop} onEdit={noop} />
    </div>
  ),
};
