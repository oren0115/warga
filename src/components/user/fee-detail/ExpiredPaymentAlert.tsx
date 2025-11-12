import { AlertCircle } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';

interface ExpiredPaymentAlertProps {
  lastPaymentMethodLabel: string | null;
  isProcessing: boolean;
  onRetry: () => void;
}

export const ExpiredPaymentAlert: React.FC<ExpiredPaymentAlertProps> = ({
  lastPaymentMethodLabel,
  isProcessing,
  onRetry,
}) => {
  return (
    <div className='p-4 border border-red-200 bg-red-50 rounded-lg space-y-3'>
      <div className='flex items-start gap-3'>
        <AlertCircle className='w-5 h-5 text-red-500 mt-0.5' />
        <div>
          <p className='text-sm text-red-700 font-semibold'>
            Waktu pembayaran telah habis. Silakan lakukan pembayaran ulang.
          </p>
          {lastPaymentMethodLabel && (
            <p className='text-xs text-red-600'>
              Metode sebelumnya: {lastPaymentMethodLabel}
            </p>
          )}
        </div>
      </div>
      <div className='flex flex-col sm:flex-row gap-2'>
        <Button
          onClick={onRetry}
          disabled={isProcessing}
          className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200'
        >
          {isProcessing ? 'Memproses...' : 'Gunakan Metode Sebelumnya'}
        </Button>
      </div>
    </div>
  );
};

