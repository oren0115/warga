import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { PaymentStatusResponse } from "../../types";
import { PageHeader, PageLayout, ErrorState } from "../../components/common";
import { RefreshCw, Clock } from "lucide-react";

const PaymentProcessing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentId = searchParams.get("payment_id");
  const feeId = searchParams.get("fee_id");

  useEffect(() => {
    if (paymentId) {
      checkPaymentStatus();
    } else {
      setError("ID pembayaran tidak ditemukan");
      setIsLoading(false);
    }
  }, [paymentId]);

  const checkPaymentStatus = async () => {
    if (!paymentId) return;

    try {
      setIsLoading(true);
      setError(null);

      const paymentData = await userService.checkPaymentStatus(paymentId);
      setPaymentStatus(paymentData);

      // Refresh fees to get updated status
      await userService.getFees();

      // Redirect berdasarkan status
      if (
        paymentData.status.toLowerCase() === "success" ||
        paymentData.status.toLowerCase() === "settlement"
      ) {
        navigate(`/payment/success?payment_id=${paymentId}&fee_id=${feeId}`);
      } else if (
        paymentData.status.toLowerCase() === "failed" ||
        paymentData.status.toLowerCase() === "deny" ||
        paymentData.status.toLowerCase() === "cancel" ||
        paymentData.status.toLowerCase() === "expire"
      ) {
        navigate(`/payment/failed?payment_id=${paymentId}&fee_id=${feeId}`);
      } else if (paymentData.status.toLowerCase() === "pending") {
        navigate(`/payment/pending?payment_id=${paymentId}&fee_id=${feeId}`);
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setError("Gagal memeriksa status pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    checkPaymentStatus();
  };

  if (isLoading) {
    return (
      <PageLayout>
        <PageHeader
          title="Memproses Pembayaran"
          subtitle="Mohon tunggu sebentar..."
          icon={<RefreshCw className="w-6 h-6 text-white" />}
        />
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Memproses Pembayaran Anda
            </h2>
            <p className="text-gray-600 mb-4">
              Sedang memverifikasi status pembayaran...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Mohon jangan tutup halaman ini</span>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (error) {
    return (
      <PageLayout>
        <PageHeader
          title="Error Pembayaran"
          subtitle="Terjadi kesalahan saat memproses"
          icon={<RefreshCw className="w-6 h-6 text-white" />}
        />
        <div className="flex items-center justify-center min-h-[60vh] p-4">
          <ErrorState
            title="Gagal Memproses Pembayaran"
            message={error}
            onRetry={handleRetry}
            retryText="Coba Lagi"
          />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Memproses Pembayaran"
        subtitle="Mohon tunggu sebentar..."
        icon={<RefreshCw className="w-6 h-6 text-white" />}
      />
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Memproses Pembayaran Anda
          </h2>
          <p className="text-gray-600 mb-4">
            Sedang memverifikasi status pembayaran...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>Mohon jangan tutup halaman ini</span>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PaymentProcessing;
