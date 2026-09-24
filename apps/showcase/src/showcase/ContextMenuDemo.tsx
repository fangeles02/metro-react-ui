import { useState } from 'react';
import { ContextMenu } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function ContextMenuDemo() {
  const [action, setAction] = useState<string | null>(null);

  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Right-click or long-press</span>
      <ContextMenu
        items={[
          { label: 'Copy', onSelect: () => setAction('Copy') },
          { label: 'Paste', onSelect: () => setAction('Paste') },
          { label: 'Delete', onSelect: () => setAction('Delete') },
          { label: 'Disabled', disabled: true },
        ]}
      >
        <div className="showcase__context-target">Tap &amp; hold or right-click me</div>
      </ContextMenu>
      {action && <span>Action: {action}</span>}
      <div className="showcase__demo">
        <span className="showcase__demo-label">ContextMenu properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>items</code></td><td><code>ContextMenuItem[]</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>trigger</code></td><td><code>'longpress' | 'click'</code></td><td><code>'longpress'</code></td><td>No</td></tr>
            <tr><td><code>placement</code></td><td><code>'pointer' | 'top' | 'bottom'</code></td><td><code>'pointer'</code></td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">trigger / placement values</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>trigger="longpress"</code></td><td>Opens on tap-and-hold (touch) or right-click (desktop).</td></tr>
            <tr><td><code>trigger="click"</code></td><td>Opens on a plain click/tap.</td></tr>
            <tr><td><code>placement="pointer"</code></td><td>Menu appears at the pointer/click coordinates.</td></tr>
            <tr><td><code>placement="top"</code></td><td>Menu opens upward, centered horizontally on the host.</td></tr>
            <tr><td><code>placement="bottom"</code></td><td>Menu opens downward, centered horizontally on the host.</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <CodeBlock
        code={`import { ContextMenu } from '@metro-react-ui/core';

<ContextMenu
  items={[
    { label: 'Copy', onSelect: () => doCopy() },
    { label: 'Delete', disabled: true },
  ]}
>
  <div>Right-click or long-press me</div>
</ContextMenu>`}
      />
    </div>
  );
}
