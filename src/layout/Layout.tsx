import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
// import { useRealtimeNotifications } from "../hooks/useRealtimeNotifications";
import {
  LuBell,
  LuChevronLeft,
  LuChevronRight,
  LuHistory,
  LuHouse,
  LuLogOut,
  LuReceipt,
  LuStar,
  LuUser,
} from 'react-icons/lu';

import { BottomNavigation } from '../components/common';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Button } from '../components/ui/button';
// import AdvancedSubmenu from "../components/layout/AdvancedSubmenu";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  icon: any;
  isAdvanced?: boolean;
  submenu?: NavItem[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const userNavItems = [
    { path: '/', label: 'Home', icon: LuHouse },
    { path: '/iuran', label: 'Iuran', icon: LuReceipt },
    { path: '/riwayat', label: 'Riwayat', icon: LuHistory },
    { path: '/profile', label: 'Profil', icon: LuUser },
  ];

  const adminNavItems: NavItem[] = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LuStar },
    { path: '/admin/users', label: 'Pengguna', icon: LuUser },
    { path: '/admin/fees', label: 'Generate Iuran', icon: LuReceipt },
    { path: '/admin/payments', label: 'Review Pembayaran', icon: LuHistory },
    { path: '/admin/broadcast', label: 'Broadcast', icon: LuBell },
  ];

  const navItems = authState.user?.is_admin ? adminNavItems : userNavItems;

  return (
    <div className='min-h-screen bg-main-background'>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className='fixed top-2 right-2 z-[60]'>
          <div
            className='px-3 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm'
            role='status'
            aria-live='polite'
          >
            Offline: Periksa koneksi internet Anda
          </div>
        </div>
      )}
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200 lg:shadow-sm transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:w-64' : 'lg:w-16'
        }`}
      >
        {/* Sidebar Header */}
        <div className='flex items-center justify-between h-16 px-4 border-b border-gray-100'>
          {isSidebarOpen && (
            <h1 className='text-xl font-bold text-main-dark truncate'>
              {authState.user?.is_admin ? 'Admin Panel' : 'IPL'}
            </h1>
          )}
          <Button
            variant='ghost'
            size='icon'
            className='cursor-pointer hover:bg-green-200 hover:text-primary-green focus:bg-green-200 focus:text-primary-green focus:ring-0 focus:outline-none transition-all duration-200 ml-auto'
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? (
              <LuChevronLeft className='h-5 w-5' />
            ) : (
              <LuChevronRight className='h-5 w-5' />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <div className='flex-1 overflow-y-auto py-4'>
          <nav className='px-2 space-y-1'>
            {navItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Button
                  key={item.path}
                  variant='ghost'
                  className={`cursor-pointer w-full transition-all duration-200 h-11 focus:ring-0 focus:outline-none ${
                    isSidebarOpen
                      ? 'justify-start gap-3 px-3'
                      : 'justify-center px-0'
                  } ${
                    active
                      ? 'cursor-pointer bg-green-100 text-primary-green border-r-2 border-primary-green font-medium hover:bg-green-200'
                      : 'text-gray-700 hover:bg-green-200 hover:text-primary-green focus:bg-green-200 focus:text-primary-green'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className='h-5 w-5 flex-shrink-0' />
                  {isSidebarOpen && (
                    <span className='truncate transition-opacity duration-200'>
                      {item.label}
                    </span>
                  )}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className='border-t border-gray-100 p-3 flex-shrink-0'>
          {isSidebarOpen ? (
            <div className='flex items-center gap-3'>
              <Avatar className='h-9 w-9 flex-shrink-0'>
                <AvatarImage src='' />
                <AvatarFallback className='bg-green-100 text-primary-green font-medium text-sm'>
                  {authState.user?.nama?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <div className='flex-1 min-w-0 overflow-hidden'>
                <p className='text-sm font-medium text-gray-900 truncate'>
                  {authState.user?.nama}
                </p>
                <p className='text-xs text-gray-500 truncate'>
                  {authState.user?.is_admin ? 'Administrator' : 'User'}
                </p>
              </div>

              <Button
                onClick={handleLogout}
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:ring-0 focus:outline-none transition-all duration-200 flex-shrink-0'
              >
                <LuLogOut className='h-4 w-4' />
              </Button>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-2'>
              <Avatar className='h-8 w-8 flex-shrink-0'>
                <AvatarImage src='' />
                <AvatarFallback className='bg-green-100 text-primary-green font-medium text-xs'>
                  {authState.user?.nama?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>

              <Button
                onClick={handleLogout}
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700 focus:ring-0 focus:outline-none transition-all duration-200'
              >
                <LuLogOut className='h-3 w-3' />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-16'
        }`}
      >
        <main className='min-h-screen'>{children}</main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className='lg:hidden'>
        <BottomNavigation />
      </div>

      {/* Bottom padding for mobile */}
      <div className='lg:hidden h-16'></div>
    </div>
  );
};

export default Layout;
