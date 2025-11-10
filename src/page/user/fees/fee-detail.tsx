import type { VariantProps } from 'class-variance-authority';
import {
  AlertCircle,
  CreditCard,
  Landmark,
  QrCode,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  Payment,
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
  const [lastPayment, setLastPayment] = useState<Payment | null>(null);
  const lastPaymentStatusRef = useRef<string | null>(null);
  const hasAppliedDefaultMethodRef = useRef(false);
  const [expiryCountdown, setExpiryCountdown] = useState<number | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess, showInfo } = useToast();
  const { setGlobalError } = useGlobalError();
  const normalizedFeeStatus = (fee?.status || '').toLowerCase();

  const syncLatestPaymentStatus = useCallback(
    async (feeToSync: Fee) => {
      try {
        const payments = await userService.getPayments();
        const relatedPayments = payments
          .filter(payment => payment.fee_id === feeToSync.id)
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );

        if (relatedPayments.length === 0) {
          setLastPayment(null);
          lastPaymentStatusRef.current = null;
          setLastPaymentId(null);
          return;
        }

        const latestPayment = relatedPayments[0];
        setLastPaymentId(latestPayment.id);

        let normalizedStatus = latestPayment.status?.toLowerCase() || '';

        if (normalizedStatus === 'pending') {
          try {
            const forcedStatus = await userService.forceCheckPaymentStatus(
              latestPayment.id
            );
            if (forcedStatus?.status) {
              normalizedStatus = forcedStatus.status.toLowerCase();
            }
          } catch (error) {
            console.error('Failed to force check payment status', error);
          }
        }

        let derivedFeeStatus: Fee['status'] | null = null;

        if (['success', 'settlement'].includes(normalizedStatus)) {
          derivedFeeStatus = 'Lunas';
        } else if (normalizedStatus === 'pending') {
          derivedFeeStatus = 'Pending';
        } else if (
          ['expire', 'expired', 'kadaluarsa'].includes(normalizedStatus)
        ) {
          derivedFeeStatus = 'Kadaluarsa';
        } else if (
          ['failed', 'fail', 'gagal', 'cancel', 'deny'].includes(
            normalizedStatus
          )
        ) {
          derivedFeeStatus = 'Failed';
        }

        const previousStatus = lastPaymentStatusRef.current;
        const normalizedPaymentStatus =
          (derivedFeeStatus as Payment['status']) ||
          ((latestPayment.status as Payment['status']) ?? 'Pending');

        const paymentForState: Payment = {
          ...latestPayment,
          status: normalizedPaymentStatus,
        };
        setLastPayment(paymentForState);
        lastPaymentStatusRef.current = normalizedPaymentStatus;

        if (
          normalizedPaymentStatus === 'Kadaluarsa' &&
          previousStatus !== 'Kadaluarsa'
        ) {
          showInfo(
            'Waktu pembayaran telah habis. Silakan lakukan pembayaran ulang.'
          );
        }

        if (
          derivedFeeStatus &&
          derivedFeeStatus.toLowerCase() !== feeToSync.status.toLowerCase()
        ) {
          setFee(prev =>
            prev && prev.id === feeToSync.id
              ? { ...prev, status: derivedFeeStatus }
              : prev
          );
        }
      } catch (error) {
        console.error('Failed to sync latest payment status', error);
      }
    },
    [showInfo]
  );

  const fetchFee = useCallback(async () => {
    setIsLoading(true);
    try {
      const fees = await userService.getFees();
      const currentFee = fees.find(f => f.id === id);
      setFee(currentFee || null);
      if (currentFee && currentFee.status.toLowerCase() !== 'lunas') {
        await syncLatestPaymentStatus(currentFee);
      }
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
  }, [id, showError, setGlobalError, syncLatestPaymentStatus]);

  useEffect(() => {
    if (id) fetchFee();
  }, [id, fetchFee]);

  useEffect(() => {
    if (!lastPayment?.expiry_time || normalizedFeeStatus !== 'pending') {
      setExpiryCountdown(null);
      return;
    }
    const expiryTimestamp = new Date(lastPayment.expiry_time).getTime();
    const updateCountdown = () => {
      setExpiryCountdown(expiryTimestamp - Date.now());
    };
    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [lastPayment?.expiry_time, normalizedFeeStatus]);

  useEffect(() => {
    if (expiryCountdown !== null && expiryCountdown <= 0) {
      setExpiryCountdown(null);
      fetchFee();
    }
  }, [expiryCountdown, fetchFee]);

  useEffect(() => {
    if (!lastPayment) {
      hasAppliedDefaultMethodRef.current = false;
      return;
    }

    if (!['kadaluarsa', 'failed'].includes(normalizedFeeStatus)) {
      hasAppliedDefaultMethodRef.current = false;
      return;
    }

    const methodValue = (lastPayment.payment_method ||
      lastPayment.payment_type) as PaymentMethodRequest | undefined;

    if (!methodValue) return;

    if (!hasAppliedDefaultMethodRef.current) {
      setSelectedPaymentMethod(methodValue);
      hasAppliedDefaultMethodRef.current = true;
    }
  }, [lastPayment?.id, normalizedFeeStatus]);

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

  const handleRetryPayment = async () => {
    if (!lastPayment || !fee) return;
    setIsProcessingPayment(true);
    setQrisPaymentInfo(null);
    try {
      const response = await userService.retryPayment(lastPayment.id);
      setLastPaymentId(response.payment_id);

      const methodValue = (response.payment_type ||
        lastPayment.payment_method ||
        lastPayment.payment_type) as PaymentMethodRequest | undefined;
      if (methodValue) {
        setSelectedPaymentMethod(methodValue);
      }

      if (
        response.payment_type?.toLowerCase() === 'qris' &&
        (response.qr_url || response.qr_string)
      ) {
        setQrisPaymentInfo({
          orderId: response.order_id,
          amount: fee.nominal,
          qrUrl: response.qr_url || response.payment_url,
          qrString: response.qr_string,
          expiryTime: response.expiry_time,
          deeplinkUrl: response.deeplink_url,
          mobileDeeplinkUrl: response.mobile_deeplink_url,
        });
        showInfo('Silakan scan QRIS untuk menyelesaikan pembayaran.');
        return;
      }

      if (response.payment_url) {
        window.open(response.payment_url, '_blank');
        navigate(
          `/payment/processing?payment_id=${response.payment_id}&fee_id=${fee.id}`
        );
      }

      await fetchFee();
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

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case 'lunas':
        return 'default';
      case 'pending':
        return 'outline';
      case 'belum bayar':
      case 'failed':
      case 'gagal':
      case 'kadaluarsa':
      case 'expired':
      case 'expire':
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

  const countdownLabel = useMemo(() => {
    if (expiryCountdown === null) return null;
    const remaining = Math.max(0, Math.floor(expiryCountdown / 1000));
    const hours = Math.floor(remaining / 3600)
      .toString()
      .padStart(2, '0');
    const minutes = Math.floor((remaining % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(remaining % 60)
      .toString()
      .padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, [expiryCountdown]);

  const lastPaymentMethodLabel = useMemo(() => {
    if (!lastPayment) return null;
    const methodValue = (lastPayment.payment_method ||
      lastPayment.payment_type) as PaymentMethodRequest | undefined;
    if (!methodValue) return null;
    const option = PAYMENT_METHOD_OPTIONS.find(
      opt => opt.value === methodValue
    );
    return option?.label || methodValue.toUpperCase();
  }, [lastPayment]);

  const lastPaymentExpiryLabel = useMemo(() => {
    if (!lastPayment?.expiry_time) return null;
    return new Date(lastPayment.expiry_time).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  }, [lastPayment?.expiry_time]);

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
        {(normalizedFeeStatus === 'belum bayar' ||
          normalizedFeeStatus === 'failed' ||
          normalizedFeeStatus === 'pending' ||
          normalizedFeeStatus === 'kadaluarsa' ||
          normalizedFeeStatus === 'expired' ||
          normalizedFeeStatus === 'expire') && (
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

        {normalizedFeeStatus === 'pending' && lastPayment && (
          <div className='p-4 border border-amber-200 bg-amber-50 rounded-lg space-y-1'>
            <p className='text-sm text-amber-800 font-semibold'>
              Pembayaran sedang menunggu. Jangan tutup halaman Midtrans sampai
              selesai.
            </p>
            {lastPaymentExpiryLabel && (
              <p className='text-xs text-amber-700'>
                Batas pembayaran: {lastPaymentExpiryLabel}
              </p>
            )}
            {countdownLabel && (
              <p className='text-xs text-amber-700'>
                Sisa waktu sebelum kadaluarsa: {countdownLabel}
              </p>
            )}
          </div>
        )}

        {normalizedFeeStatus === 'kadaluarsa' && lastPayment && (
          <div className='p-4 border border-red-200 bg-red-50 rounded-lg space-y-3'>
            <div className='flex items-start gap-3'>
              <AlertCircle className='w-5 h-5 text-red-500 mt-0.5' />
              <div>
                <p className='text-sm text-red-700 font-semibold'>
                  Waktu pembayaran telah habis. Silakan lakukan pembayaran
                  ulang.
                </p>
                {lastPaymentMethodLabel && (
                  <p className='text-xs text-red-600'>
                    Metode sebelumnya: {lastPaymentMethodLabel}
                  </p>
                )}
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-2'>
              <Button
                onClick={handleRetryPayment}
                disabled={isProcessingPayment}
                className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200'
              >
                {isProcessingPayment
                  ? 'Memproses...'
                  : 'Gunakan Metode Sebelumnya'}
              </Button>
            </div>
          </div>
        )}

        {/* Payment Status - Pending */}
        {normalizedFeeStatus === 'pending' && (
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
        {normalizedFeeStatus === 'lunas' && (
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
