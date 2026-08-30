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
    </div>
  );
}
