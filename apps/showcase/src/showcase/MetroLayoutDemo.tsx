import { MetroLayout, AppBar, AppBarButton } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

/* Simple inline SVG glyphs (stroke-based, inherit currentColor). */
function AddIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12l5 5L19 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

/** Long filler content so the body scrolls in `fixed` mode. */
function LongContent() {
  return (
    <div>
      {Array.from({ length: 30 }, (_, i) => (
        <p key={i} style={{ margin: '0 0 12px', color: 'var(--wp-subtle)' }}>
          Body content line {i + 1} — this demonstrates the scrollable body.
        </p>
      ))}
    </div>
  );
}

export function MetroLayoutDemo() {
  return (
    <>
      <div className="showcase__demo">
        <span className="showcase__demo-label">Fixed (default) — body scrolls internally</span>
        <div className="showcase__demo-frame" style={{ maxHeight: 'none', overflow: 'hidden' }}>
          <MetroLayout
            title="settings"
            subtitle="Fixed layout — the body scrolls, the header and app bar stay put."
            onBack={() => console.log('back')}
            footer={<span style={{ color: 'var(--wp-subtle)' }}>Footer content</span>}
            appBar={
              <AppBar alignment="left" toggleOnContextMenu secondaryMenu={[{ label: 'Settings', onSelect: () => {} }]}>
                <AppBarButton label="add" icon={<AddIcon />} />
                <AppBarButton label="done" icon={<CheckIcon />} />
                <AppBarButton label="settings" icon={<SettingsIcon />} />
              </AppBar>
            }
          >
            <LongContent />
          </MetroLayout>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">Scrollable — whole page scrolls</span>
        <div className="showcase__demo-frame" style={{ maxHeight: 'none', overflow: 'hidden' }}>
          <MetroLayout
            title="threads"
            scroll="scrollable"
            appBar={
              <AppBar alignment="left">
                <AppBarButton label="add" icon={<AddIcon />} />
                <AppBarButton label="done" icon={<CheckIcon />} />
              </AppBar>
            }
          >
            <LongContent />
          </MetroLayout>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">How it works</span>
        <CodeBlock
          code={`<MetroLayout
  title="settings"
  subtitle="Optional subtitle"
  onBack={() => navigate(-1)}
  footer={<span>Footer</span>}
  scroll="fixed"            // or "scrollable"
  appBar={
    <AppBar alignment="left" secondaryMenu={[...]}>
      <AppBarButton label="add" icon={<AddIcon />} />
    </AppBar>
  }
>
  {/* body content */}
</MetroLayout>`}
        />
      </div>
    </>
  );
}