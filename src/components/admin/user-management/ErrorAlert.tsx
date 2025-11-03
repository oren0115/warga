import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ErrorAlert: React.FC<{ message?: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
      <div className='flex items-center space-x-2'>
        <AlertTriangle className='w-4 h-4 text-red-600' />
        <p className='text-sm text-red-700'>{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;


