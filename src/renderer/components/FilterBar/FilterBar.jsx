/**
 * src/renderer/components/FilterBar/FilterBar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Priority filter pill-bar rendered above the Kanban columns.
 * Shows the count of tasks for each priority level and highlights the active filter.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { useTasks } from '../../context/TaskContext';
import styles from './FilterBar.module.css';

const FILTERS = [
  { value: 'all',    label: 'All',    color: null },
  { value: 'high',   label: 'High',   color: 'high'   },
  { value: 'medium', label: 'Medium', color: 'medium' },
  { value: 'low',    label: 'Low',    color: 'low'    },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  const { tasks } = useTasks();

  const countFor = (priority) =>
    priority === 'all'
      ? tasks.length
      : tasks.filter(t => t.priority === priority).length;

  return (
    <div className={styles.bar} role="group" aria-label="Filter by priority">
      {FILTERS.map(f => {
        const isActive = activeFilter === f.value;
        const count    = countFor(f.value);

        return (
          <button
            key={f.value}
            className={`${styles.chip} ${isActive ? styles.active : ''} ${f.color ? styles[f.color] : ''}`}
            onClick={() => onFilterChange(f.value)}
            aria-pressed={isActive}
          >
            {f.color && <span className={styles.dot} aria-hidden="true" />}
            <span className={styles.chipLabel}>{f.label}</span>
            <span className={styles.chipCount}>{count}</span>
          </button>
        );
      })}
    </div>
  );
}
