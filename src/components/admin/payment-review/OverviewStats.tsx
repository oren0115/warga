import {
  Banknote,
  BarChart3,
  CheckCircle,
  Clock,
  Clock3,
  DollarSign,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import React from 'react';
import type { PaymentStats } from '../../../hooks/usePaymentsReview';
import { Card, CardContent } from '../../ui/card';

export const OverviewStats: React.FC<{ stats: PaymentStats }> = ({ stats }) => (
  <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
    <Card className='hover:shadow-lg transition-all duration-300 border rounded-2xl'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1.5'>
            <p className='text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Total Pembayaran
            </p>
            <p className='text-xl sm:text-2xl font-bold text-gray-900 leading-tight'>
              {stats.total.toLocaleString()}
            </p>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <BarChart3 className='w-3.5 h-3.5 text-blue-500' />
              <span>
                Hari ini:{' '}
                <span className='font-semibold text-blue-600'>
                  {stats.todayTotal}
                </span>
              </span>
            </div>
          </div>
          <div className='p-2.5 sm:p-3.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm'>
            <Receipt className='w-5 h-5 sm:w-6 sm:h-6 text-blue-700' />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className='hover:shadow-lg transition-all duration-300 border rounded-2xl'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1.5'>
            <p className='text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Menunggu Review
            </p>
            <p className='text-xl sm:text-2xl font-bold text-yellow-600 leading-tight'>
              {stats.pending.toLocaleString()}
            </p>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <Clock3 className='w-3.5 h-3.5 text-yellow-500' />
              <span>Perlu tindak lanjut</span>
            </div>
          </div>
          <div className='p-2.5 sm:p-3.5 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-sm'>
            <Clock className='w-5 h-5 sm:w-6 sm:h-6 text-yellow-700' />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className='hover:shadow-lg transition-all duration-300 border rounded-2xl'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1.5'>
            <p className='text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Berhasil Diproses
            </p>
            <p className='text-xl sm:text-2xl font-bold text-green-600 leading-tight'>
              {stats.success.toLocaleString()}
            </p>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <TrendingUp className='w-3.5 h-3.5 text-green-500' />
              <span>
                Tingkat berhasil:{' '}
                <span className='font-semibold text-green-600'>
                  {stats.successRate}%
                </span>
              </span>
            </div>
          </div>
          <div className='p-2.5 sm:p-3.5 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm'>
            <CheckCircle className='w-5 h-5 sm:w-6 sm:h-6 text-green-700' />
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className='hover:shadow-lg transition-all duration-300 border rounded-2xl'>
      <CardContent className='p-4 sm:p-5'>
        <div className='flex items-start justify-between'>
          <div className='space-y-1.5'>
            <p className='text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wide'>
              Total Pendapatan
            </p>
            <p className='text-xl sm:text-2xl font-bold text-gray-900 leading-tight'>
              {stats.totalRevenue}
            </p>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <Banknote className='w-3.5 h-3.5 text-green-500' />
              <span>
                Bulan ini:{' '}
                <span className='font-semibold text-green-600'>
                  {stats.thisMonthTotal}
                </span>{' '}
                transaksi
              </span>
            </div>
          </div>
          <div className='p-2.5 sm:p-3.5 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm'>
            <DollarSign className='w-5 h-5 sm:w-6 sm:h-6 text-purple-700' />
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default OverviewStats;
