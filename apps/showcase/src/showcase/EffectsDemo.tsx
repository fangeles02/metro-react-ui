import { SlideInEffect, TiltEffect } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function EffectsDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Tilt effect (press &amp; hold)</span>
        <TiltEffect>
          <div
            style={{
              width: 160,
              height: 160,
              background: 'var(--wp-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontFamily: 'var(--wp-font-family)',
            }}
          >
            tilt me
          </div>
        </TiltEffect>
      </div>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Slide-in effect (scroll into view)</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <SlideInEffect direction="up">
            <div style={{ padding: 16, background: 'var(--wp-chrome)' }}>Slides up</div>
          </SlideInEffect>
          <SlideInEffect direction="left" delay={150}>
            <div style={{ padding: 16, background: 'var(--wp-chrome)' }}>Slides left</div>
          </SlideInEffect>
          <SlideInEffect direction="right" delay={300}>
            <div style={{ padding: 16, background: 'var(--wp-chrome)' }}>Slides right</div>
          </SlideInEffect>
        </div>
      </div>
      <CodeBlock
        code={`import { TiltEffect, SlideInEffect } from '@metro-react-ui/core';

<TiltEffect>
  <div>Press & hold to tilt</div>
</TiltEffect>

<SlideInEffect direction="up" delay={150}>
  <div>Slides in when scrolled into view</div>
</SlideInEffect>`}
      />

      <div className="showcase__demo">
        <span className="showcase__demo-label">TiltEffect properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>maxAngle</code></td><td><code>number</code></td><td><code>17</code></td><td>No</td></tr>
            <tr><td><code>maxDepression</code></td><td><code>number</code></td><td><code>25</code></td><td>No</td></tr>
            <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">SlideInEffect properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>direction</code></td><td><code>'up' | 'down' | 'left' | 'right'</code></td><td><code>'up'</code></td><td>No</td></tr>
            <tr><td><code>delay</code></td><td><code>number</code></td><td><code>0</code> ms</td><td>No</td></tr>
            <tr><td><code>duration</code></td><td><code>number</code></td><td><code>350</code> ms</td><td>No</td></tr>
            <tr><td><code>className</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
