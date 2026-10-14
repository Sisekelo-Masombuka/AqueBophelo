import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import api from '../api/client';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'aquabophelo-notifications',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app = null;
let messaging = null;

try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-firebase-api-key-here') {
    app = initializeApp(firebaseConfig);
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      messaging = getMessaging(app);
    }
  }
} catch (err) {
  console.warn('Firebase Messaging initialization notice:', err);
}

export async function requestPushPermissionAndRegister() {
  if (!messaging) {
    console.warn('Firebase Messaging is not configured or supported in this browser environment.');
    return { success: false, reason: 'unconfigured' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      const token = await getToken(messaging, { vapidKey });

      if (token) {
        await api.post('/api/v1/devicetokens/register', { token, deviceType: 'Web' });
        console.log('Successfully registered FCM Web Push Device Token:', token.substring(0, 12) + '...');
        return { success: true, token };
      }
    }
    return { success: false, reason: permission };
  } catch (err) {
    console.error('Error requesting FCM push permission:', err);
    return { success: false, error: err };
  }
}

export function onForegroundPushMessage(callback) {
  if (!messaging) return () => {};
  return onMessage(messaging, (payload) => {
    console.log('[Foreground Push Received]:', payload);
    if (callback) callback(payload);
  });
}
