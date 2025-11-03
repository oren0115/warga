import { Bell, Info } from 'lucide-react';
import React from 'react';
import {
  EmptyState,
  ErrorState,
  NotificationCard,
  PageHeader,
  PageLayout,
} from '../../../components/common';
import NotificationPopup from '../../../components/common/notification/NotificationPopup';

import { useUserNotifications } from '../../../hooks/useUserNotifications';

const Notifications: React.FC = () => {
  const {
    notifications,
    isLoading,
    error,
    showNotificationPopup,
    setShowNotificationPopup,
    notificationRefreshKey,
    setNotificationRefreshKey,
    fetchNotifications,
    markAsRead,
  } = useUserNotifications();

  // const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 space-y-4'>
        <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-white'>
          <div className='h-6 bg-white/30 rounded w-52' />
          <div className='h-3 bg-white/20 rounded w-72 mt-2' />
        </div>
        <div className='space-y-3'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-white border border-gray-200 rounded-xl p-4'
            >
              <div className='h-4 bg-gray-200 rounded w-40 mb-2' />
              <div className='h-3 bg-gray-100 rounded w-56' />
            </div>
          ))}
        </div>
      </div>
    );
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
        notificationRefreshKey={notificationRefreshKey}
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
