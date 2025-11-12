import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentStatusPage } from '../../../components/user';
import { useToast } from '../../../context/toast.context';
import { useGlobalError } from '../../../context/global-error.context';
import { getToastDuration, isLightweightError } from '../../../utils/error-handling.utils';
import { logger } from '../../../utils/logger.utils';
import { userService } from '../../../services/user.service';
import type { PaymentStatusResponse } from '../../../types';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const paymentId = searchParams.get('payment_id');

  useEffect(() => {
    if (paymentId) {
      fetchPaymentDetails();
    } else {
      setIsLoading(false);
    }
  }, [paymentId]);

  const fetchPaymentDetails = async () => {
    if (!paymentId) return;

    try {
      const paymentData = await userService.checkPaymentStatus(paymentId);
      setPaymentStatus(paymentData);

      // Refresh fees to get updated status
      await userService.getFees();
    } catch (err: any) {
      logger.error('Error fetching payment details:', err);
      const message =
        err?.errorMapping?.userMessage || err?.message || 'Gagal memuat detail pembayaran';
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/iuran');
  };

  const handleCheckStatus = async () => {
    if (!paymentId) return;

    try {
      const paymentData = await userService.checkPaymentStatus(paymentId);
      setPaymentStatus(paymentData);

      // Refresh fees to get updated status
      await userService.getFees();
    } catch (err: any) {
      logger.error('Error checking payment status:', err);
      const message =
        err?.errorMapping?.userMessage || err?.message || 'Gagal memeriksa status pembayaran';
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    }
  };

  if (isLoading) {
    return (
      <PaymentStatusPage
        status='success'
        paymentId={paymentId || undefined}
        onBack={handleBack}
      />
    );
  }

  return (
    <PaymentStatusPage
      status='success'
      paymentId={paymentStatus?.payment_id}
      onBack={handleBack}
      onCheckStatus={handleCheckStatus}
    />
  );
};

export default PaymentSuccess;
