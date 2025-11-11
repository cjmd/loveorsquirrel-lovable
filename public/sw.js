// Minimal service worker to avoid 404s and enable optional PWA behavior
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  self.clients.claim();
});
