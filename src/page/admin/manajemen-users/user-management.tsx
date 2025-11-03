import {
  Edit,
  Eye,
  Search,
  Shield,
  ShieldCheck,
  User2,
  UserPlus,
  Users,
} from 'lucide-react';
import React from 'react';
import {
  AdminFilters,
  AdminPageHeader,
  AdminPagination,
  AdminStatsCard,
  AdminTable,
} from '../../../components/admin';
import UserManagementModal from '../../../components/admin/user-management/UserManagementModal';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';

import { useUserManagement } from '../../../hooks/useUserManagement';
import type { User } from '../../../types';

const UserManagement: React.FC = () => {
  const {
    isAdmin,
    users,
    filteredUsers,
    paginatedUsers,
    adminCount,
    wargaCount,
    isLoading,
    error,
    isRefreshing,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    isModalOpen,
    modalMode,
    selectedUser,
    handleCreateUser,
    handleEditUser,
    handleViewUser,
    handleCloseModal,
    handleUserUpdated,
    handleRefresh,
  } = useUserManagement();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
  };

  // Table columns definition
  const tableColumns = [
    {
      key: 'user_info',
      label: 'Informasi Pengguna',
      render: (_value: any, user: User) => (
        <div className='flex items-center space-x-4'>
          <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md'>
            <span className='text-lg font-bold text-white'>
              {user.nama?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className='min-w-0'>
            <p className='text-lg font-semibold text-gray-900 truncate'>
              {user.nama}
            </p>
            <p className='text-sm text-gray-500 font-mono'>@{user.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: 'Kontak',
      render: (_value: any, user: User) => (
        <div className='space-y-1'>
          <p className='text-sm font-medium text-gray-900'>
            {user.nomor_hp || 'Tidak ada nomor HP'}
          </p>
          <p className='text-xs text-gray-500'>Nomor WhatsApp</p>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Alamat Lengkap',
      render: (_value: any, user: User) => (
        <div className='space-y-1 max-w-xs'>
          <p className='text-sm text-gray-900 line-clamp-2'>
            {user.alamat || 'Tidak ada alamat'}
          </p>
          <div className='flex items-center space-x-2'>
            <Badge className='bg-gray-100 text-gray-700 text-xs px-2 py-1'>
              Rumah #{user.nomor_rumah || 'N/A'}
            </Badge>
            {user.tipe_rumah && (
              <Badge className='bg-blue-100 text-blue-700 text-xs px-2 py-1'>
                {user.tipe_rumah}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'role_status',
      label: 'Status & Role',
      render: (_value: any, user: User) => (
        <div className='space-y-2'>
          {user.is_admin ? (
            <Badge className='bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm'>
              <Shield className='w-5 h-5 mr-1' /> Administrator
            </Badge>
          ) : (
            <Badge className='bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm'>
              <User2 className='w-5 h-5 mr-1' /> Warga
            </Badge>
          )}
          <div className='flex items-center space-x-1'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
            <span className='text-xs text-green-600 font-medium'>Aktif</span>
          </div>
        </div>
      ),
    },
    {
      key: 'join_date',
      label: 'Bergabung',
      render: (_value: any, user: User) => (
        <div className='text-sm text-gray-600'>
          <p className='font-medium'>
            {formatDate(user.created_at).split(',')[0]}
          </p>
          <p className='text-xs text-gray-500'>
            {formatDate(user.created_at).split(',')[1]}
          </p>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (_value: any, user: User) => (
        <div className='flex items-center space-x-2'>
          <Button
            onClick={() => handleViewUser(user)}
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-green-600 hover:bg-green-50 cursor-pointer'
          >
            <Eye className='w-4 h-4' />
          </Button>
          <Button
            onClick={() => handleEditUser(user)}
            variant='ghost'
            size='sm'
            className='h-8 w-8 p-0 text-green-600 hover:bg-green-50 cursor-pointer'
          >
            <Edit className='w-4 h-4' />
          </Button>
        </div>
      ),
    },
  ];

  // Filter options
  const filterOptions = [
    { key: 'all', label: 'Semua', count: users.length },
    { key: 'admin', label: 'Admin', count: adminCount },
    { key: 'warga', label: 'Warga', count: wargaCount },
  ];

  const resetCurrentPage = () => {
    setCurrentPage(1);
  };

  React.useEffect(() => {
    resetCurrentPage();
  }, [searchTerm, filterRole, itemsPerPage]);

  // Modal handlers

  // Loading Skeleton (mobile-first)
  if (isLoading) {
    return (
      <div className='min-h-screen bg-gray-50 p-4 sm:p-6'>
        <div className='max-w-6xl mx-auto space-y-4 sm:space-y-6'>
          {/* Header skeleton */}
          <div className='bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4 sm:p-5 text-white'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-white/30 rounded-lg'></div>
              <div className='flex-1 space-y-2'>
                <div className='h-4 bg-white/30 rounded w-40 sm:w-64'></div>
                <div className='h-3 bg-white/20 rounded w-56 sm:w-80'></div>
              </div>
            </div>
          </div>

          {/* Stats skeleton */}
          <div className='grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4'>
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4'
              >
                <div className='flex items-center justify-between'>
                  <div className='space-y-2 w-2/3'>
                    <div className='h-3 bg-gray-200 rounded w-20'></div>
                    <div className='h-5 bg-gray-200 rounded w-12'></div>
                  </div>
                  <div className='w-8 h-8 bg-gray-100 rounded-xl'></div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters skeleton */}
          <div className='bg-white border border-gray-200 rounded-xl p-3 sm:p-4'>
            <div className='flex items-center gap-2'>
              <div className='h-9 bg-gray-200 rounded w-full'></div>
              <div className='hidden sm:block h-9 bg-gray-200 rounded w-40'></div>
              <div className='hidden sm:block h-9 bg-gray-200 rounded w-28'></div>
            </div>
          </div>

          {/* Table skeleton */}
          <div className='bg-white border border-gray-200 rounded-xl'>
            <div className='hidden sm:grid grid-cols-6 gap-2 border-b p-3 bg-gray-50'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='h-3 bg-gray-200 rounded w-20'></div>
              ))}
            </div>
            <div className='divide-y'>
              {[...Array(6)].map((_, i) => (
                <div key={i} className='p-3 sm:p-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
                    <div className='flex-1 space-y-2'>
                      <div className='h-3 bg-gray-200 rounded w-32'></div>
                      <div className='h-3 bg-gray-100 rounded w-24'></div>
                    </div>
                    <div className='hidden sm:flex gap-2'>
                      <div className='h-8 w-8 bg-gray-200 rounded'></div>
                      <div className='h-8 w-8 bg-gray-200 rounded'></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied message for non-admin users
  if (!isAdmin) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
        <div className='bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full text-center'>
          <div className='flex flex-col items-center space-y-6'>
            <div className='p-4 bg-red-100 rounded-full'>
              <Shield className='w-12 h-12 text-red-600' />
            </div>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Akses Ditolak
              </h2>
              <p className='text-gray-600 mb-4'>
                Halaman ini hanya dapat diakses oleh Administrator. Anda tidak
                memiliki izin untuk melihat data pengguna.
              </p>
              <p className='text-sm text-gray-500'>
                Silakan hubungi administrator sistem jika Anda yakin seharusnya
                memiliki akses.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Header - Only for Admin */}
      {isAdmin && (
        <AdminPageHeader
          title='Kelola Pengguna'
          subtitle='Kelola pengguna IPL Cluster Anda dengan mudah'
          icon={<User2 className='w-5 h-5 md:w-6 md:h-6 text-white' />}
        />
      )}

      {isAdmin && (
        <div className='container mx-auto px-4 md:px-6 space-y-6'>
          {error && (
            <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
              <div className='flex items-center justify-between'>
                <span>{error}</span>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={handleRefresh}
                  className='cursor-pointer'
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          )}
          {/* Enhanced Stats Cards - Only for Admin */}
          {isAdmin && (
            <div className='grid grid-cols-1 gap-4 sm:gap-5 md:gap-6'>
              {/* Total Pengguna */}
              <AdminStatsCard
                title='Total Pengguna'
                value={users?.length || 0}
                description='Terdaftar di sistem'
                icon={<Users className='w-6 h-6 sm:w-7 sm:h-7' />}
                iconBgColor='bg-gradient-to-br from-blue-50 to-blue-100'
                iconTextColor='text-blue-700'
                valueColor='text-blue-600'
                className='p-3 sm:p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all'
              />

              {/* Grid 2 kolom di bawah */}
              <div className='grid grid-cols-2 gap-4 sm:gap-5 md:gap-6'>
                <AdminStatsCard
                  title='Admin'
                  value={adminCount || 0}
                  description='Akses penuh sistem'
                  icon={<ShieldCheck className='w-6 h-6 sm:w-7 sm:h-7' />}
                  iconBgColor='bg-gradient-to-br from-purple-50 to-purple-100'
                  iconTextColor='text-purple-700'
                  valueColor='text-purple-600'
                  className='p-3 sm:p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all'
                />

                <AdminStatsCard
                  title='Warga Biasa'
                  value={wargaCount || 0}
                  description='Pengguna aktif'
                  icon={<User2 className='w-6 h-6 sm:w-7 sm:h-7' />}
                  iconBgColor='bg-gradient-to-br from-green-50 to-green-100'
                  iconTextColor='text-green-700'
                  valueColor='text-green-600'
                  className='p-3 sm:p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all'
                />
              </div>
            </div>
          )}

          {/* Enhanced Table Card - Only for Admin */}
          {isAdmin && (
            <>
              {/* Filters */}
              <AdminFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder='Cari nama, username, HP, alamat...'
                filters={filterOptions}
                activeFilter={filterRole}
                onFilterChange={filter =>
                  setFilterRole(filter as 'all' | 'admin' | 'warga')
                }
                onRefresh={handleRefresh}
                onReset={() => {
                  setSearchTerm('');
                  setFilterRole('all');
                }}
                isRefreshing={isRefreshing}
                rightActions={
                  <Button
                    onClick={handleCreateUser}
                    className='cursor-pointer flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium'
                  >
                    <UserPlus className='w-4 h-4' />
                    <span className='hidden sm:inline'>Tambah User</span>
                  </Button>
                }
              />

              {/* Table */}
              <AdminTable
                title='Daftar Pengguna IPL Cluster Cannary'
                description={`Menampilkan ${filteredUsers.length} dari ${users.length} total pengguna`}
                icon={<Eye className='w-5 h-5 text-green-600' />}
                columns={tableColumns}
                data={paginatedUsers}
                emptyState={{
                  icon:
                    searchTerm || filterRole !== 'all' ? (
                      <Search className='w-12 h-12 text-gray-400' />
                    ) : (
                      <Users className='w-12 h-12 text-gray-400' />
                    ),
                  title:
                    searchTerm || filterRole !== 'all'
                      ? 'Tidak Ada Hasil Ditemukan'
                      : 'Belum Ada Pengguna Terdaftar',
                  description:
                    searchTerm || filterRole !== 'all'
                      ? 'Coba ubah kata kunci pencarian atau filter untuk mendapatkan hasil yang lebih relevan'
                      : 'Sistem siap digunakan. Pengguna pertama akan muncul di sini setelah registrasi',
                  action: (searchTerm || filterRole !== 'all') && (
                    <Button
                      onClick={() => {
                        setSearchTerm('');
                        setFilterRole('all');
                      }}
                      className='cursor-pointer mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors'
                    >
                      Reset Pencarian
                    </Button>
                  ),
                }}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredUsers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* User Management Modal - Only for Admin */}
      {isAdmin && (
        <UserManagementModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUserUpdated={handleUserUpdated}
          user={selectedUser}
          mode={modalMode}
        />
      )}
    </div>
  );
};

export default UserManagement;
