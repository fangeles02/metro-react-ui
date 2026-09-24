import { WrapPanel } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

const colors = ['#1ba1e2', '#e51400', '#a4c400', '#60a917', '#f0a30a', '#825a2c', '#6a00ff', '#d80073'];

export function WrapPanelDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Horizontal wrap</span>
      <WrapPanel gap={12}>
        {colors.map((c, i) => (
          <div key={i} style={{ width: 120, height: 80, background: c }} />
        ))}
      </WrapPanel>
      <div className="showcase__demo">
        <span className="showcase__demo-label">WrapPanel properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>orientation</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>No</td></tr>
            <tr><td><code>gap</code></td><td><code>number</code></td><td><code>0</code></td><td>No</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>style</code></td><td><code>CSSProperties</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>
      <CodeBlock
        code={`import { WrapPanel } from '@metro-react-ui/core';

<WrapPanel gap={12}>
  {items.map((item) => <div key={item.id}>{item}</div>)}
</WrapPanel>`}
      />
    </div>
  );
}
