import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PaymentStatusPage } from '../../../components/common';
import { userService } from '../../../services/user.service';
import type { PaymentStatusResponse } from '../../../types';

const PaymentFailed: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    } catch (error) {
      console.error('Error fetching payment details:', error);
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
