import type { CSSProperties, ReactNode } from 'react';
import './WrapPanel.css';

export interface WrapPanelProps {
  children?: ReactNode;
  /** Direction items flow. Defaults to `horizontal`. */
  orientation?: 'horizontal' | 'vertical';
  /** Gap between items. */
  gap?: number;
  /** Inline style. */
  style?: CSSProperties;
  className?: string;
}

/**
 * Arranges child elements in a wrapping line. Ported from the WP Toolkit
 * `WrapPanel` (implemented with CSS flex/grid wrap).
 */
export function WrapPanel({
  children,
  orientation = 'horizontal',
  gap = 0,
  style,
  className,
}: WrapPanelProps) {
  return (
    <div
      className={`metro-wrappanel metro-wrappanel--${orientation} ${className ?? ''}`}
      style={{ ...style, gap } as CSSProperties}
    >
      {children}
    </div>
  );
}
