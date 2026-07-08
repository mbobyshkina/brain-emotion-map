/* НейроЗеркало — сервис-воркер: офлайн-кэш + свежие обновления.
   Стратегия «сеть, потом кэш»: онлайн всегда берём свежую версию
   (и обновляем кэш), офлайн — отдаём из кэша. */
const CACHE = 'neuromirror-v4';
const ASSETS = [
  './', './index.html', './styles.css',
  './data.js', './content.js', './explore-data.js', './updates.js',
  './brain3d.js', './charts.js', './explore.js', './app.js',
  './lib/three.min.js', './lib/OrbitControls.js',
  './manifest.webmanifest', './icons/icon.svg',
  './icons/icon-192.png', './icons/icon-512.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(ASSETS.map(a => c.add(a)))));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // внешние ссылки/ленты — не трогаем
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then(hit => hit || caches.match('./index.html')))
  );
});
