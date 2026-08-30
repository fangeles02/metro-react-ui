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
