/**
 * src/renderer/components/Column/Column.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * A Kanban column that respects the active filter/search set.
 *
 * Cards not in `filteredIds` are dimmed (not hidden) so the column structure
 * is preserved and users can still see filtered-out tasks at low opacity.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../TaskCard/TaskCard';
import styles from './Column.module.css';

export default function Column({
  status,
  title,
  accentVar,
  filteredIds,
  isFiltering,
  isHighlighted,
  dragState,
  onDragStart,
  onDragOverColumn,
  onDrop,
  onDragEnd,
  onEditTask,
}) {
  const { tasksByStatus } = useTasks();
  const tasks       = tasksByStatus(status);
  const isDragTarget = dragState.overStatus === status && dragState.draggingId !== null;
  const visibleCount = isFiltering ? tasks.filter(t => filteredIds.has(t.id)).length : tasks.length;

  return (
    <section
      className={[
        styles.column,
        isDragTarget  ? styles.dragTarget  : '',
        isHighlighted ? styles.highlighted : '',
      ].join(' ')}
      style={{ '--accent': `var(${accentVar})` }}
      onDragOver={e => { e.preventDefault(); onDragOverColumn(status); }}
      onDrop={e => { e.preventDefault(); onDrop(status); }}
      aria-label={`${title} column, ${visibleCount} ${isFiltering ? 'matching' : ''} tasks`}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.accentBar} aria-hidden="true" />
        <h2 className={styles.title}>{title}</h2>
        <span className={styles.count}>{visibleCount}</span>
        {isFiltering && tasks.length > visibleCount && (
          <span className={styles.dimCount} title={`${tasks.length - visibleCount} hidden by filter`}>
            +{tasks.length - visibleCount}
          </span>
        )}
      </div>

      {/* ── Task list ────────────────────────────────────────────────── */}
      <div className={styles.taskList}>
        {tasks.length === 0 ? (
          <div className={styles.empty}>
            {isDragTarget ? '📥 Drop here' : 'No tasks yet'}
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={dragState.draggingId === task.id}
              isDimmed={isFiltering && !filteredIds.has(task.id)}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </section>
  );
}
