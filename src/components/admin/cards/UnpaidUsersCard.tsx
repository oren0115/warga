import { Users } from 'lucide-react';
import React from 'react';
import { useUserPaymentStatus } from '../../../hooks/useUserPaymentStatus';
import type { UnpaidUser } from '../../../types';
import { formatCurrency } from '../../../utils/format.utils';
import { formatAbsoluteTime } from '../../../utils/timezone.utils';
import { Badge } from '../../ui/badge';
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

interface UnpaidUsersCardProps {
  className?: string;
}

const UnpaidUsersCard: React.FC<UnpaidUsersCardProps> = ({
  className = '',
}) => {
  const {
    months,
    selectedMonth,
    setSelectedMonth,
    filter,
    setFilter,
    filteredUnpaidUsers,
    isLoading,
    error,
  } = useUserPaymentStatus();

  return (
    <Card
      className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}
    >
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Users className='w-5 h-5 text-red-600' />
          Warga Belum Membayar
        </CardTitle>
        <CardDescription>
          Daftar warga yang belum membayar iuran
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
          </div>
        )}

        {isLoading ? (
          <SkeletonList />
        ) : filteredUnpaidUsers.length === 0 ? (
          <div className='text-center py-8'>
            <div className='w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center'>
              <Users className='w-8 h-8 text-green-600' />
            </div>
            <h3 className='text-lg font-semibold text-gray-700 mb-2'>
              Semua Warga Sudah Membayar!
            </h3>
            <p className='text-gray-500'>
              Tidak ada warga yang belum membayar iuran untuk bulan ini.
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-between mb-4'>
              <p className='text-sm text-gray-600'>
                Total:{' '}
                <span className='font-semibold text-red-600'>
                  {filteredUnpaidUsers.length}
                </span>{' '}
                warga
              </p>
              <Badge variant='secondary' className='bg-red-100 text-red-800'>
                <Users className='w-3 h-3 mr-1' />
                Belum Bayar
              </Badge>
            </div>

            <div className='max-h-80 overflow-y-auto space-y-3'>
              {filteredUnpaidUsers.map((user: UnpaidUser) => (
                <UserCard key={user.fee_id} user={user} isPaid={false} />
              ))}
            </div>

            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='flex items-center justify-between text-sm text-gray-600'>
                <span>
                  Total tunggakan
                  {filter !== 'all' &&
                    ` (${filter === 'normal' ? 'User Aktif' : 'User Dihapus'})`}
                  :
                </span>
                <span className='font-semibold text-red-600'>
                  {formatCurrency(
                    filteredUnpaidUsers.reduce(
                      (sum, user) => sum + (user.nominal || 0),
                      0
                    )
                  )}
                </span>
              </div>
              <div className='text-xs text-gray-500 mt-1'>
                Terdekat jatuh tempo:{' '}
                {filteredUnpaidUsers
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.due_date).getTime() -
                      new Date(b.due_date).getTime()
                  )[0]
                  ? formatAbsoluteTime(
                      filteredUnpaidUsers
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(a.due_date).getTime() -
                            new Date(b.due_date).getTime()
                        )[0].due_date
                    )
                  : '-'}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnpaidUsersCard;
