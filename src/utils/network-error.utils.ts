export function getServiceDownMessage(error: any, fallback: string): string {
  // Offline detection
  const isOffline = typeof navigator !== 'undefined' && navigator && navigator.onLine === false;
  if (isOffline) {
    return 'Anda sedang offline. Periksa koneksi internet Anda.';
  }

  // Axios-like error without response indicates network/server down
  if (error && !error.response) {
    return 'Server tidak dapat dihubungi. Periksa koneksi atau status server.';
  }

  // HTTP 5xx
  const status = error?.response?.status;
  if (status && status >= 500) {
    return 'Layanan sedang bermasalah (5xx). Coba beberapa saat lagi.';
  }

  // Default to existing details or fallback
  return (
    error?.response?.data?.detail || error?.message || fallback
  );
}

export function isBackendUnavailable(error: any): boolean {
  const isOffline = typeof navigator !== 'undefined' && navigator && navigator.onLine === false;
  if (isOffline) return true;
  if (error && !error.response) return true;
  const status = error?.response?.status;
  return Boolean(status && status >= 500);
}

export function stripUrls(text: string | null | undefined): string {
  if (!text) return '';
  // Remove http(s)://... and bare domains
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi;
  return text.replace(urlRegex, '').trim();
}


