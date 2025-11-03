import React from 'react';
import { Calendar, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import type { FilterType } from '../../../hooks/useUserPaymentStatus';

interface MonthOption {
  value: string;
  label: string;
}

interface FilterToolbarProps {
  months: MonthOption[];
  selectedMonth: string;
  onChangeMonth: (value: string) => void;
  filter: FilterType;
  onChangeFilter: (value: FilterType) => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  months,
  selectedMonth,
  onChangeMonth,
  filter,
  onChangeFilter,
}) => {
  return (
    <div className='flex flex-col sm:flex-row gap-2'>
      <Select value={selectedMonth} onValueChange={onChangeMonth}>
        <SelectTrigger className='w-full sm:w-[180px] bg-white'>
          <Calendar className='w-4 h-4 mr-2' />
          <SelectValue placeholder='Pilih bulan' />
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filter} onValueChange={(v: any) => onChangeFilter(v)}>
        <SelectTrigger className='w-full sm:w-[140px] bg-white'>
          <Filter className='w-4 h-4 mr-2' />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Semua</SelectItem>
          <SelectItem value='normal'>Normal</SelectItem>
          <SelectItem value='orphaned'>Orphaned</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterToolbar;


