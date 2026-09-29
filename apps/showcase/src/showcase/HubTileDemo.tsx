import { HubTile, TileContainer } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function HubTileDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Hub tiles (auto flip)</span>
        <TileContainer columns={4} gap={8}>
          <HubTile size="medium" title="Photos" backTitle="Camera roll" message="24 new photos" />
          <HubTile size="medium" title="Messages" backTitle="Inbox" message="3 unread" accent="#e51400" />
          <HubTile size="wide" title="Weather" backTitle="Sunny 24°" message="Mostly clear, high 24°" accent="#60a917" />
          <HubTile size="large" title="Music" backTitle="Now playing" message="Metro Radio — Live" accent="#a4c400" />
        </TileContainer>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Source image + bounce flip</span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <HubTile
            size="medium"
            source="https://picsum.photos/id/10/300/180"
            title="Photos"
            backTitle="Camera roll"
            message="24 new photos"
          />
          <HubTile
            size="medium"
            source="https://picsum.photos/id/16/300/180"
            title="Wallpapers"
            backTitle="Featured"
            message="New wallpapers added"
          />
          <HubTile
            size="medium"
            source="https://picsum.photos/id/20/300/180"
            title="Travel"
            backTitle="Destinations"
            message="Explore new places"
            bounceFlip
          />
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">BackContent (custom back face)</span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <HubTile
            size="medium"
            title="Mail"
            accent="#1ba1e2"
            backContent={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <strong>Inbox</strong>
                <span>3 unread messages</span>
                <span>1 draft</span>
              </div>
            }
          />
          <HubTile
            size="medium"
            title="Calendar"
            accent="#f0a30a"
            backContent={
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <strong>Today</strong>
                <span>Team standup 9:00</span>
                <span>Lunch 12:30</span>
              </div>
            }
          />
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">HubTile properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>size</code></td><td><code>'medium' | 'wide' | 'large'</code></td><td><code>'medium'</code></td><td>No</td></tr>
            <tr><td><code>source</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>message</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>backTitle</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>backContent</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>bounceFlip</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>Duration</code></td><td><code>number</code></td><td><code>5000</code> ms</td><td>No</td></tr>
            <tr><td><code>initialDelay</code></td><td><code>number</code></td><td>random 5000–10000 ms</td><td>No</td></tr>
            <tr><td><code>onClick</code></td><td><code>{'() => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>tilt</code></td><td><code>boolean</code></td><td><code>true</code></td><td>No</td></tr>
            <tr><td><code>tiltMaxAngle</code></td><td><code>number</code></td><td><code>17</code></td><td>No</td></tr>
            <tr><td><code>tiltMaxDepression</code></td><td><code>number</code></td><td><code>25</code></td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <CodeBlock
        code={`import { HubTile, TileContainer } from '@metro-react-ui/core';

<TileContainer columns={4} gap={8}>
  <HubTile size="medium" title="Photos" backTitle="Camera roll" message="24 new photos" />
  <HubTile size="wide" title="Weather" backTitle="Sunny 24°" message="Mostly clear" accent="#60a917" />
  <HubTile size="large" title="Music" backTitle="Now playing" message="Metro Radio" accent="#a4c400" />
</TileContainer>

<HubTile
  size="medium"
  source="https://picsum.photos/id/10/300/180"
  title="Photos"
  backTitle="Camera roll"
  message="24 new photos"
  bounceFlip
/>`}
      />
    </>
  );
}
