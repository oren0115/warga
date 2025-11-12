import {
  CreditCard,
  Landmark,
  QrCode,
  ShoppingBag,
  Smartphone,
} from 'lucide-react';
import type { PaymentMethodOption } from '../components/user/cards/PayNowCard';

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    value: 'qris',
    label: 'QRIS',
    description: 'Scan QR semua bank & e-wallet',
    icon: <QrCode className='h-4 w-4' />,
    badge: 'Terpopuler',
  },
  {
    value: 'bank_transfer',
    label: 'Transfer Bank (Virtual Account)',
    description: 'Virtual Account BCA, BNI, Mandiri, Permata',
    icon: <Landmark className='h-4 w-4' />,
  },
  {
    value: 'gopay',
    label: 'GoPay',
    description: 'Bayar lewat aplikasi GoPay',
    icon: <Smartphone className='h-4 w-4' />,
  },
  {
    value: 'shopeepay',
    label: 'ShopeePay',
    description: 'Bayar lewat aplikasi ShopeePay',
    icon: <ShoppingBag className='h-4 w-4' />,
  },
  {
    value: 'credit_card',
    label: 'Kartu Kredit',
    description: 'Dukungan kartu kredit/debit',
    icon: <CreditCard className='h-4 w-4' />,
  },
];

