import type { ThemeMode } from '@metro-react-ui/core';

/**
 * Shared localStorage key used by BOTH the showcase SPA and the standalone
 * MPA pages so the accent color + light/dark mode stay in sync across
 * documents. The showcase writes these on change; the MPA pages read them on
 * mount (and fall back to the WP defaults if nothing is stored yet).
 */
const STORAGE_KEY = 'metro-ui-theme';

export interface StoredTheme {
  accent: string;
  mode: ThemeMode;
}

/** Read the persisted theme, or null if nothing is stored / unavailable. */
export function readStoredTheme(): StoredTheme | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredTheme>;
    if (typeof parsed.accent !== 'string' || (parsed.mode !== 'light' && parsed.mode !== 'dark')) {
      return null;
    }
    return { accent: parsed.accent, mode: parsed.mode };
  } catch {
    return null;
  }
}

/** Persist the theme so other documents (and future visits) pick it up. */
export function writeStoredTheme(theme: StoredTheme): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    // Ignore storage failures (private mode, quota, etc.).
  }
}