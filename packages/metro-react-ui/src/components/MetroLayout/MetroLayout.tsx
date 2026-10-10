import { cloneElement, isValidElement, useEffect, useRef, type ReactElement, type ReactNode } from 'react';
import type { AppBarProps } from '../AppBar/AppBar';
import './MetroLayout.css';

export type MetroLayoutScroll = 'fixed' | 'scrollable';
export type MetroLayoutTitleSize = 'small' | 'large';

export interface MetroLayoutProps {
  /** Page title shown in the header (first line). Accepts any React node
   * (text or an image). When an image, it fills the title's height. Optional —
   * when omitted (and no `onBack`/`subtitle`), the header is not rendered. */
  title?: ReactNode;
  /**
   * Title size:
   * - `large` (default): `--wp-font-size-extra-extra-large`, light weight,
   *   lowercase.
   * - `small`: `--wp-font-size-large`, semibold weight, uppercase.
   */
  titleSize?: MetroLayoutTitleSize;
  /** Optional subtitle shown beneath the title. */
  subtitle?: ReactNode;
  /** When provided, a back button (‹) is rendered in the header and calls
   * this callback on click. */
  onBack?: () => void;
  /** Main body content. Scrolls internally when `scroll="fixed"`. */
  children: ReactNode;
  /** Optional footer content rendered below the body (above the app bar). */
  footer?: ReactNode;
  /**
   * Scroll behavior of the layout:
   * - `fixed` (default): the layout occupies 100% of the viewport height. The
   *   header is pinned at the top and only the body + footer scroll
   *   internally (scrollbar on the body/footer region).
   * - `scrollable`: the layout respects the content height and the whole page
   *   (header + body + footer) scrolls (scrollbar on the page).
   *
   * In both modes the app bar is fixed to the bottom of the viewport.
   */
  scroll?: MetroLayoutScroll;
  /**
   * Whether the app bar stays in normal flow and collapses its height when
   * hidden on wide screens (so the app bar section shrinks as the bar slides
   * down). Defaults to `true`. When `false`, the app bar overlays the content
   * and keeps its full height.
   */
  inflow?: boolean;
  /**
   * The `<AppBar>` component to render at the bottom of the layout. Pass the
   * full component (with its `AppBarButton` children, `secondaryMenu`, etc.).
   * The layout wraps it in a container that collapses to height 0 when the
   * bar is hidden on wide screens (inflow mode), so the body expands to fill
   * the space.
   */
  appBar?: ReactNode;
}

/**
 * MetroLayout — a general-purpose page container that standardizes the layout
 * of every page. Four slots, top to bottom:
 *
 * 1. **Header** — the title (first line, required) plus an optional back
 *    button and optional subtitle.
 * 2. **Body** — the main content. When `scroll="fixed"` (default) the body
 *    (and footer) scroll internally; when `scroll="scrollable"` the whole
 *    page (header + body + footer) scrolls.
 * 3. **Footer** — optional footer content.
 * 4. **AppBar** — fixed to the bottom of the viewport (via the `appBar`
 *    slot), so it stays pinned while the content scrolls behind it.
 */
export function MetroLayout({
  title,
  titleSize = 'large',
  subtitle,
  onBack,
  children,
  footer,
  scroll = 'fixed',
  inflow = true,
  appBar,
}: MetroLayoutProps) {
  const classes = [
    'metro-layout',
    `metro-layout--${scroll}`,
  ].join(' ');

  // The wrapper div that holds the app bar. In inflow mode it collapses to
  // height 0 when the app bar is hidden on wide screens (the app bar adds the
  // `metro-appbar--hidden` class), so the body expands to fill the space.
  const appbarWrapRef = useRef<HTMLDivElement>(null);

  // Inject `position="static"` into the provided AppBar so it stays in normal
  // flow (the wrapper is the last flex child, pinned to the bottom).
  let appBarNode: ReactNode = null;
  if (isValidElement<AppBarProps>(appBar)) {
    appBarNode = cloneElement(appBar as ReactElement<AppBarProps>, {
      position: 'static',
    });
  } else if (appBar) {
    appBarNode = appBar;
  }

  // Observe the app bar's `metro-appbar--hidden` class (added when it's
  // hidden on wide screens) and collapse/expand the wrapper's height so the
  // body region resizes with the bar (inflow behavior).
  useEffect(() => {
    if (!inflow) return;
    const wrap = appbarWrapRef.current;
    if (!wrap) return;
    const bar = wrap.querySelector<HTMLElement>('.metro-appbar');
    if (!bar) return;

    const apply = () => {
      const hidden = bar.classList.contains('metro-appbar--hidden');
      if (hidden) {
        wrap.style.height = '0px';
      } else {
        wrap.style.height = '';
      }
    };

    // Apply the initial state.
    apply();

    const observer = new MutationObserver(apply);
    observer.observe(bar, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [inflow, appBar]);

  return (
    <div className={classes}>
      <div className="metro-layout__scroll">
        {title || subtitle || onBack ? (
          <header className="metro-layout__header">
            <div className="metro-layout__header-row">
              {onBack ? (
                <button
                  type="button"
                  className="metro-layout__back"
                  aria-label="Back"
                  onClick={onBack}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M15 5l-7 7 7 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              ) : null}
              {title ? (
                <h1 className={`metro-layout__title metro-layout__title--${titleSize}`}>
                  {title}
                </h1>
              ) : null}
            </div>
            {subtitle ? <div className="metro-layout__subtitle">{subtitle}</div> : null}
          </header>
        ) : null}

        <div className="metro-layout__content">
          <div className="metro-layout__body">{children}</div>
          {footer ? <footer className="metro-layout__footer">{footer}</footer> : null}
        </div>
      </div>

      <div ref={appbarWrapRef} className="metro-layout__appbar">
        {appBarNode}
      </div>
    </div>
  );
}