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
          bgColor: 'bg-blue-50/80',
          iconBgColor: 'bg-blue-100/70',
          iconColor: 'text-blue-600',
          badgeBgColor: 'bg-blue-50/90',
          badgeTextColor: 'text-blue-700',
          borderColor: 'border-blue-200',
          label: 'Pengumuman',
        };
      case 'pembayaran':
        return {
          icon: <CreditCard className='w-4 h-4' />,
          bgColor: 'bg-emerald-50/80',
          iconBgColor: 'bg-emerald-100/70',
          iconColor: 'text-emerald-600',
          badgeBgColor: 'bg-emerald-50/90',
          badgeTextColor: 'text-emerald-700',
          borderColor: 'border-emerald-200',
          label: 'Pembayaran',
        };
      case 'reminder':
        return {
          icon: <Clock className='w-4 h-4' />,
          bgColor: 'bg-rose-50/80',
          iconBgColor: 'bg-rose-100/70',
          iconColor: 'text-rose-600',
          badgeBgColor: 'bg-rose-50/90',
          badgeTextColor: 'text-rose-700',
          borderColor: 'border-rose-200',
          label: 'Pengingat',
        };
      default:
        return {
          icon: <Info className='w-4 h-4' />,
          bgColor: 'bg-slate-50/80',
          iconBgColor: 'bg-slate-100/70',
          iconColor: 'text-slate-600',
          badgeBgColor: 'bg-slate-50/90',
          badgeTextColor: 'text-slate-700',
          borderColor: 'border-slate-200',
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
            <div className='p-5 space-y-3'>
              {notifications.map(notification => {
                const config = getTypeConfig(notification.type);
                const paymentInfo = extractPaymentInfo(notification.message);

                return (
                  <div
                    key={notification.id}
                    className={`group relative rounded-2xl overflow-hidden border transition-all duration-200 hover:shadow-md ${
                      !notification.is_read
                        ? `${config.borderColor} ${config.bgColor}`
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <Link
                      to={notification.url || '/notifications'}
                      onClick={() => markAsRead(notification.id)}
                      className='block p-4'
                    >
                      <div className='flex items-start gap-3'>
                        {/* Icon with improved styling */}
                        <div
                          className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl shadow-sm ${config.iconBgColor} ${config.iconColor}`}
                        >
                          {config.icon}
                        </div>
                        
                        <div className='flex-1 min-w-0'>
                          {/* Category badge and time */}
                          <div className='flex items-center gap-2 mb-2'>
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${config.badgeBgColor} ${config.badgeTextColor} border ${config.borderColor}`}
                            >
                              {config.label}
                            </span>
                            <span className='text-[10px] text-gray-400 font-medium'>
                              {formatTelegramStyleTime(notification.created_at)}
                            </span>
                          </div>
                          
                          {/* Title - larger and bold */}
                          <h4
                            className={`text-base font-bold leading-snug mb-1.5 ${
                              !notification.is_read
                                ? 'text-slate-900'
                                : 'text-slate-600'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          
                          {/* Message - smaller gray text */}
                          <p className='text-xs text-gray-500 leading-relaxed line-clamp-2'>
                            {notification.message}
                          </p>

                          {/* Payment info */}
                          {(paymentInfo.amount || paymentInfo.dueDate) && (
                            <div className='mt-2.5 flex flex-wrap gap-2 rounded-lg border border-gray-200/80 bg-white/90 px-2.5 py-2 text-xs'>
                              {paymentInfo.amount && (
                                <span className='flex items-center gap-1 text-emerald-600 font-bold'>
                                  {paymentInfo.amount}
                                </span>
                              )}
                              {paymentInfo.dueDate && (
                                <span className='flex items-center gap-1 text-rose-600 font-medium'>
                                  <Clock className='w-3 h-3' />
                                  {paymentInfo.dueDate}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {/* Unread indicator */}
                        {!notification.is_read && (
                          <span className='flex-shrink-0 w-2 h-2 bg-red-500 rounded-full mt-2 animate-pulse'></span>
                        )}
                      </div>

                      {/* Footer with hover indicator */}
                      <div className='mt-3 flex items-center justify-end text-[10px]'>
                        <span className='transition-all duration-200 group-hover:opacity-100 opacity-50 font-semibold text-emerald-600 flex items-center gap-1'>
                          Lihat detail
                          <span className='group-hover:translate-x-0.5 transition-transform duration-200'>›</span>
                        </span>
                      </div>
                    </Link>
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
