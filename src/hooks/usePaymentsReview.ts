import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGlobalError } from '../context/global-error.context';
import { useToast } from '../context/toast.context';
import { adminService } from '../services/admin.service';
import type { Payment } from '../types';
import {
  getToastDuration,
  isLightweightError,
} from '../utils/error-handling.utils';
import { getServiceDownMessage } from '../utils/network-error.utils';

export type DateRange = 'today' | 'week' | 'month' | 'all';
export type StatusFilter = 'all' | 'pending' | 'success' | 'failed';

export interface PaymentStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  todayTotal: number;
  thisMonthTotal: number;
  successRate: number;
  totalRevenue: string;
}

export function usePaymentsReview() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<StatusFilter>('all');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Ambil dari server dengan batasan wajar (server-side pagination)
      const paymentsData = await adminService.getAdminPaymentsWithDetails(1, 200);
      setPayments(paymentsData || []);
    } catch (err: any) {
      const message = getServiceDownMessage(
        err,
        'Gagal memuat data pembayaran'
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
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    await fetchPayments();
    setIsRefreshing(false);
  }, [fetchPayments]);

  const getDateRangeFilter = useCallback(() => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (dateRange === 'today')
      return (p: Payment) => new Date(p.created_at) >= today;
    if (dateRange === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return (p: Payment) => new Date(p.created_at) >= weekAgo;
    }
    if (dateRange === 'month') {
      const monthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      return (p: Payment) => new Date(p.created_at) >= monthAgo;
    }
    return () => true;
  }, [dateRange]);

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      let statusMatch = true;
      const s = payment.status;
      if (filter === 'pending') statusMatch = s === 'Pending';
      else if (filter === 'success')
        statusMatch = s === 'Settlement' || s === 'Success';
      else if (filter === 'failed')
        statusMatch = ['Deny', 'Cancel', 'Expire', 'Failed'].includes(s);

      const methodValue = (
        payment.payment_type ||
        payment.payment_method ||
        ''
      ).toLowerCase();
      const searchMatch =
        searchTerm === '' ||
        methodValue.includes(searchTerm.toLowerCase()) ||
        payment.transaction_id
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        payment.amount.toString().includes(searchTerm);

      const dateMatch = getDateRangeFilter()(payment);
      return statusMatch && searchMatch && dateMatch;
    });
  }, [payments, filter, searchTerm, getDateRangeFilter]);

  const totalPages = useMemo(
    () => Math.ceil(filteredPayments.length / itemsPerPage) || 1,
    [filteredPayments.length, itemsPerPage]
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = useMemo(
    () => filteredPayments.slice(startIndex, startIndex + itemsPerPage),
    [filteredPayments, startIndex, itemsPerPage]
  );

  const formatCurrencyShort = (amount: number): string => {
    if (amount >= 1_000_000_000)
      return (
        'Rp ' + (amount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + ' M'
      );
    if (amount >= 1_000_000)
      return (
        'Rp ' + (amount / 1_000_000).toFixed(1).replace(/\.0$/, '') + ' Jt'
      );
    if (amount >= 1_000)
      return 'Rp ' + (amount / 1_000).toFixed(1).replace(/\.0$/, '') + ' Rb';
    return 'Rp ' + amount.toString();
  };

  const stats: PaymentStats = useMemo(() => {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayPayments = payments.filter(p => new Date(p.created_at) >= today);
    const monthPayments = payments.filter(
      p => new Date(p.created_at) >= thisMonth
    );
    const successPayments = payments.filter(
      p => p.status === 'Settlement' || p.status === 'Success'
    );
    return {
      total: payments.length,
      pending: payments.filter(p => p.status === 'Pending').length,
      success: successPayments.length,
      failed: payments.filter(p =>
        ['Deny', 'Cancel', 'Expire', 'Failed'].includes(p.status)
      ).length,
      todayTotal: todayPayments.length,
      thisMonthTotal: monthPayments.length,
      successRate:
        payments.length > 0
          ? Math.round((successPayments.length / payments.length) * 100)
          : 0,
      totalRevenue: formatCurrencyShort(
        successPayments.reduce((sum, p) => sum + p.amount, 0)
      ),
    };
  }, [payments]);

  const handleExport = useCallback(
    async (startDate: string, endDate: string, format: 'excel' | 'pdf') => {
      const s = new Date(startDate);
      const e = new Date(endDate);
      if (
        !startDate ||
        !endDate ||
        isNaN(s.getTime()) ||
        isNaN(e.getTime()) ||
        s > e
      ) {
        throw new Error('Rentang tanggal tidak valid');
      }
      try {
        const blob = await adminService.exportPaymentsReport(
          startDate,
          endDate,
          format
        );
        return blob;
      } catch (err: any) {
        // Tangani khusus error batas rentang / jumlah data dari backend
        const backendMessage: string =
          err?.errorMapping?.userMessage ||
          err?.message ||
          'Gagal mengekspor laporan pembayaran';
        // Bubble up error yang sudah diperkaya supaya caller bisa tampilkan toast/modal
        throw new Error(backendMessage);
      }
    },
    []
  );

  return {
    // data
    payments,
    filteredPayments,
    paginatedPayments,
    stats,
    // ui state
    isLoading,
    isRefreshing,
    error,
    // filters/pagination
    filter,
    setFilter,
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    // actions
    fetchPayments,
    handleRefresh,
    handleExport,
  };
}
