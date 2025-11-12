import { AlertCircle } from 'lucide-react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FeeInfoCard from '../../../components/user/cards/FeeInfoCard';
import PaymentStatusCard from '../../../components/user/cards/PaymentStatusCard';
import PayNowCard from '../../../components/user/cards/PayNowCard';
import QrisPaymentDialog from '../../../components/user/dialogs/QrisPaymentDialog';
import FeeDetailHeader from '../../../components/user/header/FeeDetailHeader';
import { ExpiredPaymentAlert } from '../../../components/user/fee-detail/ExpiredPaymentAlert';
import { PendingPaymentAlert } from '../../../components/user/fee-detail/PendingPaymentAlert';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { PAYMENT_METHOD_OPTIONS } from '../../../constants/payment-methods';
import { useAuth } from '../../../context/auth.context';
import { useFeeDetail } from '../../../hooks/useFeeDetail';
import { usePaymentActions } from '../../../hooks/usePaymentActions';
import { usePaymentCountdown } from '../../../hooks/usePaymentCountdown';
import { usePaymentSync } from '../../../hooks/usePaymentSync';
import type { PaymentMethodRequest } from '../../../types';
import {
  formatDate,
  formatMonth,
  getDueDateFromBulan,
  getStatusVariant,
  getYearFromBulan,
} from '../../../utils/fee.utils';

const IuranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();

  // Custom hooks
  const { fee, isLoading, error, refetch } = useFeeDetail(id);
  const {
    lastPayment,
    lastPaymentId,
    setLastPaymentId,
    syncLatestPaymentStatus,
  } = usePaymentSync();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethodRequest>('bank_transfer');

  const hasAppliedDefaultMethodRef = useRef(false);
  const normalizedFeeStatus = (fee?.status || '').toLowerCase();

  // Payment actions hook
  const {
    isProcessingPayment,
    isCheckingPayment,
    qrisPaymentInfo,
    setQrisPaymentInfo,
    handlePayment,
    handleRetryPayment,
    forceCheckPaymentStatus,
  } = usePaymentActions({
    fee,
    selectedPaymentMethod,
    lastPayment,
    onPaymentCreated: setLastPaymentId,
    onSuccess: refetch,
  });

  // Payment countdown hook
  const { countdownLabel } = usePaymentCountdown({
    expiryTime: lastPayment?.expiry_time,
    isActive: normalizedFeeStatus === 'pending',
    onExpired: refetch,
  });

  // Sync payment status when fee loads
  useEffect(() => {
    if (fee && fee.status.toLowerCase() !== 'lunas') {
      syncLatestPaymentStatus(fee);
    }
  }, [fee, syncLatestPaymentStatus]);

  // Auto-apply last used payment method on expired/failed
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

  // Memoized labels for UI
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
              <Button onClick={refetch} className='w-full'>
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

        {/* Pending Payment Alert */}
        {normalizedFeeStatus === 'pending' && lastPayment && (
          <PendingPaymentAlert
            expiryTime={lastPayment.expiry_time}
            countdownLabel={countdownLabel}
          />
        )}

        {/* Expired Payment Alert */}
        {normalizedFeeStatus === 'kadaluarsa' && lastPayment && (
          <ExpiredPaymentAlert
            lastPaymentMethodLabel={lastPaymentMethodLabel}
            isProcessing={isProcessingPayment}
            onRetry={handleRetryPayment}
          />
        )}

        {/* Payment Status - Pending */}
        {normalizedFeeStatus === 'pending' && (
          <PaymentStatusCard
            title='Status Pembayaran'
            badgeVariant={getStatusVariant(fee.status)}
            badgeText='⏳ Sedang Diproses'
            isChecking={isCheckingPayment}
            lastPaymentId={lastPaymentId}
            onForceCheck={async () => {
              if (lastPaymentId) {
                await forceCheckPaymentStatus(lastPaymentId);
              }
            }}
          />
        )}

        {/* Payment Status - Success */}
        {normalizedFeeStatus === 'lunas' && (
          <PaymentStatusCard
            title='Status Pembayaran'
            badgeVariant={getStatusVariant(fee.status)}
            badgeText='✓ Sudah Lunas'
            isChecking={false}
          />
        )}
      </div>

      <QrisPaymentDialog
        open={Boolean(qrisPaymentInfo)}
        data={qrisPaymentInfo}
        onClose={() => setQrisPaymentInfo(null)}
        onForceCheck={async () => {
          if (lastPaymentId) {
            await forceCheckPaymentStatus(lastPaymentId);
          }
        }}
        isChecking={isCheckingPayment}
      />
    </div>
  );
};

export default IuranDetail;
