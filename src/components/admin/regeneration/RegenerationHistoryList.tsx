import {
  AlertTriangle,
  CheckCircle,
  Clock,
  History,
  RotateCcw,
} from 'lucide-react';
import React from 'react';
import type { RegenerationHistory as RegenerationHistoryType } from '../../../types';
import { formatDateTimeWithPukul } from '../../../utils/format.utils';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

interface RegenerationHistoryListProps {
  items: RegenerationHistoryType[];
  onRollback: (month: string) => void;
}

const getActionIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case 'regenerate_fees':
      return <History className='w-4 h-4' />;
    case 'rollback':
      return <RotateCcw className='w-4 h-4' />;
    default:
      return <History className='w-4 h-4' />;
  }
};

const getActionColor = (action: string) => {
  switch (action.toLowerCase()) {
    case 'regenerate_fees':
      return 'bg-blue-100 text-blue-800';
    case 'rollback':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (action: string) => {
  switch (action.toLowerCase()) {
    case 'regenerate_fees':
      return <CheckCircle className='w-4 h-4 text-green-600' />;
    case 'rollback':
      return <AlertTriangle className='w-4 h-4 text-orange-600' />;
    default:
      return <Clock className='w-4 h-4 text-gray-600' />;
  }
};

export const RegenerationHistoryList: React.FC<
  RegenerationHistoryListProps
> = ({ items, onRollback }) => {
  return (
    <div className='space-y-4'>
      {items.map(item => (
        <div
          key={item.id}
          className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'
        >
          <div className='flex items-start justify-between'>
            <div className='flex items-start gap-3'>
              <div className='flex-shrink-0'>{getActionIcon(item.action)}</div>
              <div className='flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <Badge className={getActionColor(item.action)}>
                    {item.action.replace('_', ' ').toUpperCase()}
                  </Badge>
                  {getStatusIcon(item.action)}
                </div>

                <div className='text-sm text-gray-600 mb-2'>
                  <p>
                    <strong>Admin:</strong> {item.admin_user}
                  </p>
                  <p>
                    <strong>Waktu:</strong>{' '}
                    {formatDateTimeWithPukul(item.timestamp)}
                  </p>
                  {item.reason && (
                    <p>
                      <strong>Alasan:</strong> {item.reason}
                    </p>
                  )}
                </div>

                <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm'>
                  <div className='bg-green-50 p-2 rounded'>
                    <p className='text-green-700 font-medium text-xs'>
                      Tagihan Dibayar
                    </p>
                    <p className='text-base sm:text-lg font-bold text-green-800'>
                      {item.paid_fees_preserved}
                    </p>
                  </div>
                  <div className='bg-orange-50 p-2 rounded'>
                    <p className='text-orange-700 font-medium text-xs'>
                      Tagihan Diregenerate
                    </p>
                    <p className='text-base sm:text-lg font-bold text-orange-800'>
                      {item.unpaid_fees_regenerated}
                    </p>
                  </div>
                  <div className='bg-blue-50 p-2 rounded'>
                    <p className='text-blue-700 font-medium text-xs'>
                      Tagihan Baru
                    </p>
                    <p className='text-base sm:text-lg font-bold text-blue-800'>
                      {item.details.new_fees_created}
                    </p>
                  </div>
                  <div className='bg-gray-50 p-2 rounded'>
                    <p className='text-gray-700 font-medium text-xs'>
                      Total Terpengaruh
                    </p>
                    <p className='text-base sm:text-lg font-bold text-gray-800'>
                      {item.affected_fees_count}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {item.action === 'regenerate_fees' && (
              <Button
                onClick={() => onRollback(item.month)}
                variant='outline'
                size='sm'
                className='text-orange-600 border-orange-200 hover:bg-orange-50 cursor-pointer'
              >
                <RotateCcw className='w-4 h-4 mr-1' />
                Rollback
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RegenerationHistoryList;
