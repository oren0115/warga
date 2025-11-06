import { useCallback, useEffect, useMemo, useState } from 'react';
import { adminService } from '../services/admin.service';
import { websocketService } from '../services/websocket.service';
import type { PaidUser, UnpaidUser } from '../types';
import { getServiceDownMessage } from '../utils/network-error.utils';
import { useToast } from '../context/toast.context';
import { useGlobalError } from '../context/global-error.context';
import { getToastDuration, isLightweightError } from '../utils/error-handling.utils';
import { logger } from '../utils/logger.utils';

export type FilterType = 'all' | 'normal' | 'orphaned';

export interface AvailableMonthOption {
  value: string;
  label: string;
}

export function useAvailableMonths(lastN: number = 12): AvailableMonthOption[] {
  return useMemo(() => {
    const months: AvailableMonthOption[] = [];
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );
    for (let i = 0; i < lastN; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;
      const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const monthLabel = `${monthNames[date.getMonth()]} ${year}`;
      months.push({ value: monthStr, label: monthLabel });
    }
    return months;
  }, [lastN]);
}

export function useUserPaymentStatus() {
  const [paidUsers, setPaidUsers] = useState<PaidUser[]>([]);
  const [unpaidUsers, setUnpaidUsers] = useState<UnpaidUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const months = useAvailableMonths(12);

  useEffect(() => {
    if (months.length > 0) {
      setSelectedMonth(months[0].value);
    }
  }, [months]);

  const fetchUsers = useCallback(
    async (month?: string) => {
      const targetMonth = month ?? selectedMonth;
      if (!targetMonth) return;
      setIsLoading(true);
      setError('');
      try {
        const [paidResponse, unpaidResponse] = await Promise.all([
          adminService.getPaidUsers(targetMonth),
          adminService.getUnpaidUsers(targetMonth),
        ]);
        setPaidUsers(paidResponse);
        setUnpaidUsers(unpaidResponse);
      } catch (err: any) {
        logger.error('Error fetching users:', err);
        const message = getServiceDownMessage(
          err,
          'Gagal memuat data pembayaran warga'
        );
        setError(message);
        if (isLightweightError(err)) {
          showError(message, getToastDuration(err));
        } else {
          setGlobalError(err);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [selectedMonth]
  );

  useEffect(() => {
    if (selectedMonth) {
      fetchUsers();
    }
  }, [selectedMonth, fetchUsers]);

  useEffect(() => {
    const handleDashboardUpdate = () => {
      if (selectedMonth) {
        fetchUsers();
      }
    };
    websocketService.onDashboardUpdate(handleDashboardUpdate);
    return () => {
      // websocketService cleans up internally
    };
  }, [selectedMonth, fetchUsers]);

  const filtered = useMemo(() => {
    let filteredPaid = paidUsers;
    let filteredUnpaid = unpaidUsers;
    switch (filter) {
      case 'normal':
        filteredPaid = paidUsers.filter(u => !u.is_orphaned);
        filteredUnpaid = unpaidUsers.filter(u => !u.is_orphaned);
        break;
      case 'orphaned':
        filteredPaid = paidUsers.filter(u => u.is_orphaned);
        filteredUnpaid = unpaidUsers.filter(u => u.is_orphaned);
        break;
      case 'all':
      default:
        break;
    }
    return { filteredPaid, filteredUnpaid };
  }, [paidUsers, unpaidUsers, filter]);

  return {
    // data
    paidUsers,
    unpaidUsers,
    filteredPaidUsers: filtered.filteredPaid,
    filteredUnpaidUsers: filtered.filteredUnpaid,
    // ui state
    isLoading,
    error,
    // filters
    filter,
    setFilter,
    months,
    selectedMonth,
    setSelectedMonth,
    // actions
    fetchUsers,
  };
}
