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
import { Loader2, Search, Users, UserCheck } from "lucide-react";

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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

  const filteredUsers = users.filter(
    (user) =>
      user.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nomor_hp.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const adminCount = users.filter((user) => user.is_admin).length;
  const wargaCount = users.filter((user) => !user.is_admin).length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            <p className="text-gray-600 font-medium">Memuat data pengguna...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="sticky top-0 bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-3 mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kelola Pengguna
            </h1>
            <p className="text-gray-600 mt-1">
              Daftar semua warga yang terdaftar dalam sistem
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Total Warga
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {users.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-100 rounded-xl">
                <UserCheck className="w-8 h-8 text-purple-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Admin
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {adminCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Warga
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {wargaCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="shadow-sm rounded-xl">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Cari Warga
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Menampilkan {filteredUsers.length} dari {users.length} warga
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari berdasarkan nama, username..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
                className="pl-10 pr-4 py-2 border-gray-200 focus:border-gray-300 focus:ring-gray-200 rounded-lg"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {paginatedUsers.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      {[
                        "Nama",
                        "Username",
                        "No. HP",
                        "Alamat",
                        "No. Rumah",
                        "Role",
                        "Bergabung",
                      ].map((head) => (
                        <TableHead
                          key={head}
                          className="uppercase text-xs text-gray-500 font-semibold tracking-wide">
                          {head}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user, index) => (
                      <TableRow
                        key={user.id}
                        className={`hover:bg-gray-50 border-b border-gray-100 ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}>
                        <TableCell className="py-4 font-medium text-gray-900">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-700">
                                {user.nama.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span>{user.nama}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          @{user.username}
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          {user.nomor_hp}
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-xs truncate">
                          {user.alamat}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {user.nomor_rumah}
                        </TableCell>
                        <TableCell>
                          {user.is_admin ? (
                            <Badge className="bg-purple-100 text-purple-800 rounded-full px-2 py-0.5 text-xs font-medium">
                              Admin
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 rounded-full px-2 py-0.5 text-xs font-medium">
                              Warga
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 text-sm">
                          {formatDate(user.created_at)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-2 py-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-lg border text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      currentPage === i + 1
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}>
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-lg border text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50">
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  {searchTerm ? (
                    <Search className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Users className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {searchTerm
                      ? "Pengguna tidak ditemukan"
                      : "Belum ada pengguna"}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? "Coba gunakan kata kunci yang berbeda"
                      : "Belum ada pengguna yang terdaftar dalam sistem"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
