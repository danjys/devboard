/**
 * src/renderer/components/StatsPanel/StatsPanel.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Analytics view — replaces the Board when "Analytics" is selected in the Sidebar.
 *
 * Shows:
 *   • Summary KPI cards (Total / Todo / In Progress / Done)
 *   • Priority breakdown with visual progress bars
 *   • Completion rate donut-style metric
 *   • Recent activity feed (last 5 tasks created/modified)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import styles from './StatsPanel.module.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

function relativeTime(iso) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function KpiCard({ label, value, accent, sublabel }) {
  return (
    <div className={styles.kpiCard} style={{ '--kpi-accent': accent }}>
      <div className={styles.kpiValue}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
      {sublabel && <div className={styles.kpiSub}>{sublabel}</div>}
    </div>
  );
}

function ProgressBar({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className={styles.progressRow}>
      <div className={styles.progressMeta}>
        <span className={styles.progressLabel}>
          <span className={styles.progressDot} style={{ background: color }} />
          {label}
        </span>
        <span className={styles.progressCount}>{count} <span className={styles.progressPct}>({pct}%)</span></span>
      </div>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressFill}
          style={{ width: `${pct}%`, background: color }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function StatsPanel() {
  const { tasks } = useTasks();

  const stats = useMemo(() => {
    const total  = tasks.length;
    const byStatus = {
      todo:  tasks.filter(t => t.status === 'todo').length,
      doing: tasks.filter(t => t.status === 'doing').length,
      done:  tasks.filter(t => t.status === 'done').length,
    };
    const byPriority = {
      high:   tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low:    tasks.filter(t => t.priority === 'low').length,
    };
    const completionRate = total > 0 ? Math.round((byStatus.done / total) * 100) : 0;

    const recent = [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);

    return { total, byStatus, byPriority, completionRate, recent };
  }, [tasks]);

  const STATUS_COLORS = {
    todo:  'var(--color-col-todo)',
    doing: 'var(--color-col-doing)',
    done:  'var(--color-col-done)',
  };
  const PRIORITY_COLORS = {
    high:   'var(--color-priority-high)',
    medium: 'var(--color-priority-medium)',
    low:    'var(--color-priority-low)',
  };
  const STATUS_LABELS   = { todo: 'To Do', doing: 'In Progress', done: 'Done' };
  const PRIORITY_LABELS = { high: 'High', medium: 'Medium', low: 'Low' };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>Project health at a glance</p>
      </div>

      {/* ── KPI cards ────────────────────────────────────────────────── */}
      <div className={styles.kpiGrid}>
        <KpiCard label="Total Tasks"   value={stats.total}            accent="var(--color-primary)" sublabel="across all columns" />
        <KpiCard label="To Do"         value={stats.byStatus.todo}    accent="var(--color-col-todo)" />
        <KpiCard label="In Progress"   value={stats.byStatus.doing}   accent="var(--color-col-doing)" />
        <KpiCard label="Completed"     value={stats.byStatus.done}    accent="var(--color-col-done)"  sublabel={`${stats.completionRate}% done`} />
      </div>

      <div className={styles.columns}>
        {/* ── Status breakdown ─────────────────────────────────────── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Status breakdown</h2>
          <div className={styles.progressList}>
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <ProgressBar
                key={status}
                label={STATUS_LABELS[status]}
                count={count}
                total={stats.total}
                color={STATUS_COLORS[status]}
              />
            ))}
          </div>

          {/* Completion ring (CSS-only) */}
          <div className={styles.completionRing}>
            <svg viewBox="0 0 80 80" width="80" height="80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="var(--color-border)" strokeWidth="8"/>
              <circle
                cx="40" cy="40" r="32"
                fill="none"
                stroke="var(--color-col-done)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - stats.completionRate / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className={styles.ringLabel}>
              <span className={styles.ringPct}>{stats.completionRate}%</span>
              <span className={styles.ringText}>done</span>
            </div>
          </div>
        </section>

        {/* ── Priority breakdown ────────────────────────────────────── */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>Priority distribution</h2>
          <div className={styles.progressList}>
            {Object.entries(stats.byPriority).map(([priority, count]) => (
              <ProgressBar
                key={priority}
                label={PRIORITY_LABELS[priority]}
                count={count}
                total={stats.total}
                color={PRIORITY_COLORS[priority]}
              />
            ))}
          </div>
        </section>

        {/* ── Recent activity ───────────────────────────────────────── */}
        <section className={`${styles.card} ${styles.activityCard}`}>
          <h2 className={styles.cardTitle}>Recent tasks</h2>
          {stats.recent.length === 0 ? (
            <p className={styles.empty}>No tasks yet</p>
          ) : (
            <ul className={styles.activityList}>
              {stats.recent.map(task => (
                <li key={task.id} className={styles.activityItem}>
                  <span
                    className={styles.activityDot}
                    style={{ background: STATUS_COLORS[task.status] }}
                  />
                  <div className={styles.activityContent}>
                    <span className={styles.activityTitle}>{task.title}</span>
                    <span className={styles.activityMeta}>
                      <span style={{ color: PRIORITY_COLORS[task.priority], fontWeight: 600 }}>
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {' · '}{STATUS_LABELS[task.status]}
                      {' · '}{relativeTime(task.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
