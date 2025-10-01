// Utility functions for formatting data

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const jakartaDate = toJakartaTime(dateString);
  return jakartaDate.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (dateString: string): string => {
  const jakartaDate = toJakartaTime(dateString);
  return jakartaDate.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDateShort = (dateString: string): string => {
  const jakartaDate = toJakartaTime(dateString);
  return jakartaDate.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
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
  const now = new Date();
  // Get Jakarta time by adding 7 hours to UTC
  const jakartaOffset = 7 * 60; // Jakarta is UTC+7
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const jakartaTime = new Date(utcTime + jakartaOffset * 60000);
  return jakartaTime;
};

// Convert any date to Jakarta timezone for consistent display
export const toJakartaTime = (dateString: string | Date): Date => {
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return new Date();
  }

  // If the date already has timezone info, use it directly
  if (
    typeof dateString === "string" &&
    (dateString.includes("+") || dateString.includes("Z"))
  ) {
    return date;
  }

  // For dates without timezone info, assume they are in Jakarta timezone
  // and convert to proper Date object
  const jakartaOffset = 7 * 60; // Jakarta is UTC+7
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  const jakartaTime = new Date(utcTime + jakartaOffset * 60000);

  return jakartaTime;
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

  const jakartaDate = toJakartaTime(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatted = jakartaDate.toLocaleDateString("id-ID", {
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
