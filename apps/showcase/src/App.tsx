import { useEffect, useRef, useState } from 'react';
import { FlipTransition } from '@metro-react-ui/core';
import { Button } from '@metro-react-ui/core';
import { showcasePages } from './showcase';
import './App.css';

const OUT_DURATION = 250; // ms — matches ForwardOut/BackwardOut storyboards

interface NavState {
  pageId: string;
  direction: 'forward' | 'backward';
}

export default function App() {
  // The currently *shown* page.
  const [current, setCurrent] = useState<NavState>({ pageId: 'home', direction: 'forward' });
  // The outgoing page during a transition, if any.
  const [outgoing, setOutgoing] = useState<NavState | null>(null);

  const active = showcasePages.find((p) => p.id === current.pageId);
  const outgoingPage = outgoing ? showcasePages.find((p) => p.id === outgoing.pageId) : null;
  const timeoutRef = useRef<number | null>(null);

  // Clean up any pending timeout on unmount.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const navigate = (id: string) => {
    if (id === current.pageId) return;
    // Stage 1: animate the current page out.
    setOutgoing({ pageId: current.pageId, direction: 'forward' });
    // Stage 2: swap in the new page after the out animation completes.
    timeoutRef.current = window.setTimeout(() => {
      setCurrent({ pageId: id, direction: 'forward' });
      setOutgoing(null);
    }, OUT_DURATION);
  };

  const goBack = () => {
    if (current.pageId === 'home') return;
    setOutgoing({ pageId: current.pageId, direction: 'backward' });
    timeoutRef.current = window.setTimeout(() => {
      setCurrent({ pageId: 'home', direction: 'backward' });
      setOutgoing(null);
    }, OUT_DURATION);
  };

  return (
    <div className="showcase">
      {/* Incoming page (the one being navigated to) */}
      <FlipTransition
        direction={current.direction}
        phase="in"
        animationKey={current.pageId}
        mode='flip'
      >
        {current.pageId === 'home' ? (
          <Home onNavigate={navigate} />
        ) : (
          <PageView page={active!} onBack={goBack} />
        )}
      </FlipTransition>

      {/* Outgoing page (overlaid during the exit animation) */}
      {outgoing && (
        <div className="showcase__outgoing">
          <FlipTransition
            direction={outgoing.direction}
            phase="out"
            animationKey={`out-${outgoing.pageId}`}
            mode='flip'
          >
            {outgoing.pageId === 'home' ? (
              <Home onNavigate={navigate} />
            ) : (
              <PageView page={outgoingPage!} onBack={goBack} />
            )}
          </FlipTransition>
        </div>
      )}
    </div>
  );
}

function Home({
  onNavigate,
}: {
  onNavigate: (id: string) => void;
}) {
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
          <span className="showcase__hero-badge">GitHub repo: coming soon (MIT license)</span>
          <span className="showcase__hero-badge">npm package: coming soon</span>
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
