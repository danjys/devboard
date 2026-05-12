/**
 * Toast.stories.jsx
 * Shows all four notification types and a stacked multi-toast preview.
 */

import React from 'react';
import Toast from './Toast';

export default {
  title:     'Components/Toast',
  component:  Toast,
  tags:      ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Slide-in notification pill rendered by `ToastContext`. ' +
          'Do not mount this directly — call `useToast().show(message, type)` from any component.',
      },
    },
    layout: 'centered',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'warning', 'info'],
    },
    message:   { control: 'text' },
    onDismiss: { action: 'dismissed' },
  },
};

// ── Stories ────────────────────────────────────────────────────────────────

export const Success = {
  args: {
    type:      'success',
    message:   '"Design the dashboard" added to To Do',
    onDismiss: () => {},
  },
};

export const Error = {
  args: {
    type:      'error',
    message:   'Failed to save changes — please retry',
    onDismiss: () => {},
  },
};

export const Warning = {
  args: {
    type:      'warning',
    message:   '3 high-priority tasks are overdue',
    onDismiss: () => {},
  },
};

export const Info = {
  args: {
    type:      'info',
    message:   '"Setup CI pipeline" deleted',
    onDismiss: () => {},
  },
};

/** Stacked view — what multiple toasts look like together */
export const Stacked = {
  name: 'Stacked (multiple)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 300 }}>
      <Toast type="success" message='"Add drag-and-drop" added to To Do'          onDismiss={() => {}} />
      <Toast type="info"    message='"Write tests" deleted'                        onDismiss={() => {}} />
      <Toast type="warning" message='2 high-priority tasks still in To Do'         onDismiss={() => {}} />
      <Toast type="error"   message='Network error — changes may not have saved'  onDismiss={() => {}} />
    </div>
  ),
};
