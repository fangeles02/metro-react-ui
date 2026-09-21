import { Pivot, PivotItem } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function PivotDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Swipe or tap to switch</span>
      <Pivot>
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
      <span className="showcase__demo-label">Animated (overflowing labels)</span>
      <Pivot animateTabLabels>
        <PivotItem header="overview">
          <p>Overview content.</p>
        </PivotItem>
        <PivotItem header="details">
          <p>Details content.</p>
        </PivotItem>
        <PivotItem header="settings">
          <p>Settings content.</p>
        </PivotItem>
        <PivotItem header="alpha">
          <p>Alpha content.</p>
        </PivotItem>
        <PivotItem header="bravo">
          <p>Bravo content.</p>
        </PivotItem>
        <PivotItem header="charlie">
          <p>Charlie content.</p>
        </PivotItem>
        <PivotItem header="delta">
          <p>Delta content.</p>
        </PivotItem>
        <PivotItem header="echo">
          <p>Echo content.</p>
        </PivotItem>
        <PivotItem header="foxtrot">
          <p>Foxtrot content.</p>
        </PivotItem>
        <PivotItem header="golf">
          <p>Golf content.</p>
        </PivotItem>
        <PivotItem header="hotel">
          <p>Hotel content.</p>
        </PivotItem>
        <PivotItem header="india">
          <p>India content.</p>
        </PivotItem>
        <PivotItem header="juliet">
          <p>Juliet content.</p>
        </PivotItem>
        <PivotItem header="kilo">
          <p>Kilo content.</p>
        </PivotItem>
        <PivotItem header="lima">
          <p>Lima content.</p>
        </PivotItem>
      </Pivot>
      <CodeBlock
        code={`import { Pivot, PivotItem } from '@metro-react-ui/core';

{/* Static labels (default) */}
<Pivot>
  <PivotItem header="overview">
    <p>Overview content.</p>
  </PivotItem>
  <PivotItem header="details">
    <p>Details content.</p>
  </PivotItem>
</Pivot>

{/* Continuous carousel: active tab slides to the left edge and
    navigation wraps around infinitely. Auto-enabled when the labels
    overflow, or forced with animateTabLabels. */}
<Pivot animateTabLabels>
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
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>PivotItem[]</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>activeIndex</code></td><td><code>number</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultActiveIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>No</td></tr>
            <tr><td><code>onActiveIndexChange</code></td><td><code>{'(index: number) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>animateTabLabels</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">PivotItem properties</span>
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
  );
}
