import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import { useAuth } from "../../context/auth.context";
import type { User } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {
  Search,
  Users,
  UserCheck,
  User2,
  Filter,
  RefreshCw,
  Eye,
  UserPlus,
  Edit,
  Shield,
} from "lucide-react";
import UserManagementModal from "../../components/admin/UserManagementModal";
import {
  AdminPageHeader,
  AdminStatsCard,
  AdminTable,
  AdminFilters,
  AdminPagination,
  AdminLoading,
} from "../../components/admin";

const UserManagement: React.FC = () => {
  const { authState } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "warga">(
    "all"
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Admin role validation
  const isAdmin = authState.user?.is_admin === true;

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    // Admin validation untuk fetch users
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const usersData = await adminService.getUsers();
      // console.log("Fetched users data:", usersData);
      // Debug first user's tipe_rumah
      if (usersData.length > 0) {
        // console.log("First user tipe_rumah:", usersData[0].tipe_rumah);
      }
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    // Admin validation untuk refresh
    if (!isAdmin) {
      alert(
        "Akses ditolak. Hanya administrator yang dapat me-refresh data pengguna."
      );
      return;
    }
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nomor_hp?.includes(searchTerm) ||
      user.alamat?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      filterRole === "all" ||
      (filterRole === "admin" && user.is_admin) ||
      (filterRole === "warga" && !user.is_admin);

    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const adminCount = users.filter((user) => user.is_admin).length;
  const wargaCount = users.filter((user) => !user.is_admin).length;

  // Table columns definition
  const tableColumns = [
    {
      key: "user_info",
      label: "Informasi Pengguna",
      render: (_value: any, user: User) => (
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
            <span className="text-lg font-bold text-white">
              {user.nama?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-lg font-semibold text-gray-900 truncate">
              {user.nama}
            </p>
            <p className="text-sm text-gray-500 font-mono">@{user.username}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      label: "Kontak",
      render: (_value: any, user: User) => (
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-900">
            {user.nomor_hp || "Tidak ada nomor HP"}
          </p>
          <p className="text-xs text-gray-500">Nomor WhatsApp</p>
        </div>
      ),
    },
    {
      key: "address",
      label: "Alamat Lengkap",
      render: (_value: any, user: User) => (
        <div className="space-y-1 max-w-xs">
          <p className="text-sm text-gray-900 line-clamp-2">
            {user.alamat || "Tidak ada alamat"}
          </p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
              Rumah #{user.nomor_rumah || "N/A"}
            </Badge>
            {user.tipe_rumah && (
              <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                {user.tipe_rumah}
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "role_status",
      label: "Status & Role",
      render: (_value: any, user: User) => (
        <div className="space-y-2">
          {user.is_admin ? (
            <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
              <Shield className="w-5 h-5 mr-1" /> Administrator
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
              <User2 className="w-5 h-5 mr-1" /> Warga
            </Badge>
          )}
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Aktif</span>
          </div>
        </div>
      ),
    },
    {
      key: "join_date",
      label: "Bergabung",
      render: (_value: any, user: User) => (
        <div className="text-sm text-gray-600">
          <p className="font-medium">
            {formatDate(user.created_at).split(",")[0]}
          </p>
          <p className="text-xs text-gray-500">
            {formatDate(user.created_at).split(",")[1]}
          </p>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Aksi",
      render: (_value: any, user: User) => (
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleViewUser(user)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => handleEditUser(user)}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Filter options
  const filterOptions = [
    { key: "all", label: "Semua", count: users.length },
    { key: "admin", label: "Admin", count: adminCount },
    { key: "warga", label: "Warga", count: wargaCount },
  ];

  const resetCurrentPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    resetCurrentPage();
  }, [searchTerm, filterRole, itemsPerPage]);

  // Modal handlers
  const handleCreateUser = () => {
    // Admin validation untuk create user
    if (!isAdmin) {
      alert("Akses ditolak. Hanya administrator yang dapat menambah pengguna.");
      return;
    }
    setSelectedUser(null);
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    // Admin validation untuk edit user
    if (!isAdmin) {
      alert("Akses ditolak. Hanya administrator yang dapat mengedit pengguna.");
      return;
    }
    setSelectedUser(user);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    // Admin validation untuk view user
    if (!isAdmin) {
      alert(
        "Akses ditolak. Hanya administrator yang dapat melihat detail pengguna."
      );
      return;
    }
    setSelectedUser(user);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdated = () => {
    if (isAdmin) {
      fetchUsers();
    }
  };

  // Loading Skeleton
  if (isLoading) {
    return <AdminLoading type="page" />;
  }

  // Show access denied message for non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-md w-full text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="p-4 bg-red-100 rounded-full">
              <Shield className="w-12 h-12 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Akses Ditolak
              </h2>
              <p className="text-gray-600 mb-4">
                Halaman ini hanya dapat diakses oleh Administrator. Anda tidak
                memiliki izin untuk melihat data pengguna.
              </p>
              <p className="text-sm text-gray-500">
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
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header - Only for Admin */}
      {isAdmin && (
        <AdminPageHeader
          title="Kelola Pengguna"
          subtitle="Kelola pengguna IPL Cluster Anda dengan mudah"
          icon={<User2 className="w-5 h-5 md:w-6 md:h-6 text-white" />}
        />
      )}

      {isAdmin && (
        <div className="container mx-auto px-4 md:px-6 space-y-6">
          {/* Enhanced Stats Cards - Only for Admin */}
          {isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <AdminStatsCard
                title="Total Pengguna"
                value={users.length}
                description="Terdaftar di sistem"
                icon={<Users className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-blue-100 to-blue-50"
                iconTextColor="text-green-600"
              />
              <AdminStatsCard
                title="Administrator"
                value={adminCount}
                description="Akses penuh sistem"
                icon={<UserCheck className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-purple-100 to-purple-50"
                iconTextColor="text-purple-700"
              />
              <AdminStatsCard
                title="Warga Biasa"
                value={wargaCount}
                description="Pengguna aktif"
                icon={<Users className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-green-100 to-green-50"
                iconTextColor="text-green-700"
              />
            </div>
          )}

          {/* Enhanced Table Card - Only for Admin */}
          {isAdmin && (
            <>
              {/* Filters */}
              <AdminFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Cari nama, username, HP, alamat..."
                filters={filterOptions}
                activeFilter={filterRole}
                onFilterChange={(filter) =>
                  setFilterRole(filter as "all" | "admin" | "warga")
                }
                onRefresh={handleRefresh}
                onReset={() => {
                  setSearchTerm("");
                  setFilterRole("all");
                }}
                isRefreshing={isRefreshing}
                rightActions={
                  <Button
                    onClick={handleCreateUser}
                    className="cursor-pointer flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Tambah User</span>
                  </Button>
                }
              />

              {/* Table */}
              <AdminTable
                title="Daftar Pengguna IPL Cluster Cannary"
                description={`Menampilkan ${filteredUsers.length} dari ${users.length} total pengguna`}
                icon={<Eye className="w-5 h-5 text-green-600" />}
                columns={tableColumns}
                data={paginatedUsers}
                emptyState={{
                  icon:
                    searchTerm || filterRole !== "all" ? (
                      <Search className="w-12 h-12 text-gray-400" />
                    ) : (
                      <Users className="w-12 h-12 text-gray-400" />
                    ),
                  title:
                    searchTerm || filterRole !== "all"
                      ? "Tidak Ada Hasil Ditemukan"
                      : "Belum Ada Pengguna Terdaftar",
                  description:
                    searchTerm || filterRole !== "all"
                      ? "Coba ubah kata kunci pencarian atau filter untuk mendapatkan hasil yang lebih relevan"
                      : "Sistem siap digunakan. Pengguna pertama akan muncul di sini setelah registrasi",
                  action: (searchTerm || filterRole !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterRole("all");
                      }}
                      className="cursor-pointer mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
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

          {/* Old Table - Removed */}
          {false && false && (
            <Card className="shadow-lg rounded-xl border border-gray-100">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100/50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Eye className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">
                        Daftar Pengguna IPL Cluster Cannary
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        Menampilkan{" "}
                        <span className="font-semibold text-green-600">
                          {filteredUsers.length}
                        </span>{" "}
                        dari{" "}
                        <span className="font-semibold">{users.length}</span>{" "}
                        total pengguna
                        {filterRole !== "all" && (
                          <span className="ml-2">
                            • Filter:{" "}
                            <span className="capitalize font-medium text-purple-600">
                              {filterRole}
                            </span>
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                    {/* Search Input */}
                    <div className="relative min-w-0 sm:w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder={
                          isAdmin
                            ? "Cari nama, username, HP, alamat..."
                            : "Pencarian (read-only)"
                        }
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          isAdmin ? setSearchTerm(e.target.value) : null
                        }
                        disabled={!isAdmin}
                        className={`pl-10 pr-4 py-2.5 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-lg text-sm ${
                          !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
                        }`}
                      />
                      {searchTerm && isAdmin && (
                        <button
                          onClick={() => setSearchTerm("")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          ×
                        </button>
                      )}
                    </div>

                    {/* Role Filter */}
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={filterRole}
                        onChange={(e) =>
                          isAdmin
                            ? setFilterRole(
                                e.target.value as "all" | "admin" | "warga"
                              )
                            : null
                        }
                        disabled={!isAdmin}
                        className={`pl-10 pr-8 py-2.5 border border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-lg text-sm appearance-none min-w-32 ${
                          !isAdmin
                            ? "bg-gray-100 cursor-not-allowed"
                            : "bg-white"
                        }`}>
                        <option value="all">Semua Role</option>
                        <option value="admin">Admin</option>
                        <option value="warga">Warga</option>
                      </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {isAdmin && (
                        <Button
                          onClick={handleCreateUser}
                          className="cursor-pointer flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
                          <UserPlus className="w-4 h-4" />
                          <span className="hidden sm:inline">Tambah User</span>
                        </Button>
                      )}

                      {isAdmin && (
                        <Button
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          // variant="outline"
                          className="cursor-pointer flex items-center space-x-2 px-4 py-2.5 border-green-300 text-green-600 hover:bg-green-50  disabled:opacity-50 rounded-lg transition-colors text-sm font-medium">
                          <RefreshCw
                            className={`w-4 h-4 ${
                              isRefreshing ? "animate-spin" : ""
                            }`}
                          />
                          <span className="hidden sm:inline">Refresh</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Items per page selector */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Tampilkan:</span>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      disabled={!isAdmin}
                      className={`border border-gray-200 rounded px-2 py-1 text-sm ${
                        !isAdmin ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}>
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                    <span className="text-sm text-gray-600">
                      entri per halaman
                    </span>
                    {!isAdmin && (
                      <span className="text-xs text-gray-500">(read-only)</span>
                    )}
                  </div>

                  {(searchTerm || filterRole !== "all") && isAdmin && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterRole("all");
                      }}
                      className="text-sm text-green-600 hover:text-green-800 font-medium">
                      Reset Filter
                    </button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {paginatedUsers.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
                            {[
                              { key: "nama", label: "Informasi Pengguna" },
                              { key: "contact", label: "Kontak" },
                              { key: "address", label: "Alamat Lengkap" },
                              { key: "role", label: "Status & Role" },
                              { key: "joined", label: "Bergabung" },
                              ...(isAdmin
                                ? [{ key: "actions", label: "Aksi" }]
                                : []),
                            ].map((head) => (
                              <TableHead
                                key={head.key}
                                className="uppercase text-xs text-gray-600 font-bold tracking-wider py-4 px-6">
                                {head.label}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedUsers.map((user, index) => (
                            <TableRow
                              key={user.id}
                              className={`hover:bg-green-50 transition-colors border-b border-gray-100 ${
                                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                              }`}>
                              {/* User Info */}
                              <TableCell className="py-4 px-6">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-lg font-bold text-white">
                                      {user.nama?.charAt(0)?.toUpperCase() ||
                                        "?"}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-lg font-semibold text-gray-900 truncate">
                                      {user.nama}
                                    </p>
                                    <p className="text-sm text-gray-500 font-mono">
                                      @{user.username}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Contact */}
                              <TableCell className="py-4 px-6">
                                <div className="space-y-1">
                                  <p className="text-sm font-medium text-gray-900">
                                    {user.nomor_hp || "Tidak ada nomor HP"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Nomor WhatsApp
                                  </p>
                                </div>
                              </TableCell>

                              {/* Address */}
                              <TableCell className="py-4 px-6">
                                <div className="space-y-1 max-w-xs">
                                  <p className="text-sm text-gray-900 line-clamp-2">
                                    {user.alamat || "Tidak ada alamat"}
                                  </p>
                                  <div className="flex items-center space-x-2">
                                    <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
                                      Rumah #{user.nomor_rumah || "N/A"}
                                    </Badge>
                                    {user.tipe_rumah && (
                                      <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
                                        {user.tipe_rumah}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              {/* Role & Status */}
                              <TableCell className="py-4 px-6">
                                <div className="space-y-2">
                                  {user.is_admin ? (
                                    <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                                      <Shield className="w-5 h-5 mr-1" />{" "}
                                      Administrator
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                                      <User2 className="w-5 h-5 mr-1" /> Warga
                                    </Badge>
                                  )}
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs text-green-600 font-medium">
                                      Aktif
                                    </span>
                                  </div>
                                </div>
                              </TableCell>

                              {/* Join Date */}
                              <TableCell className="py-4 px-6">
                                <div className="text-sm text-gray-600">
                                  <p className="font-medium">
                                    {formatDate(user.created_at).split(",")[0]}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(user.created_at).split(",")[1]}
                                  </p>
                                </div>
                              </TableCell>

                              {/* Actions */}
                              {isAdmin && (
                                <TableCell className="py-4 px-6">
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => handleViewUser(user)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 cursor-pointer">
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => handleEditUser(user)}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 cursor-pointer">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                      <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t">
                        <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                          Menampilkan{" "}
                          <span className="font-medium">{startIndex + 1}</span>{" "}
                          sampai{" "}
                          <span className="font-medium">
                            {Math.min(
                              startIndex + itemsPerPage,
                              filteredUsers.length
                            )}
                          </span>{" "}
                          dari{" "}
                          <span className="font-medium">
                            {filteredUsers.length}
                          </span>{" "}
                          hasil
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => (isAdmin ? setCurrentPage(1) : null)}
                            disabled={currentPage === 1 || !isAdmin}
                            className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                              !isAdmin
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}>
                            ‹‹
                          </button>

                          <button
                            onClick={() =>
                              isAdmin
                                ? setCurrentPage((p) => Math.max(p - 1, 1))
                                : null
                            }
                            disabled={currentPage === 1 || !isAdmin}
                            className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                              !isAdmin
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}>
                            ‹ Prev
                          </button>

                          {/* Page Numbers */}
                          <div className="hidden sm:flex items-center space-x-1">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }

                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() =>
                                      isAdmin ? setCurrentPage(pageNum) : null
                                    }
                                    disabled={!isAdmin}
                                    className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                                      !isAdmin
                                        ? "bg-gray-100 cursor-not-allowed opacity-50"
                                        : currentPage === pageNum
                                        ? "bg-blue-600 text-white border-blue-600"
                                        : "bg-white hover:bg-gray-50"
                                    }`}>
                                    {pageNum}
                                  </button>
                                );
                              }
                            )}
                          </div>

                          {/* Mobile: Current page indicator */}
                          <div className="sm:hidden px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
                            {currentPage} / {totalPages}
                          </div>

                          <button
                            onClick={() =>
                              isAdmin
                                ? setCurrentPage((p) =>
                                    Math.min(p + 1, totalPages)
                                  )
                                : null
                            }
                            disabled={currentPage === totalPages || !isAdmin}
                            className={`px-3 py-2 rounded-lg border text-sm transition-colors cursor-pointer ${
                              !isAdmin
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}>
                            Next ›
                          </button>

                          <button
                            onClick={() =>
                              isAdmin ? setCurrentPage(totalPages) : null
                            }
                            disabled={currentPage === totalPages || !isAdmin}
                            className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                              !isAdmin
                                ? "bg-gray-100 cursor-not-allowed opacity-50"
                                : "bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            }`}>
                            ››
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-20">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                        {searchTerm || filterRole !== "all" ? (
                          <Search className="w-12 h-12 text-gray-400" />
                        ) : (
                          <Users className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div className="max-w-md">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {searchTerm || filterRole !== "all"
                            ? "Tidak Ada Hasil Ditemukan"
                            : "Belum Ada Pengguna Terdaftar"}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          {searchTerm || filterRole !== "all"
                            ? "Coba ubah kata kunci pencarian atau filter untuk mendapatkan hasil yang lebih relevan"
                            : "Sistem siap digunakan. Pengguna pertama akan muncul di sini setelah registrasi"}
                        </p>
                        {(searchTerm || filterRole !== "all") && isAdmin && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterRole("all");
                            }}
                            className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                            Reset Pencarian
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
