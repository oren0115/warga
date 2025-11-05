import { CreditCard } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';

interface PayNowCardProps {
  onPay: () => void;
  disabled?: boolean;
}

const PayNowCard: React.FC<PayNowCardProps> = ({ onPay, disabled }) => {
  return (
    <Card className='shadow-xl border-0 bg-gradient-to-br from-white to-gray-50'>
      <CardHeader>
        <CardTitle>Bayar Iuran</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onPay}
          disabled={disabled}
          className='w-full mt-2 bg-green-600 hover:bg-green-700 shadow-lg text-white font-semibold py-3 text-lg'
          size='lg'
        >
          <CreditCard className='w-5 h-5 mr-2' />
          {disabled ? 'Memproses...' : 'Bayar Sekarang'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PayNowCard;
