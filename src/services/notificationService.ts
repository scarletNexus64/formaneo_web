import apiService from './api.service';
import { NotificationsResponse, UnreadCountResponse } from '../types/notification';
import { requestNotificationPermission } from '../config/firebase';

export const notificationService = {
  // Get notifications for authenticated user
  getNotifications: async (page = 1, perPage = 20, unreadOnly = false, type?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        unread_only: unreadOnly.toString(),
      });

      if (type) {
        params.append('type', type);
      }

      const response = await apiService.get<NotificationsResponse>(`/notifications?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications count
  getUnreadCount: async () => {
    try {
      const response = await apiService.get<UnreadCountResponse>('/notifications/unread-count');
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id: number) => {
    try {
      const response = await apiService.post(`/notifications/${id}/mark-read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    try {
      const response = await apiService.post('/notifications/mark-all-read');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (id: number) => {
    try {
      const response = await apiService.delete(`/notifications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Detect browser information
  getDeviceInfo: () => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = '';
    let osName = 'Unknown';
    let osVersion = '';

    // Detect Browser
    if (userAgent.indexOf('Firefox') > -1) {
      browserName = 'Firefox';
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Edg') > -1) {
      browserName = 'Edge';
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Chrome') > -1) {
      browserName = 'Chrome';
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Safari') > -1) {
      browserName = 'Safari';
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || '';
    }

    // Detect OS
    if (userAgent.indexOf('Win') > -1) {
      osName = 'Windows';
      osVersion = userAgent.match(/Windows NT ([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('Mac') > -1) {
      osName = 'macOS';
      osVersion = userAgent.match(/Mac OS X ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
    } else if (userAgent.indexOf('Linux') > -1) {
      osName = 'Linux';
    } else if (userAgent.indexOf('Android') > -1) {
      osName = 'Android';
      osVersion = userAgent.match(/Android ([0-9.]+)/)?.[1] || '';
    } else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1) {
      osName = 'iOS';
      osVersion = userAgent.match(/OS ([0-9_]+)/)?.[1]?.replace(/_/g, '.') || '';
    }

    const deviceType = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 'mobile' : 'web';
    const deviceName = `${browserName} ${deviceType === 'mobile' ? 'Mobile' : 'Desktop'}`;

    return {
      device_name: deviceName,
      device_type: deviceType,
      browser_name: browserName,
      browser_version: browserVersion,
      os_name: osName,
      os_version: osVersion
    };
  },

  // Register FCM token for push notifications
  registerFcmToken: async (fcmToken: string) => {
    try {
      const deviceInfo = notificationService.getDeviceInfo();

      console.log('📱 Registering FCM token with device info:', deviceInfo);

      const response = await apiService.post('/notifications/fcm-token', {
        fcm_token: fcmToken,
        ...deviceInfo
      });
      return response.data;
    } catch (error) {
      console.error('Error registering FCM token:', error);
      throw error;
    }
  },

  // Remove FCM token
  removeFcmToken: async () => {
    try {
      const fcmToken = localStorage.getItem('fcm_token');
      const response = await apiService.delete('/notifications/fcm-token', {
        data: {
          fcm_token: fcmToken
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error removing FCM token:', error);
      throw error;
    }
  },

  // Request permission and register token
  requestAndRegisterPushNotifications: async (): Promise<boolean> => {
    try {
      console.log('🚀 [NotificationService] Starting requestAndRegisterPushNotifications...');

      // Request notification permission and get token
      console.log('📱 [NotificationService] Requesting notification permission...');
      const token = await requestNotificationPermission();
      console.log('📱 [NotificationService] Token received:', token ? token.substring(0, 50) + '...' : 'NULL');

      if (token) {
        // Register token with backend
        console.log('📤 [NotificationService] Registering token with backend...');
        const response = await notificationService.registerFcmToken(token);
        console.log('📥 [NotificationService] Backend response:', response);
        console.log('✅ [NotificationService] Push notifications registered successfully');

        // Store token in localStorage for future reference
        localStorage.setItem('fcm_token', token);
        console.log('💾 [NotificationService] Token stored in localStorage');

        return true;
      } else {
        console.warn('⚠️ [NotificationService] Failed to get FCM token');
        throw new Error('Impossible d\'obtenir le token de notification');
      }
    } catch (error) {
      console.error('❌ [NotificationService] Error setting up push notifications:', error);
      // Re-throw the error so it can be handled by the caller
      throw error;
    }
  },

  // Check if push notifications are enabled
  isPushNotificationsEnabled: (): boolean => {
    if (!('Notification' in window)) {
      return false;
    }
    return Notification.permission === 'granted' && !!localStorage.getItem('fcm_token');
  },

  // Unregister push notifications
  unregisterPushNotifications: async (): Promise<void> => {
    try {
      await notificationService.removeFcmToken();
      localStorage.removeItem('fcm_token');
      console.log('Push notifications unregistered');
    } catch (error) {
      console.error('Error unregistering push notifications:', error);
    }
  }
};
