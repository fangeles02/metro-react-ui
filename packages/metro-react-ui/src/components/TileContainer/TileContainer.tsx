import type { CSSProperties, ReactNode } from 'react';
import './TileContainer.css';

export interface TileContainerProps {
  children?: ReactNode;
  /** Number of grid columns. Defaults to 4. */
  columns?: number;
  /** Gap between tiles in px. Defaults to 8. */
  gap?: number;
  /** Inline style. */
  style?: CSSProperties;
  className?: string;
}

/**
 * Container that holds `Tile` children and arranges them automatically in a
 * WP8.1 start-screen style grid, snapping tiles to the configured columns.
 */
export function TileContainer({
  children,
  columns = 4,
  gap = 8,
  style,
  className,
}: TileContainerProps) {
  return (
    <div
      className={`metro-tilecontainer ${className ?? ''}`}
      style={
        {
          ...style,
          gap,
          gridTemplateColumns: `repeat(${columns}, 87px)`,
          gridAutoRows: '87px',
          width: 'fit-content',
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}