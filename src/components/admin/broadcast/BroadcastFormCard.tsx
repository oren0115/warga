import { Bell, Clock, CreditCard, Volume2 } from 'lucide-react';
import React from 'react';
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
import { Skeleton } from '../../ui/skeleton';
import { Textarea } from '../../ui/textarea';

import type { BroadcastNotificationRequest } from '../../../types';

interface Props {
  isLoading: boolean;
  formData: BroadcastNotificationRequest;
  setFormData: React.Dispatch<
    React.SetStateAction<BroadcastNotificationRequest>
  >;
  message: string | null;
  error: string | null;
  broadcastResult: any;
  onSubmit: (e: React.FormEvent) => void;
}

export const BroadcastFormCard: React.FC<Props> = ({
  isLoading,
  formData,
  setFormData,
  message,
  error,
  broadcastResult,
  onSubmit,
}) => {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 border rounded-xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='w-6 h-6 text-green-600' />
          Kirim Notifikasi
        </CardTitle>
        <CardDescription>
          Kirim notifikasi ke semua warga dalam sistem
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className='space-y-6'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-36' />
              <Skeleton className='h-10 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-24 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <div className='bg-gray-50 rounded-lg p-4 border'>
                <div className='flex items-start space-x-3'>
                  <Skeleton className='h-4 w-4 mt-1' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-48' />
                    <Skeleton className='h-3 w-full' />
                    <Skeleton className='h-3 w-3/4' />
                    <Skeleton className='h-6 w-20' />
                  </div>
                </div>
              </div>
            </div>
            <Skeleton className='h-10 w-full' />
          </div>
        ) : (
          <form onSubmit={onSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='type'>Tipe Notifikasi</Label>
              <Select
                value={formData.notification_type}
                onValueChange={value =>
                  setFormData(prev => ({ ...prev, notification_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Pilih tipe notifikasi' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='pengumuman'>
                    <div className='flex items-center gap-2'>
                      <Volume2 className='w-4 h-4 text-green-600' />
                      Pengumuman
                    </div>
                  </SelectItem>
                  <SelectItem value='pembayaran'>
                    <div className='flex items-center gap-2'>
                      <CreditCard className='w-4 h-4 text-green-600' />
                      Pembayaran
                    </div>
                  </SelectItem>
                  <SelectItem value='reminder'>
                    <div className='flex items-center gap-2'>
                      <Clock className='w-4 h-4 text-yellow-600' />
                      Reminder
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='title'>Judul Notifikasi</Label>
              <Input
                id='title'
                value={formData.title}
                onChange={e =>
                  setFormData(prev => ({ ...prev, title: e.target.value }))
                }
                placeholder='Masukkan judul notifikasi'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='message'>Isi Notifikasi</Label>
              <Textarea
                id='message'
                value={formData.message}
                onChange={e =>
                  setFormData(prev => ({ ...prev, message: e.target.value }))
                }
                placeholder='Masukkan isi notifikasi'
                rows={4}
                required
              />
            </div>

            {formData.title && formData.message && (
              <div className='space-y-2'>
                <Label>Preview Notifikasi</Label>
                <div className='bg-gray-50 rounded-lg p-4 border'>
                  <div className='flex items-start space-x-3'>
                    <div className='flex-shrink-0 mt-1'>
                      {formData.notification_type === 'pengumuman' ? (
                        <Volume2 className='w-4 h-4 text-green-600' />
                      ) : formData.notification_type === 'pembayaran' ? (
                        <CreditCard className='w-4 h-4 text-green-600' />
                      ) : (
                        <Clock className='w-4 h-4 text-yellow-600' />
                      )}
                    </div>
                    <div className='flex-1'>
                      <h3 className='text-sm font-semibold text-gray-900 mb-1'>
                        {formData.title}
                      </h3>
                      <p className='text-sm text-gray-700'>
                        {formData.message}
                      </p>
                      <div className='mt-2'>
                        <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                          {formData.notification_type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {message && (
              <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                <p className='text-green-800 text-sm'>{message}</p>
              </div>
            )}
            {error && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <p className='text-red-800 text-sm'>{error}</p>
              </div>
            )}
            {broadcastResult?.message && (
              <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                <p className='text-blue-800 text-sm'>
                  {broadcastResult.message}
                </p>
              </div>
            )}

            <Button
              type='submit'
              disabled={isLoading || !formData.title || !formData.message}
              className='w-full gap-2'
            >
              <Bell className='w-4 h-4' />
              Kirim Notifikasi
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default BroadcastFormCard;
