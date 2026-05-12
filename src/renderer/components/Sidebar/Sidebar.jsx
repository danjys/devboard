/**
 * src/renderer/components/Sidebar/Sidebar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Fully interactive left navigation panel.
 *
 * Sections:
 *   WORKSPACE  — Board view / Analytics view switcher
 *   BOARD      — Per-column status counts; click to highlight a column
 *   FILTERS    — Priority filter pills; click to filter task cards
 *   QUICK STATS— Compact metrics summary
 *
 * Props:
 *   activeView        – 'board' | 'analytics'
 *   onViewChange      – (view) => void
 *   activeFilter      – 'all' | 'high' | 'medium' | 'low'
 *   onFilterChange    – (priority) => void
 *   highlightedStatus – string | null  (which column to glow)
 *   onStatusHighlight – (status | null) => void
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { useTasks }   from '../../context/TaskContext';
import LumonusLogo    from '../LumonusLogo/LumonusLogo';
import styles         from './Sidebar.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

const BoardIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="9" rx="1"/>
    <rect x="14" y="3" width="7" height="5" rx="1"/>
    <rect x="14" y="12" width="7" height="9" rx="1"/>
    <rect x="3" y="16" width="7" height="5" rx="1"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6"  y1="20" x2="6"  y2="14"/>
    <line x1="2"  y1="20" x2="22" y2="20"/>
  </svg>
);

// ── Constants ─────────────────────────────────────────────────────────────────

const VIEWS = [
  { id: 'board',     label: 'Board',     Icon: BoardIcon },
  { id: 'analytics', label: 'Analytics', Icon: ChartIcon  },
];

const STATUS_ITEMS = [
  { status: 'todo',  label: 'To Do',      emoji: '📝', accentVar: '--color-col-todo'  },
  { status: 'doing', label: 'In Progress', emoji: '⚡', accentVar: '--color-col-doing' },
  { status: 'done',  label: 'Done',        emoji: '✅', accentVar: '--color-col-done'  },
];

const PRIORITY_FILTERS = [
  { value: 'all',    label: 'All priorities', dot: null },
  { value: 'high',   label: 'High',  dot: 'var(--color-priority-high)'   },
  { value: 'medium', label: 'Medium', dot: 'var(--color-priority-medium)' },
  { value: 'low',    label: 'Low',   dot: 'var(--color-priority-low)'    },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Sidebar({
  activeView,
  onViewChange,
  activeFilter,
  onFilterChange,
  highlightedStatus,
  onStatusHighlight,
}) {
  const { tasks, tasksByStatus } = useTasks();

  const priorityCounts = tasks.reduce((acc, t) => {
    acc[t.priority] = (acc[t.priority] || 0) + 1;
    return acc;
  }, {});

  return (
    <aside className={styles.sidebar}>

      {/* ── Lumonus brand ─────────────────────────────────────────────── */}
      <div className={styles.brand}>
        <LumonusLogo variant="full" size="sm" theme="dark" />
        <span className={styles.brandProduct}>DevBoard</span>
      </div>

      {/* ── WORKSPACE: view switcher ───────────────────────────────────── */}
      <nav className={styles.section} aria-label="Views">
        <div className={styles.sectionLabel}>Workspace</div>
        {VIEWS.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`${styles.navItem} ${activeView === id ? styles.navItemActive : ''}`}
            onClick={() => onViewChange(id)}
            aria-current={activeView === id ? 'page' : undefined}
          >
            <span className={styles.navIcon}><Icon /></span>
            <span className={styles.navLabel}>{label}</span>
            {activeView === id && <span className={styles.activePip} aria-hidden="true"/>}
          </button>
        ))}
      </nav>

      <div className={styles.divider} />

      {/* ── BOARD: status column items ────────────────────────────────── */}
      <nav className={styles.section} aria-label="Board columns">
        <div className={styles.sectionLabel}>Columns</div>
        <p className={styles.sectionHint}>Click to highlight a column</p>
        {STATUS_ITEMS.map(({ status, label, emoji, accentVar }) => {
          const count     = tasksByStatus(status).length;
          const isHighlit = highlightedStatus === status;

          return (
            <button
              key={status}
              className={`${styles.navItem} ${isHighlit ? styles.navItemHighlit : ''}`}
              style={{ '--item-accent': `var(${accentVar})` }}
              onClick={() => onStatusHighlight(isHighlit ? null : status)}
              aria-pressed={isHighlit}
            >
              <span className={styles.navEmoji} aria-hidden="true">{emoji}</span>
              <span className={styles.navLabel}>{label}</span>
              <span
                className={styles.statusBadge}
                style={{ background: `var(${accentVar})` }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <div className={styles.divider} />

      {/* ── FILTERS: priority ─────────────────────────────────────────── */}
      <nav className={styles.section} aria-label="Priority filters">
        <div className={styles.sectionLabel}>Priority Filter</div>
        {PRIORITY_FILTERS.map(({ value, label, dot }) => {
          const count     = value === 'all' ? tasks.length : (priorityCounts[value] || 0);
          const isActive  = activeFilter === value;

          return (
            <button
              key={value}
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
              onClick={() => onFilterChange(value)}
              aria-pressed={isActive}
            >
              {dot
                ? <span className={styles.priorityDot} style={{ background: dot }} aria-hidden="true" />
                : <span className={styles.navIcon} style={{ opacity: 0.4 }}>≡</span>
              }
              <span className={styles.navLabel}>{label}</span>
              <span className={styles.navCount}>{count}</span>
            </button>
          );
        })}
      </nav>

      <div className={styles.divider} />

      {/* ── QUICK STATS ───────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Quick Stats</div>
        <div className={styles.quickStats}>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Total</span>
            <span className={styles.statValue}>{tasks.length}</span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>Completion</span>
            <span className={styles.statValue} style={{ color: 'var(--color-col-done)' }}>
              {tasks.length > 0
                ? `${Math.round((tasksByStatus('done').length / tasks.length) * 100)}%`
                : '—'}
            </span>
          </div>
          <div className={styles.statRow}>
            <span className={styles.statLabel}>High priority</span>
            <span className={styles.statValue} style={{ color: 'var(--color-priority-high)' }}>
              {priorityCounts.high || 0}
            </span>
          </div>
        </div>
      </div>

    </aside>
  );
}
