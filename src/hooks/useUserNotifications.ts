import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/user.service';
import type { Notification } from '../types';
import { getServiceDownMessage } from '../utils/network-error.utils';

export function useUserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notificationsData = await userService.getNotifications();
      setNotifications(notificationsData);
    } catch (err: any) {
      setError(getServiceDownMessage(err, 'Gagal memuat notifikasi'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await userService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
      setNotificationRefreshKey(prev => prev + 1);
    } catch (e) {
      console.error('Error marking notification as read:', e);
    }
  }, []);

  return {
    notifications,
    isLoading,
    error,
    showNotificationPopup,
    setShowNotificationPopup,
    notificationRefreshKey,
    setNotificationRefreshKey,
    fetchNotifications,
    markAsRead,
  };
}
