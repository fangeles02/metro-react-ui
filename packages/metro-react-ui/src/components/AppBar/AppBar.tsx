import { useEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { ContextMenu } from '../ContextMenu/ContextMenu';
import type { ContextMenuItem } from '../ContextMenu/ContextMenu';
import './AppBar.css';

export type AppBarBackground = 'chrome' | 'transparent' | 'accent';

export type AppBarAlignment =
  | 'left'
  | 'center'
  | 'right'
  | 'space-around'
  | 'space-between';

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /** AppBarButton children (or any content) laid out along the bar. */
  children?: ReactNode;
  /** Hide the bar entirely (display:none). Defaults to true. */
  isVisible?: boolean;
  /**
   * When true, every button is rendered in the WP8 "emphasis" accent style.
   * Defaults to `false` (buttons keep their own variant).
   */
  accented?: boolean;
  /** Background surface. Defaults to the chrome color. */
  background?: AppBarBackground;
  /**
   * Horizontal placement of the buttons along the bar.
   * Defaults to `space-around` (matches the WP8 OS app bar).
   *
   * On mobile (width < `breakpoint`) this is ignored and the buttons are
   * always centered.
   */
  alignment?: AppBarAlignment;
  /**
   * Pin the bar to the bottom of its scrolling container. `sticky`
   * (recommended) keeps it in flow and sticks to the viewport bottom without
   * overlaying content; `fixed` overlays. Defaults to `sticky`.
   */
  position?: 'sticky' | 'fixed' | 'static';
  /**
   * Screen-width threshold (px) that separates "wide" (tablet/desktop) from
   * "mobile" (narrow/phone) layouts. Defaults to `768`.
   */
  breakpoint?: number;
  /**
   * Initial open state of the button labels on mobile. On wide screens the
   * labels are always visible regardless of this value. Defaults to `false`
   * (labels hidden until the user expands the bar).
   */
  defaultOpen?: boolean;
  /**
   * Controlled open state. When provided, the component does not manage its
   * own state and calls `onToggle` instead.
   */
  isOpen?: boolean;
  /** Called when the mobile toggle button is pressed. */
  onToggle?: (open: boolean) => void;
  /**
   * WP8 `ApplicationBar.secondaryMenu`: a text-only overflow menu. When set, a
   * "more" (⋯) button appears at the far right of the bar.
   *
   * The presentation is responsive:
   * - **Mobile** (width < `breakpoint`): tapping/clicking the ⋯ button — or
   *   swiping up on touch — expands the app bar itself, revealing the menu
   *   items below the buttons (dark-chrome surface, items slide up in
   *   sequence).
   * - **Wide** (width >= `breakpoint`): since button labels are always
   *   visible, the ⋯ button opens a `ContextMenu` anchored above the button
   *   (reusing the ContextMenu component).
   *
   * Note: when `secondaryMenu` is set, the overflow button REPLACES the
   * mobile label-toggle button, so on narrow screens the button labels can no
   * longer be expanded/collapsed via the ⋯ button.
   */
  secondaryMenu?: ContextMenuItem[];
}

/**
 * WP8 app bar container: a horizontal bar (dark chrome surface with a thin
 * top border) that hosts `AppBarButton`s in a row. Defaults to `position:
 * sticky; bottom: 0` so it stays at the bottom of the screen while the rest
 * of the page scrolls behind it — mirroring the OS app bar placement.
 *
 * Responsive behavior:
 * - **Wide** (width >= `breakpoint`): button labels are always visible and
 *   the `alignment` prop is respected.
 * - **Mobile** (width < `breakpoint`): alignment is forced to `center`, the
 *   gap is narrower, and labels are shown only while `isOpen`. A toggle
 *   button (horizontal ellipsis) appears on the right to flip `isOpen`.
 */
