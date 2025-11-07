import { userService } from '@/services/user.service';
import type { Notification } from '@/types';
import { getServiceDownMessage } from '@/utils/network-error.utils';
import {
  // formatRelativeTime,
  formatTelegramStyleTime,
} from '@/utils/timezone.utils';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// shadcn + lucide
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Bell,
  Check,
  Clock,
  CreditCard,
  Info,
  Volume2,
} from 'lucide-react';

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
      setError(getServiceDownMessage(error, 'Gagal memuat notifikasi'));
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
    <div className='fixed top-16 right-6 z-50 w-[420px] max-w-[92vw] drop-shadow-2xl'>
      <div className='bg-white rounded-[28px] border border-gray-100 overflow-hidden flex flex-col max-h-[75vh] shadow-[0px_20px_60px_rgba(15,23,42,0.12)]'>
        {/* Header */}
        <div className='relative px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-sky-50 via-purple-50 to-emerald-50'>
          <div className='flex items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <Button
                onClick={onClose}
                size='sm'
                variant='ghost'
                className='h-9 w-9 rounded-full bg-white/80 hover:bg-white shadow-sm border cursor-pointer border-white/60'
              >
                <ArrowLeft className='w-4 h-4 text-slate-600' />
              </Button>
              <div>
                <div className='flex items-center gap-2'>
                  <h2 className='text-lg font-bold text-slate-800'>
                    Pemberitahuan Sistem
                  </h2>
                </div>
                <p className='text-xs text-slate-500 mt-0.5'>
                  Pusat pesan terbaru untukmu
                </p>
              </div>
            </div>
          </div>
          {unreadCount > 0 && (
            <div className='mt-3 flex items-center justify-between'>
              <span className='text-xs text-slate-600'>
                Ada {unreadCount} notifikasi belum dibaca
              </span>
              <Button
                onClick={markAllAsRead}
                size='sm'
                variant='ghost'
                className='h-7 px-3 text-[11px] text-emerald-600 hover:bg-emerald-100/60 rounded-full font-semibold'
              >
                <Check className='w-3 h-3 mr-1' /> Tandai semua
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto bg-slate-50/60'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center py-14'>
              <div className='p-4 bg-green-100 rounded-full mb-4'>
                <Bell className='w-8 h-8 animate-bounce text-green-600' />
              </div>
              <p className='text-sm text-gray-600 font-medium'>
                Memuat notifikasi...
              </p>
            </div>
          ) : error ? (
            <div className='text-center py-14 px-6'>
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
            <div className='p-4 space-y-4'>
              {notifications.map(notification => {
                const config = getTypeConfig(notification.type);
                const paymentInfo = extractPaymentInfo(notification.message);

                return (
                  <div
                    key={notification.id}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-200  hover:shadow-lg ${
                      !notification.is_read
                        ? `${config.borderColor} ${config.bgColor}`
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Link
                      to={notification.url || '/notifications'}
                      onClick={() => markAsRead(notification.id)}
                      className='block p-4 sm:p-5'
                    >
                      <div className='flex items-start gap-3'>
                        <div
                          className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl shadow-inner ${config.iconBgColor}`}
                        >
                          {config.icon}
                        </div>
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${config.badgeBgColor} ${config.badgeTextColor}`}
                            >
                              {config.label}
                            </span>
                            <span className='text-[11px] text-gray-500'>
                              {formatTelegramStyleTime(notification.created_at)}
                            </span>
                          </div>
                          <h4
                            className={`text-sm sm:text-base font-semibold leading-snug ${
                              !notification.is_read
                                ? 'text-slate-900'
                                : 'text-slate-700'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className='mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-3'>
                            {notification.message}
                          </p>

                          {(paymentInfo.amount || paymentInfo.dueDate) && (
                            <div className='mt-3 flex flex-wrap gap-2 rounded-xl border border-white/80 bg-white/80 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm'>
                              {paymentInfo.amount && (
                                <span className='flex items-center gap-1 text-emerald-600 font-semibold'>
                                  {paymentInfo.amount}
                                </span>
                              )}
                              {paymentInfo.dueDate && (
                                <span className='flex items-center gap-1 text-rose-500'>
                                  <Clock className='w-3 h-3' />
                                  {paymentInfo.dueDate}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='mt-3 flex items-center justify-between text-[11px] text-slate-400'>
                        <span>
                          {notification.is_read
                            ? 'Sudah dibaca'
                            : 'Belum dibaca'}
                        </span>
                        <span className='transition-opacity group-hover:opacity-100 opacity-0 font-semibold text-green-500'>
                          Lihat detail ›
                        </span>
                      </div>
                    </Link>
                    {!notification.is_read && (
                      <span className='absolute inset-x-0 top-0 h-1 bg-blue-500'></span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-14 px-6'>
              <div className='p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4'>
                <Bell className='w-8 h-8 text-gray-400' />
              </div>
              <h3 className='text-sm font-semibold text-gray-700 mb-2'>
                Belum ada notifikasi
              </h3>
              <p className='text-xs text-gray-500'>
                Notifikasi akan muncul di sini ketika ada informasi baru
              </p>
            </div>
          )}
        </div>

        <div className='px-5 py-4 border-t border-gray-100 bg-white/90 backdrop-blur flex items-center justify-between'>
          <div className='flex items-center gap-2 text-xs text-slate-500'>
            <Bell className='w-4 h-4 text-emerald-500' />
            Semua pemberitahuan tersimpan otomatis
          </div>
          <Button
            asChild
            size='sm'
            className='rounded-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4'
          >
            <Link to='/notifications'>Lihat lebih banyak</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
