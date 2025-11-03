import { CheckCircle2, Users } from 'lucide-react';
import React from 'react';
import { useUserPaymentStatus } from '../../../hooks/useUserPaymentStatus';
import type { PaidUser } from '../../../types';
import { formatCurrency } from '../../../utils/format.utils';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { FilterToolbar } from '../user-payment-status/FilterToolbar';
import { SkeletonList } from '../user-payment-status/SkeletonList';
import { UserCard } from '../user-payment-status/UserCard';

interface PaidUsersCardProps {
  className?: string;
}

const PaidUsersCard: React.FC<PaidUsersCardProps> = ({ className = '' }) => {
  const {
    months,
    selectedMonth,
    setSelectedMonth,
    filter,
    setFilter,
    filteredPaidUsers,
    isLoading,
    error,
  } = useUserPaymentStatus();

  return (
    <Card
      className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}
    >
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <CheckCircle2 className='w-5 h-5 text-green-600' />
          Warga yang Sudah Membayar
        </CardTitle>
        <CardDescription>
          Daftar warga yang telah menyelesaikan pembayaran iuran
        </CardDescription>

        <FilterToolbar
          months={months}
          selectedMonth={selectedMonth}
          onChangeMonth={setSelectedMonth}
          filter={filter}
          onChangeFilter={setFilter}
        />
      </CardHeader>

      <CardContent>
        {error && (
          <div className='text-center py-8'>
            <p className='text-red-600 mb-4'>{error}</p>
            <Button variant='outline'>Coba Lagi</Button>
          </div>
        )}

        {isLoading ? (
          <SkeletonList />
        ) : filteredPaidUsers.length === 0 ? (
          <div className='text-center py-8'>
            <Users className='w-12 h-12 text-gray-400 mx-auto mb-4' />
            <p className='text-gray-500'>
              Belum ada warga yang membayar pada bulan ini
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-sm text-gray-600'>
                Total:{' '}
                <span className='font-semibold text-green-600'>
                  {filteredPaidUsers.length}
                </span>{' '}
                warga
              </p>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800'
              >
                <Users className='w-3 h-3 mr-1' />
                Sudah Bayar
              </Badge>
            </div>

            <div className='max-h-80 overflow-y-auto space-y-3'>
              {filteredPaidUsers.map((user: PaidUser) => (
                <UserCard
                  key={`${user.user_id}-${user.fee_id}`}
                  user={user}
                  isPaid={true}
                />
              ))}
            </div>

            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>
                  Total yang sudah dibayar
                  {filter !== 'all' &&
                    ` (${filter === 'normal' ? 'User Aktif' : 'User Dihapus'})`}
                  :
                </span>
                <span className='font-semibold text-green-600'>
                  {formatCurrency(
                    filteredPaidUsers.reduce(
                      (sum, u) => sum + (u.nominal || 0),
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaidUsersCard;
