import { Pivot2, Pivot2Item } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function Pivot2Demo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Swipe or tap to switch</span>
      <Pivot2 title="My Application">
        <Pivot2Item header="overview">
          <p>This is the overview pivot item.</p>
          <p>Swipe left/right or tap the headers to navigate.</p>
        </Pivot2Item>
        <Pivot2Item header="details">
          <p>Details live here.</p>
        </Pivot2Item>
        <Pivot2Item header="settings">
          <p>Settings content.</p>
        </Pivot2Item>
      </Pivot2>
      <CodeBlock
        code={`import { Pivot2, Pivot2Item } from '@metro-react-ui/core';

<Pivot2 title="My Application">
  <Pivot2Item header="overview">
    <p>Overview content.</p>
  </Pivot2Item>
  <Pivot2Item header="details">
    <p>Details content.</p>
  </Pivot2Item>
  <Pivot2Item header="settings">
    <p>Settings content.</p>
  </Pivot2Item>
</Pivot2>`}
      />
      <div className="showcase__demo">
        <span className="showcase__demo-label">Pivot2 properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>Pivot2Item[]</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>activeIndex</code></td><td><code>number</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultActiveIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>No</td></tr>
            <tr><td><code>onActiveIndexChange</code></td><td><code>{'(index: number) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Pivot2Item properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}