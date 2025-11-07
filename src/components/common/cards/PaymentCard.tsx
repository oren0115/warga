import {
  AlertCircle,
  CheckCircle,
  Clipboard,
  Clock,
  CreditCard,
  Link2,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import type { Payment } from '../../../types';
import { formatDateTimeWithPukul } from '../../../utils/format.utils';
import { getPaymentMethodMeta } from '../../../utils/paymentMethod.utils';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import KeyValueRow from './KeyValueRow';

interface PaymentCardProps {
  payment: Payment;
  onRefresh?: () => Promise<void>;
  onForceCheck?: (paymentId: string) => Promise<void>;
  className?: string;
  isAdmin?: boolean;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  payment,
  onRefresh,
  onForceCheck,
  className = '',
  isAdmin = false,
}) => {
  const [isForceChecking, setIsForceChecking] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const STATUS_MAP: Record<
    string,
    {
      text: string;
      variant: 'default' | 'secondary' | 'destructive' | 'outline';
      icon: React.ReactNode;
    }
  > = {
    success: {
      text: 'Lunas',
      variant: 'default',
      icon: <CheckCircle className='text-green-600 w-5 h-5' />,
    },
    settlement: {
      text: 'Lunas',
      variant: 'default',
      icon: <CheckCircle className='text-green-600 w-5 h-5' />,
    },
    pending: {
      text: 'Menunggu',
      variant: 'secondary',
      icon: <Clock className='text-yellow-600 w-5 h-5' />,
    },
    failed: {
      text: 'Gagal',
      variant: 'destructive',
      icon: <XCircle className='text-red-600 w-5 h-5' />,
    },
    deny: {
      text: 'Ditolak',
      variant: 'destructive',
      icon: <XCircle className='text-red-600 w-5 h-5' />,
    },
    cancel: {
      text: 'Dibatalkan',
      variant: 'destructive',
      icon: <XCircle className='text-red-600 w-5 h-5' />,
    },
    expire: {
      text: 'Kadaluarsa',
      variant: 'destructive',
      icon: <AlertCircle className='text-red-600 w-5 h-5' />,
    },
  };

  const status = STATUS_MAP[payment.status.toLowerCase()] || {
    text: payment.status,
    variant: 'outline' as const,
    icon: <Clipboard className='w-5 h-5' />,
  };

  const method = getPaymentMethodMeta(
    payment.payment_type || payment.payment_method,
    payment.bank
  );

  const statusBg = (() => {
    const s = payment.status.toLowerCase();
    if (s === 'pending') return 'bg-amber-50 ring-amber-200';
    if (['failed', 'deny', 'cancel', 'expire'].includes(s))
      return 'bg-rose-50 ring-rose-200';
    if (['success', 'settlement'].includes(s))
      return 'bg-emerald-50 ring-emerald-200';
    return 'bg-gray-50 ring-gray-200';
  })();

  const handleForceCheck = async () => {
    if (!onForceCheck) return;

    try {
      setIsForceChecking(true);
      await onForceCheck(payment.id);
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setIsForceChecking(false);
    }
  };

  return (
    <Card
      className={`transition-all duration-200 ring-1 ${statusBg} w-full ${className}`}
    >
      <CardHeader className='pb-2 px-4 sm:px-5'>
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3'>
            {method.icon}
            <div>
              <CardTitle className='text-base text-gray-800 font-semibold'>
                {method.text}
              </CardTitle>
              <p className='text-xs text-gray-600 font-medium'>
                {formatDateTimeWithPukul(payment.created_at)}
              </p>
              {payment.va_number && (
                <p className='text-[11px] text-gray-500 font-medium'>
                  No. VA: {payment.va_number}
                </p>
              )}
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {status.icon}
            <Badge
              variant={status.variant}
              className={`px-2.5 py-0.5 text-xs font-medium`}
            >
              {status.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0 px-4 sm:px-5'>
        <div className='mt-2 flex items-baseline justify-between'>
          <div className='text-lg font-bold text-gray-900'>
            Rp {payment.amount.toLocaleString('id-ID')}
          </div>
          {payment.user && (
            <div className='text-sm text-gray-700 font-medium'>
              {payment.user.nama}
            </div>
          )}
        </div>

        <button
          type='button'
          onClick={() => setOpenDetails(v => !v)}
          className='mt-2 text-sm text-gray-700 hover:underline'
        >
          {openDetails ? '▲ Sembunyikan' : '▼ Detail'}
        </button>

        {openDetails && (
          <div className='mt-3 space-y-2 text-sm'>
            {payment.transaction_id && (
              <KeyValueRow
                label='ID Transaksi'
                value={payment.transaction_id}
                isCode
              />
            )}
            {payment.payment_type && (
              <KeyValueRow
                label='Tipe Pembayaran'
                value={payment.payment_type}
              />
            )}
            {payment.bank && <KeyValueRow label='Bank' value={payment.bank} />}
            {payment.va_number && (
              <KeyValueRow label='Nomor VA' value={payment.va_number} isCode />
            )}
            {payment.expiry_time && (
              <KeyValueRow
                label='Batas Waktu'
                value={formatDateTimeWithPukul(payment.expiry_time)}
                color='text-amber-600'
              />
            )}
            {payment.settled_at && (
              <KeyValueRow
                label='Diselesaikan'
                value={formatDateTimeWithPukul(payment.settled_at)}
                color='text-green-600'
              />
            )}
          </div>
        )}

        {(payment.status.toLowerCase() === 'pending' ||
          payment.status.toLowerCase() === 'failed' ||
          payment.status.toLowerCase() === 'deny' ||
          payment.status.toLowerCase() === 'cancel' ||
          payment.status.toLowerCase() === 'expire') && (
          <div className='pt-4 flex flex-col sm:flex-row gap-2'>
            {payment.status.toLowerCase() === 'pending' &&
              !isAdmin &&
              payment.payment_url && (
                <Button
                  asChild
                  className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200'
                >
                  <a
                    href={payment.payment_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-center space-x-2'
                  >
                    <Link2 className='w-5 h-5' />
                    <span>Lanjutkan Pembayaran</span>
                  </a>
                </Button>
              )}
            {(payment.status.toLowerCase() === 'failed' ||
              payment.status.toLowerCase() === 'deny' ||
              payment.status.toLowerCase() === 'cancel' ||
              payment.status.toLowerCase() === 'expire') &&
              !isAdmin && (
                <Button
                  asChild
                  className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200'
                >
                  <a
                    href={`/iuran/${payment.fee_id}`}
                    className='flex items-center justify-center space-x-2'
                  >
                    <CreditCard className='w-5 h-5' />
                    <span>Bayar Lagi</span>
                  </a>
                </Button>
              )}
            {onForceCheck && (
              <Button
                disabled={isForceChecking}
                onClick={handleForceCheck}
                className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-lg transition-all duration-200'
              >
                {isForceChecking ? 'Memeriksa...' : 'Perbarui Status'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
