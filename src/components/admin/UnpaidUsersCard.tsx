import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import { websocketService } from "../../services/websocket.service";
import type { UnpaidUser } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import {
  AlertCircle,
  Users,
  Phone,
  Home,
  Calendar,
  DollarSign,
  UserX,
  Filter,
  X,
  ChevronDown,
} from "lucide-react";
import { formatCurrency } from "../../utils/format.utils";
import { formatAbsoluteTime } from "../../utils/timezone.utils";

interface UnpaidUsersCardProps {
  className?: string;
}

type FilterType = "all" | "normal" | "orphaned";

const UnpaidUsersCard: React.FC<UnpaidUsersCardProps> = ({ className }) => {
  const [unpaidUsers, setUnpaidUsers] = useState<UnpaidUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UnpaidUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // Generate available months (last 12 months)
  const generateAvailableMonths = () => {
    const months = [];
    // Use Jakarta timezone to get correct current month
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      // Create month string manually to avoid timezone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Convert to 1-based and pad
      const monthStr = `${year}-${month}`;

      // Create label manually
      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];
      const monthLabel = `${monthNames[date.getMonth()]} ${year}`;

      months.push({ value: monthStr, label: monthLabel });
    }

    return months;
  };

  useEffect(() => {
    const months = generateAvailableMonths();
    setSelectedMonth(months[0].value); // Set to current month
  }, []);

  useEffect(() => {
    if (selectedMonth) {
      fetchUnpaidUsers(selectedMonth);
    }
  }, [selectedMonth]);

  // Listen for real-time updates
  useEffect(() => {
    const handleDashboardUpdate = (data: any) => {
      // Refresh unpaid users when dashboard updates
      if (selectedMonth) {
        fetchUnpaidUsers(selectedMonth);
      }
    };

    websocketService.onDashboardUpdate(handleDashboardUpdate);

    return () => {
      // Cleanup handled by service
    };
  }, [selectedMonth]);

  // Filter users based on selected filter
  useEffect(() => {
    let filtered = unpaidUsers;

    switch (filter) {
      case "normal":
        filtered = unpaidUsers.filter((user) => !user.is_orphaned);
        break;
      case "orphaned":
        filtered = unpaidUsers.filter((user) => user.is_orphaned);
        break;
      case "all":
      default:
        filtered = unpaidUsers;
        break;
    }

    setFilteredUsers(filtered);
  }, [unpaidUsers, filter]);

  const fetchUnpaidUsers = async (bulan?: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getUnpaidUsers(bulan);
      setUnpaidUsers(response);
    } catch (err: any) {
      console.error("Error fetching unpaid users:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Gagal memuat data warga yang belum membayar"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card
        className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Warga Belum Membayar
          </CardTitle>
          <CardDescription>
            Daftar warga yang belum membayar iuran bulan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-red-600" />
            Warga Belum Membayar
          </CardTitle>
          <CardDescription>
            Daftar warga yang belum membayar iuran bulan ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button
            size="sm"
            className="mt-3"
            onClick={() => fetchUnpaidUsers(selectedMonth)}
            variant="outline">
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-red-600" />
          Warga Belum Membayar
        </CardTitle>
        <CardDescription>
          Daftar warga yang belum membayar iuran
        </CardDescription>

        {/* Month Selector */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Bulan:</span>
          </div>

          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-3 py-1.5 pr-8 text-sm bg-white border border-green-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 hover:border-green-400 transition-colors cursor-pointer appearance-none">
              {generateAvailableMonths().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={`h-8 text-xs cursor-pointer ${
                filter === "all"
                  ? "bg-green-900 hover:bg-green-800 text-white"
                  : "border-green-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}>
              Semua ({unpaidUsers.length})
            </Button>

            <Button
              size="sm"
              variant={filter === "normal" ? "default" : "outline"}
              onClick={() => setFilter("normal")}
              className={`h-8 text-xs cursor-pointer ${
                filter === "normal"
                  ? "bg-green-900 hover:bg-green-800 text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}>
              <Users className="w-3 h-3 mr-1" />
              User Aktif ({unpaidUsers.filter((u) => !u.is_orphaned).length})
            </Button>

            <Button
              size="sm"
              variant={filter === "orphaned" ? "default" : "outline"}
              onClick={() => setFilter("orphaned")}
              className={`h-8 text-xs cursor-pointer ${
                filter === "orphaned"
                  ? "bg-red-900 hover:bg-red-800 text-white"
                  : "border-red-300 text-gray-700 hover:bg-red-100 hover:text-gray-900"
              }`}>
              <UserX className="w-3 h-3 mr-1" />
              User Dihapus ({unpaidUsers.filter((u) => u.is_orphaned).length})
            </Button>
          </div>

          {filter !== "all" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setFilter("all")}
              className="cursor-pointer h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 ">
              <X className="w-3 h-3 mr-1" />
              Clear Filter
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {unpaidUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Semua Warga Sudah Membayar!
            </h3>
            <p className="text-gray-500">
              Tidak ada warga yang belum membayar iuran untuk bulan yang
              dipilih.
            </p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Tidak Ada Data
            </h3>
            <p className="text-gray-500">
              Tidak ada data yang sesuai dengan filter yang dipilih.
            </p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => setFilter("all")}>
              Tampilkan Semua
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Total:{" "}
                <span className="font-semibold text-red-600">
                  {filteredUsers.length}
                </span>{" "}
                warga
              </p>
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <Users className="w-3 h-3 mr-1" />
                Belum Bayar
              </Badge>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.fee_id}
                  className={`border rounded-lg p-4 transition-colors ${
                    user.is_orphaned
                      ? "border-orange-300 bg-orange-50 hover:bg-orange-100"
                      : "border-red-200 bg-red-50 hover:bg-red-100"
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {user.is_orphaned ? (
                          <UserX className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Users className="w-4 h-4 text-red-600" />
                        )}
                        <h4
                          className={`font-semibold ${
                            user.is_orphaned
                              ? "text-orange-900"
                              : "text-gray-900"
                          }`}>
                          {user.nama}
                        </h4>
                        <Badge
                          variant={user.is_orphaned ? "secondary" : "outline"}
                          className={`text-xs ${
                            user.is_orphaned
                              ? "bg-orange-200 text-orange-800"
                              : ""
                          }`}>
                          {user.username}
                        </Badge>
                        {user.payment_failed && (
                          <Badge
                            variant="destructive"
                            className="text-xs bg-red-600">
                            Gagal Bayar
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          <span>
                            {user.is_orphaned
                              ? "Rumah N/A"
                              : `Rumah ${user.nomor_rumah}`}
                          </span>
                          {!user.is_orphaned && (
                            <Badge variant="secondary" className="text-xs">
                              {user.tipe_rumah}
                            </Badge>
                          )}
                        </div>

                        {!user.is_orphaned && user.nomor_hp && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{user.nomor_hp}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span
                            className={`font-semibold ${
                              user.is_orphaned
                                ? "text-orange-600"
                                : "text-red-600"
                            }`}>
                            {formatCurrency(user.nominal)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {user.kategori}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Jatuh tempo: {formatAbsoluteTime(user.due_date)}
                          </span>
                        </div>
                      </div>

                      {user.is_orphaned && (
                        <div className="mt-2 p-2 bg-orange-100 rounded text-xs text-orange-800">
                          <strong>Perhatian:</strong> User ini sudah dihapus
                          dari sistem, tetapi tagihan masih tersisa.
                          Pertimbangkan untuk menghapus tagihan ini atau
                          menghubungi admin untuk penanganan lebih lanjut.
                        </div>
                      )}

                      {user.payment_failed && (
                        <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800">
                          <strong>Status Pembayaran:</strong> Pembayaran
                          sebelumnya gagal ({user.payment_status}). User perlu
                          melakukan pembayaran ulang.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredUsers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Total tunggakan{" "}
                {filter !== "all" &&
                  `(${filter === "normal" ? "User Aktif" : "User Dihapus"})`}
                :
              </span>
              <span className="font-semibold text-red-600">
                {formatCurrency(
                  filteredUsers.reduce((sum, user) => sum + user.nominal, 0)
                )}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnpaidUsersCard;
