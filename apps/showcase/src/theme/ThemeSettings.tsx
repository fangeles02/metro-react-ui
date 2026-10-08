import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@metro-react-ui/core';
import { readStoredTheme, writeStoredTheme } from '../mpa/theme';

/**
 * The full Windows Phone 8 accent palette — all 20 stock accent colors users
 * could pick in the OS settings.
 */
export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: 'Lime', value: '#A4CC00' },
  { name: 'Green', value: '#60A917' },
  { name: 'Emerald', value: '#008A00' },
  { name: 'Teal', value: '#00ABA9' },
  { name: 'Cyan', value: '#1BA1E2' },
  { name: 'Cobalt', value: '#0050EF' },
  { name: 'Indigo', value: '#6A00FF' },
  { name: 'Violet', value: '#AA00FF' },
  { name: 'Pink', value: '#F47D02' },
  { name: 'Magenta', value: '#D80073' },
  { name: 'Crimson', value: '#A20025' },
  { name: 'Red', value: '#E51400' },
  { name: 'Orange', value: '#FA6800' },
  { name: 'Amber', value: '#F0A30A' },
  { name: 'Yellow', value: '#D8C100' },
  { name: 'Brown', value: '#825A2C' },
  { name: 'Olive', value: '#6D8764' },
  { name: 'Steel', value: '#647687' },
  { name: 'Mauve', value: '#76608A' },
  { name: 'Sienna', value: '#7A3B3F' },
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
 * Preferences are persisted to localStorage (shared with the MPA pages) so
 * the theme carries across documents and visits.
 */
export function ThemeSettingsProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if present, else the WP defaults.
  const [accent, setAccent] = useState(() => readStoredTheme()?.accent ?? DEFAULT_ACCENT);
  const [mode, setMode] = useState<ThemeMode>(() => readStoredTheme()?.mode ?? DEFAULT_MODE);

  const value = useMemo<ThemeSettings>(
    () => ({
      accent,
      mode,
      setAccent: (next) => {
        setAccent(next);
        writeStoredTheme({ accent: next, mode });
      },
      setMode: (next) => {
        setMode(next);
        writeStoredTheme({ accent, mode: next });
      },
      toggleMode: () => {
        const next = mode === 'dark' ? 'light' : 'dark';
        setMode(next);
        writeStoredTheme({ accent, mode: next });
      },
    }),
    [accent, mode],
  );

  return <ThemeSettingsContext.Provider value={value}>{children}</ThemeSettingsContext.Provider>;
}

/** Returns the current theme settings + setters from context. */
export function useThemeSettings(): ThemeSettings {
  return useContext(ThemeSettingsContext);
}