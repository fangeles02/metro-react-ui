import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { accentForeground } from '../../theme/ThemeProvider';
import './Tile.css';

/** WP 8.1 start-screen tile sizes. small=1x1, medium=2x2, wide=4x2, large=4x4. */
export type TileSize = 'small' | 'medium' | 'wide' | 'large';

/**
 * How a message's image and text are presented. Defaults to 'inline-flip'.
 * - inline-slide: image = background, subject/body as labels; each message slides in.
 * - inline-flip: same layout, but the tile flips between messages.
 * - alternate-slide: image slides in first, then the labels.
 * - alternate-flip: tile flips image face -> text face per message.
 */
export type MessageDisplayMode = 'inline-slide' | 'inline-flip' | 'alternate-slide' | 'alternate-flip';

/**
 * A tile message. If `subject` is present the tile slides the message up over
 * the title (no flip). If `subject` is omitted the tile flips to show `body`.
 */
export interface TileMessage {
  /** Optional message subject — shown large. Presence switches to slide-up mode. */
  subject?: ReactNode;
  /** Message body — shown smaller below the subject (or alone when flipped). */
  body: ReactNode;
  /** Optional image source (URL) shown in the slide-up card. */
  image?: string;
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
  /** Notification count shown as a badge in the top-right corner. */
  count?: number;
  /** Accent color override. */
  accent?: string;
  /** Whether the tile can flip (requires a message). */
  canFlip?: boolean;
  /** How long each message face is displayed, in ms. Defaults to 5000. */
  Duration?: number;
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
  /** How message image/text are presented. Defaults to 'inline-flip'. */
  messageDisplayMode?: MessageDisplayMode;
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
  count,
  accent,
  canFlip = true,
  Duration = 5000,
  swivelAnimationDuration = 800,
  initialDelay,
  onClick,
  tilt = true,
  tiltMaxAngle = 17,
  tiltMaxDepression = 25,
  messageDisplayMode = 'inline-flip',
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

  // Unified presentation sequence. Always built for the effective mode
  // (defaults to 'inline-flip'). Each step carries its kind and source message.
  const steps = useMemo<{ kind: 'image' | 'text'; item: TileMessage }[]>(() => {
    const out: { kind: 'image' | 'text'; item: TileMessage }[] = [];
    for (const m of list) {
      // A message with an image and NO text content (no subject/body) is
      // image-only — it must render as an image step, not an empty text step.
      const imageOnly = !!m.image && !((m.subject != null && m.subject !== '') || (m.body != null && m.body !== ''));
      if (imageOnly) {
        out.push({ kind: 'image', item: m });
      } else if (messageDisplayMode === 'inline-slide' || messageDisplayMode === 'inline-flip') {
        out.push({ kind: 'text', item: m });
      } else {
        // alternate-slide / alternate-flip: image step (if present) then text.
        if (m.image) out.push({ kind: 'image', item: m });
        out.push({ kind: 'text', item: m });
      }
    }
    return out;
  }, [messageDisplayMode, list]);

  // Active step-based presentation (all modes; non-small tiles).
  const stepPresentationEnabled = steps.length > 0 && !isSmall;

  // Legacy flip/slide are only used when step presentation is NOT active
  // (i.e. no messages / small tiles). The step machine owns all message
  // transitions, so subject tiles flip/slide per the step's mode instead.
  const shouldFlip = canFlip && !isSmall && !stepPresentationEnabled && flipItems.length > 0;
  const shouldSlide = canFlip && !isSmall && !stepPresentationEnabled && slideItems.length > 0;

