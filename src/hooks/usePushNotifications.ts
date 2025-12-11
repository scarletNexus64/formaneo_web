import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { onMessageListener } from '../config/firebase';
import toast from 'react-hot-toast';
import { isPushNotificationSupported } from '../utils/deviceDetection';

/**
 * Hook to manage push notifications
 * - Automatically requests permission and registers token when user is logged in
 * - Listens for foreground messages
 * - Provides methods to enable/disable push notifications
 */
export const usePushNotifications = (isAuthenticated: boolean) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if push notifications are already enabled
  useEffect(() => {
    const enabled = notificationService.isPushNotificationsEnabled();
    setIsEnabled(enabled);
  }, []);

  // Auto-register FCM token when user is authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Don't attempt auto-register on unsupported devices (iOS/Safari)
    if (!isPushNotificationSupported()) {
      console.log('❌ Push notifications not supported on this device, skipping auto-register');
      return;
    }

    const autoRegisterFCM = async () => {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.log('Notifications not supported in this browser');
        return;
      }

      const permission = Notification.permission;
      const hasToken = !!localStorage.getItem('fcm_token');

      console.log('🔔 Auto-register FCM check:', { permission, hasToken, isAuthenticated });

      // Case 1: Permission already granted - ALWAYS regenerate token for this session
      if (permission === 'granted') {
        console.log('✅ Permission granted, registering/updating FCM token for this user...');
        try {
          // Clear old token to force regeneration
          localStorage.removeItem('fcm_token');
          await setupPushNotifications();
          console.log('✅ FCM token registered/updated successfully for current user');
        } catch (error) {
          console.error('❌ Failed to register FCM token:', error);
        }
      }
      // Case 2: Permission is default - will be handled by modal after 3 seconds (in App.js)
      else if (permission === 'default') {
        console.log('⏳ Permission not requested yet, modal will show');
      }
      // Case 3: Permission denied
      else if (permission === 'denied') {
        console.log('❌ Notification permission denied by user');
      }
    };

    // Auto-register immediately if already granted, otherwise wait a bit
    const hasPermission = 'Notification' in window && Notification.permission === 'granted';
    const delay = hasPermission ? 1000 : 2000; // 1s if granted (to ensure auth is ready), 2s otherwise

    const timer = setTimeout(autoRegisterFCM, delay);

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Listen for foreground messages
  useEffect(() => {
    if (isEnabled) {
      onMessageListener()
        .then((payload: any) => {
          console.log('Received foreground message:', payload);

          // Show toast notification
          const title = payload.notification?.title || 'Nouvelle notification';
          const body = payload.notification?.body || '';

          toast.success(
            `${title}\n${body}`,
            {
              duration: 5000,
              position: 'top-right',
            }
          );

          // You can also update the notification count here
          // or trigger a refetch of notifications
        })
        .catch((err) => console.error('Failed to receive message:', err));
    }
  }, [isEnabled]);

  /**
   * Setup push notifications - request permission and register token
   */
  const setupPushNotifications = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const success = await notificationService.requestAndRegisterPushNotifications();
      setIsEnabled(success);
      // toast.success('Notifications push activées!');
      return success;
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      const errorMessage = (error as Error).message;

      // Show user-friendly error messages
      if (errorMessage.includes('Permission refusée') || errorMessage.includes('Permission annulée')) {
        toast.error('Permission refusée. Veuillez autoriser les notifications dans les paramètres.');
      } else if (errorMessage.includes('Service Workers')) {
        toast.error('Votre navigateur ne supporte pas les notifications push');
      } else {
        toast.error('Erreur lors de l\'activation des notifications');
      }

      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Disable push notifications
   */
  const disablePushNotifications = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await notificationService.unregisterPushNotifications();
      setIsEnabled(false);
      toast.success('Notifications push désactivées');
    } catch (error) {
      console.error('Error disabling push notifications:', error);
      toast.error('Erreur lors de la désactivation des notifications');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Toggle push notifications
   */
  const togglePushNotifications = async (): Promise<void> => {
    if (isEnabled) {
      await disablePushNotifications();
    } else {
      await setupPushNotifications();
    }
  };

  return {
    isEnabled,
    isLoading,
    setupPushNotifications,
    disablePushNotifications,
    togglePushNotifications,
  };
};
