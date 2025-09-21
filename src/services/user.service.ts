// src/services/userService.ts
import api from "../api/api";
import type { AxiosResponse } from "axios";
import type {
  Fee,
  Payment,
  Notification,
  PaymentCreateRequest,
  PaymentCreateResponse,
} from "../types";

export const userService = {
  getFees: async (): Promise<Fee[]> => {
    const response: AxiosResponse<Fee[]> = await api.get("/fees");
    return response.data;
  },

  getPayments: async (): Promise<Payment[]> => {
    const response: AxiosResponse<Payment[]> = await api.get("/payments");
    return response.data;
  },

  createPayment: async (
    paymentData: PaymentCreateRequest
  ): Promise<PaymentCreateResponse> => {
    console.log("API Base URL:", api.defaults.baseURL);
    console.log("Sending payment request to:", "/payments");
    console.log("Request data:", paymentData);
    
    const response: AxiosResponse<PaymentCreateResponse> = await api.post(
      "/payments",
      paymentData
    );
    
    console.log("Payment API response:", response.data);
    return response.data;
  },

  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response: AxiosResponse<Notification[]> = await api.get(
        "/notifications"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Gagal memuat notifikasi");
    }
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Gagal menandai notifikasi sebagai dibaca");
    }
  },
};
