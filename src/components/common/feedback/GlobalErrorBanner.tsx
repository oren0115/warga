import { AlertTriangle, RefreshCw, WifiOff, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { isBackendUnavailable } from '../../../utils/network-error.utils';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';

interface GlobalErrorBannerProps {
  error: any;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

/**
 * Global error banner untuk menampilkan network/server down errors
 * di bagian atas halaman secara non-blocking
 */
export const GlobalErrorBanner: React.FC<GlobalErrorBannerProps> = ({
  error,
  onRetry,
  onDismiss,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error && isBackendUnavailable(error)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [error]);

  if (!isVisible || !error) return null;

  const isNetworkError = !error?.response;
  const isServerError = error?.response?.status >= 500;

  const getMessage = () => {
    if (isNetworkError) {
      return 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.';
    }
    if (isServerError) {
      return 'Server sedang mengalami masalah. Tim kami sedang memperbaikinya.';
    }
    return (
      error?.errorMapping?.userMessage ||
      error?.message ||
      'Terjadi kesalahan. Silakan coba lagi.'
    );
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleRetry = () => {
    onRetry?.();
  };

  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none ${className}`}
      role='alert'
      aria-live='assertive'
      aria-atomic='true'
    >
      <div className='pointer-events-auto w-[90vw] max-w-md sm:max-w-lg'>
        <Alert
          variant='destructive'
          className='rounded-lg border border-red-300 bg-white/95 shadow-xl backdrop-blur-sm'
        >
          <div className='flex items-start gap-3 p-3 md:p-4'>
            <div className='flex-shrink-0 mt-0.5'>
              {isNetworkError ? (
                <WifiOff className='w-5 h-5 text-red-600' aria-hidden='true' />
              ) : (
                <AlertTriangle
                  className='w-5 h-5 text-red-600'
                  aria-hidden='true'
                />
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <AlertDescription className='font-medium text-red-800 text-sm md:text-base leading-relaxed whitespace-nowrap overflow-hidden text-ellipsis'>
                {getMessage()}
              </AlertDescription>
            </div>
            <div className='flex items-center gap-2 flex-shrink-0'>
              {onRetry && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleRetry}
                  className='border-red-300 text-red-700 hover:bg-red-50'
                  aria-label='Coba lagi'
                >
                  <RefreshCw className='w-4 h-4 mr-1' aria-hidden='true' />
                  Coba Lagi
                </Button>
              )}
              {onDismiss && (
                <button
                  onClick={handleDismiss}
                  className='text-red-600/80 hover:text-red-700 transition-colors'
                  aria-label='Tutup notifikasi'
                >
                  <X className='w-4 h-4' aria-hidden='true' />
                </button>
              )}
            </div>
          </div>
        </Alert>
      </div>
    </div>
  );
};
