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
      <div className="showcase__demo">
        <span className="showcase__demo-label">ExpanderView properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultExpanded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>expanded</code></td><td><code>boolean</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onExpandedChange</code></td><td><code>{'(expanded: boolean) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>
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
