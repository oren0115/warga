import { CheckCircle, Wifi, WifiOff, XCircle } from 'lucide-react';
import React from 'react';
import type { TelegramTestResponse } from '../../../types';
import { Button } from '../../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';

interface Props {
  telegramStatus: TelegramTestResponse | null;
  isTestingTelegram: boolean;
  onTest: () => void;
}

export const TelegramStatusCard: React.FC<Props> = ({
  telegramStatus,
  isTestingTelegram,
  onTest,
}) => {
  return (
    <Card className='hover:shadow-lg transition-all duration-300 border rounded-xl'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {telegramStatus?.success ? (
            <Wifi className='w-5 h-5 text-green-600' />
          ) : (
            <WifiOff className='w-5 h-5 text-red-600' />
          )}
          Status Telegram Bot
        </CardTitle>
        <CardDescription>
          Status koneksi ke Telegram Bot untuk pengiriman notifikasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isTestingTelegram ? (
          <div className='flex items-center gap-2'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600'></div>
            <span className='text-sm text-gray-600'>Menguji koneksi...</span>
          </div>
        ) : telegramStatus ? (
          <div
            className={`flex items-center gap-2 p-3 rounded-lg ${
              telegramStatus.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {telegramStatus.success ? (
              <CheckCircle className='w-4 h-4 text-green-600' />
            ) : (
              <XCircle className='w-4 h-4 text-red-600' />
            )}
            <span
              className={`text-sm ${
                telegramStatus.success ? 'text-green-800' : 'text-red-800'
              }`}
            >
              {telegramStatus.message}
            </span>
          </div>
        ) : (
          <div className='text-sm text-gray-500'>Belum diuji</div>
        )}
        <Button
          onClick={onTest}
          disabled={isTestingTelegram}
          variant='outline'
          size='sm'
          className='mt-3'
        >
          {isTestingTelegram ? 'Menguji...' : 'Test Koneksi'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TelegramStatusCard;
