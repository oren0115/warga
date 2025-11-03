import { AlertTriangle } from 'lucide-react';
import React from 'react';

export const WarningBanner: React.FC<{ show: boolean; message: string }> = ({
  show,
  message,
}) => {
  if (!show) return null;
  return (
    <div className='mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg'>
      <div className='flex items-center space-x-2'>
        <AlertTriangle className='w-4 h-4 text-yellow-600' />
        <p className='text-sm text-yellow-700'>{message}</p>
      </div>
    </div>
  );
};

export default WarningBanner;
