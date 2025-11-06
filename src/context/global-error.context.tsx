import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getToastDuration } from '../utils/error-handling.utils';
import { getUserFriendlyError } from '../utils/error-messages';
import { useToast } from './toast.context';

interface GlobalErrorContextValue {
  setGlobalError: (error: any) => void;
  clearGlobalError: () => void;
  globalError: any;
}

const GlobalErrorContext = createContext<GlobalErrorContextValue | undefined>(
  undefined
);

export const GlobalErrorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [globalError, setGlobalErrorState] = useState<any>(null);
  const { showError } = useToast();

  const setGlobalError = useCallback((error: any) => {
    setGlobalErrorState(error);
  }, []);

  const clearGlobalError = useCallback(() => {
    setGlobalErrorState(null);
  }, []);

  // When a global error is set, show a non-blocking toast and clear it
  useEffect(() => {
    if (globalError) {
      const mapping = getUserFriendlyError(globalError);
      showError(mapping.userMessage, getToastDuration(globalError));
      // auto clear to avoid re-showing
      const id = setTimeout(() => clearGlobalError(), 0);
      return () => clearTimeout(id);
    }
  }, [globalError, showError, clearGlobalError]);

  return (
    <GlobalErrorContext.Provider
      value={{ setGlobalError, clearGlobalError, globalError }}
    >
      {children}
    </GlobalErrorContext.Provider>
  );
};

export const useGlobalError = (): GlobalErrorContextValue => {
  const context = useContext(GlobalErrorContext);
  if (context === undefined) {
    throw new Error('useGlobalError must be used within a GlobalErrorProvider');
  }
  return context;
};
