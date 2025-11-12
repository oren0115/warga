import React from 'react';

interface KeyValueRowProps {
  label: string;
  value: string;
  isCode?: boolean;
  color?: string;
}

const KeyValueRow: React.FC<KeyValueRowProps> = ({
  label,
  value,
  isCode = false,
  color = 'text-gray-800',
}) => (
  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100 last:border-b-0'>
    <span className='text-gray-600 font-semibold text-sm'>{label}:</span>
    <span
      className={`${color} font-medium mt-1 sm:mt-0 ${
        isCode
          ? 'font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs border border-blue-100'
          : 'text-gray-800'
      }`}
    >
      {value}
    </span>
  </div>
);

export default KeyValueRow;
