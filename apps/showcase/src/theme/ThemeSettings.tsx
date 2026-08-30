import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@metro-react-ui/core';

/**
 * The classic Windows 8 / Windows Phone 8 accent palette.
 * These are the 8 stock accent colors users could pick in the OS settings.
 */
export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: 'Blue', value: '#1ba1e2' },
  { name: 'Red', value: '#e51400' },
  { name: 'Lime', value: '#a4c400' },
  { name: 'Green', value: '#60a917' },
  { name: 'Orange', value: '#f0a30a' },
  { name: 'Brown', value: '#825a2c' },
  { name: 'Magenta', value: '#6a00ff' },
  { name: 'Pink', value: '#d80073' },
];

export const DEFAULT_ACCENT = ACCENT_COLORS[0].value; // Blue
export const DEFAULT_MODE: ThemeMode = 'dark';

export interface ThemeSettings {
  accent: string;
  mode: ThemeMode;
  setAccent: (accent: string) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeSettingsContext = createContext<ThemeSettings>({
  accent: DEFAULT_ACCENT,
  mode: DEFAULT_MODE,
  setAccent: () => {},
  setMode: () => {},
  toggleMode: () => {},
});

/**
 * Holds the user's theme preferences (accent color + light/dark mode).
 * Changes apply instantly because ThemeProvider re-themes via CSS variables.
 */
export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [mode, setMode] = useState<ThemeMode>(DEFAULT_MODE);

  const value = useMemo<ThemeSettings>(
    () => ({
      accent,
      mode,
      setAccent,
      setMode,
      toggleMode: () => setMode((m) => (m === 'dark' ? 'light' : 'dark')),
    }),
    [accent, mode],
  );

  return <ThemeSettingsContext.Provider value={value}>{children}</ThemeSettingsContext.Provider>;
}

/** Returns the current theme settings + setters from context. */
export function useThemeSettings(): ThemeSettings {
  return useContext(ThemeSettingsContext);
}