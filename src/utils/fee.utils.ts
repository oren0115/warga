import type { VariantProps } from 'class-variance-authority';
import { badgeVariants } from '../components/ui/badge';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

/**
 * Format date to Indonesian locale
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
};

/**
 * Format month number to Indonesian month name
 * Supports formats: "9" or "2025-09"
 */
export const formatMonth = (bulan: string): string => {
  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  let month: number;
  if (bulan.includes('-')) {
    // Format: "2025-09" -> extract month part
    month = parseInt(bulan.split('-')[1]);
  } else {
    // Format: "9" -> direct parse
    month = parseInt(bulan);
  }

  return months[month - 1] || bulan;
};

/**
 * Extract year from bulan string
 * Returns current year if not in format "YYYY-MM"
 */
export const getYearFromBulan = (bulan: string): string => {
  if (bulan.includes('-')) {
    return bulan.split('-')[0];
  }
  return new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  )
    .getFullYear()
    .toString();
};

/**
 * Calculate due date from bulan string
 */
export const getDueDateFromBulan = (bulan: string): Date => {
  if (bulan.includes('-')) {
    const [year, month] = bulan.split('-');
    return new Date(parseInt(year), parseInt(month), 0);
  }

  const currentYear = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  ).getFullYear();
  return new Date(currentYear, parseInt(bulan), 0);
};

/**
 * Get badge variant based on status
 */
export const getStatusVariant = (status: string): BadgeVariant => {
  const normalized = status.toLowerCase();
  
  switch (normalized) {
    case 'lunas':
      return 'default';
    case 'pending':
      return 'outline';
    case 'belum bayar':
    case 'failed':
    case 'gagal':
    case 'kadaluarsa':
    case 'expired':
    case 'expire':
      return 'destructive';
    default:
      return 'secondary';
  }
};

/**
 * Format countdown timer (milliseconds to HH:MM:SS)
 */
export const formatCountdown = (milliseconds: number): string => {
  const remaining = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(remaining / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((remaining % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(remaining % 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

/**
 * Format expiry time to Indonesian locale
 */
export const formatExpiryTime = (expiryTime: string): string => {
  return new Date(expiryTime).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  });
};

