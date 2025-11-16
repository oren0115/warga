import { Copy, ExternalLink, RefreshCw } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { formatCurrency } from '../../../utils/format.utils';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

export interface QrisPaymentInfo {
  orderId: string;
  amount: number;
  qrUrl?: string | null;
  qrString?: string | null;
  expiryTime?: string | null;
  deeplinkUrl?: string | null;
  mobileDeeplinkUrl?: string | null;
}

interface QrisPaymentDialogProps {
  open: boolean;
  data: QrisPaymentInfo | null;
  onClose: () => void;
  onForceCheck: () => Promise<void> | void;
  isChecking: boolean;
}

const QrisPaymentDialog: React.FC<QrisPaymentDialogProps> = ({
  open,
  data,
  onClose,
  onForceCheck,
  isChecking,
}) => {
  const [copied, setCopied] = useState(false);

  const expiryText = useMemo(() => {
    if (!data?.expiryTime) return null;
    const date = new Date(data.expiryTime);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  }, [data?.expiryTime]);

  const handleCopy = async () => {
    if (!data?.qrString) return;
    try {
      await navigator.clipboard.writeText(data.qrString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy QR string', err);
    }
  };

  const handleOpen = (url?: string | null) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener');
  };

  return (
    <Dialog open={open} onOpenChange={value => !value && onClose()}>
      <DialogContent className='w-[88vw] max-w-sm sm:max-w-md max-h-[80vh] overflow-y-auto p-4 sm:p-6'>
        <DialogHeader>
          <DialogTitle>Pembayaran QRIS</DialogTitle>
          <DialogDescription>
            Scan kode QR berikut menggunakan aplikasi keuangan pilihanmu
          </DialogDescription>
        </DialogHeader>

        {data && (
          <div className='space-y-4'>
            <div className='text-center space-y-1'>
              <p className='text-xs sm:text-sm text-gray-600'>
                Order ID: {data.orderId}
              </p>
              <p className='text-base sm:text-lg font-semibold text-gray-900'>
                {formatCurrency(data.amount)}
              </p>
              {expiryText && (
                <p className='text-[11px] sm:text-xs text-gray-500'>
                  Berlaku hingga {expiryText} WIB
                </p>
              )}
            </div>

            <div className='flex flex-col items-center gap-3'>
              {data.qrUrl ? (
                <img
                  src={data.qrUrl}
                  alt='QRIS Payment'
                  className='w-44 h-44 sm:w-56 sm:h-56 rounded-lg border border-gray-200 shadow-sm'
                />
              ) : (
                <div className='w-44 h-44 sm:w-56 sm:h-56 flex items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs sm:text-sm text-gray-500'>
                  QR tidak tersedia
                </div>
              )}
              {data.qrString && (
                <Button
                  type='button'
                  variant='outline'
                  className='flex items-center gap-2'
                  onClick={handleCopy}
                >
                  <Copy className='w-4 h-4' />
                  {copied ? 'Kode disalin' : 'Salin kode QR'}
                </Button>
              )}
            </div>

            <div className='rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs sm:text-sm text-emerald-900'>
              <p className='font-semibold'>Cara bayar:</p>
              <ol className='mt-1 list-decimal list-inside space-y-1 text-emerald-800'>
                <li>Buka aplikasi pembayaran yang mendukung QRIS.</li>
                <li>Gunakan fitur scan QR lalu arahkan ke kode di atas.</li>
                <li>Pastikan nominal sesuai kemudian selesaikan pembayaran.</li>
              </ol>
            </div>

            <div className='flex flex-wrap gap-2'>
              {data.deeplinkUrl && (
                <Button
                  type='button'
                  variant='outline'
                  className='flex items-center gap-2'
                  onClick={() => handleOpen(data.deeplinkUrl)}
                >
                  <ExternalLink className='w-4 h-4' />
                  Buka di aplikasi
                </Button>
              )}
              {data.qrUrl && (
                <Button
                  type='button'
                  variant='outline'
                  className='flex items-center gap-2'
                  onClick={() => handleOpen(data.qrUrl)}
                >
                  <ExternalLink className='w-4 h-4' />
                  Buka QR di tab baru
                </Button>
              )}
              <Button
                type='button'
                className='flex items-center gap-2'
                onClick={onForceCheck}
                disabled={isChecking}
              >
                <RefreshCw
                  className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`}
                />
                {isChecking ? 'Memeriksa...' : 'Cek status pembayaran'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QrisPaymentDialog;
