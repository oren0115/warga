import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth.context';
import { adminService } from '../services/admin.service';
import type { DashboardStats } from '../types';
import { useRealtimeDashboard } from './useRealtimeDashboard';

export function useAdminDashboard() {
  const navigate = useNavigate();
  const { logout, authState } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [chartZoom, setChartZoom] = useState(1);

  const monthlyFees = stats?.monthlyFees || [];
  const paymentStatus = useMemo(
    () => [
      { name: 'Berhasil', value: stats?.approvedPayments || 0 },
      { name: 'Menunggu', value: stats?.pendingPayments || 0 },
      { name: 'Gagal', value: stats?.failedPayments || 0 },
    ],
    [stats]
  );

  useRealtimeDashboard({
    userId: authState.user?.id || null,
    token: authState.token,
    onDashboardUpdate: newStats => {
      if (newStats) setStats(newStats);
      else fetchDashboardData();
    },
  });

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await adminService.getDashboard();
      setStats(response);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage =
        err?.response?.data?.detail ||
        err?.message ||
        'Gagal memuat data dashboard';
      setError(errorMessage);
      // Optional: fallback demo data
      setStats(
        prev =>
          prev ?? {
            totalUsers: 0,
            totalFees: 0,
            pendingPayments: 0,
            approvedPayments: 0,
            failedPayments: 0,
            currentMonthCollection: 0,
            collectionRate: 0,
            unpaidFees: 0,
            monthlyFees: [],
          }
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const handleZoomIn = useCallback(
    () => setChartZoom(prev => Math.min(prev + 0.2, 2)),
    []
  );
  const handleZoomOut = useCallback(
    () => setChartZoom(prev => Math.max(prev - 0.2, 0.5)),
    []
  );
  const handleResetZoom = useCallback(() => setChartZoom(1), []);

  return {
    // data
    stats,
    monthlyFees,
    paymentStatus,
    // ui
    isLoading,
    error,
    chartZoom,
    // actions
    fetchDashboardData,
    handleLogout,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
  };
}
