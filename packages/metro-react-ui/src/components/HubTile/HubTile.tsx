import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { accentForeground } from '../../theme/ThemeProvider';
import './HubTile.css';

/** HubTile sizes. 'medium'=2x2 (default), 'wide'=4x2, 'large'=4x4. */
export type HubTileSize = 'medium' | 'wide' | 'large';

export interface HubTileProps {
  /** Tile size. 'medium'=2x2 (default), 'wide'=4x2, 'large'=4x4. */
  size?: HubTileSize;
  /** Background image source shown on the front face. */
  source?: string;
  /** Text shown at the bottom-left of the front face. */
  title?: string;
  /** Detailed body text shown on the back face (below `backTitle`). */
  message?: string;
  /** Secondary header text shown on the back face (above `message`). */
  backTitle?: string;
  /**
   * Custom content shown on the back face. When set, it replaces the default
   * `backTitle` + `message` text layout.
   */
  backContent?: ReactNode;
  /** Accent color override. */
  accent?: string;
  /**
   * When true, flip-mode transitions use a springy WP8-style bounce (a single
   * overshoot past the resting angle before settling). Defaults to false.
   */
  bounceFlip?: boolean;
  /** How long each face is displayed, in ms. Defaults to 5000. */
  Duration?: number;
  /**
   * Initial delay before the tile starts animating, in ms. Defaults to a
   * random value between 5000 and 10000 so tiles don't animate in sync.
   */
  initialDelay?: number;
  /** Click handler. */
  onClick?: () => void;
  /** Enable the Metro tilt effect on pointer-down. Defaults to true. */
  tilt?: boolean;
  /** Max tilt angle in degrees (only when `tilt`). Defaults to 17. */
  tiltMaxAngle?: number;
  /** Max depression (translateZ) in px (only when `tilt`). Defaults to 25. */
  tiltMaxDepression?: number;
}

/**
 * Metro-style hub tile, ported from the WP Toolkit `Microsoft.Phone.Controls.HubTile`.
 * The front face shows a `source` image with a `title` at the bottom-left; the
 * back face shows `backTitle` + `message` (or custom `backContent`). When back
 * content is present the tile cycles between faces with a whole-tile flip
 * (optionally with `bounceFlip`).
 */
export function HubTile({
  size = 'medium',
  source,
  title,
  message,
  backTitle,
  backContent,
  accent,
  bounceFlip = false,
  Duration = 5000,
  initialDelay,
  onClick,
  tilt = true,
  tiltMaxAngle = 17,
  tiltMaxDepression = 25,
}: HubTileProps) {
  const tiltRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (!tilt) return;
    const el = tiltRef.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(600px) rotateX(${(-py * tiltMaxAngle).toFixed(2)}deg) rotateY(${(px * tiltMaxAngle).toFixed(2)}deg) translateZ(${tiltMaxDepression}px)`;
  };

  const handlePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    try {
      el.releasePointerCapture(e.pointerId);
    } catch {
      /* pointer capture may already be released */
    }
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  const [flipped, setFlipped] = useState(false);
  // Bumps on every transition so the tile re-keys and the flip animation
  // replays (both to the back and back to the title).
  const [flipCount, setFlipCount] = useState(0);

  // Initial delay before cycling starts — random 5000–10000ms unless
  // overridden. MEMOIZED so it's stable across renders (otherwise including
  // it in the scheduler effect deps would restart the timer on every flip).
  const delay = useMemo(
    () => initialDelay ?? Math.floor(Math.random() * 5000) + 5000,
    [initialDelay],
  );

  // Only animate when there is back content to reveal.
  const canAnimate = backContent != null || backTitle != null || message != null;

  useEffect(() => {
    if (!canAnimate) return;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setFlipped((f) => !f);
        setFlipCount((c) => c + 1);
      }, Duration);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [canAnimate, Duration, delay]);

  return (
    <button
      key={flipCount}
      ref={tiltRef}
      type="button"
      className={`metro-hubtile metro-hubtile--${size}`}
      data-flipped={flipped}
      data-bounce-flip={bounceFlip}
      data-flipping={flipCount > 0}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={onClick}
      style={
        {
          ...(accent
            ? {
                '--wp-accent': accent,
                '--wp-accent-foreground': accentForeground(accent),
              }
            : {}),
        } as CSSProperties
      }
    >
      <div className="metro-hubtile__inner">
        <div className="metro-hubtile__face metro-hubtile__front">
          {source != null && <img className="metro-hubtile__image" src={source} alt="" />}
          {title != null && <div className="metro-hubtile__title">{title}</div>}
        </div>
        <div className="metro-hubtile__face metro-hubtile__back">
          {backContent != null ? (
            <div className="metro-hubtile__back-content">{backContent}</div>
          ) : (
            <>
              {backTitle != null && <div className="metro-hubtile__back-title">{backTitle}</div>}
              {message != null && <div className="metro-hubtile__message">{message}</div>}
            </>
          )}
        </div>
      </div>
    </button>
  );
}
