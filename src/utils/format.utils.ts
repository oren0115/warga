// Utility functions for formatting data

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
};

export const formatDateShort = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
};

export const getMonthName = (monthNum: string): string => {
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  let month: number;
  if (monthNum.includes("-")) {
    // Format: "2025-09" -> extract month part
    month = parseInt(monthNum.split("-")[1]);
  } else {
    // Format: "9" -> direct parse
    month = parseInt(monthNum);
  }

  return months[month - 1] || monthNum;
};

export const getYearFromBulan = (bulan: string): string => {
  if (bulan.includes("-")) {
    return bulan.split("-")[0];
  }
  return getCurrentJakartaTime().getFullYear().toString();
};

export const getDaysUntilDueDate = (month: string): number => {
  const currentDate = getCurrentJakartaTime();
  let dueDate: Date;

  if (month.includes("-")) {
    // Format: "2025-09" -> extract year and month
    const [year, monthNum] = month.split("-");
    dueDate = new Date(parseInt(year), parseInt(monthNum), 0); // Last day of the month
  } else {
    // Format: "9" -> use current year
    const currentYear = currentDate.getFullYear();
    dueDate = new Date(currentYear, parseInt(month), 0); // Last day of the month
  }

  const timeDiff = dueDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
};

export const getDueDateFromBulan = (bulan: string): Date => {
  if (bulan.includes("-")) {
    const [year, month] = bulan.split("-");
    return new Date(parseInt(year), parseInt(month), 0);
  } else {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, parseInt(bulan), 0);
  }
};

// Get current time in Jakarta timezone
export const getCurrentJakartaTime = (): Date => {
  // Create a new date object with Jakarta timezone
  const now = new Date();
  const jakartaTimeString = now.toLocaleString("sv-SE", {
    timeZone: "Asia/Jakarta",
  });
  return new Date(jakartaTimeString);
};

// Convert any date to Jakarta timezone for consistent display
export const toJakartaTime = (dateString: string | Date): Date => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return new Date();
  }

  // Always return the date as-is since JavaScript Date handles UTC properly
  // The timezone conversion happens during formatting
  return date;
};

// Cache for formatted dates to prevent timezone drift
const dateFormatCache = new Map<string, string>();

// Clear cache when needed (e.g., when timezone changes)
export const clearDateFormatCache = () => {
  dateFormatCache.clear();
};

// Validate and fix timezone for payment data
export const validatePaymentTimezone = (payment: any) => {
  if (!payment) return payment;

  // Ensure settled_at and expiry_time are properly formatted
  if (payment.settled_at) {
    payment.settled_at = toJakartaTime(payment.settled_at).toISOString();
  }

  if (payment.expiry_time) {
    payment.expiry_time = toJakartaTime(payment.expiry_time).toISOString();
  }

  if (payment.created_at) {
    payment.created_at = toJakartaTime(payment.created_at).toISOString();
  }

  return payment;
};

// Format date with consistent Jakarta timezone - prevents timezone drift
export const formatDateConsistent = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  // Create cache key
  const cacheKey = `${dateString}_${JSON.stringify(options || {})}`;

  // Check cache first
  if (dateFormatCache.has(cacheKey)) {
    return dateFormatCache.get(cacheKey)!;
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };

  const formatted = new Date(dateString).toLocaleDateString("id-ID", {
    ...defaultOptions,
    ...options,
  });

  // Cache the result
  dateFormatCache.set(cacheKey, formatted);

  return formatted;
};

// Format date with Jakarta timezone for display
export const formatDateWithTimezone = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  };

  return new Date(dateString).toLocaleDateString("id-ID", {
    ...defaultOptions,
    ...options,
  });
};

// Format date with "pukul" format for Indonesian display
export const formatDateTimeWithPukul = (dateString: string): string => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };

  const formatted = date.toLocaleDateString("id-ID", options);
  // Replace time with "pukul" format
  return formatted.replace(/(\d{2}:\d{2})/, "pukul $1");
};

// Debug function to test timezone conversion
export const debugTimezoneConversion = (dateString: string): void => {
  console.log("=== Timezone Debug ===");
  console.log("Input dateString:", dateString);
  console.log(
    "Has timezone info:",
    dateString.includes("+") || dateString.includes("Z")
  );

  const date = new Date(dateString);
  console.log("Parsed date:", date);
  console.log("Date UTC string:", date.toUTCString());
  console.log("Date local string:", date.toLocaleString());
  console.log(
    "Date Jakarta string:",
    date.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })
  );

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  };

  const formatted = date.toLocaleDateString("id-ID", options);
  console.log("Formatted result:", formatted);
  console.log("========================");
};
