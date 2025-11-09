import apiService from './api.service';
import { NotificationsResponse, UnreadCountResponse } from '../types/notification';

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
};
