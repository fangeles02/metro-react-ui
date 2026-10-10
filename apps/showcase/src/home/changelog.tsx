import type { ReactNode } from 'react';

/**
 * Changelog entries, grouped by package version. The topmost version is the
 * latest release and is expanded by default on the home page.
 *
 * Each entry is a component name + a list of bullet points (React nodes so
 * they can include `<code>` and links).
 */
export interface ChangelogEntry {
  component: string;
  bullets: ReactNode[];
}

export interface ChangelogVersion {
  version: string;
  entries: ChangelogEntry[];
}

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: '0.1.3',
    entries: [
      {
        component: 'Panorama',
        bullets: [
          <>MetroLayout-style header — <code>title</code> / <code>headerTitle</code>, <code>headerSubtitle</code>, <code>onBack</code>, <code>headerTitleSize</code>, and <code>showHeader</code> (always reserves <code>min-height: 50px</code>).</>,
          <>Header moves with parallax (<code>headerParallaxRatio</code>, default 30% less than the background) and reveals the full title on narrow screens as you pan.</>,
          <>Percentage page widths — <code>sectionWidth="80%"</code> shows the next page in the viewport, with a trailing spacer so the last page stays left-aligned.</>,
          <><code>fullscreen</code> portals the background/overlay to the viewport so it fills the whole screen even inside a clipped/transformed ancestor.</>,
        ],
      },
      {
        component: 'MetroLayout',
        bullets: [
          <>New general-purpose page container that standardizes layout across all pages — header (title + back button + optional subtitle), body, footer, and app bar.</>,
          <><code>scroll</code> prop — <code>fixed</code> (default) pins the header and scrolls the body + footer internally; <code>scrollable</code> scrolls the whole page (header + body + footer).</>,
          <>App bar is pinned to the bottom of the viewport in both modes while content scrolls behind it.</>,
          <>App bar accepts the full <code>&lt;AppBar&gt;</code> component via the <code>appBar</code> slot.</>,
          <><code>titleSize</code> prop — <code>large</code> (default, extra-extra-large light lowercase) or <code>small</code> (large semibold uppercase).</>,
          <><code>title</code> accepts any React node — an image or SVG logo fills the title's height.</>,
          <><code>title</code> is optional — with no title/back/subtitle the header collapses to a <code>min-height: 50px</code>.</>,
        ],
      },
      {
        component: 'AppBar',
        bullets: [
          <>Wide-screen show/hide — the whole bar is hidden by default on wide screens and slides up/down when toggled.</>,
          <>New <code>toggleOnContextMenu</code> prop — right-click (mouse) or long-press (touch) anywhere on the page toggles the bar; the native context menu is suppressed while enabled.</>,
          <>Mobile is unaffected — the bar stays visible and only the button labels toggle.</>,
        ],
      },
      {
        component: 'Panorama',
        bullets: [
          <>New WP7/8-style panorama — all sections side-by-side in a continuous strip with a parallax background.</>,
          <>Wide mode (≥ <code>breakpoint</code>, default 768px) uses free native scrolling with a configurable <code>scrollbar</code>; mobile mode snaps to sections with a wheel lock.</>,
          <>Configurable <code>sectionWidth</code> (px or CSS length like <code>'100%'</code>), <code>overlay</code> color + <code>overlayOpacity</code>, and <code>bottomInset</code> to sit above a fixed AppBar.</>,
          <>Pointer drag, wheel/trackpad, and keyboard arrow navigation.</>,
        ],
      },
    ],
  },
  {
    version: '0.1.2',
    entries: [
      {
        component: 'Pivot',
        bullets: [
          <>Rebuilt with large lowercase WP8-style headers and an optional <code>title</code>.</>,
          <>Content slides left/right on navigation; swipe or tap headers to switch.</>,
          <>Removed the continuous/overflowing tab-header carousel (<code>animateTabLabels</code>).</>,
          <>Accessible — <code>role="tablist"</code> / <code>role="tab"</code> / <code>role="tabpanel"</code>.</>,
          <>Respects <code>prefers-reduced-motion</code>.</>,
        ],
      },
      {
        component: 'ProgressRing',
        bullets: [
          <>Indeterminate progress ring with orbiting dots and a trailing comet effect.</>,
          <>Configurable <code>size</code>, <code>accent</code>, <code>dots</code>, and <code>duration</code>.</>,
          <>Accessible — <code>role="status"</code> with a customizable <code>aria-label</code>.</>,
          <>Respects <code>prefers-reduced-motion</code>.</>,
          <>Orbit animation by <a href="https://codepen.io/Chudesnov" target="_blank" rel="noreferrer">Chudesnov</a> (CodePen), ported with attribution.</>,
        ],
      },
      {
        component: 'CustomMessageBox',
        bullets: [
          <>Declarative input fields — text, password, select, multiselect, and toggle.</>,
          <>Theming variants — <code>default</code>, <code>accent</code>, and <code>accentedButton</code>.</>,
          <>Responsive layout — top-anchored full-bleed on mobile, centered on wide screens.</>,
          <>In/out transitions — <code>swivel</code>, <code>slide</code>, and <code>fade</code>.</>,
          <>Field values collected and passed to <code>onButtonPressed</code>.</>,
        ],
      },
      {
        component: 'ChatBubble',
        bullets: [
          <>Incoming / outgoing message types with authentic WP 8.1 styling.</>,
          <>Configurable tail — <code>side</code>, <code>default</code>, <code>none</code>, or custom position/side.</>,
          <>Custom background color with an auto-matching tail.</>,
          <>Optional embedded timestamp.</>,
        ],
      },
    ],
  },
];