import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [
    react(),
    dts({ include: ['src'], bundleTypes: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MetroUI',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'index.js' : 'index.cjs'),
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: (assetInfo) =>
          // The bundled CSS is emitted as a single asset; always name it
          // `metro-ui.css` so the package's `./styles.css` export resolves.
          assetInfo.name?.endsWith('.css') ? 'metro-ui.css' : assetInfo.name!,
      },
    },
    sourcemap: true,
  },
});
