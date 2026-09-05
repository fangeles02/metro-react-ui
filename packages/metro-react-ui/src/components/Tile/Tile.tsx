import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { accentForeground } from '../../theme/ThemeProvider';
import './Tile.css';

/** WP 8.1 start-screen tile sizes. small=1x1, medium=2x2, wide=4x2, large=4x4. */
export type TileSize = 'small' | 'medium' | 'wide' | 'large';

/** How the tile cycles through its messages. */
export type TileMode = 'continuous' | 'random' | 'alternate';

/**
 * A tile message. If `subject` is present the tile slides the message up over
 * the title (no flip). If `subject` is omitted the tile flips to show `body`.
 */
export interface TileMessage {
  /** Optional message subject — shown large. Presence switches to slide-up mode. */
  subject?: ReactNode;
  /** Message body — shown smaller below the subject (or alone when flipped). */
  body: ReactNode;
}

export interface TileProps {
  /** Tile size. 'small'=1x1, 'medium'=2x2 (default), 'wide'=4x2, 'large'=4x4. */
  size?: TileSize;
  /** Title shown on the front face (hidden on 1x1 tiles). */
  title?: ReactNode;
  /** Image source for the front face. */
  image?: string;
  /** Icon shown on the tile (e.g. a Fluent icon, image, or any element). */
  icon?: ReactNode;
  /** A single message. Body-only flips; with a subject slides up. */
  message?: TileMessage | TileMessage[];
  /** Multiple messages cycled on the tile. Takes precedence over `message`. */
  messages?: TileMessage[];
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
  /** Enable the Metro tilt effect on pointer-down. Defaults to true. */
  tilt?: boolean;
  /** Max tilt angle in degrees (only when `tilt`). Defaults to 17. */
  tiltMaxAngle?: number;
  /** Max depression (translateZ) in px (only when `tilt`). Defaults to 25. */
  tiltMaxDepression?: number;
}

/**
 * Windows Phone 8.1 start-screen tile. Based on the WP Toolkit `HubTile`
 * (animated tile with flip state via CSS 3D transforms), with the classic
 * HubTile size (173x173) as the default 2x2 tile.
 */
