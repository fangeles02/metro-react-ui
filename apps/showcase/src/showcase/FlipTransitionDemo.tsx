import { useState } from 'react';
import { FlipTransition } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

type Direction = 'forward' | 'backward';
type Origin = 'left' | 'center';
type Axis = 'horizontal' | 'vertical';
type Mode = 'flip' | 'turnstile' | 'swivel';

/**
 * Demo for the Metro-style page transition.
 * Lets you replay the animation with different mode / direction / origin settings.
 */
export function FlipTransitionDemo() {
  const [mode, setMode] = useState<Mode>('flip');
  const [direction, setDirection] = useState<Direction>('forward');
  const [origin, setOrigin] = useState<Origin>('left');
  const [axis, setAxis] = useState<Axis>('horizontal');
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
            onClick={() => setMode('turnstile')}
          >
            turnstile
          </button>
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setMode('swivel')}
          >
            swivel
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
          <button
            type="button"
            className="showcase__demo-btn"
            onClick={() => setAxis(axis === 'horizontal' ? 'vertical' : 'horizontal')}
          >
            axis: {axis}
          </button>
          <button type="button" className="showcase__demo-btn" onClick={replay}>
            replay
          </button>
        </div>
        <div className="showcase__demo-hint">
          mode: {mode} · direction: {direction} · origin: {origin} · axis: {axis} — press replay to run
          the animation
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Preview</span>
        <FlipTransition
          mode={mode}
          direction={direction}
          origin={origin}
          axis={axis}
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
// mode:      'flip' (book flip) | 'turnstile' (slide/scale) | 'swivel' (3D cube)
// direction: 'forward' | 'backward'
// origin:    'left' (book flip) | 'center' (circular spin)
// axis:      'horizontal' (rotateY) | 'vertical' (rotateX, swivel only)
// phase:     'in' | 'out'`}
      />

      <div className="showcase__demo">
        <span className="showcase__demo-label">FlipTransition properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>direction</code></td><td><code>'forward' | 'backward'</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>phase</code></td><td><code>'in' | 'out'</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>animationKey</code></td><td><code>string | number</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>origin</code></td><td><code>'left' | 'center'</code></td><td><code>'left'</code></td><td>No</td></tr>
            <tr><td><code>axis</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'horizontal'</code></td><td>No</td></tr>
            <tr><td><code>mode</code></td><td><code>'flip' | 'turnstile' | 'swivel'</code></td><td><code>'flip'</code></td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">mode values</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Value</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>flip</code></td><td>Book-page flip around the vertical axis (left origin), matching the WP Toolkit TurnstileTransition.</td></tr>
            <tr><td><code>turnstile</code></td><td>Turnstile flip + slide/scale entrance — flips on the left vertical axis while sliding in.</td></tr>
            <tr><td><code>swivel</code></td><td>True 3D cube rotation around the vertical axis (like PowerPoint "Cube").</td></tr>
          </tbody>
        </table>
        </div>
      </div>
    </>
  );
}
