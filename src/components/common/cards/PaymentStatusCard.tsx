import React from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface PaymentStatusCardProps {
  title: string;
  badgeVariant: any;
  badgeText: string;
  isChecking?: boolean;
  lastPaymentId?: string | null;
  onForceCheck?: () => void;
}

const PaymentStatusCard: React.FC<PaymentStatusCardProps> = ({
  title,
  badgeVariant,
  badgeText,
  isChecking,
  lastPaymentId,
  onForceCheck,
}) => {
  return (
    <Card className='shadow-xl border-0 bg-gradient-to-br from-white to-gray-50'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          {title}
          {isChecking && (
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-green-600'></div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className='text-center'>
        <Badge variant={badgeVariant} className='px-4 py-2 text-base'>
          {badgeText}
        </Badge>
        {lastPaymentId && onForceCheck && (
          <div className='mt-4 space-y-2'>
            <p className='text-sm text-blue-600'>
              🔄 Memeriksa status pembayaran secara otomatis...
            </p>
            <Button
              onClick={onForceCheck}
              disabled={isChecking}
              variant='outline'
              size='sm'
              className='w-full'
            >
              {isChecking ? 'Memeriksa...' : 'Paksa Periksa Status'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentStatusCard;
