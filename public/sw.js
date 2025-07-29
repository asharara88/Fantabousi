// Biowell AI Service Worker
// Version 1.0.0

const CACHE_NAME = 'biowell-ai-v1.0.0';
const OFFLINE_CACHE = 'biowell-offline-v1.0.0';

// Assets to cache for offline functionality
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  // Add other critical assets
];

// Health data that should be cached for offline access
const HEALTH_ROUTES = [
  '/dashboard',
  '/coach',
  '/nutrition',
  '/fitness',
  '/profile'
];

// API endpoints that can work offline with cached data
const CACHEABLE_APIS = [
  '/api/health-metrics',
  '/api/user-profile',
  '/api/nutrition-summary'
];

// Install Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache core assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Caching core assets');
        return cache.addAll(CORE_ASSETS);
      }),
      
      // Cache offline page
      caches.open(OFFLINE_CACHE).then((cache) => {
        return cache.add('/offline.html');
      })
    ]).then(() => {
      console.log('Service Worker installed successfully');
      // Force activation of new service worker
      self.skipWaiting();
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Take control of all pages
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activated successfully');
    })
  );
});

// Fetch Strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;
  
  // Only handle GET requests
  if (method !== 'GET') {
    return;
  }
  
  // Handle different types of requests
  if (url.includes('/api/')) {
    // API requests - Network first with cache fallback
    event.respondWith(handleApiRequest(request));
  } else if (HEALTH_ROUTES.some(route => url.includes(route))) {
    // Health app routes - Cache first with network update
    event.respondWith(handleAppRoutes(request));
  } else if (url.includes('.png') || url.includes('.jpg') || url.includes('.svg') || url.includes('.ico')) {
    // Images - Cache first
    event.respondWith(handleImageRequest(request));
  } else {
    // Default strategy - Network first with cache fallback
    event.respondWith(handleDefaultRequest(request));
  }
});

// API Request Handler - Network first, cache as backup
async function handleApiRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // If network fails, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('Serving API from cache:', request.url);
      return cachedResponse;
    }
    
    // Return offline response for health data
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'Health data unavailable offline',
        cached: false
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    // Network error, try cache
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      console.log('Serving API from cache (network error):', request.url);
      return cachedResponse;
    }
    
    // Return offline response
    return new Response(
      JSON.stringify({
        error: 'Network Error',
        message: 'Unable to fetch health data',
        cached: false
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// App Routes Handler - Cache first with network update
async function handleAppRoutes(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('Serving app route from cache:', request.url);
    
    // Update cache in background
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }
  
  // If not in cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network error for app route:', request.url);
  }
  
  // Return offline page for app routes
  const offlineCache = await caches.open(OFFLINE_CACHE);
  const offlineResponse = await offlineCache.match('/offline.html');
  return offlineResponse || new Response('Offline', { status: 503 });
}

// Image Request Handler - Cache first
async function handleImageRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try cache first
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Try network and cache
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Failed to fetch image:', request.url);
  }
  
  // Return placeholder image for failed requests
  return new Response(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" fill="#9ca3af" font-family="sans-serif" font-size="14">Image Offline</text></svg>',
    {
      headers: { 'Content-Type': 'image/svg+xml' }
    }
  );
}

// Default Request Handler - Network first with cache fallback
async function handleDefaultRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch (error) {
    console.log('Network error:', request.url);
  }
  
  // Try cache
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    console.log('Serving from cache:', request.url);
    return cachedResponse;
  }
  
  // For navigation requests, return offline page
  if (request.destination === 'document') {
    const offlineCache = await caches.open(OFFLINE_CACHE);
    const offlineResponse = await offlineCache.match('/offline.html');
    return offlineResponse || new Response('Offline', { status: 503 });
  }
  
  // For other requests, return error
  return new Response('Resource unavailable offline', { status: 503 });
}

// Background Sync for Health Data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'health-data-sync') {
    event.waitUntil(syncHealthData());
  } else if (event.tag === 'chat-sync') {
    event.waitUntil(syncChatMessages());
  }
});

// Sync Health Data
async function syncHealthData() {
  try {
    // Get pending health data from IndexedDB
    const pendingData = await getPendingHealthData();
    
    if (pendingData.length > 0) {
      console.log('Syncing health data:', pendingData.length, 'items');
      
      for (const data of pendingData) {
        try {
          const response = await fetch('/api/health-metrics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            await removePendingHealthData(data.id);
            console.log('Synced health data item:', data.id);
          }
        } catch (error) {
          console.log('Failed to sync health data item:', data.id, error);
        }
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

// Sync Chat Messages
async function syncChatMessages() {
  try {
    // Implementation for syncing offline chat messages
    console.log('Syncing chat messages...');
    // Add your chat sync logic here
  } catch (error) {
    console.log('Chat sync failed:', error);
  }
}

// Push Notification Handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    title: 'Biowell AI',
    body: 'You have a new health insight!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'health-notification',
    data: {
      url: '/dashboard'
    },
    actions: [
      {
        action: 'view',
        title: 'View Dashboard',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  if (event.data) {
    try {
      const data = event.data.json();
      options.title = data.title || options.title;
      options.body = data.body || options.body;
      options.data = { ...options.data, ...data };
    } catch (error) {
      console.log('Error parsing push data:', error);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification Click Handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' || !action) {
    // Open the app to the relevant page
    const urlToOpen = data.url || '/dashboard';
    
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clientList) => {
          // Check if app is already open
          for (const client of clientList) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  }
  // 'dismiss' action just closes the notification (already done above)
});

// Utility functions for IndexedDB operations
async function getPendingHealthData() {
  // Implement IndexedDB read operation
  // Return array of pending health data
  return [];
}

async function removePendingHealthData(id) {
  // Implement IndexedDB delete operation
  // Remove synced health data item
}

// Share Target Handling
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (url.pathname === '/share-health-data' && event.request.method === 'POST') {
    event.respondWith(handleShareTarget(event.request));
  }
});

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const sharedData = {
      title: formData.get('title'),
      text: formData.get('text'),
      url: formData.get('url'),
      files: formData.getAll('health_data')
    };
    
    console.log('Shared data received:', sharedData);
    
    // Process shared health data
    // Store in IndexedDB for later processing
    
    // Redirect to import page
    return Response.redirect('/import-health-data?shared=true', 303);
  } catch (error) {
    console.log('Error handling share target:', error);
    return new Response('Error processing shared data', { status: 500 });
  }
}

console.log('Biowell AI Service Worker loaded');
