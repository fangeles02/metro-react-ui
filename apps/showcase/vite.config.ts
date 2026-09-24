import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Read the core package version at config-load time (avoids a JSON import
// attribute, which Vite 6's config loader doesn't support for package.json).
const corePkg = JSON.parse(
  readFileSync(resolve(__dirname, '../../packages/metro-react-ui/package.json'), 'utf-8'),
);

export default defineConfig({
  plugins: [react()],
  // Injected at build/dev-server start so the labels are always current.
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __PACKAGE_VERSION__: JSON.stringify(corePkg.version),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },
  server: {
    port: 5173,
  },
});
