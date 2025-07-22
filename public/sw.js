const CACHE_NAME = 'trustchain-v1.0.0';
const STATIC_CACHE = 'trustchain-static-v1.0.0';
const DYNAMIC_CACHE = 'trustchain-dynamic-v1.0.0';

const STATIC_FILES = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_FILES);
      }),
      // Skip waiting to activate immediately
      self.skipWaiting()
    ])
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ])
  );
});

// Fetch event with sophisticated caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API calls with network-first strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets with cache-first strategy
  if (request.destination === 'image' || 
      request.destination === 'font' || 
      request.destination === 'style' || 
      request.destination === 'script') {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle navigation requests with stale-while-revalidate
  if (request.mode === 'navigate') {
    event.respondWith(staleWhileRevalidateStrategy(request));
    return;
  }

  // Default: network first
  event.respondWith(networkFirstStrategy(request));
});

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    // Fall back to cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return cache.match('/offline.html');
    }
    
    // Return basic offline response
    return new Response('Offline - Network Error', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    });
  }
}

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    // Fetch and cache if not found
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch static asset:', error);
    // Return placeholder or error response
    return new Response('Asset not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  // Get from cache immediately
  const cachedResponse = cache.match(request);
  
  // Fetch in background to update cache
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  // Return cache if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'credential-sync') {
    event.waitUntil(syncCredentials());
  } else if (event.tag === 'verification-sync') {
    event.waitUntil(syncVerifications());
  }
});

async function syncCredentials() {
  try {
    // Get pending credentials from IndexedDB
    const pendingCredentials = await getPendingCredentials();
    
    for (const credential of pendingCredentials) {
      try {
        await fetch('/api/credentials', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credential)
        });
        
        // Remove from pending list
        await removePendingCredential(credential.id);
        
        // Notify user of successful sync
        await self.registration.showNotification('Credential Synced', {
          body: `${credential.title} has been synchronized`,
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'credential-sync'
        });
      } catch (error) {
        console.log('[SW] Failed to sync credential:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Sync credentials failed:', error);
  }
}

async function syncVerifications() {
  try {
    const pendingVerifications = await getPendingVerifications();
    
    for (const verification of pendingVerifications) {
      try {
        await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(verification)
        });
        
        await removePendingVerification(verification.id);
        
        await self.registration.showNotification('Verification Complete', {
          body: 'Credential verification completed',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          tag: 'verification-sync'
        });
      } catch (error) {
        console.log('[SW] Failed to sync verification:', error);
      }
    }
  } catch (error) {
    console.log('[SW] Sync verifications failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  const options = {
    body: event.data?.text() || 'New notification from TrustChain',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: event.data?.json() || {},
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/action-open.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ],
    requireInteraction: true,
    renotify: true,
    tag: 'trustchain-notification'
  };
  
  event.waitUntil(
    self.registration.showNotification('TrustChain', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event);
  
  event.notification.close();
  
  const action = event.action;
  
  if (action === 'open' || !action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// IndexedDB helpers (simplified versions)
async function getPendingCredentials() {
  // Implementation for getting pending credentials from IndexedDB
  return [];
}

async function removePendingCredential(id) {
  // Implementation for removing pending credential from IndexedDB
}

async function getPendingVerifications() {
  // Implementation for getting pending verifications from IndexedDB
  return [];
}

async function removePendingVerification(id) {
  // Implementation for removing pending verification from IndexedDB
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
