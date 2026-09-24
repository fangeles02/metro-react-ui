/* Metro UI Showcase — service worker.
 *
 * Minimal PWA service worker: precaches the app shell and serves it from cache
 * when offline. The showcase is a static demo, so a simple cache-first strategy
 * is appropriate — no external PWA plugin required.
 *
 * Bump CACHE_VERSION whenever you change the app so clients re-fetch assets.
 */
const CACHE_VERSION = 'v1';
const CACHE_NAME = `metro-ui-showcase-${CACHE_VERSION}`;

// The app shell + core assets to precache on install.
const PRECACHE = ['/', '/index.html', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        PRECACHE.map((url) =>
          fetch(url).then((response) => {
            if (response.ok) cache.put(url, response);
          }),
        ),
      );
    }),
  );
  self.skipWaiting = true;
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const stale = keys.filter((key) => key !== CACHE_NAME);
      return Promise.all(stale.map((key) => caches.delete(key)));
    }),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle same-origin GET requests.
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      // Cache successful same-origin responses (skip non-ok and opaque).
      if (response.ok && response.type === 'basic') {
        cache.put(event.request, response.clone());
      }
      return response;
    }),
  );
});