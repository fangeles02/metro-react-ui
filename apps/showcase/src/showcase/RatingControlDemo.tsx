import { useState } from 'react';
import { RatingControl } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function RatingControlDemo() {
  const [value, setValue] = useState(3);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Interactive (drag to rate)</span>
        <RatingControl value={value} onChange={setValue} showSelectionHelper />
        <span>Value: {value}</span>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Read-only</span>
        <RatingControl value={4} readOnly />
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Custom accent</span>
        <RatingControl defaultValue={2} accent="#e51400" />
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">RatingControl properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>value</code></td><td><code>number</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>number</code></td><td><code>0</code></td><td>No</td></tr>
            <tr><td><code>max</code></td><td><code>number</code></td><td><code>5</code></td><td>No</td></tr>
            <tr><td><code>onChange</code></td><td><code>{'(value: number) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>readOnly</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>showSelectionHelper</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>aria-label</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        code={`import { RatingControl } from '@metro-react-ui/core';

const [value, setValue] = useState(3);

<RatingControl value={value} onChange={setValue} showSelectionHelper />
<RatingControl value={4} readOnly />
<RatingControl defaultValue={2} accent="#e51400" />`}
      />
    </>
  );
}
