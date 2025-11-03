import React from 'react';

interface MobileErrorBannerProps {
  message: string | null;
  onRetry?: () => void;
}

const MobileErrorBanner: React.FC<MobileErrorBannerProps> = ({
  message,
  onRetry,
}) => {
  if (!message) return null;
  return (
    <div className='fixed bottom-3 left-3 right-3 z-50 sm:hidden'>
      <div className='bg-red-600 text-white rounded-xl shadow-md px-4 py-3 flex items-center justify-between gap-3'>
        <span className='text-sm font-medium line-clamp-3'>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className='shrink-0 bg-white/15 hover:bg-white/25 transition-colors text-white text-xs font-semibold px-3 py-1.5 rounded-lg'
          >
            Coba Lagi
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileErrorBanner;
