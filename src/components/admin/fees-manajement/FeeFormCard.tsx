import { AlertTriangle, Info } from 'lucide-react';
import React from 'react';
import type { FeeFormData } from '../../../hooks/useGenerateFees';
import { Alert, AlertDescription, AlertTitle } from '../../ui/alert';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

interface Props {
  isLoading: boolean;
  message: string;
  error: string;
  months: { value: string; label: string }[];
  currentYear: number;
  formData: FeeFormData;
  setFormData: (updater: (prev: FeeFormData) => FeeFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onOpenRegenerate: () => void;
}

export const FeeFormCard: React.FC<Props> = ({
  isLoading,
  message,
  error,
  months,
  currentYear,
  formData,
  setFormData,
  onSubmit,
  onOpenRegenerate,
}) => {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 border rounded-xl mb-4'>
      <CardHeader>
        <CardTitle className='text-xl text-gray-800'>Buat Iuran Baru</CardTitle>
        <CardDescription>
          Pilih bulan untuk membuat iuran semua warga
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className='mb-4 bg-green-50 border-green-200'>
            <Info className='h-4 w-4 text-green-600' />
            <AlertTitle className='text-green-700'>Berhasil</AlertTitle>
            <AlertDescription className='text-green-700'>
              {message}
            </AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className='mb-4 bg-red-50 border-red-200'>
            <AlertTriangle className='h-4 w-4 text-red-600' />
            <AlertTitle className='text-red-700'>Error</AlertTitle>
            <AlertDescription className='text-red-700'>
              {error}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={onSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='bulan'>Pilih Bulan</Label>
            <Select
              value={formData.bulan}
              onValueChange={(val: string) =>
                setFormData(prev => ({ ...prev, bulan: val }))
              }
            >
              <SelectTrigger id='bulan' className='cursor-pointer'>
                <SelectValue placeholder='-- Pilih Bulan --' />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem
                    key={m.value}
                    value={m.value}
                    className='cursor-pointer'
                  >
                    {m.label} {currentYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className='text-xs text-gray-500'>
              Iuran akan dibuat untuk semua warga yang terdaftar
            </p>
          </div>

          <div className='space-y-4'>
            <div>
              <h3 className='text-lg font-semibold text-gray-800 mb-3'>
                Tarif IPL per Tipe Rumah
              </h3>
              <p className='text-sm text-gray-600 mb-4'>
                Masukkan tarif IPL untuk setiap tipe rumah
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='tarif_60m2'>Tarif Rumah 60M²</Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                    Rp
                  </span>
                  <Input
                    id='tarif_60m2'
                    type='number'
                    value={formData.tarif_60m2 || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        tarif_60m2: parseInt(e.target.value) || 0,
                      }))
                    }
                    className='pl-10'
                    placeholder='0'
                    min='0'
                  />
                </div>
                <p className='text-xs text-gray-500'>
                  Tarif untuk rumah tipe 60M²
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tarif_72m2'>Tarif Rumah 72M²</Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                    Rp
                  </span>
                  <Input
                    id='tarif_72m2'
                    type='number'
                    value={formData.tarif_72m2 || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        tarif_72m2: parseInt(e.target.value) || 0,
                      }))
                    }
                    className='pl-10'
                    placeholder='0'
                    min='0'
                  />
                </div>
                <p className='text-xs text-gray-500'>
                  Tarif untuk rumah tipe 72M²
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='tarif_hook'>Tarif Rumah Hook</Label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                    Rp
                  </span>
                  <Input
                    id='tarif_hook'
                    type='number'
                    value={formData.tarif_hook || ''}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        tarif_hook: parseInt(e.target.value) || 0,
                      }))
                    }
                    className='pl-10'
                    placeholder='0'
                    min='0'
                  />
                </div>
                <p className='text-xs text-gray-500'>
                  Tarif untuk rumah tipe Hook
                </p>
              </div>
            </div>
          </div>

          <Alert className='bg-yellow-50 border-yellow-200'>
            <AlertTriangle className='h-4 w-4 text-yellow-600' />
            <AlertTitle className='text-yellow-800'>Perhatian</AlertTitle>
            <AlertDescription className='text-yellow-700'>
              Pastikan Anda memilih bulan yang benar dan mengisi tarif yang
              sesuai. Proses ini akan membuat iuran untuk semua warga yang
              terdaftar berdasarkan tipe rumah mereka.
            </AlertDescription>
          </Alert>

          <div className='flex justify-end gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={onOpenRegenerate}
              className='px-6 py-2 cursor-pointer'
              disabled={isLoading || !formData.bulan}
            >
              {isLoading ? 'Memproses...' : 'Regenerate Iuran'}
            </Button>
            <Button
              type='submit'
              className='bg-green-600 hover:bg-green-700 text-white px-6 py-2 cursor-pointer'
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Generate Iuran'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeeFormCard;
