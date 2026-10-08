import { useEffect, useRef, useState } from 'react';
import { FlipTransition } from '@metro-react-ui/core';
import { Button } from '@metro-react-ui/core';
import { showcasePages } from './showcase';
import { SpaAppBar } from './showcase/SpaDemo';
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
      {/* The SPA app bar is rendered OUTSIDE the FlipTransition so its
          transform doesn't become the containing block for position:fixed. */}
      {current.pageId === 'spa' && <SpaAppBar />}
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
