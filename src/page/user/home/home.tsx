import { AlertCircle, CheckCircle, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  FeeCard,
  LoadingSpinner,
  PageHeader,
  PageLayout,
  StatsCard,
} from '../../../components/common';
import NotificationPopup from '../../../components/common/notification/NotificationPopup';
import { useAuth } from '../../../context/auth.context';
import { useError } from '../../../context/error.context';
import { userService } from '../../../services/user.service';
import type { Fee, Notification } from '../../../types';
const Home: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const { logUserAction } = useError();
  const [fees, setFees] = useState<Fee[]>([]);
  const [, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      logUserAction('home_data_fetch_start', { page: 'home' });
      const [feesData, notificationsData] = await Promise.all([
        userService.getFees(),
        userService.getNotifications(),
      ]);
      setFees(feesData);
      setNotifications(notificationsData);
      logUserAction('home_data_fetch_success', {
        feesCount: feesData.length,
        notificationsCount: notificationsData.length,
      });
    } catch (error) {
      console.error('Error fetching home data:', error);
      setError('Gagal memuat data. Silakan coba lagi.');
      logUserAction(
        'home_data_fetch_error',
        {
          error: error instanceof Error ? error.message : String(error),
        },
        'high'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message='Memuat data...' />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const currentFee = fees.find(fee => {
    // Handle format "YYYY-MM" or just month number
    let feeMonth: number;
    if (fee.bulan.includes('-')) {
      // Format: "2025-09" -> extract month part
      feeMonth = parseInt(fee.bulan.split('-')[1]);
    } else {
      // Format: "9" -> direct parse
      feeMonth = parseInt(fee.bulan);
    }
    const currentMonth =
      new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
      ).getMonth() + 1;
    return feeMonth === currentMonth;
  });

  return (
    <PageLayout>
      {/* Notification Popup */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={() => setNotificationRefreshKey(prev => prev + 1)}
      />

      {/* Enhanced Header with Branding - Responsive */}
      <PageHeader
        title='Halo'
        subtitle='Kelola iuran IPL Anda dengan mudah'
        icon={<User className='w-5 h-5 md:w-6 md:h-6 text-white' />}
        userName={authState.user?.nama}
        showNotification={true}
        onNotificationClick={() => setShowNotificationPopup(true)}
        notificationRefreshKey={notificationRefreshKey}
      />

      <div className='p-4 space-y-6 -mt-2'>
        {/* Current Fee - Enhanced */}
        {currentFee ? (
          <FeeCard
            fee={currentFee}
            onPay={feeId => navigate(`/iuran/${feeId}`)}
            showDueDate={true}
            showPaymentButton={true}
          />
        ) : (
          <EmptyState
            icon={
              <CheckCircle className='w-12 h-12 text-green-500 mx-auto mb-3' />
            }
            title='Tidak ada iuran tertunggak'
            description='Semua iuran sudah lunas'
            type='success'
          />
        )}

        {/* Enhanced Quick Stats */}
        <div className='grid grid-cols-2 gap-4'>
          <StatsCard
            title='Lunas'
            value={fees.filter(f => f.status.toLowerCase() === 'lunas').length}
            description={
              fees.filter(f => f.status.toLowerCase() === 'lunas').length === 0
                ? 'Belum ada data'
                : 'Pembayaran selesai'
            }
            icon={<CheckCircle className='w-6 h-6 sm:w-7 sm:h-7 text-white' />}
            variant='success'
          />

          <StatsCard
            title='Tertunggak'
            value={
              fees.filter(f => f.status.toLowerCase() === 'belum bayar').length
            }
            description={
              fees.filter(f => f.status.toLowerCase() === 'belum bayar')
                .length === 0
                ? 'Semua lunas'
                : 'Perlu dibayar'
            }
            icon={<AlertCircle className='w-6 h-6 sm:w-7 sm:h-7 text-white' />}
            variant='error'
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default Home;
