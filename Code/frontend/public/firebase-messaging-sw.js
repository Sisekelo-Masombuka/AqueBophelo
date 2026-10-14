importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase in Background Service Worker
firebase.initializeApp({
  apiKey: "AIzaSyDummyKeyForServiceWorkerInit",
  projectId: "aquabophelo-notifications",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background Push Message received:', payload);

  const title = payload.notification?.title || '💧 AquaBophelo Municipal Alert';
  const options = {
    body: payload.notification?.body || 'New water system notification',
    icon: '/AquaBophelo_logo.svg',
    badge: '/AquaBophelo_logo.svg',
    data: payload.data || {},
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/dashboard');
      }
    })
  );
});
