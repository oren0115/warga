import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { QrisPaymentInfo } from '../components/user/dialogs/QrisPaymentDialog';
import { useGlobalError } from '../context/global-error.context';
import { useToast } from '../context/toast.context';
import { userService } from '../services/user.service';
import type {
  Fee,
  Payment,
  PaymentCreateRequest,
  PaymentMethodRequest,
} from '../types';
import {
  getToastDuration,
  isLightweightError,
} from '../utils/error-handling.utils';

interface UsePaymentActionsProps {
  fee: Fee | null;
  selectedPaymentMethod: PaymentMethodRequest;
  lastPayment: Payment | null;
  onPaymentCreated?: (paymentId: string) => void;
  onSuccess?: () => void;
}

interface UsePaymentActionsReturn {
  isProcessingPayment: boolean;
  isCheckingPayment: boolean;
  qrisPaymentInfo: QrisPaymentInfo | null;
  setQrisPaymentInfo: (info: QrisPaymentInfo | null) => void;
  handlePayment: () => Promise<void>;
  handleRetryPayment: () => Promise<void>;
  forceCheckPaymentStatus: (paymentId: string) => Promise<void>;
}

export const usePaymentActions = ({
  fee,
  selectedPaymentMethod,
  lastPayment,
  onPaymentCreated,
  onSuccess,
}: UsePaymentActionsProps): UsePaymentActionsReturn => {
  const navigate = useNavigate();
  const { showError, showSuccess, showInfo } = useToast();
  const { setGlobalError } = useGlobalError();

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [qrisPaymentInfo, setQrisPaymentInfo] =
    useState<QrisPaymentInfo | null>(null);

  const handleQrisPayment = (
    paymentResponse: any,
    amount: number
  ): boolean => {
    if (
      paymentResponse.payment_type?.toLowerCase() === 'qris' &&
      (paymentResponse.qr_url || paymentResponse.qr_string)
    ) {
      setQrisPaymentInfo({
        orderId: paymentResponse.order_id,
        amount,
        qrUrl: paymentResponse.qr_url || paymentResponse.payment_url,
        qrString: paymentResponse.qr_string,
        expiryTime: paymentResponse.expiry_time,
        deeplinkUrl: paymentResponse.deeplink_url,
        mobileDeeplinkUrl: paymentResponse.mobile_deeplink_url,
      });
      showInfo('Silakan scan QRIS untuk menyelesaikan pembayaran.');
      return true;
    }
    return false;
  };

  const handlePaymentRedirect = (
    paymentResponse: any,
    feeId: string
  ): void => {
    if (paymentResponse.payment_url) {
      window.open(paymentResponse.payment_url, '_blank');
      navigate(
        `/payment/processing?payment_id=${paymentResponse.payment_id}&fee_id=${feeId}`
      );
    }
  };

  const handlePayment = async (): Promise<void> => {
    if (!fee || !selectedPaymentMethod) return;

    setIsProcessingPayment(true);
    setQrisPaymentInfo(null);

    try {
      const paymentData: PaymentCreateRequest = {
        fee_id: fee.id,
        amount: fee.nominal,
        payment_method: selectedPaymentMethod,
      };

      const paymentResponse = await userService.createPayment(paymentData);

      if (onPaymentCreated) {
        onPaymentCreated(paymentResponse.payment_id);
      }

      // Handle QRIS payment
      if (handleQrisPayment(paymentResponse, fee.nominal)) {
        return;
      }

      // Handle redirect payment
      handlePaymentRedirect(paymentResponse, fee.id);
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage ||
        err?.message ||
        'Gagal membuat pembayaran. Silakan coba lagi.';

      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleRetryPayment = async (): Promise<void> => {
    if (!lastPayment || !fee) return;

    setIsProcessingPayment(true);
    setQrisPaymentInfo(null);

    try {
      const response = await userService.retryPayment(lastPayment.id);

      if (onPaymentCreated) {
        onPaymentCreated(response.payment_id);
      }

      // Handle QRIS payment
      if (handleQrisPayment(response, fee.nominal)) {
        return;
      }

      // Handle redirect payment
      handlePaymentRedirect(response, fee.id);

      if (onSuccess) {
        await onSuccess();
      }

      showInfo(
        'Tagihan baru berhasil dibuat menggunakan metode pembayaran sebelumnya.'
      );
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage ||
        err?.message ||
        'Gagal membuat pembayaran ulang. Silakan coba lagi.';

      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const forceCheckPaymentStatus = async (paymentId: string): Promise<void> => {
    if (!paymentId) return;

    setIsCheckingPayment(true);

    try {
      const statusResponse = await userService.forceCheckPaymentStatus(
        paymentId
      );

      if (statusResponse.updated) {
        if (onSuccess) {
          await onSuccess();
        }
        showSuccess('Status pembayaran berhasil diperbarui!');
      } else {
        showInfo(
          statusResponse.message || 'Status pembayaran sudah up to date'
        );
      }
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage ||
        err?.message ||
        'Gagal memeriksa status pembayaran. Silakan coba lagi.';

      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsCheckingPayment(false);
    }
  };

  return {
    isProcessingPayment,
    isCheckingPayment,
    qrisPaymentInfo,
    setQrisPaymentInfo,
    handlePayment,
    handleRetryPayment,
    forceCheckPaymentStatus,
  };
};

