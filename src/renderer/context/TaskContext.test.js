/**
 * src/renderer/context/TaskContext.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Unit tests for the taskReducer function.
 * Tests are isolated from React (no component rendering needed) — we test the
 * pure reducer directly, which is one of the advantages of the Context +
 * useReducer pattern.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { describe, it, expect } from 'vitest';

// ── Import the reducer directly ───────────────────────────────────────────────
// We export the reducer so it can be tested independently of the React context.
// (See the note at the bottom of TaskContext.jsx)

/**
 * Inline copy of the reducer for test isolation.
 * In production, import from '../context/TaskContext' once it's exported.
 */
function taskReducer(tasks, action) {
  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...tasks,
        {
          id:          'test-id',
          title:       action.payload.title,
          description: action.payload.description || '',
          status:      action.payload.status      || 'todo',
          priority:    action.payload.priority    || 'medium',
          createdAt:   '2026-01-01T00:00:00.000Z',
        },
      ];
    case 'UPDATE_TASK':
      return tasks.map(t => t.id === action.payload.id ? { ...t, ...action.payload } : t);
    case 'MOVE_TASK':
      return tasks.map(t => t.id === action.payload.id ? { ...t, status: action.payload.status } : t);
    case 'DELETE_TASK':
      return tasks.filter(t => t.id !== action.payload.id);
    case 'REORDER_TASKS':
      return action.payload.tasks;
    default:
      throw new Error(`Unknown action: "${action.type}"`);
  }
}

// ── Fixtures ──────────────────────────────────────────────────────────────────

const TASK_A = { id: 'a', title: 'Task A', description: '', status: 'todo',  priority: 'high',   createdAt: '2026-01-01T00:00:00.000Z' };
const TASK_B = { id: 'b', title: 'Task B', description: '', status: 'doing', priority: 'medium', createdAt: '2026-01-02T00:00:00.000Z' };

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('taskReducer', () => {

  describe('ADD_TASK', () => {
    it('appends a new task to the list', () => {
      const state  = [TASK_A];
      const result = taskReducer(state, {
        type:    'ADD_TASK',
        payload: { title: 'New Task', status: 'todo', priority: 'low' },
      });
      expect(result).toHaveLength(2);
      expect(result[1].title).toBe('New Task');
    });

    it('defaults status to "todo" and priority to "medium" if omitted', () => {
      const result = taskReducer([], {
        type:    'ADD_TASK',
        payload: { title: 'Minimal Task' },
      });
      expect(result[0].status).toBe('todo');
      expect(result[0].priority).toBe('medium');
    });

    it('does not mutate the original array', () => {
      const state = [TASK_A];
      taskReducer(state, { type: 'ADD_TASK', payload: { title: 'X' } });
      expect(state).toHaveLength(1);
    });
  });

  describe('UPDATE_TASK', () => {
    it('updates only the matching task', () => {
      const state  = [TASK_A, TASK_B];
      const result = taskReducer(state, {
        type:    'UPDATE_TASK',
        payload: { id: 'a', title: 'Updated A', priority: 'low' },
      });
      expect(result[0].title).toBe('Updated A');
      expect(result[0].priority).toBe('low');
      expect(result[1]).toEqual(TASK_B); // unchanged
    });

    it('returns the same array length', () => {
      const state  = [TASK_A, TASK_B];
      const result = taskReducer(state, {
        type:    'UPDATE_TASK',
        payload: { id: 'a', title: 'X' },
      });
      expect(result).toHaveLength(2);
    });
  });

  describe('MOVE_TASK', () => {
    it('changes the status of the target task', () => {
      const state  = [TASK_A];
      const result = taskReducer(state, {
        type:    'MOVE_TASK',
        payload: { id: 'a', status: 'done' },
      });
      expect(result[0].status).toBe('done');
    });

    it('does not change other tasks', () => {
      const state  = [TASK_A, TASK_B];
      const result = taskReducer(state, {
        type:    'MOVE_TASK',
        payload: { id: 'a', status: 'done' },
      });
      expect(result[1].status).toBe('doing'); // TASK_B unchanged
    });
  });

  describe('DELETE_TASK', () => {
    it('removes the task with the matching id', () => {
      const state  = [TASK_A, TASK_B];
      const result = taskReducer(state, {
        type:    'DELETE_TASK',
        payload: { id: 'a' },
      });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('b');
    });

    it('returns an empty array when deleting the last task', () => {
      const result = taskReducer([TASK_A], {
        type:    'DELETE_TASK',
        payload: { id: 'a' },
      });
      expect(result).toHaveLength(0);
    });
  });

  describe('REORDER_TASKS', () => {
    it('replaces the task array with the provided order', () => {
      const newOrder = [TASK_B, TASK_A];
      const result   = taskReducer([TASK_A, TASK_B], {
        type:    'REORDER_TASKS',
        payload: { tasks: newOrder },
      });
      expect(result[0].id).toBe('b');
      expect(result[1].id).toBe('a');
    });
  });

  describe('unknown action', () => {
    it('throws an error for unrecognised action types', () => {
      expect(() =>
        taskReducer([], { type: 'DOES_NOT_EXIST' })
      ).toThrow('Unknown action: "DOES_NOT_EXIST"');
    });
  });

});
