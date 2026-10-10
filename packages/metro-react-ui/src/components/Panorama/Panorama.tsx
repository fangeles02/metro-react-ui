import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
  type WheelEvent,
} from 'react';
import './Panorama.css';

/** Tracks a CSS media query (e.g. `(min-width: 768px)`) reactively. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    setMatches(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

export interface PanoramaItemProps {
  /** Header text for the panorama section. */
  header: ReactNode;
  /** Section content. */
  children?: ReactNode;
}

/** Data shape used when passing sections via the `items` prop. */
export interface PanoramaItemData {
  /** Header text for the panorama section. */
  header: ReactNode;
  /** Section content. */
  children?: ReactNode;
}

export interface PanoramaProps {
  /** Panorama sections, as `PanoramaItem` children. */
  children?: ReactNode;
  /** Alternative to `children`: an array of section data. */
  items?: PanoramaItemData[];
  /** Optional app title shown above the sections (uppercased). */
  title?: string;
  /**
   * Parallax background — an image URL or a CSS color. The background scrolls
   * slower than the content to create the classic WP7 depth effect.
   */
  background?: string;
  /**
   * Solid color overlay drawn over the background (behind the content) so the
   * content stays readable. Defaults to the theme background color
   * (`var(--wp-background)`). Pass any CSS color to override, or `null` to
   * disable the overlay entirely.
   */
  overlay?: string | null;
  /**
   * Opacity applied to the overlay (0–1). Defaults to 0.5 so the overlay is
   * translucent even when the color itself is fully opaque, letting the
   * background show through while keeping content readable.
   */
  overlayOpacity?: number;
  /**
   * Width of each section — a number (px) or a CSS length like '100%'.
   * Defaults to 480 (WP7-style).
   */
  sectionWidth?: number | string;
  /** Index of the active section (controlled). */
  activeIndex?: number;
  /** Initial active index (uncontrolled). */
  defaultActiveIndex?: number;
  /** Callback when the active section changes. */
  onActiveIndexChange?: (index: number) => void;
  /** Accent color override. */
  accent?: string;
  /**
   * How fast the background moves relative to the content. 0 = fixed,
   * 1 = same speed as content. Defaults to 0.5 (background at half speed).
   */
  parallaxRatio?: number;
  /** Whether keyboard/wheel navigation wraps around at the ends. Defaults to false. */
  loop?: boolean;
  /**
   * Breakpoint (px) at which the panorama switches from mobile (snap/lock)
   * to wide (free-scroll) mode. Defaults to 768.
   */
  breakpoint?: number;
  /**
   * Scrollbar visibility in wide (free-scroll) mode. 'auto' (default) shows
   * the scrollbar only when content overflows, 'hidden' never shows it, and
   * 'visible' always shows it.
   */
  scrollbar?: 'auto' | 'hidden' | 'visible';
  /**
   * Space (px) reserved at the bottom of the panorama for an overlaid element
   * (e.g. a fixed AppBar). The scrollbar is positioned above this inset so it
   * isn't hidden behind the overlay. Defaults to 0.
   */
  bottomInset?: number;
}

