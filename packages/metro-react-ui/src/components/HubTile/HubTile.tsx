import { useEffect, useState, type ReactNode } from 'react';
import './HubTile.css';

export interface HubTileProps {
  /** Title shown on the tile. */
  title?: ReactNode;
  /** Image source for the tile face. */
  image?: string;
  /** Message shown when the tile drops. */
  message?: ReactNode;
  /** Back-side title shown when flipped. */
  backTitle?: ReactNode;
  /** Accent color override. */
  accent?: string;
  /** Whether the tile can flip (requires back content). */
  canFlip?: boolean;
  /** Whether the tile can drop (requires a message). */
  canDrop?: boolean;
  /** Click handler. */
  onClick?: () => void;
}

/**
 * Metro-style hub tile. Ported from the WP Toolkit `HubTile`
 * (animated tile with flip and drop states via CSS 3D transforms).
 */
export function HubTile({
  title,
  image,
  message,
  backTitle,
  accent,
  canFlip = true,
  canDrop = true,
  onClick,
}: HubTileProps) {
  // 0 = normal (front), 1 = flipped (back), 2 = dropped (message).
  const [state, setState] = useState(0);
  const flipped = state === 1;
  const dropped = state === 2;

  // Cycle through flip/drop states on an interval, like the WP hub tile.
  // When both canFlip and canDrop are enabled, cycle normal → flipped → dropped → normal.
  useEffect(() => {
    if (!canFlip && !canDrop) return;
    const interval = setInterval(() => {
      setState((s) => {
        if (canFlip && canDrop) return (s + 1) % 3; // 0 → 1 → 2 → 0
        if (canFlip) return s === 0 ? 1 : 0;        // 0 ↔ 1
        if (canDrop) return s === 0 ? 2 : 0;        // 0 ↔ 2
        return s;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [canFlip, canDrop]);

  return (
    <button
      type="button"
      className="metro-hubtile"
      data-flipped={flipped}
      data-dropped={dropped}
      onClick={onClick}
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
    >
      <div className="metro-hubtile__inner">
        <div className="metro-hubtile__face metro-hubtile__front">
          {image && <img className="metro-hubtile__image" src={image} alt="" />}
          {title != null && <div className="metro-hubtile__title">{title}</div>}
        </div>
        <div className="metro-hubtile__face metro-hubtile__back">
          {backTitle != null && <div className="metro-hubtile__back-title">{backTitle}</div>}
        </div>
      </div>
      {dropped && message != null && (
        <div className="metro-hubtile__message">{message}</div>
      )}
    </button>
  );
}
