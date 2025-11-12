import { AlertTriangle, Phone, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import React from 'react';
import { getErrorInfo } from '../../../utils/error-messages';
import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface ErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  onContact?: () => void;
  title?: string;
  className?: string;
  showTechnicalDetails?: boolean;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onContact,
  title = 'Terjadi Kesalahan',
  className = '',
  showTechnicalDetails = false,
}) => {
  const errorInfo = getErrorInfo(error);
  const isNetworkError = errorInfo.category === 'network';
  const isServerError = errorInfo.category === 'server';
  const isAuthError = errorInfo.category === 'authentication';

  const getIcon = () => {
    if (isNetworkError) {
      return <WifiOff className='w-8 h-8 text-red-500' />;
    }
    if (isServerError) {
      return <AlertTriangle className='w-8 h-8 text-orange-500' />;
    }
    return <AlertTriangle className='w-8 h-8 text-red-500' />;
  };

  const getBackgroundColor = () => {
    if (isNetworkError) return 'bg-blue-50 border-blue-200';
    if (isServerError) return 'bg-orange-50 border-orange-200';
    if (isAuthError) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getTextColor = () => {
    if (isNetworkError) return 'text-blue-800';
    if (isServerError) return 'text-orange-800';
    if (isAuthError) return 'text-yellow-800';
    return 'text-red-800';
  };

  return (
    <div className={`w-full max-w-2xl mx-auto p-4 ${className}`}>
      <Card className={`${getBackgroundColor()} border-2`}>
        <CardHeader className='text-center pb-4'>
          <div className='flex justify-center mb-4'>{getIcon()}</div>
          <CardTitle className={`text-xl font-bold ${getTextColor()}`}>
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className='space-y-4'>
          {/* Main error message */}
          <Alert className={`${getBackgroundColor()} border-0`}>
            <AlertTriangle className='h-4 w-4' />
            <AlertDescription className={`${getTextColor()} font-medium`}>
              {errorInfo.userMessage}
            </AlertDescription>
          </Alert>

          {/* Network-specific guidance */}
          {isNetworkError && (
            <div className='bg-blue-100 border border-blue-300 rounded-lg p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <Wifi className='w-4 h-4 text-blue-600' />
                <span className='font-medium text-blue-800'>Tips Koneksi</span>
              </div>
              <ul className='text-sm text-blue-700 space-y-1'>
                <li>• Periksa koneksi internet Anda</li>
                <li>• Pastikan WiFi atau data seluler aktif</li>
                <li>• Coba refresh halaman</li>
                <li>• Jika masalah berlanjut, coba lagi nanti</li>
              </ul>
            </div>
          )}

          {/* Server error guidance */}
          {isServerError && (
            <div className='bg-orange-100 border border-orange-300 rounded-lg p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertTriangle className='w-4 h-4 text-orange-600' />
                <span className='font-medium text-orange-800'>
                  Informasi Server
                </span>
              </div>
              <p className='text-sm text-orange-700'>
                Tim kami telah diberitahu tentang masalah ini dan sedang
                memperbaikinya. Silakan coba lagi dalam beberapa menit.
              </p>
            </div>
          )}

          {/* Authentication error guidance */}
          {isAuthError && (
            <div className='bg-yellow-100 border border-yellow-300 rounded-lg p-4'>
              <div className='flex items-center gap-2 mb-2'>
                <AlertTriangle className='w-4 h-4 text-yellow-600' />
                <span className='font-medium text-yellow-800'>
                  Sesi Berakhir
                </span>
              </div>
              <p className='text-sm text-yellow-700'>
                Sesi Anda telah berakhir. Silakan login kembali untuk
                melanjutkan.
              </p>
            </div>
          )}

          {/* Technical details (only in development or when explicitly requested) */}
          {showTechnicalDetails && process.env.NODE_ENV === 'development' && (
            <details className='bg-gray-100 border border-gray-300 rounded-lg p-4'>
              <summary className='cursor-pointer font-medium text-gray-700 mb-2'>
                Detail Teknis (Development Only)
              </summary>
              <div className='text-xs text-gray-600 space-y-1'>
                <p>
                  <strong>Status Code:</strong> {errorInfo.statusCode || 'N/A'}
                </p>
                <p>
                  <strong>Category:</strong> {errorInfo.category}
                </p>
                <p>
                  <strong>Severity:</strong> {errorInfo.severity}
                </p>
                <p>
                  <strong>Technical Message:</strong>{' '}
                  {errorInfo.technicalMessage}
                </p>
                {error?.originalError && (
                  <p>
                    <strong>Original Error:</strong>{' '}
                    {error.originalError.message}
                  </p>
                )}
              </div>
            </details>
          )}

          {/* Action buttons */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4'>
            {errorInfo.showRetry && onRetry && (
              <Button
                onClick={onRetry}
                className='flex-1 bg-green-600 hover:bg-green-700 text-white'
              >
                <RefreshCw className='w-4 h-4 mr-2' />
                Coba Lagi
              </Button>
            )}

            {isAuthError && (
              <Button
                onClick={() => (window.location.href = '/login')}
                className='flex-1 bg-blue-600 hover:bg-blue-700 text-white'
              >
                Login Kembali
              </Button>
            )}

            {errorInfo.showContact && onContact && (
              <Button
                onClick={onContact}
                variant='outline'
                className='flex-1 border-gray-300 hover:bg-gray-50'
              >
                <Phone className='w-4 h-4 mr-2' />
                Hubungi Support
              </Button>
            )}
          </div>

          {/* Additional help text */}
          <div className='text-center text-sm text-gray-600 pt-2'>
            {isNetworkError && (
              <p>
                Jika masalah koneksi berlanjut, silakan hubungi administrator.
              </p>
            )}
            {isServerError && (
              <p>
                Masalah server akan segera diperbaiki. Terima kasih atas
                kesabaran Anda.
              </p>
            )}
            {!isNetworkError && !isServerError && !isAuthError && (
              <p>Jika masalah berlanjut, silakan hubungi administrator.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorDisplay;
