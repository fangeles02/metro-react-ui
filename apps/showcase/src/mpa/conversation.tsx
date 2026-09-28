import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, FlipTransition, AppBar, AppBarButton, ChatBubble } from '@metro-react-ui/core';
import '@metro-react-ui/core/styles.css';
import { findThread } from './data';
import { readStoredTheme } from './theme';
import './mpa.css';
import './mpa-base.css';

/* Simple inline SVG glyphs (stroke-based, inherit currentColor). */
function AttachIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CallIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.36 1.85.6 2.81.72a2 2 0 0 1 1.72 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Page 2 of the MPA demo — a single conversation.
 *
 * Reads `?thread=<id>` from the URL, renders the WP 8.1-style message
 * bubbles (plain rectangle, no corner radius, with a tail), and plays the
 * FlipTransition `in` phase on mount. The back button plays the `out` phase
 * then navigates back to the threads page.
 */
function ConversationApp() {
  const thread = findThread(new URLSearchParams(window.location.search).get('thread'));
  // `null` = no navigation in progress; otherwise the target URL.
  const [leaving, setLeaving] = useState<string | null>(null);

  const goBack = () => {
    if (leaving) return;
    setLeaving('/mpa/threads.html');
    window.setTimeout(() => {
      window.location.href = '/mpa/threads.html';
    }, 260);
  };

  return (
    <div className="mpa">
      <FlipTransition mode="flip" direction="backward" phase={leaving ? 'out' : 'in'} animationKey={leaving ? 'out-back' : `in-${thread.id}`}>
        <div className="mpa__header">
          <div className="mpa__apptitle">MESSAGING</div>
          <div className="mpa__pagetitle">{thread.name}</div>
        </div>

        <button type="button" className="mpa__back" onClick={goBack}>
          ‹ back to threads
        </button>

        <div className="mpa__conversation">
          {thread.messages.map((m) => (
            <div key={m.id} className={`mpa__msg mpa__msg--${m.direction}`}>
              <ChatBubble type={m.direction === 'in' ? 'incoming' : 'outgoing'} tail="default" timestamp={m.time}>
                {m.text}
              </ChatBubble>
            </div>
          ))}
        </div>
      </FlipTransition>

      {/* App bar rendered outside the FlipTransition (position:fixed). */}
      <AppBar position="fixed" alignment="left" secondaryMenu={[{ label: 'Delete conversation', onSelect: () => {} }]}>
        <AppBarButton label="attach" icon={<AttachIcon />} />
        <AppBarButton label="call" icon={<CallIcon />} />
        <AppBarButton label="delete" icon={<DeleteIcon />} />
      </AppBar>
    </div>
  );
}

const stored = readStoredTheme();
createRoot(document.getElementById('root')!).render(
  <ThemeProvider accent={stored?.accent} mode={stored?.mode}>
    <ConversationApp />
  </ThemeProvider>,
);