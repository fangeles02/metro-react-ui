import { AppBar, AppBarButton } from '@metro-react-ui/core';

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





function TrashIcon() {
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

/**
 * The SPA app bar, rendered at the app level (outside the page-transition
 * wrapper) so `position="fixed"` pins it to the viewport bottom. A transformed
 * ancestor (the FlipTransition) would otherwise become its containing block.
 */
export function SpaAppBar() {
  return (
    <AppBar
      position="fixed"
      alignment="left"
      secondaryMenu={[
        { label: 'Settings', onSelect: () => console.log('settings') },
        { label: 'Notifications', onSelect: () => console.log('notifications') },
        { label: 'Blocked contacts', onSelect: () => console.log('blocked contacts') },
        { label: 'Delete conversation', disabled: true },
      ]}
    >
      <AppBarButton label="add" icon={<AddIcon />} />
      <AppBarButton label="done" icon={<CheckIcon />} />
      <AppBarButton label="delete" icon={<TrashIcon />} />
    </AppBar>
  );
}

/**
 * SPA Demo — a full-page demo of the AppBar pinned to the bottom of the
 * screen (`position="fixed"`). The app bar itself is rendered at the app
 * level (outside the page-transition wrapper) so `position: fixed` pins it
 * to the viewport; this page only provides the workspace content.
 */
export function SpaDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">SPA Demo</span>

      <div className="showcase__demo-frame showcase__demo-frame--auto">
        <div className="appbar-demo-content">
          Content will be added soon
        </div>
      </div>
    </div>
  );
}