import { Pivot, PivotItem } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function PivotDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Swipe or tap to switch</span>
      <Pivot title="My Application">
        <PivotItem header="overview">
          <p>This is the overview pivot item.</p>
          <p>Swipe left/right or tap the headers to navigate.</p>
        </PivotItem>
        <PivotItem header="details">
          <p>Details live here.</p>
        </PivotItem>
        <PivotItem header="settings">
          <p>Settings content.</p>
        </PivotItem>
      </Pivot>
      <CodeBlock
        code={`import { Pivot, PivotItem } from '@metro-react-ui/core';

<Pivot title="My Application">
  <PivotItem header="overview">
    <p>Overview content.</p>
  </PivotItem>
  <PivotItem header="details">
    <p>Details content.</p>
  </PivotItem>
  <PivotItem header="settings">
    <p>Settings content.</p>
  </PivotItem>
</Pivot>`}
      />
      <div className="showcase__demo">
        <span className="showcase__demo-label">Pivot properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>PivotItem[]</code></td><td>—</td><td>Yes</td></tr>
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
        <span className="showcase__demo-label">PivotItem properties</span>
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