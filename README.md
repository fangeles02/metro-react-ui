# Metro UI React

**Unofficial React port of the classic Metro / Windows Phone Toolkit UI controls** — a modern, accessible component library built with plain CSS custom properties.

> Web port of the Windows Phone Toolkit (Metro/Modern UI) — React component library + showcase app.

**[▶ Live demo](https://metro-ui-demo.fajstudio.me/)** — explore every component in the browser.

> 🤖 **AI-assisted project** — this repository is **100% AI-assisted**: the code, components, documentation, and tests were written and reviewed with the help of AI coding assistants (e.g. GitHub Copilot). Human review and direction guided the process.

## Features

- **Authentic Metro styling** — ported from the Windows Phone Toolkit XAML `StaticResource` values (accent, foreground, chrome, type scale, motion).
- **Themeable at runtime** — all design tokens are CSS custom properties; switch accent color and light/dark mode without a rebuild via `ThemeProvider`.
- **No runtime dependencies** — only `react` / `react-dom` as peer dependencies; icons are inline SVG.
- **Accessible** — ARIA roles/labels, keyboard support, `prefers-reduced-motion` support.
- **TypeScript** — fully typed with bundled `.d.ts` declarations.

## Install

```bash
npm install @metro-react-ui/core
```

## Quick start

```tsx
import { ThemeProvider, ToggleSwitch, RatingControl } from '@metro-react-ui/core';
import '@metro-react-ui/core/styles.css';

function App() {
  return (
    <ThemeProvider accent="#1ba1e2" mode="dark">
      <ToggleSwitch header="Alarm" defaultChecked />
      <RatingControl defaultValue={3} />
    </ThemeProvider>
  );
}
```

## Components

| Component | Category | Description |
| --- | --- | --- |
| `Button` | Primitives | Metro button with 3 styles (`default` / `filled` / `accent`) |
| `ToggleSwitch` | Primitives | Metro toggle switch (controlled + uncontrolled) |
| `RatingControl` | Primitives | Star rating control with drag-to-rate |
| `PhoneTextBox` | Primitives | Text input with watermark hint + underline accent |
| `WrapPanel` | Primitives | Wrapping layout panel (horizontal / vertical) |
| `ListPicker` | Composite | Inline dropdown + in-flow expanded list (WP8 style) |
| `AutoCompleteBox` | Composite | Text autocomplete with filter modes |
| `ExpanderView` | Composite | Expandable/collapsible content |
| `CustomMessageBox` | Composite | Modal dialog with title, message, and buttons |
| `ContextMenu` | Composite | Tap-and-hold / right-click menu |
| `DatePicker` | Composite | Full-screen date selection sheet |
| `TimePicker` | Composite | Full-screen time selection sheet |
| `MultiselectList` | Lists | Checkbox-style multi-select list |
| `LongListMultiSelector` | Lists | Grouped multi-select with letter jump bar |
| `HubTile` | Animated | Two-face animated tile (flip / slide) |
| `Tile` | Animated | WP 8.1 start-screen tile (4 sizes, message modes) |
| `TileContainer` | Animated | WP 8.1 start-screen grid container |
| `Pivot` | Animated | Swipeable tab pages with header strip |
| `TiltEffect` | Effects | 3D tilt on press |
| `SlideInEffect` | Effects | Content slides in when scrolled into view |
| `FlipTransition` | Transitions | Book-page / turnstile / swivel page transition |
| `AppBar` | AppBar | WP8 app bar container (sticky bottom) |
| `AppBarButton` | AppBar | Circular app bar icon button |

## Theming

All design tokens are CSS custom properties (`--wp-accent`, `--wp-foreground`, `--wp-background`, `--wp-chrome`, `--wp-font-size-*`, etc.). Use `ThemeProvider` to change the accent color and light/dark mode at runtime:

```tsx
import { ThemeProvider } from '@metro-react-ui/core';

<ThemeProvider accent="#e51400" mode="light">
  {/* ... */}
</ThemeProvider>
```

## Sample

```tsx
import { AppBar, AppBarButton, ListPicker, Tile, TileContainer } from '@metro-react-ui/core';

const colors = [
  { value: 'red', label: 'Red' },
  { value: 'blue', label: 'Blue' },
];

function App() {
  return (
    <>
      <ListPicker header="Favorite color" items={colors} defaultValue="blue" />

      <TileContainer columns={4} gap={8}>
        <Tile size="small" title="Mail" count={3} />
        <Tile size="wide" title="Photos" />
      </TileContainer>

      <AppBar>
        <AppBarButton label="add" icon={<AddIcon />} />
        <AppBarButton label="done" variant="accent" icon={<CheckIcon />} />
      </AppBar>
    </>
  );
}
```

## Showcase

A live showcase app is included in this repo (`apps/showcase`) with interactive demos, props spec tables, and code samples for every component.

**[▶ Try the live demo](https://metro-ui-demo.fajstudio.me/)**

```bash
npm install
npm run dev        # start the showcase at http://localhost:5173
npm run build      # build the library + showcase
npm run test:e2e   # run the Playwright E2E suite
```

## License

MIT
