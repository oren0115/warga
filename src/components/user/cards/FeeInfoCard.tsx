import { CalendarDays, Wallet } from 'lucide-react';
import React from 'react';
import type { Fee } from '../../../types';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface FeeInfoCardProps {
  fee: Fee;
  formatDate: (date: string) => string;
  formatMonth: (bulan: string) => string;
  getYearFromBulan: (bulan: string) => string;
  getDueDateFromBulan: (bulan: string) => Date;
  getStatusVariant: (status: string) => any;
}

const FeeInfoCard: React.FC<FeeInfoCardProps> = ({
  fee,
  formatDate,
  formatMonth,
  getYearFromBulan,
  getDueDateFromBulan,
  getStatusVariant,
}) => {
  const dueDate = getDueDateFromBulan(fee.bulan);
  const currentDate = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
  );
  const timeDiff = dueDate.getTime() - currentDate.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return (
    <Card className='shadow-xl border-0 bg-gradient-to-br from-white to-gray-50'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Wallet className='w-5 h-5 text-gray-600' />
          Detail Iuran {fee.kategori}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='text-center py-4 bg-green-50 rounded-lg border border-green-200'>
          <div className='text-3xl font-bold text-green-700'>
            Rp {fee.nominal.toLocaleString()}
          </div>
          <div className='text-sm text-green-600 mt-1'>
            Nominal Iuran {formatMonth(fee.bulan)} {getYearFromBulan(fee.bulan)}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Bulan:</span>
              <span className='font-medium'>{formatMonth(fee.bulan)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Tahun:</span>
              <span className='font-medium'>{getYearFromBulan(fee.bulan)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Tipe Rumah:</span>
              <span className='font-medium'>{fee.kategori}</span>
            </div>
          </div>

          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <span className='flex items-center gap-1 text-gray-600'>
                <CalendarDays className='w-4 h-4' />
                Jatuh Tempo:
              </span>
              <span className='font-medium'>
                {dueDate.toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'Asia/Jakarta',
                })}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Dibuat:</span>
              <span className='font-medium'>{formatDate(fee.created_at)}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Status:</span>
              <Badge
                variant={getStatusVariant(fee.status)}
                className='px-2 py-1'
              >
                {fee.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className='pt-4 border-t border-gray-200'>
          <div className='text-center'>
            <div className='text-sm text-gray-600 mb-2'>
              Sisa Waktu Pembayaran
            </div>
            <div
              className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                daysDiff > 0
                  ? daysDiff <= 3
                    ? 'bg-red-100 text-red-700'
                    : daysDiff <= 7
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-green-100 text-green-700'
                  : daysDiff === 0
                  ? 'bg-red-100 text-red-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {daysDiff > 0
                ? `${daysDiff} hari lagi`
                : daysDiff === 0
                ? 'Hari ini'
                : `Terlambat ${Math.abs(daysDiff)} hari`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeeInfoCard;
