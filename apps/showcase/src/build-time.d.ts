/**
 * Build timestamp injected by Vite's `define` option (see vite.config.ts).
 * Replaced at build/dev-server start with the current ISO-8601 timestamp.
 */
declare const __BUILD_TIME__: string;

/**
 * Version of the @metro-react-ui/core package, injected by Vite's `define`
 * option (see vite.config.ts). Read from the package's package.json.
 */
declare const __PACKAGE_VERSION__: string;

/**
 * Whether the app is running a production build, injected by Vite's `define`
 * option (see vite.config.ts). Used to gate the PWA service worker.
 */
declare const __PROD__: boolean;