import React, { useEffect, useState } from 'react';
import NotificationPopup from '../../../components/common/notification/NotificationPopup';
import { userService } from '../../../services/user.service';
import type { Notification } from '../../../types';
// shadcn + lucide
import { Bell, Info } from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  LoadingSpinner,
  NotificationCard,
  PageHeader,
  PageLayout,
} from '../../../components/common';

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [, setNotificationRefreshKey] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notificationsData = await userService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Gagal memuat notifikasi');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await userService.markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      // Refresh badge count in header
      setNotificationRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  if (isLoading) {
    return <LoadingSpinner message='Memuat notifikasi...' />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNotifications} />;
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title='Notifikasi'
        subtitle='Informasi terbaru untuk Anda'
        icon={<Bell className='w-6 h-6 text-white' />}
      />

      {/* List Notifikasi */}
      <div className='p-4'>
        {notifications.length > 0 ? (
          <div className='space-y-4'>
            {notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                isRead={notification.is_read}
                createdAt={notification.created_at}
                onMarkAsRead={markAsRead}
                url={notification.url}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Info className='w-16 h-16 text-gray-400 mx-auto mb-4' />}
            title='Belum Ada Notifikasi'
            description='Notifikasi akan muncul di sini'
            type='info'
          />
        )}
      </div>
      {/* Notifikasi Popup */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={() => setNotificationRefreshKey(k => k + 1)}
      />
    </PageLayout>
  );
};

export default Notifications;
