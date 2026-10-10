import { useEffect, useRef, useState } from 'react';
import { FlipTransition } from '@metro-react-ui/core';
import { Button } from '@metro-react-ui/core';
import { showcasePages } from './showcase';
import './App.css';

interface NavState {
  pageId: string;
  direction: 'forward' | 'backward';
}

export default function App() {
  // The currently *shown* page.
  const [current, setCurrent] = useState<NavState>({ pageId: 'home', direction: 'forward' });

  const active = showcasePages.find((p) => p.id === current.pageId);
  const timeoutRef = useRef<number | null>(null);

  // Clean up any pending timeout on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navigate = (id: string) => {
    if (id === current.pageId) return;
    // Always start the transition from the top, regardless of current scroll.
    window.scrollTo(0, 0);
    setCurrent({ pageId: id, direction: 'forward' });
  };

  const goBack = () => {
    if (current.pageId === 'home') return;
    window.scrollTo(0, 0);
    setCurrent({ pageId: 'home', direction: 'backward' });
  };

  return (
    <div className="showcase">
      {/* Incoming page (the one being navigated to) */}
      <FlipTransition
        direction={current.direction}
        phase="in"
        animationKey={current.pageId}
        mode='turnstile'
      >
        {current.pageId === 'home' ? (
          <Home onNavigate={navigate} />
        ) : (
          <PageView page={active!} onBack={goBack} />
        )}
      </FlipTransition>
    </div>
  );
}