export function AppBar({
  children,
  isVisible = true,
  accented = false,
  background = 'chrome',
  alignment = 'space-around',
  position = 'sticky',
  breakpoint = 768,
  defaultOpen = false,
  isOpen: isOpenProp,
  onToggle,
  secondaryMenu,
  className,
  ...rest
}: AppBarProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;
  });
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const menuHeightRef = useRef<number>(0);
  const barRef = useRef<HTMLDivElement>(null);
  // Drag-to-reveal gesture state (mobile).
  const dragStartY = useRef<number | null>(null);
  const dragActive = useRef(false);
  const dragMenuHeight = useRef(0);
  const dragCurrentHeight = useRef(0);
  const dragMoved = useRef(false);
  // Whether the drag started with the menu OPEN. Used to pick the reveal
  // direction — must NOT use the live `menuOpen` flag, because the first
  // upward move flips it to true and would then compute full height.
  const dragStartedOpen = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [breakpoint]);

  // Mobile entrance: bounce the buttons in (slide up from below, overshoot,
  // settle) when the app bar first appears. Driven via JS transition on the
  // row (a stable element) — a CSS `animation` can get stuck at its first
  // frame when applied on mount inside a fixed container.
  useEffect(() => {
    if (!isMobile) return;
    const bar = barRef.current;
    if (!bar) return;
    const row = bar.querySelector<HTMLElement>('.metro-appbar__row');
    if (!row) return;
    // Start state: below the bar, transparent.
    row.style.transition = 'none';
    row.style.transform = 'translateY(24px)';
    row.style.opacity = '0';
    // Force a reflow so the start state applies before the transition.
    void bar.getBoundingClientRect();
    // Let the transition run to the resting state. Use a bounce easing curve
    // (overshoots past translateY(0) into negative Y, then settles back) for
    // the authentic WP8 "bounce in" feel. Fast + pronounced overshoot so the
    // bounce is clearly noticeable.
    window.setTimeout(() => {
      row.style.transition =
        'transform 300ms cubic-bezier(0.3, 2.2, 0.5, 1), opacity 300ms cubic-bezier(0.3, 2.2, 0.5, 1)';
      row.style.transform = 'translateY(0)';
      row.style.opacity = '1';
    }, 50);
  }, [isMobile]);

  // Wide entrance: slide the WHOLE app bar up from below the viewport into
  // place once on mount (Windows 8 desktop appbar style). Targets the bar
  // element itself (not the row content, which is the mobile behavior).
  useEffect(() => {
    if (isMobile) return;
    const bar = barRef.current;
    if (!bar) return;
    // Start below the viewport, transparent.
    bar.style.transition = 'none';
    bar.style.transform = 'translateY(100%)';
    bar.style.opacity = '0';
    // Force a reflow so the start state applies before the transition.
    void bar.getBoundingClientRect();
    // Slide up into place with the easing curve.
    window.setTimeout(() => {
      bar.style.transition =
        'transform 300ms var(--wp-easing), opacity 300ms var(--wp-easing)';
      bar.style.transform = 'translateY(0)';
      bar.style.opacity = '1';
    }, 50);
  }, [isMobile]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && menuRef.current.contains(target)) return;
      if (overflowRef.current && overflowRef.current.contains(target)) return;
      setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  // Animate the menu panel's height from 0 to its natural content height so
  // the app bar visibly expands downward with an easing curve.
  useEffect(() => {
    if (!menuOpen) return;
    const el = menuRef.current;
    if (!el) return;
    // During a drag-to-reveal gesture the height is driven directly by
    // setMenuHeight (following the finger) — don't animate to full height
    // here, or the menu would jump open the instant the drag mounts it.
    if (dragActive.current) {
      // Keep the panel at the current drag height (avoid a 0-height flash).
      if (dragCurrentHeight.current > 0) {
        el.style.transition = 'none';
        el.style.height = `${Math.round(dragCurrentHeight.current)}px`;
      }
      return;
    }
    // Measure the natural (unclamped) content height.
    el.style.height = 'auto';
    const target = el.getBoundingClientRect().height;
    el.style.height = '0px';
    // Force a reflow so the 0px start applies before the transition.
    void el.getBoundingClientRect();
    menuHeightRef.current = target;
    // Let the transition run to the measured height. Use setTimeout (not
    // requestAnimationFrame) — rAF can fail to fire in some contexts.
    window.setTimeout(() => {
      el.style.height = `${target}px`;
    }, 30);
  }, [menuOpen]);

  if (!isVisible) {
    return null;
  }

  const isControlled = isOpenProp !== undefined;
  const isOpen = isControlled ? isOpenProp : internalOpen;

  const toggle = () => {
    const next = !isOpen;
    if (isControlled) {
      onToggle?.(next);
    } else {
      setInternalOpen(next);
      onToggle?.(next);
    }
  };

  const toggleMenu = () => {
    // If a drag just happened, the click is a byproduct of the gesture —
    // don't toggle (the drag's release already decided open/closed).
    if (dragMoved.current) {
      dragMoved.current = false;
      return;
    }
    setMenuOpen((open) => !open);
  };

  // Measure the menu's natural (full) height. If the menu isn't mounted yet
  // (during a drag before it opens) or its height can't be measured (e.g.
  // headless rendering), estimate it from the item count.
  const measureMenuHeight = (): number => {
    const el = menuRef.current;
    if (el) {
      const prev = el.style.height;
      el.style.height = 'auto';
      const h = el.getBoundingClientRect().height;
      el.style.height = prev;
      if (h > 0) return h;
    }
    // Estimate from items: each item is ~52px (14px padding * 2 + 24px line),
    // plus the menu's bottom padding (40px) so the drag reveals the full
    // height including the bottom margin.
    const count = secondaryMenu?.length ?? 0;
    return count > 0 ? count * 52 + 40 : 0;
  };

  // Set the menu's height directly (no transition) so it follows the finger.
  const setMenuHeight = (h: number) => {
    const el = menuRef.current;
    if (!el) return;
    el.style.transition = 'none';
    el.style.height = `${Math.max(0, Math.round(h))}px`;
  };

  const handleOverflowPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return; // handled by click
    // Always engage the gesture (open OR closed). A plain click (no movement)
    // is left to the onClick handler; only a real drag snaps open/closed.
    dragStartY.current = e.clientY;
    dragActive.current = true;
    dragMoved.current = false;
    // Capture whether the menu was open when the gesture started, so the
    // reveal direction stays consistent for the whole drag.
    dragStartedOpen.current = menuOpen;
    // Measure the natural height once at drag start.
    dragMenuHeight.current = measureMenuHeight();
    // Capture the pointer so the button keeps receiving pointermove/up events
    // even after the finger leaves the button's small bounds. Without this,
    // the drag stops as soon as the finger moves off the ~24px button.
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Some synthetic events lack a valid pointerId; ignore.
    }
  };

  const handleOverflowPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    if (!dragActive.current || dragStartY.current === null) return;
    const delta = dragStartY.current - e.clientY; // >0 = dragging up
    // Ignore tiny movements (scroll vs drag disambiguation). Only treat it as
    // a drag once the finger moves a meaningful distance.
    if (Math.abs(delta) < 10) return;
    const natural = dragMenuHeight.current;
    if (natural <= 0) return;
    // Reveal/shrink proportionally:
    // - Started closed: dragging UP reveals the menu (height follows upward
    //   distance).
    // - Started open: dragging DOWN shrinks the menu back toward 0.
    // Use the drag-START open state, not the live `menuOpen` flag — the first
    // upward move flips `menuOpen` to true, which would otherwise make the
    // next move compute full height and jump the menu open.
    let h = dragStartedOpen.current
      ? natural - Math.max(0, -delta)
      : Math.max(0, delta);
    h = Math.min(Math.max(h, 0), natural);
    dragCurrentHeight.current = h;
    setMenuHeight(h);
    dragMoved.current = true;
    // Prevent the page from scrolling while dragging the button.
    e.preventDefault();
    if (delta > 0 && !menuOpen) {
      setMenuOpen(true);
    }
  };

  const handleOverflowPointerUp = (e?: React.PointerEvent) => {
    if (!dragActive.current) return;
    dragActive.current = false;
    // Release the pointer capture so the button doesn't keep swallowing
    // events after the gesture ends.
    if (e) {
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignore — capture may not have been set (synthetic events).
      }
    }
    // A plain click (no movement) is handled by onClick — don't snap here, or
    // the menu would close on pointerup then immediately reopen on click.
    if (!dragMoved.current) {
      dragStartY.current = null;
      dragCurrentHeight.current = 0;
      return;
    }
    const el = menuRef.current;
    const natural = dragMenuHeight.current;
    const current = dragCurrentHeight.current;
    // Snap based on the drag direction, symmetric at 10%:
    // - Started closed (dragging up to open): open once past 10% of natural.
    // - Started open (dragging down to close): close once dragged down past
    //   10% (i.e. current height drops below 90% of natural).
    const threshold = dragStartedOpen.current ? natural * 0.9 : natural * 0.1;
    if (current > threshold) {
      setMenuOpen(true);
      // Let the transition animate to the full height.
      if (el) {
        el.style.transition = '';
        el.style.height = `${natural}px`;
      }
    } else {
      setMenuOpen(false);
      if (el) {
        el.style.transition = '';
        el.style.height = '0px';
      }
    }
    dragStartY.current = null;
    dragCurrentHeight.current = 0;
    dragStartedOpen.current = false;
    // Reset the drag-moved flag AFTER the immediate post-drag click has been
    // suppressed (the click fires right after pointerup). Use a short timeout
    // so the click handler sees `dragMoved = true` once, then it's cleared.
    window.setTimeout(() => {
      dragMoved.current = false;
    }, 0);
  };

  const handleOverflowPointerLeave = () => {
    if (dragActive.current) {
      handleOverflowPointerUp();
    }
  };

  const classes = [
    'metro-appbar',
    `metro-appbar--${background}`,
    `metro-appbar--align-${alignment}`,
    `metro-appbar--pos-${position}`,
    isMobile ? 'metro-appbar--mobile' : 'metro-appbar--wide',
    isMobile && !isOpen ? 'metro-appbar--collapsed' : '',
    menuOpen ? 'metro-appbar--menu-open' : '',
    accented ? 'metro-appbar--accented' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div ref={barRef} className={classes} role="toolbar" aria-label="app bar" {...rest}>
      <div className="metro-appbar__row">
        {children}
        {secondaryMenu ? (
          isMobile ? (
            <button
              ref={overflowRef}
              type="button"
              className="metro-appbar__overflow"
              aria-label="More options"
              aria-expanded={menuOpen}
              aria-controls="metro-appbar__menu"
              onClick={toggleMenu}
              onPointerDown={handleOverflowPointerDown}
              onPointerMove={handleOverflowPointerMove}
              onPointerUp={handleOverflowPointerUp}
              onPointerLeave={handleOverflowPointerLeave}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="5" cy="12" r="1.8" fill="currentColor" />
                <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                <circle cx="19" cy="12" r="1.8" fill="currentColor" />
              </svg>
            </button>
          ) : (
            <ContextMenu
              trigger="click"
              placement="top"
              items={secondaryMenu}
            >
              <button
                type="button"
                className="metro-appbar__overflow"
                aria-label="More options"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="5" cy="12" r="1.8" fill="currentColor" />
                  <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                  <circle cx="19" cy="12" r="1.8" fill="currentColor" />
                </svg>
              </button>
            </ContextMenu>
          )
        ) : isMobile ? (
          <button
            type="button"
            className="metro-appbar__toggle"
            aria-label={isOpen ? 'Hide labels' : 'Show labels'}
            aria-expanded={isOpen}
            onClick={toggle}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="5" cy="12" r="1.8" fill="currentColor" />
              <circle cx="12" cy="12" r="1.8" fill="currentColor" />
              <circle cx="19" cy="12" r="1.8" fill="currentColor" />
            </svg>
          </button>
        ) : null}
      </div>
      {secondaryMenu && isMobile && menuOpen && (
        <div
          id="metro-appbar__menu"
          ref={menuRef}
          className="metro-appbar__menu"
          role="menu"
          aria-label="More options"
        >
          <div ref={menuContentRef} className="metro-appbar__menu__content">
            {secondaryMenu.map((item, i) => (
              <button
                key={i}
                type="button"
                role="menuitem"
                className="metro-appbar__menu__item"
                style={{ '--i': i } as React.CSSProperties}
                disabled={item.disabled}
                onClick={() => {
                  setMenuOpen(false);
                  item.onSelect?.();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}