import React from 'react';
import { Card, CardContent } from '../../ui/card';

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'custom';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon,
  variant = 'info',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          card: 'bg-gradient-to-br from-green-50 to-green-100',
          icon: 'bg-green-500',
          text: 'text-green-700',
          value: 'text-green-800',
          description: 'text-green-600',
        };
      case 'warning':
        return {
          card: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
          icon: 'bg-yellow-500',
          text: 'text-yellow-700',
          value: 'text-yellow-800',
          description: 'text-yellow-600',
        };
      case 'error':
        return {
          card: 'bg-gradient-to-br from-red-50 to-red-100',
          icon: 'bg-red-500',
          text: 'text-red-700',
          value: 'text-red-800',
          description: 'text-red-600',
        };
      case 'info':
        return {
          card: 'bg-gradient-to-br from-blue-50 to-blue-100',
          icon: 'bg-blue-500',
          text: 'text-blue-700',
          value: 'text-blue-800',
          description: 'text-blue-600',
        };
      default:
        return {
          card: 'bg-gradient-to-br from-gray-50 to-gray-100',
          icon: 'bg-gray-500',
          text: 'text-gray-700',
          value: 'text-gray-800',
          description: 'text-gray-600',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className={`shadow-lg border-0 ${styles.card} ${className}`}>
      <CardContent className='p-4 sm:p-6'>
        <div className='flex items-center gap-3 sm:gap-4'>
          <div className={`p-2 sm:p-3 ${styles.icon} rounded-full shadow-md`}>
            {icon}
          </div>
          <div>
            <p className={`text-xs sm:text-sm ${styles.text} font-medium`}>
              {title}
            </p>
            <p className={`font-bold text-xl sm:text-2xl ${styles.value}`}>
              {value}
            </p>
            {description && (
              <p className={`text-[11px] sm:text-xs ${styles.description}`}>
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
