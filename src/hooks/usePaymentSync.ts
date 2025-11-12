import { useCallback, useRef, useState } from 'react';
import { useToast } from '../context/toast.context';
import { userService } from '../services/user.service';
import type { Fee, Payment } from '../types';

interface UsePaymentSyncReturn {
  lastPayment: Payment | null;
  lastPaymentId: string | null;
  setLastPaymentId: (id: string | null) => void;
  syncLatestPaymentStatus: (fee: Fee) => Promise<void>;
  updateFeeFromPayment: (fee: Fee) => void;
}

export const usePaymentSync = (): UsePaymentSyncReturn => {
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const lastPaymentStatusRef = useRef<string | null>(null);
  const { showInfo } = useToast();

  const syncLatestPaymentStatus = useCallback(
    async (feeToSync: Fee) => {
      try {
        const payments = await userService.getPayments();
        const relatedPayments = payments
          .filter(payment => payment.fee_id === feeToSync.id)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

        if (relatedPayments.length === 0) {
          setLastPayment(null);
          lastPaymentStatusRef.current = null;
          setLastPaymentId(null);
          return;
        }

        const latestPayment = relatedPayments[0];
        setLastPaymentId(latestPayment.id);

        let normalizedStatus = latestPayment.status?.toLowerCase() || '';

        // Force check if pending
        if (normalizedStatus === 'pending') {
          try {
            const forcedStatus = await userService.forceCheckPaymentStatus(
              latestPayment.id
            );
            if (forcedStatus?.status) {
              normalizedStatus = forcedStatus.status.toLowerCase();
            }
          } catch (error) {
            console.error('Failed to force check payment status', error);
          }
        }

        // Map payment status to fee status
        let derivedFeeStatus: Fee['status'] | null = null;

        if (['success', 'settlement'].includes(normalizedStatus)) {
          derivedFeeStatus = 'Lunas';
        } else if (normalizedStatus === 'pending') {
          derivedFeeStatus = 'Pending';
        } else if (
          ['expire', 'expired', 'kadaluarsa'].includes(normalizedStatus)
        ) {
          derivedFeeStatus = 'Kadaluarsa';
        } else if (
          ['failed', 'fail', 'gagal', 'cancel', 'deny'].includes(
            normalizedStatus
          )
        ) {
          derivedFeeStatus = 'Failed';
        }

        const previousStatus = lastPaymentStatusRef.current;
        const normalizedPaymentStatus =
          (derivedFeeStatus as Payment['status']) ||
          ((latestPayment.status as Payment['status']) ?? 'Pending');

        const paymentForState: Payment = {
          ...latestPayment,
          status: normalizedPaymentStatus,
        };

        setLastPayment(paymentForState);
        lastPaymentStatusRef.current = normalizedPaymentStatus;

        // Show expiry notification
        if (
          normalizedPaymentStatus === 'Kadaluarsa' &&
          previousStatus !== 'Kadaluarsa'
        ) {
          showInfo(
            'Waktu pembayaran telah habis. Silakan lakukan pembayaran ulang.'
          );
        }
      } catch (error) {
        console.error('Failed to sync latest payment status', error);
      }
    },
    [showInfo]
  );

  const updateFeeFromPayment = useCallback((_fee: Fee) => {
    // This will be handled by parent component
    // Just exposing the method for reusability
  }, []);

  return {
    lastPayment,
    lastPaymentId,
    setLastPaymentId,
    syncLatestPaymentStatus,
    updateFeeFromPayment,
  };
};

