import { useCallback, useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import type {
  BroadcastNotificationRequest,
  BroadcastResponse,
  TelegramTestResponse,
  UserWithPhone,
} from '../types';
import { useToast } from '../context/toast.context';
import { useGlobalError } from '../context/global-error.context';
import { getToastDuration, isLightweightError } from '../utils/error-handling.utils';
import { logger } from '../utils/logger.utils';

export function useBroadcastNotifications() {
  const [formData, setFormData] = useState<BroadcastNotificationRequest>({
    title: '',
    message: '',
    notification_type: 'pengumuman',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [, setUsersWithPhone] = useState<UserWithPhone[]>([]);
  const [telegramStatus, setTelegramStatus] =
    useState<TelegramTestResponse | null>(null);
  const [, setIsLoadingUsers] = useState(false);
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [broadcastResult, setBroadcastResult] =
    useState<BroadcastResponse | null>(null);

  const { showError, showSuccess, showInfo } = useToast();
  const { setGlobalError } = useGlobalError();

  const loadUsersWithPhone = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const response = await adminService.getUsersWithPhone();
      setUsersWithPhone(response.users);
    } catch (err: any) {
      logger.error('Error loading users with phone:', err);
      const message = 'Gagal memuat daftar pengguna';
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsLoadingUsers(false);
    }
  }, [showError, setGlobalError]);

  const testTelegramConnection = useCallback(async () => {
    setIsTestingTelegram(true);
    try {
      const response = await adminService.testTelegramConnection();
      setTelegramStatus(response);
    } catch (err: any) {
      logger.error('Error testing Telegram connection:', err);
      const message =
        err?.errorMapping?.userMessage ||
        err?.message ||
        'Gagal menguji koneksi Telegram';
      setTelegramStatus({
        success: false,
        message,
      });
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsTestingTelegram(false);
    }
  }, [showError, setGlobalError]);

  useEffect(() => {
    loadUsersWithPhone();
    testTelegramConnection();
  }, [loadUsersWithPhone, testTelegramConnection]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(null);
      setMessage(null);
      setBroadcastResult(null);
      try {
        const response = await adminService.broadcastNotification(formData);
        setBroadcastResult(response);
        setMessage(response.message);
        showSuccess(response.message || 'Notifikasi berhasil dikirim');
        await loadUsersWithPhone();
        setFormData({
          title: '',
          message: '',
          notification_type: 'pengumuman',
        });
      } catch (err: any) {
        logger.error('Error broadcasting notification:', err);
        const message =
          err?.errorMapping?.userMessage ||
          err?.message ||
          'Gagal mengirim notifikasi';
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
    [formData, loadUsersWithPhone, showError, showSuccess, setGlobalError]
  );

  return {
    // data
    formData,
    setFormData,
    telegramStatus,
    broadcastResult,
    // ui
    isLoading,
    isTestingTelegram,
    message,
    error,
    // actions
    handleSubmit,
    testTelegramConnection,
  };
}
