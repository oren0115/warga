import { Filter, RefreshCw, Search, TrendingUp } from 'lucide-react';
import React from 'react';
import type { DateRange, StatusFilter } from '../../../hooks/usePaymentsReview';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface Props {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  dateRange: DateRange;
  setDateRange: (v: DateRange) => void;
  filter: StatusFilter;
  setFilter: (v: StatusFilter) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

const SearchFiltersBar: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  dateRange,
  setDateRange,
  filter,
  setFilter,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className='flex flex-col space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <div className='p-2 bg-white rounded-lg shadow-sm'>
            {/* placeholder for icon from parent */}
          </div>
          <div>
            <div className='text-xl font-bold text-gray-900'>
              Tabel Data Transaksi Pembayaran
            </div>
          </div>
        </div>
        <Button
          onClick={onRefresh}
          disabled={isRefreshing}
          size='sm'
          className='font-medium text-white bg-green-600 hover:bg-green-700 border-green-20 cursor-pointer'
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`}
          />
          {isRefreshing ? 'Memuat...' : 'Refresh'}
        </Button>
      </div>

      <div className='flex flex-col lg:flex-row gap-4 items-start lg:items-center'>
        <div className='relative flex-1 w-full lg:max-w-md'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <Input
            placeholder='Cari metode, ID transaksi, atau nominal...'
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='pl-10 border-gray-200 focus:border-green-300 focus:ring-green-200'
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
            >
              ×
            </button>
          )}
        </div>

        <div className='hidden lg:flex gap-2'>
          {[
            { key: 'all', label: 'Semua Waktu' },
            { key: 'today', label: 'Hari Ini' },
            { key: 'week', label: '7 Hari' },
            { key: 'month', label: '30 Hari' },
          ].map(r => (
            <Button
              key={r.key}
              variant={
                dateRange === (r.key as DateRange) ? 'default' : 'outline'
              }
              onClick={() => setDateRange(r.key as DateRange)}
              size='sm'
              className='text-xs cursor-pointer'
            >
              {r.label}
            </Button>
          ))}
        </div>

        <div className='lg:hidden w-full'>
          <Select
            value={dateRange}
            onValueChange={v => setDateRange(v as DateRange)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder='Pilih rentang waktu' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Semua Waktu</SelectItem>
              <SelectItem value='today'>Hari Ini</SelectItem>
              <SelectItem value='week'>7 Hari</SelectItem>
              <SelectItem value='month'>30 Hari</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='hidden lg:flex flex-wrap gap-2'>
        {[
          { key: 'all', label: 'Semua' },
          { key: 'pending', label: 'Menunggu' },
          { key: 'success', label: 'Berhasil' },
          { key: 'failed', label: 'Gagal' },
        ].map(s => (
          <Button
            key={s.key}
            variant={filter === (s.key as StatusFilter) ? 'default' : 'outline'}
            onClick={() => setFilter(s.key as StatusFilter)}
            size='sm'
            className='text-sm font-medium cursor-pointer mb-5'
          >
            {s.key === 'all' && <TrendingUp className='w-4 h-4 mr-2 ' />}
            {s.key === 'pending' && <Filter className='w-4 h-4 mr-2 ' />}
            {s.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchFiltersBar;
