/**
 * Error message utilities untuk menampilkan pesan error yang user-friendly
 * tanpa menampilkan informasi teknis seperti URL/IP backend
 */

export interface ErrorMapping {
  statusCode: number;
  userMessage: string;
  technicalMessage?: string;
  category: 'network' | 'server' | 'client' | 'authentication' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  showRetry?: boolean;
  showContact?: boolean;
}

/**
 * Mapping error codes ke pesan yang user-friendly
 */
export const ERROR_MESSAGES: Record<string, ErrorMapping> = {
  // Network errors
  NETWORK_ERROR: {
    statusCode: 0,
    userMessage:
      'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    technicalMessage: 'Network connection failed',
    category: 'network',
    severity: 'high',
    showRetry: true,
    showContact: false,
  },
  TIMEOUT: {
    statusCode: 408,
    userMessage: 'Permintaan memakan waktu terlalu lama. Silakan coba lagi.',
    technicalMessage: 'Request timeout',
    category: 'network',
    severity: 'medium',
    showRetry: true,
    showContact: false,
  },

  // Server errors (5xx)
  SERVER_ERROR: {
    statusCode: 500,
    userMessage:
      'Terjadi kesalahan pada server. Tim kami sedang memperbaikinya.',
    technicalMessage: 'Internal server error',
    category: 'server',
    severity: 'critical',
    showRetry: true,
    showContact: true,
  },
  SERVICE_UNAVAILABLE: {
    statusCode: 503,
    userMessage: 'Layanan sedang dalam pemeliharaan. Silakan coba lagi nanti.',
    technicalMessage: 'Service unavailable',
    category: 'server',
    severity: 'high',
    showRetry: true,
    showContact: false,
  },
  BAD_GATEWAY: {
    statusCode: 502,
    userMessage:
      'Server sedang mengalami masalah. Silakan coba lagi dalam beberapa menit.',
    technicalMessage: 'Bad gateway',
    category: 'server',
    severity: 'high',
    showRetry: true,
    showContact: false,
  },

  // Client errors (4xx)
  UNAUTHORIZED: {
    statusCode: 401,
    userMessage: 'Sesi Anda telah berakhir. Silakan login kembali.',
    technicalMessage: 'Unauthorized access',
    category: 'authentication',
    severity: 'medium',
    showRetry: false,
    showContact: false,
  },
  FORBIDDEN: {
    statusCode: 403,
    userMessage: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    technicalMessage: 'Forbidden access',
    category: 'authentication',
    severity: 'medium',
    showRetry: false,
    showContact: false,
  },
  NOT_FOUND: {
    statusCode: 404,
    userMessage: 'Data yang Anda cari tidak ditemukan.',
    technicalMessage: 'Resource not found',
    category: 'client',
    severity: 'low',
    showRetry: false,
    showContact: false,
  },
  VALIDATION_ERROR: {
    statusCode: 422,
    userMessage:
      'Data yang Anda masukkan tidak valid. Periksa kembali form Anda.',
    technicalMessage: 'Validation failed',
    category: 'validation',
    severity: 'low',
    showRetry: false,
    showContact: false,
  },
  TOO_MANY_REQUESTS: {
    statusCode: 429,
    userMessage:
      'Terlalu banyak permintaan. Silakan tunggu sebentar sebelum mencoba lagi.',
    technicalMessage: 'Rate limit exceeded',
    category: 'client',
    severity: 'medium',
    showRetry: true,
    showContact: false,
  },

  // Database errors
  DATABASE_ERROR: {
    statusCode: 500,
    userMessage: 'Terjadi kesalahan pada database. Silakan coba lagi.',
    technicalMessage: 'Database connection error',
    category: 'server',
    severity: 'high',
    showRetry: true,
    showContact: true,
  },

  // Payment errors
  PAYMENT_FAILED: {
    statusCode: 400,
    userMessage:
      'Pembayaran gagal diproses. Silakan coba lagi atau gunakan metode pembayaran lain.',
    technicalMessage: 'Payment processing failed',
    category: 'client',
    severity: 'medium',
    showRetry: true,
    showContact: false,
  },
  PAYMENT_EXPIRED: {
    statusCode: 400,
    userMessage: 'Pembayaran telah kadaluarsa. Silakan buat pembayaran baru.',
    technicalMessage: 'Payment expired',
    category: 'client',
    severity: 'low',
    showRetry: false,
    showContact: false,
  },

  // Generic fallbacks
  UNKNOWN_ERROR: {
    statusCode: 0,
    userMessage: 'Terjadi kesalahan yang tidak diketahui. Silakan coba lagi.',
    technicalMessage: 'Unknown error occurred',
    category: 'client',
    severity: 'medium',
    showRetry: true,
    showContact: true,
  },
};

