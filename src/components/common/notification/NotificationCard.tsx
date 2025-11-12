import {
  ArrowRight,
  Calendar,
  CheckCheck,
  Clock,
  CreditCard,
  DollarSign,
  Info,
  Volume2,
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTelegramStyleTime } from '../../../utils/timezone.utils';
import { Button } from '../../ui/button';

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  onMarkAsRead?: (id: string) => void;
  url?: string;
  className?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  type,
  isRead,
  createdAt,
  onMarkAsRead,
  url,
  className = '',
}) => {
  const navigate = useNavigate();

  const getTypeConfig = (type: string) => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
      case 'pengumuman':
        return {
          icon: <Volume2 className='w-5 h-5' />,
          bgColor: 'bg-blue-50/80',
          iconBgColor: 'bg-blue-100/70',
          iconColor: 'text-blue-600',
          badgeBgColor: 'bg-blue-50/90',
          badgeTextColor: 'text-blue-700',
          borderColor: 'border-blue-100',
          accentColor: 'border-l-blue-400',
          hoverShadow: 'hover:shadow-blue-100/50',
          label: 'Pengumuman',
        };
      case 'pembayaran':
        return {
          icon: <CreditCard className='w-5 h-5' />,
          bgColor: 'bg-emerald-50/80',
          iconBgColor: 'bg-emerald-100/70',
          iconColor: 'text-emerald-600',
          badgeBgColor: 'bg-emerald-50/90',
          badgeTextColor: 'text-emerald-700',
          borderColor: 'border-emerald-100',
          accentColor: 'border-l-emerald-400',
          hoverShadow: 'hover:shadow-emerald-100/50',
          label: 'Pembayaran',
        };
      case 'reminder':
        return {
          icon: <Clock className='w-5 h-5' />,
          bgColor: 'bg-rose-50/80',
          iconBgColor: 'bg-rose-100/70',
          iconColor: 'text-rose-600',
          badgeBgColor: 'bg-rose-50/90',
          badgeTextColor: 'text-rose-700',
          borderColor: 'border-rose-100',
          accentColor: 'border-l-rose-400',
          hoverShadow: 'hover:shadow-rose-100/50',
          label: 'Pengingat',
        };
      default:
        return {
          icon: <Info className='w-5 h-5' />,
          bgColor: 'bg-slate-50/80',
          iconBgColor: 'bg-slate-100/70',
          iconColor: 'text-slate-600',
          badgeBgColor: 'bg-slate-50/90',
          badgeTextColor: 'text-slate-700',
          borderColor: 'border-slate-100',
          accentColor: 'border-l-slate-400',
          hoverShadow: 'hover:shadow-slate-100/50',
          label: 'Info',
        };
    }
  };

  // Use the timezone utility function for consistent time formatting

  // Extract payment amount and due date from message if available
  const extractPaymentInfo = () => {
    const amountMatch = message.match(/Rp\s?([\d.,]+)/);
    const dateMatch = message.match(/\d{1,2}\s+\w+\s+\d{4}/);
    return {
      amount: amountMatch ? amountMatch[0] : null,
      dueDate: dateMatch ? dateMatch[0] : null,
    };
  };

  const config = getTypeConfig(type);
  const paymentInfo = extractPaymentInfo();
  const isPending =
    type.toLowerCase() === 'pembayaran' || type.toLowerCase() === 'reminder';

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      navigate(url);
    }
    if (onMarkAsRead && !isRead) {
      onMarkAsRead(id);
    }
  };

  const handleCardClick = () => {
    if (url) {
      navigate(url);
    }
    if (onMarkAsRead && !isRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border ${
        !isRead ? `${config.accentColor} border-l-4` : config.borderColor
      } overflow-hidden cursor-pointer transform hover:-translate-y-0.5 ${
        config.hoverShadow
      } ${className}`}
    >
      {/* Card Content */}
      <div className='p-4 sm:p-6'>
        {/* Header: Category Badge + Time + Unread Indicator */}
        <div className='flex items-start justify-between mb-3 sm:mb-4 gap-2'>
          <div className='flex items-center gap-2 sm:gap-3 min-w-0'>
            {/* Icon with subtle background */}
            <div
              className={`${config.iconBgColor} ${config.iconColor} p-2 sm:p-2.5 rounded-lg sm:rounded-xl shadow-sm flex-shrink-0`}
            >
              {config.icon}
            </div>

            {/* Category badge with icon */}
            <div className='flex flex-col gap-1 sm:gap-1.5 min-w-0'>
              <span
                className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-semibold ${config.badgeBgColor} ${config.badgeTextColor} border ${config.borderColor} truncate`}
              >
                {config.label}
              </span>

              {/* Time with softer color */}
              <span className='text-[10px] sm:text-xs text-gray-400 font-medium truncate'>
                {formatTelegramStyleTime(createdAt)}
              </span>
            </div>
          </div>

          {/* Unread indicator - only show for unread */}
          {!isRead && (
            <span className='flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-red-50 rounded-full border border-red-100 flex-shrink-0'>
              <span className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse'></span>
              <span className='text-[10px] sm:text-xs font-semibold text-red-600'>
                Baru
              </span>
            </span>
          )}
        </div>

        {/* Title: Larger & Bold for clear hierarchy */}
        <h3 className='text-base sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 leading-snug'>
          {title}
        </h3>

        {/* Message: Smaller gray text with line clamp for mobile */}
        <p className='text-xs sm:text-sm text-gray-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed'>
          {message}
        </p>

        {/* Payment Info Highlights (if available) */}
        {(paymentInfo.amount || paymentInfo.dueDate) && (
          <div className='flex flex-wrap gap-2 sm:gap-3 mb-3 sm:mb-4 p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-lg sm:rounded-xl border border-gray-200/80'>
            {paymentInfo.amount && (
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <div className='p-1 sm:p-1.5 bg-emerald-100 rounded-md sm:rounded-lg'>
                  <DollarSign className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600' />
                </div>
                <span className='text-sm sm:text-base font-bold text-gray-900'>
                  {paymentInfo.amount}
                </span>
              </div>
            )}
            {paymentInfo.dueDate && (
              <div className='flex items-center gap-1.5 sm:gap-2'>
                <div className='p-1 sm:p-1.5 bg-rose-100 rounded-md sm:rounded-lg'>
                  <Calendar className='w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-600' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-[10px] sm:text-xs text-gray-500'>
                    Jatuh Tempo
                  </span>
                  <span className='text-xs sm:text-sm font-semibold text-gray-700'>
                    {paymentInfo.dueDate}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons with better spacing */}
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-2 sm:pt-3 border-t border-gray-100'>
          {!isRead && onMarkAsRead && (
            <Button
              onClick={e => {
                e.stopPropagation();
                onMarkAsRead(id);
              }}
              size='sm'
              variant='ghost'
              className='flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-lg sm:rounded-xl h-9 sm:h-10 transition-all duration-200 text-xs sm:text-sm w-full sm:w-auto'
            >
              <CheckCheck className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
              <span className='font-medium'>Tandai Dibaca</span>
            </Button>
          )}

          {isPending && url && (
            <Button
              onClick={handleQuickAction}
              size='sm'
              className='flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-lg sm:rounded-xl h-9 sm:h-10 px-4 sm:px-5 shadow-md hover:shadow-lg transition-all duration-200 sm:ml-auto text-xs sm:text-sm w-full sm:w-auto'
            >
              <span>
                {type.toLowerCase() === 'pembayaran'
                  ? 'Bayar Sekarang'
                  : 'Lihat Detail'}
              </span>
              <ArrowRight className='w-3.5 h-3.5 sm:w-4 sm:h-4' />
            </Button>
          )}

          {/* Clickable indicator - hide on mobile when there are buttons */}
          {url && !(isPending && url) && !(!isRead && onMarkAsRead) && (
            <div className='flex items-center justify-center sm:justify-end gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-gray-400 group-hover:text-emerald-600 transition-colors duration-200 sm:ml-auto'>
              <span className='font-medium'>Lihat detail</span>
              <ArrowRight className='w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform duration-200' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
