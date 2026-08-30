import { HubTile } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function HubTileDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Animated tiles (auto flip/drop)</span>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <HubTile title="Photos" backTitle="Camera roll" message="12 new photos" />
        <HubTile title="Messages" backTitle="Inbox" message="3 unread" accent="#e51400" />
        <HubTile title="Music" backTitle="Now playing" accent="#a4c400" />
        <HubTile title="Weather" backTitle="Sunny 24°" accent="#60a917" />
      </div>
      <CodeBlock
        code={`import { HubTile } from '@metro-react-ui/core';

<HubTile title="Photos" backTitle="Camera roll" message="12 new photos" />
<HubTile title="Messages" backTitle="Inbox" message="3 unread" accent="#e51400" />`}
      />
    </div>
  );
}
