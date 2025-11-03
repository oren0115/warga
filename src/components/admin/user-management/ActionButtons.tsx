import { Save, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from '../../ui/button';

interface ActionButtonsProps {
  isReadOnly: boolean;
  isAdminContext: boolean;
  isLoading: boolean;
  mode: 'create' | 'edit' | 'view';
  hasUser: boolean;
  onDelete: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  isReadOnly,
  isAdminContext,
  isLoading,
  mode,
  hasUser,
  onDelete,
}) => {
  return (
    <div className='flex items-center justify-between pt-6 border-t'>
      <div className='flex space-x-2'>
        {mode === 'edit' && isAdminContext && hasUser && (
          <Button
            type='button'
            variant='destructive'
            onClick={onDelete}
            disabled={isLoading}
            className='bg-red-600 hover:bg-red-700 cursor-pointer'
          >
            <Trash2 className='w-4 h-4 mr-2' />
            Hapus
          </Button>
        )}

        {!isReadOnly && isAdminContext && (
          <Button
            type='submit'
            disabled={isLoading}
            className='bg-green-600 hover:bg-green-700 cursor-pointer'
          >
            <Save className='w-4 h-4 mr-2' />
            {isLoading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        )}
        {!isReadOnly && !isAdminContext && (
          <div className='text-xs text-gray-500 px-3 py-2'>
            Hanya admin yang dapat menyimpan perubahan
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionButtons;
