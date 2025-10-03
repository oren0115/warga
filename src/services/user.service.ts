// src/services/userService.ts
import api from "../api/api";
import type { AxiosResponse } from "axios";
import type {
  Fee,
  Payment,
  Notification,
  PaymentCreateRequest,
  PaymentCreateResponse,
  PaymentStatusResponse,
} from "../types";

// Helper untuk memastikan response berupa array
const normalizeArrayResponse = <T>(data: any, key: string): T[] => {
  return Array.isArray(data) ? data : data?.[key] || [];
};

export const userService = {
  // Ambil daftar iuran/fees
  getFees: async (): Promise<Fee[]> => {
    const response: AxiosResponse<any> = await api.get("/fees");
    return normalizeArrayResponse<Fee>(response.data, "fees");
  },

  // Ambil daftar pembayaran
  getPayments: async (): Promise<Payment[]> => {
    const response: AxiosResponse<any> = await api.get("/payments");
    return normalizeArrayResponse<Payment>(response.data, "payments");
  },

  // Buat pembayaran baru
  createPayment: async (
    paymentData: PaymentCreateRequest
  ): Promise<PaymentCreateResponse> => {
    const response: AxiosResponse<PaymentCreateResponse> = await api.post(
      "/payments",
      paymentData
    );

    return response.data;
  },

  // Ambil notifikasi user
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response: AxiosResponse<any> = await api.get("/notifications");
      return normalizeArrayResponse<Notification>(
        response.data,
        "notifications"
      );
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw new Error("Gagal memuat notifikasi");
    }
  },

  // Tandai notifikasi sudah dibaca
  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Gagal menandai notifikasi sebagai dibaca");
    }
  },

  // Cek status pembayaran
  checkPaymentStatus: async (
    paymentId: string
  ): Promise<PaymentStatusResponse> => {
    try {
      const response: AxiosResponse<PaymentStatusResponse> = await api.get(
        `/payments/check/${paymentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking payment status:", error);
      throw new Error("Gagal mengecek status pembayaran");
    }
  },

  // Paksa cek status pembayaran
  forceCheckPaymentStatus: async (
    paymentId: string
  ): Promise<
    PaymentStatusResponse & {
      updated: boolean;
      message?: string;
    }
  > => {
    try {
      const response: AxiosResponse<
        PaymentStatusResponse & {
          updated: boolean;
          message?: string;
        }
      > = await api.post(`/payments/force-check/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error("Error force checking payment status:", error);
      throw new Error("Gagal memaksa pengecekan status pembayaran");
    }
  },
};
