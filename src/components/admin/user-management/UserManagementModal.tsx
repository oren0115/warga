import { Edit, Eye, UserPlus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/auth.context';
import { useApiErrorHandler } from '../../../hooks/useErrorHandler';
import { adminService } from '../../../services/admin.service';
import { errorService } from '../../../services/error.service';
import type { User } from '../../../types';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import ConfirmationDialog from '../../ui/confirmation-dialog';
import { ActionButtons } from './ActionButtons';
import { ErrorAlert } from './ErrorAlert';
import { PasswordField } from './PasswordField';
import { RoleAccessSection } from './RoleAccessSection';
import { UserInfoSection } from './UserInfoSection';
import { WarningBanner } from './WarningBanner';

interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: () => void;
  user?: User | null;
  mode: 'create' | 'edit' | 'view';
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
  user,
  mode,
}) => {
  const { authState } = useAuth();
  const { handleApiError } = useApiErrorHandler();
  const [formData, setFormData] = useState({
    username: '',
    nama: '',
    alamat: '',
    nomor_rumah: '',
    nomor_hp: '',
    password: '',
    is_admin: false,
    tipe_rumah: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Admin validation
  const isAdmin = authState.user?.is_admin === true;

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      // Prefill form for edit/view
      const newFormData = {
        username: user.username,
        nama: user.nama,
        alamat: user.alamat || '',
        nomor_rumah: user.nomor_rumah || '',
        nomor_hp: user.nomor_hp || '',
        password: '',
        is_admin: user.is_admin,
        tipe_rumah: user.tipe_rumah || '',
      };
      setFormData(newFormData);
    } else if (mode === 'create') {
      setFormData({
        username: '',
        nama: '',
        alamat: '',
        nomor_rumah: '',
        nomor_hp: '',
        password: '',
        is_admin: false,
        tipe_rumah: '',
      });
    }
    setErrors({});
    setShowDeleteConfirm(false);
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (!formData.nomor_rumah.trim()) {
      newErrors.nomor_rumah = 'Nomor rumah wajib diisi';
    }

    if (!formData.nomor_hp.trim()) {
      newErrors.nomor_hp = 'Nomor HP wajib diisi';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.nomor_hp)) {
      newErrors.nomor_hp = 'Format nomor HP tidak valid';
    }

    if (mode === 'create' && !formData.password.trim()) {
      newErrors.password = 'Password wajib diisi';
    } else if (
      formData.password &&
      formData.password.trim() !== '' &&
      formData.password.length < 6
    ) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    const hasPersistedHouseType = !!user?.tipe_rumah;

    if (
      !formData.tipe_rumah.trim() &&
      !(mode === 'edit' && hasPersistedHouseType)
    ) {
      newErrors.tipe_rumah = 'Tipe rumah wajib dipilih';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Admin validation untuk create dan edit
    if (!isAdmin && (mode === 'create' || mode === 'edit')) {
      setErrors({
        general:
          'Akses ditolak. Hanya administrator yang dapat menambah atau mengedit pengguna.',
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      errorService.logUserAction('user_management_save_start', {
        mode,
        userId: user?.id,
      });

      if (mode === 'create') {
        await adminService.createUser(formData);
        errorService.logUserAction('user_created', {
          username: formData.username,
        });
      } else if (mode === 'edit' && user) {
        const updateData = { ...formData };
        // Only include password if it's not empty
        if (!updateData.password || updateData.password.trim() === '') {
          delete (updateData as any).password;
        }
        if (!updateData.tipe_rumah || updateData.tipe_rumah.trim() === '') {
          delete (updateData as any).tipe_rumah;
        }
        await adminService.updateUser(user.id, updateData);
        errorService.logUserAction('user_updated', {
          userId: user.id,
          username: formData.username,
        });
      }

      onUserUpdated();
      onClose();
    } catch (error: any) {
      handleApiError(error, '/admin/users', mode === 'create' ? 'POST' : 'PUT');
      const errorMessage =
        error.response?.data?.detail || 'Terjadi kesalahan saat menyimpan data';
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    // Admin validation untuk delete
    if (!isAdmin) {
      setErrors({
        general:
          'Akses ditolak. Hanya administrator yang dapat menghapus pengguna.',
      });
      return;
    }

    setIsLoading(true);
    try {
      await adminService.deleteUser(user.id);
      onUserUpdated();
      onClose();
    } catch (error: any) {
      handleApiError(error, `/admin/users/${user.id}`, 'DELETE');
      setErrors({ general: 'Terjadi kesalahan saat menghapus pengguna' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isReadOnly = mode === 'view';
  const isCreate = mode === 'create';
  const isEdit = mode === 'edit';

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50'>
      <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto '>
        <CardHeader className='border-b '>
          <div className='flex items-center justify-between '>
            <div className='flex items-center space-x-3'>
              {isCreate && <UserPlus className='w-6 h-6 text-green-600' />}
              {isEdit && <Edit className='w-6 h-6 text-green-600' />}
              {isReadOnly && <Eye className='w-6 h-6 text-gray-600' />}
              <CardTitle className='text-xl '>
                {isCreate && 'Tambah Pengguna Baru'}
                {isEdit && 'Edit Data Pengguna'}
                {isReadOnly && 'Detail Pengguna'}
              </CardTitle>
            </div>
            <Button
              // variant="outline"
              size='icon'
              onClick={onClose}
              className='h-8 w-8 bg-green-600 text-white hover:bg-green-700 cursor-pointer'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>

        <CardContent className='p-6'>
          <WarningBanner
            show={!isAdmin && (mode === 'create' || mode === 'edit')}
            message={
              'Peringatan: Hanya administrator yang dapat menambah atau mengedit pengguna. Anda hanya dapat melihat data dalam mode read-only.'
            }
          />

          <ErrorAlert message={errors.general} />

          <form onSubmit={handleSubmit} className='space-y-6'>
            <UserInfoSection
              formData={{
                username: formData.username,
                nama: formData.nama,
                alamat: formData.alamat,
                nomor_rumah: formData.nomor_rumah,
                nomor_hp: formData.nomor_hp,
                tipe_rumah: formData.tipe_rumah,
              }}
              errors={errors}
              disabled={
                isReadOnly ||
                (!isAdmin && (mode === 'create' || mode === 'edit'))
              }
              onChange={(key, value) =>
                setFormData(prev => ({ ...prev, [key]: value }))
              }
            />

            {(isCreate || isEdit) && (
              <PasswordField
                mode={mode}
                disabled={
                  isReadOnly ||
                  (!isAdmin && (mode === 'create' || mode === 'edit'))
                }
                value={formData.password}
                onChange={v => setFormData({ ...formData, password: v })}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                error={errors.password}
              />
            )}

            <RoleAccessSection
              isAdminUser={formData.is_admin}
              canEditRole={!isReadOnly && isAdmin}
              onToggleRole={() =>
                setFormData(prev => ({ ...prev, is_admin: !prev.is_admin }))
              }
            />

            <ActionButtons
              isReadOnly={isReadOnly}
              isAdminContext={isAdmin}
              isLoading={isLoading}
              mode={mode}
              hasUser={!!user}
              onDelete={() => setShowDeleteConfirm(true)}
            />
          </form>

          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            onClose={() => setShowDeleteConfirm(false)}
            onConfirm={handleDelete}
            title='Konfirmasi Hapus'
            description={`Apakah Anda yakin ingin menghapus pengguna ${user?.nama}? Tindakan ini tidak dapat dibatalkan.`}
            confirmText={isLoading ? 'Menghapus...' : 'Hapus'}
            cancelText='Batal'
            variant='warning'
            isLoading={isLoading}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementModal;
