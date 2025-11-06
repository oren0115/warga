import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/auth.context';
import { adminService } from '../services/admin.service';
import type { User } from '../types';
import { logger } from '../utils/logger.utils';
import { getServiceDownMessage } from '../utils/network-error.utils';

export type RoleFilter = 'all' | 'admin' | 'warga';

export function useUserManagement() {
  const { authState } = useAuth();
  const isAdmin = authState.user?.is_admin === true;

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  // debounce search term
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearchTerm(searchTerm), 350);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const [filterRole, setFilterRole] = useState<RoleFilter>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (err: any) {
      logger.error('Error fetching users:', err);
      const errorMessage =
        err?.errorMapping?.userMessage ||
        getServiceDownMessage(err, 'Gagal memuat data pengguna');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) fetchUsers();
  }, [isAdmin, fetchUsers]);

  const handleRefresh = useCallback(async () => {
    if (!isAdmin) return;
    setIsRefreshing(true);
    setError(null);
    await fetchUsers();
    setIsRefreshing(false);
  }, [fetchUsers, isAdmin]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch =
        user.nama?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        user.nomor_hp?.includes(debouncedSearchTerm) ||
        user.alamat?.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesRole =
        filterRole === 'all' ||
        (filterRole === 'admin' && user.is_admin) ||
        (filterRole === 'warga' && !user.is_admin);
      return matchesSearch && matchesRole;
    });
  }, [users, debouncedSearchTerm, filterRole]);

  const totalPages = useMemo(
    () => Math.ceil(filteredUsers.length / itemsPerPage) || 1,
    [filteredUsers.length, itemsPerPage]
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = useMemo(
    () => filteredUsers.slice(startIndex, startIndex + itemsPerPage),
    [filteredUsers, startIndex, itemsPerPage]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filterRole, itemsPerPage]);

  const adminCount = useMemo(
    () => users.filter(u => u.is_admin).length,
    [users]
  );
  const wargaCount = useMemo(
    () => users.filter(u => !u.is_admin).length,
    [users]
  );

  // Modal handlers
  const handleCreateUser = useCallback(() => {
    if (!isAdmin) return;
    setSelectedUser(null);
    setModalMode('create');
    setIsModalOpen(true);
  }, [isAdmin]);

  const handleEditUser = useCallback(
    (user: User) => {
      if (!isAdmin) return;
      setSelectedUser(user);
      setModalMode('edit');
      setIsModalOpen(true);
    },
    [isAdmin]
  );

  const handleViewUser = useCallback(
    (user: User) => {
      if (!isAdmin) return;
      setSelectedUser(user);
      setModalMode('view');
      setIsModalOpen(true);
    },
    [isAdmin]
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleUserUpdated = useCallback(() => {
    if (isAdmin) fetchUsers();
  }, [fetchUsers, isAdmin]);

  return {
    // auth
    isAdmin,
    // data
    users,
    filteredUsers,
    paginatedUsers,
    adminCount,
    wargaCount,
    // ui state
    isLoading,
    error,
    isRefreshing,
    // filters/pagination
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    // modal
    isModalOpen,
    modalMode,
    selectedUser,
    handleCreateUser,
    handleEditUser,
    handleViewUser,
    handleCloseModal,
    handleUserUpdated,
    // actions
    handleRefresh,
  };
}
