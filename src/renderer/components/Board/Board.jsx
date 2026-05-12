/**
 * src/renderer/components/Board/Board.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Kanban board with toolbar (SearchBar + FilterBar) and drag-and-drop.
 *
 * Props:
 *   onEditTask        – (task) => void
 *   filterPriority    – 'all' | 'high' | 'medium' | 'low'
 *   onFilterChange    – (priority) => void
 *   searchQuery       – string
 *   onSearchChange    – (query) => void
 *   highlightedStatus – string | null
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useTasks } from '../../context/TaskContext';
import Column    from '../Column/Column';
import SearchBar from '../SearchBar/SearchBar';
import FilterBar from '../FilterBar/FilterBar';
import styles from './Board.module.css';

const COLUMNS = [
  { status: 'todo',  title: 'To Do',       accentVar: '--color-col-todo'  },
  { status: 'doing', title: 'In Progress',  accentVar: '--color-col-doing' },
  { status: 'done',  title: 'Done',         accentVar: '--color-col-done'  },
];

export default function Board({
  onEditTask,
  filterPriority,
  onFilterChange,
  searchQuery,
  onSearchChange,
  highlightedStatus,
}) {
  const { tasks, moveTask } = useTasks();

  // ── Derived: filter tasks globally ────────────────────────────────────────
  // Both the FilterBar count and Column task lists use this same filtered set.
  const filteredTasks = useMemo(() => {
    let result = tasks;
    if (filterPriority !== 'all') {
      result = result.filter(t => t.priority === filterPriority);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [tasks, filterPriority, searchQuery]);

  const filteredIds = useMemo(() => new Set(filteredTasks.map(t => t.id)), [filteredTasks]);

  // ── Drag state ─────────────────────────────────────────────────────────────
  const [dragState, setDragState] = useState({ draggingId: null, overStatus: null });

  const handleDragStart       = useCallback((id)     => setDragState(s => ({ ...s, draggingId: id })), []);
  const handleDragOverColumn  = useCallback((status) => setDragState(s => s.overStatus === status ? s : { ...s, overStatus: status }), []);
  const handleDrop            = useCallback((status) => { if (dragState.draggingId) moveTask(dragState.draggingId, status); setDragState({ draggingId: null, overStatus: null }); }, [dragState.draggingId, moveTask]);
  const handleDragEnd         = useCallback(()       => setDragState({ draggingId: null, overStatus: null }), []);

  const isFiltering = filterPriority !== 'all' || searchQuery.trim().length > 0;

  return (
    <div className={styles.boardWrapper}>
      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <FilterBar activeFilter={filterPriority} onFilterChange={onFilterChange} />
        <div className={styles.toolbarRight}>
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            resultCount={filteredTasks.length}
          />
          {isFiltering && (
            <button
              className={styles.clearFiltersBtn}
              onClick={() => { onFilterChange('all'); onSearchChange(''); }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ── Columns ─────────────────────────────────────────────────── */}
      <div className={styles.board}>
        {COLUMNS.map(col => (
          <Column
            key={col.status}
            status={col.status}
            title={col.title}
            accentVar={col.accentVar}
            filteredIds={filteredIds}
            isFiltering={isFiltering}
            isHighlighted={highlightedStatus === col.status}
            dragState={dragState}
            onDragStart={handleDragStart}
            onDragOverColumn={handleDragOverColumn}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
}
