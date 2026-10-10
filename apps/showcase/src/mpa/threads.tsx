import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, FlipTransition, AppBar, AppBarButton } from '@metro-react-ui/core';
import '@metro-react-ui/core/styles.css';
import { THREADS } from './data';
import { readStoredTheme } from './theme';
import './mpa.css';
import './mpa-base.css';

/* Simple inline SVG glyphs (stroke-based, inherit currentColor). */
function NewIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M21 21l-4.3-4.3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.57 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.57-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.1 1.57 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

/**
 * Page 1 of the MPA demo — the message threads list.
 *
 * This is a SEPARATE HTML document from the showcase SPA (and from the
 * conversation page). Navigating to a thread plays the FlipTransition `out`
 * phase, then performs a real `window.location` navigation to
 * `conversation.html?thread=<id>` — so the URL visibly changes.
 */
function ThreadsApp() {
  // When set, the outgoing page is frozen in its `out` phase while we wait
  // to navigate. `null` = no navigation in progress.
  const [leaving, setLeaving] = useState<string | null>(null);

  const openThread = (id: string) => {
    if (leaving) return;
    setLeaving(id);
    // The `out` phase runs for 250ms (EaseIn). Navigate once it completes.
    window.setTimeout(() => {
      window.location.href = `/mpa/conversation.html?thread=${encodeURIComponent(id)}`;
    }, 260);
  };

  return (
    <div className="mpa">
      <FlipTransition mode="flip" direction="forward" phase={leaving ? 'out' : 'in'} animationKey={leaving ? `out-${leaving}` : 'threads-in'}>
        <div className="mpa__header">
          <div className="mpa__apptitle">MESSAGING</div>
          <div className="mpa__pagetitle">threads</div>
        </div>

        <div className="mpa__threads">
          {THREADS.map((t) => (
            <button key={t.id} type="button" className="mpa__thread" onClick={() => openThread(t.id)}>
              <span className="mpa__thread-avatar">{t.name.charAt(0)}</span>
              <span className="mpa__thread-body">
                <span className="mpa__thread-name">{t.name}</span>
                <span className="mpa__thread-preview">{t.preview}</span>
              </span>
              <span className="mpa__thread-meta">
                <span className="mpa__thread-time">{t.time}</span>
                {t.unread > 0 ? <span className="mpa__thread-unread">{t.unread}</span> : null}
              </span>
            </button>
          ))}
        </div>
      </FlipTransition>

      {/* The app bar is rendered OUTSIDE the FlipTransition so its transform
          doesn't become the containing block for position:fixed. */}
      <AppBar position="fixed" alignment="left" toggleOnContextMenu secondaryMenu={[{ label: 'Settings', onSelect: () => {} }]}>
        <AppBarButton label="new" icon={<NewIcon />} />
        <AppBarButton label="search" icon={<SearchIcon />} />
        <AppBarButton label="settings" icon={<SettingsIcon />} />
      </AppBar>
    </div>
  );
}

const stored = readStoredTheme();
createRoot(document.getElementById('root')!).render(
  <ThemeProvider accent={stored?.accent} mode={stored?.mode}>
    <ThreadsApp />
  </ThemeProvider>,
);