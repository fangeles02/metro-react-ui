import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { ThemeMode } from '@metro-react-ui/core';
import { readStoredTheme, writeStoredTheme } from '../mpa/theme';

/**
 * The classic Windows 8 / Windows Phone 8 accent palette.
 * These are the 8 stock accent colors users could pick in the OS settings.
 */
export const ACCENT_COLORS: { name: string; value: string }[] = [
  { name: 'Blue', value: '#00a6fa' },
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