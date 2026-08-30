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
    </>
  );
}
