import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import type { PaidUser } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  CheckCircle2,
  Users,
  Calendar,
  CreditCard,
  Home,
  Phone,
} from "lucide-react";
import { formatCurrency, formatDate } from "../../utils/format.utils";
import { LoadingSpinner } from "../common";

interface PaidUsersCardProps {
  className?: string;
}

const PaidUsersCard: React.FC<PaidUsersCardProps> = ({ className = "" }) => {
  const [paidUsers, setPaidUsers] = useState<PaidUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  useEffect(() => {
    console.log("Selected month changed:", selectedMonth);
    fetchPaidUsers();
  }, [selectedMonth]);

  const fetchPaidUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      console.log(
        "Fetching paid users for month:",
        selectedMonth || "current month"
      );
      const response = await adminService.getPaidUsers(
        selectedMonth || undefined
      );
      console.log("Paid users response:", response);
      setPaidUsers(response);
    } catch (err: any) {
      console.error("Error fetching paid users:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Gagal memuat data warga yang sudah membayar";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const label = date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
      });
      months.push({ value, label });
    }
    console.log("Available months:", months);
    return months;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank_transfer":
        return <CreditCard className="w-4 h-4" />;
      case "gopay":
      case "shopeepay":
      case "qris":
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank_transfer":
        return "Transfer Bank";
      case "gopay":
        return "GoPay";
      case "shopeepay":
        return "ShopeePay";
      case "qris":
        return "QRIS";
      default:
        return method || "N/A";
    }
  };

  if (isLoading) {
    return (
      <Card
        className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Warga yang Sudah Membayar
          </CardTitle>
          <CardDescription>
            Daftar warga yang telah menyelesaikan pembayaran iuran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={`rounded-2xl shadow-md hover:shadow-xl transition ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Warga yang Sudah Membayar
            </CardTitle>
            <CardDescription>
              Daftar warga yang telah menyelesaikan pembayaran iuran
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Semua Bulan</option>
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchPaidUsers}
              className="h-8">
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchPaidUsers} variant="outline">
              Coba Lagi
            </Button>
          </div>
        ) : paidUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {selectedMonth
                ? `Belum ada warga yang membayar pada ${
                    getMonthOptions().find((m) => m.value === selectedMonth)
                      ?.label || selectedMonth
                  }`
                : "Belum ada warga yang membayar"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Total:{" "}
                <span className="font-semibold text-green-600">
                  {paidUsers.length}
                </span>{" "}
                warga
              </p>
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Semua Lunas
              </Badge>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-3">
              {paidUsers.map((user) => (
                <div
                  key={`${user.user_id}-${user.fee_id}`}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">
                          {user.is_orphaned ? (
                            <span className="text-red-600">{user.nama}</span>
                          ) : (
                            user.nama
                          )}
                        </h4>
                        {user.is_orphaned && (
                          <Badge variant="destructive" className="text-xs">
                            User Dihapus
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4 text-gray-400" />
                          <span>Rumah {user.nomor_rumah}</span>
                        </div>

                        {!user.is_orphaned && user.nomor_hp && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{user.nomor_hp}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className="font-medium">Tipe:</span>
                          <span>{user.tipe_rumah || "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-medium">Kategori:</span>
                          <span>{user.kategori}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-lg font-bold text-green-700">
                          {formatCurrency(user.nominal)}
                        </div>

                        <div className="text-right text-sm text-gray-600">
                          {user.payment_date && (
                            <div className="flex items-center gap-1 mb-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                Bayar: {formatDate(user.payment_date)}
                              </span>
                            </div>
                          )}
                          {user.payment_method && (
                            <div className="flex items-center gap-1">
                              {getPaymentMethodIcon(user.payment_method)}
                              <span>
                                {getPaymentMethodLabel(user.payment_method)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaidUsersCard;