function Home({
  onNavigate,
}: {
  onNavigate: (id: string) => void;
}) {
  // Build timestamp injected by Vite's `define` at build/dev-server start.
  const built = new Date(__BUILD_TIME__).toLocaleString();

  return (
    <div className="showcase__page">
      {/* Hero — introduces the toolkit */}
      <section className="showcase__hero">
        <div className="showcase__hero-title">Metro UI Toolkit</div>
        <div className="showcase__hero-subtitle">React JS</div>
        <p className="showcase__hero-desc">
          Unofficial React port of classic Metro and Windows Phone Toolkit UI
          controls (Hub, Pivot, Tile, and more).
        </p>
        <div className="showcase__hero-badges">
          <a
            className="showcase__hero-badge"
            href="https://github.com/fangeles02/metro-react-ui"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub repo (MIT license)
          </a>
          <a
            className="showcase__hero-badge"
            href="https://www.npmjs.com/package/@metro-react-ui/core"
            target="_blank"
            rel="noopener noreferrer"
          >
            npm package ({__PACKAGE_VERSION__})
          </a>
          <span className="showcase__hero-badge">Built: {built}</span>
        </div>
      </section>

      {/* Title panel — matches WP8 page header (small caps app title, huge title) */}
      <div className="showcase__titlepanel">
        <div className="showcase__apptitle">WINDOWS PHONE TOOLKIT</div>
        <div className="showcase__pagetitle">samples</div>
      </div>

      {/* Plain Metro list, like the original MainPage.xaml */}
      <div className="showcase__list">
        {showcasePages.map((page) => (
          <button
            key={page.id}
            type="button"
            className="showcase__listitem"
            onClick={() => onNavigate(page.id)}
          >
            <span className="showcase__listitem-header">{page.name}</span>
            <span className="showcase__listitem-desc">{page.description}</span>
          </button>
        ))}
      </div>

      {/* Changelog — recent component updates */}
      <div className="showcase__changelog">
        <div className="showcase__changelog-title">Changelog</div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">Panorama</span>
            <span className="showcase__changelog-date">v0.1.3</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>MetroLayout-style header — <code>title</code> / <code>headerTitle</code>, <code>headerSubtitle</code>, <code>onBack</code>, <code>headerTitleSize</code>, and <code>showHeader</code> (always reserves <code>min-height: 50px</code>).</li>
            <li>Header moves with parallax (<code>headerParallaxRatio</code>, default 30% less than the background) and reveals the full title on narrow screens as you pan.</li>
            <li>Percentage page widths — <code>sectionWidth="80%"</code> shows the next page in the viewport, with a trailing spacer so the last page stays left-aligned.</li>
            <li><code>fullscreen</code> portals the background/overlay to the viewport so it fills the whole screen even inside a clipped/transformed ancestor.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">MetroLayout</span>
            <span className="showcase__changelog-date">v0.1.3</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>New general-purpose page container that standardizes layout across all pages — header (title + back button + optional subtitle), body, footer, and app bar.</li>
            <li><code>scroll</code> prop — <code>fixed</code> (default) pins the header and scrolls the body + footer internally; <code>scrollable</code> scrolls the whole page (header + body + footer).</li>
            <li>App bar is pinned to the bottom of the viewport in both modes while content scrolls behind it.</li>
            <li>App bar accepts the full <code>&lt;AppBar&gt;</code> component via the <code>appBar</code> slot.</li>
            <li><code>titleSize</code> prop — <code>large</code> (default, extra-extra-large light lowercase) or <code>small</code> (large semibold uppercase).</li>
            <li><code>title</code> accepts any React node — an image or SVG logo fills the title's height.</li>
            <li><code>title</code> is optional — with no title/back/subtitle the header collapses to a <code>min-height: 50px</code>.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">AppBar</span>
            <span className="showcase__changelog-date">v0.1.3</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>Wide-screen show/hide — the whole bar is hidden by default on wide screens and slides up/down when toggled.</li>
            <li>New <code>toggleOnContextMenu</code> prop — right-click (mouse) or long-press (touch) anywhere on the page toggles the bar; the native context menu is suppressed while enabled.</li>
            <li>Mobile is unaffected — the bar stays visible and only the button labels toggle.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">Panorama</span>
            <span className="showcase__changelog-date">v0.1.3</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>New WP7/8-style panorama — all sections side-by-side in a continuous strip with a parallax background.</li>
            <li>Wide mode (≥ <code>breakpoint</code>, default 768px) uses free native scrolling with a configurable <code>scrollbar</code>; mobile mode snaps to sections with a wheel lock.</li>
            <li>Configurable <code>sectionWidth</code> (px or CSS length like <code>'100%'</code>), <code>overlay</code> color + <code>overlayOpacity</code>, and <code>bottomInset</code> to sit above a fixed AppBar.</li>
            <li>Pointer drag, wheel/trackpad, and keyboard arrow navigation.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">Pivot</span>
            <span className="showcase__changelog-date">v{__PACKAGE_VERSION__}</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>Rebuilt with large lowercase WP8-style headers and an optional <code>title</code>.</li>
            <li>Content slides left/right on navigation; swipe or tap headers to switch.</li>
            <li>Removed the continuous/overflowing tab-header carousel (<code>animateTabLabels</code>).</li>
            <li>Accessible — <code>role="tablist"</code> / <code>role="tab"</code> / <code>role="tabpanel"</code>.</li>
            <li>Respects <code>prefers-reduced-motion</code>.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">ProgressRing</span>
            <span className="showcase__changelog-date">v{__PACKAGE_VERSION__}</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>Indeterminate progress ring with orbiting dots and a trailing comet effect.</li>
            <li>Configurable <code>size</code>, <code>accent</code>, <code>dots</code>, and <code>duration</code>.</li>
            <li>Accessible — <code>role="status"</code> with a customizable <code>aria-label</code>.</li>
            <li>Respects <code>prefers-reduced-motion</code>.</li>
            <li>Orbit animation by <a href="https://codepen.io/Chudesnov" target="_blank" rel="noreferrer">Chudesnov</a> (CodePen), ported with attribution.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">CustomMessageBox</span>
            <span className="showcase__changelog-date">v{__PACKAGE_VERSION__}</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>Declarative input fields — text, password, select, multiselect, and toggle.</li>
            <li>Theming variants — <code>default</code>, <code>accent</code>, and <code>accentedButton</code>.</li>
            <li>Responsive layout — top-anchored full-bleed on mobile, centered on wide screens.</li>
            <li>In/out transitions — <code>swivel</code>, <code>slide</code>, and <code>fade</code>.</li>
            <li>Field values collected and passed to <code>onButtonPressed</code>.</li>
          </ul>
        </div>

        <div className="showcase__changelog-entry">
          <div className="showcase__changelog-head">
            <span className="showcase__changelog-component">ChatBubble</span>
            <span className="showcase__changelog-date">v{__PACKAGE_VERSION__}</span>
          </div>
          <ul className="showcase__changelog-list">
            <li>Incoming / outgoing message types with authentic WP 8.1 styling.</li>
            <li>Configurable tail — <code>side</code>, <code>default</code>, <code>none</code>, or custom position/side.</li>
            <li>Custom background color with an auto-matching tail.</li>
            <li>Optional embedded timestamp.</li>
          </ul>
        </div>
      </div>

      <div className="showcase__buildinfo">Built: {built}</div>
    </div>
  );
}

function PageView({
  page,
  onBack,
}: {
  page: (typeof showcasePages)[number];
  onBack: () => void;
}) {
  if (page.fullscreen) {
    return (
      <div className="showcase__page showcase__page--fullscreen">
        <button type="button" className="showcase__fullscreen-back" onClick={onBack}>
          ← back
        </button>
        {page.render()}
      </div>
    );
  }

  return (
    <div className="showcase__page">
      <div className="showcase__titlepanel">
        <div className="showcase__apptitle">WINDOWS PHONE TOOLKIT</div>
        <div className="showcase__pagetitle">{page.name}</div>
      </div>
      <div className="showcase__page-content">{page.render()}</div>
      <div className="showcase__footer">
        <Button type="button"  onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
}
