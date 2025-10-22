// src/services/authService.ts
import api from "../api/api";
import type { AxiosResponse } from "axios";
import type { User, LoginResponse, RegisterRequest } from "../types";
import { errorService } from "./error.service";

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post("/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      errorService.logApiError(error, "/login", "POST", { username });
      throw error;
    }
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      errorService.logApiError(error, "/register", "POST", { username: userData.username });
      throw error;
    }
  },

  getProfile: async (): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await api.get("/profile");
      return response.data;
    } catch (error) {
      errorService.logApiError(error, "/profile", "GET");
      throw error;
    }
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    try {
      const response: AxiosResponse<User> = await api.put("/profile", userData);
      return response.data;
    } catch (error) {
      errorService.logApiError(error, "/profile", "PUT", userData);
      throw error;
    }
  },
};
