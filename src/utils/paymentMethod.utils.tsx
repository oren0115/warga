import {
  CreditCard,
  DollarSign,
  Landmark,
  ShoppingCart,
  Smartphone,
} from 'lucide-react';
import React from 'react';

export function getPaymentMethodMeta(methodRaw: string | undefined | null): {
  text: string;
  icon: React.ReactNode;
} {
  const method = (methodRaw || '').toLowerCase();
  switch (method) {
    case 'credit_card':
      return {
        text: 'Kartu Kredit',
        icon: <CreditCard className='w-6 h-6 text-gray-700' />,
      };
    case 'bank_transfer':
      return {
        text: 'Transfer Bank',
        icon: <Landmark className='w-6 h-6 text-gray-700' />,
      };
    case 'gopay':
      return {
        text: 'GoPay',
        icon: <Smartphone className='w-6 h-6 text-gray-700' />,
      };
    case 'shopeepay':
      return {
        text: 'ShopeePay',
        icon: <ShoppingCart className='w-6 h-6 text-gray-700' />,
      };
    case 'qris':
      return {
        text: 'QRIS',
        icon: <CreditCard className='w-6 h-6 text-gray-700' />,
      };
    default:
      return {
        text: methodRaw || 'N/A',
        icon: <DollarSign className='w-6 h-6 text-gray-700' />,
      };
  }
}
