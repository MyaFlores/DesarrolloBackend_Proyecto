// sw.js
const CACHE_VERSION = 'v1.0.3';
const CACHE_NAME = `miapp-cache-${CACHE_VERSION}`;

const PRECACHE_URLS = [
  '/', // start page
  '/index.html',
  '/offline.html',
  '/styles.css',
  '/app.js',
  '/assets/icons/icon-192x192.png'
];

// Install: precache core assets
self.addEventListener('install', event => {
  self.skipWaiting(); // opcional: activa este SW inmediatamente (útil durante desarrollo)
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(err => console.error('Precache falló:', err))
  );
});

// Activate: limpiar caches antiguos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Helper: stale-while-revalidate implementation
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  const networkPromise = fetch(request).then(networkResponse => {
    if (networkResponse && networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  // Return cached if available immediately, otherwise wait network
  return cachedResponse || networkPromise;
}

// Fetch: estrategia mixta
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Bypass cross-origin requests you don't control if necessary
  if (url.origin !== location.origin) {
    // Opcional: network-first para APIs externas, o fallback a cache if needed
    return; // dejar que el navegador haga la petición normalmente
  }

  // Para navegación de la página principal, usa stale-while-revalidateS
  if (req.mode === 'navigate') {
    event.respondWith(
      staleWhileRevalidate(req).then(resp => resp || caches.match('/offline.html'))
    );
    return;
  }

  // Para recursos estáticos (css, js, images) cache-first
  if (req.destination === 'style' || req.destination === 'script' || req.destination === 'image') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(networkResp => {
        // Guardar en cache si la respuesta es válida
        if (networkResp && networkResp.ok) {
          caches.open(CACHE_NAME).then(cache => cache.put(req, networkResp.clone()));
        }
        return networkResp;
      }).catch(() => {
        // Si no hay cached y fetch falla, intentar recurso alternative
        if (req.destination === 'image') return caches.match('/assets/icons/icon-192x192.png');
        return caches.match('/offline.html');
      }))
    );
    return;
  }

  // Default: network first with cache fallback
  event.respondWith(
    fetch(req).then(r => r).catch(() => caches.match(req))
  );
});
