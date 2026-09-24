import { Button } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function ButtonDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Default (outline)</span>
        <div className="showcase__demo-row">
          <Button>OK</Button>
          <Button>Cancel</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Filled (gray, no border)</span>
        <div className="showcase__demo-row">
          <Button variant="filled">Save</Button>
          <Button variant="filled">Apply</Button>
          <Button variant="filled" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Accent</span>
        <div className="showcase__demo-row">
          <Button variant="accent">Continue</Button>
          <Button variant="accent">Sign in</Button>
          <Button variant="accent" disabled>
            Disabled
          </Button>
        </div>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Button properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>variant</code></td><td><code>'default' | 'filled' | 'accent'</code></td><td><code>'default'</code></td><td>No</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>onClick</code></td><td><code>{'() => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">variant values</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>default</code></td><td>Outline: transparent background with a foreground border. Pressed inverts to filled.</td></tr>
            <tr><td><code>filled</code></td><td>Slightly lighter (gray) background, no border. Adapts to light/dark mode.</td></tr>
            <tr><td><code>accent</code></td><td>Uses the accent color as the background with a high-contrast foreground.</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <CodeBlock
        code={`import { Button } from '@metro-react-ui/core';

<Button>OK</Button>
<Button variant="filled">Save</Button>
<Button variant="accent">Continue</Button>
<Button disabled>Disabled</Button>`}
      />
    </>
  );
}
