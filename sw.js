var CACHE_NAME = 'family-ledger-v3';
var urlsToCache = [
  './',
  './家庭记账本.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(
        names.filter(function(n) { return n !== CACHE_NAME; }).map(function(n) { return caches.delete(n); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) return response;
      return fetch(event.request).then(function(resp) {
        if (resp && resp.status === 200) {
          var clone = resp.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, clone); });
        }
        return resp;
      }).catch(function() {
        if (event.request.destination === 'document') {
          return caches.match('./家庭记账本.html');
        }
      });
    })
  );
});
