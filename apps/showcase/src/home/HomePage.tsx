import { AppBar, AppBarButton, ExpanderView, MetroLayout, Panorama, PanoramaItem, Tile } from '@metro-react-ui/core';
import { showcasePages, type ShowcasePage } from '../showcase';
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

/** GitHub mark (fill-based, inherits currentColor). */
function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

/** npm mark (fill-based, inherits currentColor). */
function NpmIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z"
      />
    </svg>
  );
}

/** Faint plug icon — marks a control ported from the official WP Toolkit. */
function PlugIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 2v6M15 2v6M7 8h10v3a5 5 0 0 1-10 0V8zM12 16v6" />
    </svg>
  );
}

/**
 * A small indicator shown next to a sample's name on the home page list,
 * marking whether it's a port of the official WP Toolkit. Original work gets
 * no indicator. A custom tooltip appears on hover/tap.
 */
function OriginIndicator({ origin }: { origin: ShowcasePage['origin'] }) {
  if (origin !== 'ported') return null;
  return (
    <span
      className="showcase__origin showcase__origin--ported"
      aria-hidden="true"
    >
      <PlugIcon />
      <span className="showcase__origin-tooltip">
        Ported from official WP Toolkit
      </span>
    </span>
  );
}

/** A single sample list item with its origin indicator. */
function SampleListItem({
  page,
  onNavigate,
}: {
  page: ShowcasePage;
  onNavigate: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className="showcase__listitem"
      aria-label={page.name}
      onClick={() => onNavigate(page.id)}
    >
      <span className="showcase__listitem-header">
        {page.name}
        <OriginIndicator origin={page.origin} />
      </span>
      <span className="showcase__listitem-desc">{page.description}</span>
    </button>
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
    <AppBar defaultOpen={false} toggleOnContextMenu={true} alignment="left">
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

  // Group the samples by category for the panorama pages. Settings is
  // reachable via the app bar, so it's excluded from the categorized lists.
  const byCategory = (cat: ShowcasePage['category']) =>
    showcasePages.filter((p) => p.category === cat && p.id !== 'settings');

  return (
    <div className="showcase__page showcase__page--fullscreen">
      <MetroLayout appBar={<HomeAppBar onNavigate={onNavigate} />}>
        <Panorama
          title="Metro UI Toolkit"
          headerTitle="Metro UI Toolkit"

          sectionWidth="90%"
        >
          <PanoramaItem header="overview">
            <div className="showcase__home-section">
              <p className="showcase__home-lead">
                Unofficial React port of classic Metro and Windows Phone Toolkit
                UI controls (Hub, Pivot, Tile, and more).
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <Tile
                  size="medium"
                  title="GitHub"
                  icon={<GitHubIcon />}
                  message={{ body: 'metro-react-ui\n(MIT License)' }}
                  bounceFlip={true}
                  onClick={() => window.open('https://github.com/fangeles02/metro-react-ui', '_blank', 'noopener,noreferrer')}
                />
                <Tile
                  size="medium"
                  title="npm"
                  icon={<NpmIcon />}
                  message={{ body: 'Latest version\n0.1.3' }}
                  bounceFlip={true}
                  onClick={() => window.open('https://www.npmjs.com/package/@metro-react-ui/core', '_blank', 'noopener,noreferrer')}
                />
              </div>

             

              <div className="showcase__buildinfo">Built: {built}</div>
            </div>
          </PanoramaItem>

          <PanoramaItem header="controls">
            <div className="showcase__list">
              {byCategory('controls').map((page) => (
                <SampleListItem key={page.id} page={page} onNavigate={onNavigate} />
              ))}
            </div>
          </PanoramaItem>

          <PanoramaItem header="components">
            <div className="showcase__list">
              {byCategory('components').map((page) => (
                <SampleListItem key={page.id} page={page} onNavigate={onNavigate} />
              ))}
            </div>
          </PanoramaItem>

          <PanoramaItem header="layout">
            <div className="showcase__list">
              {byCategory('layout').map((page) => (
                <SampleListItem key={page.id} page={page} onNavigate={onNavigate} />
              ))}
            </div>
          </PanoramaItem>

          <PanoramaItem header="demos">
            <div className="showcase__list">
              {byCategory('demos').map((page) => (
                <SampleListItem key={page.id} page={page} onNavigate={onNavigate} />
              ))}
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