/** Detect whether a background string is a URL (image) or a plain CSS color. */
function resolveBackground(bg: string): CSSProperties {
  const isUrl =
    /^(https?:|data:|blob:|\/|\.\/|\.\.\/)/.test(bg) ||
    /\.(png|jpe?g|gif|webp|svg|avif)(\?|#|$)/i.test(bg);
  if (isUrl) return { backgroundImage: `url(${bg})` };
  return { backgroundColor: bg };
}

/**
 * Metro-style panorama — a horizontally-pannable, full-width control modeled
 * on the Windows Phone 7/8 Panorama. Unlike `Pivot` (discrete tabs), all
 * sections sit side-by-side in a continuous strip and are panned into view,
 * with a parallax background that scrolls slower than the content.
 *
 * Supports pointer drag (mouse + touch), horizontal wheel/trackpad, and
 * keyboard arrow navigation. Controlled (`activeIndex`) and uncontrolled
 * (`defaultActiveIndex`) usage are both supported.
 */
export function Panorama({
  children,
  items,
  title,
  background,
  overlay,
  overlayOpacity = 0.5,
  sectionWidth = 480,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  accent,
  parallaxRatio = 0.5,
  loop = false,
  breakpoint = 768,
  scrollbar = 'auto',
  bottomInset = 0,
}: PanoramaProps) {
  // Wide mode = free native scrolling (no snap/lock). Mobile mode = the
  // classic WP7 snap-to-section with a wheel lock.
  const isWide = useMediaQuery(`(min-width: ${breakpoint}px)`);
  // Normalize sections from either `items` or `PanoramaItem` children.
  const sections: PanoramaItemData[] = items
    ? items
    : (Array.isArray(children) ? children : [children])
        .filter(Boolean)
        .map((el) => {
          const item = el as React.ReactElement<PanoramaItemProps>;
          return { header: item.props.header, children: item.props.children };
        });
  const n = sections.length;
  const isControlled = activeIndexProp !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const activeIndex = isControlled ? activeIndexProp : internalIndex;

  const trackRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Resolve `sectionWidth` to a pixel value for the snap/offset math. Numeric
  // widths are used directly; string widths (e.g. '100%') are measured from
  // the first rendered section and kept in sync on resize.
  const [resolvedWidth, setResolvedWidth] = useState<number>(
    typeof sectionWidth === 'number' ? sectionWidth : 0,
  );
  useEffect(() => {
    if (typeof sectionWidth === 'number') {
      setResolvedWidth(sectionWidth);
      return;
    }
    const el = trackRef.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    const measure = () => setResolvedWidth(el.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sectionWidth]);

  // The scroll container's viewport width, used to compute the trailing spacer
  // so a sub-100% page width still lets the last page align to the left edge.
  const [viewportWidth, setViewportWidth] = useState(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setViewportWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Live drag state (refs so pointermove doesn't re-render).
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const offsetRef = useRef(activeIndex * resolvedWidth);
  // Fixed-interval throttle: advance on the FIRST wheel event of a gesture,
  // then ignore events for a fixed window (matching the snap animation). The
  // window is NOT reset by subsequent events, so continuous scrolling advances
  // one section per interval with no "wait for quiet" gap, while a single
  // flick still advances exactly one section.
  const wheelLocked = useRef(false);
  const wheelTimer = useRef<number | null>(null);

  const maxOffset = Math.max(0, (n - 1) * resolvedWidth);

  // Clear any pending wheel throttle timer on unmount.
  useEffect(() => {
    return () => {
      if (wheelTimer.current != null) window.clearTimeout(wheelTimer.current);
    };
  }, []);

  const setActive = (index: number) => {
    const next = loop
      ? ((index % n) + n) % n
      : Math.max(0, Math.min(n - 1, index));
    if (!isControlled) setInternalIndex(next);
    onActiveIndexChange?.(next);
  };

  const goToNext = () => setActive(activeIndex + 1);
  const goToPrev = () => setActive(activeIndex - 1);

  const applyOffset = (offset: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${-offset}px)`;
    }
    if (bgRef.current) {
      bgRef.current.style.transform = `translateX(${-offset * parallaxRatio}px)`;
    }
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (isWide) return; // wide mode uses native scrolling
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging.current = true;
    dragStartX.current = e.clientX;
    // Start from the current logical position (activeIndex), not a stale
    // offset ref — keyboard/wheel navigation changes activeIndex without
    // updating offsetRef.
    dragStartOffset.current = activeIndex * resolvedWidth;
    offsetRef.current = dragStartOffset.current;
    // Disable the CSS transition for direct, 1:1 manipulation while dragging.
    if (trackRef.current) trackRef.current.style.transition = 'none';
    if (bgRef.current) bgRef.current.style.transition = 'none';
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Synthetic events may lack a valid pointerId; ignore.
    }
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (isWide || !dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    let offset = dragStartOffset.current - dx;
    offset = Math.max(0, Math.min(maxOffset, offset));
    offsetRef.current = offset;
    applyOffset(offset);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (isWide || !dragging.current) return;
    dragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignore.
    }
    // Restore the CSS transition so the snap animates smoothly.
    if (trackRef.current) trackRef.current.style.transition = '';
    if (bgRef.current) bgRef.current.style.transition = '';
    // Snap to the nearest section (50% threshold).
    const index = Math.round(offsetRef.current / resolvedWidth);
    const next = loop
      ? ((index % n) + n) % n
      : Math.max(0, Math.min(n - 1, index));
    // Apply the snapped offset directly — if `next` equals the current
    // activeIndex, React won't re-render, so we must move the track ourselves.
    offsetRef.current = next * resolvedWidth;
    applyOffset(offsetRef.current);
    setActive(index);
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    // Wide mode: translate wheel input (vertical mouse wheel OR horizontal
    // trackpad) into horizontal scrolling of the native scroll container.
    // Chromium does not reliably natively-scroll a horizontal container from
    // deltaX wheel events, so we drive scrollLeft ourselves.
    if (isWide) {
      const el = scrollRef.current;
      if (!el) return;
      const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      if (delta === 0) return;
      el.scrollLeft += delta;
      return;
    }
    const delta = e.deltaX !== 0 ? e.deltaX : e.shiftKey ? e.deltaY : 0;
    if (delta === 0) return;
    // If we're within the throttle window, swallow the event (do NOT reset the
    // timer — that would extend the lock and make continuous scrolling feel
    // unresponsive).
    if (wheelLocked.current) return;
    // Advance immediately on the first event of the gesture.
    if (delta > 0) goToNext();
    else goToPrev();
    // Lock for a fixed interval; releases on schedule regardless of further
    // events, so the next page can advance as soon as the snap completes.
    wheelLocked.current = true;
    if (wheelTimer.current != null) window.clearTimeout(wheelTimer.current);
    wheelTimer.current = window.setTimeout(() => {
      wheelLocked.current = false;
    }, 200);
  };

  // Wide mode: sync the parallax background with the native scroll position.
  const handleScroll = () => {
    if (!isWide) return;
    const el = scrollRef.current;
    if (el && bgRef.current) {
      bgRef.current.style.transform = `translateX(${-el.scrollLeft * parallaxRatio}px)`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      if (isWide) {
        scrollRef.current?.scrollBy({ left: resolvedWidth, behavior: 'smooth' });
      } else {
        goToNext();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      if (isWide) {
        scrollRef.current?.scrollBy({ left: -resolvedWidth, behavior: 'smooth' });
      } else {
        goToPrev();
      }
    }
  };

  const targetOffset = activeIndex * resolvedWidth;
  const trackStyle: CSSProperties = { transform: `translateX(${-targetOffset}px)` };
  // Trailing spacer so the last page aligns to the left edge when the page
  // width is less than the viewport (e.g. sectionWidth="80%"). Without it, the
  // last page would sit at the far right with a gap on the left.
  const trailingSpacer = Math.max(0, viewportWidth - resolvedWidth);
  // The background must cover the viewport even at maximum scroll. Because
  // parallax moves it slower than the content, it lags behind by
  // `(n-1) * resolvedWidth * parallaxRatio` at the last section, so it needs
  // that much extra width beyond the full content width.
  const bgWidth = n * resolvedWidth + (n - 1) * resolvedWidth * parallaxRatio;
  const bgStyle: CSSProperties = {
    ...resolveBackground(background ?? ''),
    width: bgWidth,
    transform: `translateX(${-targetOffset * parallaxRatio}px)`,
  };

  const rootClass = [
    'metro-panorama',
    isWide ? 'metro-panorama--wide' : 'metro-panorama--mobile',
    `metro-panorama--scrollbar-${scrollbar}`,
  ].join(' ');

  const rootStyle: CSSProperties = {
    ...(accent ? ({ '--wp-accent': accent } as CSSProperties) : undefined),
    ...(bottomInset ? { paddingBottom: bottomInset } : undefined),
  };

  return (
    <div
      className={rootClass}
      style={rootStyle}
      role="region"
      aria-roledescription="carousel"
      aria-label={title ?? 'Panorama'}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onKeyDown={handleKeyDown}
    >
      {background ? (
        <div className="metro-panorama__background" ref={bgRef} style={bgStyle} />
      ) : null}

      {overlay !== null ? (
        <div
          className="metro-panorama__overlay"
          style={{
            backgroundColor: overlay ?? 'var(--wp-background)',
            opacity: overlayOpacity,
          }}
        />
      ) : null}

      {title ? <div className="metro-panorama__title">{title.toUpperCase()}</div> : null}

      <div
        className="metro-panorama__scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >
        <div className="metro-panorama__track" ref={trackRef} style={trackStyle}>
          {sections.map((section, i) => (
            <section
              key={i}
              className="metro-panorama__section"
              style={{ width: sectionWidth }}
              aria-label={typeof section.header === 'string' ? section.header : undefined}
            >
              <h2 className="metro-panorama__header">{section.header}</h2>
              <div className="metro-panorama__content">{section.children}</div>
            </section>
          ))}
          {/* Spacer so the last page aligns left when pages are narrower than
              the viewport. */}
          {trailingSpacer > 0 ? (
            <div className="metro-panorama__spacer" style={{ width: trailingSpacer }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

/** A single panorama section. Used as a child of `Panorama`. */
export function PanoramaItem({ children }: PanoramaItemProps) {
  return <>{children}</>;
}