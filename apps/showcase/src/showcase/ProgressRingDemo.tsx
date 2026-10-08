import { ProgressRing } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function ProgressRingDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Default progress ring</span>
        <ProgressRing />
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Custom size &amp; accent</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <ProgressRing size={80} accent="#e51400" />
          <ProgressRing size={60} accent="#60a917" />
          <ProgressRing size={24} accent="#ff0097" />
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">More dots &amp; faster orbit</span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <ProgressRing dots={8} />
          <ProgressRing dots={12} duration={2000} />
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">ProgressRing properties</span>
        <div className="showcase__specs-scroll">
          <table className="showcase__specs">
            <thead>
              <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
            </thead>
            <tbody>
              <tr><td><code>size</code></td><td><code>number</code></td><td><code>40</code> px</td><td>No</td></tr>
              <tr><td><code>accent</code></td><td><code>string</code></td><td><code>var(--wp-accent)</code></td><td>No</td></tr>
              <tr><td><code>dots</code></td><td><code>number</code></td><td><code>5</code></td><td>No</td></tr>
              <tr><td><code>duration</code></td><td><code>number</code></td><td><code>4000</code> ms</td><td>No</td></tr>
              <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
              <tr><td><code>aria-label</code></td><td><code>string</code></td><td><code>'Loading'</code></td><td>No</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <CodeBlock
        code={`import { ProgressRing } from '@metro-react-ui/core';

<ProgressRing />
<ProgressRing size={80} accent="#e51400" />
<ProgressRing dots={8} duration={2000} />`}
      />

      <div className="showcase__demo">
        <span className="showcase__demo-label">Attribution</span>
        <p className="showcase__demo-hint">
          Orbit animation by{' '}
          <a href="https://codepen.io/Chudesnov" target="_blank" rel="noreferrer">
            Chudesnov
          </a>{' '}
          (CodePen), ported with attribution.
        </p>
      </div>
    </>
  );
}