const CACHE_NAME = 'mystic-balls-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/index.css',
  // Add other static assets
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});