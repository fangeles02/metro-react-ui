import { useState } from 'react';
import { AutoCompleteBox } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

const countries = [
  'Argentina', 'Australia', 'Brazil', 'Canada', 'China', 'Denmark',
  'Egypt', 'France', 'Germany', 'India', 'Japan', 'Mexico',
  'Netherlands', 'Norway', 'Portugal', 'Spain', 'Sweden', 'United States',
];

export function AutoCompleteBoxDemo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Starts-with filter</span>
        <AutoCompleteBox
          header="Country"
          hint="Type to search"
          items={countries}
          getItemText={(c) => c}
          onSelectionChanged={setSelected}
        />
        <span>Selected: {selected ?? '(none)'}</span>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Contains filter</span>
        <AutoCompleteBox
          header="Country (contains)"
          items={countries}
          getItemText={(c) => c}
          filterMode="contains"
        />
      </div>
      <CodeBlock
        code={`import { AutoCompleteBox } from '@metro-react-ui/core';

const countries = ['Argentina', 'Brazil', 'Canada', /* ... */];

<AutoCompleteBox
  header="Country"
  hint="Type to search"
  items={countries}
  getItemText={(c) => c}
  onSelectionChanged={setSelected}
  filterMode="contains"   // 'startsWith' (default) | 'contains'
/>`}
      />
    </>
  );
}
