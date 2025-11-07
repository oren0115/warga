import {
  CreditCard,
  DollarSign,
  Landmark,
  QrCode,
  ShoppingCart,
  Smartphone,
} from 'lucide-react';
import React from 'react';

const BANK_LABELS: Record<string, string> = {
  bca: 'BCA',
  bni: 'BNI',
  bri: 'BRI',
  permata: 'Permata',
  mandiri: 'Mandiri',
};

const VA_LABELS: Record<string, string> = {
  bca_va: 'Virtual Account BCA',
  bni_va: 'Virtual Account BNI',
  permata_va: 'Virtual Account Permata',
  other_va: 'Virtual Account',
  echannel: 'Mandiri Bill Payment',
};

export function getPaymentMethodMeta(
  methodRaw: string | undefined | null,
  bankRaw?: string | null
): {
  text: string;
  icon: React.ReactNode;
} {
  const method = (methodRaw || '').toLowerCase();
  const bank = (bankRaw || '').toLowerCase();

  switch (method) {
    case 'credit_card':
      return {
        text: 'Kartu Kredit',
        icon: <CreditCard className='w-6 h-6 text-gray-700' />,
      };
    case 'bank_transfer':
      return {
        text:
          bank && BANK_LABELS[bank]
            ? `Transfer Bank ${BANK_LABELS[bank]}`
            : 'Transfer Bank',
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
        icon: <QrCode className='w-6 h-6 text-gray-700' />,
      };
    case 'bca_va':
    case 'bni_va':
    case 'permata_va':
    case 'other_va':
    case 'echannel':
      return {
        text: VA_LABELS[method] || 'Virtual Account',
        icon: <Landmark className='w-6 h-6 text-gray-700' />,
      };
    default:
      return {
        text: methodRaw ? methodRaw.toUpperCase() : 'N/A',
        icon: <DollarSign className='w-6 h-6 text-gray-700' />,
      };
  }
}
