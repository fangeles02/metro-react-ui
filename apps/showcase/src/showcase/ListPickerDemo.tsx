import { useState } from 'react';
import { ListPicker } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

const colors = [
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'violet', label: 'Violet' },

  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' },
  { value: 'three', label: 'Three' },
  { value: 'four', label: 'Four' },
  { value: 'five', label: 'Five' },
  { value: 'six', label: 'Six' },
  { value: 'seven', label: 'Seven' },
  { value: 'eight', label: 'Eight' },
  { value: 'nine', label: 'Nine' },
  { value: 'ten', label: 'Ten' },
];

export function ListPickerDemo() {
  const [color, setColor] = useState('blue');

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Normal (inline dropdown)</span>
        <ListPicker header="Favorite color" items={colors} value={color} onChange={setColor} maxItemsVisible={6} />
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Expanded (in-flow, WP8 style)</span>
        <ListPicker header="Favorite color" items={colors} defaultValue="green" mode="expanded" maxItemsVisible={6} />
        <span className="showcase__demo-hint">This content moves down when the list expands</span>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">ListPicker properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>items</code></td><td><code>ListPickerItem&lt;T&gt;[]</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>value</code></td><td><code>T</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultValue</code></td><td><code>T</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onChange</code></td><td><code>{'(value: T) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>'tap to select'</code></td><td>No</td></tr>
            <tr><td><code>mode</code></td><td><code>'normal' | 'expanded'</code></td><td><code>'normal'</code></td><td>No</td></tr>
            <tr><td><code>maxItemsVisible</code></td><td><code>number</code></td><td><code>5</code></td><td>No</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>aria-label</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">mode values</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>normal</code></td><td>Inline dropdown that overlays the content below it.</td></tr>
            <tr><td><code>expanded</code></td><td>In-flow expanded list (WP8 style) that grows in place, pushing content down.</td></tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        code={`import { ListPicker } from '@metro-react-ui/core';

const colors = [
  { value: 'blue', label: 'Blue' },
  { value: 'red', label: 'Red' },
];

const [color, setColor] = useState('blue');

<ListPicker header="Favorite color" items={colors} value={color} onChange={setColor} maxItemsVisible={5} />
<ListPicker header="Favorite color" items={colors} mode="expanded" maxItemsVisible={5} /> // in-flow, grows in place
// maxItemsVisible={5} caps the visible list and makes it scrollable when exceeded`}
      />
    </>
  );
}
