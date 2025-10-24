import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentStatusPage } from '../../../components/common';
import { userService } from '../../../services/user.service';
import type { PaymentStatusResponse } from '../../../types';

const PaymentPending: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

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
    } catch (error) {
      console.error('Error fetching payment details:', error);
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
    } catch (error) {
      console.error('Error checking payment status:', error);
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
