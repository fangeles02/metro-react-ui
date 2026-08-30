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
