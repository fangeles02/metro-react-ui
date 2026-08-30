import { useLayoutEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import './Pivot.css';

export interface PivotItemProps {
  /** Header text for the pivot item. */
  header: ReactNode;
  children?: ReactNode;
}

export interface PivotProps {
  /** Pivot items. */
  children: ReactNode;
  /** Index of the active item (controlled). */
  activeIndex?: number;
  /** Initial active index (uncontrolled). */
  defaultActiveIndex?: number;
  /** Callback when the active item changes. */
  onActiveIndexChange?: (index: number) => void;
  /** Accent color override. */
  accent?: string;
  /**
   * When true, the header strip scrolls so the active tab slides to the
   * left edge (authentic WP8 carousel). Also auto-enabled when the tab
   * labels overflow the container width. When false/undefined and labels
   * fit, the labels stay static.
   */
  animateTabLabels?: boolean;
}

/**
 * Metro-style pivot control. Ported from the WP Toolkit `Pivot`
 * (swipeable tab pages with a header strip).
 */
export function Pivot({
  children,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  accent,
  animateTabLabels = false,
}: PivotProps) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean) as React.ReactElement<PivotItemProps>[];
  const n = items.length;
  const isControlled = activeIndexProp !== undefined;
  // Track the active position WITHIN the tripled list (uncontrolled), so
  // navigation continues to the right/left instead of jumping back to the
  // first item. Initialized to the middle copy.
  const [activePos, setActivePos] = useState(defaultActiveIndex + n);
  const activeIndex = isControlled ? activeIndexProp : activePos % n;
  const touchStartX = useRef<number | null>(null);
  const headersRef = useRef<HTMLDivElement | null>(null);
  const activeHeaderRef = useRef<HTMLButtonElement | null>(null);
  const [labelsOverflow, setLabelsOverflow] = useState(false);
  const [overflowChecked, setOverflowChecked] = useState(false);
  // When true, the next scroll is instant (used for the seamless reset at
  // the tripled-list boundary so it doesn't animate back to the start).
  const instantScrollRef = useRef(false);

  // Detect whether the tab labels overflow the visible header strip.
  // Runs after render (refs are only set then). When they overflow, the
  // header becomes a continuous/infinite carousel.
  useLayoutEffect(() => {
    const headers = headersRef.current;
    if (headers) {
      setLabelsOverflow(headers.scrollWidth > headers.clientWidth);
      setOverflowChecked(true);
    }
  }, [n]);

  const shouldAnimate = animateTabLabels || labelsOverflow;
  // Continuous carousel: render the labels 3x so the active tab can always
  // sit at the left edge with items wrapping on both sides (infinite loop).
  const continuous = labelsOverflow;
  const displayItems = continuous ? [...items, ...items, ...items] : items;
  // The position of the active tab in the tripled list.
  const activePosInList = continuous
    ? (isControlled ? activeIndex + n : activePos)
    : activeIndex;

  // Authentic WP8 carousel: scroll the active tab to the left edge.
  // Depends on `overflowChecked` so it re-runs once overflow is known
  // (fixes the active tab being off-screen on initial load).
  useLayoutEffect(() => {
    if (!shouldAnimate || !overflowChecked) return;
    const headers = headersRef.current;
    if (!headers) return;
    // Find the active tab directly from the DOM (more reliable than the
    // ref, which can be stale during the overflow re-render).
    const active = [...headers.querySelectorAll<HTMLButtonElement>('button[data-active="true"]')][0];
    if (!active) return;
    // Scroll the active tab to the left edge. `block: 'nearest'` avoids
    // scrolling the whole page; `inline: 'start'` aligns it to the left.
    // Use instant behavior for the seamless boundary reset.
    const behavior = instantScrollRef.current ? 'auto' : 'smooth';
    instantScrollRef.current = false;
    active.scrollIntoView({ behavior, block: 'nearest', inline: 'start' });
  }, [activePosInList, shouldAnimate, overflowChecked]);

  const goTo = (index: number) => {
    // Clicking a tab jumps to its middle copy.
    const wrapped = ((index % n) + n) % n;
    if (!isControlled) setActivePos(wrapped + n);
    onActiveIndexChange?.(wrapped);
  };

  const goToRelative = (delta: number) => {
    if (isControlled) {
      const wrapped = ((activeIndex + delta) % n + n) % n;
      onActiveIndexChange?.(wrapped);
      return;
    }
    // Move continuously within the tripled list. When reaching the very
    // end of the last copy (or start of the first), reset seamlessly to
    // the middle copy with an instant (non-animated) scroll.
    let next = activePos + delta;
    if (next >= 3 * n) {
      next = n;
      instantScrollRef.current = true;
    } else if (next < 0) {
      next = 2 * n - 1;
      instantScrollRef.current = true;
    }
    setActivePos(next);
    onActiveIndexChange?.(next % n);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      goToRelative(delta < 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="metro-pivot"
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="metro-pivot__headers" role="tablist" ref={headersRef}>
        {displayItems.map((item, k) => {
          const isActive = continuous ? k === activePosInList : k === activeIndex;
          return (
            <button
              key={continuous ? `c-${k}` : k}
              type="button"
              role="tab"
              aria-selected={isActive}
              className="metro-pivot__header"
              data-active={isActive}
              ref={isActive ? activeHeaderRef : undefined}
              onClick={() => goTo(k % n)}
            >
              {item.props.header}
            </button>
          );
        })}
      </div>
      <div className="metro-pivot__content">
        {items[activeIndex]?.props.children}
      </div>
    </div>
  );
}

/** A single pivot item. Used as a child of `Pivot`. */
export function PivotItem({ children }: PivotItemProps) {
  return <>{children}</>;
}
