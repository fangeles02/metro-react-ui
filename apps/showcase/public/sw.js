/* Metro UI Showcase — service worker.
 *
 * Minimal PWA service worker: precaches the app shell and serves it from cache
 * when offline. The showcase is a static demo, so a simple strategy is
 * appropriate — no external PWA plugin required.
 *
 * Strategy:
 * - HTML / navigation requests: NETWORK-FIRST, falling back to cache. This
 *   ensures returning visitors always get the latest app shell (and the latest
 *   hashed JS/CSS bundle references) when online, while still working offline.
 * - Static assets (hashed JS/CSS, images, etc.): CACHE-FIRST, since their
 *   filenames are content-hashed and immutable.
 *
 * Bump CACHE_VERSION whenever you change the app so clients re-fetch assets.
 */
const CACHE_VERSION = 'v3';
const CACHE_NAME = `metro-ui-showcase-${CACHE_VERSION}`;

// The app shell + core assets to precache on install.
const PRECACHE = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  // Standalone MPA messaging pages (threads -> conversation).
  '/mpa/threads.html',
  '/mpa/conversation.html',
];

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

  // Navigation / HTML requests: network-first so the latest app shell is
  // always fetched when online, with a cache fallback for offline use.
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the fresh HTML for offline use.
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(event.request).then((cached) => cached || caches.match('/index.html')),
        ),
    );
    return;
  }

  // Static assets (hashed JS/CSS, images, etc.): cache-first.
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