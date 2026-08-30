import { useState } from 'react';
import { FlipTransition } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

type Direction = 'forward' | 'backward';
type Origin = 'left' | 'center';
type Mode = 'flip' | 'swivel' | 'cube';

/**
 * Demo for the Metro-style page transition.
 * Lets you replay the animation with different mode / direction / origin settings.
 */
export function FlipTransitionDemo() {
  const [mode, setMode] = useState<Mode>('flip');
  const [direction, setDirection] = useState<Direction>('forward');
  const [origin, setOrigin] = useState<Origin>('left');
  const [run, setRun] = useState(0);

  const replay = () => setRun((n) => n + 1);

  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Page transition</span>
        <div className="showcase__demo-row">
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setMode('flip')}
          >
            flip
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setMode('swivel')}
          >
            swivel (WP 8.1)
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setMode('cube')}
          >
            cube (3D)
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setDirection('forward')}
          >
            forward
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setDirection('backward')}
          >
            backward
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setOrigin('left')}
          >
            origin: left
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setOrigin('center')}
          >
            origin: center
          </button>
          <button type="button" className="showcase__demo-btn" onClick={replay}>
            replay
          </button>
        </div>
        <div className="showcase__demo-hint">
          mode: {mode} · direction: {direction} · origin: {origin} — press replay to run
          the animation
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Preview</span>
        <FlipTransition
          mode={mode}
          direction={direction}
          origin={origin}
          phase="in"
          animationKey={run}
        >
          {/* Single child for the base flip preview */}
          <div
            style={{
              padding: 24,
              background: 'var(--wp-accent)',
              color: '#fff',
              fontFamily: 'var(--wp-font-family)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 'var(--wp-font-size-extra-extra-large)',
                fontWeight: 'var(--wp-font-weight-light)',
                lineHeight: 1.05,
              }}
            >
              {mode}
            </div>
            <div style={{ fontSize: 'var(--wp-font-size-normal)', opacity: 0.85 }}>
              {direction} · {origin} · in
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                style={{
                  padding: '10px 20px',
                  border: '2px solid #fff',
                  background: 'transparent',
                  color: '#fff',
                  fontFamily: 'var(--wp-font-family)',
                  fontSize: 'var(--wp-font-size-normal)',
                  cursor: 'pointer',
                }}
              >
                action
              </button>
              <button
                type="button"
                style={{
                  padding: '10px 20px',
                  border: '2px solid #fff',
                  background: '#fff',
                  color: 'var(--wp-accent)',
                  fontFamily: 'var(--wp-font-family)',
                  fontSize: 'var(--wp-font-size-normal)',
                  cursor: 'pointer',
                }}
              >
                primary
              </button>
            </div>
          </div>
        </FlipTransition>
      </div>

      <CodeBlock
        code={`import { FlipTransition } from '@metro-react-ui/core';

// Incoming page (EaseOut, 350ms)
<FlipTransition mode="flip" direction="forward" phase="in" animationKey={pageId}>
  <Page />
</FlipTransition>

// Outgoing page (EaseIn, 250ms) — overlay while the exit runs
<FlipTransition mode="flip" direction="forward" phase="out" animationKey={\`out-\${pageId}\`}>
  <Page />
</FlipTransition>

// Options
// mode:      'flip' (book flip) | 'swivel' (WP 8.1) | 'cube' (3D cube)
// direction: 'forward' | 'backward'
// origin:    'left' (book flip) | 'center' (circular spin)
// phase:     'in' | 'out'`}
      />
    </>
  );
}
