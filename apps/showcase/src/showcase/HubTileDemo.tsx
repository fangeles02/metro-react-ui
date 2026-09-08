import { HubTile } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function HubTileDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Two-face hub tiles (auto flip)</span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <HubTile titleFace="Top Free Apps"  />
          <HubTile titleFace="Top Free Games"   />
          <HubTile titleFace="New + Rising Apps"  />
          <HubTile titleFace="New + Rising Games"  />
        </div>
      </div>

    

      <div className="showcase__demo">
        <span className="showcase__demo-label">HubTile properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>titleFace</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>backTitleFace</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>animation</code></td><td><code>'flip' | 'slide'</code></td><td><code>'flip'</code></td><td>No</td></tr>
            <tr><td><code>bounceFlip</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>Duration</code></td><td><code>number</code></td><td><code>5000</code> ms</td><td>No</td></tr>
            <tr><td><code>initialDelay</code></td><td><code>number</code></td><td>random 5000–10000 ms</td><td>No</td></tr>
            <tr><td><code>onClick</code></td><td><code>{'() => void'}</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">animation values</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>flip</code></td><td>Whole tile rotates to reveal the back face.</td></tr>
            <tr><td><code>slide</code></td><td>Back face slides up over the front, and slides back down on return.</td></tr>
            <tr><td><code>bounceFlip</code></td><td>When <code>true</code>, flip-mode transitions use a springy WP8-style bounce (single overshoot) instead of a plain flip.</td></tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        code={`import { HubTile } from '@metro-react-ui/core';

<HubTile titleFace="Photos" backTitleFace="Camera roll" />
<HubTile titleFace="Messages" backTitleFace="Inbox" accent="#e51400" />
<HubTile titleFace="Mail" backTitleFace="Inbox" animation="slide" />
<HubTile titleFace="Photos" backTitleFace="Camera roll" bounceFlip />`}
      />
    </>
  );
}
