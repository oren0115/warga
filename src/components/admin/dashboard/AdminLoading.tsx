import React from 'react';
import { Card, CardContent, CardHeader } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';

interface AdminLoadingProps {
  type?: 'page' | 'card' | 'table' | 'stats';
  count?: number;
  className?: string;
}

const AdminLoading: React.FC<AdminLoadingProps> = ({
  type = 'page',
  count = 1,
  className = '',
}) => {
  const renderPageLoading = () => (
    <div className='min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header Skeleton */}
      <div className='sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6'>
        <div className='absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full'></div>
        <div className='absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full'></div>

        <div className='relative p-4 md:p-6'>
          <div className='hidden md:flex items-center gap-3 mb-4'>
            <div className='p-2 bg-white/20 rounded-lg'>
              <div className='w-10 h-10 bg-white/30 rounded animate-pulse'></div>
            </div>
            <div className='space-y-2'>
              <div className='w-80 h-8 bg-white/30 rounded animate-pulse'></div>
              <div className='w-48 h-4 bg-white/20 rounded animate-pulse'></div>
            </div>
          </div>

          <div className='bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg'>
            <div className='flex justify-between items-start'>
              <div className='flex items-center gap-2 md:gap-3'>
                <div className='p-1.5 md:p-2 bg-white/20 rounded-full'>
                  <div className='w-5 h-5 md:w-6 md:h-6 bg-white/30 rounded animate-pulse'></div>
                </div>
                <div className='space-y-2'>
                  <div className='w-32 h-6 bg-white/30 rounded animate-pulse'></div>
                  <div className='w-48 h-4 bg-white/20 rounded animate-pulse'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 md:px-6 space-y-6'>
        {/* Stats Cards Skeleton */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
          {Array.from({ length: 4 }, (_, i) => (
            <Card
              key={i}
              className='hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100'
            >
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-3 flex-1'>
                    <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                    <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
                    <div className='flex items-center space-x-2'>
                      <div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
                      <div className='h-3 bg-gray-200 rounded animate-pulse w-20'></div>
                    </div>
                  </div>
                  <div className='p-4 bg-gray-100 rounded-xl animate-pulse'>
                    <div className='w-7 h-7 bg-gray-200 rounded'></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Table Card Skeleton */}
        <Card className='shadow-lg rounded-xl border border-gray-100'>
          <CardHeader className='border-b bg-gradient-to-r from-gray-50 to-gray-100/50'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='p-2 bg-white rounded-lg shadow-sm'>
                  <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
                </div>
                <div className='space-y-2'>
                  <div className='h-6 bg-gray-200 rounded animate-pulse w-64'></div>
                  <div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div>
                </div>
              </div>
              <div className='h-8 bg-gray-200 rounded animate-pulse w-20'></div>
            </div>
          </CardHeader>
          <CardContent className='p-0'>
            <div className='p-8 text-center'>
              <div className='animate-pulse space-y-4'>
                <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
                <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
                <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto'></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCardLoading = () => (
    <Card className='hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between'>
          <div className='space-y-3 flex-1'>
            <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
            <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
            <div className='flex items-center space-x-2'>
              <div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
              <div className='h-3 bg-gray-200 rounded animate-pulse w-20'></div>
            </div>
          </div>
          <div className='p-4 bg-gray-100 rounded-xl animate-pulse'>
            <div className='w-7 h-7 bg-gray-200 rounded'></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTableLoading = () => (
    <Card className='shadow-lg rounded-xl border border-gray-100'>
      <CardHeader className='border-b bg-gradient-to-r from-gray-50 to-gray-100/50'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='p-2 bg-white rounded-lg shadow-sm'>
              <div className='w-5 h-5 bg-gray-200 rounded animate-pulse'></div>
            </div>
            <div className='space-y-2'>
              <div className='h-6 bg-gray-200 rounded animate-pulse w-64'></div>
              <div className='h-4 bg-gray-200 rounded animate-pulse w-48'></div>
            </div>
          </div>
          <div className='h-8 bg-gray-200 rounded animate-pulse w-20'></div>
        </div>
      </CardHeader>
      <CardContent className='p-0'>
        <div className='p-8 text-center'>
          <div className='animate-pulse space-y-4'>
            <div className='h-4 bg-gray-200 rounded w-3/4 mx-auto'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
            <div className='h-4 bg-gray-200 rounded w-2/3 mx-auto'></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsLoading = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6'>
      {Array.from({ length: count }, (_, i) => (
        <Card
          key={i}
          className='hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100'
        >
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div className='space-y-3 flex-1'>
                <div className='h-4 bg-gray-200 rounded animate-pulse w-24'></div>
                <div className='h-8 bg-gray-200 rounded animate-pulse w-16'></div>
                <div className='flex items-center space-x-2'>
                  <div className='h-4 w-4 bg-gray-200 rounded animate-pulse'></div>
                  <div className='h-3 bg-gray-200 rounded animate-pulse w-20'></div>
                </div>
              </div>
              <div className='p-4 bg-gray-100 rounded-xl animate-pulse'>
                <div className='w-7 h-7 bg-gray-200 rounded'></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  switch (type) {
    case 'page':
      return renderPageLoading();
    case 'card':
      return (
        <div className={className}>
          {Array.from({ length: count }, (_, i) => (
            <div key={i}>{renderCardLoading()}</div>
          ))}
        </div>
      );
    case 'table':
      return <div className={className}>{renderTableLoading()}</div>;
    case 'stats':
      return <div className={className}>{renderStatsLoading()}</div>;
    default:
      return <Skeleton className={`h-4 w-full ${className}`} />;
  }
};

export default AdminLoading;
