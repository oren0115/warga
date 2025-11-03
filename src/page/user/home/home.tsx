import { AlertCircle, CheckCircle, User } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  EmptyState,
  ErrorState,
  FeeCard,
  PageHeader,
  PageLayout,
  StatsCard,
} from '../../../components/common';
import NotificationPopup from '../../../components/common/notification/NotificationPopup';
import { useUserHome } from '../../../hooks/useUserHome';
const Home: React.FC = () => {
  const navigate = useNavigate();
  const {
    authState,
    fees,
    isLoading,
    error,
    showNotificationPopup,
    setShowNotificationPopup,
    notificationRefreshKey,
    setNotificationRefreshKey,
    fetchData,
  } = useUserHome();

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 space-y-4'>
        <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-white'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 bg-white/30 rounded-lg' />
            <div className='space-y-2'>
              <div className='h-4 bg-white/30 rounded w-40' />
              <div className='h-3 bg-white/20 rounded w-56' />
            </div>
          </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-xl p-4'>
          <div className='h-5 bg-gray-200 rounded w-32 mb-3' />
          <div className='h-24 bg-gray-100 rounded' />
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {[1, 2].map(i => (
            <div
              key={i}
              className='bg-white border border-gray-200 rounded-xl p-4'
            >
              <div className='h-4 bg-gray-200 rounded w-24 mb-2' />
              <div className='h-6 bg-gray-100 rounded w-16' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchData} />;
  }

  const currentFee = fees.find(fee => {
    let feeMonth: number;
    if (fee.bulan.includes('-')) feeMonth = parseInt(fee.bulan.split('-')[1]);
    else feeMonth = parseInt(fee.bulan);
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
