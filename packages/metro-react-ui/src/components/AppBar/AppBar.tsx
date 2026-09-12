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
  const overflowRef = useRef<HTMLButtonElement>(null);
  const swipeStartY = useRef<number | null>(null);
  const menuHeightRef = useRef<number>(0);

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
    // Measure the natural (unclamped) content height.
    el.style.height = 'auto';
    const target = el.getBoundingClientRect().height;
    el.style.height = '0px';
    // Force a reflow so the 0px start applies before the transition.
    void el.getBoundingClientRect();
    menuHeightRef.current = target;
    // Let the transition run to the measured height.
    requestAnimationFrame(() => {
      el.style.height = `${target}px`;
    });
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

  const toggleMenu = () => setMenuOpen((open) => !open);

  const handleOverflowPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return; // handled by click
    swipeStartY.current = e.clientY;
  };

  const handleOverflowPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    if (swipeStartY.current === null) return;
    // Swiping up (finger moving toward smaller Y) opens the menu.
    if (swipeStartY.current - e.clientY > 30) {
      setMenuOpen(true);
      swipeStartY.current = null;
    }
  };

  const handleOverflowPointerUp = () => {
    swipeStartY.current = null;
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
    <div className={classes} role="toolbar" aria-label="app bar" {...rest}>
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
              onPointerLeave={handleOverflowPointerUp}
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
      )}
    </div>
  );
}