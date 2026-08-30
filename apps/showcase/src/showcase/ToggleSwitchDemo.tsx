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
