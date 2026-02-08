const CACHE_NAME = 'einvoice-converter-v1';
const LICENSE_DB_NAME = 'EInvoiceLicenseDB';
const LICENSE_STORE_NAME = 'licenses';

const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/vendors~main.chunk.js',
  '/manifest.json'
];

async function checkLicenseInIndexedDB() {
  return new Promise((resolve) => {
    const request = indexedDB.open(LICENSE_DB_NAME, 1);
    
    request.onerror = () => resolve(false);
    
    request.onsuccess = () => {
      const db = request.result;
      
      if (!db.objectStoreNames.contains(LICENSE_STORE_NAME)) {
        resolve(false);
        return;
      }
      
      const transaction = db.transaction([LICENSE_STORE_NAME], 'readonly');
      const store = transaction.objectStore(LICENSE_STORE_NAME);
      const getRequest = store.get('current_license');
      
      getRequest.onsuccess = () => {
        resolve(!!getRequest.result);
      };
      
      getRequest.onerror = () => resolve(false);
    };
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request).then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
