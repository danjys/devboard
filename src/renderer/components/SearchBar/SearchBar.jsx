/**
 * src/renderer/components/SearchBar/SearchBar.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Real-time task search input.
 * Controlled by App.jsx — passes the query up via onSearch.
 *
 * Keyboard: Escape clears the current query.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useRef } from 'react';
import styles from './SearchBar.module.css';

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const ClearIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6"  y1="6" x2="18" y2="18"/>
  </svg>
);

export default function SearchBar({ value, onChange, resultCount }) {
  const inputRef = useRef(null);

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      onChange('');
      inputRef.current?.blur();
    }
  }

  const hasQuery = value.length > 0;

  return (
    <div className={`${styles.wrapper} ${hasQuery ? styles.active : ''}`}>
      <span className={styles.searchIcon} aria-hidden="true"><SearchIcon /></span>

      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search tasks…"
        aria-label="Search tasks"
      />

      {hasQuery && (
        <>
          <span className={styles.resultCount} aria-live="polite">
            {resultCount} {resultCount === 1 ? 'result' : 'results'}
          </span>
          <button
            className={styles.clearBtn}
            onClick={() => { onChange(''); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            <ClearIcon />
          </button>
        </>
      )}
    </div>
  );
}
