import type { CSSProperties } from 'react';
import './ProgressRing.css';

export interface ProgressRingProps {
  /** Diameter of the ring in px. Defaults to 40. */
  size?: number;
  /** Dot color. Defaults to the theme accent (`var(--wp-accent)`). */
  accent?: string;
  /** Number of orbiting dots. Defaults to 5. */
  dots?: number;
  /** Duration of one full orbit in ms. Defaults to 4000. */
  duration?: number;
  /** Extra class name for the root element. */
  className?: string;
  /** Accessible label for the status region. Defaults to "Loading". */
  'aria-label'?: string;
}

/**
 * Metro-style indeterminate progress ring.
 *
 * A ring of dots orbits a circle with a trailing comet effect, ported from
 * Chudesnov's CodePen "Progress ring" (https://codepen.io/Chudesnov).
 * All geometry is derived from the `size` prop via CSS custom properties, so
 * the ring scales without touching the keyframes.
 */
export function ProgressRing({
  size = 40,
  accent,
  dots = 5,
  duration = 4000,
  className,
  'aria-label': ariaLabel = 'Loading',
}: ProgressRingProps) {
  const style = {
    '--wp-progress-size': `${size}px`,
    '--wp-progress-accent': accent ?? 'var(--wp-accent)',
    '--wp-progress-duration': `${duration}ms`,
  } as CSSProperties;

  return (
    <div
      className={`metro-progressring ${className ?? ''}`}
      style={style}
      role="status"
      aria-label={ariaLabel}
    >
      {Array.from({ length: Math.max(1, dots) }, (_, i) => (
        <div
          key={i}
          className="metro-progressring__wrap"
          style={{ transform: `rotate(${-14 * i}deg)` }}
        >
          <div
            className="metro-progressring__circle"
            style={{ animationDelay: `${(duration / 30) * i}ms` }}
          />
        </div>
      ))}
    </div>
  );
}