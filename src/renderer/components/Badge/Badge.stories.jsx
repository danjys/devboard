/**
 * Badge.stories.jsx
 * Displays the three priority variants side-by-side.
 */

import React from 'react';
import Badge from './Badge';

export default {
  title:     'Design System/Badge',
  component:  Badge,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A small pill that communicates task priority. ' +
          'All colour logic lives here — no other component needs to know priority colours.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    priority: {
      control: 'select',
      options: ['high', 'medium', 'low'],
      description: 'Task priority level',
    },
  },
};

// ── Stories ────────────────────────────────────────────────────────────────

export const High = {
  args: { priority: 'high' },
};

export const Medium = {
  args: { priority: 'medium' },
};

export const Low = {
  args: { priority: 'low' },
};

/** All three variants shown together — useful for design review */
export const AllVariants = {
  name: 'All Variants',
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 24 }}>
      <Badge priority="high"   />
      <Badge priority="medium" />
      <Badge priority="low"    />
    </div>
  ),
};
