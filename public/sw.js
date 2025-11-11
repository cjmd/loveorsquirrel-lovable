// Minimal service worker to avoid 404s and enable optional PWA behavior
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});

// No caching logic by default; acts as a placeholder
self.addEventListener('fetch', () => {
  // Intentionally left blank
});
