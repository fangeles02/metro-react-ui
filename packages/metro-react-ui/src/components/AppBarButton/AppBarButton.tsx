import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './AppBarButton.css';

export type AppBarButtonVariant = 'default' | 'filled' | 'accent';

/**
 * Visual semantics (see `variant`):
 * - `default` — neutral: transparent circle with a foreground border, foreground icon.
 *   Icon and label render with the accent color.
 * - `filled` — gray-inverted circle (the accent circle inverts on press).
 * - `accent` — the accent-colored circle + accent-foreground icon.
 */
export interface AppBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Inline SVG (or any React node) rendered centered inside the circle. */
  icon: ReactNode;
  /** Small label text shown centered beneath the circle. */
  label?: string;
  /** Visual style. Defaults to `default`. */
  variant?: AppBarButtonVariant;
}

/**
 * WP8 circular app bar button: a round outline with an icon centered inside,
 * plus a small centered label underneath. Ports the shape of the WP8
 * `shell:ApplicationBarIconButton` (which the Toolkit itself never shipped —
 * that bar was OS-integrated).
 */
export function AppBarButton({
  icon,
  label,
  variant = 'default',
  className,
  ...rest
}: AppBarButtonProps) {
  return (
    <button
      type="button"
      className={`metro-appbarbutton metro-appbarbutton--${variant} ${className ?? ''}`}
      aria-label={label}
      title={label}
      {...rest}
    >
      <span className="metro-appbarbutton__circle">{icon}</span>
      {label ? <span className="metro-appbarbutton__label">{label}</span> : null}
    </button>
  );
}