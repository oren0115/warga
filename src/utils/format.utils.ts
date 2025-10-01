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
  return new Date().getFullYear().toString();
};

export const getDaysUntilDueDate = (month: string): number => {
  const currentDate = new Date();
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
