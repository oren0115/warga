// src/services/adminService.ts
import type { AxiosResponse } from 'axios';
import api from '../api/api';
import type {
  BroadcastNotificationRequest,
  BroadcastResponse,
  DashboardStats,
  Fee,
  FeeVersion,
  GenerateFeesRequest,
  PaginatedUsers,
  PaidUser,
  Payment,
  RegenerationHistory,
  RollbackResponse,
  TelegramStatusResponse,
  TelegramTestResponse,
  UnpaidUser,
  User,
  UsersWithPhoneResponse,
} from '../types';

export const adminService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<DashboardStats> = await api.get(
      '/admin/dashboard'
    );
    return response.data;
  },

  getUnpaidUsers: async (bulan?: string): Promise<UnpaidUser[]> => {
    const params = bulan ? { bulan } : {};
    const response: AxiosResponse<UnpaidUser[]> = await api.get(
      '/admin/unpaid-users',
      { params }
    );
    return response.data;
  },

  getPaidUsers: async (bulan?: string): Promise<PaidUser[]> => {
    const params = bulan ? { bulan } : {};
    const response: AxiosResponse<PaidUser[]> = await api.get(
      '/admin/paid-users',
      { params }
    );
    return response.data;
  },

  getUsers: async (
    page: number = 1,
    pageSize: number = 25
  ): Promise<PaginatedUsers> => {
    const response: AxiosResponse<PaginatedUsers> = await api.get(
      '/admin/users',
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  },

  generateFees: async (data: GenerateFeesRequest): Promise<any> => {
    const response = await api.post('/admin/generate-fees', data);
    return response.data;
  },

  regenerateFees: async (data: GenerateFeesRequest): Promise<any> => {
    const response = await api.post('/admin/regenerate-fees', data);
    return response.data;
  },

  getAdminFees: async (
    page: number = 1,
    pageSize: number = 500
  ): Promise<Fee[]> => {
    const response: AxiosResponse<Fee[]> = await api.get('/admin/fees', {
      params: { page, page_size: pageSize },
    });
    return response.data;
  },

  getAdminPayments: async (
    page: number = 1,
    pageSize: number = 200
  ): Promise<Payment[]> => {
    const response: AxiosResponse<Payment[]> = await api.get(
      '/admin/payments',
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  },

  getAdminPaymentsWithDetails: async (
    page: number = 1,
    pageSize: number = 200
  ): Promise<Payment[]> => {
    const response: AxiosResponse<Payment[]> = await api.get(
      '/admin/payments/with-details',
      {
        params: { page, page_size: pageSize },
      }
    );
    return response.data;
  },

  // Export reports
  exportFeesReport: async (
    bulan: string,
    format: 'excel' | 'pdf' = 'excel'
  ): Promise<Blob> => {
    const response = await api.get('/admin/reports/fees/export', {
      params: { bulan, format },
      responseType: 'blob',
    });
    return response.data as Blob;
  },

  exportPaymentsReport: async (
    start: string, // YYYY-MM-DD
    end: string, // YYYY-MM-DD
    format: 'excel' | 'pdf' = 'excel'
  ): Promise<Blob> => {
    // 1) Buat job export async
    const createJobResp = await api.post(
      '/admin/reports/payments/export-async',
      null,
      {
        params: { start, end, format },
      }
    );
    const jobId = createJobResp.data?.job_id as string;

    if (!jobId) {
      throw new Error('Gagal membuat job export laporan pembayaran');
    }

    // 2) Polling sederhana sampai job selesai, lalu download file sebagai blob
    const maxAttempts = 20;
    const delayMs = 1000;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Cek status job (JSON)
      const statusResp = await api.get(
        `/admin/reports/payments/export-async/${jobId}`
      );

      // Jika backend sudah mengembalikan file, axios tidak akan otomatis parse JSON;
      // jadi kita cek berdasarkan content-type.
      const contentType = statusResp.headers['content-type'] || '';
      if (!contentType.includes('application/json')) {
        // Anggap ini sudah file; ulangi request khusus untuk download blob
        const downloadResp = await api.get<Blob>(
          `/admin/reports/payments/export-async/${jobId}`,
          { responseType: 'blob' }
        );
        return downloadResp.data;
      }

      const status = statusResp.data?.status as string | undefined;
      if (status === 'done') {
        const downloadResp = await api.get<Blob>(
          `/admin/reports/payments/export-async/${jobId}`,
          { responseType: 'blob' }
        );
        return downloadResp.data;
      }

      if (status === 'failed') {
        const detail =
          statusResp.data?.detail ||
          statusResp.data?.message ||
          'Job export gagal';
        throw new Error(detail);
      }

      // Jika masih pending/processing: tunggu lalu coba lagi
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    throw new Error(
      'Export laporan pembayaran timeout, silakan coba lagi dengan rentang tanggal lebih kecil.'
    );
  },

  broadcastNotification: async (
    data: BroadcastNotificationRequest
  ): Promise<BroadcastResponse> => {
    const response = await api.post('/admin/notifications/broadcast', null, {
      params: {
        title: data.title,
        message: data.message,
        notification_type: data.notification_type || 'pengumuman',
      },
    });
    return response.data;
  },

  // Telegram related services
  testTelegramConnection: async (): Promise<TelegramTestResponse> => {
    const response: AxiosResponse<TelegramTestResponse> = await api.get(
      '/admin/telegram/test'
    );
    return response.data;
  },

  getUsersWithPhone: async (): Promise<UsersWithPhoneResponse> => {
    const response: AxiosResponse<UsersWithPhoneResponse> = await api.get(
      '/admin/users/with-phone'
    );
    return response.data;
  },

  // User Management Operations
  createUser: async (userData: {
    username: string;
    nama: string;
    alamat: string;
    nomor_rumah: string;
    nomor_hp: string;
    password: string;
    is_admin?: boolean;
    tipe_rumah?: string;
  }): Promise<User> => {
    const response: AxiosResponse<User> = await api.post(
      '/admin/users',
      userData
    );
    return response.data;
  },

  updateUser: async (
    userId: string,
    userData: Partial<{
      username: string;
      nama: string;
      alamat: string;
      nomor_rumah: string;
      nomor_hp: string;
      is_admin: boolean;
      tipe_rumah: string;
      password?: string;
    }>
  ): Promise<User> => {
    const response: AxiosResponse<User> = await api.put(
      `/admin/users/${userId}`,
      userData
    );
    return response.data;
  },

  deleteUser: async (userId: string): Promise<void> => {
    await api.delete(`/admin/users/${userId}`);
  },

  promoteToAdmin: async (userId: string): Promise<User> => {
    const response: AxiosResponse<User> = await api.patch(
      `/admin/users/${userId}/promote`
    );
    return response.data;
  },

  demoteFromAdmin: async (userId: string): Promise<User> => {
    const response: AxiosResponse<User> = await api.patch(
      `/admin/users/${userId}/demote`
    );
    return response.data;
  },

  resetUserPassword: async (
    userId: string,
    newPassword: string
  ): Promise<void> => {
    await api.patch(`/admin/users/${userId}/reset-password`, {
      password: newPassword,
    });
  },

  // Regeneration History & Management
  getRegenerationHistory: async (
    bulan: string
  ): Promise<RegenerationHistory[]> => {
    const response: AxiosResponse<RegenerationHistory[]> = await api.get(
      `/admin/fees/regeneration-history/${bulan}`
    );
    return response.data;
  },

  getFeeVersions: async (feeId: string): Promise<FeeVersion[]> => {
    const response: AxiosResponse<FeeVersion[]> = await api.get(
      `/admin/fees/versions/${feeId}`
    );
    return response.data;
  },

  rollbackRegeneration: async (bulan: string): Promise<RollbackResponse> => {
    const response: AxiosResponse<RollbackResponse> = await api.post(
      `/admin/fees/rollback/${bulan}`
    );
    return response.data;
  },

  // Telegram Management
  getTelegramStatus: async (): Promise<TelegramStatusResponse> => {
    const response: AxiosResponse<TelegramStatusResponse> = await api.get(
      '/admin/users/telegram-status'
    );
    return response.data;
  },

  activateTelegram: async (
    userId: string,
    telegramChatId: string
  ): Promise<void> => {
    await api.patch(`/admin/users/${userId}/activate-telegram`, null, {
      params: { telegram_chat_id: telegramChatId },
    });
  },

  deactivateTelegram: async (userId: string): Promise<void> => {
    await api.patch(`/admin/users/${userId}/deactivate-telegram`);
  },
};
