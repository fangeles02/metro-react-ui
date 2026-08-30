# @metro-react-ui/core

A web port of the **Windows Phone Toolkit** — Metro/Modern UI React components built with plain CSS custom properties.

## Install

```bash
npm install @metro-react-ui/core
```

## Usage

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

## Theming

All design tokens are CSS custom properties (`--wp-accent`, `--wp-foreground`, `--wp-background`, etc.). Use `ThemeProvider` to change the accent color and light/dark mode at runtime without a rebuild.

## Components

- **Primitives:** `ToggleSwitch`, `RatingControl`, `PhoneTextBox`, `WrapPanel`
- **Composite:** `ListPicker`, `AutoCompleteBox`, `ExpanderView`, `CustomMessageBox`, `ContextMenu`, `DatePicker`, `TimePicker`
- **Lists:** `MultiselectList`, `LongListMultiSelector`
- **Animated/Effects:** `HubTile`, `Pivot`, `TiltEffect`, `SlideInEffect`

## License

MIT
