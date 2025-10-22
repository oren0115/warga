import React, {
  createContext,
  useContext,
  useCallback,
  type ReactNode,
} from "react";
import {
  errorService,
  type ErrorContext as ErrorContextType,
} from "../services/error.service";

interface ErrorProviderProps {
  children: ReactNode;
}

interface ErrorContextValue {
  logError: (
    error: Error,
    context?: ErrorContextType,
    severity?: "low" | "medium" | "high" | "critical",
    category?: "network" | "validation" | "server" | "client" | "unknown"
  ) => void;
  logApiError: (
    error: any,
    endpoint: string,
    method?: string,
    requestData?: any
  ) => void;
  logValidationError: (
    field: string,
    value: any,
    rule: string,
    message: string
  ) => void;
  logUserAction: (
    action: string,
    details?: any,
    severity?: "low" | "medium" | "high" | "critical"
  ) => void;
  getErrorStats: () => any;
  clearErrorQueue: () => void;
}

const ErrorContext = createContext<ErrorContextValue | undefined>(undefined);

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const logError = useCallback(
    (
      error: Error,
      context: ErrorContextType = {},
      severity: "low" | "medium" | "high" | "critical" = "medium",
      category:
        | "network"
        | "validation"
        | "server"
        | "client"
        | "unknown" = "unknown"
    ) => {
      errorService.logError(error, context, severity, category);
    },
    []
  );

  const logApiError = useCallback(
    (
      error: any,
      endpoint: string,
      method: string = "GET",
      requestData?: any
    ) => {
      errorService.logApiError(error, endpoint, method, requestData);
    },
    []
  );

  const logValidationError = useCallback(
    (field: string, value: any, rule: string, message: string) => {
      errorService.logValidationError(field, value, rule, message);
    },
    []
  );

  const logUserAction = useCallback(
    (
      action: string,
      details?: any,
      severity: "low" | "medium" | "high" | "critical" = "low"
    ) => {
      errorService.logUserAction(action, details, severity);
    },
    []
  );

  const getErrorStats = useCallback(() => {
    return errorService.getErrorStats();
  }, []);

  const clearErrorQueue = useCallback(() => {
    errorService.clearErrorQueue();
  }, []);

  const value: ErrorContextValue = {
    logError,
    logApiError,
    logValidationError,
    logUserAction,
    getErrorStats,
    clearErrorQueue,
  };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
