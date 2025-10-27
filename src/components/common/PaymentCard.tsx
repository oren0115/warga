import {
  AlertCircle,
  CheckCircle,
  Clipboard,
  Clock,
  CreditCard,
  DollarSign,
  Landmark,
  Link2,
  ShoppingCart,
  Smartphone,
  XCircle,
} from 'lucide-react';
import React, { useState } from 'react';
import type { Payment } from '../../types';
import { formatDateTimeWithPukul } from '../../utils/format.utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

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

  const PAYMENT_METHOD_MAP: Record<
    string,
    { text: string; icon: React.ReactNode }
  > = {
    credit_card: {
      text: 'Kartu Kredit',
      icon: <CreditCard className='w-6 h-6 text-gray-700' />,
    },
    bank_transfer: {
      text: 'Transfer Bank',
      icon: <Landmark className='w-6 h-6 text-gray-700' />,
    },
    gopay: {
      text: 'GoPay',
      icon: <Smartphone className='w-6 h-6 text-gray-700' />,
    },
    shopeepay: {
      text: 'ShopeePay',
      icon: <ShoppingCart className='w-6 h-6 text-gray-700' />,
    },
  };

  const status = STATUS_MAP[payment.status.toLowerCase()] || {
    text: payment.status,
    variant: 'outline' as const,
    icon: <Clipboard className='w-5 h-5' />,
  };

  const method = PAYMENT_METHOD_MAP[payment.payment_method.toLowerCase()] || {
    text: payment.payment_method,
    icon: <DollarSign className='w-6 h-6 text-gray-700' />,
  };

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
      className={`shadow-xl hover:shadow-2xl transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50 w-full sm:w-auto ${className}`}
    >
      <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 rounded-t-lg'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3'>
          <div>{method.icon}</div>
          <div>
            <CardTitle className='text-lg text-gray-800 font-semibold'>
              {method.text}
            </CardTitle>
            <p className='text-sm text-gray-500 font-medium'>
              {formatDateTimeWithPukul(payment.created_at)}
            </p>
          </div>
        </div>
        <div className='flex items-center space-x-2 mt-2 sm:mt-0'>
          {status.icon}
          <Badge
            variant={status.variant}
            className={`px-3 py-1 text-xs font-medium ${
              payment.status.toLowerCase() === 'pending'
                ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : payment.status.toLowerCase() === 'failed' ||
                  payment.status.toLowerCase() === 'deny' ||
                  payment.status.toLowerCase() === 'cancel' ||
                  payment.status.toLowerCase() === 'expire'
                ? 'bg-red-100 text-red-800 border-red-200'
                : ''
            }`}
          >
            {status.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4 pt-4 px-4 sm:px-6'>
        <div className='flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm'>
          <span className='text-gray-700 font-semibold'>
            Nominal Pembayaran:
          </span>
          <span className='font-bold text-xl text-green-700'>
            Rp {payment.amount.toLocaleString('id-ID')}
          </span>
        </div>

        <div className='space-y-2 text-sm'>
          {payment.user && (
            <Row
              label='Nama Pembayar'
              value={payment.user.nama}
              color='text-blue-700 font-semibold'
            />
          )}
          {payment.transaction_id && (
            <Row label='ID Transaksi' value={payment.transaction_id} isCode />
          )}
          {payment.payment_type && (
            <Row label='Tipe Pembayaran' value={payment.payment_type} />
          )}
          {payment.bank && <Row label='Bank' value={payment.bank} />}
          {payment.va_number && (
            <Row label='Nomor VA' value={payment.va_number} isCode />
          )}
          {payment.expiry_time && (
            <Row
              label='Batas Waktu'
              value={formatDateTimeWithPukul(payment.expiry_time)}
              color='text-amber-600'
            />
          )}
          {payment.settled_at && (
            <Row
              label='Diselesaikan'
              value={formatDateTimeWithPukul(payment.settled_at)}
              color='text-green-600'
            />
          )}
        </div>

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
                  className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'
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
                  className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'
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
                className='w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl'
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

// Helper component for rows
const Row: React.FC<{
  label: string;
  value: string;
  isCode?: boolean;
  color?: string;
}> = ({ label, value, isCode = false, color = 'text-gray-800' }) => (
  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100 last:border-b-0'>
    <span className='text-gray-600 font-semibold text-sm'>{label}:</span>
    <span
      className={`${color} font-medium mt-1 sm:mt-0 ${
        isCode
          ? 'font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs border border-blue-100'
          : 'text-gray-800'
      }`}
    >
      {value}
    </span>
  </div>
);

export default PaymentCard;
