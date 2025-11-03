import { AlertCircle, CheckCircle2, Receipt } from 'lucide-react';
import React from 'react';
import { AdminStatsCard } from '..';

interface Props {
  approvedPayments?: number;
  pendingPayments?: number;
  unpaidFees?: number;
}

export const PaymentsStatsSection: React.FC<Props> = ({
  approvedPayments = 0,
  pendingPayments = 0,
  unpaidFees = 0,
}) => {
  return (
    <div className='space-y-4'>
      <div className='grid grid-cols-1'>
        <AdminStatsCard
          title='Pembayaran Berhasil'
          value={approvedPayments}
          description='Transaksi selesai'
          icon={<Receipt className='w-6 h-6 sm:w-7 sm:h-7' />}
          iconBgColor='bg-gradient-to-br from-purple-100 to-purple-50'
          iconTextColor='text-purple-700'
          valueColor='text-green-600'
        />
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <AdminStatsCard
          title='Menunggu Verifikasi'
          value={pendingPayments}
          description='Perlu tindak lanjut'
          icon={<CheckCircle2 className='w-6 h-6 sm:w-7 sm:h-7' />}
          iconBgColor='bg-gradient-to-br from-yellow-100 to-yellow-50'
          iconTextColor='text-yellow-700'
          valueColor='text-yellow-600'
        />
        <AdminStatsCard
          title='Belum Membayar'
          value={unpaidFees}
          description='Perlu tindak lanjut'
          icon={<AlertCircle className='w-6 h-6 sm:w-7 sm:h-7' />}
          iconBgColor='bg-gradient-to-br from-red-100 to-red-50'
          iconTextColor='text-red-700'
          valueColor='text-red-600'
        />
      </div>
    </div>
  );
};

export default PaymentsStatsSection;
