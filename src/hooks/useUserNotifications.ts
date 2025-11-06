import { useCallback, useEffect, useState } from 'react';
import { userService } from '../services/user.service';
import type { Notification } from '../types';
import { getServiceDownMessage } from '../utils/network-error.utils';
import { useToast } from '../context/toast.context';
import { useGlobalError } from '../context/global-error.context';
import { getToastDuration, isLightweightError } from '../utils/error-handling.utils';

export function useUserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notificationsData = await userService.getNotifications();
      setNotifications(notificationsData);
    } catch (err: any) {
      const message = getServiceDownMessage(err, 'Gagal memuat notifikasi');
      setError(message);
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
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
    } catch (err: any) {
      const message = getServiceDownMessage(err, 'Gagal menandai notifikasi');
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
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
