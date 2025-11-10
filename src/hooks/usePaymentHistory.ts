import { useCallback, useEffect, useMemo, useState } from 'react';
import { userService } from '../services/user.service';
import type { Payment } from '../types';
import { getServiceDownMessage } from '../utils/network-error.utils';
import { useToast } from '../context/toast.context';
import { useGlobalError } from '../context/global-error.context';
import { getToastDuration, isLightweightError } from '../utils/error-handling.utils';

export function usePaymentHistory() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sort, setSort] = useState<{
    key: 'date' | 'amount' | 'name';
    dir: 'asc' | 'desc';
  }>({ key: 'date', dir: 'desc' });
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const fetchPayments = useCallback(async () => {
    try {
      const paymentsData = await userService.getPayments();
      setPayments(paymentsData);
      setError(null);
    } catch (err: any) {
      const message = getServiceDownMessage(err, 'Gagal memuat data');
      setError(message);
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
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
  }, [fetchPayments]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPayments();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchPayments]);

  const handleNotificationRead = useCallback(() => {
    setNotificationRefreshKey(prev => prev + 1);
  }, []);

  const filterPayments = useCallback(
    (status: string) => {
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
            ['expire', 'kadaluarsa'].includes(p.status.toLowerCase())
          );
        default:
          return [];
      }
    },
    [payments]
  );

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
      const an = (a.user?.nama || '').localeCompare(b.user?.nama || '');
      return sort.dir === 'asc' ? an : -an;
    });
    return sorted;
  }, [selectedFilter, payments, sort, filterPayments]);

  const tabData = [
    { value: 'all', label: 'Semua' },
    { value: 'pending', label: 'Menunggu' },
    { value: 'success', label: 'Lunas' },
    { value: 'failed', label: 'Gagal' },
    { value: 'expired', label: 'Kadaluarsa' },
  ];

  const tabCounts = useMemo(() => {
    return tabData.reduce((acc, tab) => {
      acc[tab.value] = filterPayments(tab.value).length;
      return acc;
    }, {} as Record<string, number>);
  }, [filterPayments]);

  return {
    payments,
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
  };
}
