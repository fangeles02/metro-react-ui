# Theme Provider — Technical Notes

> How the Metro UI theme system works: runtime dark/light mode + accent color
> switching via CSS custom properties.

---

## Overview

The theme system lets you switch **dark/light mode** and **accent color** at
runtime without a rebuild. It works by setting CSS custom properties on the
root element (`:root`) via a `ThemeProvider`, and reading them back through
React context.

Two layers:
1. **`ThemeProvider`** (library, `@metro-react-ui/core`) — applies the CSS
   variables and exposes the current theme via context.
2. **`ThemeSettingsProvider`** (showcase app) — holds the user's chosen
   accent + mode and re-renders `ThemeProvider` with them.

---

## 1. `packages/metro-react-ui/src/theme/ThemeProvider.tsx`

### Exports
- `ThemeProvider` — component that applies theme variables + provides context
- `useMetroTheme()` — hook to read the current theme
- `accentForeground(accent)` — returns `#000` (light accent) or `#fff` (dark accent)
- `isLightAccent(accent)` — YIQ perceived-brightness check
- `DEFAULT_ACCENT` — `#1ba1e2` (WP blue)
- Types: `ThemeMode` (`'light' | 'dark'`), `MetroTheme`, `ThemeProviderProps`

### Props
```tsx
interface ThemeProviderProps {
  children: ReactNode;
  accent?: string;      // hex, e.g. '#1ba1e2'. Defaults to WP blue.
  mode?: ThemeMode;     // 'light' | 'dark'. Defaults to 'dark'.
  scope?: HTMLElement;  // where to apply vars. Defaults to document.documentElement (:root).
}
```

### How it applies the theme (runtime)
```tsx
useEffect(() => {
  if (!root) return;
  root.style.setProperty('--wp-accent', resolvedAccent);
  root.style.setProperty('--wp-accent-light', accent ? shade(resolvedAccent, 0.35) : '#6ec8f0');
  root.style.setProperty('--wp-accent-dark', accent ? shade(resolvedAccent, -0.45) : '#0e6e9c');
  root.style.setProperty('--wp-accent-foreground', accent ? accentForeground(resolvedAccent) : '#ffffff');
  root.setAttribute('data-theme', mode);
}, [accent, mode, root, resolvedAccent]);
```

- Sets `--wp-accent`, `--wp-accent-light`, `--wp-accent-dark`,
  `--wp-accent-foreground` as inline CSS variables.
- Sets `data-theme="light"` or `data-theme="dark"` on the root, which the
  `tokens.css` light-theme overrides key off of.
- `accentForeground` picks black/white text for accent surfaces using the
  YIQ perceived-brightness heuristic, with a threshold tuned for the WP8
  palette (see below).

### Context
```tsx
const ThemeContext = createContext<MetroTheme>({ accent: DEFAULT_ACCENT, mode: 'dark' });
// value = { accent, mode }
```

### Helpers
```tsx
export function accentForeground(accent: string): string {
  return isLightAccent(accent) ? '#000000' : '#ffffff';
}

export function isLightAccent(accent: string): boolean {
  const { r, g, b } = hexToRgb(accent);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150;
}
```

The threshold is 150 (not the classic 24ways 128) because the stock 128
misclassifies mid-tone WP8 accents — Cyan `#1BA1E2` (128.3), Green `#60A917`
(130.5), Orange `#FA6800` (135.8), Pink `#F47D02` (146.6) — as "light",
giving them black text. WP8 accent surfaces always used white text, so those
resolve to white, while the truly light colors (Lime `#A4CC00` 168.8, Amber
`#F0A30A` 168.6, Yellow `#D8C100` 177.9) keep black text for readability.

---

## 2. `packages/metro-react-ui/src/theme/tokens.css`

Defines all design tokens as CSS custom properties on `:root, .metro-ui`.

