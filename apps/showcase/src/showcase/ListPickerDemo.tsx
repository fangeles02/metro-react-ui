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
