import { useState } from 'react';
import { LongListMultiSelector } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

const names = [
  'Alice', 'Aaron', 'Amelia', 'Arthur',
  'Bob', 'Bella', 'Benjamin', 'Bianca',
  'Charlie', 'Chloe', 'Connor', 'Cora',
  'David', 'Diana', 'Dylan', 'Daisy',
  'Emma', 'Ethan', 'Evelyn', 'Eli',
];

const groups = ['A', 'B', 'C', 'D', 'E'].map((key) => ({
  key,
  items: names.filter((n) => n.startsWith(key)),
}));

export function LongListMultiSelectorDemo() {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Grouped multi-select with jump bar</span>
      <LongListMultiSelector
        header="Contacts"
        groups={groups}
        getItemLabel={(n) => n}
        getItemId={(n) => n}
        value={selected}
        onChange={setSelected}
      />
      <span>Selected: {selected.length} item(s)</span>
      <CodeBlock
        code={`import { LongListMultiSelector } from '@metro-react-ui/core';

const groups = [
  { key: 'A', items: ['Alice', 'Aaron'] },
  { key: 'B', items: ['Bob', 'Bella'] },
];

const [selected, setSelected] = useState<string[]>([]);

<LongListMultiSelector
  header="Contacts"
  groups={groups}
  getItemLabel={(n) => n}
  getItemId={(n) => n}
  value={selected}
  onChange={setSelected}
/>`}
      />
    </div>
  );
}
