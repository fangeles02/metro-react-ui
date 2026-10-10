import { AppBar, AppBarButton, ExpanderView, MetroLayout, Panorama, PanoramaItem } from '@metro-react-ui/core';
import { showcasePages } from '../showcase';
import { CHANGELOG } from './changelog';

/** Simple inline SVG gear glyph (stroke-based, inherits currentColor). */
function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M19.4 13a7.6 7.6 0 0 0 .1-1 7.6 7.6 0 0 0-.1-1l2-1.6-2-3.4-2.4 1a7.6 7.6 0 0 0-1.7-1L15 3.6h-4l-.3 2.4a7.6 7.6 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7.6 7.6 0 0 0 1.7 1l.3 2.4h4l.3-2.4a7.6 7.6 0 0 0 1.7-1l2.4 1 2-3.4-2-1.6z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The home page app bar — a single "settings" button that opens the theme
 * settings page. `defaultOpen` keeps the bar (and its label) visible on wide
 * screens; we deliberately do NOT use `toggleOnContextMenu` so the settings
 * button is always reachable.
 */
function HomeAppBar({ onNavigate }: { onNavigate: (id: string) => void }) {
  return (
    <AppBar defaultOpen alignment="left">
      <AppBarButton
        label="settings"
        icon={<SettingsIcon />}
        onClick={() => onNavigate('settings')}
      />
    </AppBar>
  );
}

/**
 * The revamped showcase home page: a full-bleed `MetroLayout` (no title/back —
 * the header collapses to a slim bar) with an `AppBar` pinned to the bottom
 * and a `Panorama` filling the body. The panorama pages are the scrollable
 * content: Overview, Controls, Layouts, demos + POC's, and Changelog.
 */
export function HomePage({ onNavigate }: { onNavigate: (id: string) => void }) {
  // Build timestamp injected by Vite's `define` at build/dev-server start.
  const built = new Date(__BUILD_TIME__).toLocaleString();

  // The Controls page lists every sample except Settings (which is reachable
  // via the app bar's settings button).
  const controls = showcasePages.filter((p) => p.id !== 'settings');

  return (
    <div className="showcase__page showcase__page--fullscreen">
      <MetroLayout appBar={<HomeAppBar onNavigate={onNavigate} />}>
        <Panorama
          title="Metro UI Toolkit"
          headerTitle="Metro UI Toolkit"
          headerSubtitle="Unofficial React port of classic Metro and Windows Phone Toolkit UI controls (Hub, Pivot, Tile, and more)"
          sectionWidth="80%"
        >
          <PanoramaItem header="overview">
            <div className="showcase__home-section">
              <p className="showcase__home-lead">
                Unofficial React port of classic Metro and Windows Phone Toolkit
                UI controls (Hub, Pivot, Tile, and more).
              </p>

              <div className="showcase__home-links">
                <a
                  className="showcase__hero-badge"
                  href="https://github.com/fangeles02/metro-react-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repo (MIT license)
                </a>
                <a
                  className="showcase__hero-badge"
                  href="https://www.npmjs.com/package/@metro-react-ui/core"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  npm package ({__PACKAGE_VERSION__})
                </a>
              </div>

              <div className="showcase__buildinfo">Built: {built}</div>
            </div>
          </PanoramaItem>

          <PanoramaItem header="controls">
            <div className="showcase__list">
              {controls.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  className="showcase__listitem"
                  onClick={() => onNavigate(page.id)}
                >
                  <span className="showcase__listitem-header">{page.name}</span>
                  <span className="showcase__listitem-desc">{page.description}</span>
                </button>
              ))}
            </div>
          </PanoramaItem>

          <PanoramaItem header="layouts">
            <div className="showcase__home-section">
              <p className="showcase__home-hint">Coming soon.</p>
            </div>
          </PanoramaItem>

          <PanoramaItem header="demos + poc's">
            <div className="showcase__home-section">
              <p className="showcase__home-hint">Coming soon.</p>
            </div>
          </PanoramaItem>

          <PanoramaItem header="changelog">
            <div className="showcase__changelog">
              {CHANGELOG.map((version, i) => (
                <ExpanderView
                  key={version.version}
                  header={`v${version.version}`}
                  defaultExpanded={i === 0}
                >
                  {version.entries.map((entry, j) => (
                    <div className="showcase__changelog-entry" key={`${entry.component}-${j}`}>
                      <div className="showcase__changelog-head">
                        <span className="showcase__changelog-component">
                          {entry.component}
                        </span>
                      </div>
                      <ul className="showcase__changelog-list">
                        {entry.bullets.map((bullet, j) => (
                          <li key={j}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </ExpanderView>
              ))}
            </div>
          </PanoramaItem>
        </Panorama>
      </MetroLayout>
    </div>
  );
}