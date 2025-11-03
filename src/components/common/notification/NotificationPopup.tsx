import { userService } from '@/services/user.service';
import type { Notification } from '@/types';
import {
  // formatRelativeTime,
  formatTelegramStyleTime,
} from '@/utils/timezone.utils';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// shadcn + lucide
import { Button } from '@/components/ui/button';
import { Bell, Check, Clock, CreditCard, Info, Volume2, X } from 'lucide-react';

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead?: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  onNotificationRead,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

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
      onNotificationRead?.();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notif => !notif.is_read);
      await Promise.all(
        unreadNotifications.map(notif =>
          userService.markNotificationAsRead(notif.id)
        )
      );
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );
      onNotificationRead?.();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getTypeConfig = (type: string) => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
      case 'pengumuman':
        return {
          icon: <Volume2 className='w-4 h-4' />,
          bgColor: 'bg-blue-50',
          iconBgColor: 'bg-blue-100',
          iconColor: 'text-blue-600',
          badgeBgColor: 'bg-blue-100',
          badgeTextColor: 'text-blue-700',
          borderColor: 'border-blue-300',
          label: 'Pengumuman',
        };
      case 'pembayaran':
        return {
          icon: <CreditCard className='w-4 h-4' />,
          bgColor: 'bg-green-50',
          iconBgColor: 'bg-green-100',
          iconColor: 'text-green-600',
          badgeBgColor: 'bg-green-100',
          badgeTextColor: 'text-green-700',
          borderColor: 'border-green-300',
          label: 'Pembayaran',
        };
      case 'reminder':
        return {
          icon: <Clock className='w-4 h-4' />,
          bgColor: 'bg-red-50',
          iconBgColor: 'bg-red-100',
          iconColor: 'text-red-600',
          badgeBgColor: 'bg-red-100',
          badgeTextColor: 'text-red-700',
          borderColor: 'border-red-300',
          label: 'Pengingat',
        };
      default:
        return {
          icon: <Info className='w-4 h-4' />,
          bgColor: 'bg-gray-50',
          iconBgColor: 'bg-gray-100',
          iconColor: 'text-gray-600',
          badgeBgColor: 'bg-gray-100',
          badgeTextColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          label: 'Info',
        };
    }
  };

  const extractPaymentInfo = (message: string) => {
    const amountMatch = message.match(/Rp\s?([\d.,]+)/);
    const dateMatch = message.match(/\d{1,2}\s+\w+\s+\d{4}/);
    return {
      amount: amountMatch ? amountMatch[0] : null,
      dueDate: dateMatch ? dateMatch[0] : null,
    };
  };

  const unreadCount = notifications.filter(notif => !notif.is_read).length;

  if (!isOpen) return null;

  return (
    <div className='fixed top-14 right-4 z-50 w-96'>
      <div className='bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[70vh] backdrop-blur-sm'>
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-green-100 rounded-full'>
              <Bell className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <h2 className='text-lg font-bold text-gray-800'>Notifikasi</h2>
              <p className='text-xs text-gray-500'>Pemberitahuan terbaru</p>
            </div>
            {unreadCount > 0 && (
              <span className='bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse'>
                {unreadCount}
              </span>
            )}
          </div>
          <div className='flex items-center gap-2'>
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                size='sm'
                variant='ghost'
                className='h-8 px-3 text-xs text-green-600 hover:bg-green-100 rounded-lg font-medium'
              >
                <Check className='w-3 h-3 mr-1' /> Tandai Semua
              </Button>
            )}
            <Button
              onClick={onClose}
              size='sm'
              variant='ghost'
              className='h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-lg'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-12'>
              <div className='p-4 bg-green-100 rounded-full mb-4'>
                <Bell className='w-8 h-8 animate-bounce text-green-600' />
              </div>
              <p className='text-sm text-gray-600 font-medium'>
                Memuat notifikasi...
              </p>
            </div>
          ) : error ? (
            <div className='text-center py-12 px-6'>
              <div className='p-4 bg-red-100 rounded-full w-fit mx-auto mb-4'>
                <Info className='w-8 h-8 text-red-500' />
              </div>
              <p className='text-red-600 text-sm font-medium mb-4'>{error}</p>
              <Button
                onClick={fetchNotifications}
                className='bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg'
                size='sm'
              >
                Coba Lagi
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className='p-3 space-y-3'>
              {notifications.map(notification => {
                const config = getTypeConfig(notification.type);
                const paymentInfo = extractPaymentInfo(notification.message);

                return (
                  <div
                    key={notification.id}
                    className={`rounded-xl border-2 overflow-hidden transition-all duration-200 hover:shadow-md ${
                      !notification.is_read
                        ? `border-l-4 ${config.borderColor} ${config.bgColor}`
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <Link
                      to={notification.url || '/notifications'}
                      onClick={() => markAsRead(notification.id)}
                      className='block p-4'
                    >
                      {/* Header: Category + Icon + Time */}
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-2'>
                          <div
                            className={`${config.iconBgColor} ${config.iconColor} p-1.5 rounded-full`}
                          >
                            {config.icon}
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeBgColor} ${config.badgeTextColor}`}
                          >
                            {config.label}
                          </span>
                          <span className='text-[10px] text-gray-500'>•</span>
                          <span className='text-[10px] text-gray-500 font-medium'>
                            {formatTelegramStyleTime(notification.created_at)}
                          </span>
                        </div>
                        {!notification.is_read && (
                          <span className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></span>
                        )}
                      </div>

                      {/* Title: Bold & Larger */}
                      <h4
                        className={`text-sm font-bold mb-1.5 leading-tight ${
                          !notification.is_read
                            ? 'text-gray-900'
                            : 'text-gray-800'
                        }`}
                      >
                        {notification.title}
                      </h4>

                      {/* Brief Content: Max 2 lines */}
                      <p className='text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed'>
                        {notification.message}
                      </p>

                      {/* Payment Info Highlights (if available) */}
                      {(paymentInfo.amount || paymentInfo.dueDate) && (
                        <div className='flex flex-wrap gap-2 mt-2 p-2 bg-white rounded-lg border border-gray-100'>
                          {paymentInfo.amount && (
                            <div className='flex items-center gap-1'>
                              <span className='text-xs font-bold text-gray-900'>
                                {paymentInfo.amount}
                              </span>
                            </div>
                          )}
                          {paymentInfo.dueDate && (
                            <div className='flex items-center gap-1'>
                              <Clock className='w-3 h-3 text-red-500' />
                              <span className='text-[10px] font-semibold text-gray-700'>
                                {paymentInfo.dueDate}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-12 px-6'>
              <div className='p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4'>
                <Bell className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                Belum ada notifikasi
              </h3>
              <p className='text-xs text-gray-500'>
                Notifikasi akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
