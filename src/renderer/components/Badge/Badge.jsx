/**
 * src/renderer/components/Badge/Badge.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A small, reusable priority badge.
 * Keeps all priority→colour logic in one place.
 *
 * Props:
 *   priority – 'high' | 'medium' | 'low'
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import styles from './Badge.module.css';

const PRIORITY_META = {
  high:   { label: '● High',   className: 'high'   },
  medium: { label: '● Medium', className: 'medium' },
  low:    { label: '● Low',    className: 'low'    },
};

export default function Badge({ priority }) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.medium;

  return (
    <span
      className={`${styles.badge} ${styles[meta.className]}`}
      aria-label={`Priority: ${priority}`}
    >
      {meta.label}
    </span>
  );
}
