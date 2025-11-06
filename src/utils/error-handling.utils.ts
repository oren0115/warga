import { getUserFriendlyError } from './error-messages';
import { isBackendUnavailable } from './network-error.utils';

/**
 * Menentukan apakah error termasuk error ringan yang bisa ditampilkan via toast
 * atau error kritis yang perlu banner
 */
export function isLightweightError(error: any): boolean {
  if (!error) return false;

  const errorMapping = getUserFriendlyError(error);
  const category = errorMapping.category;
  const severity = errorMapping.severity;

  // Error ringan: network timeout, validation, rate limit
  if (
    category === 'network' ||
    category === 'validation' ||
    errorMapping.statusCode === 408 || // Timeout
    errorMapping.statusCode === 429 // Rate limit
  ) {
    return true;
  }

  // Error kritis: server down, database error, critical issues
  if (
    severity === 'critical' ||
    category === 'server' ||
    isBackendUnavailable(error)
  ) {
    return false; // Perlu banner
  }

  // Default: error ringan untuk 4xx (kecuali auth)
  if (errorMapping.statusCode >= 400 && errorMapping.statusCode < 500) {
    return true;
  }

  return false;
}

/**
 * Menentukan durasi toast berdasarkan severity error
 */
export function getToastDuration(error: any): number {
  const errorMapping = getUserFriendlyError(error);
  
  switch (errorMapping.severity) {
    case 'critical':
      return 8000; // 8 detik untuk critical
    case 'high':
      return 6000; // 6 detik untuk high
    case 'medium':
      return 5000; // 5 detik untuk medium (default)
    case 'low':
      return 4000; // 4 detik untuk low
    default:
      return 5000;
  }
}

