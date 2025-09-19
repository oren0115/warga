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
