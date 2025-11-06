// src/api/api.ts
import axios, { AxiosError } from 'axios';
import { errorService } from '../services/error.service';
import { getUserFriendlyError } from '../utils/error-messages';
import { logger } from '../utils/logger.utils';

// Get API URL from environment with proper fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Validate API URL in development
if (import.meta.env.DEV) {
  logger.log('🔧 API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_BASE_URL,
    NODE_ENV: import.meta.env.MODE,
  });

  // Warn if using default localhost
  if (API_BASE_URL === '' && !import.meta.env.VITE_API_URL) {
    logger.warn(
      '⚠️  Using default localhost:8000. Set VITE_API_URL in .env for production!'
    );
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    // Log request error
    errorService.logApiError(error, 'request', 'REQUEST', error.config);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  response => response,
  (error: AxiosError) => {
    // Log API error
    const endpoint = error.config?.url || 'unknown';
    const method = error.config?.method?.toUpperCase() || 'GET';
    errorService.logApiError(error, endpoint, method, error.config?.data);

    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');
    }

    // Transform error to user-friendly message
    const errorMapping = getUserFriendlyError(error);

    // Create a new error with sanitized message
    const sanitizedError = new Error(errorMapping.userMessage);
    (sanitizedError as any).originalError = error;
    (sanitizedError as any).errorMapping = errorMapping;
    (sanitizedError as any).statusCode = error.response?.status || 0;
    (sanitizedError as any).isAxiosError = true;

    return Promise.reject(sanitizedError);
  }
);

export default api;
