import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import './tokens.css';

/** Default accent color (WP blue). */
export const DEFAULT_ACCENT = '#1ba1e2';

export type ThemeMode = 'light' | 'dark';

export interface MetroTheme {
  /** Accent color used for highlights, toggles, selection. */
  accent: string;
  /** Light/dark mode. */
  mode: ThemeMode;
}

/**
 * Returns a high-contrast foreground color for text/icons rendered on top of
 * an accent-colored surface. Light accents resolve to `#000000`, dark accents
 * to `#ffffff`.
 *
 * Uses the same YIQ perceived-brightness heuristic that editor color pickers
 * (e.g. VS Code's `isDarker`/`isLighter`) use to choose black/white text.
 */
export function accentForeground(accent: string): string {
  return isLightAccent(accent) ? '#000000' : '#ffffff';
}

/** Whether `accent` is a light color (should use dark text on top of it). */
export function isLightAccent(accent: string): boolean {
  const { r, g, b } = hexToRgb(accent);
  // 24ways perceived-brightness — same heuristic VS Code's color picker uses.
  // http://24ways.org/2010/calculating-color-contrast
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

export interface ThemeProviderProps {
  children: ReactNode;
  /** Accent color (hex, e.g. `#1ba1e2`). Defaults to the WP blue `#1ba1e2`. */
  accent?: string;
  /** Light or dark mode. Defaults to `dark` (WP default). */
  mode?: ThemeMode;
  /**
   * Where to apply the theme variables. Defaults to `document.documentElement`
   * (`:root`). Set to a container element to scope the theme to a subtree.
   */
  scope?: HTMLElement;
}

const ThemeContext = createContext<MetroTheme>({ accent: DEFAULT_ACCENT, mode: 'dark' });

/**
 * Applies Metro design tokens as CSS custom properties at runtime and
 * provides the current theme via context. Changing `accent` or `mode`
 * re-themes the app without a rebuild.
 */
export function ThemeProvider({ children, accent, mode = 'dark', scope }: ThemeProviderProps) {
  const root = scope ?? (typeof document !== 'undefined' ? document.documentElement : null);
  const resolvedAccent = accent ?? DEFAULT_ACCENT;

  useEffect(() => {
    if (!root) return;
    root.style.setProperty('--wp-accent', resolvedAccent);
    root.style.setProperty('--wp-accent-light', accent ? shade(resolvedAccent, 0.35) : '#6ec8f0');
    root.style.setProperty('--wp-accent-dark', accent ? shade(resolvedAccent, -0.45) : '#0e6e9c');
    root.style.setProperty('--wp-accent-foreground', accent ? accentForeground(resolvedAccent) : '#ffffff');
    root.setAttribute('data-theme', mode);
  }, [accent, mode, root, resolvedAccent]);

  const value = useMemo<MetroTheme>(
    () => ({ accent: resolvedAccent, mode }),
    [resolvedAccent, mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/** Returns the current theme from context. */
export function useMetroTheme(): MetroTheme {
  return useContext(ThemeContext);
}

/** Lighten (positive) or darken (negative) a hex color by a fraction. */
function shade(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent);
  const nr = Math.round((t - r) * p + r);
  const ng = Math.round((t - g) * p + g);
  const nb = Math.round((t - b) * p + b);
  return `rgb(${nr}, ${ng}, ${nb})`;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(h, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}
