import { useEffect, useState, type HTMLAttributes, type ReactNode } from 'react';
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

  const classes = [
    'metro-appbar',
    `metro-appbar--${background}`,
    `metro-appbar--align-${alignment}`,
    `metro-appbar--pos-${position}`,
    isMobile ? 'metro-appbar--mobile' : 'metro-appbar--wide',
    isMobile && !isOpen ? 'metro-appbar--collapsed' : '',
    accented ? 'metro-appbar--accented' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} role="toolbar" aria-label="app bar" {...rest}>
      {children}
      {isMobile && (
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
      )}
    </div>
  );
}