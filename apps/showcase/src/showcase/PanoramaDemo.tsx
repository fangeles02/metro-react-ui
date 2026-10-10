import { Panorama, PanoramaItem } from '@metro-react-ui/core';
import { CodeBlock } from './CodeBlock';

export function PanoramaDemo() {
  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Drag, scroll, or use arrow keys to pan</span>
      <Panorama
        title="My Application"
        background="linear-gradient(135deg, #1ba1e2 0%, #0e6e9c 100%)"
      >
        <PanoramaItem header="overview">
          <p>This is the overview panorama section.</p>
          <p>Drag left/right, scroll, or use the arrow keys to pan between sections.</p>
        </PanoramaItem>
        <PanoramaItem header="details">
          <p>Details live here.</p>
          <p>Notice the background scrolls slower than the content — that's the parallax effect.</p>
        </PanoramaItem>
        <PanoramaItem header="settings">
          <p>Settings content.</p>
        </PanoramaItem>
        <PanoramaItem header="about">
          <p>About this panorama.</p>
        </PanoramaItem>
      </Panorama>
      <CodeBlock
        code={`import { Panorama, PanoramaItem } from '@metro-react-ui/core';

<Panorama
  title="My Application"
  background="linear-gradient(135deg, #1ba1e2 0%, #0e6e9c 100%)"
>
  <PanoramaItem header="overview">
    <p>Overview content.</p>
  </PanoramaItem>
  <PanoramaItem header="details">
    <p>Details content.</p>
  </PanoramaItem>
  <PanoramaItem header="settings">
    <p>Settings content.</p>
  </PanoramaItem>
</Panorama>`}
      />
      <div className="showcase__demo">
        <span className="showcase__demo-label">Panorama properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>children</code></td><td><code>PanoramaItem[]</code></td><td>—</td><td>Yes*</td></tr>
            <tr><td><code>items</code></td><td><code>PanoramaItemData[]</code></td><td>—</td><td>Yes*</td></tr>
            <tr><td><code>title</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>headerTitle</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>headerSubtitle</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>onBack</code></td><td><code>{'() => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>headerTitleSize</code></td><td><code>'small' | 'large'</code></td><td><code>'large'</code></td><td>No</td></tr>
            <tr><td><code>headerParallaxRatio</code></td><td><code>number</code></td><td><code>parallaxRatio</code></td><td>No</td></tr>
            <tr><td><code>showHeader</code></td><td><code>boolean</code></td><td><code>true</code></td><td>No</td></tr>
            <tr><td><code>background</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>overlay</code></td><td><code>string | null</code></td><td><code>var(--wp-background)</code></td><td>No</td></tr>
            <tr><td><code>overlayOpacity</code></td><td><code>number</code></td><td><code>0.5</code></td><td>No</td></tr>
            <tr><td><code>sectionWidth</code></td><td><code>number | string</code></td><td><code>480</code></td><td>No</td></tr>
            <tr><td><code>sectionWidth</code> (e.g. <code>'80%'</code>)</td><td>Shows the next page in the viewport; a trailing spacer keeps the last page left-aligned.</td><td>—</td><td>No</td></tr>
            <tr><td><code>activeIndex</code></td><td><code>number</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>defaultActiveIndex</code></td><td><code>number</code></td><td><code>0</code></td><td>No</td></tr>
            <tr><td><code>onActiveIndexChange</code></td><td><code>{'(index: number) => void'}</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>accent</code></td><td><code>string</code></td><td>—</td><td>No</td></tr>
            <tr><td><code>parallaxRatio</code></td><td><code>number</code></td><td><code>0.5</code></td><td>No</td></tr>
            <tr><td><code>loop</code></td><td><code>boolean</code></td><td><code>false</code></td><td>No</td></tr>
            <tr><td><code>breakpoint</code></td><td><code>number</code></td><td><code>768</code></td><td>No</td></tr>
            <tr><td><code>scrollbar</code></td><td><code>'auto' | 'hidden' | 'visible'</code></td><td><code>'auto'</code></td><td>No</td></tr>
            <tr><td><code>bottomInset</code></td><td><code>number</code></td><td><code>0</code></td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>

      <div className="showcase__demo">
        <span className="showcase__demo-label">PanoramaItem properties</span>
        <div className="showcase__specs-scroll">
        <table className="showcase__specs">
          <thead>
            <tr><th>Property</th><th>Type</th><th>Default</th><th>Required</th></tr>
          </thead>
          <tbody>
            <tr><td><code>header</code></td><td><code>ReactNode</code></td><td>—</td><td>Yes</td></tr>
            <tr><td><code>children</code></td><td><code>ReactNode</code></td><td>—</td><td>No</td></tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}