export function Tile({
  size = 'medium',
  title,
  image,
  icon,
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
  tilt = true,
  tiltMaxAngle = 17,
  tiltMaxDepression = 25,
}: TileProps) {
  const isSmall = size === 'small';
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

  // Normalize messages to an array (messages prop takes precedence).
  const list = useMemo<TileMessage[]>(
    () =>
      messages && messages.length > 0
        ? messages
        : message != null
          ? Array.isArray(message)
            ? message
            : [message]
          : [],
    [messages, message],
  );

  // Split items by mode: subject-bearing items slide up (non-small only),
  // body-only items flip the tile.
  const slideItems = useMemo(
    () => (!isSmall ? list.filter((m) => m.subject != null) : []),
    [list, isSmall],
  );
  const flipItems = useMemo(
    () => list.filter((m) => m.subject == null),
    [list],
  );

  // Flip only for non-small tiles that have at least one body-only message.
  const shouldFlip = canFlip && !isSmall && flipItems.length > 0;
  // Slide only for non-small tiles that have at least one subject-bearing message.
  const shouldSlide = canFlip && !isSmall && slideItems.length > 0;

  // Initial delay before cycling starts — random 1000–5000ms unless overridden.
  const delay = initialDelay ?? Math.floor(Math.random() * 4000) + 1000;

  // Delivery state:
  //  - flipped:   back face shown (body-only message). Toggles each interval.
  //  - flipIndex: which flipItems to show on the back face.
  //  - flipCount: increments every flip so the swivel animation re-triggers.
  //  - slidePhase: 'idle' front face | 'active' message shown | 'leaving' slide-out.
  //  - slideIndex: index into slideItems currently displayed (-1 = none).
  //  - slideCount: increments each slide so the slide-up animation re-triggers.
  //  - iconSeq: bumps when returning to the front so the center icon
  //    re-mounts and animates in from the top.
  const [state, setState] = useState({
    flipped: false,
    flipIndex: 0,
    flipCount: 0,
    slidePhase: 'idle' as 'idle' | 'active' | 'leaving',
    slideIndex: -1,
    slideCount: 0,
    iconSeq: 0,
  });

  const intervalMs = faceDisplayDuration;
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (!shouldFlip) return;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setState((s) => {
          const flipped = !s.flipped;
          let flipIndex = s.flipIndex;
          if (flipped) {
            if (mode === 'random') {
              flipIndex = Math.floor(Math.random() * flipItems.length);
            } else {
              flipIndex = (s.flipIndex + 1) % flipItems.length;
            }
          }
          return { ...s, flipped, flipIndex, flipCount: s.flipCount + 1 };
        });
      }, intervalMs);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [shouldFlip, mode, flipItems.length, intervalMs, delay]);

  // Slide scheduler — phase-driven state machine:
  //   idle → active (show message) → ... → active(last) → leaving (slide out)
  //   → idle (front face, re-key center icon) → repeat.
  useEffect(() => {
    if (!shouldSlide) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const play = intervalMs;
    const anim = 360;

    const schedule = () => {
      const s = stateRef.current;
      const wait = s.slidePhase === 'leaving' ? anim : play;
      timer = setTimeout(() => {
        if (cancelled) return;
        setState((prev) => {
          const n = { ...prev };
          const len = slideItems.length;
          if (prev.slidePhase === 'idle') {
            n.slidePhase = 'active';
            n.slideIndex = 0;
            n.slideCount = prev.slideCount + 1;
          } else if (prev.slidePhase === 'active') {
            if (prev.slideIndex < len - 1) {
              n.slideIndex = prev.slideIndex + 1;
              n.slideCount = prev.slideCount + 1;
            } else {
              n.slidePhase = 'leaving';
              // Reveal the centered icon once, at the start of leaving, so it
              // slides in a single time (stable key through the return to idle).
              n.iconSeq = prev.iconSeq + 1;
            }
          } else {
            n.slidePhase = 'idle';
            n.slideIndex = -1;
          }
          return n;
        });
        schedule();
      }, wait);
    };

    timer = setTimeout(schedule, delay);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [shouldSlide, slideItems.length, intervalMs, delay]);

  const { flipped, flipIndex, flipCount, slidePhase, slideIndex, slideCount, iconSeq } = state;

  // Is a slide-up message currently covering the title region (shown or leaving)?
  const showingSlide = shouldSlide && slidePhase !== 'idle';
  const slideMsg = showingSlide && slideIndex >= 0 ? slideItems[slideIndex] : null;
  // Hide the centered icon only while a message is actively shown; once it starts
  // leaving, reveal the icon so it slides in immediately (no blank gap).
  const iconHidden = showingSlide && slidePhase === 'active';
  // Only animate the icon when it re-enters after a slide-up cycle (leaving),
  // NOT on flips or initial front-face display.
  const iconReturning = shouldSlide && slidePhase === 'leaving';

  return (
    <button
      key={flipCount}
      ref={tiltRef}
      type="button"
      className={`metro-tile metro-tile--${size}`}
      data-flipped={flipped}
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
          '--wp-tile-swivel-duration': `${swivelAnimationDuration}ms`,
        } as CSSProperties
      }
    >
      {image && <img className="metro-tile__image" src={image} alt="" />}
      {/* Center icon — hidden only while a message is active (slides in on leave). */}
      {!iconHidden && icon != null && count != null && count > 0 && (isSmall || !flipped) && (
        <div
          key={`icon-${iconSeq}-c`}
          className={`metro-tile__icon metro-tile__icon--counted ${iconReturning ? 'metro-tile__icon--return' : ''}`}
        >
          {icon}
          <span className="metro-tile__count">{count}</span>
        </div>
      )}
      {!iconHidden && icon != null && (count == null || count <= 0) && (
        <div
          key={`icon-${iconSeq}`}
          className={`metro-tile__icon ${iconReturning ? 'metro-tile__icon--return' : ''}`}
        >
          {icon}
        </div>
      )}
      {/* Center count (no icon) — hidden while a subject message is active. */}
      {!iconHidden && icon == null && count != null && count > 0 && !isSmall && (
        <div className="metro-tile__count">
          <span className="metro-tile__count-inner">{count}</span>
        </div>
      )}
      {/* Front face title — always visible, even behind a slide-up message. */}
      {!isSmall && !flipped && title != null && (
        <div className="metro-tile__content">
          <div className="metro-tile__title">{title}</div>
        </div>
      )}
      {/* Flip mode: body-only message on the back face, title pinned lower. */}
      {!isSmall && flipped && flipItems[flipIndex] != null && (
        <div className="metro-tile__content metro-tile__content--back">
          <div className="metro-tile__message">{flipItems[flipIndex].body}</div>
          {title != null && <div className="metro-tile__title">{title}</div>}
        </div>
      )}
      {/* Slide-up mode: subject + body card, plus mini icon + count lower-right.
          Card and mini slide out to the top when `leaving`. */}
      {slideMsg != null && (
        <>
          <div
            key={slideCount}
            className={`metro-tile__slide metro-tile__slide--${slidePhase}`}
          >
            <div className="metro-tile__subject">{slideMsg.subject}</div>
            <div className="metro-tile__body">{slideMsg.body}</div>
          </div>
          {(icon != null || count != null) && (
            <div key={`mini-${iconSeq}`} className={`metro-tile__mini metro-tile__mini--${slidePhase}`}>
              {icon != null && <span className="metro-tile__mini-icon">{icon}</span>}
              {count != null && count > 0 && <span className="metro-tile__mini-count">{count}</span>}
            </div>
          )}
        </>
      )}
    </button>
  );
}