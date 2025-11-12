// src/api/api.ts
import axios, { AxiosError } from 'axios';
import { errorService } from '../services/error.service';
import { getUserFriendlyError } from '../utils/error-messages';
import { logger } from '../utils/logger.utils';

// Get API URL from environment
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Validate API URL configuration
if (import.meta.env.DEV) {
  logger.log('🔧 API Configuration:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    API_BASE_URL,
    NODE_ENV: import.meta.env.MODE,
  });

  if (!API_BASE_URL) {
    logger.warn(
      '⚠️  VITE_API_URL not set! Create .env file with VITE_API_URL=http://localhost:8000'
    );
  }
}

// Production check
if (import.meta.env.PROD && !API_BASE_URL) {
  console.error(
    '❌ PRODUCTION BUILD ERROR: VITE_API_URL is not set! ' +
    'Create .env.production file with production backend URL. ' +
    'See ENV-PRODUCTION-TEMPLATE.md for instructions.'
  );
  throw new Error('VITE_API_URL must be set for production builds');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Callback for handling logout on token expiration
let onUnauthorized: ((showMessage?: boolean) => void) | null = null;

// Function to set logout callback
export const setUnauthorizedCallback = (
  callback: (showMessage?: boolean) => void
) => {
  onUnauthorized = callback;
};

// Function to clear logout callback
export const clearUnauthorizedCallback = () => {
  onUnauthorized = null;
};

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

    // Handle authentication errors (Token expired or invalid)
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem('userToken');
      localStorage.removeItem('userInfo');

      // Call logout callback if set (to trigger auth context logout and redirect)
      if (onUnauthorized) {
        logger.warn('🔐 Token expired or unauthorized. Logging out user...');
        // Pass true to show toast message to user
        onUnauthorized(true);
      }
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
