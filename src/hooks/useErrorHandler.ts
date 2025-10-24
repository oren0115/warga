import { useState, useCallback } from 'react';
import { getErrorInfo, getUserFriendlyError } from '../utils/error-messages';
import { errorService } from '../services/error.service';

interface UseErrorHandlerReturn {
  error: any;
  errorInfo: ReturnType<typeof getErrorInfo> | null;
  setError: (error: any) => void;
  clearError: () => void;
  handleError: (error: any, context?: string) => void;
  isError: boolean;
  isNetworkError: boolean;
  isServerError: boolean;
  isAuthError: boolean;
  canRetry: boolean;
  shouldContact: boolean;
}

/**
 * Hook untuk menangani error dengan mudah
 * Menyediakan informasi error yang user-friendly dan utility functions
 */
export const useErrorHandler = (): UseErrorHandlerReturn => {
  const [error, setErrorState] = useState<any>(null);

  const setError = useCallback((newError: any) => {
    setErrorState(newError);
  }, []);

  const clearError = useCallback(() => {
    setErrorState(null);
  }, []);

  const handleError = useCallback((newError: any, context?: string) => {
    // Log error untuk debugging
    if (context) {
      errorService.logApiError(newError, context, 'ERROR', newError);
    } else {
      errorService.logError(newError, { action: 'user_action' });
    }

    // Set error state
    setErrorState(newError);
  }, []);

  // Get error info if error exists
  const errorInfo = error ? getErrorInfo(error) : null;

  // Utility flags
  const isError = !!error;
  const isNetworkError = errorInfo?.category === 'network';
  const isServerError = errorInfo?.category === 'server';
  const isAuthError = errorInfo?.category === 'authentication';
  const canRetry = errorInfo?.showRetry || false;
  const shouldContact = errorInfo?.showContact || false;

  return {
    error,
    errorInfo,
    setError,
    clearError,
    handleError,
    isError,
    isNetworkError,
    isServerError,
    isAuthError,
    canRetry,
    shouldContact,
  };
};

/**
 * Hook untuk menangani error dalam async operations
 */
export const useAsyncErrorHandler = () => {
  const errorHandler = useErrorHandler();

  const executeWithErrorHandling = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    context?: string
  ): Promise<T | null> => {
    try {
      errorHandler.clearError();
      const result = await asyncFunction();
      return result;
    } catch (error) {
      errorHandler.handleError(error, context);
      return null;
    }
  }, [errorHandler]);

  return {
    ...errorHandler,
    executeWithErrorHandling,
  };
};

/**
 * Hook untuk menangani error dalam API calls
 */
export const useApiErrorHandler = () => {
  const errorHandler = useErrorHandler();

  const handleApiError = useCallback((error: any, endpoint: string, method: string = 'GET') => {
    // Log API error
    errorService.logApiError(error, endpoint, method);
    
    // Set user-friendly error
    const errorMapping = getUserFriendlyError(error);
    const userFriendlyError = new Error(errorMapping.userMessage);
    (userFriendlyError as any).originalError = error;
    (userFriendlyError as any).errorMapping = errorMapping;
    (userFriendlyError as any).statusCode = error.response?.status || 0;
    
    errorHandler.setError(userFriendlyError);
  }, [errorHandler]);

  return {
    ...errorHandler,
    handleApiError,
  };
};