import { ToggleSwitch } from '@metro-react-ui/core';
import { ACCENT_COLORS, useThemeSettings } from '../theme/ThemeSettings';

/**
 * Settings page — lets the user switch between light/dark mode and pick a
 * Windows 8 accent color. Changes apply instantly via ThemeProvider.
 */
export function SettingsPage() {
  const { accent, mode, setAccent, setMode } = useThemeSettings();

  return (
    <div className="showcase__demo">
      <span className="showcase__demo-label">Appearance</span>

      {/* Light / dark mode */}
      <div className="showcase__settings-row">
        <ToggleSwitch
          header="Dark mode"
          checked={mode === 'dark'}
          onChange={(checked) => setMode(checked ? 'dark' : 'light')}
        />
      </div>

      {/* Windows 8 accent palette */}
      <span className="showcase__demo-label">Accent color</span>
      <div className="showcase__accent-row">
        {ACCENT_COLORS.map((c) => {
          const selected = c.value.toLowerCase() === accent.toLowerCase();
          return (
            <button
              key={c.value}
              type="button"
              className={`showcase__accent-swatch${selected ? ' showcase__accent-swatch--selected' : ''}`}
              style={{ background: c.value }}
              aria-label={c.name}
              title={c.name}
              onClick={() => setAccent(c.value)}
            />
          );
        })}
      </div>
      <span className="showcase__demo-hint">
        Current accent: {accent} ({ACCENT_COLORS.find((c) => c.value.toLowerCase() === accent.toLowerCase())?.name ?? 'custom'})
      </span>
    </div>
  );
}