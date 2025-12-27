// Firebase Cloud Messaging Service Worker
// This file must be placed in the public folder and served from root

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU",
  authDomain: "alumni-connect-84d49.firebaseapp.com",
  projectId: "alumni-connect-84d49",
  storageBucket: "alumni-connect-84d49.firebasestorage.app",
  messagingSenderId: "697354232724",
  appId: "1:697354232724:web:88f010a874a283f36ba581",
  measurementId: "G-XNQPN39KKF"
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'Alumni Connect';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: payload.notification?.icon || '/logo.png',
    badge: '/badge.png',
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  // Get the URL to open from notification data
  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
