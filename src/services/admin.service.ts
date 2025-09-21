// src/services/adminService.ts
import api from "../api/api";
import type { AxiosResponse } from "axios";
import type {
  User,
  Fee,
  Payment,
  DashboardStats,
  GenerateFeesRequest,
  BroadcastNotificationRequest,
} from "../types";

export const adminService = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<DashboardStats> = await api.get(
      "/admin/dashboard"
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

  getAdminFees: async (): Promise<Fee[]> => {
    const response: AxiosResponse<Fee[]> = await api.get("/admin/fees");
    return response.data;
  },

  getAdminPayments: async (): Promise<Payment[]> => {
    const response: AxiosResponse<Payment[]> = await api.get("/admin/payments");
    return response.data;
  },

  // Export reports
  exportFeesReport: async (
    bulan: string,
    format: "excel" | "pdf" = "excel"
  ): Promise<Blob> => {
    const response = await api.get(
      "/admin/reports/fees/export",
      {
        params: { bulan, format },
        responseType: "blob",
      }
    );
    return response.data as Blob;
  },

  exportPaymentsReport: async (
    start: string, // YYYY-MM-DD
    end: string, // YYYY-MM-DD
    format: "excel" | "pdf" = "excel"
  ): Promise<Blob> => {
    const response = await api.get(
      "/admin/reports/payments/export",
      {
        params: { start, end, format },
        responseType: "blob",
      }
    );
    return response.data as Blob;
  },

  broadcastNotification: async (
    data: BroadcastNotificationRequest
  ): Promise<any> => {
    const response = await api.post("/admin/notifications/broadcast", null, {
      params: {
        title: data.title,
        message: data.message,
        notification_type: data.notification_type || "pengumuman",
      },
    });
    return response.data;
  },
};
