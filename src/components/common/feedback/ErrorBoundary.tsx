import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger } from '../../../utils/logger.utils';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to centralized service
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      logger.error('ErrorBoundary caught an error:', error);
      logger.log('Error Info:', errorInfo);
    }

    // Send to error tracking service
    this.logErrorToService(error, errorInfo);
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    try {
      // Import error service dynamically to avoid circular dependencies
      import('../../../services/error.service').then(({ errorService }) => {
        errorService.logError(error, {
          componentStack: errorInfo.componentStack || '',
          errorBoundary: true,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        });
      });
    } catch (importError) {
      console.error('Failed to import error service:', importError);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className='min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4'>
          <Card className='max-w-2xl w-full'>
            <CardHeader className='text-center'>
              <div className='mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <AlertCircle className='w-8 h-8 text-red-600' />
              </div>
              <CardTitle className='text-2xl text-gray-900'>
                Oops! Terjadi Kesalahan
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='text-center'>
                <p className='text-gray-600 mb-4'>
                  Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah
                  diberitahu dan sedang bekerja untuk memperbaikinya.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className='mt-4 p-4 bg-gray-100 rounded-lg text-left'>
                    <summary className='cursor-pointer font-medium text-gray-700 mb-2'>
                      Detail Error (Development Mode)
                    </summary>
                    <div className='space-y-2'>
                      <div>
                        <strong>Error:</strong>
                        <pre className='text-sm text-red-600 mt-1 whitespace-pre-wrap'>
                          {this.state.error.toString()}
                        </pre>
                      </div>
                      {this.state.errorInfo && (
                        <div>
                          <strong>Component Stack:</strong>
                          <pre className='text-sm text-gray-600 mt-1 whitespace-pre-wrap'>
                            {this.state.errorInfo.componentStack}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                )}
              </div>

              <div className='flex flex-col sm:flex-row gap-3 justify-center'>
                <Button
                  onClick={this.handleRetry}
                  variant='default'
                  className='flex items-center gap-2'
                >
                  <RefreshCw className='w-4 h-4' />
                  Coba Lagi
                </Button>

                <Button
                  onClick={this.handleGoHome}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <Home className='w-4 h-4' />
                  Ke Beranda
                </Button>

                <Button
                  onClick={this.handleReload}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <RefreshCw className='w-4 h-4' />
                  Muat Ulang Halaman
                </Button>
              </div>

              <div className='text-center text-sm text-gray-500'>
                <p>
                  Jika masalah berlanjut, silakan hubungi administrator atau{' '}
                  <a
                    href='mailto:support@example.com'
                    className='text-blue-600 hover:underline'
                  >
                    kirim laporan bug
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
