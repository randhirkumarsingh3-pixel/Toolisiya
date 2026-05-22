const CACHE_NAME = 'toolisiya-pwa-v5';
const ASSET_CACHE_NAME = 'toolisiya-assets-v5';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== ASSET_CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper to determine if a request is for an HTML page/route
const isNavigationRequest = (request, url) => {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
};

// Helper to determine if a request is a static asset
const isAssetRequest = (request, url) => {
  return request.destination === 'style' || 
         request.destination === 'script' || 
         request.destination === 'image' || 
         request.destination === 'font' ||
         url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|woff2|ico)$/);
};

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Bypass Vite dev server internal assets, HMR WebSocket connections, and hot reloading pings
  if (url.pathname.includes('@vite') || 
      url.pathname.includes('__vite') || 
      url.searchParams.has('token') ||
      url.searchParams.has('t') ||
      e.request.url.includes('socket.io') ||
      e.request.url.includes('sockjs')) {
    return; // Let the browser handle natively
  }

  // Skip cross-origin requests unless they are fonts/cdn images
  if (url.origin !== location.origin && !url.hostname.includes('hostinger.com') && !url.hostname.includes('fonts.')) {
    return;
  }

  // API Calls: Network First, fallback to Cache (or Network Only if POST)
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/hcgi/api/')) {
    if (e.request.method !== 'GET') return; // Do not intercept non-GET API requests
    
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
          return response;
        })
        .catch(() => {
          return caches.match(e.request).then((cached) => {
            if (cached) return cached;
            return new Response(JSON.stringify({ error: 'Offline', message: 'Network request failed' }), {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Navigation / HTML requests: NETWORK FIRST to protect SEO and ensure AdSense script freshness
  if (isNavigationRequest(e.request, url)) {
    e.respondWith(
      fetch(e.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/index.html').then((indexResponse) => {
              if (indexResponse) return indexResponse;
              return new Response('Offline', {
                status: 503,
                statusText: 'Service Unavailable',
                headers: { 'Content-Type': 'text/html' }
              });
            });
          });
        })
    );
    return;
  }

  // Static Assets: CACHE FIRST for high performance
  if (isAssetRequest(e.request, url)) {
    e.respondWith(
      caches.match(e.request).then((cachedResponse) => {
        if (cachedResponse) {
          // Serve from cache, but update cache in the background (Stale-While-Revalidate pattern)
          fetch(e.request).then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(ASSET_CACHE_NAME).then(cache => cache.put(e.request, networkResponse.clone()));
            }
          }).catch(() => {});
          
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(e.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const responseToCache = networkResponse.clone();
          caches.open(ASSET_CACHE_NAME).then((cache) => cache.put(e.request, responseToCache));
          return networkResponse;
        }).catch(() => new Response('', { status: 408, statusText: 'Offline' }));
      })
    );
    return;
  }

  // Default Network First for anything else
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});