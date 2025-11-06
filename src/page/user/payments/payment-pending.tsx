import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentStatusPage } from '../../../components/common';
import { useToast } from '../../../context/toast.context';
import { useGlobalError } from '../../../context/global-error.context';
import { getToastDuration, isLightweightError } from '../../../utils/error-handling.utils';
import { logger } from '../../../utils/logger.utils';
import { userService } from '../../../services/user.service';
import type { PaymentStatusResponse } from '../../../types';

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
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
      setIsCheckingStatus(true);
      const paymentData = await userService.checkPaymentStatus(paymentId);
      setPaymentStatus(paymentData);

      // Refresh fees to get updated status
      await userService.getFees();

      // Check if status changed
      if (
        paymentData.status.toLowerCase() === 'success' ||
        paymentData.status.toLowerCase() === 'settlement'
      ) {
        navigate(`/payment/success?payment_id=${paymentId}&fee_id=${feeId}`);
      } else if (paymentData.status.toLowerCase() === 'expire') {
        navigate(`/payment/expired?payment_id=${paymentId}&fee_id=${feeId}`);
      } else if (
        paymentData.status.toLowerCase() === 'failed' ||
        paymentData.status.toLowerCase() === 'deny' ||
        paymentData.status.toLowerCase() === 'cancel'
      ) {
        navigate(`/payment/failed?payment_id=${paymentId}&fee_id=${feeId}`);
      }
    } catch (err: any) {
      logger.error('Error checking payment status:', err);
      const message =
        err?.errorMapping?.userMessage || err?.message || 'Gagal memeriksa status pembayaran';
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsCheckingStatus(false);
    }
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
        status='pending'
        paymentId={paymentId || undefined}
        onBack={handleBack}
      />
    );
  }

  return (
    <PaymentStatusPage
      status='pending'
      paymentId={paymentStatus?.payment_id}
      onBack={handleBack}
      onRetry={handleRetry}
      onCheckStatus={handleCheckStatus}
      isCheckingStatus={isCheckingStatus}
    />
  );
};

export default PaymentPending;
