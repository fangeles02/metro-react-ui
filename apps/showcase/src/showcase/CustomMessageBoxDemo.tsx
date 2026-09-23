import { useState } from 'react';
import {
  Button,
  CustomMessageBox,
  type MessageBoxTransition,
  type MessageBoxVariant,
} from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function CustomMessageBoxDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [variant, setVariant] = useState<MessageBoxVariant>('default');
  const [transition, setTransition] = useState<MessageBoxTransition | undefined>(undefined);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Modal dialog</span>
        <div className="showcase__demo-row">
          <Button onClick={() => setOpen(true)}>Show message box</Button>
        </div>
        <div className="showcase__demo-row">
          {(['default', 'accent', 'accentedButton'] as MessageBoxVariant[]).map((v) => (
            <button
              key={v}
              type="button"
              className="showcase__demo-btn"
              onClick={() => setVariant(v)}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="showcase__demo-row">
          {(['auto', 'swivel', 'slide', 'fade'] as const).map((t) => (
            <button
              key={t}
              type="button"
              className="showcase__demo-btn"
              onClick={() => setTransition(t === 'auto' ? undefined : t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="showcase__demo-hint">
          variant: {variant} · transition: {transition ?? 'auto (swivel mobile / fade wide)'}
        </div>
        {result && <span>Result: {result}</span>}
      </div>
      <CustomMessageBox
        open={open}
        title="New contact"
        message="Fill in the details below."
        variant={variant}
        transition={transition}
        fields={[
          {
            type: 'text',
            name: 'name',
            label: 'Name',
            hint: 'Enter full name',
            defaultValue: '',
          },
          {
            type: 'select',
            name: 'group',
            label: 'Group',
            options: [
              { value: 'family', label: 'Family' },
              { value: 'friends', label: 'Friends' },
              { value: 'work', label: 'Work' },
            ],
            defaultValue: 'friends',
          },
          {
            type: 'multiselect',
            name: 'tags',
            label: 'Tags',
            options: [
              { value: 'vip', label: 'VIP' },
              { value: 'favorite', label: 'Favorite' },
              { value: 'blocked', label: 'Blocked' },
            ],
            defaultValue: ['favorite'],
          },
          {
            type: 'toggle',
            name: 'notify',
            label: 'Notify on new message',
            defaultValue: true,
          },
        ]}
        buttons={[
          { label: 'cancel', value: 'cancel' },
          { label: 'save', value: 'save' },
        ]}
        onButtonPressed={(v, values) => {
          setResult(`${String(v)} · ${JSON.stringify(values)}`);
          setOpen(false);
        }}
        onDismiss={() => setOpen(false)}
      />
      <CodeBlock
        code={`import { CustomMessageBox } from '@metro-react-ui/core';

const [open, setOpen] = useState(false);

<CustomMessageBox
  open={open}
  title="New contact"
  message="Fill in the details below."
  variant="default"            // default | accent | accentedButton
  transition="auto"            // auto | swivel | slide | fade
  fields={[
    { type: 'text', name: 'name', label: 'Name', hint: 'Enter full name' },
    {
      type: 'select',
      name: 'group',
      label: 'Group',
      options: [
        { value: 'family', label: 'Family' },
        { value: 'friends', label: 'Friends' },
      ],
    },
    {
      type: 'multiselect',
      name: 'tags',
      label: 'Tags',
      options: [
        { value: 'vip', label: 'VIP' },
        { value: 'favorite', label: 'Favorite' },
      ],
    },
    { type: 'toggle', name: 'notify', label: 'Notify on new message' },
  ]}
  buttons={[
    { label: 'cancel', value: 'cancel' },
    { label: 'save', value: 'save' },
  ]}
  onButtonPressed={(value, values) => {
    console.log(value, values);
    setOpen(false);
  }}
  onDismiss={() => setOpen(false)}
/>`}
      />
    </>
  );
}
