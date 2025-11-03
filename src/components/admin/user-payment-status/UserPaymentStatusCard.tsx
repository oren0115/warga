import { AlertCircle, CheckCircle2, Users } from 'lucide-react';
import React from 'react';
import { useUserPaymentStatus } from '../../../hooks/useUserPaymentStatus';
import { Alert, AlertDescription } from '../../ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { FilterToolbar } from './FilterToolbar';
import { SkeletonList } from './SkeletonList';
import { UserCard } from './UserCard';

interface UserPaymentStatusCardProps {
  className?: string;
}

const UserPaymentStatusCard: React.FC<UserPaymentStatusCardProps> = ({
  className = '',
}) => {
  const {
    filteredPaidUsers,
    filteredUnpaidUsers,
    isLoading,
    error,
    filter,
    setFilter,
    months,
    selectedMonth,
    setSelectedMonth,
  } = useUserPaymentStatus();

  return (
    <Card
      className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}
    >
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div>
            <CardTitle className='flex items-center gap-2'>
              <Users className='w-5 h-5' />
              Status Pembayaran Warga
            </CardTitle>
            <CardDescription>
              Pantau warga yang sudah dan belum membayar iuran
            </CardDescription>
          </div>

          <FilterToolbar
            months={months}
            selectedMonth={selectedMonth}
            onChangeMonth={setSelectedMonth}
            filter={filter}
            onChangeFilter={setFilter}
          />
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <Alert variant='destructive' className='mb-4'>
            <AlertCircle className='h-4 w-4' />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue='paid' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-6'>
            <TabsTrigger
              value='paid'
              className='flex items-center gap-2 cursor-pointer data-[state=active]:bg-green-700 data-[state=active]:text-white'
            >
              <CheckCircle2 className='w-4 h-4' />
              <span>Sudah Bayar ({filteredPaidUsers.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value='unpaid'
              className='flex items-center gap-2 cursor-pointer data-[state=active]:bg-red-700 data-[state=active]:text-white'
            >
              <AlertCircle className='w-4 h-4' />
              <span>Belum Bayar ({filteredUnpaidUsers.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value='paid' className='space-y-4'>
            {isLoading ? (
              <SkeletonList />
            ) : filteredPaidUsers.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <CheckCircle2 className='w-12 h-12 mx-auto mb-4 text-green-500' />
                <p className='text-lg font-medium'>Tidak ada data pembayaran</p>
                <p className='text-sm'>
                  Semua warga belum membayar untuk bulan ini
                </p>
              </div>
            ) : (
              <div className='space-y-4 max-h-96 overflow-y-auto'>
                {filteredPaidUsers.map(user => (
                  <UserCard key={user.user_id} user={user} isPaid={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='unpaid' className='space-y-4'>
            {isLoading ? (
              <SkeletonList />
            ) : filteredUnpaidUsers.length === 0 ? (
              <div className='text-center py-8 text-gray-500'>
                <CheckCircle2 className='w-12 h-12 mx-auto mb-4 text-green-500' />
                <p className='text-lg font-medium'>
                  Semua warga sudah membayar!
                </p>
                <p className='text-sm'>
                  Tidak ada warga yang belum membayar untuk bulan ini
                </p>
              </div>
            ) : (
              <div className='space-y-4 max-h-96 overflow-y-auto'>
                {filteredUnpaidUsers.map(user => (
                  <UserCard key={user.user_id} user={user} isPaid={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default UserPaymentStatusCard;
