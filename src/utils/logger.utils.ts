/**
 * Utility untuk logging yang aman
 * Menghindari console.log di production untuk security
 */

const isDevelopment =
  import.meta.env.DEV || import.meta.env.MODE === 'development';

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // Error selalu di-log untuk debugging, tapi bisa di-filter di production
    if (isDevelopment) {
      console.error(...args);
    } else {
      // Di production, bisa kirim ke error tracking service
      // Contoh: Sentry, LogRocket, dll
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },
};
