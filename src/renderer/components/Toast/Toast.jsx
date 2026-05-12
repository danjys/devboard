/**
 * src/renderer/components/Toast/Toast.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Individual toast notification pill.
 * Rendered by ToastContext — do not mount directly.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
};

export default function Toast({ message, type = 'success', onDismiss }) {
  const [visible, setVisible] = useState(false);

  // Trigger entrance animation on next tick
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : ''}`}
      role="alert"
      aria-live="polite"
    >
      <span className={`${styles.icon} ${styles[type]}`}>{ICONS[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onDismiss} aria-label="Dismiss">✕</button>
    </div>
  );
}
