import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Home,
  Phone,
  UserX,
} from 'lucide-react';
import React from 'react';
import type { PaidUser, UnpaidUser } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/format.utils';
import { getPaymentMethodMeta } from '../../../utils/paymentMethod.utils';
import { formatAbsoluteTime } from '../../../utils/timezone.utils';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';

interface UserCardProps {
  user: PaidUser | UnpaidUser;
  isPaid: boolean;
}

// payment method mapping moved to shared util

const safeFormatDate = (dateString: string): string => {
  if (
    !dateString ||
    dateString.trim() === '' ||
    dateString === '""' ||
    dateString === 'null'
  ) {
    return 'Tanggal tidak tersedia';
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Tanggal tidak valid';
  }
  return formatDate(dateString);
};

export const UserCard: React.FC<UserCardProps> = ({ user, isPaid }) => {
  const isOrphaned = user.is_orphaned;
  return (
    <Card
      key={user.user_id}
      className={`transition-all duration-200 hover:shadow-md ${
        isOrphaned ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'
      }`}
    >
      <CardContent className='p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-2'>
              <h3 className='font-semibold text-gray-900 truncate'>
                {user.nama}
              </h3>
              {isOrphaned && (
                <Badge
                  variant='outline'
                  className='text-orange-600 border-orange-300'
                >
                  <UserX className='w-3 h-3 mr-1' />
                  Orphaned
                </Badge>
              )}
              {isPaid && (
                <Badge
                  variant='outline'
                  className='text-green-600 border-green-300'
                >
                  <CheckCircle2 className='w-3 h-3 mr-1' />
                  Paid
                </Badge>
              )}
            </div>

            <div className='space-y-1 text-sm text-gray-600'>
              <div className='flex items-center gap-2'>
                <Home className='w-4 h-4' />
                <span className='truncate'>{user.nomor_rumah}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Phone className='w-4 h-4' />
                <span>{user.nomor_hp}</span>
              </div>
              {isPaid &&
                'payment_date' in user &&
                user.payment_date &&
                user.payment_date.trim() !== '' &&
                user.payment_date !== '""' && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span>Dibayar: {safeFormatDate(user.payment_date)}</span>
                  </div>
                )}
              {isPaid &&
                (!('payment_date' in user) ||
                  !user.payment_date ||
                  user.payment_date.trim() === '' ||
                  user.payment_date === '""') && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='w-4 h-4' />
                    <span className='text-gray-500'>
                      Tanggal pembayaran tidak tersedia
                    </span>
                  </div>
                )}
              {isPaid && 'nominal' in user && (
                <div className='flex items-center gap-2'>
                  <DollarSign className='w-4 h-4' />
                  <span className='font-semibold text-green-600'>
                    {formatCurrency(user.nominal)}
                  </span>
                </div>
              )}
              {isPaid && 'payment_method' in user && user.payment_method && (
                <div className='flex items-center gap-2'>
                  {getPaymentMethodMeta(user.payment_method).icon}
                  <span className='text-sm text-gray-600'>
                    {getPaymentMethodMeta(user.payment_method).text}
                  </span>
                </div>
              )}
              {!isPaid && (
                <div className='flex items-center gap-2'>
                  <Calendar className='w-4 h-4' />
                  <span className='text-orange-600'>
                    Jatuh tempo: {formatAbsoluteTime(user.due_date)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
