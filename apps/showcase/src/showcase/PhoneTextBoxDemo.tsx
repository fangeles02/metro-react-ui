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
      <div className="showcase__demo">
        <span className="showcase__demo-label">PhoneTextBox properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>hint</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onValueChange</code></td><td><code>{'(value: string) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>id</code></td><td><code>string</code></td><td>auto-generated</td><td>No</td></tr>
          </tbody>
        </table>
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
