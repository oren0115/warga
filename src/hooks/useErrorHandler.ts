import { useCallback } from 'react';
import { useError } from '../context/error.context';

interface UseErrorHandlerReturn {
  handleError: (error: Error, context?: string, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
  handleApiError: (error: any, endpoint: string, method?: string, requestData?: any) => void;
  handleValidationError: (field: string, value: any, rule: string, message: string) => void;
  logUserAction: (action: string, details?: any, severity?: 'low' | 'medium' | 'high' | 'critical') => void;
}

export const useErrorHandler = (): UseErrorHandlerReturn => {
  const { logError, logApiError, logValidationError, logUserAction } = useError();

  const handleError = useCallback((
    error: Error,
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) => {
    logError(error, { context }, severity);
  }, [logError]);

  const handleApiError = useCallback((
    error: any,
    endpoint: string,
    method: string = 'GET',
    requestData?: any
  ) => {
    logApiError(error, endpoint, method, requestData);
  }, [logApiError]);

  const handleValidationError = useCallback((
    field: string,
    value: any,
    rule: string,
    message: string
  ) => {
    logValidationError(field, value, rule, message);
  }, [logValidationError]);

  return {
    handleError,
    handleApiError,
    handleValidationError,
    logUserAction,
  };
};
