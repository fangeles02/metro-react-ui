import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import './Button.css';

export type ButtonVariant = 'default' | 'filled' | 'accent';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Defaults to `default`. */
  variant?: ButtonVariant;
  /** Button text. */
  children?: ReactNode;
}

/**
 * Metro-style button. Ported from the WP Toolkit `PhoneButtonBase`
 * (transparent background + foreground border; pressed inverts to filled).
 *
 * Variants:
 * - `default` — outline: transparent bg, foreground border
 * - `filled` — slightly lighter (gray) background, no border
 * - `accent` — uses the accent color background
 */
export function Button({ variant = 'default', children, className, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`metro-button metro-button--${variant} ${className ?? ''}`}
      {...rest}
    >
      {children}
    </button>
  );
}