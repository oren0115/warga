import { FileText, Users } from 'lucide-react';
import React from 'react';
import { AdminStatsCard } from '..';

interface Props {
  totalUsers?: number;
  totalFees?: number;
}

export const OverviewStatsGrid: React.FC<Props> = ({
  totalUsers = 0,
  totalFees = 0,
}) => {
  return (
    <div className='grid grid-cols-2 gap-6'>
      <AdminStatsCard
        title='Total Warga'
        value={totalUsers}
        description='Terdaftar di sistem'
        icon={<Users className='w-7 h-7' />}
        iconBgColor='bg-gradient-to-br from-blue-100 to-blue-50'
        iconTextColor='text-blue-700'
      />
      <AdminStatsCard
        title='Total Iuran'
        value={totalFees}
        description='Iuran bulanan'
        icon={<FileText className='w-7 h-7' />}
        iconBgColor='bg-gradient-to-br from-green-100 to-green-50'
        iconTextColor='text-green-700'
      />
    </div>
  );
};

export default OverviewStatsGrid;
