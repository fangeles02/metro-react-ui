import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { accentForeground } from '../../theme/ThemeProvider';
import './HubTile.css';

/** How the back face is revealed. 'flip' rotates the whole tile; 'slide' slides the back face up/down. */
export type HubTileAnimation = 'flip' | 'slide';

export interface HubTileProps {
  /** Text shown on the front (title) face, upper-left. */
  titleFace?: string;
  /** Text shown on the back face, upper-left. When set, the tile animates between faces. */
  backTitleFace?: string;
  /** Accent color override. */
  accent?: string;
  /** How the back face is revealed. Defaults to 'flip'. */
  animation?: HubTileAnimation;
  /**
   * When true, flip-mode transitions use a springy WP8-style bounce (a single
   * overshoot past the resting angle before settling). Only applies to
   * `animation="flip"`. Defaults to false.
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
 * Metro-style hub tile with two text faces. The front face shows `titleFace`
 * and the back face shows `backTitleFace`, both pinned to the upper-left.
 * When `backTitleFace` is set the tile cycles between faces using either a
 * whole-tile flip (`animation="flip"`, optionally with `bounceFlip`) or a
 * slide-up/down of the back face (`animation="slide"`).
 */
export function HubTile({
  titleFace,
  backTitleFace,
  accent,
  animation = 'flip',
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

  // Only animate when there is a back face to reveal.
  const canAnimate = backTitleFace != null;

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
      className="metro-hubtile"
      data-flipped={flipped}
      data-bounce-flip={bounceFlip}
      data-flipping={flipCount > 0}
      data-animation={animation}
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
          {titleFace != null && <div className="metro-hubtile__title">{titleFace}</div>}
        </div>
        <div className="metro-hubtile__face metro-hubtile__back">
          {backTitleFace != null && <div className="metro-hubtile__back-title">{backTitleFace}</div>}
        </div>
      </div>
    </button>
  );
}
