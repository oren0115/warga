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
    const response: AxiosResponse<PaymentCreateResponse> = await api.post(
      "/payments",
      paymentData
    );
    return response.data;
  },

  getNotifications: async (): Promise<Notification[]> => {
    const response: AxiosResponse<Notification[]> = await api.get(
      "/notifications"
    );
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string): Promise<void> => {
    await api.put(`/notifications/${notificationId}/read`);
  },
};
