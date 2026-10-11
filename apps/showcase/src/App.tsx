import { useEffect, useRef, useState } from 'react';
import { FlipTransition } from '@metro-react-ui/core';
import { Button } from '@metro-react-ui/core';
import { showcasePages } from './showcase';
import { HomePage } from './home/HomePage';
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

  const isHome = current.pageId === 'home';

  return (
    <div className="showcase">
      {/* The home page stays mounted (hidden while a demo is active) so its
          panorama position + scroll survive back-navigation. `visibility:
          hidden` (not `display:none`) keeps its layout, preserving scroll.
          The FlipTransition `animationKey` stays constant so the home is
          NEVER remounted (a changing key would reset its state). */}
      <div
        className="showcase__home"
        style={{
          visibility: isHome ? 'visible' : 'hidden',
          position: isHome ? 'static' : 'absolute',
          inset: 0,
          zIndex: isHome ? 1 : 0,
        }}
      >
        <FlipTransition
          direction={current.direction}
          phase="in"
          animationKey="home"
          mode="turnstile"
        >
          <HomePage onNavigate={navigate} />
        </FlipTransition>
      </div>

      {/* The active demo page (only rendered when not on home). */}
      {!isHome && (
        <FlipTransition
          direction={current.direction}
          phase="in"
          animationKey={current.pageId}
          mode="turnstile"
        >
          <PageView page={active!} onBack={goBack} />
        </FlipTransition>
      )}
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
