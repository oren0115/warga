import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';

interface PasswordFieldProps {
  mode: 'create' | 'edit' | 'view';
  disabled: boolean;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  error?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  mode,
  disabled,
  value,
  onChange,
  showPassword,
  setShowPassword,
  error,
}) => {
  const isCreate = mode === 'create';
  const isReadOnly = mode === 'view';
  if (isReadOnly) return null;

  return (
    <div className='space-y-2'>
      <Label htmlFor='password'>
        Password {isCreate ? '*' : '(kosongkan jika tidak diubah)'}
      </Label>
      <div className='relative'>
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          className={error ? 'border-red-300 pr-10' : 'pr-10'}
          placeholder={isCreate ? 'Masukkan password' : 'Kosongkan jika tidak diubah'}
        />
        <Button
          type='button'
          variant='ghost'
          size='icon'
          className='absolute right-0 top-0 h-full px-3 hover:bg-transparent'
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className='h-4 w-4 text-gray-400' />
          ) : (
            <Eye className='h-4 w-4 text-gray-400' />
          )}
        </Button>
      </div>
      {error && <p className='text-sm text-red-600'>{error}</p>}
    </div>
  );
};

export default PasswordField;


