import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react';
import './Pivot2.css';

export interface Pivot2ItemProps {
  /** Header text for the pivot item. */
  header: ReactNode;
  children?: ReactNode;
}

export interface Pivot2Props {
  /** Pivot items. */
  children: ReactNode;
  /** Optional app title shown above the headers (uppercased). */
  title?: string;
  /** Index of the active item (controlled). */
  activeIndex?: number;
  /** Initial active index (uncontrolled). */
  defaultActiveIndex?: number;
  /** Callback when the active item changes. */
  onActiveIndexChange?: (index: number) => void;
  /** Accent color override. */
  accent?: string;
}

/**
 * Metro-style pivot with large lowercase headers (authentic WP8 look).
 * Swipe left/right or tap a header to switch items. Supports controlled
 * (`activeIndex`) and uncontrolled (`defaultActiveIndex`) usage.
 */
export function Pivot2({
  children,
  title,
  activeIndex: activeIndexProp,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  accent,
}: Pivot2Props) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean) as React.ReactElement<Pivot2ItemProps>[];
  const n = items.length;
  const isControlled = activeIndexProp !== undefined;
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const activeIndex = isControlled ? activeIndexProp : internalIndex;

  // Slide direction for the content animation: 'slide-left' | 'slide-right' | ''.
  const [slideDir, setSlideDir] = useState<'slide-left' | 'slide-right' | ''>('');

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const minSwipeDistance = 40;

  // Clear the animation class after the transition completes so it can
  // re-trigger on the next navigation.
  useEffect(() => {
    if (!slideDir) return;
    const timer = setTimeout(() => setSlideDir(''), 350);
    return () => clearTimeout(timer);
  }, [slideDir, activeIndex]);

  const setActive = (index: number, dir: 'slide-left' | 'slide-right') => {
    const wrapped = ((index % n) + n) % n;
    if (!isControlled) setInternalIndex(wrapped);
    setSlideDir(dir);
    onActiveIndexChange?.(wrapped);
  };

  const goToNext = () => setActive(activeIndex + 1, 'slide-left');
  const goToPrev = () => setActive(activeIndex - 1, 'slide-right');

  const handleHeaderClick = (index: number) => {
    if (index === activeIndex) return;
    // Determine direction: next item slides left, previous slides right.
    const isNext = index === (activeIndex + 1) % n;
    setActive(index, isNext ? 'slide-left' : 'slide-right');
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const xDiff = touchStartX.current - e.changedTouches[0].clientX;
    const yDiff = touchStartY.current - e.changedTouches[0].clientY;
    touchStartX.current = null;
    touchStartY.current = null;

    // Only treat mostly-horizontal swipes as navigation.
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if (xDiff > minSwipeDistance) goToNext();
      else if (xDiff < -minSwipeDistance) goToPrev();
    }
  };

  return (
    <div
      className="metro-pivot2"
      style={accent ? { '--wp-accent': accent } as React.CSSProperties : undefined}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {title ? <div className="metro-pivot2__title">{title.toUpperCase()}</div> : null}

      <div className="metro-pivot2__headers" role="tablist">
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`metro-pivot2__header ${isActive ? 'metro-pivot2__header--active' : 'metro-pivot2__header--inactive'}`}
              onClick={() => handleHeaderClick(i)}
            >
              {item.props.header}
            </button>
          );
        })}
      </div>

      <div className="metro-pivot2__content" role="tabpanel">
        <div key={activeIndex} className={`metro-pivot2__panel ${slideDir}`}>
          {items[activeIndex]?.props.children}
        </div>
      </div>
    </div>
  );
}

/** A single pivot item. Used as a child of `Pivot2`. */
export function Pivot2Item({ children }: Pivot2ItemProps) {
  return <>{children}</>;
}