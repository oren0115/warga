import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import type { Payment } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
// import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Loader2,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Receipt,
  Calendar,
  DollarSign,
  Filter,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";

const PaymentReview: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const paymentsData = await adminService.getAdminPayments();
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPayments = payments.filter((payment) => {
    if (filter === "all") return true;
    if (filter === "pending") return payment.status === "Pending";
    if (filter === "success")
      return payment.status === "Settlement" || payment.status === "Success";
    if (filter === "failed")
      return (
        payment.status === "Deny" ||
        payment.status === "Cancel" ||
        payment.status === "Expire"
      );
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "settlement":
      case "success":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Berhasil
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="default"
            className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Menunggu
          </Badge>
        );
      case "deny":
      case "cancel":
      case "expire":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Gagal
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = {
    total: payments.length,
    pending: payments.filter((p) => p.status === "Pending").length,
    success: payments.filter(
      (p) => p.status === "Settlement" || p.status === "Success"
    ).length,
    failed: payments.filter(
      (p) =>
        p.status === "Deny" || p.status === "Cancel" || p.status === "Expire"
    ).length,
  };

  const totalAmount = payments
    .filter((p) => p.status === "Settlement" || p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-sm border">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            <p className="text-gray-600 font-medium">
              Memuat data pembayaran...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-6">
      {/* Header with improved design */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Receipt className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Review Pembayaran
            </h1>
            <p className="text-gray-600 mt-1">
              Kelola dan verifikasi pembayaran warga
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Total Pembayaran
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <CreditCard className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Menunggu
                </p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">
                  {stats.pending}
                </p>
                <p className="text-sm text-gray-500 mt-1">Perlu review</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Berhasil
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {stats.success}
                </p>
                <p className="text-sm text-gray-500 mt-1">Terverifikasi</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                  Gagal
                </p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {stats.failed}
                </p>
                <p className="text-sm text-gray-500 mt-1">Ditolak/Expired</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table Card with improved design */}
      <Card className="shadow-sm">
        <CardHeader className="border-b bg-gray-50/50">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-gray-600" />
              <div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  Daftar Pembayaran
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Menampilkan {filteredPayments.length} dari {stats.total}{" "}
                  transaksi
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="text-sm"
                size="sm">
                <TrendingUp className="w-4 h-4 mr-1" />
                Semua
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                onClick={() => setFilter("pending")}
                className="text-sm"
                size="sm">
                <Clock className="w-4 h-4 mr-1" />
                Menunggu
              </Button>
              <Button
                variant={filter === "success" ? "default" : "outline"}
                onClick={() => setFilter("success")}
                className="text-sm"
                size="sm">
                <CheckCircle className="w-4 h-4 mr-1" />
                Berhasil
              </Button>
              <Button
                variant={filter === "failed" ? "default" : "outline"}
                onClick={() => setFilter("failed")}
                className="text-sm"
                size="sm">
                <XCircle className="w-4 h-4 mr-1" />
                Gagal
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-700 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Tanggal</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Metode</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Nominal</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      ID Transaksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment, index) => (
                    <TableRow
                      key={payment.id}
                      className={`hover:bg-gray-50 transition-colors duration-150 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      }`}>
                      <TableCell className="font-medium text-gray-900 py-4">
                        <div className="flex flex-col">
                          <span>{formatDate(payment.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-medium">
                            {payment.payment_method}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-gray-600">
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {payment.transaction_id || "-"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-gray-100 rounded-full">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Tidak ada pembayaran
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {filter === "all"
                      ? "Belum ada pembayaran dari warga"
                      : "Tidak ada pembayaran dengan status ini"}
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

export default PaymentReview;
