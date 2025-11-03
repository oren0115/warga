import { History } from 'lucide-react';
import React, { useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { adminService } from '../../../services/admin.service';
import type { RegenerationHistory as RegenerationHistoryType } from '../../../types';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import ConfirmationDialog from '../../ui/confirmation-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import Toast from '../../ui/toast';
import RegenerationHistoryList from './RegenerationHistoryList';

interface RegenerationHistoryProps {
  className?: string;
}

const RegenerationHistory: React.FC<RegenerationHistoryProps> = ({
  className = '',
}) => {
  const [history, setHistory] = useState<RegenerationHistoryType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRollbackDialog, setShowRollbackDialog] = useState(false);
  const [rollbackMonth, setRollbackMonth] = useState<string>('');
  const [isRollingBack, setIsRollingBack] = useState(false);
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Generate available months (last 12 months)
  const generateAvailableMonths = () => {
    const months = [];
    const currentDate = new Date();

    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      const monthValue = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
      });

      months.push({ value: monthValue, label: monthLabel });
    }

    return months;
  };

  const fetchHistory = async (bulan: string) => {
    if (!bulan) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getRegenerationHistory(bulan);
      setHistory(data);
    } catch (err: any) {
      console.error('Error fetching regeneration history:', err);
      setError(err.message || 'Gagal memuat history regenerasi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = (bulan: string) => {
    setRollbackMonth(bulan);
    setShowRollbackDialog(true);
  };

  const confirmRollback = async () => {
    setIsRollingBack(true);
    try {
      await adminService.rollbackRegeneration(rollbackMonth);
      // Refresh history after rollback
      await fetchHistory(rollbackMonth);
      showSuccess('Rollback berhasil dilakukan');
      setShowRollbackDialog(false);
    } catch (err: any) {
      console.error('Error rolling back regeneration:', err);
      showError(err.message || 'Gagal melakukan rollback');
    } finally {
      setIsRollingBack(false);
    }
  };

  return (
    <Card className={`shadow-lg ${className}`}>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <CardTitle className='flex items-center gap-2 text-lg sm:text-xl'>
            <History className='w-5 h-5' />
            Riwayat Regenerate Iuran
          </CardTitle>
          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-2'>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className='w-full sm:w-48 cursor-pointer'>
                <SelectValue placeholder='Pilih bulan' />
              </SelectTrigger>
              <SelectContent>
                {generateAvailableMonths().map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => fetchHistory(selectedMonth)}
              disabled={!selectedMonth || isLoading}
              size='sm'
              className='bg-green-600 hover:bg-green-700 w-full sm:w-auto cursor-pointer'
            >
              {isLoading ? 'Memuat...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {error && (
          <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700'>
            {error}
          </div>
        )}

        {!selectedMonth ? (
          <div className='text-center py-8 text-gray-500'>
            Pilih bulan untuk melihat riwayat regenerate iuran
          </div>
        ) : isLoading ? (
          <div className='text-center py-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto'></div>
            <p className='mt-2 text-gray-600'>Memuat riwayat...</p>
          </div>
        ) : history.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            Tidak ada riwayat regenerate iuran untuk bulan ini
          </div>
        ) : (
          <RegenerationHistoryList
            items={history}
            onRollback={handleRollback}
          />
        )}
      </CardContent>

      {/* Rollback Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showRollbackDialog}
        onClose={() => setShowRollbackDialog(false)}
        onConfirm={confirmRollback}
        title='Konfirmasi Rollback'
        description={`Apakah Anda yakin ingin melakukan rollback untuk bulan ${rollbackMonth}? Tindakan ini akan mengembalikan tagihan ke versi sebelumnya.`}
        confirmText='Ya, Rollback'
        cancelText='Batal'
        variant='warning'
        isLoading={isRollingBack}
      />

      {/* Toast Notifications */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </Card>
  );
};

export default RegenerationHistory;
