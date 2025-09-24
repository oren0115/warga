import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import type { User } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import {
  Loader2,
  Search,
  Users,
  UserCheck,
  User2,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Building2,
} from "lucide-react";

const UserManagement: React.FC = () => {
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const usersData = await adminService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUsers();
    setIsRefreshing(false);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nomor_hp.includes(searchTerm) ||
      user.alamat.toLowerCase().includes(searchTerm.toLowerCase());

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
    });
  };

  const adminCount = users.filter((user) => user.is_admin).length;
  const wargaCount = users.filter((user) => !user.is_admin).length;

  const exportToCSV = () => {
    const headers = [
      "Nama",
      "Username",
      "No. HP",
      "Alamat",
      "No. Rumah",
      "Role",
      "Tanggal Bergabung",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          `"${user.nama}"`,
          `"${user.username}"`,
          `"${user.nomor_hp}"`,
          `"${user.alamat}"`,
          `"${user.nomor_rumah}"`,
          user.is_admin ? "Admin" : "Warga",
          `"${formatDate(user.created_at)}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `data_warga_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const resetCurrentPage = () => {
    setCurrentPage(1);
  };

  useEffect(() => {
    resetCurrentPage();
  }, [searchTerm, filterRole, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <div className="absolute inset-0 w-12 h-12 border-4 border-blue-100 rounded-full"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 mb-1">
                Memuat Data Pengguna
              </p>
              <p className="text-sm text-gray-500">Mohon tunggu sebentar...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden  mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Dashboard Manajemen Pengguna RT/RW
              </h1>
              <p className="text-green-100 text-sm">
                Sistem Pengelolaan Pengguna
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <User2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Kelola Pengguna
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola pengguna RT/RW Anda dengan mudah
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 space-y-6">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border border-blue-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl shadow-sm">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Total Pengguna
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {users.length.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 font-medium">
                    Terdaftar di sistem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl shadow-sm">
                  <UserCheck className="w-8 h-8 text-purple-700" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Administrator
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {adminCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 font-medium">
                    Akses penuh sistem
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border border-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl shadow-sm">
                  <Users className="w-8 h-8 text-green-700" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Warga Biasa
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {wargaCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 font-medium">
                    Pengguna aktif
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Table Card */}
        <Card className="shadow-lg rounded-xl border border-gray-100">
          <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-gray-100/50">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Database Warga RT/RW
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Menampilkan{" "}
                    <span className="font-semibold text-blue-600">
                      {filteredUsers.length}
                    </span>{" "}
                    dari <span className="font-semibold">{users.length}</span>{" "}
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
                    placeholder="Cari nama, username, HP, alamat..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    className="pl-10 pr-4 py-2.5 border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg text-sm"
                  />
                  {searchTerm && (
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
                      setFilterRole(e.target.value as "all" | "admin" | "warga")
                    }
                    className="pl-10 pr-8 py-2.5 border border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg text-sm bg-white appearance-none min-w-32">
                    <option value="all">Semua Role</option>
                    <option value="admin">Admin</option>
                    <option value="warga">Warga</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors text-sm font-medium">
                    <RefreshCw
                      className={`w-4 h-4 ${
                        isRefreshing ? "animate-spin" : ""
                      }`}
                    />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>

                  <button
                    onClick={exportToCSV}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
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
                  className="border border-gray-200 rounded px-2 py-1 text-sm">
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entri per halaman</span>
              </div>

              {(searchTerm || filterRole !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterRole("all");
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium">
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
                                  {user.nama.charAt(0).toUpperCase()}
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
                                {user.nomor_hp}
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
                                {user.alamat}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Badge className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
                                  Rumah #{user.nomor_rumah}
                                </Badge>
                              </div>
                            </div>
                          </TableCell>

                          {/* Role & Status */}
                          <TableCell className="py-4 px-6">
                            <div className="space-y-2">
                              {user.is_admin ? (
                                <Badge className="bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                                  🛡️ Administrator
                                </Badge>
                              ) : (
                                <Badge className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-full px-3 py-1 text-sm font-semibold shadow-sm">
                                  👤 Warga
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
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        ‹‹
                      </button>

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(p - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                                  currentPage === pageNum
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
                          setCurrentPage((p) => Math.min(p + 1, totalPages))
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        Next ›
                      </button>

                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
                    {(searchTerm || filterRole !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterRole("all");
                        }}
                        className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                        Reset Pencarian
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
