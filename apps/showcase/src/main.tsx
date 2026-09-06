import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@metro-react-ui/core';
import '@metro-react-ui/core/styles.css';
import App from './App';
import { ThemeSettingsProvider, useThemeSettings } from './theme/ThemeSettings';
import './index.css';

/** Bridges the user's settings into the ThemeProvider so changes apply instantly. */
function ThemedApp() {
  const { accent, mode } = useThemeSettings();
  return (
    <ThemeProvider accent={accent} mode={mode}>
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <ThemeSettingsProvider>
    <ThemedApp />
  </ThemeSettingsProvider>,
);
