import { Building2, User } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';

interface FeeDetailHeaderProps {
  userName?: string;
  onBack: () => void;
}

const FeeDetailHeader: React.FC<FeeDetailHeaderProps> = ({
  userName,
  onBack,
}) => {
  return (
    <div className='sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6'>
      <div className='absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full'></div>
      <div className='absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full'></div>

      <div className='relative p-4 md:p-6'>
        <div className='hidden md:flex items-center gap-3 mb-4'>
          <div className='p-2 bg-white/20 rounded-lg'>
            <Building2 className='w-6 h-6 text-white' />
          </div>
          <div>
            <h1 className='text-xl font-bold'>IPL Cluster Cannary</h1>
            <p className='text-green-100 text-sm'>Sistem Pembayaran Digital</p>
          </div>
        </div>

        <div className='md:hidden flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 bg-white/20 rounded-lg'>
              <Building2 className='w-5 h-5 text-white' />
            </div>
            <span className='text-lg font-semibold'>IPL Cluster Cannary</span>
          </div>
          <Button
            variant='ghost'
            onClick={onBack}
            className='text-white hover:bg-white/20'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15 19l-7-7 7-7'
              />
            </svg>
          </Button>
        </div>

        <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg'>
          <div className='flex justify-between items-start'>
            <div className='flex items-center gap-2 md:gap-3'>
              <div className='p-1.5 md:p-2 bg-white/20 rounded-full'>
                <User className='w-5 h-5 md:w-6 md:h-6 text-white' />
              </div>
              <div>
                <h2 className='text-lg md:text-xl font-semibold mb-1'>
                  Detail Iuran - {userName} 👋
                </h2>
                <p className='text-green-100 text-xs md:text-sm'>
                  Informasi lengkap iuran RT/RW
                </p>
              </div>
            </div>
            <div className='hidden md:block'>
              <Button
                variant='ghost'
                onClick={onBack}
                className='text-white hover:bg-white/20'
              >
                <svg
                  className='w-5 h-5 mr-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                Kembali
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetailHeader;
