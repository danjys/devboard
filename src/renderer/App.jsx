/**
 * src/renderer/App.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Root application component.
 *
 * State managed here:
 *   theme           – 'light' | 'dark'   (persisted to localStorage)
 *   activeView      – 'board' | 'analytics'
 *   filterPriority  – 'all' | 'high' | 'medium' | 'low'
 *   searchQuery     – string
 *   highlightedStatus – string | null   (sidebar column highlight)
 *   modal           – { open: bool, editingTask: Task | null }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect } from 'react';

import Header     from './components/Header/Header';
import Sidebar    from './components/Sidebar/Sidebar';
import Board      from './components/Board/Board';
import StatsPanel from './components/StatsPanel/StatsPanel';
import TaskModal  from './components/TaskModal/TaskModal';

import styles from './App.module.css';

export default function App() {
  // ── Theme ──────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(
    () => localStorage.getItem('devboard-theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('devboard-theme', theme);
    window.electronAPI?.toggleTheme(theme);
  }, [theme]);

  // ── View + filters ────────────────────────────────────────────────────────
  const [activeView,       setActiveView]       = useState('board');
  const [filterPriority,   setFilterPriority]   = useState('all');
  const [searchQuery,      setSearchQuery]       = useState('');
  const [highlightedStatus, setHighlightedStatus] = useState(null);

  // Clear filters when switching views
  function handleViewChange(view) {
    setActiveView(view);
    setFilterPriority('all');
    setSearchQuery('');
    setHighlightedStatus(null);
  }

  // ── Modal ──────────────────────────────────────────────────────────────────
  const [modal, setModal] = useState({ open: false, editingTask: null });

  const openAddModal  = ()     => setModal({ open: true,  editingTask: null });
  const openEditModal = (task) => setModal({ open: true,  editingTask: task });
  const closeModal    = ()     => setModal({ open: false, editingTask: null });

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={styles.appShell}>
      <Header
        theme={theme}
        onThemeToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onAddTask={openAddModal}
      />

      <div className={styles.contentArea}>
        <Sidebar
          activeView={activeView}
          onViewChange={handleViewChange}
          activeFilter={filterPriority}
          onFilterChange={setFilterPriority}
          highlightedStatus={highlightedStatus}
          onStatusHighlight={setHighlightedStatus}
        />

        <main className={styles.main}>
          {activeView === 'board' ? (
            <Board
              onEditTask={openEditModal}
              filterPriority={filterPriority}
              onFilterChange={setFilterPriority}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              highlightedStatus={highlightedStatus}
            />
          ) : (
            <StatsPanel />
          )}
        </main>
      </div>

      {modal.open && (
        <TaskModal editingTask={modal.editingTask} onClose={closeModal} />
      )}
    </div>
  );
}
