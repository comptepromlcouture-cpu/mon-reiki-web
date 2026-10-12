const CACHE_VERSION = 'mon-reiki-v9';
const CORE_CACHE = `${CACHE_VERSION}-core`;
const MEDIA_CACHE = `${CACHE_VERSION}-media`;
const CORE = [
  './', './index.html', './styles.css', './theme-light.css', './theme-watercolor.css', './experience.css', './harmony.css', './app.js', './manifest.webmanifest',
  './assets/fonts/KaushanScript-Regular.ttf', './assets/icons/icon.svg', './assets/icons/icon-180.png', './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/icon-maskable-512.png',
  './assets/visuals/meditation-layer-v3.png', './assets/visuals/chakra-body-v4.png', './assets/practice/positions-watercolor.png',
  './assets/chakras/01-racine.webp', './assets/chakras/02-sacre.webp', './assets/chakras/03-plexus.webp', './assets/chakras/04-coeur.webp', './assets/chakras/05-gorge.webp', './assets/chakras/06-troisieme-oeil.webp', './assets/chakras/07-coronal.webp'
];
self.addEventListener('install', event => event.waitUntil(caches.open(CORE_CACHE).then(cache => cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>!key.startsWith(CACHE_VERSION)).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  const url = new URL(event.request.url);
  if (url.pathname.includes('/assets/audio/')) {
    event.respondWith(caches.open(MEDIA_CACHE).then(async cache => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      const response = await fetch(event.request);
      if (response.ok && !event.request.headers.has('range')) cache.put(event.request, response.clone());
      return response;
    }));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response.ok) caches.open(CORE_CACHE).then(cache=>cache.put(event.request,response.clone()));
    return response;
  }).catch(()=>caches.match('./index.html'))));
});
