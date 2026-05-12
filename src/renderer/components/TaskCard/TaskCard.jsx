/**
 * src/renderer/components/TaskCard/TaskCard.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Individual draggable task card with hover actions.
 * isDimmed prop is set when the card is filtered out.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useCallback } from 'react';
import { useTasks }  from '../../context/TaskContext';
import { useToast }  from '../../context/ToastContext';
import Badge         from '../Badge/Badge';
import styles        from './TaskCard.module.css';

function relativeTime(iso) {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const EditIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
);

export default function TaskCard({ task, isDragging, isDimmed, onDragStart, onDragEnd, onEdit }) {
  const { deleteTask } = useTasks();
  const { show }       = useToast();

  const handleDragStart = useCallback((e) => {
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => onDragStart(task.id), 0);
  }, [task.id, onDragStart]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
      show(`"${task.title}" deleted`, 'info');
    }
  }, [task, deleteTask, show]);

  return (
    <article
      className={[
        styles.card,
        isDragging ? styles.dragging : '',
        isDimmed   ? styles.dimmed   : '',
      ].join(' ')}
      draggable={!isDimmed}
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      aria-label={`Task: ${task.title}, priority ${task.priority}`}
    >
      <div className={styles.topRow}>
        <Badge priority={task.priority} />
        <div className={styles.actions}>
          <button className={styles.actionBtn}                  onClick={() => onEdit(task)} title="Edit"   aria-label="Edit task">  <EditIcon  /></button>
          <button className={`${styles.actionBtn} ${styles.danger}`} onClick={handleDelete}       title="Delete" aria-label="Delete task"><TrashIcon /></button>
        </div>
      </div>

      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.description}>{task.description}</p>}

      <div className={styles.footer}>
        <time className={styles.timestamp} dateTime={task.createdAt} title={new Date(task.createdAt).toLocaleString()}>
          {relativeTime(task.createdAt)}
        </time>
      </div>
    </article>
  );
}
