import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';
import React, { useMemo } from 'react';
import type { PaymentMethodRequest } from '../../../types';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';

export interface PaymentMethodOption {
  value: PaymentMethodRequest;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

interface PayNowCardProps {
  onPay: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  amount: number;
  selectedMethod: PaymentMethodRequest;
  onMethodChange: (method: PaymentMethodRequest) => void;
  methods: PaymentMethodOption[];
}

const PayNowCard: React.FC<PayNowCardProps> = ({
  onPay,
  disabled,
  isProcessing,
  selectedMethod,
  onMethodChange,
  methods,
}) => {
  const selectedOption = useMemo(
    () => methods.find(method => method.value === selectedMethod),
    [methods, selectedMethod]
  );

  return (
    <Card className='shadow-xl border border-green-100 bg-gradient-to-br from-white to-green-50/30'>
      <CardHeader className='space-y-2'>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <CardTitle className='text-xl font-semibold text-gray-900 flex items-center gap-2'>
              Bayar Iuran
            </CardTitle>
          </div>
          <span className='inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm'>
            <ShieldCheck className='h-4 w-4 text-green-500' /> Terlindungi
            Midtrans
          </span>
        </div>
      </CardHeader>
      <CardContent className='space-y-5'>
        <div className='space-y-2'>
          <p className='text-sm font-semibold text-gray-800'>
            Pilih Metode Pembayaran
          </p>
          <Select
            value={selectedMethod}
            onValueChange={value =>
              onMethodChange(value as PaymentMethodRequest)
            }
          >
            <SelectTrigger className='w-full h-12 justify-between border-gray-200 bg-white shadow-sm hover:border-emerald-200 focus:ring-2 focus:ring-green-200'>
              <SelectValue placeholder='Pilih metode pembayaran'>
                {selectedOption ? (
                  <span className='flex items-center gap-2'>
                    {selectedOption.icon}
                    <span className='text-sm font-medium text-gray-800'>
                      {selectedOption.label}
                    </span>
                  </span>
                ) : null}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='w-full'>
              {methods.map(method => (
                <SelectItem key={method.value} value={method.value}>
                  <span className='flex items-start gap-3'>
                    <span className='mt-0.5 text-green-500'>{method.icon}</span>
                    <span className='flex flex-col flex-1 gap-0.5'>
                      <span className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-gray-800'>
                          {method.label}
                        </span>
                        {method.badge && (
                          <span className='rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-700'>
                            {method.badge}
                          </span>
                        )}
                      </span>
                      {method.description && (
                        <span className='text-[11px] leading-tight text-gray-500'>
                          {method.description}
                        </span>
                      )}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedOption?.description && (
            <p className='text-xs text-gray-500'>
              {selectedOption.description}
            </p>
          )}
        </div>

        <div className='space-y-2'>
          <Button
            onClick={onPay}
            disabled={disabled || isProcessing}
            className='w-full h-12 bg-green-600 hover:bg-green-700 shadow-lg text-white font-semibold text-lg transition-all duration-150 cursor-pointer'
          >
            {isProcessing ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' /> Memproses...
              </>
            ) : (
              <>
                <CreditCard className='mr-2 h-5 w-5' /> Bayar Sekarang
              </>
            )}
          </Button>
          <p className='text-xs text-gray-500'>
            Setelah pembayaran sukses, status akan diperbarui otomatis tanpa
            perlu upload bukti.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayNowCard;
