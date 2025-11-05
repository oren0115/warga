import { Receipt } from 'lucide-react';
import React from 'react';
import { AdminPageHeader } from '../../../components/admin';
import ExportSection from '../../../components/admin/payment-review/ExportSection';
import OverviewStats from '../../../components/admin/payment-review/OverviewStats';
import PaymentsGridSection from '../../../components/admin/payment-review/PaymentsGridSection';
import SearchFiltersBar from '../../../components/admin/payment-review/SearchFiltersBar';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { usePaymentsReview } from '../../../hooks/usePaymentsReview';

const PaymentReview: React.FC = () => {
  const {
    stats,
    isLoading,
    isRefreshing,
    error,
    filter,
    setFilter,
    dateRange,
    setDateRange,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    paginatedPayments,
    filteredPayments,
    handleRefresh,
    handleExport,
  } = usePaymentsReview();

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 sm:p-6'>
        <div className='max-w-6xl mx-auto space-y-4 sm:space-y-6'>
          {/* Header skeleton */}
          <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 sm:p-5 text-white'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/30 rounded-lg'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-white/30 rounded w-40 sm:w-64'></div>
                <div className='h-3 bg-white/20 rounded w-56 sm:w-80'></div>
              </div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4'>
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4'
              >
                <div className='flex items-center justify-between'>
                  <div className='space-y-2 w-2/3'>
                    <div className='h-3 bg-gray-200 rounded w-20'></div>
                    <div className='h-5 bg-gray-200 rounded w-12'></div>
                    <div className='h-3 bg-gray-100 rounded w-16'></div>
                  </div>
                  <div className='w-8 h-8 bg-gray-100 rounded-xl'></div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters skeleton */}
          <div className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4'>
            <div className='space-y-3'>
              <div className='h-9 bg-gray-200 rounded w-full'></div>
              <div className='hidden lg:flex gap-2'>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className='h-8 bg-gray-200 rounded w-20'></div>
                ))}
              </div>
            </div>
          </div>

          {/* Grid skeleton */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='bg-white border border-gray-200 rounded-xl p-4 space-y-3'
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 bg-gray-200 rounded'></div>
                    <div className='h-4 bg-gray-200 rounded w-24'></div>
                  </div>
                  <div className='h-6 bg-gray-200 rounded w-16'></div>
                </div>
                <div className='h-10 bg-gray-100 rounded'></div>
                <div className='space-y-2'>
                  <div className='h-3 bg-gray-200 rounded w-full'></div>
                  <div className='h-3 bg-gray-200 rounded w-2/3'></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100'>
      <AdminPageHeader
        title='Review Pembayaran'
        subtitle='Kelola pembayaran iuran IPL Cluster Anda dengan mudah'
        icon={<Receipt className='w-5 h-5 md:w-6 md:h-6 text-white' />}
      />

      <div className='container mx-auto px-4 md:px-6 space-y-6 pb-10 md:pb-16'>
        {error && (
          <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
            <div className='flex items-center justify-between'>
              <span>{error}</span>
              <Button
                size='sm'
                variant='outline'
                onClick={handleRefresh}
                className='cursor-pointer'
              >
                Coba Lagi
              </Button>
            </div>
          </div>
        )}

        <OverviewStats stats={stats} />

        <Card className='shadow-lg border border-gray-200'>
          <div className='border-b bg-gradient-to-r from-gray-50 to-white p-6'>
            <SearchFiltersBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              dateRange={dateRange}
              setDateRange={setDateRange}
              filter={filter as any}
              setFilter={setFilter as any}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
          <div className='p-6'>
            <PaymentsGridSection
              payments={paginatedPayments}
              totalItems={filteredPayments.length}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={n => {
                setItemsPerPage(n);
                setCurrentPage(1);
              }}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
              filterActive={
                Boolean(searchTerm) || filter !== 'all' || dateRange !== 'all'
              }
            />
          </div>
        </Card>

        <ExportSection onExport={handleExport} />
      </div>
    </div>
  );
};

export default PaymentReview;
