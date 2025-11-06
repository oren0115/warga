import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentStatusPage } from '../../../components/common';
import { useToast } from '../../../context/toast.context';
import { useGlobalError } from '../../../context/global-error.context';
import { getToastDuration, isLightweightError } from '../../../utils/error-handling.utils';
import { logger } from '../../../utils/logger.utils';
import { userService } from '../../../services/user.service';
import type { PaymentStatusResponse } from '../../../types';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  const paymentId = searchParams.get('payment_id');
  const feeId = searchParams.get('fee_id');

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

  const handleRetry = () => {
    if (feeId) {
      navigate(`/iuran/${feeId}`);
    } else {
      navigate('/iuran');
    }
  };

  if (isLoading) {
    return (
      <PaymentStatusPage
        status='failed'
        paymentId={paymentId || undefined}
        onBack={handleBack}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <PaymentStatusPage
      status='failed'
      paymentId={paymentStatus?.payment_id}
      onBack={handleBack}
      onRetry={handleRetry}
    />
  );
};

export default PaymentFailed;
