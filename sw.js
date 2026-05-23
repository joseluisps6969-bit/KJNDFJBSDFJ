const CACHE_NAME = 'nom-simulador-v6'; // v6 fuerza la invalidación de memorias viejas
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y guardar archivos limpios en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }).then(() => self.skipWaiting()) // Fuerza su activación saltándose la espera
  );
});

// Activar y destruir cualquier rastro de cachés previos (v1, v2, v5, etc.)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); 
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Servir la app desde el caché dinámico
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
