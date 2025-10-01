import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/admin.service";
import { useAuth } from "../../context/auth.context";
import type { DashboardStats } from "../../types";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Alert, AlertDescription } from "../../components/ui/alert";
import {
  Users,
  FileText,
  CheckCircle2,
  User2,
  Receipt,
  LogOut,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  AdminPageHeader,
  AdminStatsCard,
  AdminLoading,
} from "../../components/admin";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Menggunakan data user dari context atau API

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError("");
    try {
      // console.log("Fetching dashboard data...");
      const response = await adminService.getDashboard();
      // console.log("Dashboard response:", response);
      setStats(response);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Gagal memuat data dashboard";
      setError(errorMessage);

      // Fallback data for testing
      console.log("Using fallback data for testing...");
      setStats({
        totalUsers: 15,
        totalFees: 45,
        pendingPayments: 8,
        approvedPayments: 12,
        currentMonthCollection: 1200000,
        collectionRate: 75.5,
        monthlyFees: [
          { month: "Jul", total: 800000 },
          { month: "Aug", total: 950000 },
          { month: "Sep", total: 1100000 },
          { month: "Oct", total: 1200000 },
          { month: "Nov", total: 1050000 },
          { month: "Dec", total: 1200000 },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Mobile logout button component
  const MobileLogoutButton = () => (
    <Button
      onClick={handleLogout}
      variant="outline"
      size="sm"
      className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white lg:hidden">
      <LogOut className="w-4 h-4 mr-1" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );

  // Data grafik dari API - akan diambil dari backend
  const monthlyFees = stats?.monthlyFees || [];

  const paymentStatus = [
    { name: "Berhasil", value: stats?.approvedPayments || 0 },
    { name: "Menunggu", value: stats?.pendingPayments || 0 },
  ];

  const COLORS = ["#22c55e", "#f59e0b"]; // hijau & oranye

  if (isLoading) {
    return <AdminLoading type="page" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <AdminPageHeader
        title="Selamat Datang, Admin!"
        subtitle="Dashboard Manajemen IPL Cluster Cannary"
        icon={<User2 className="w-5 h-5 md:w-6 md:h-6 text-white" />}
        rightAction={<MobileLogoutButton />}
      />

      {/* Error */}
      {error && (
        <div className="container mx-auto px-4 md:px-6">
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-semibold">Error: {error}</p>
                <p className="text-sm">
                  Menggunakan data demo untuk testing. Pastikan backend berjalan
                  di port 8000.
                </p>
              </div>
            </AlertDescription>
            <Button size="sm" className="mt-3" onClick={fetchDashboardData}>
              Coba Lagi
            </Button>
          </Alert>
        </div>
      )}

      {stats && (
        <>
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <AdminStatsCard
                title="Total Pengguna"
                value={stats.totalUsers}
                description="Terdaftar di sistem"
                icon={<Users className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-blue-100 to-blue-50"
                iconTextColor="text-blue-700"
              />
              <AdminStatsCard
                title="Total Iuran"
                value={stats.totalFees}
                description="Iuran bulanan"
                icon={<FileText className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-green-100 to-green-50"
                iconTextColor="text-green-700"
              />
              <AdminStatsCard
                title="Menunggu Verifikasi"
                value={stats.pendingPayments}
                description="Perlu tindak lanjut"
                icon={<CheckCircle2 className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-yellow-100 to-yellow-50"
                iconTextColor="text-yellow-700"
                valueColor="text-yellow-600"
              />
              <AdminStatsCard
                title="Pembayaran Berhasil"
                value={stats.approvedPayments}
                description="Transaksi selesai"
                icon={<Receipt className="w-7 h-7" />}
                iconBgColor="bg-gradient-to-br from-purple-100 to-purple-50"
                iconTextColor="text-purple-700"
                valueColor="text-green-600"
              />
            </div>

            {/* Status Pengumpulan */}
            <Card className="rounded-2xl shadow-md hover:shadow-xl transition mb-6">
              <CardHeader>
                <CardTitle>Status Pengumpulan Bulan Ini</CardTitle>
                <CardDescription>
                  Progress iuran warga bulan berjalan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-600">
                    {`Rp ${
                      stats.currentMonthCollection?.toLocaleString() || 0
                    }`}{" "}
                    terkumpul
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {stats.collectionRate}%
                  </span>
                </div>
                <Progress
                  value={stats.collectionRate}
                  className="h-4 rounded-full"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Target pengumpulan iuran bulan ini
                </p>
              </CardContent>
            </Card>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Bar Chart */}
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
                <CardHeader>
                  <CardTitle>Grafik Iuran Bulanan</CardTitle>
                  <CardDescription>
                    Ringkasan total iuran tiap bulan
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyFees}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      {/* <Tooltip
                      formatter={(val: number | undefined) =>
                        `Rp ${val?.toLocaleString()}`
                      }
                    /> */}
                      <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                        <LabelList
                          dataKey="total"
                          position="top"
                          content={({ value }) =>
                            value != null ? (
                              <tspan>{`Rp ${Number(
                                value
                              ).toLocaleString()}`}</tspan>
                            ) : null
                          }
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Pie Chart */}
              <Card className="rounded-2xl shadow-md hover:shadow-xl transition">
                <CardHeader>
                  <CardTitle>Status Pembayaran</CardTitle>
                  <CardDescription>
                    Distribusi status pembayaran
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={paymentStatus}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={90}
                        label>
                        {paymentStatus.map((_entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 ">
              {[
                {
                  title: "Kelola Pengguna",
                  icon: <Users className="w-8 h-8 text-blue-600" />,
                  link: "/admin/users",
                },
                {
                  title: "Generate Iuran",
                  icon: <FileText className="w-8 h-8 text-green-600" />,
                  link: "/admin/fees",
                },
                {
                  title: "Review Pembayaran",
                  icon: <CheckCircle2 className="w-8 h-8 text-purple-600" />,
                  link: "/admin/payments",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => navigate(item.link)}
                  className="cursor-pointer rounded-2xl border p-6 bg-white hover:shadow-xl hover:scale-105 transition transform flex flex-col items-center space-y-3 mb-4">
                  {item.icon}
                  <span className="font-medium text-gray-700">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
