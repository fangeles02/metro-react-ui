import { AppBar, AppBarButton, Panorama, PanoramaItem } from '@metro-react-ui/core';

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
 * to the viewport; this page provides a full-screen Panorama workspace.
 */
export function SpaDemo() {
  return (
    <Panorama
      title="My Application"
      background="/panorama-bg.svg"
      overlayOpacity={0.3}
      sectionWidth="80%"
      bottomInset={84}
    >
      <PanoramaItem header="home">
        <p>Welcome to the SPA demo.</p>
        <p>Pan left/right to explore the pages. The background scrolls slower for a parallax effect.</p>
      </PanoramaItem>
      <PanoramaItem header="activity">
        <p>Recent activity lives here.</p>
      </PanoramaItem>
      <PanoramaItem header="settings">
        <p>Settings content.</p>
      </PanoramaItem>
    </Panorama>
  );
}