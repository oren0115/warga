// src/services/adminService.ts
import api from "../api/api";
import type { AxiosResponse } from "axios";
import type {
  User,
  Fee,
  Payment,
  DashboardStats,
  UnpaidUser,
  PaidUser,
  GenerateFeesRequest,
  BroadcastNotificationRequest,
  UsersWithPhoneResponse,
  TelegramTestResponse,
  BroadcastResponse,
} from "../types";

export const adminService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<DashboardStats> = await api.get(
      "/admin/dashboard"
    );
    return response.data;
  },

  getUnpaidUsers: async (bulan?: string): Promise<UnpaidUser[]> => {
    const params = bulan ? { bulan } : {};
    const response: AxiosResponse<UnpaidUser[]> = await api.get(
      "/admin/unpaid-users",
      { params }
    );
    return response.data;
  },

  getPaidUsers: async (bulan?: string): Promise<PaidUser[]> => {
    const params = bulan ? { bulan } : {};
    const response: AxiosResponse<PaidUser[]> = await api.get(
      "/admin/paid-users",
      { params }
    );
    return response.data;
  },

  getUsers: async (): Promise<User[]> => {
    const response: AxiosResponse<User[]> = await api.get("/admin/users");
    return response.data;
  },

  generateFees: async (data: GenerateFeesRequest): Promise<any> => {
    const response = await api.post("/admin/generate-fees", data);
    return response.data;
  },

  regenerateFees: async (data: GenerateFeesRequest): Promise<any> => {
    const response = await api.post("/admin/regenerate-fees", data);
    return response.data;
  },

  getAdminFees: async (): Promise<Fee[]> => {
    const response: AxiosResponse<Fee[]> = await api.get("/admin/fees");
    return response.data;
  },

  getAdminPayments: async (): Promise<Payment[]> => {
    const response: AxiosResponse<Payment[]> = await api.get("/admin/payments");
    return response.data;
  },

  getAdminPaymentsWithDetails: async (): Promise<Payment[]> => {
    const response: AxiosResponse<Payment[]> = await api.get(
      "/admin/payments/with-details"
    );
    return response.data;
  },

  // Export reports
  exportFeesReport: async (
    bulan: string,
    format: "excel" | "pdf" = "excel"
  ): Promise<Blob> => {
    const response = await api.get("/admin/reports/fees/export", {
      params: { bulan, format },
      responseType: "blob",
    });
    return response.data as Blob;
  },

  exportPaymentsReport: async (
    start: string, // YYYY-MM-DD
    end: string, // YYYY-MM-DD
    format: "excel" | "pdf" = "excel"
  ): Promise<Blob> => {
    const response = await api.get("/admin/reports/payments/export", {
      params: { start, end, format },
      responseType: "blob",
    });
    return response.data as Blob;
  },

  broadcastNotification: async (
    data: BroadcastNotificationRequest
  ): Promise<BroadcastResponse> => {
    const response = await api.post("/admin/notifications/broadcast", null, {
      params: {
        title: data.title,
        message: data.message,
        notification_type: data.notification_type || "pengumuman",
      },
    });
    return response.data;
  },

  // Telegram related services
  testTelegramConnection: async (): Promise<TelegramTestResponse> => {
    const response: AxiosResponse<TelegramTestResponse> = await api.get(
      "/admin/telegram/test"
    );
    return response.data;
  },

  getUsersWithPhone: async (): Promise<UsersWithPhoneResponse> => {
    const response: AxiosResponse<UsersWithPhoneResponse> = await api.get(
      "/admin/users/with-phone"
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
      "/admin/users",
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
};
