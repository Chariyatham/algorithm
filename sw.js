/* Service Worker — Algorithm Academy
   Strategy: cache-first for app shell, stale-while-revalidate for jsx/css */

const VERSION = 'v2-2026-05-fonts';
const SHELL = 'algoacademy-shell-' + VERSION;
const RUNTIME = 'algoacademy-runtime-' + VERSION;

const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './manifest.webmanifest',
  './curriculum.js',
  './algorithms.js',
  './player.jsx',
  './ds-viz.jsx',
  './lesson-components.jsx',
  './code-playground.jsx',
  './app.jsx',
];
for (let i = 1; i <= 31; i++) PRECACHE.push(`./lessons-part${i}.jsx`);

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(PRECACHE).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== SHELL && k !== RUNTIME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    // CDN: stale-while-revalidate
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const cached = await cache.match(req);
        const network = fetch(req).then(res => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
    return;
  }
  // same-origin: cache-first
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && (req.url.endsWith('.jsx') || req.url.endsWith('.js') || req.url.endsWith('.css'))) {
          const copy = res.clone();
          caches.open(RUNTIME).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
