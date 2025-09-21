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
import {
  Loader2,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  DollarSign,
  Filter,
  TrendingUp,
  AlertCircle,
  Search,
  Download,
  FileText,
  Banknote,
  Activity,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";

const PaymentReview: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    // Filter by status
    let statusMatch = true;
    if (filter === "pending") statusMatch = payment.status === "Pending";
    else if (filter === "success")
      statusMatch =
        payment.status === "Settlement" || payment.status === "Success";
    else if (filter === "failed")
      statusMatch =
        payment.status === "Deny" ||
        payment.status === "Cancel" ||
        payment.status === "Expire";

    // Filter by search term
    const searchMatch =
      searchTerm === "" ||
      payment.payment_method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transaction_id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.amount.toString().includes(searchTerm);

    return statusMatch && searchMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "settlement":
      case "success":
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200 font-medium">
            <CheckCircle className="w-3 h-3 mr-1.5" />
            Berhasil
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="default"
            className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 font-medium">
            <Clock className="w-3 h-3 mr-1.5" />
            Menunggu
          </Badge>
        );
      case "deny":
      case "cancel":
      case "expire":
        return (
          <Badge
            variant="destructive"
            className="bg-red-100 text-red-800 border-red-200 hover:bg-red-200 font-medium">
            <XCircle className="w-3 h-3 mr-1.5" />
            Gagal
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200 font-medium">
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

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const validateDateRange = () => {
    if (!startDate || !endDate) return "Tanggal mulai dan akhir wajib diisi";
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()))
      return "Format tanggal tidak valid";
    if (s > e) return "Tanggal mulai tidak boleh melebihi tanggal akhir";
    return "";
  };

  const handleExport = async (format: "excel" | "pdf") => {
    const err = validateDateRange();
    if (err) {
      alert(err);
      return;
    }
    try {
      setIsExporting(true);
      const blob = await adminService.exportPaymentsReport(
        startDate,
        endDate,
        format
      );
      const filename = `payments_${startDate}_${endDate}.${
        format === "excel" ? "xlsx" : "pdf"
      }`;
      triggerDownload(blob, filename);
    } catch (e) {
      console.error(e);
      alert("Gagal mengekspor laporan pembayaran");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Memuat Data Pembayaran
              </h3>
              <p className="text-gray-600">
                Sedang mengambil informasi pembayaran terbaru...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gray-100 rounded-xl">
              <Activity className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                Review Pembayaran
              </h1>
              <p className="text-gray-600 text-lg">
                Kelola dan verifikasi pembayaran warga dengan mudah
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              Terakhir diperbarui: {new Date().toLocaleDateString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-gray-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Total Pembayaran
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <div className="flex items-center space-x-2">
                  <Banknote className="w-4 h-4 text-gray-500" />
                  <p className="text-sm font-medium text-gray-600">
                    {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-gray-100 rounded-xl">
                <CreditCard className="w-7 h-7 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Menunggu Review
                </p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Memerlukan perhatian
                </p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-xl">
                <Clock className="w-7 h-7 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Berhasil
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.success}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Sudah terverifikasi
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                  Gagal/Ditolak
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.failed}
                </p>
                <p className="text-sm font-medium text-gray-600">
                  Tidak berhasil diproses
                </p>
              </div>
              <div className="p-4 bg-red-100 rounded-xl">
                <XCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Main Table Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Filter className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Daftar Pembayaran
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Menampilkan {filteredPayments.length} dari {stats.total}{" "}
                    transaksi
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cari metode, ID transaksi, atau nominal..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="text-sm font-medium"
                  size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Semua ({stats.total})
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  onClick={() => setFilter("pending")}
                  className="text-sm font-medium"
                  size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Menunggu ({stats.pending})
                </Button>
                <Button
                  variant={filter === "success" ? "default" : "outline"}
                  onClick={() => setFilter("success")}
                  className="text-sm font-medium"
                  size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Berhasil ({stats.success})
                </Button>
                <Button
                  variant={filter === "failed" ? "default" : "outline"}
                  onClick={() => setFilter("failed")}
                  className="text-sm font-medium"
                  size="sm">
                  <XCircle className="w-4 h-4 mr-2" />
                  Gagal ({stats.failed})
                </Button>
              </div>
            </div>

            {/* Enhanced Export Section */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-3 flex-1">
                <Calendar className="w-5 h-5 text-gray-500" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="flex-1 border-gray-200"
                  placeholder="Tanggal mulai"
                />
                <span className="text-gray-500 font-medium">sampai</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="flex-1 border-gray-200"
                  placeholder="Tanggal akhir"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("excel")}
                  disabled={isExporting}
                  className="font-medium">
                  <FileText className="w-4 h-4 mr-2" />
                  {isExporting ? "Mengekspor..." : "Export Excel"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                  className="font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-bold text-gray-800 py-5 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Waktu Transaksi</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 px-6">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Metode Pembayaran</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 px-6">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Nominal</span>
                      </div>
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 px-6">
                      Status Pembayaran
                    </TableHead>
                    <TableHead className="font-bold text-gray-800 px-6">
                      ID Transaksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment, index) => (
                    <TableRow
                      key={payment.id}
                      className={`hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                      }`}>
                      <TableCell className="font-medium text-gray-900 py-5 px-6">
                        <div className="space-y-1">
                          <div className="font-semibold">
                            {formatDate(payment.created_at)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                          </div>
                          <span className="font-semibold">
                            {payment.payment_method}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 font-bold text-lg px-6">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="px-6">
                        {getStatusBadge(payment.status)}
                      </TableCell>
                      <TableCell className="text-gray-600 px-6">
                        <span className="font-mono text-sm bg-gray-100 px-3 py-2 rounded-md border">
                          {payment.transaction_id || "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="flex flex-col items-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-full">
                  <AlertCircle className="w-12 h-12 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Tidak Ada Data Pembayaran
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    {filter === "all"
                      ? "Belum ada transaksi pembayaran dari warga. Data akan muncul setelah ada pembayaran yang dilakukan."
                      : `Tidak ada pembayaran dengan status "${filter}". Coba ubah filter atau periksa kembali data pembayaran.`}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilter("all");
                    setSearchTerm("");
                  }}
                  className="font-medium">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Tampilkan Semua
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentReview;
