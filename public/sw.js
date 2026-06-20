const CACHE_VERSION = 'arcade-v1';
const APP_CACHE = `${CACHE_VERSION}-app`;

const CORE_ASSETS = [
  '/',
  '/site.webmanifest',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/fonts/press_start_2p.woff2',
  '/tetris_music.mp3',
  '/snake_music.mp3',
  '/doodlejump_music.mp3',
  '/digger_music.mp3',
  '/xonix_music.mp3',
];

async function cacheAppShell() {
  const cache = await caches.open(APP_CACHE);
  await cache.addAll(CORE_ASSETS);

  // Next.js gives its generated bundles hashed names. Discover them from the
  // rendered page so a new deployment can be cached without hardcoded paths.
  const page = await cache.match('/');
  if (!page) return;

  const html = await page.text();
  const assetPaths = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin)
    .map((url) => url.href);

  await Promise.allSettled(assetPaths.map((asset) => cache.add(asset)));
}

self.addEventListener('install', (event) => {
  event.waitUntil(cacheAppShell().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== APP_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(APP_CACHE);
            await cache.put('/', response.clone());
          }
          return response;
        })
        .catch(() => caches.match('/')),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then(async (response) => {
        if (response.ok) {
          const cache = await caches.open(APP_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      });
    }),
  );
});
