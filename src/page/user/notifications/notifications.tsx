import { Bell, Info } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
  EmptyState,
  ErrorState,
  NotificationCard,
  PageHeader,
  PageLayout,
} from '../../../components/user';
import NotificationPopup from '../../../components/user/notification/NotificationPopup';
import { useUserNotifications } from '../../../hooks/useUserNotifications';

// Helper function to group notifications by time
const groupNotificationsByTime = (notifications: any[]) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const groups = {
    today: [] as any[],
    yesterday: [] as any[],
    thisWeek: [] as any[],
    older: [] as any[],
  };

  notifications.forEach(notif => {
    const notifDate = new Date(notif.created_at);
    const notifDay = new Date(
      notifDate.getFullYear(),
      notifDate.getMonth(),
      notifDate.getDate()
    );

    if (notifDay.getTime() === today.getTime()) {
      groups.today.push(notif);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notif);
    } else if (notifDate >= lastWeek) {
      groups.thisWeek.push(notif);
    } else {
      groups.older.push(notif);
    }
  });

  return groups;
};

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

  const [filterType, setFilterType] = useState<string>('all');
  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  // Filter notifications by type
  const filteredNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    return notifications.filter(
      notif => notif.type.toLowerCase() === filterType
    );
  }, [notifications, filterType]);

  // Group filtered notifications
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByTime(filteredNotifications);
  }, [filteredNotifications]);

  // Mark all as read function
  // const handleMarkAllAsRead = async () => {
  //   try {
  //     const unreadNotifications = notifications.filter(notif => !notif.is_read);
  //     await Promise.all(
  //       unreadNotifications.map(notif =>
  //         userService.markNotificationAsRead(notif.id)
  //       )
  //     );
  //     fetchNotifications();
  //   } catch (error) {
  //     console.error('Error marking all as read:', error);
  //   }
  // };

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-3 sm:p-4 space-y-3 sm:space-y-4'>
        {/* Header Skeleton */}
        <div className='bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg'>
          <div className='h-6 sm:h-8 bg-white/30 rounded-lg w-40 sm:w-52' />
          <div className='h-3 sm:h-4 bg-white/20 rounded-lg w-56 sm:w-72 mt-2 sm:mt-3' />
        </div>

        {/* Filter Skeleton */}
        <div className='bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm'>
          <div className='flex gap-2 overflow-x-auto pb-1'>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className='h-8 sm:h-9 bg-gray-200 rounded-lg w-20 sm:w-24 animate-pulse flex-shrink-0'
              />
            ))}
          </div>
        </div>

        {/* Notification Cards Skeleton */}
        <div className='space-y-3 sm:space-y-4'>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className='bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse'
            >
              <div className='flex items-start gap-2 sm:gap-3 mb-3'>
                <div className='h-9 w-9 sm:h-10 sm:w-10 bg-gray-200 rounded-lg flex-shrink-0' />
                <div className='flex-1'>
                  <div className='h-4 sm:h-5 bg-gray-200 rounded-lg w-24 sm:w-32 mb-2' />
                  <div className='h-3 bg-gray-100 rounded-lg w-16 sm:w-20' />
                </div>
              </div>
              <div className='h-5 sm:h-6 bg-gray-200 rounded-lg w-full mb-2' />
              <div className='h-4 bg-gray-100 rounded-lg w-full mb-2' />
              <div className='h-4 bg-gray-100 rounded-lg w-4/5 sm:w-3/4' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNotifications} />;
  }

  // Render notification group section
  const renderNotificationGroup = (title: string, notifications: any[]) => {
    if (notifications.length === 0) return null;

    return (
      <div className='mb-6 sm:mb-8'>
        <h2 className='text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4 px-0.5 sm:px-1'>
          {title}
        </h2>
        <div className='space-y-3 sm:space-y-4'>
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
      </div>
    );
  };

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title='Notifikasi'
        subtitle='Informasi terbaru untuk Anda'
        icon={<Bell className='w-6 h-6 text-white' />}
        notificationRefreshKey={notificationRefreshKey}
      />

      {/* Filter Tabs & Mark All as Read */}
      {notifications.length > 0 && (
        <div className='sticky top-[140px] md:top-[180px] z-10 mx-3 sm:mx-4 mt-4 mb-4 bg-white border border-gray-200 rounded-xl shadow-md'>
          <div className='px-3 sm:px-4 py-3 sm:py-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between  gap-3 pt-4 mb-3 sm:mb-4 '>
              <div className='flex items-center gap-2'>
                <Bell className='w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0' />
                <span className='text-xs sm:text-sm font-semibold text-gray-700'>
                  {unreadCount > 0
                    ? `${unreadCount} belum dibaca`
                    : 'Semua terbaca'}
                </span>
              </div>
              {/* {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  size='sm'
                  variant='ghost'
                  className='flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border border-emerald-200 rounded-lg sm:rounded-xl h-8 sm:h-9 transition-all duration-200 font-semibold text-xs sm:text-sm w-full sm:w-auto'
                >
                  <CheckCheck className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
                  <span className='hidden sm:inline'>Tandai Semua Dibaca</span>
                  <span className='sm:hidden'>Tandai Dibaca</span>
                </Button>
              )} */}
            </div>

            <div className='flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide scroll-smooth snap-x snap-mandatory'>
              {[
                {
                  key: 'all',
                  label: 'Semua',
                  mobileLabel: 'Semua',
                },
                {
                  key: 'pembayaran',
                  label: 'Pembayaran',
                  mobileLabel: 'Bayar',
                },
                {
                  key: 'reminder',
                  label: 'Pengingat',
                  mobileLabel: 'Ingat',
                },
                {
                  key: 'pengumuman',
                  label: 'Pengumuman',
                  mobileLabel: 'Info',
                },
              ].map(filter => {
                const count = notifications.filter(
                  n => n.type.toLowerCase() === filter.key
                ).length;
                return (
                  <button
                    key={filter.key}
                    onClick={() => setFilterType(filter.key)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 snap-start ${
                      filterType === filter.key
                        ? 'bg-green-600 text-white shadow-md scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 active:bg-green-100'
                    }`}
                  >
                    <span className='hidden sm:inline'>{filter.label}</span>
                    <span className='sm:hidden'>{filter.mobileLabel}</span>
                    {filter.key !== 'all' && count > 0 && (
                      <span
                        className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${
                          filterType === filter.key
                            ? 'bg-white/20 text-white'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* List Notifikasi with Time-based Grouping */}
      <div
        className={`px-3 sm:px-4 pb-20 ${
          notifications.length > 0 ? 'pt-2' : 'pt-6'
        }`}
      >
        {filteredNotifications.length > 0 ? (
          <div>
            {renderNotificationGroup('Hari Ini', groupedNotifications.today)}
            {renderNotificationGroup('Kemarin', groupedNotifications.yesterday)}
            {renderNotificationGroup(
              'Minggu Ini',
              groupedNotifications.thisWeek
            )}
            {renderNotificationGroup('Lebih Lama', groupedNotifications.older)}
          </div>
        ) : filterType !== 'all' ? (
          <EmptyState
            icon={<Info className='w-16 h-16 text-gray-400 mx-auto mb-4' />}
            title={`Tidak Ada ${
              filterType.charAt(0).toUpperCase() + filterType.slice(1)
            }`}
            description={`Belum ada notifikasi ${filterType}`}
            type='info'
          />
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
