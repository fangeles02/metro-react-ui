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
