/**
 * LumonusLogo.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Lumonus brand mark — concentric halo rings + wordmark.
 * Faithfully reflects the radial / halo visual language from lumonus.com.
 *
 * Props:
 *   variant  — 'full' (mark + wordmark) | 'mark' (icon only) | 'wordmark'
 *   size     — 'sm' | 'md' | 'lg'
 *   theme    — 'dark' | 'light'  (defaults to matching current CSS theme)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React from 'react';
import styles from './LumonusLogo.module.css';

// ── Brand Mark ────────────────────────────────────────────────────────────────
// Concentric circles with a gradient shimmer — the "halo" motif from lumonus.com

function BrandMark({ size = 28 }) {
  const cx = size / 2;
  const cy = size / 2;
  const id = 'lmn-grad';

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={id} cx="38%" cy="38%" r="65%">
          <stop offset="0%"   stopColor="#c4b0ff" />
          <stop offset="45%"  stopColor="#8b6dfd" />
          <stop offset="100%" stopColor="#5b3de8" />
        </radialGradient>
        {/* Glow filter */}
        <filter id="lmn-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer halo ring */}
      <circle
        cx={cx} cy={cy}
        r={cx - 1}
        stroke={`url(#${id})`}
        strokeWidth="1"
        strokeOpacity="0.35"
      />
      {/* Mid halo ring */}
      <circle
        cx={cx} cy={cy}
        r={cx * 0.72}
        stroke={`url(#${id})`}
        strokeWidth="1.1"
        strokeOpacity="0.55"
      />
      {/* Inner halo ring */}
      <circle
        cx={cx} cy={cy}
        r={cx * 0.46}
        stroke={`url(#${id})`}
        strokeWidth="1.2"
        strokeOpacity="0.8"
      />
      {/* Solid core */}
      <circle
        cx={cx} cy={cy}
        r={cx * 0.22}
        fill={`url(#${id})`}
        filter="url(#lmn-glow)"
      />
    </svg>
  );
}

// ── Wordmark ───────────────────────────────────────────────────────────────────

function Wordmark({ size = 'md', theme = 'dark' }) {
  const sizes = { sm: 11, md: 13, lg: 16 };
  const fs = sizes[size] ?? 13;
  const color = theme === 'light' ? '#0d0e1a' : '#e8eaf5';

  return (
    <span
      className={styles.wordmark}
      style={{ fontSize: fs, color }}
    >
      Lumonus
    </span>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

const markSizes = { sm: 18, md: 24, lg: 32 };

export default function LumonusLogo({
  variant = 'full',
  size    = 'md',
  theme   = 'dark',
  className = '',
}) {
  const markPx = markSizes[size] ?? 24;

  return (
    <div className={`${styles.logo} ${styles[`size-${size}`]} ${className}`}>
      {variant !== 'wordmark' && <BrandMark size={markPx} />}
      {variant !== 'mark'     && <Wordmark  size={size} theme={theme} />}
    </div>
  );
}
