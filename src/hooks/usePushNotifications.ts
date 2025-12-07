import { useEffect, useState } from 'react';
import { notificationService } from '../services/notificationService';
import { onMessageListener } from '../config/firebase';
import toast from 'react-hot-toast';

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

  // Setup push notifications when user is authenticated
  useEffect(() => {
    if (isAuthenticated && !isEnabled) {
      // Wait a bit after login to ask for permission (better UX)
      const timer = setTimeout(() => {
        // Check again if not already enabled
        if (!notificationService.isPushNotificationsEnabled()) {
          // Only auto-request if permission is 'default' (not denied)
          if ('Notification' in window && Notification.permission === 'default') {
            setupPushNotifications();
          }
        }
      }, 2000); // Wait 2 seconds after login

      return () => clearTimeout(timer);
    }
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

      if (success) {
        toast.success('Notifications push activées!');
      } else {
        toast.error('Impossible d\'activer les notifications push');
      }

      return success;
    } catch (error) {
      console.error('Error setting up push notifications:', error);
      toast.error('Erreur lors de l\'activation des notifications');
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
