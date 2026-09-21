import { useState } from 'react';
import { ToggleSwitch } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function ToggleSwitchDemo() {
  const [alarm, setAlarm] = useState(true);
  const [wifi, setWifi] = useState(false);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Controlled</span>
        <ToggleSwitch header="Alarm" checked={alarm} onChange={setAlarm} />
        <ToggleSwitch header="Wi-Fi" checked={wifi} onChange={setWifi} />
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Uncontrolled + disabled</span>
        <ToggleSwitch header="Bluetooth" defaultChecked />
        <ToggleSwitch header="Airplane mode" disabled />
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">ToggleSwitch properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>checked</code></td><td><code>boolean</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultChecked</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>onChange</code></td><td><code>{'(checked: boolean) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>aria-label</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <CodeBlock
        code={`import { ToggleSwitch } from '@metro-react-ui/core';

const [alarm, setAlarm] = useState(true);

<ToggleSwitch header="Alarm" checked={alarm} onChange={setAlarm} />
<ToggleSwitch header="Bluetooth" defaultChecked />
<ToggleSwitch header="Airplane mode" disabled />`}
      />
    </>
  );
}
