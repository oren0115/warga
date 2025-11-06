import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/auth.context';
import { useError } from '../context/error.context';
import { userService } from '../services/user.service';
import type { Fee, Notification } from '../types';
import { getServiceDownMessage } from '../utils/network-error.utils';
import { useToast } from '../context/toast.context';
import { useGlobalError } from '../context/global-error.context';
import { getToastDuration, isLightweightError } from '../utils/error-handling.utils';

export function useUserHome() {
  const { authState } = useAuth();
  const { logUserAction } = useError();
  const [fees, setFees] = useState<Fee[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const fetchData = useCallback(async () => {
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
    } catch (err: any) {
      const errorMessage =
        err?.errorMapping?.userMessage ||
        getServiceDownMessage(err, 'Gagal memuat data. Silakan coba lagi.');
      setError(errorMessage);
      if (isLightweightError(err)) {
        showError(errorMessage, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
      logUserAction(
        'home_data_fetch_error',
        { error: err instanceof Error ? err.message : String(err) },
        'high'
      );
    } finally {
      setIsLoading(false);
    }
  }, [logUserAction]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return {
    // auth
    authState,
    // data
    fees,
    notifications,
    currentFee,
    // ui
    isLoading,
    error,
    showNotificationPopup,
    setShowNotificationPopup,
    notificationRefreshKey,
    setNotificationRefreshKey,
    // actions
    fetchData,
  };
}
