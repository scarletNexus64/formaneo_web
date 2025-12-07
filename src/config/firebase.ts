import { initializeApp, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';

// Firebase configuration
// IMPORTANT: Remplacez ces valeurs par votre propre configuration Firebase
// Vous pouvez obtenir ces valeurs depuis Firebase Console > Paramètres du projet
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "VOTRE_API_KEY",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "VOTRE_AUTH_DOMAIN",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "VOTRE_PROJECT_ID",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "VOTRE_STORAGE_BUCKET",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "VOTRE_SENDER_ID",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "VOTRE_APP_ID"
};

// VAPID Key pour Web Push
// IMPORTANT: Remplacez par votre clé VAPID depuis Firebase Console > Cloud Messaging > Web Push certificates
const VAPID_KEY = process.env.REACT_APP_FIREBASE_VAPID_KEY || "VOTRE_VAPID_KEY";

// Initialize Firebase
let app: FirebaseApp;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);

  // Check if messaging is supported before initializing
  isSupported().then(supported => {
    if (supported) {
      messaging = getMessaging(app);
    } else {
      console.warn('Firebase Messaging is not supported in this browser');
    }
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // Check if messaging is supported
    const supported = await isSupported();
    if (!supported) {
      console.warn('Push notifications are not supported in this browser');
      return null;
    }

    // Check if messaging is initialized
    if (!messaging) {
      console.warn('Firebase Messaging is not initialized');
      return null;
    }

    // Check if service worker is supported
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Workers are not supported in this browser');
      return null;
    }

    // Request notification permission
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      console.log('Notification permission granted');

      // Get registration token
      const currentToken = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready
      });

      if (currentToken) {
        console.log('FCM Token:', currentToken);
        return currentToken;
      } else {
        console.log('No registration token available');
        return null;
      }
    } else if (permission === 'denied') {
      console.warn('Notification permission denied');
      return null;
    } else {
      console.log('Notification permission dismissed');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.warn('Messaging not initialized');
      return;
    }

    onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      resolve(payload);
    });
  });

export { messaging };
