/**
 * src/renderer/components/TaskModal/TaskModal.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Add / Edit task modal. Shows a toast on success via useToast.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useToast } from '../../context/ToastContext';
import styles from './TaskModal.module.css';

export default function TaskModal({ editingTask, onClose }) {
  const { addTask, updateTask } = useTasks();
  const { show }                = useToast();
  const isEditing               = Boolean(editingTask);
  const titleRef                = useRef(null);

  const [form, setForm] = useState({
    title:       editingTask?.title       ?? '',
    description: editingTask?.description ?? '',
    status:      editingTask?.status      ?? 'todo',
    priority:    editingTask?.priority    ?? 'medium',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => { titleRef.current?.focus(); }, []);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const clean = { ...form, title: form.title.trim() };
    if (isEditing) {
      updateTask({ ...editingTask, ...clean });
      show(`"${clean.title}" updated`, 'success');
    } else {
      addTask(clean);
      show(`"${clean.title}" added to ${clean.status === 'todo' ? 'To Do' : clean.status === 'doing' ? 'In Progress' : 'Done'}`, 'success');
    }
    onClose();
  }

  return (
    <div
      className={styles.backdrop}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog" aria-modal="true"
      aria-label={isEditing ? 'Edit task' : 'New task'}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <span className={styles.modalIcon}>{isEditing ? '✏️' : '✨'}</span>
            <h2 className={styles.modalTitle}>{isEditing ? 'Edit Task' : 'New Task'}</h2>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.modalBody}>
            <div className={styles.field}>
              <label htmlFor="task-title" className={styles.label}>Title <span className={styles.required}>*</span></label>
              <input ref={titleRef} id="task-title" name="title" type="text"
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
                value={form.title} onChange={handleChange}
                placeholder="What needs to be done?" maxLength={120}
              />
              {errors.title && <span className={styles.errorMsg} role="alert">{errors.title}</span>}
            </div>

            <div className={styles.field}>
              <label htmlFor="task-desc" className={styles.label}>Description</label>
              <textarea id="task-desc" name="description" className={styles.textarea}
                value={form.description} onChange={handleChange}
                placeholder="Add more detail (optional)…" rows={3} maxLength={500}
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label htmlFor="task-status" className={styles.label}>Status</label>
                <select id="task-status" name="status" className={styles.select} value={form.status} onChange={handleChange}>
                  <option value="todo">📝 To Do</option>
                  <option value="doing">⚡ In Progress</option>
                  <option value="done">✅ Done</option>
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor="task-priority" className={styles.label}>Priority</label>
                <select id="task-priority" name="priority" className={styles.select} value={form.priority} onChange={handleChange}>
                  <option value="high">🔴 High</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="low">🟢 Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitBtn}>
              {isEditing ? 'Save Changes' : '✨ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
