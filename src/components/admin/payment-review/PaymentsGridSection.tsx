import { Receipt, RefreshCw, Search, TrendingUp } from 'lucide-react';
import React from 'react';
import { AdminPagination } from '..';
import type { Payment } from '../../../types';
import { PaymentCard } from '../../user';
import { Button } from '../../ui/button';

interface Props {
  payments: Payment[];
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  onItemsPerPageChange: (n: number) => void;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  filterActive: boolean;
}

const PaymentsGridSection: React.FC<Props> = ({
  payments,
  totalItems,
  currentPage,
  itemsPerPage,
  totalPages,
  onPageChange,
  onItemsPerPageChange,
  onRefresh,
  isRefreshing,
  filterActive,
}) => {
  if (payments.length > 0) {
    return (
      <>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start'>
          {payments.map(payment => (
            <PaymentCard
              key={payment.id}
              payment={payment}
              onRefresh={onRefresh}
              className='w-full'
              isAdmin={true}
            />
          ))}
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          itemsPerPageOptions={[5, 10, 25, 50]}
          showItemsPerPage={true}
          className='mt-8'
          filterInfo='transaksi'
        />
      </>
    );
  }

  return (
    <div className='text-center py-20'>
      <div className='flex flex-col items-center space-y-6'>
        <div className='p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full'>
          {filterActive ? (
            <Search className='w-16 h-16 text-gray-400' />
          ) : (
            <Receipt className='w-16 h-16 text-gray-400' />
          )}
        </div>
        <div className='max-w-lg space-y-4'>
          <h3 className='text-2xl font-bold text-gray-900'>
            {filterActive
              ? 'Tidak Ada Hasil Ditemukan'
              : 'Belum Ada Transaksi Pembayaran'}
          </h3>
          <div className='space-y-2'>
            <p className='text-gray-600 leading-relaxed'>
              {filterActive
                ? 'Tidak ditemukan transaksi yang sesuai dengan kriteria pencarian atau filter yang Anda terapkan.'
                : 'Sistem pembayaran siap digunakan. Transaksi pembayaran dari warga akan muncul di sini setelah ada yang melakukan pembayaran.'}
            </p>
          </div>
          <div className='flex justify-center space-x-3'>
            {filterActive && (
              <Button className='font-medium' onClick={onRefresh}>
                <TrendingUp className='w-4 h-4 mr-2' /> Reset Semua Filter
              </Button>
            )}
            <Button
              onClick={onRefresh}
              variant='outline'
              disabled={isRefreshing}
              className='font-medium'
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              {isRefreshing ? 'Memuat...' : 'Refresh Data'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsGridSection;
