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
    </>
  );
}