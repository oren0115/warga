import { Shield, ShieldOff } from 'lucide-react';
import React from 'react';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

interface RoleAccessSectionProps {
  isAdminUser: boolean;
  canEditRole: boolean;
  onToggleRole: () => void;
}

export const RoleAccessSection: React.FC<RoleAccessSectionProps> = ({
  isAdminUser,
  canEditRole,
  onToggleRole,
}) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>
        Role & Akses
      </h3>
      <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
        <div className='flex items-center space-x-3'>
          {isAdminUser ? (
            <Shield className='w-5 h-5 text-purple-600' />
          ) : (
            <ShieldOff className='w-5 h-5 text-gray-400' />
          )}
          <div>
            <p className='font-medium text-gray-900'>
              {isAdminUser ? 'Administrator' : 'Warga Biasa'}
            </p>
            <p className='text-sm text-gray-500'>
              {isAdminUser
                ? 'Memiliki akses penuh ke sistem admin'
                : 'Akses terbatas sebagai warga'}
            </p>
          </div>
        </div>

        {canEditRole ? (
          <div className='flex items-center space-x-2'>
            <Badge
              className={`px-3 py-1 ${
                isAdminUser
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isAdminUser ? 'Admin' : 'Warga'}
            </Badge>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={onToggleRole}
              className='text-xs'
            >
              {isAdminUser ? 'Jadikan Warga' : 'Jadikan Admin'}
            </Button>
          </div>
        ) : (
          <div className='flex items-center space-x-2'>
            <Badge
              className={`px-3 py-1 ${
                isAdminUser
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {isAdminUser ? 'Admin' : 'Warga'}
            </Badge>
            <span className='text-xs text-gray-500'>
              Hanya admin yang dapat mengubah role
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleAccessSection;
