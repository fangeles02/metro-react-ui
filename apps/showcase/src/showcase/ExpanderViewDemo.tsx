import { ExpanderView } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function ExpanderViewDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Expandable sections</span>
      <ExpanderView header="Getting started">
        <p>This is the content revealed when the header is tapped.</p>
      </ExpanderView>
      <ExpanderView header="Advanced settings" defaultExpanded>
        <p>This section starts expanded.</p>
      </ExpanderView>
      <ExpanderView header="About">
        <p>Metro UI — a web port of the Windows Phone Toolkit.</p>
      </ExpanderView>
      <CodeBlock
        code={`import { ExpanderView } from '@metro-react-ui/core';

<ExpanderView header="Getting started">
  <p>Content revealed when the header is tapped.</p>
</ExpanderView>
<ExpanderView header="Advanced settings" defaultExpanded>
  <p>This section starts expanded.</p>
</ExpanderView>`}
      />
    </div>
  );
}
