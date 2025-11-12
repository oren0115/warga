import React from 'react';
import { formatExpiryTime } from '../../../utils/fee.utils';

interface PendingPaymentAlertProps {
  expiryTime: string | null | undefined;
  countdownLabel: string | null;
}

export const PendingPaymentAlert: React.FC<PendingPaymentAlertProps> = ({
  expiryTime,
  countdownLabel,
}) => {
  const expiryLabel = expiryTime ? formatExpiryTime(expiryTime) : null;

  return (
    <div className='p-4 border border-amber-200 bg-amber-50 rounded-lg space-y-1'>
      <p className='text-sm text-amber-800 font-semibold'>
        Pembayaran sedang menunggu. Jangan tutup halaman Midtrans sampai
        selesai.
      </p>
      {expiryLabel && (
        <p className='text-xs text-amber-700'>
          Batas pembayaran: {expiryLabel}
        </p>
      )}
      {countdownLabel && (
        <p className='text-xs text-amber-700'>
          Sisa waktu sebelum kadaluarsa: {countdownLabel}
        </p>
      )}
    </div>
  );
};

