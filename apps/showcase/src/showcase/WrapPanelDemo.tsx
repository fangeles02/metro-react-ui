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
      <CodeBlock
        code={`import { WrapPanel } from '@metro-react-ui/core';

<WrapPanel gap={12}>
  {items.map((item) => <div key={item.id}>{item}</div>)}
</WrapPanel>`}
      />
    </div>
  );
}
