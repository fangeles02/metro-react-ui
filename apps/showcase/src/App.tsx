import { useEffect, useRef, useState } from 'react';
import { FlipTransition, MetroLayout } from '@metro-react-ui/core';
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

  // Handle the browser back/forward buttons (and gesture back). The SPA pushes
  // a history entry when navigating to a demo page, so the browser back button
  // returns to home instead of leaving the app (to about:blank etc.).
  useEffect(() => {
    const onPopState = (e: PopStateEvent) => {
      const pageId = (e.state?.pageId as string | undefined) ?? 'home';
      const direction: 'forward' | 'backward' = pageId === 'home' ? 'backward' : 'forward';
      window.scrollTo(0, 0);
      setCurrent({ pageId, direction });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (id: string) => {
    if (id === current.pageId) return;
    // Always start the transition from the top, regardless of current scroll.
    window.scrollTo(0, 0);
    // Push a history entry so the browser back button returns to home.
    window.history.pushState({ pageId: id }, '');
    setCurrent({ pageId: id, direction: 'forward' });
  };

  const goBack = () => {
    if (current.pageId === 'home') return;
    // Delegate to the browser history so the in-app back button and the
    // browser back button behave identically (popstate updates the state).
    window.history.back();
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
        {page.render({ onBack })}
      </div>
    );
  }

  return (
    <MetroLayout title={page.name} onBack={onBack} previousPageLabel="< Back" scroll="scrollable">
      <div className="showcase__page-content">{page.render({ onBack })}</div>
    </MetroLayout>
  );
}
