import { ChatBubble } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function ChatBubbleDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Tail: side (default)</span>
        <div className="showcase__demo-row">
          <ChatBubble type="incoming">Incoming — tail upper-left, pointing left</ChatBubble>
          <ChatBubble type="outgoing">Outgoing — tail lower-right, pointing right</ChatBubble>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Tail: default (top/bottom edge)</span>
        <div className="showcase__demo-row">
          <ChatBubble type="incoming" tail="default">
            Incoming — tail top, left-aligned, pointing up
          </ChatBubble>
          <ChatBubble type="outgoing" tail="default">
            Outgoing — tail bottom, right-aligned, pointing down
          </ChatBubble>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Custom background</span>
        <div className="showcase__demo-row">
          <ChatBubble type="incoming" background="#825a2c">
            Custom incoming color
          </ChatBubble>
          <ChatBubble type="outgoing" background="#60a917">
            Custom outgoing color
          </ChatBubble>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Tail overrides</span>
        <div className="showcase__demo-row">
          <ChatBubble type="incoming" tail={{ position: 'lower', side: 'right' }}>
            Tail lower-right
          </ChatBubble>
          <ChatBubble type="outgoing" tail={{ position: 'upper', side: 'left' }}>
            Tail upper-left
          </ChatBubble>
          <ChatBubble type="incoming" tail="none">
            No tail
          </ChatBubble>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Timestamp (lower-right)</span>
        <div className="showcase__demo-row">
          <ChatBubble type="incoming" tail="default" timestamp="9:41">
            Hey! Did you get the new build?
          </ChatBubble>
          <ChatBubble type="outgoing" tail="default" timestamp="9:20">
            Just opened it — looks great.
          </ChatBubble>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">ChatBubble properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>type</code></td><td><code>'incoming' | 'outgoing'</code></td><td><code>'incoming'</code></td><td>No</td></tr>
            <tr><td><code>background</code></td><td><code>string</code></td><td>accent / accent-light</td><td>No</td></tr>
            <tr><td><code>tail</code></td><td><code>ChatBubbleTail | 'side' | 'default' | 'none'</code></td><td><code>'side'</code></td><td>No</td></tr>
            <tr><td><code>timestamp</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">tail values</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>side</code></td><td>Tail on the side. Incoming: upper-left pointing left. Outgoing: lower-right pointing right.</td></tr>
            <tr><td><code>default</code></td><td>Tail on the top/bottom edge. Incoming: top, left-aligned, pointing up. Outgoing: bottom, right-aligned, pointing down.</td></tr>
            <tr><td><code>none</code></td><td>Hide the tail.</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <CodeBlock
        code={`import { ChatBubble } from '@metro-react-ui/core';

// Tail on the side (default): incoming upper-left, outgoing lower-right
<ChatBubble type="incoming">Hey!</ChatBubble>
<ChatBubble type="outgoing">Hi!</ChatBubble>

// Tail on the top/bottom edge
<ChatBubble type="incoming" tail="default">Top, left, pointing up</ChatBubble>
<ChatBubble type="outgoing" tail="default">Bottom, right, pointing down</ChatBubble>

// Custom background (tail auto-matches)
<ChatBubble type="outgoing" background="#60a917">Sent</ChatBubble>

// Tail overrides
<ChatBubble type="incoming" tail={{ position: 'lower', side: 'right' }}>…</ChatBubble>
<ChatBubble type="incoming" tail="none">No tail</ChatBubble>

// Timestamp embedded at the lower-right
<ChatBubble type="incoming" tail="default" timestamp="9:41">Hey!</ChatBubble>`}
      />
    </>
  );
}