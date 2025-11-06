import type { VariantProps } from 'class-variance-authority';
import { AlertCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FeeInfoCard from '../../../components/common/cards/FeeInfoCard';
import PaymentStatusCard from '../../../components/common/cards/PaymentStatusCard';
import PayNowCard from '../../../components/common/cards/PayNowCard';
import FeeDetailHeader from '../../../components/common/header/FeeDetailHeader';
import { badgeVariants } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { useAuth } from '../../../context/auth.context';
import { useGlobalError } from '../../../context/global-error.context';
import { useToast } from '../../../context/toast.context';
import { userService } from '../../../services/user.service';
import type { Fee, PaymentCreateRequest } from '../../../types';
import {
  getToastDuration,
  isLightweightError,
} from '../../../utils/error-handling.utils';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const IuranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [fee, setFee] = useState<Fee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Default metode pembayaran (ubah sesuai kebutuhan)
  const [selectedPaymentMethod] = useState('bank_transfer');

  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess, showInfo } = useToast();
  const { setGlobalError } = useGlobalError();

  const fetchFee = useCallback(async () => {
    setIsLoading(true);
    try {
      const fees = await userService.getFees();
      const currentFee = fees.find(f => f.id === id);
      setFee(currentFee || null);
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage || err?.message || 'Gagal memuat data';
      setError(message);
      // Gunakan toast untuk error ringan, banner untuk error kritis
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchFee();
  }, [id, fetchFee]);

  const handlePayment = async () => {
    if (!fee || !selectedPaymentMethod) return;
    setIsProcessingPayment(true);
    try {
      const paymentData: PaymentCreateRequest = {
        fee_id: fee.id,
        amount: fee.nominal,
        payment_method: selectedPaymentMethod,
      };
      const paymentResponse = await userService.createPayment(paymentData);

      if (paymentResponse.payment_url) {
        setLastPaymentId(paymentResponse.payment_id);
        window.open(paymentResponse.payment_url, '_blank');

        // Redirect to processing page instead of polling
        navigate(
          `/payment/processing?payment_id=${paymentResponse.payment_id}&fee_id=${fee.id}`
        );
      }
    } catch (err: any) {
      const message =
        err?.errorMapping?.userMessage ||
        err?.message ||
        'Gagal membuat pembayaran. Silakan coba lagi.';
      // Gunakan toast untuk error ringan, banner untuk error kritis
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const forceCheckPaymentStatus = async () => {
    if (!lastPaymentId) return;

    setIsCheckingPayment(true);
    try {
      const statusResponse = await userService.forceCheckPaymentStatus(
        lastPaymentId
      );

      if (statusResponse.updated) {
        setLastPaymentId(null);
        await fetchFee();
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
      // Gunakan toast untuk error ringan, banner untuk error kritis
      if (isLightweightError(err)) {
        showError(message, getToastDuration(err));
      } else {
        setGlobalError(err);
      }
    } finally {
      setIsCheckingPayment(false);
    }
  };

  // const startPaymentStatusPolling = (paymentId: string) => {
  //   const pollInterval = setInterval(async () => {
  //     const shouldStop = await checkPaymentStatus(paymentId);
  //     if (shouldStop) {
  //       clearInterval(pollInterval);
  //     }
  //   }, 5000);

  //   setTimeout(() => {
  //     clearInterval(pollInterval);
  //     setLastPaymentId(null);
  //   }, 600000);
  // };

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case 'lunas':
        return 'default';
      case 'pending':
        return 'outline';
      case 'belum bayar':
        return 'destructive';
      case 'gagal':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Asia/Jakarta',
    });

  const formatMonth = (bulan: string) => {
    const months = [
      'Januari',
      'Februari',
      'Maret',
      'April',
      'Mei',
      'Juni',
      'Juli',
      'Agustus',
      'September',
      'Oktober',
      'November',
      'Desember',
    ];

    let month: number;
    if (bulan.includes('-')) {
      // Format: "2025-09" -> extract month part
      month = parseInt(bulan.split('-')[1]);
    } else {
      // Format: "9" -> direct parse
      month = parseInt(bulan);
    }

    return months[month - 1] || bulan;
  };

  const getYearFromBulan = (bulan: string) => {
    if (bulan.includes('-')) {
      return bulan.split('-')[0];
    }
    return new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    )
      .getFullYear()
      .toString();
  };

  const getDueDateFromBulan = (bulan: string) => {
    if (bulan.includes('-')) {
      const [year, month] = bulan.split('-');
      const dueDate = new Date(parseInt(year), parseInt(month), 0);
      return dueDate;
    } else {
      const currentYear = new Date(
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
      ).getFullYear();
      const dueDate = new Date(currentYear, parseInt(bulan), 0);
      return dueDate;
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4'></div>
          <p className='text-gray-600'>Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!fee) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Iuran Tidak Ditemukan</h2>
          <Button onClick={() => navigate('/iuran')}>
            Kembali ke Daftar Iuran
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <Card className='max-w-md mx-4'>
          <CardContent className='pt-6'>
            <div className='text-center'>
              <AlertCircle className='w-12 h-12 text-red-500 mx-auto mb-4' />
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Terjadi Kesalahan
              </h3>
              <p className='text-gray-600 mb-4'>{error}</p>
              <Button onClick={fetchFee} className='w-full'>
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <FeeDetailHeader
        userName={authState.user?.nama}
        onBack={() => navigate('/iuran')}
      />

      <div className='p-4 space-y-6 -mt-2'>
        <FeeInfoCard
          fee={fee}
          formatDate={formatDate}
          formatMonth={formatMonth}
          getYearFromBulan={getYearFromBulan}
          getDueDateFromBulan={getDueDateFromBulan}
          getStatusVariant={getStatusVariant}
        />

        {/* Payment Section */}
        {(fee.status === 'Belum Bayar' ||
          fee.status === 'Failed' ||
          fee.status === 'Pending') && (
          <PayNowCard onPay={handlePayment} disabled={isProcessingPayment} />
        )}

        {/* Payment Status - Pending */}
        {fee.status === 'Pending' && (
          <PaymentStatusCard
            title='Status Pembayaran'
            badgeVariant={getStatusVariant(fee.status)}
            badgeText='⏳ Sedang Diproses'
            isChecking={isCheckingPayment}
            lastPaymentId={lastPaymentId}
            onForceCheck={forceCheckPaymentStatus}
          />
        )}

        {/* Payment Status - Success */}
        {fee.status === 'Lunas' && (
          <PaymentStatusCard
            title='Status Pembayaran'
            badgeVariant={getStatusVariant(fee.status)}
            badgeText='✓ Sudah Lunas'
            isChecking={isCheckingPayment}
          />
        )}
      </div>
    </div>
  );
};

export default IuranDetail;
