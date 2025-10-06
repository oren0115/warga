// src/utils/timezone.utils.ts

/**
 * Utility functions for timezone handling
 * Ensures consistent timezone handling between backend (UTC/Jakarta) and frontend (Jakarta)
 */

export const JAKARTA_TIMEZONE = "Asia/Jakarta";
export const UTC_OFFSET_HOURS = 7;

/**
 * Convert a date string to Jakarta timezone
 * Backend sends UTC time, so we convert UTC to Jakarta
 */
export const toJakartaTime = (dateString: string): Date => {
  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error("Invalid date string:", dateString);
      return new Date();
    }

    // JavaScript Date automatically handles UTC to local timezone conversion
    // We just need to ensure it's treated as UTC and displayed in Jakarta timezone
    return date;
  } catch (error) {
    console.error("Error converting to Jakarta time:", dateString, error);
    return new Date();
  }
};

/**
 * Get current time in Jakarta timezone
 */
export const getCurrentJakartaTime = (): Date => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE }));
};

/**
 * Format relative time in Indonesian locale
 * @param dateString - Date string from backend (UTC)
 * @returns Formatted relative time string (e.g., "2 jam yang lalu")
 */
export const formatRelativeTime = (dateString: string): string => {
  const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });

  // Get current time in Jakarta timezone
  const now = new Date();
  const nowJakarta = new Date(now.toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE }));
  
  // Convert UTC date to Jakarta timezone for comparison
  const utcDate = new Date(dateString);
  const thenJakarta = new Date(utcDate.toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE }));

  const diffMs = thenJakarta.getTime() - nowJakarta.getTime();
  const minutes = Math.round(diffMs / 60000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }
  return rtf.format(days, "day");
};

/**
 * Format absolute time in Jakarta timezone
 * @param dateString - Date string from backend (UTC)
 * @returns Formatted absolute time string (e.g., "3 Okt 2024, 14:30")
 */
export const formatAbsoluteTime = (dateString: string): string => {
  const utcDate = new Date(dateString);
  return utcDate.toLocaleString("id-ID", {
    timeZone: JAKARTA_TIMEZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Check if a date string is in UTC format
 */
export const isUTCFormat = (dateString: string): boolean => {
  return (
    dateString.includes("Z") ||
    dateString.includes("+") ||
    dateString.includes("-") ||
    dateString.endsWith("UTC")
  );
};

/**
 * Convert UTC date string to Jakarta timezone
 */
export const convertUTCToJakarta = (utcDateString: string): Date => {
  const utcDate = new Date(utcDateString);
  return new Date(
    utcDate.toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE })
  );
};

/**
 * Get timezone offset in minutes for Jakarta
 */
export const getJakartaOffsetMinutes = (): number => {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const jakarta = new Date(
    utc.toLocaleString("en-US", { timeZone: JAKARTA_TIMEZONE })
  );
  return (jakarta.getTime() - utc.getTime()) / 60000;
};
