import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import './Tile.css';

/** WP 8.1 start-screen tile sizes (grid notation: cols x rows). */
export type TileSize = '1x1' | '2x2' | '4x2' | '4x4';

/** How the tile cycles through its messages. */
export type TileMode = 'continuous' | 'random' | 'alternate';

export interface TileProps {
  /** Tile size in grid notation. Defaults to '2x2' (the classic HubTile size). */
  size?: TileSize;
  /** Title shown on the front face (hidden on 1x1 tiles). */
  title?: ReactNode;
  /** Image source for the front face. */
  image?: string;
  /** Single message shown on the back face when flipped. */
  message?: ReactNode;
  /** Multiple messages cycled on the back face. Takes precedence over `message`. */
  messages?: string[];
  /** How messages are cycled. Defaults to 'continuous'. */
  mode?: TileMode;
  /** Notification count shown as a badge in the top-right corner. */
  count?: number;
  /** Accent color override. */
  accent?: string;
  /** Whether the tile can flip (requires a message). */
  canFlip?: boolean;
  /** How long each face is displayed before flipping, in ms. Defaults to 3000. */
  faceDisplayDuration?: number;
  /** Duration of the swivel animation, in ms. Defaults to 800. */
  swivelAnimationDuration?: number;
  /**
   * Initial delay before the tile starts flipping, in ms. Defaults to a
   * random value between 1000 and 5000 so tiles don't flip in sync.
   */
  initialDelay?: number;
  /** Click handler. */
  onClick?: () => void;
}

/**
 * Windows Phone 8.1 start-screen tile. Based on the WP Toolkit `HubTile`
 * (animated tile with flip state via CSS 3D transforms), with the classic
 * HubTile size (173x173) as the default 2x2 tile.
 */
export function Tile({
  size = '2x2',
  title,
  image,
  message,
  messages,
  mode = 'continuous',
  count,
  accent,
  canFlip = true,
  faceDisplayDuration = 3000,
  swivelAnimationDuration = 800,
  initialDelay,
  onClick,
}: TileProps) {
  const is1x1 = size === '1x1';

  // Normalize messages to an array (messages prop takes precedence).
  const list = useMemo<string[]>(
    () => (messages && messages.length > 0 ? messages : message != null ? [String(message)] : []),
    [messages, message],
  );

  // Flip only for non-1x1 tiles that have at least one message.
  const shouldFlip = canFlip && !is1x1 && list.length > 0;

  // Initial delay before flipping starts — random 1000–5000ms unless overridden.
  const delay = initialDelay ?? Math.floor(Math.random() * 4000) + 1000;

  // Flip state + current message index (flipped=false shows the title/front).
  // flipCount increments on every flip so the swivel animation re-triggers.
  const [state, setState] = useState({ flipped: false, msgIndex: 0, flipCount: 0 });

  useEffect(() => {
    if (!shouldFlip) return;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setState((s) => {
          const flipped = !s.flipped;
          let msgIndex = s.msgIndex;
          // When flipping to the back, advance to the next message.
          if (flipped) {
            if (mode === 'random') {
              msgIndex = Math.floor(Math.random() * list.length);
            } else {
              // continuous & alternate: advance in order
              msgIndex = (s.msgIndex + 1) % list.length;
            }
          }
          return { flipped, msgIndex, flipCount: s.flipCount + 1 };
        });
      }, faceDisplayDuration);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [shouldFlip, mode, list.length, faceDisplayDuration, delay]);

  const { flipped, msgIndex, flipCount } = state;

  return (
    <button
      key={flipCount}
      type="button"
      className={`metro-tile metro-tile--${size}`}
      data-flipped={flipped}
      onClick={onClick}
      style={
        {
          ...(accent ? { '--wp-accent': accent } : {}),
          '--wp-tile-swivel-duration': `${swivelAnimationDuration}ms`,
        } as CSSProperties
      }
    >
      {image && <img className="metro-tile__image" src={image} alt="" />}
      {!is1x1 && !flipped && title != null && (
        <div className="metro-tile__content">
          <div className="metro-tile__title">{title}</div>
        </div>
      )}
      {!is1x1 && flipped && list[msgIndex] != null && (
        <div className="metro-tile__content metro-tile__content--back">
          <div className="metro-tile__message">{list[msgIndex]}</div>
        </div>
      )}
      {count != null && count > 0 && (
        <div className="metro-tile__count">
          <span className="metro-tile__count-inner">{count}</span>
        </div>
      )}
    </button>
  );
}