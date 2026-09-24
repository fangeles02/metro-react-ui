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
  const [simpleMessageOpen, setSimpleMessageOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [variant, setVariant] = useState<MessageBoxVariant>('default');
  const [transition, setTransition] = useState<MessageBoxTransition | undefined>(undefined);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Modal dialog with fields</span>
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

      <div className="showcase__demo">
        <span className="showcase__demo-label">Simple confirmation</span>
        <div className="showcase__demo-row">
          <Button onClick={() => setSimpleMessageOpen(true)}>Show confirmation</Button>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Password input</span>
        <div className="showcase__demo-row">
          <Button onClick={() => setPasswordOpen(true)}>Show password box</Button>
        </div>
        {passwordValue && <span>Password: {passwordValue}</span>}
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">CustomMessageBox properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>title</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>message</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>fields</code></td><td><code>MessageBoxField[]</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>buttons</code></td><td><code>CustomMessageBoxButton[]</code></td><td><code>[{'{ label: "ok" }'}]</code></td><td>No</td></tr>
            <tr><td><code>variant</code></td><td><code>'default' | 'accent' | 'accentedButton'</code></td><td><code>'default'</code></td><td>No</td></tr>
            <tr><td><code>breakpoint</code></td><td><code>number</code></td><td><code>768</code></td><td>No</td></tr>
            <tr><td><code>transition</code></td><td><code>'swivel' | 'slide' | 'fade'</code></td><td><code>'auto'</code></td><td>No</td></tr>
            <tr><td><code>onButtonPressed</code></td><td><code>{'(value, values) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onDismiss</code></td><td><code>{'() => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">variant values</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>default</code></td><td>Chrome background with default buttons.</td></tr>
            <tr><td><code>accent</code></td><td>Accent background with accent-light buttons.</td></tr>
            <tr><td><code>accentedButton</code></td><td>Chrome background with accent buttons.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">transition values</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>auto</code></td><td>Swivel on mobile, fade on wide screens.</td></tr>
            <tr><td><code>swivel</code></td><td>Rotates in/out (WP8.1 style).</td></tr>
            <tr><td><code>slide</code></td><td>Slides vertically with easing.</td></tr>
            <tr><td><code>fade</code></td><td>Cross-fades in/out.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">field types</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>text</code></td><td>Single-line text input (PhoneTextBox).</td></tr>
            <tr><td><code>password</code></td><td>Masked text input.</td></tr>
            <tr><td><code>select</code></td><td>Single-select dropdown (ListPicker).</td></tr>
            <tr><td><code>multiselect</code></td><td>Multi-select list (MultiselectList).</td></tr>
            <tr><td><code>toggle</code></td><td>On/off switch (ToggleSwitch).</td></tr>
          </tbody>
        </table>
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
            style: { width: '60%' },
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

      <CustomMessageBox 
        open={simpleMessageOpen}
        title="Confirmation"
        message="The quick brown fox jumps over the lazy dog"
        buttons={[{ label: 'Ok', value: 'ok' }]}
        variant="accent"
        transition="swivel"
        onButtonPressed={() => {
          setSimpleMessageOpen(false);
        }}
      />

      <CustomMessageBox
        open={passwordOpen}
        title="Enter password"
        message="Password is required to gain access to this restricted content"
        fields={[
          {
            type: 'password',
            name: 'password',
            label: 'Password',
            hint: 'Enter password',
            defaultValue: '',
            style: { maxWidth: 500 },
          },
        ]}
        buttons={[
          { label: 'cancel', value: 'cancel' },
          { label: 'ok', value: 'ok' },
        ]}
        onButtonPressed={(_v, values) => {
          setPasswordValue(String(values.password ?? ''));
          setPasswordOpen(false);
        }}
        onDismiss={() => setPasswordOpen(false)}
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
