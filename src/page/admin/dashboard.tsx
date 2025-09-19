import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/admin.service";
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
import { Loader2, Users, FileText, Clock, CheckCircle2 } from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUserName = "user 2";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await adminService.getDashboard();
      setStats(response);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  // Dummy data grafik - nanti bisa diambil dari API
  const monthlyFees = [
    { month: "Jan", total: 500000 },
    { month: "Feb", total: 700000 },
    { month: "Mar", total: 300000 },
    { month: "Apr", total: 900000 },
    { month: "Mei", total: 1100000 },
  ];

  const paymentStatus = [
    { name: "Berhasil", value: stats?.approvedPayments || 0 },
    { name: "Menunggu", value: stats?.pendingPayments || 0 },
  ];

  const COLORS = ["#8b5cf6", "#facc15"];

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between bg-white shadow-sm border rounded-2xl p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard Tagihan
          </h1>
          <p className="text-gray-500 mt-1">
            Halo, {currentUserName} —{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
          <Button size="sm" className="mt-3" onClick={fetchDashboardData}>
            Coba Lagi
          </Button>
        </Alert>
      )}

      {stats && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition">
              <CardContent className="flex items-center justify-between p-6">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Pengguna</p>
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardContent className="flex items-center p-6">
                <div className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-xl">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Iuran</p>
                  <p className="text-3xl font-bold">{stats.totalFees}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardContent className="flex items-center p-6">
                <div className="p-4 bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-xl">
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Menunggu Verifikasi</p>
                  <p className="text-3xl font-bold">{stats.pendingPayments}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition">
              <CardContent className="flex items-center p-6">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Pembayaran Berhasil</p>
                  <p className="text-3xl font-bold">{stats.approvedPayments}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Pengumpulan */}
          <Card className="hover:shadow-md transition">
            <CardHeader>
              <CardTitle>Status Pengumpulan Bulan Ini</CardTitle>
              <CardDescription>
                Progress iuran warga bulan berjalan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total Terkumpul</span>
                <span className="text-xl font-semibold">
                  Rp {stats.currentMonthCollection?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="relative">
                <Progress
                  value={stats.collectionRate}
                  className="h-4 rounded-full"
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                  {stats.collectionRate}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <Card className="hover:shadow-md transition">
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
                    <Tooltip />
                    <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="hover:shadow-md transition">
              <CardHeader>
                <CardTitle>Status Pembayaran</CardTitle>
                <CardDescription>Distribusi status pembayaran</CardDescription>
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/admin/users")}
              className="cursor-pointer rounded-xl border p-6 bg-white hover:shadow-md transition flex flex-col items-center space-y-3">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="font-medium text-gray-700">Kelola Pengguna</span>
            </div>

            <div
              onClick={() => navigate("/admin/fees")}
              className="cursor-pointer rounded-xl border p-6 bg-white hover:shadow-md transition flex flex-col items-center space-y-3">
              <FileText className="w-8 h-8 text-green-600" />
              <span className="font-medium text-gray-700">Generate Iuran</span>
            </div>

            <div
              onClick={() => navigate("/admin/payments")}
              className="cursor-pointer rounded-xl border p-6 bg-white hover:shadow-md transition flex flex-col items-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-purple-600" />
              <span className="font-medium text-gray-700">
                Review Pembayaran
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