### Dark theme (default)
```css
:root, .metro-ui {
  --wp-accent: #1ba1e2;
  --wp-accent-light: #6ec8f0;
  --wp-accent-dark: #0e6e9c;
  --wp-accent-foreground: #ffffff;

  --wp-foreground: #ffffff;
  --wp-background: #000000;
  --wp-subtle: rgba(255, 255, 255, 0.6);
  --wp-chrome: #1f1f1f;
  --wp-chrome-low: #2b2b2b;
  --wp-disabled: rgba(255, 255, 255, 0.3);

  --wp-font-family: 'Segoe UI', 'Segoe WP', 'Helvetica Neue', Arial, sans-serif;
  /* ... font weights, sizes, spacing, motion ... */
}
```

### Light theme overrides (keyed off `data-theme`)
```css
:root[data-theme='light'],
.metro-ui[data-theme='light'] {
  --wp-foreground: #000000;
  --wp-background: #ffffff;
  --wp-subtle: rgba(0, 0, 0, 0.6);
  --wp-chrome: #e6e6e6;
  --wp-chrome-low: #d4d4d4;
  --wp-disabled: rgba(0, 0, 0, 0.3);
  --wp-accent-foreground: #000000;
}
```

---

## 3. `apps/showcase/src/theme/ThemeSettings.tsx`

Holds the user's chosen accent + mode and re-renders `ThemeProvider`.

### Stock WP8 accent palette
```tsx
export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: 'Lime',    value: '#A4CC00' },
  { name: 'Green',   value: '#60A917' },
  { name: 'Emerald', value: '#008A00' },
  { name: 'Teal',    value: '#00ABA9' },
  { name: 'Cyan',    value: '#1BA1E2' },
  { name: 'Cobalt',  value: '#0050EF' },
  { name: 'Indigo',  value: '#6A00FF' },
  { name: 'Violet',  value: '#AA00FF' },
  { name: 'Pink',    value: '#F47D02' },
  { name: 'Magenta', value: '#D80073' },
  { name: 'Crimson', value: '#A20025' },
  { name: 'Red',     value: '#E51400' },
  { name: 'Orange',  value: '#FA6800' },
  { name: 'Amber',   value: '#F0A30A' },
  { name: 'Yellow',  value: '#D8C100' },
  { name: 'Brown',   value: '#825A2C' },
  { name: 'Olive',   value: '#6D8764' },
  { name: 'Steel',   value: '#647687' },
  { name: 'Mauve',   value: '#76608A' },
  { name: 'Sienna',  value: '#7A3B3F' },
];
```

### Context shape
```tsx
export interface ThemeSettings {
  accent: string;
  mode: ThemeMode;
  setAccent: (accent: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}
```

### Provider
```tsx
export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState(DEFAULT_ACCENT); // Blue
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE); // 'dark'
  // value = { accent, mode, setAccent, setMode, toggleMode }
}
```

---

## 4. Wiring it together (`apps/showcase/src/main.tsx`)

```tsx
function ThemedApp() {
  const { accent, mode } = useThemeSettings();
  return (
    <ThemeProvider accent={accent} mode={mode}>
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeSettingsProvider>
      <ThemedApp />
    </ThemeSettingsProvider>
  </StrictMode>,
);
```

- `ThemeSettingsProvider` holds the state.
- `ThemedApp` reads it via `useThemeSettings()` and passes `accent` + `mode`
  into `ThemeProvider`.
- `ThemeProvider` re-applies the CSS variables → instant re-theme.

---

## 5. Usage in a consumer app

```tsx
import { ThemeProvider, useMetroTheme } from '@metro-react-ui/core';

// Wrap your app
<ThemeProvider accent="#e51400" mode="light">
  <App />
</ThemeProvider>

// Read the current theme anywhere
function SomeComponent() {
  const { accent, mode } = useMetroTheme();
  return <div style={{ color: accent }}>mode: {mode}</div>;
}
```

---

## 6. Build commands

```bash
# Rebuild the core library (required for showcase to pick up theme changes)
npm run build:lib

# Build the showcase
npm run build:showcase

# Run the dev server
npm run dev
```

> The library's `exports` point to `dist/`, so you MUST run `npm run build:lib`
> after editing `packages/metro-react-ui/src/**` for the showcase to reflect changes.
