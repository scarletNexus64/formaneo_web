// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyA11yhQjEQ7s-knZHZPdty24q8yeY39efk",
  authDomain: "formaneo-66677.firebaseapp.com",
  projectId: "formaneo-66677",
  storageBucket: "formaneo-66677.firebasestorage.app",
  messagingSenderId: "498934458846",
  appId: "1:498934458846:web:feecd9405b9a079aa2154f"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);

  try {
    // Customize notification
    const notificationTitle = payload.notification?.title || payload.data?.title || 'Nouvelle notification';
    const notificationBody = payload.notification?.body || payload.data?.body || '';

    console.log('[firebase-messaging-sw.js] Preparing to show notification:', {
      title: notificationTitle,
      body: notificationBody
    });

    const notificationOptions = {
      body: notificationBody,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: payload.data?.notification_id || 'notification-' + Date.now(),
      data: payload.data || {},
      requireInteraction: false,
      vibrate: [200, 100, 200],
      timestamp: Date.now()
    };

    console.log('[firebase-messaging-sw.js] Notification options:', notificationOptions);

    // Show the notification
    return self.registration.showNotification(notificationTitle, notificationOptions)
      .then(() => {
        console.log('[firebase-messaging-sw.js] ✅ Notification displayed successfully!');
      })
      .catch((error) => {
        console.error('[firebase-messaging-sw.js] ❌ Error showing notification:', error);
      });
  } catch (error) {
    console.error('[firebase-messaging-sw.js] ❌ Error in onBackgroundMessage:', error);

    // Fallback: show a simple notification
    return self.registration.showNotification('Nouvelle notification', {
      body: 'Vous avez reçu une nouvelle notification',
      icon: '/logo192.png'
    });
  }
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          const urlToOpen = event.notification.data?.url || '/notifications';
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