  // Initial delay before cycling starts — random 1000–5000ms unless overridden.
  // MEMOIZED so it's stable across renders (otherwise including it in the
  // scheduler effect deps causes the effect to teardown/restart on EVERY
  // flip, resetting each step's wait to a new random delay → inconsistent
  // display durations).
  const delay = useMemo(
    () => initialDelay ?? Math.floor(Math.random() * 4000) + 1000,
    [initialDelay],
  );

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
    // Step presentation: -1 = front face; otherwise index into `steps`.
    stepIndex: -1,
    stepPhase: 'idle' as 'idle' | 'active' | 'leaving',
    stepCount: 0,
  });

  const intervalMs = Duration;
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
            flipIndex = (s.flipIndex + 1) % flipItems.length;
          }
          return { ...s, flipped, flipIndex, flipCount: s.flipCount + 1 };
        });
      }, intervalMs);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [shouldFlip, flipItems.length, intervalMs, delay]);

  // Slide scheduler — phase-driven state machine:
  //   idle → active (show message) → ... → active(last) → leaving (slide out)
  //   → idle (front face, re-key center icon) → repeat.
  useEffect(() => {
    if (!shouldSlide) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const play = intervalMs;
    const anim = 800;

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

  // Step scheduler — advances through `steps`, then returns to the front face.
// In FLIP modes the whole tile flips (toggling `flipped` re-keys the button so
// the tile-flip animation replays per step). In SLIDE modes the inner step
// slides (stepPhase machine). Applies to all messages.
  const stepIsFlip =
    messageDisplayMode === 'inline-flip' || messageDisplayMode === 'alternate-flip';

  useEffect(() => {
    if (!stepPresentationEnabled) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const play = intervalMs;
    const anim = 800;
    const stepLen = steps.length;

    const schedule = () => {
      const prev = stateRef.current;
      const n = { ...prev };
      if (stepIsFlip) {
        // Continuous flip (inline-flip AND alternate-flip): STAY on the
        // back face through the whole step sequence (text steps for
        // inline; image + labels steps for alternate), flipping IN each
        // step (flipCount re-keys the tile so the flip replays). Reset to
        // the front face ONLY after the LAST step of the cycle.
        if (!prev.flipped) {
          n.flipped = true;
          const idx = prev.stepIndex < 0 ? 0 : (prev.stepIndex + 1) % stepLen;
          n.stepIndex = idx;
          n.flipCount = prev.flipCount + 1;
          if (idx === 0) n.iconSeq = prev.iconSeq + 1; // new cycle start
        } else if (prev.stepIndex >= stepLen - 1) {
          n.flipped = false;
          n.stepIndex = -1;
          n.flipCount = prev.flipCount + 1;
          n.iconSeq = prev.iconSeq + 1;
        } else {
          // next step WITHOUT returning to the front — stay on the back.
          n.stepIndex = prev.stepIndex + 1;
          n.flipCount = prev.flipCount + 1;
          n.flipped = true;
        }
      } else if (prev.stepPhase === 'idle') {
        n.stepPhase = 'active';
        n.stepIndex = 0;
        // Step cycle counter — bumps ONLY on a fresh cycle (idle → first
        // message) so the step overlay's key is stable across the message
        // sequence (no front-face flash between consecutive messages),
        // and remounts when a new cycle begins.
        n.stepCount = prev.stepCount + 1;
      } else if (prev.stepPhase === 'active') {
        if (prev.stepIndex < stepLen - 1) {
          n.stepIndex = prev.stepIndex + 1;
        } else {
          n.stepPhase = 'leaving';
          n.iconSeq = prev.iconSeq + 1;
        }
      } else {
        n.stepPhase = 'idle';
        n.stepIndex = -1;
      }
      // Sync the ref IMMEDIATELY so the recursive schedule() reads the latest
      // state — independent of React's render/batching timing. Without this,
      // a lazy render can leave stateRef pointing at the OLD step, causing the
      // scheduler to re-transition and skip a step (inconsistent durations).
      stateRef.current = n;
      setState(n);

      // The wait that elapses before the NEXT transition is the display
      // duration of the step we just transitioned INTO (`n`). In alternate-flip
      // the image step displays for HALF of the labels' duration (only when the
      // transitioned-in step is an image).
      let wait: number;
      if (n.stepPhase === 'leaving') {
        wait = anim;
      } else if (
        messageDisplayMode === 'alternate-flip' &&
        n.stepIndex >= 0 &&
        steps[n.stepIndex]?.kind === 'image'
      ) {
        wait = play / 2;
      } else {
        wait = play;
      }
      timer = setTimeout(() => {
        if (cancelled) return;
        schedule();
      }, wait);
    };

    timer = setTimeout(schedule, delay);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [stepPresentationEnabled, steps.length, intervalMs, delay]);

  const {
    flipped,
    flipIndex,
    flipCount,
    slidePhase,
    slideIndex,
    slideCount,
    iconSeq,
    stepIndex,
    stepPhase,
    stepCount,
  } = state;

  // Is a slide-up message currently covering the title region (shown or leaving)?
  const showingSlide = shouldSlide && slidePhase !== 'idle';
  const slideMsg = showingSlide && slideIndex >= 0 ? slideItems[slideIndex] : null;
  // Whether a step-slide message (inline-slide/alternate-slide) is on the overlay.
  const stepSlideActive = stepPresentationEnabled && !stepIsFlip && stepPhase !== 'idle';
  // For step-slide modes the centered icon is hidden only while the message is
  // fully on screen (`active`); as soon as the last message starts `leaving`,
  // the front-face icon is revealed again so there is no blank gap.
  const stepIconHidden = stepSlideActive && stepPhase === 'active';
  // Hide the centered icon while ANY message is shown — legacy slide-up active,
  // step-slide active (inline-slide/alternate-slide), or a flip face (when flipped).
  const iconHidden =
    (showingSlide && slidePhase === 'active') ||
    stepIconHidden;
  // Animate the icon when it re-enters the front face: after a legacy slide-up
  // cycle, or when the last step-slide message leaves (revealing the front face).
  const iconReturning =
    (shouldSlide && slidePhase === 'leaving') ||
    (stepSlideActive && stepPhase === 'leaving');

  // Step presentation derived state.
  // Slide step modes advance via stepPhase; flip modes advance via `flipped`.
  const stepActive = stepPresentationEnabled && (stepIsFlip ? flipped || stepIndex >= 0 : stepPhase !== 'idle');
  const curStep = stepPresentationEnabled && stepIndex >= 0 ? steps[stepIndex] : null;
  const curImage = curStep?.item.image ?? null;
  const curText = curStep?.kind === 'text' ? curStep.item : null;
  // Whether the message carries any real label text (non-empty subject/body).
  // The bleed overlay is shown ONLY when the message has BOTH an image AND
  // text. An image-only message (no subject, no body) or a text message with
  // no image gets NO bleed.
  const msgHasText = (msg?: TileMessage) =>
    !!msg &&
    ((msg.subject != null && msg.subject !== '') ||
      (msg.body != null && msg.body !== ''));
  // Whether to show the bleed overlay for the current step: it needs an image
  // AND text content (non-empty subject/body).
  const stepHasBleed = (msg?: TileMessage) => !!msg && !!msg.image && msgHasText(msg);

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
      {/* Front face title — always visible bottom-left (across front, slide, flip). */}
      {!isSmall && title != null && (
        <div className="metro-tile__content">
          <div className="metro-tile__title">{title}</div>
        </div>
      )}
      {/* Flip mode back face. In a flip display mode shows the current step
          (image or text face); otherwise the legacy body-only message. */}
      {!isSmall && flipped && (flipItems[flipIndex] != null || (stepIsFlip && curStep != null)) && (
        <div className="metro-tile__content metro-tile__content--back">
          {stepIsFlip && curStep != null ? (
            <>
              {curStep.kind === 'image' && curImage != null && (
                <img className="metro-tile__step-image" src={curImage} alt="" />
              )}
              {curStep.kind === 'text' && (
                <>
                  {messageDisplayMode === 'inline-flip' && stepHasBleed(curStep.item) && (
                    <img className="metro-tile__step-bg" src={curStep.item.image} alt="" />
                  )}
                  <div className={`metro-tile__step-text ${messageDisplayMode === 'inline-flip' && stepHasBleed(curStep.item) ? 'metro-tile__step-text--image' : ''}`}>
                    <div className="metro-tile__step-subject">{curText?.subject}</div>
                    <div className="metro-tile__step-body">{curText?.body}</div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="metro-tile__message">{flipItems[flipIndex]?.body}</div>
          )}
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
            {slideMsg.image != null && (
              <img className="metro-tile__slide-image" src={slideMsg.image} alt="" />
            )}
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
      {/* messageDisplayMode step presentation — inner slide face (slide modes only;
          flip modes flip the whole tile instead). */}
      {!stepIsFlip && stepActive && curStep != null && (
        <div
          key={`step-${stepCount}`}
          className={`metro-tile__step metro-tile__step--${curStep.kind} metro-tile__step--${stepPhase} ${
            (messageDisplayMode === 'inline-slide' || messageDisplayMode === 'alternate-slide') && stepHasBleed(curStep.item)
              ? 'metro-tile__step--fullbleed'
              : ''
          }`}
        >
          {/* Static background image for a text (labels) step — rendered as a
              sibling OUTSIDE the sliding inner so it stays STATIC while the
              labels + bleed move in over it. */}
          {curStep.kind === 'text' &&
            (messageDisplayMode === 'inline-slide' || messageDisplayMode === 'alternate-slide') &&
            stepHasBleed(curStep.item) && (
              <img className="metro-tile__step-bg" src={curStep.item.image} alt="" />
            )}
          {/* Bleed overlay — fades in over the static image (its own div, NOT
              inside the sliding labels inner, so it does NOT slide up). */}
          {curStep.kind === 'text' &&
            (messageDisplayMode === 'inline-slide' || messageDisplayMode === 'alternate-slide') &&
            stepHasBleed(curStep.item) && (
              <div className="metro-tile__step-bleed" />
            )}
          {/* Inner content keyed by the current step so each message replays
              its slide-in animation WITHOUT remounting the outer overlay
              (which would flash the front face between messages). The image
              step slides in; the text (labels) step slides the labels over
              the static image + fading bleed. */}
          <div
            key={stepIndex}
            className={`metro-tile__step-inner ${
              curStep.kind === 'image'
                ? 'metro-tile__step-inner--image'
                : 'metro-tile__step-inner--text'
            }`}
          >
            {curStep.kind === 'image' && curImage != null && (
              <img className="metro-tile__step-image" src={curImage} alt="" />
            )}
            {curStep.kind === 'text' && (
              <div className="metro-tile__step-text">
                <div className="metro-tile__step-subject">{curText?.subject}</div>
                <div className="metro-tile__step-body">{curText?.body}</div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Mini icon + count — lower-right corner of the tile (sibling of the step
          overlay, so it sits over the accent below the title). Slides in once
          per cycle (iconSeq), persists across succeeding messages, slides out
          on the front-face reset. */}
      {!isSmall && stepSlideActive && (icon != null || count != null) && (
        <div key={`mini-${iconSeq}`} className={`metro-tile__mini metro-tile__mini--step metro-tile__mini--${stepPhase}`}>
          {icon != null && <span className="metro-tile__mini-icon">{icon}</span>}
          {count != null && count > 0 && <span className="metro-tile__mini-count">{count}</span>}
        </div>
      )}
    </button>
  );
}