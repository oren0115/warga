import type { VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  CreditCard,
  Landmark,
  QrCode,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FeeInfoCard from '../../../components/common/cards/FeeInfoCard';
import PaymentStatusCard from '../../../components/common/cards/PaymentStatusCard';
import type { PaymentMethodOption } from '../../../components/common/cards/PayNowCard';
import PayNowCard from '../../../components/common/cards/PayNowCard';
import type { QrisPaymentInfo } from '../../../components/common/dialogs/QrisPaymentDialog';
import QrisPaymentDialog from '../../../components/common/dialogs/QrisPaymentDialog';
import FeeDetailHeader from '../../../components/common/header/FeeDetailHeader';
import { badgeVariants } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { useAuth } from '../../../context/auth.context';
import { useGlobalError } from '../../../context/global-error.context';
import { useToast } from '../../../context/toast.context';
import { userService } from '../../../services/user.service';
import type {
  Fee,
  PaymentCreateRequest,
  PaymentMethodRequest,
} from '../../../types';
import {
  getToastDuration,
  isLightweightError,
} from '../../../utils/error-handling.utils';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    value: 'qris',
    label: 'QRIS',
    description: 'Scan QR semua bank & e-wallet',
    icon: <QrCode className='h-4 w-4' />,
    badge: 'Terpopuler',
  },
  {
    value: 'bank_transfer',
    label: 'Transfer Bank (Virtual Account)',
    description: 'Virtual Account BCA, BNI, Mandiri, Permata',
    icon: <Landmark className='h-4 w-4' />,
  },
  {
    value: 'gopay',
    label: 'GoPay',
    description: 'Bayar lewat aplikasi GoPay',
    icon: <Smartphone className='h-4 w-4' />,
  },
  {
    value: 'shopeepay',
    label: 'ShopeePay',
    description: 'Bayar lewat aplikasi ShopeePay',
    icon: <ShoppingBag className='h-4 w-4' />,
  },
  {
    value: 'credit_card',
    label: 'Kartu Kredit',
    description: 'Dukungan kartu kredit/debit',
    icon: <CreditCard className='h-4 w-4' />,
  },
];

const IuranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [fee, setFee] = useState<Fee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Default metode pembayaran (ubah sesuai kebutuhan)
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodRequest>('bank_transfer');
  const [qrisPaymentInfo, setQrisPaymentInfo] =
    useState<QrisPaymentInfo | null>(null);

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
    setQrisPaymentInfo(null);
    try {
      const paymentData: PaymentCreateRequest = {
        fee_id: fee.id,
        amount: fee.nominal,
        payment_method: selectedPaymentMethod,
      };
      const paymentResponse = await userService.createPayment(paymentData);

      setLastPaymentId(paymentResponse.payment_id);

      if (
        paymentResponse.payment_type?.toLowerCase() === 'qris' &&
        (paymentResponse.qr_url || paymentResponse.qr_string)
      ) {
        setQrisPaymentInfo({
          orderId: paymentResponse.order_id,
          amount: fee.nominal,
          qrUrl: paymentResponse.qr_url || paymentResponse.payment_url,
          qrString: paymentResponse.qr_string,
          expiryTime: paymentResponse.expiry_time,
          deeplinkUrl: paymentResponse.deeplink_url,
          mobileDeeplinkUrl: paymentResponse.mobile_deeplink_url,
        });
        showInfo('Silakan scan QRIS untuk menyelesaikan pembayaran.');
        return;
      }

      if (paymentResponse.payment_url) {
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
          <PayNowCard
            onPay={handlePayment}
            disabled={isProcessingPayment}
            isProcessing={isProcessingPayment}
            amount={fee.nominal}
            selectedMethod={selectedPaymentMethod}
            onMethodChange={setSelectedPaymentMethod}
            methods={PAYMENT_METHOD_OPTIONS}
          />
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

      <QrisPaymentDialog
        open={Boolean(qrisPaymentInfo)}
        data={qrisPaymentInfo}
        onClose={() => setQrisPaymentInfo(null)}
        onForceCheck={forceCheckPaymentStatus}
        isChecking={isCheckingPayment}
      />
    </div>
  );
};

export default IuranDetail;
