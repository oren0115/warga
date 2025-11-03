import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

interface UserInfoSectionProps {
  formData: {
    username: string;
    nama: string;
    alamat: string;
    nomor_rumah: string;
    nomor_hp: string;
    tipe_rumah: string;
  };
  errors: Record<string, string>;
  onChange: (key: string, value: string) => void;
  disabled: boolean;
}

export const UserInfoSection: React.FC<UserInfoSectionProps> = ({ formData, errors, onChange, disabled }) => {
  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold text-gray-900 border-b pb-2'>Informasi Pengguna</h3>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='username'>Username *</Label>
          <Input
            id='username'
            value={formData.username}
            onChange={e => onChange('username', e.target.value)}
            disabled={disabled}
            className={errors.username ? 'border-red-300' : ''}
            placeholder='Masukkan username'
          />
          {errors.username && <p className='text-sm text-red-600'>{errors.username}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='nama'>Nama Lengkap *</Label>
          <Input
            id='nama'
            value={formData.nama}
            onChange={e => onChange('nama', e.target.value)}
            disabled={disabled}
            className={errors.nama ? 'border-red-300' : ''}
            placeholder='Masukkan nama lengkap'
          />
          {errors.nama && <p className='text-sm text-red-600'>{errors.nama}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='alamat'>Alamat *</Label>
        <Input
          id='alamat'
          value={formData.alamat}
          onChange={e => onChange('alamat', e.target.value)}
          disabled={disabled}
          className={errors.alamat ? 'border-red-300' : ''}
          placeholder='Masukkan alamat lengkap'
        />
        {errors.alamat && <p className='text-sm text-red-600'>{errors.alamat}</p>}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='nomor_rumah'>Nomor Rumah *</Label>
          <Input
            id='nomor_rumah'
            value={formData.nomor_rumah}
            onChange={e => onChange('nomor_rumah', e.target.value)}
            disabled={disabled}
            className={errors.nomor_rumah ? 'border-red-300' : ''}
            placeholder='Contoh: 15A'
          />
          {errors.nomor_rumah && <p className='text-sm text-red-600'>{errors.nomor_rumah}</p>}
        </div>

        <div className='space-y-2'>
          <Label htmlFor='nomor_hp'>Nomor HP *</Label>
          <Input
            id='nomor_hp'
            value={formData.nomor_hp}
            onChange={e => onChange('nomor_hp', e.target.value)}
            disabled={disabled}
            className={errors.nomor_hp ? 'border-red-300' : ''}
            placeholder='Contoh: 081234567890'
          />
          {errors.nomor_hp && <p className='text-sm text-red-600'>{errors.nomor_hp}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='tipe_rumah'>Tipe Rumah</Label>
        <Select
          value={formData.tipe_rumah}
          onValueChange={value => onChange('tipe_rumah', value)}
          disabled={disabled}
        >
          <SelectTrigger id='tipe_rumah'>
            <SelectValue placeholder='Pilih tipe rumah' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='60M2'>60M²</SelectItem>
            <SelectItem value='72M2'>72M²</SelectItem>
            <SelectItem value='HOOK'>Hook</SelectItem>
          </SelectContent>
        </Select>
        <p className='text-xs text-gray-500'>Tipe rumah menentukan tarif IPL yang akan dikenakan</p>
        {errors.tipe_rumah && <p className='text-sm text-red-600'>{errors.tipe_rumah}</p>}
      </div>
    </div>
  );
};

export default UserInfoSection;


