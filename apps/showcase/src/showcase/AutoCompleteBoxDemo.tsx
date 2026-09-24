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
      <div className="showcase__demo">
        <span className="showcase__demo-label">AutoCompleteBox properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>items</code></td><td><code>T[]</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>getItemText</code></td><td><code>{'(item: T) => string'}</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>filterMode</code></td><td><code>AutoCompleteFilterMode</code></td><td><code>'startsWith'</code></td><td>No</td></tr>
            <tr><td><code>value</code></td><td><code>T | null</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>No</td></tr>
            <tr><td><code>onSelectionChanged</code></td><td><code>{'(item: T | null) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onTextChanged</code></td><td><code>{'(text: string) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>hint</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>header</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>aria-label</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">filterMode values</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>none</code></td><td>No filtering — all items are always shown.</td></tr>
            <tr><td><code>startsWith</code></td><td>Items whose text starts with the query.</td></tr>
            <tr><td><code>contains</code></td><td>Items whose text contains the query anywhere.</td></tr>
            <tr><td><code>equals</code></td><td>Items whose text exactly equals the query.</td></tr>
          </tbody>
        </table>
        </div>
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
