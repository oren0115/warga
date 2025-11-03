import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { userService } from '../../../services/user.service';
import type { Payment } from '../../../types';

import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  Clipboard,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  EmptyState,
  ErrorState,
  FilterTabs,
  LoadingSpinner,
  PageHeader,
  PageLayout,
  PaymentCard,
} from '../../../components/common';
import NotificationPopup from '../../../components/common/notification/NotificationPopup';

// Mapping status pembayaran

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sort, setSort] = useState<{
    key: 'date' | 'amount' | 'name';
    dir: 'asc' | 'desc';
  }>({ key: 'date', dir: 'desc' });

  const fetchPayments = useCallback(async () => {
    try {
      const paymentsData = await userService.getPayments();
      setPayments(paymentsData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Gagal memuat data');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await fetchPayments();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Reduce auto-refresh frequency to prevent timezone drift
    const interval = setInterval(() => {
      fetchPayments();
    }, 30000); // Changed from 15s to 30s
    return () => clearInterval(interval);
  }, [fetchPayments]);

  const handleNotificationRead = () => {
    setNotificationRefreshKey(prev => prev + 1);
  };

  const filterPayments = (status: string) => {
    switch (status) {
      case 'all':
        return payments;
      case 'success':
        return payments.filter(p =>
          ['success', 'settlement'].includes(p.status.toLowerCase())
        );
      case 'pending':
        return payments.filter(p =>
          ['pending'].includes(p.status.toLowerCase())
        );
      case 'failed':
        return payments.filter(p =>
          ['failed', 'deny', 'cancel'].includes(p.status.toLowerCase())
        );
      case 'expired':
        return payments.filter(p =>
          ['expire'].includes(p.status.toLowerCase())
        );
      default:
        return [];
    }
  };

  const visiblePayments = useMemo(() => {
    const base = filterPayments(selectedFilter);
    const sorted = [...base].sort((a, b) => {
      if (sort.key === 'date') {
        const av = new Date(a.created_at).getTime();
        const bv = new Date(b.created_at).getTime();
        return sort.dir === 'asc' ? av - bv : bv - av;
      }
      if (sort.key === 'amount') {
        const av = a.amount || 0;
        const bv = b.amount || 0;
        return sort.dir === 'asc' ? av - bv : bv - av;
      }
      // name
      const an = (a.user?.nama || '').localeCompare(b.user?.nama || '');
      return sort.dir === 'asc' ? an : -an;
    });
    return sorted;
  }, [selectedFilter, payments, sort]);

  const tabData = [
    { value: 'all', label: 'Semua', icon: <Clipboard className='w-4 h-4' /> },
    {
      value: 'pending',
      label: 'Menunggu',
      icon: <Clock className='w-4 h-4' />,
    },
    {
      value: 'success',
      label: 'Lunas',
      icon: <CheckCircle className='w-4 h-4' />,
    },
    { value: 'failed', label: 'Gagal', icon: <XCircle className='w-4 h-4' /> },
    {
      value: 'expired',
      label: 'Kadaluarsa',
      icon: <AlertTriangle className='w-4 h-4' />,
    },
  ];

  const tabCounts = tabData.reduce((acc, tab) => {
    acc[tab.value] = filterPayments(tab.value).length;
    return acc;
  }, {} as Record<string, number>);

  // --- Loading State ---
  if (isLoading) {
    return <LoadingSpinner message='Memuat data...' />;
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
