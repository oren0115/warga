// src/services/authService.ts
import api from "../api/api";
import type { AxiosResponse } from "axios";
import type { User, LoginResponse, RegisterRequest } from "../types";

export const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response: AxiosResponse<LoginResponse> = await api.post("/login", {
      username,
      password,
    });
    return response.data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const response: AxiosResponse<User> = await api.post("/register", userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get("/profile");
    return response.data;
  },

  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<User> = await api.put("/profile", userData);
    return response.data;
  },
};
