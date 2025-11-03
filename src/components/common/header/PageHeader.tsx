import { Bell, Building2 } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';
import NotificationBadge from '../notification/NotificationBadge';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  userName?: string;
  showNotification?: boolean;
  onNotificationClick?: () => void;
  notificationRefreshKey?: number;
  rightAction?: React.ReactNode;
  mobileRightAction?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  userName,
  showNotification = false,
  onNotificationClick,
  notificationRefreshKey = 0,
  rightAction,
  mobileRightAction,
}) => {
  return (
    <div className='sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6'>
      <div className='absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full'></div>
      <div className='absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full'></div>

      <div className='relative p-4 md:p-6'>
        {/* Branding Section - Hidden on mobile, visible on desktop */}
        <div className='hidden md:flex items-center gap-3 mb-4'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <Building2 className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold'>IPL Cluster Cannary</h1>
            <p className='text-green-100 text-sm'>Sistem Pembayaran Digital</p>
          </div>
        </div>

        {/* Compact Mobile Header - Only visible on mobile */}
        <div className='md:hidden flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 bg-white/20 rounded-lg'>
              <Building2 className='w-5 h-5 text-white' />
            </div>
            <span className='text-lg font-semibold'>IPL Cluster Cannary</span>
          </div>
          {mobileRightAction ||
            (showNotification && (
              <div className='relative'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='relative'
                  onClick={onNotificationClick}
                >
                  <Bell className='h-5 w-5' />
                  <NotificationBadge refreshKey={notificationRefreshKey} />
                </Button>
              </div>
            ))}
        </div>

        {/* Enhanced Greeting Section */}
        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className='p-1.5 md:p-2 bg-white/20 rounded-full'>
                {icon}
              </div>
              <div>
                <h2 className='text-lg md:text-xl font-semibold mb-1'>
                  {userName ? `${title} - ${userName} 👋` : title}
                </h2>
                <p className='text-green-100 text-xs md:text-sm'>{subtitle}</p>
              </div>
            </div>
            {/* Desktop notification button - hidden on mobile */}
            {rightAction ||
              (showNotification && (
                <div className='hidden md:block relative'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-white hover:bg-white/20'
                    onClick={onNotificationClick}
                  >
                    <Bell className='w-5 h-5' />
                    <NotificationBadge refreshKey={notificationRefreshKey} />
                  </Button>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
