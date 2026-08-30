import { useState } from 'react';
import { DatePicker, TimePicker } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function DateTimePickerDemo() {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Date picker</span>
        <DatePicker header="Date" value={date} onChange={setDate} />
        <span>{date.toLocaleDateString()}</span>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Time picker</span>
        <TimePicker header="Time" value={time} onChange={setTime} />
        <span>{time.toLocaleTimeString()}</span>
      </div>
      <CodeBlock
        code={`import { DatePicker, TimePicker } from '@metro-react-ui/core';

const [date, setDate] = useState(new Date());
const [time, setTime] = useState(new Date());

<DatePicker header="Date" value={date} onChange={setDate} />
<TimePicker header="Time" value={time} onChange={setTime} />`}
      />
    </>
  );
}
