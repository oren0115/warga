import { Calendar, CreditCard } from 'lucide-react';
import React from 'react';
import type { Fee } from '../../types';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import StatusBadge from './StatusBadge';

interface FeeCardProps {
  fee: Fee;
  onPay?: (feeId: string) => void;
  onView?: (feeId: string) => void;
  showDueDate?: boolean;
  showPaymentButton?: boolean;
  className?: string;
}

const FeeCard: React.FC<FeeCardProps> = ({
  fee,
  onPay,
  onView,
  showDueDate = true,
  showPaymentButton = true,
  className = '',
}) => {
  const getMonthName = (monthNum: string) => {
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
    if (monthNum.includes('-')) {
      month = parseInt(monthNum.split('-')[1]);
    } else {
      month = parseInt(monthNum);
    }

    return months[month - 1] || monthNum;
  };

  const getDaysUntilDueDate = (dueDateString: string) => {
    const currentDate = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
    );

    // Parse due_date from database (ISO string)
    const dueDate = new Date(dueDateString);

    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
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

  const daysUntilDue = getDaysUntilDueDate(fee.due_date);
  const canPay =
    fee.status.toLowerCase() === 'belum bayar' ||
    fee.status.toLowerCase() === 'pending' ||
    fee.status.toLowerCase() === 'failed';

  const isPaid = fee.status.toLowerCase() === 'lunas';

  return (
    <Card
      className={`shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 ${className}`}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='text-lg font-semibold text-gray-900 mb-1'>
              Tipe Rumah {fee.kategori}
            </CardTitle>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <Calendar className='w-4 h-4' />
              <span>
                {getMonthName(fee.bulan)} {getYearFromBulan(fee.bulan)}
              </span>
            </div>
          </div>
          <StatusBadge status={fee.status} />
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        <div className='text-2xl font-bold text-gray-900'>
          {formatCurrency(fee.nominal)}
        </div>

        {showDueDate && (
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Tahun:</span>
              <span className='font-medium'>{getYearFromBulan(fee.bulan)}</span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Jatuh Tempo:</span>
              <span className='font-medium'>
                {new Date(fee.due_date).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'Asia/Jakarta',
                })}
              </span>
            </div>

            <div className='flex justify-between items-center'>
              <span className='text-gray-600'>Sisa Waktu:</span>
              {(() => {
                if (daysUntilDue > 0) {
                  return (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        daysUntilDue <= 3
                          ? 'bg-red-100 text-red-700'
                          : daysUntilDue <= 7
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {daysUntilDue} hari lagi
                    </span>
                  );
                } else if (daysUntilDue === 0) {
                  return (
                    <span className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium'>
                      Hari ini
                    </span>
                  );
                } else {
                  return (
                    <span className='text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium'>
                      Terlambat {Math.abs(daysUntilDue)} hari
                    </span>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </CardContent>

      {showPaymentButton && (
        <CardFooter className='pt-3'>
          <Button
            className={`w-full ${
              canPay
                ? 'bg-green-600 hover:bg-green-700 text-white font-semibold'
                : isPaid
                ? 'bg-green-100 hover:bg-green-200 text-green-700'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            variant={canPay ? 'default' : 'outline'}
            disabled={isPaid}
            onClick={() => {
              if (canPay && onPay) {
                onPay(fee.id);
              } else if (onView) {
                onView(fee.id);
              }
            }}
          >
            {canPay ? (
              <>
                <CreditCard className='w-5 h-5 mr-2' />
                Bayar Sekarang
              </>
            ) : isPaid ? (
              <>
                <CreditCard className='w-5 h-5 mr-2' />
                Sudah Lunas
              </>
            ) : (
              'Lihat Detail'
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default FeeCard;
