/**
 * src/renderer/context/TaskContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Global task state managed with React Context + useReducer.
 *
 * Why not Redux?
 *   For a demo of this size, Context + useReducer gives the same predictable
 *   unidirectional data flow without extra dependencies.  It also makes the
 *   state logic easy to read — every action is a plain JS object.
 *
 * Data model:
 *   Task {
 *     id:          string   (uuid v4)
 *     title:       string
 *     description: string
 *     status:      'todo' | 'doing' | 'done'
 *     priority:    'high' | 'medium' | 'low'
 *     createdAt:   ISO string
 *   }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ── Storage key ───────────────────────────────────────────────────────────────
const STORAGE_KEY = 'devboard-tasks';

// ── Seed data (shown on first run) ────────────────────────────────────────────
const SEED_TASKS = [
  {
    id:          'seed-1',
    title:       'Evaluate Electron vs Tauri',
    description: 'Compare bundle size, performance, security model, and DX of both frameworks.',
    status:      'done',
    priority:    'high',
    createdAt:   new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id:          'seed-2',
    title:       'Set up React + Vite scaffold',
    description: 'Bootstrap vite-plugin-electron with HMR support for the renderer.',
    status:      'done',
    priority:    'high',
    createdAt:   new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id:          'seed-3',
    title:       'Design component architecture',
    description: 'Define component hierarchy, CSS module conventions, and state boundaries.',
    status:      'doing',
    priority:    'high',
    createdAt:   new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id:          'seed-4',
    title:       'Configure GitHub Actions CI',
    description: 'Lint + test on every PR; build installers on version tags.',
    status:      'doing',
    priority:    'medium',
    createdAt:   new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id:          'seed-5',
    title:       'Auto-generate architecture diagrams',
    description: 'Write update-docs.js script that scans src/ and regenerates architecture.mmd.',
    status:      'todo',
    priority:    'medium',
    createdAt:   new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id:          'seed-6',
    title:       'Add drag-and-drop between columns',
    description: 'Use the HTML5 Drag and Drop API to let cards move across columns.',
    status:      'todo',
    priority:    'low',
    createdAt:   new Date().toISOString(),
  },
];

// ── Reducer ───────────────────────────────────────────────────────────────────

/**
 * Pure function: takes the current task array and an action, returns the next state.
 * Each case is self-documenting.
 */
function taskReducer(tasks, action) {
  switch (action.type) {

    case 'ADD_TASK':
      return [
        ...tasks,
        {
          id:          uuidv4(),
          title:       action.payload.title,
          description: action.payload.description || '',
          status:      action.payload.status      || 'todo',
          priority:    action.payload.priority    || 'medium',
          createdAt:   new Date().toISOString(),
        },
      ];

    case 'UPDATE_TASK':
      return tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, ...action.payload }
          : task
      );

    case 'MOVE_TASK':
      // Move a task to a different status column
      return tasks.map(task =>
        task.id === action.payload.id
          ? { ...task, status: action.payload.status }
          : task
      );

    case 'DELETE_TASK':
      return tasks.filter(task => task.id !== action.payload.id);

    case 'REORDER_TASKS':
      // Replace all tasks with a reordered array (used after drag-and-drop)
      return action.payload.tasks;

    default:
      throw new Error(`Unknown action type: "${action.type}"`);
  }
}

// ── Context creation ──────────────────────────────────────────────────────────

const TaskContext = createContext(null);

/**
 * TaskProvider
 * Wraps the application and provides tasks + dispatch to any descendant.
 *
 * Persistence: tasks are read from localStorage on mount and synced back
 * after every state change.
 */
export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    taskReducer,
    [],
    // Lazy initialiser: runs once on mount to hydrate from localStorage
    () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : SEED_TASKS;
      } catch {
        return SEED_TASKS;
      }
    }
  );

  // Persist every change to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // ── Convenience action creators ──────────────────────────────────────────
  // These live here so consumers don't need to import action-type strings.

  const addTask    = (payload)          => dispatch({ type: 'ADD_TASK',     payload });
  const updateTask = (payload)          => dispatch({ type: 'UPDATE_TASK',  payload });
  const moveTask   = (id, status)       => dispatch({ type: 'MOVE_TASK',    payload: { id, status } });
  const deleteTask = (id)               => dispatch({ type: 'DELETE_TASK',  payload: { id } });
  const reorder    = (reorderedTasks)   => dispatch({ type: 'REORDER_TASKS',payload: { tasks: reorderedTasks } });

  // ── Derived selectors ────────────────────────────────────────────────────
  const tasksByStatus = (status) => tasks.filter(t => t.status === status);
  const totalCount    = tasks.length;

  return (
    <TaskContext.Provider value={{
      tasks,
      tasksByStatus,
      totalCount,
      addTask,
      updateTask,
      moveTask,
      deleteTask,
      reorder,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

// ── Custom hook ───────────────────────────────────────────────────────────────

/**
 * useTasks()
 * Consume the TaskContext.  Throws if used outside a <TaskProvider>.
 *
 * @returns {{ tasks, tasksByStatus, totalCount, addTask, updateTask, moveTask, deleteTask, reorder }}
 */
export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within a <TaskProvider>');
  return ctx;
}
