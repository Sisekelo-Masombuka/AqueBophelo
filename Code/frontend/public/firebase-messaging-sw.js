importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase in Background Service Worker
// In production, parameters can be passed via registration URL or environment config
const swUrl = new URL(self.location.href);
const firebaseApiKey = swUrl.searchParams.get('apiKey') || "FIREBASE_WEB_CLIENT_KEY";
const firebaseProjectId = swUrl.searchParams.get('projectId') || "aquabophelo-notifications";
const firebaseSenderId = swUrl.searchParams.get('senderId') || "1234567890";
const firebaseAppId = swUrl.searchParams.get('appId') || "1:1234567890:web:1234567890";

firebase.initializeApp({
  apiKey: firebaseApiKey,
  projectId: firebaseProjectId,
  messagingSenderId: firebaseSenderId,
  appId: firebaseAppId
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
