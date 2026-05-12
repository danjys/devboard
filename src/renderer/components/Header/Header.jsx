/**
 * src/renderer/components/Header/Header.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Lumonus-branded top application bar.
 * Logo on the left (behind macOS traffic lights spacer), breadcrumb centred,
 * actions on the right. "New Task" uses the Lumonus outlined button style.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import { useTasks }    from '../../context/TaskContext';
import LumonusLogo     from '../LumonusLogo/LumonusLogo';
import styles          from './Header.module.css';

// ── Icons ─────────────────────────────────────────────────────────────────────

const SunIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1"  y1="12" x2="3"  y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36"/>
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5"  x2="12" y2="19"/>
    <line x1="5"  y1="12" x2="19" y2="12"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────

export default function Header({ theme, onThemeToggle, onAddTask }) {
  const { tasks, tasksByStatus } = useTasks();
  const [version, setVersion]    = useState(null);

  useEffect(() => {
    window.electronAPI?.getVersion().then(setVersion).catch(() => null);
  }, []);

  const doneCount  = tasksByStatus('done').length;
  const totalCount = tasks.length;
  const pct        = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  return (
    <header className={styles.header}>

      {/* ── Left: macOS traffic-light clearance + Lumonus logo ─────────── */}
      <div className={styles.left}>
        <div className={styles.trafficLightSpacer} />
        <LumonusLogo variant="full" size="sm" theme="dark" />
      </div>

      {/* ── Centre: breadcrumb + inline progress ────────────────────────── */}
      <div className={styles.centre}>
        <span className={styles.pageTitle}>Project Board</span>
        <span className={styles.dot} aria-hidden="true" />
        <div
          className={styles.progressWrap}
          title={`${doneCount} of ${totalCount} tasks complete`}
        >
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
          <span className={styles.progressLabel}>{pct}%</span>
        </div>
      </div>

      {/* ── Right: version chip · theme toggle · outlined CTA ───────────── */}
      <div className={styles.right}>
        {version && <span className={styles.version}>v{version}</span>}

        <button
          className={styles.iconBtn}
          onClick={onThemeToggle}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>

        {/* Lumonus outlined button style */}
        <button
          className={styles.addBtn}
          onClick={onAddTask}
          title="Add task"
          aria-label="Add new task"
        >
          <PlusIcon />
          <span>New Task</span>
        </button>
      </div>

    </header>
  );
}
