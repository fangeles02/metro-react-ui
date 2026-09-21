import { useState } from 'react';
import { MultiselectList } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

const toppings = [
  { value: 'pepperoni', label: 'Pepperoni' },
  { value: 'mushrooms', label: 'Mushrooms' },
  { value: 'onions', label: 'Onions' },
  { value: 'olives', label: 'Olives' },
  { value: 'cheese', label: 'Extra cheese' },
];

export function MultiselectListDemo() {
  const [selected, setSelected] = useState<string[]>(['cheese']);

  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Select your toppings</span>
      <MultiselectList header="Toppings" items={toppings} value={selected} onChange={setSelected} />
      <span>Selected: {selected.join(', ') || '(none)'}</span>
      <div className="showcase__demo">
        <span className="showcase__demo-label">MultiselectList properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>items</code></td><td><code>MultiselectListItem&lt;T&gt;[]</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>value</code></td><td><code>T[]</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>T[]</code></td><td><code>[]</code></td><td>No</td></tr>
            <tr><td><code>onChange</code></td><td><code>{'(selected: T[]) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>
      <CodeBlock
        code={`import { MultiselectList } from '@metro-react-ui/core';

const toppings = [
  { value: 'pepperoni', label: 'Pepperoni' },
  { value: 'cheese', label: 'Extra cheese' },
];

const [selected, setSelected] = useState<string[]>(['cheese']);

<MultiselectList header="Toppings" items={toppings} value={selected} onChange={setSelected} />`}
      />
    </div>
  );
}
