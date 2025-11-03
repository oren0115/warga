import React from 'react';
import { userService } from '../../../services/user.service';

import { BarChart2, Clipboard } from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  FilterTabs,
  PageHeader,
  PageLayout,
  PaymentCard,
} from '../../../components/common';
import NotificationPopup from '../../../components/common/notification/NotificationPopup';
import { usePaymentHistory } from '../../../hooks/usePaymentHistory';

// Mapping status pembayaran

const PaymentHistory: React.FC = () => {
  const {
    isLoading,
    error,
    showNotificationPopup,
    setShowNotificationPopup,
    notificationRefreshKey,
    handleNotificationRead,
    selectedFilter,
    setSelectedFilter,
    sort,
    setSort,
    visiblePayments,
    tabData,
    tabCounts,
    fetchPayments,
  } = usePaymentHistory();

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 space-y-4'>
        <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 text-white'>
          <div className='h-6 bg-white/30 rounded w-52' />
          <div className='h-3 bg-white/20 rounded w-72 mt-2' />
        </div>
        <div className='h-9 bg-gray-200 rounded w-full' />
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className='bg-white border border-gray-200 rounded-xl p-4 space-y-3'
            >
              <div className='h-5 bg-gray-200 rounded w-32' />
              <div className='h-4 bg-gray-100 rounded w-24' />
              <div className='h-16 bg-gray-50 rounded' />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return <ErrorState message={error} onRetry={fetchPayments} />;
  }

  return (
    <PageLayout>
      {/* Header */}
      <PageHeader
        title='Riwayat Pembayaran'
        subtitle='Pantau semua transaksi pembayaran iuran IPL'
        icon={<BarChart2 className='w-5 h-5 md:w-6 md:h-6 text-white' />}
        showNotification={true}
        onNotificationClick={() => setShowNotificationPopup(true)}
        notificationRefreshKey={notificationRefreshKey}
      />

      {/* Filter dan Content */}
      <div className='p-4 space-y-6 -mt-2'>
        {/* Filter */}
        <FilterTabs
          tabs={tabData.map(tab => ({
            ...tab,
            count: tabCounts[tab.value],
          }))}
          activeTab={selectedFilter}
          onTabChange={setSelectedFilter}
          variant='select'
          onRefresh={fetchPayments}
          showCounts={true}
        />

        {/* Toolbar Sort */}
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='text-sm text-gray-600'>
            {visiblePayments.length.toLocaleString()} transaksi
          </div>
          <div className='flex items-center gap-2'>
            <select
              className='text-sm rounded-md ring-1 ring-gray-300 px-2 py-1 bg-white'
              value={sort.key}
              onChange={e =>
                setSort(s => ({ ...s, key: e.target.value as any }))
              }
            >
              <option value='date'>Tanggal</option>
              <option value='amount'>Nominal</option>
              <option value='name'>Nama</option>
            </select>
            <button
              className='text-sm px-2 py-1 rounded-md ring-1 ring-gray-300'
              onClick={() =>
                setSort(s => ({ ...s, dir: s.dir === 'asc' ? 'desc' : 'asc' }))
              }
            >
              {sort.dir === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {visiblePayments.length > 0 ? (
            visiblePayments.map(payment => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onRefresh={fetchPayments}
                onForceCheck={async paymentId => {
                  await userService.forceCheckPaymentStatus(paymentId);
                }}
              />
            ))
          ) : (
            <EmptyState
              icon={<Clipboard className='w-12 h-12 text-gray-300 mb-4' />}
              title='Belum ada data pembayaran'
              description='Belum ada data pembayaran untuk kategori ini'
              type='info'
            />
          )}
        </div>
      </div>

      {/* Popup Notifikasi */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={handleNotificationRead}
      />
    </PageLayout>
  );
};

export default PaymentHistory;
