import { AppBar, AppBarButton } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

/* Simple inline SVG glyphs (stroke-based, inherit currentColor) used for the
   demo. Consumers can pass any React node as an AppBarButton `icon`. */
function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12l5 5L19 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CancelIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.1-1.57 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.57-1.1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.1 1.57 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .6 1 1.7 1.7 0 0 0 1.1.4H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.36 1.85.6 2.81.72a2 2 0 0 1 1.72 2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function AppBarDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Variants</span>
        <div className="showcase__demo-row">
          <AppBarButton label="add" icon={<AddIcon />} />
          <AppBarButton label="done" variant="filled" icon={<CheckIcon />} />
          <AppBarButton label="cancel" variant="accent" icon={<CancelIcon />} />
          <AppBarButton label="settings" icon={<SettingsIcon />} />
          <AppBarButton label="phone" variant="filled" icon={<PhoneIcon />} disabled />
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">App bar (bottom, accented)</span>
        <div className="showcase__demo-frame">
          <div className="appbar-demo-content">scrollable content above the bar</div>
          <AppBar alignment='left'>
            <AppBarButton label="add" icon={<AddIcon />} />
            <AppBarButton label="done" icon={<CheckIcon />} />
            <AppBarButton label="cancel" icon={<CancelIcon />} />
            <AppBarButton label="phone" icon={<PhoneIcon />} />
          </AppBar>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Alignment</span>
        <div className="showcase__demo-row">
          <div className="showcase__demo-frame showcase__demo-frame--auto">
            <div className="appbar-demo-content">left</div>
            <AppBar alignment="left">
              <AppBarButton label="add" icon={<AddIcon />} />
              <AppBarButton label="done" icon={<CheckIcon />} />
            </AppBar>
          </div>
          <div className="showcase__demo-frame showcase__demo-frame--auto">
            <div className="appbar-demo-content">center</div>
            <AppBar alignment="center">
              <AppBarButton label="add" icon={<AddIcon />} />
              <AppBarButton label="done" icon={<CheckIcon />} />
            </AppBar>
          </div>
          <div className="showcase__demo-frame showcase__demo-frame--auto">
            <div className="appbar-demo-content">right</div>
            <AppBar alignment="right">
              <AppBarButton label="add" icon={<AddIcon />} />
              <AppBarButton label="done" icon={<CheckIcon />} />
            </AppBar>
          </div>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Responsive (wide vs mobile)</span>
        <div className="showcase__demo-row">
          <div className="showcase__demo-frame showcase__demo-frame--auto">
            <div className="appbar-demo-content">wide — labels always visible</div>
            <AppBar alignment="left">
              <AppBarButton label="add" icon={<AddIcon />} />
              <AppBarButton label="done" icon={<CheckIcon />} />
              <AppBarButton label="cancel" icon={<CancelIcon />} />
            </AppBar>
          </div>
          <div className="showcase__demo-frame showcase__demo-frame--auto">
            <div className="appbar-demo-content">mobile — labels toggle</div>
            <AppBar breakpoint={9999}>
              <AppBarButton label="add" icon={<AddIcon />} />
              <AppBarButton label="done" icon={<CheckIcon />} />
              <AppBarButton label="cancel" icon={<CancelIcon />} />
            </AppBar>
          </div>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Secondary menu (overflow)</span>
        <div className="showcase__demo-frame showcase__demo-frame--auto">
          <div className="appbar-demo-content">tap ⋯ (or swipe up on touch)</div>
          <AppBar
            alignment="left"
            secondaryMenu={[
              { label: 'New message', onSelect: () => console.log('new message') },
              { label: 'Mark all read', onSelect: () => console.log('mark all read') },
              { label: 'Settings', onSelect: () => console.log('settings') },
              { label: 'Delete', disabled: true },
            ]}
          >
            <AppBarButton label="add" icon={<AddIcon />} />
            <AppBarButton label="done" icon={<CheckIcon />} />
          </AppBar>
        </div>
      </div>

      <CodeBlock
        code={`import { AppBar, AppBarButton } from '@metro-react-ui/core';

<AppBar>
  <AppBarButton label="add" icon={<AddIcon />} />
  <AppBarButton label="done" variant="filled" icon={<CheckIcon />} />
  <AppBarButton label="cancel" variant="accent" icon={<CancelIcon />} />
</AppBar>

{/* All-icon accent bar, pinned to the bottom of the screen */}
<AppBar accented position="sticky" background="chrome">
  <AppBarButton label="add" icon={<AddIcon />} />
  <AppBarButton label="done" icon={<CheckIcon />} />
</AppBar>

{/* Control button placement: left | center | right | space-around | space-between */}
<AppBar alignment="left">
  <AppBarButton label="add" icon={<AddIcon />} />
  <AppBarButton label="done" icon={<CheckIcon />} />
</AppBar>

{/* Responsive: wide shows labels always; mobile centers + toggles labels.
    breakpoint (px) separates wide from mobile. defaultOpen controls the
    initial mobile label visibility. */}
<AppBar breakpoint={768} defaultOpen={false}>
  <AppBarButton label="add" icon={<AddIcon />} />
  <AppBarButton label="done" icon={<CheckIcon />} />
</AppBar>`}
      />

      <CodeBlock
        code={`import { AppBar, AppBarButton } from '@metro-react-ui/core';

{/* WP8 ApplicationBar.secondaryMenu: a text-only overflow menu.
    The ⋯ button appears at the far right (always visible) and opens a
    dark-chrome menu whose items slide up one-by-one. Tap/click toggles it;
    on touch, swiping up on the button also opens it. */}
<AppBar alignment="left" secondaryMenu={[
  { label: 'New message', onSelect: () => { /* ... */ } },
  { label: 'Mark all read', onSelect: () => { /* ... */ } },
  { label: 'Settings', onSelect: () => { /* ... */ } },
  { label: 'Delete', disabled: true },
]}>
  <AppBarButton label="add" icon={<AddIcon />} />
  <AppBarButton label="done" icon={<CheckIcon />} />
</AppBar>

{/* Note: when secondaryMenu is set, the ⋯ button replaces the mobile
    label-toggle, so on narrow screens the labels can't be toggled via ⋯. */}`}
      />

      <div className="showcase__demo">
        <span className="showcase__demo-label">AppBar properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>isVisible</code></td><td><code>boolean</code></td><td><code>true</code></td><td>No</td></tr>
            <tr><td><code>accented</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>background</code></td><td><code>'chrome' | 'transparent' | 'accent'</code></td><td><code>'chrome'</code></td><td>No</td></tr>
            <tr><td><code>alignment</code></td><td><code>'left' | 'center' | 'right' | 'space-around' | 'space-between'</code></td><td><code>'space-around'</code></td><td>No</td></tr>
            <tr><td><code>position</code></td><td><code>'sticky' | 'fixed' | 'static'</code></td><td><code>'sticky'</code></td><td>No</td></tr>
            <tr><td><code>breakpoint</code></td><td><code>number</code></td><td><code>768</code></td><td>No</td></tr>
            <tr><td><code>defaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>isOpen</code></td><td><code>boolean</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onToggle</code></td><td><code>{'(open: boolean) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>secondaryMenu</code></td><td><code>ContextMenuItem[]</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">AppBarButton properties</span>
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>icon</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>variant</code></td><td><code>'default' | 'filled' | 'accent'</code></td><td><code>'default'</code></td><td>No</td></tr>
            <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
          </tbody>
        </table>
      </div>
    </>
  );
}