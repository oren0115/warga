import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { PaymentStatusResponse } from "../../types";
import { PaymentStatusPage } from "../../components/common";

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const paymentId = searchParams.get("payment_id");

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
      console.error("Error fetching payment details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/iuran");
  };

  const handleCheckStatus = async () => {
    if (!paymentId) return;

    try {
      const paymentData = await userService.checkPaymentStatus(paymentId);
      setPaymentStatus(paymentData);

      // Refresh fees to get updated status
      await userService.getFees();
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  if (isLoading) {
    return (
      <PaymentStatusPage
        status="success"
        paymentId={paymentId || undefined}
        onBack={handleBack}
      />
    );
  }

  return (
    <PaymentStatusPage
      status="success"
      paymentId={paymentStatus?.payment_id}
      onBack={handleBack}
      onCheckStatus={handleCheckStatus}
    />
  );
};

export default PaymentSuccess;
