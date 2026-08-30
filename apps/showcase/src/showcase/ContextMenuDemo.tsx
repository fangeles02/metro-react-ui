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
