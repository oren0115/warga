import { useCallback, useEffect, useState } from 'react';
import { adminService } from '../services/admin.service';
import type {
  BroadcastNotificationRequest,
  BroadcastResponse,
  TelegramTestResponse,
  UserWithPhone,
} from '../types';

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

  const loadUsersWithPhone = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const response = await adminService.getUsersWithPhone();
      setUsersWithPhone(response.users);
    } catch (e) {
      console.error('Error loading users with phone:', e);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const testTelegramConnection = useCallback(async () => {
    setIsTestingTelegram(true);
    try {
      const response = await adminService.testTelegramConnection();
      setTelegramStatus(response);
    } catch (e) {
      console.error('Error testing Telegram connection:', e);
      setTelegramStatus({
        success: false,
        message: 'Gagal menguji koneksi Telegram',
      });
    } finally {
      setIsTestingTelegram(false);
    }
  }, []);

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
        await loadUsersWithPhone();
        setFormData({
          title: '',
          message: '',
          notification_type: 'pengumuman',
        });
      } catch (e) {
        console.error('Error broadcasting notification:', e);
        setError('Gagal mengirim notifikasi');
      } finally {
        setIsLoading(false);
      }
    },
    [formData, loadUsersWithPhone]
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
