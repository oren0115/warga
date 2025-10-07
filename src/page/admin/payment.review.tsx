import React, { useEffect, useState } from "react";
import { adminService } from "../../services/admin.service";
import type { Payment } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  DollarSign,
  TrendingUp,
  Search,
  FileText,
  Banknote,
  RefreshCw,
  BarChart3,
  Receipt,
  Eye,
  Calendar as CalendarIcon,
  Clock3,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { PaymentCard } from "../../components/common";
import { AdminPageHeader, AdminPagination } from "@/components/admin";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../../components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface PaymentStats {
  total: number;
  pending: number;
  success: number;
  failed: number;
  todayTotal: number;
  thisMonthTotal: number;
  successRate: number;
  totalRevenue: number;
}

// Skeleton Components - Removed, now using AdminLoading

const PaymentReview: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<
    "today" | "week" | "month" | "all"
  >("all");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const paymentsData = await adminService.getAdminPaymentsWithDetails();
      setPayments(paymentsData);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPayments();
    setIsRefreshing(false);
  };

  const getDateRangeFilter = () => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (dateRange) {
      case "today":
        return (payment: Payment) => new Date(payment.created_at) >= today;
      case "week":
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return (payment: Payment) => new Date(payment.created_at) >= weekAgo;
      case "month":
        const monthAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return (payment: Payment) => new Date(payment.created_at) >= monthAgo;
      default:
        return () => true;
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

    // Filter by date range
    const dateMatch = getDateRangeFilter()(payment);

    return statusMatch && searchMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getDetailedStats = (): PaymentStats => {
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const todayPayments = payments.filter(
      (p) => new Date(p.created_at) >= today
    );
    const monthPayments = payments.filter(
      (p) => new Date(p.created_at) >= thisMonth
    );
    const successPayments = payments.filter(
      (p) => p.status === "Settlement" || p.status === "Success"
    );

    return {
      total: payments.length,
      pending: payments.filter((p) => p.status === "Pending").length,
      success: successPayments.length,
      failed: payments.filter(
        (p) =>
          p.status === "Deny" || p.status === "Cancel" || p.status === "Expire"
      ).length,
      todayTotal: todayPayments.length,
      thisMonthTotal: monthPayments.length,
      successRate:
        payments.length > 0
          ? Math.round((successPayments.length / payments.length) * 100)
          : 0,
      totalRevenue: successPayments.reduce((sum, p) => sum + p.amount, 0),
    };
  };

  const stats = getDetailedStats();

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
      const filename = `laporan_pembayaran_${startDate}_${endDate}.${
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
      <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header Skeleton */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6">
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

          <div className="relative p-4 md:p-6">
            <div className="hidden md:flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold">
                  Dashboard Review Pembayaran RT/RW
                </h1>
                <p className="text-green-100 text-sm">
                  Sistem Review Pembayaran
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                    <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold mb-1">
                      Review Pembayaran
                    </h2>
                    <div className="h-4 bg-white/20 rounded animate-pulse w-48"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 space-y-6">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="hover:shadow-lg transition-all duration-300 border rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                      <div className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-xl animate-pulse">
                      <div className="w-7 h-7 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Table Card Skeleton */}
          <Card className="shadow-lg border border-gray-200">
            <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white p-6">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-64"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>

                {/* Search and Filters Skeleton */}
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                  <div className="relative flex-1 max-w-md">
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-8 bg-gray-200 rounded animate-pulse w-16"></div>
                    ))}
                  </div>
                </div>

                {/* Filter Buttons Skeleton */}
                <div className="flex flex-wrap gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
                  ))}
                </div>

                {/* Export Section Skeleton */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-3 flex-1">
                    <CalendarIcon className="w-5 h-5 text-green-600" />
                    <div className="h-8 bg-white rounded animate-pulse flex-1"></div>
                    <span className="text-gray-500 font-medium">—</span>
                    <div className="h-8 bg-white rounded animate-pulse flex-1"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-white rounded animate-pulse w-24"></div>
                    <div className="h-8 bg-white rounded animate-pulse w-20"></div>
                  </div>
                </div>

                {/* Bottom controls skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              {/* Payment Cards Grid Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="pb-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gray-200 rounded"></div>
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 bg-gray-200 rounded"></div>
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                      <div className="p-4 bg-gray-100 rounded-xl">
                        <div className="flex justify-between items-center">
                          <div className="h-4 bg-gray-200 rounded w-32"></div>
                          <div className="h-6 bg-gray-200 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[...Array(3)].map((_, j) => (
                          <div
                            key={j}
                            className="flex justify-between items-center py-2">
                            <div className="h-3 bg-gray-200 rounded w-20"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Skeleton */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-48 mb-4 sm:mb-0"></div>
                <div className="flex items-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 bg-gray-200 rounded animate-pulse w-8"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <AdminPageHeader
        title="Review Pembayaran"
        subtitle="Kelola pembayaran iuran IPL Cluster Anda dengan mudah"
        icon={<Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />}
      />

      <div className="container mx-auto px-4 md:px-6 space-y-6">
        {/* Enhanced Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border rounded-xl ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Total Pembayaran
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">
                      Hari ini:{" "}
                      <span className="font-semibold text-blue-600">
                        {stats.todayTotal}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-sm">
                  <Receipt className="w-7 h-7 text-blue-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border  ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Menunggu Review
                  </p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {stats.pending.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock3 className="w-4 h-4 text-yellow-500" />
                    <span className="text-gray-600">Perlu tindak lanjut</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl shadow-sm">
                  <Clock className="w-7 h-7 text-yellow-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border  ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Berhasil Diproses
                  </p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.success.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">
                      Tingkat berhasil:{" "}
                      <span className="font-semibold text-green-600">
                        {stats.successRate}%
                      </span>
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-sm">
                  <CheckCircle className="w-7 h-7 text-green-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 rounded-xl border  ">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Total Pendapatan
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Banknote className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">
                      Bulan ini:{" "}
                      <span className="font-semibold text-green-600">
                        {stats.thisMonthTotal}
                      </span>{" "}
                      transaksi
                    </span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-sm">
                  <DollarSign className="w-7 h-7 text-purple-700" />
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
                    <Eye className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold  text-gray-900">
                      Database Transaksi Pembayaran
                    </CardTitle>
                  </div>
                </div>

                <Button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  size="sm"
                  className="font-medium bg-white hover:bg-green-600  border-green-20 cursor-pointer">
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isRefreshing ? "animate-spin" : ""
                    }`}
                  />
                  {isRefreshing ? "Memuat..." : "Refresh"}
                </Button>
              </div>

              {/* Enhanced Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search Bar */}
                <div className="relative flex-1 w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Cari metode, ID transaksi, atau nominal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      ×
                    </button>
                  )}
                </div>

                {/* Date Range Filter - Desktop */}
                <div className="hidden lg:flex gap-2">
                  {[
                    { key: "all", label: "Semua Waktu" },
                    { key: "today", label: "Hari Ini" },
                    { key: "week", label: "7 Hari" },
                    { key: "month", label: "30 Hari" },
                  ].map((range) => (
                    <Button
                      key={range.key}
                      variant={dateRange === range.key ? "default" : "outline"}
                      onClick={() => setDateRange(range.key as any)}
                      size="sm"
                      className="text-xs cursor-pointer">
                      {range.label}
                    </Button>
                  ))}
                </div>

                {/* Date Range Filter - Mobile (Select) */}
                <div className="lg:hidden w-full">
                  <Select
                    value={dateRange}
                    onValueChange={(value) =>
                      setDateRange(value as "today" | "week" | "month" | "all")
                    }>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih rentang waktu" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Waktu</SelectItem>
                      <SelectItem value="today">Hari Ini</SelectItem>
                      <SelectItem value="week">7 Hari</SelectItem>
                      <SelectItem value="month">30 Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Status Filter Buttons - Desktop */}
              <div className="hidden lg:flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                  className="text-sm font-medium"
                  size="sm">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Semua ({stats.total.toLocaleString()})
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  onClick={() => setFilter("pending")}
                  className="text-sm font-medium hover:bg-amber-600 hover:text-white"
                  size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  Menunggu ({stats.pending.toLocaleString()})
                </Button>
                <Button
                  variant={filter === "success" ? "default" : "outline"}
                  onClick={() => setFilter("success")}
                  className="text-sm font-medium"
                  size="sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Berhasil ({stats.success.toLocaleString()})
                </Button>
                <Button
                  variant={filter === "failed" ? "default" : "outline"}
                  onClick={() => setFilter("failed")}
                  className="text-sm font-medium"
                  size="sm">
                  <XCircle className="w-4 h-4 mr-2" />
                  Gagal ({stats.failed.toLocaleString()})
                </Button>
              </div>

              {/* Status Filter - Mobile (Sheet) */}
              <div className="lg:hidden w-full">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full hover:bg-green-500 cursor-pointer">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter Status{" "}
                      {filter !== "all" && (
                        <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                          {filter === "pending"
                            ? "Menunggu"
                            : filter === "success"
                            ? "Berhasil"
                            : "Gagal"}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-auto">
                    <SheetHeader>
                      <SheetTitle>Filter Status Pembayaran</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-3 py-4">
                      <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                        className="justify-start h-12">
                        <TrendingUp className="w-5 h-5 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">Semua</div>
                          <div className="text-xs opacity-70">
                            {stats.total.toLocaleString()} transaksi
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant={filter === "pending" ? "default" : "outline"}
                        onClick={() => setFilter("pending")}
                        className="justify-start h-12">
                        <Clock className="w-5 h-5 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">Menunggu</div>
                          <div className="text-xs opacity-70">
                            {stats.pending.toLocaleString()} transaksi
                          </div>
                        </div>
                      </Button>
                      <Button
                        
                        onClick={() => setFilter("success")}
                        variant={filter === "berhasil" ? "default" : "outline"}
                        className="justify-start h-12">
                        <CheckCircle className="w-5 h-5 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">Berhasil</div>
                          <div className="text-xs opacity-70">
                            {stats.success.toLocaleString()} transaksi
                          </div>
                        </div>
                      </Button>
                      <Button
                        variant={filter === "failed" ? "default" : "outline"}
                        onClick={() => setFilter("failed")}
                        className="justify-start h-12">
                        <XCircle className="w-5 h-5 mr-3" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">Gagal</div>
                          <div className="text-xs opacity-70">
                            {stats.failed.toLocaleString()} transaksi
                          </div>
                        </div>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Enhanced Export Section */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <CalendarIcon className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-700">
                    Export Laporan
                  </h3>
                </div>

                {/* Date Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Tanggal Mulai
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Tanggal Akhir
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full border-gray-200 bg-white"
                    />
                  </div>
                </div>

                {/* Export Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExport("excel")}
                    disabled={isExporting}
                    className="font-medium bg-white hover:bg-green-50 border-green-200 text-green-700">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Export </span>Excel
                  </Button>
                </div>
              </div>

              {/* Reset Filter Button */}
              {(searchTerm || filter !== "all" || dateRange !== "all") && (
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilter("all");
                      setDateRange("all");
                      setCurrentPage(1);
                    }}
                    variant="outline"
                    size="sm"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Reset Semua Filter
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {paginatedPayments.length > 0 ? (
              <>
                {/* Payment Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedPayments.map((payment) => (
                    <PaymentCard
                      key={payment.id}
                      payment={payment}
                      onRefresh={handleRefresh}
                      className="w-full"
                      isAdmin={true}
                    />
                  ))}
                </div>

                {/* AdminPagination Component */}
                <AdminPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredPayments.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={(newItemsPerPage) => {
                    setItemsPerPage(newItemsPerPage);
                    setCurrentPage(1);
                  }}
                  itemsPerPageOptions={[5, 10, 25, 50]}
                  showItemsPerPage={true}
                  className="mt-8"
                  totalUnfilteredItems={payments.length}
                  filterInfo="transaksi"
                />
              </>
            ) : (
              <div className="text-center py-20">
                <div className="flex flex-col items-center space-y-6">
                  <div className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full">
                    {searchTerm || filter !== "all" || dateRange !== "all" ? (
                      <Search className="w-16 h-16 text-gray-400" />
                    ) : (
                      <Receipt className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <div className="max-w-lg space-y-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {searchTerm || filter !== "all" || dateRange !== "all"
                        ? "Tidak Ada Hasil Ditemukan"
                        : "Belum Ada Transaksi Pembayaran"}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-600 leading-relaxed">
                        {searchTerm || filter !== "all" || dateRange !== "all"
                          ? "Tidak ditemukan transaksi yang sesuai dengan kriteria pencarian atau filter yang Anda terapkan."
                          : "Sistem pembayaran siap digunakan. Transaksi pembayaran dari warga akan muncul di sini setelah ada yang melakukan pembayaran."}
                      </p>
                      {(searchTerm ||
                        filter !== "all" ||
                        dateRange !== "all") && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-sm text-blue-700 mb-3">
                            <strong>Saran:</strong> Coba ubah atau hapus
                            beberapa filter berikut:
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            {searchTerm && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                Pencarian: "{searchTerm}"
                              </span>
                            )}
                            {filter !== "all" && (
                              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                                Status: {filter}
                              </span>
                            )}
                            {dateRange !== "all" && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                                Periode: {dateRange}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-center space-x-3">
                      {(searchTerm ||
                        filter !== "all" ||
                        dateRange !== "all") && (
                        <Button
                          onClick={() => {
                            setFilter("all");
                            setSearchTerm("");
                            setDateRange("all");
                            setCurrentPage(1);
                          }}
                          className="font-medium">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Reset Semua Filter
                        </Button>
                      )}
                      <Button
                        onClick={handleRefresh}
                        variant="outline"
                        disabled={isRefreshing}
                        className="font-medium">
                        <RefreshCw
                          className={`w-4 h-4 mr-2 ${
                            isRefreshing ? "animate-spin" : ""
                          }`}
                        />
                        {isRefreshing ? "Memuat..." : "Refresh Data"}
                      </Button>
                    </div>
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

export default PaymentReview;
