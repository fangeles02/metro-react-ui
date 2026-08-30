import { useState } from 'react';
import { Button, CustomMessageBox } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function CustomMessageBoxDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Modal dialog</span>
        <Button onClick={() => setOpen(true)}>Show message box</Button>
        {result && <span>Result: {result}</span>}
      </div>
      <CustomMessageBox
        open={open}
        title="Confirm"
        message="Are you sure you want to continue?"
        buttons={[
          { label: 'cancel', value: 'cancel' },
          { label: 'ok', value: 'ok' },
        ]}
        onButtonPressed={(v) => {
          setResult(String(v));
          setOpen(false);
        }}
        onDismiss={() => setOpen(false)}
      />
      <CodeBlock
        code={`import { CustomMessageBox } from '@metro-react-ui/core';

const [open, setOpen] = useState(false);

<CustomMessageBox
  open={open}
  title="Confirm"
  message="Are you sure you want to continue?"
  buttons={[
    { label: 'cancel', value: 'cancel' },
    { label: 'ok', value: 'ok' },
  ]}
  onButtonPressed={(v) => setOpen(false)}
  onDismiss={() => setOpen(false)}
/>`}
      />
    </>
  );
}
