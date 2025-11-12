import { useCallback, useEffect, useState } from 'react';
import { useGlobalError } from '../context/global-error.context';
import { useToast } from '../context/toast.context';
import { userService } from '../services/user.service';
import type { Fee } from '../types';
import {
  getToastDuration,
  isLightweightError,
} from '../utils/error-handling.utils';

interface UseFeeDetailReturn {
  fee: Fee | null;
  isLoading: boolean;
  error: string | null;
  fetchFee: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useFeeDetail = (feeId: string | undefined): UseFeeDetailReturn => {
  const [fee, setFee] = useState<Fee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const fetchFee = useCallback(async () => {
    if (!feeId) {
      setError('Fee ID tidak valid');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fees = await userService.getFees();
      const currentFee = fees.find(f => f.id === feeId);

      if (!currentFee) {
        setError('Iuran tidak ditemukan');
        setFee(null);
      } else {
        setFee(currentFee);
      }
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage || err?.message || 'Gagal memuat data';
      setError(message);

      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [feeId, showError, setGlobalError]);

  useEffect(() => {
    fetchFee();
  }, [fetchFee]);

  return {
    fee,
    isLoading,
    error,
    fetchFee,
    refetch: fetchFee,
  };
};

