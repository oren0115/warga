import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Skeleton } from '../../ui/skeleton';

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className='space-y-4'>
    {Array.from({ length: count }).map((_, i) => (
      <Card key={i}>
        <CardContent className='p-4'>
          <div className='flex items-start justify-between'>
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-48' />
              <Skeleton className='h-3 w-24' />
            </div>
            <Skeleton className='h-8 w-8' />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default SkeletonList;


