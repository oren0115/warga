import { Calendar as CalendarIcon, FileText } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

interface Props {
  onExport: (
    startDate: string,
    endDate: string,
    format: 'excel' | 'pdf'
  ) => Promise<Blob>;
}

const ExportSection: React.FC<Props> = ({ onExport }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handle = async (format: 'excel' | 'pdf') => {
    try {
      setIsExporting(true);
      const blob = await onExport(startDate, endDate, format);
      const filename = `laporan_pembayaran_${startDate}_${endDate}.${
        format === 'excel' ? 'xlsx' : 'pdf'
      }`;
      triggerDownload(blob, filename);
    } catch (e) {
      alert((e as any)?.message || 'Gagal mengekspor laporan pembayaran');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className='p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100'>
      <div className='flex items-center gap-2 mb-3'>
        <CalendarIcon className='w-5 h-5 text-blue-600' />
        <h3 className='font-semibold text-gray-700'>Export Laporan</h3>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3'>
        <div>
          <label className='text-xs font-medium text-gray-600 mb-1 block'>
            Tanggal Mulai
          </label>
          <Input
            type='date'
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className='w-full border-gray-200 bg-white'
          />
        </div>
        <div>
          <label className='text-xs font-medium text-gray-600 mb-1 block'>
            Tanggal Akhir
          </label>
          <Input
            type='date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className='w-full border-gray-200 bg-white'
          />
        </div>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => handle('excel')}
          disabled={isExporting}
          className='font-medium bg-white hover:bg-green-50 border-green-200 text-green-700'
        >
          <FileText className='w-4 h-4 mr-2' />
          <span className='hidden sm:inline'>Export </span>Excel
        </Button>
      </div>
    </div>
  );
};

export default ExportSection;
