import { Button } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

/**
 * MPA Demo — links out to the standalone multi-page messaging sample.
 *
 * Unlike the other showcase pages (which swap content inside the SPA), this
 * page opens a SEPARATE HTML document (`/mpa/threads.html`) so you can see
 * the URL change and the FlipTransition page transition run across real page
 * loads. From there, opening a thread navigates to a second document
 * (`/mpa/conversation.html`), each with its own AppBar.
 */
export function MpaDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Multi-page app sample</span>
        <p className="showcase__demo-hint" style={{ margin: 0 }}>
          This opens a separate HTML document (not the SPA), so the URL changes and the
          FlipTransition runs across real page loads. Two page levels: message threads →
          conversation, each with its own AppBar.
        </p>
        <div className="showcase__demo-row">
          <Button type="button" onClick={() => (window.location.href = '/mpa/threads.html')}>
            Open MPA demo
          </Button>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">How it works</span>
        <CodeBlock
          code={`// Page 1 (threads.html) — play the "out" phase, then navigate.
const [leaving, setLeaving] = useState<string | null>(null);

const openThread = (id: string) => {
  setLeaving(id);
  setTimeout(() => {
    window.location.href = \`/mpa/conversation.html?thread=\${id}\`;
  }, 260); // out phase = 250ms
};

<FlipTransition mode="flip" direction="forward" phase={leaving ? 'out' : 'in'}>
  <ThreadList onOpen={openThread} />
</FlipTransition>
<AppBar position="fixed">{/* threads app bar */}</AppBar>

// Page 2 (conversation.html) — play the "in" phase on mount.
const thread = findThread(new URLSearchParams(location.search).get('thread'));

<FlipTransition mode="flip" direction="backward" phase="in">
  <Conversation thread={thread} />
</FlipTransition>
<AppBar position="fixed">{/* conversation app bar */}</AppBar>`}
        />
      </div>
    </>
  );
}