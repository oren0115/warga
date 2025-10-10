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
  const nowJakarta = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  // Convert UTC date to Jakarta timezone for comparison
  const thenJakarta = convertUTCToJakarta(dateString);

  const diffMs = thenJakarta.getTime() - nowJakarta.getTime();
  const minutes = Math.round(diffMs / 60000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  // Handle edge cases for very recent times
  if (Math.abs(minutes) < 1) {
    return "baru saja";
  }
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
  try {
    const utcDate = new Date(dateString);

    // Check if date is valid
    if (isNaN(utcDate.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Waktu tidak valid";
    }

    return utcDate.toLocaleString("id-ID", {
      timeZone: JAKARTA_TIMEZONE,
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting absolute time:", dateString, error);
    return "Waktu tidak valid";
  }
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

  // Check if date is valid
  if (isNaN(utcDate.getTime())) {
    console.error("Invalid date string:", utcDateString);
    return new Date();
  }

  // If the date string already includes timezone info, parse it correctly
  let utcTime: number;
  if (
    utcDateString.includes("Z") ||
    utcDateString.includes("+") ||
    utcDateString.includes("-")
  ) {
    // Date string already has timezone info, use as is
    utcTime = utcDate.getTime();
  } else {
    // Assume it's UTC if no timezone info
    utcTime = utcDate.getTime();
  }

  // Add 7 hours to convert UTC to Jakarta time (UTC+7)
  const jakartaTime = new Date(utcTime + 7 * 60 * 60 * 1000);
  return jakartaTime;
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
/**
 * Format time like Telegram notifications (Indonesian style)
 * @param dateString - Date string from backend (UTC)
 * @returns Formatted time string (e.g., "Hari ini 14:30", "Kemarin 09:15", "3 Okt 14:30")
 */
export const formatTelegramStyleTime = (dateString: string): string => {
  try {
    // Parse the UTC date string
    const utcDate: Date = new Date(dateString);

    // Check if date is valid
    if (isNaN(utcDate.getTime())) {
      console.error("Invalid date string:", dateString);
      return "Waktu tidak valid";
    }

    // Convert UTC to Jakarta time (UTC+7)
    const jakartaTime = convertUTCToJakarta(dateString);

    // Get current time in Jakarta timezone
    const now = new Date();
    const nowJakarta = new Date(now.getTime() + 7 * 60 * 60 * 1000);

    // Get date parts for comparison
    const nowDate = new Date(
      nowJakarta.getFullYear(),
      nowJakarta.getMonth(),
      nowJakarta.getDate()
    );
    const thenDate = new Date(
      jakartaTime.getFullYear(),
      jakartaTime.getMonth(),
      jakartaTime.getDate()
    );
    const yesterday = new Date(nowDate);
    yesterday.setDate(yesterday.getDate() - 1);

    // Format time in 24-hour format with proper padding
    const hours = jakartaTime.getHours().toString().padStart(2, "0");
    const minutes = jakartaTime.getMinutes().toString().padStart(2, "0");
    const timeString = `${hours}.${minutes}`;

    // Check if it's today
    if (thenDate.getTime() === nowDate.getTime()) {
      return `Hari ini ${timeString}`;
    }

    // Check if it's yesterday
    if (thenDate.getTime() === yesterday.getTime()) {
      return `Kemarin ${timeString}`;
    }

    // For other dates, show date and time
    const formattedDateString = jakartaTime.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
    });

    return `${formattedDateString} ${timeString}`;
  } catch (error) {
    console.error("Error formatting Telegram style time:", dateString, error);
    return "Waktu tidak valid";
  }
};