/**
 * Mendapatkan pesan error yang user-friendly berdasarkan error object
 */
export function getUserFriendlyError(error: any): ErrorMapping {
  // Jika error memiliki response (axios error)
  if (error?.response) {
    const status = error.response.status;
    const data = error.response.data;

    // Cek apakah ada pesan khusus dari backend
    if (data?.detail && typeof data.detail === 'string') {
      return {
        statusCode: status,
        userMessage: data.detail,
        technicalMessage: `HTTP ${status}: ${data.detail}`,
        category: getCategoryFromStatus(status),
        severity: getSeverityFromStatus(status),
        showRetry: status >= 500,
        showContact: status >= 500,
      };
    }

    // Mapping berdasarkan status code
    switch (status) {
      case 0:
        return ERROR_MESSAGES.NETWORK_ERROR;
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case 403:
        return ERROR_MESSAGES.FORBIDDEN;
      case 404:
        return ERROR_MESSAGES.NOT_FOUND;
      case 408:
        return ERROR_MESSAGES.TIMEOUT;
      case 422:
        return ERROR_MESSAGES.VALIDATION_ERROR;
      case 429:
        return ERROR_MESSAGES.TOO_MANY_REQUESTS;
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR;
      case 502:
        return ERROR_MESSAGES.BAD_GATEWAY;
      case 503:
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE;
      default:
        if (status >= 500) {
          return ERROR_MESSAGES.SERVER_ERROR;
        } else if (status >= 400) {
          return ERROR_MESSAGES.VALIDATION_ERROR;
        }
    }
  }

  // Jika error tidak memiliki response (network error, dll)
  if (
    error?.code === 'NETWORK_ERROR' ||
    error?.message?.includes('Network Error')
  ) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error?.code === 'TIMEOUT' || error?.message?.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT;
  }

  // Fallback ke unknown error
  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Mendapatkan kategori error berdasarkan status code
 */
function getCategoryFromStatus(
  status: number
): 'network' | 'server' | 'client' | 'authentication' | 'validation' {
  if (status === 0) return 'network';
  if (status >= 500) return 'server';
  if (status === 401 || status === 403) return 'authentication';
  if (status === 422) return 'validation';
  return 'client';
}

/**
 * Mendapatkan severity berdasarkan status code
 */
function getSeverityFromStatus(
  status: number
): 'low' | 'medium' | 'high' | 'critical' {
  if (status === 0) return 'high';
  if (status >= 500) return 'critical';
  if (status >= 400) return 'medium';
  return 'low';
}

/**
 * Membersihkan pesan error dari informasi teknis
 */
export function sanitizeErrorMessage(message: string): string {
  // Remove URLs, IPs, dan informasi teknis lainnya
  return message
    .replace(/https?:\/\/[^\s]+/g, '[URL]')
    .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
    .replace(/localhost:\d+/g, '[LOCALHOST]')
    .replace(/127\.0\.0\.1:\d+/g, '[LOCALHOST]')
    .replace(/api\/[^\s]+/g, '[API]')
    .replace(/\/api\/[^\s]+/g, '[API]')
    .replace(/Error: /g, '')
    .replace(/Exception: /g, '')
    .trim();
}

/**
 * Mendapatkan pesan error yang sudah dibersihkan
 */
export function getCleanErrorMessage(error: any): string {
  const errorMapping = getUserFriendlyError(error);
  return sanitizeErrorMessage(errorMapping.userMessage);
}

/**
 * Mendapatkan informasi lengkap error untuk logging
 */
export function getErrorInfo(error: any): {
  userMessage: string;
  technicalMessage: string;
  category: string;
  severity: string;
  showRetry: boolean;
  showContact: boolean;
  statusCode?: number;
} {
  const errorMapping = getUserFriendlyError(error);

  return {
    userMessage: errorMapping.userMessage,
    technicalMessage:
      errorMapping.technicalMessage || 'No technical details available',
    category: errorMapping.category,
    severity: errorMapping.severity,
    showRetry: errorMapping.showRetry || false,
    showContact: errorMapping.showContact || false,
    statusCode: errorMapping.statusCode,
  };
}
