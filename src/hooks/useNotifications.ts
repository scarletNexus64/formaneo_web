import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { Notification } from '../types/notification';

export const useNotifications = (pollingInterval = 30000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.unread_count);
    } catch (err: any) {
      console.error('Error fetching unread count:', err);
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = useCallback(async (page = 1, perPage = 20) => {
    try {
      setLoading(true);
      setError(null);
      const response = await notificationService.getNotifications(page, perPage);
      setNotifications(response.notifications.data);
      return response.notifications;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notifications');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
      );
      await fetchUnreadCount();
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      throw err;
    }
  }, [fetchUnreadCount]);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      throw err;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      await fetchUnreadCount();
    } catch (err: any) {
      console.error('Error deleting notification:', err);
      throw err;
    }
  }, [fetchUnreadCount]);

  // Poll for new notifications
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [fetchUnreadCount, pollingInterval]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
