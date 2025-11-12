import { useEffect, useMemo, useState } from 'react';
import { formatCountdown } from '../utils/fee.utils';

interface UsePaymentCountdownProps {
  expiryTime: string | null | undefined;
  isActive: boolean;
  onExpired?: () => void;
}

interface UsePaymentCountdownReturn {
  countdown: number | null;
  countdownLabel: string | null;
  isExpired: boolean;
}

export const usePaymentCountdown = ({
  expiryTime,
  isActive,
  onExpired,
}: UsePaymentCountdownProps): UsePaymentCountdownReturn => {
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!expiryTime || !isActive) {
      setCountdown(null);
      return;
    }

    const expiryTimestamp = new Date(expiryTime).getTime();

    const updateCountdown = () => {
      const remaining = expiryTimestamp - Date.now();
      setCountdown(remaining);
    };

    // Initial update
    updateCountdown();

    // Set up interval
    const intervalId = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(intervalId);
  }, [expiryTime, isActive]);

  // Check if expired
  useEffect(() => {
    if (countdown !== null && countdown <= 0) {
      setCountdown(null);
      if (onExpired) {
        onExpired();
      }
    }
  }, [countdown, onExpired]);

  const countdownLabel = useMemo(() => {
    if (countdown === null || countdown <= 0) return null;
    return formatCountdown(countdown);
  }, [countdown]);

  const isExpired = countdown !== null && countdown <= 0;

  return {
    countdown,
    countdownLabel,
    isExpired,
  };
};

