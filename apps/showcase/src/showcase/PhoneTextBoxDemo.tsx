import { useState } from 'react';
import { PhoneTextBox } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function PhoneTextBoxDemo() {
  const [name, setName] = useState('');

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">With watermark</span>
        <PhoneTextBox header="Name" hint="Enter your name" value={name} onValueChange={setName} />
        <span>Value: {name || '(empty)'}</span>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Custom accent</span>
        <PhoneTextBox header="Email" hint="you@example.com" accent="#a4c400" />
      </div>
      <CodeBlock
        code={`import { PhoneTextBox } from '@metro-react-ui/core';

const [name, setName] = useState('');

<PhoneTextBox
  header="Name"
  hint="Enter your name"
  value={name}
  onValueChange={setName}
  accent="#a4c400"   // optional accent override
/>`}
      />
    </>
  );
}
