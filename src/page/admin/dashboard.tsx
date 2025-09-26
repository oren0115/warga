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
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  Building2,
  User,
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
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
      const response = await adminService.getDashboard();
      setStats(response);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // Data grafik dari API - akan diambil dari backend
  const monthlyFees = stats?.monthlyFees || [];

  const paymentStatus = [
    { name: "Berhasil", value: stats?.approvedPayments || 0 },
    { name: "Menunggu", value: stats?.pendingPayments || 0 },
  ];

  const COLORS = ["#22c55e", "#f59e0b"]; // hijau & oranye

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Skeleton loader */}
        <div className="animate-pulse space-y-6">
          <div className="h-24 bg-gray-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white mb-6 shadow-md">
        <div className="relative p-6 flex items-center gap-3">
          <Building2 className="w-10 h-10 text-white" />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Dashboard Iuran RT/RW
            </h1>
            <p className="text-green-100 text-sm">Sistem Pembayaran Digital</p>
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center gap-3">
            <User className="w-6 h-6 text-white" />
            <p className="text-green-100 text-sm">
              Halo, <span className="font-bold">Admin</span> 👋
            </p>
          </div>
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
          <div className="container mx-auto px-4 md:px-6 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {[
                {
                  icon: <Users className="w-8 h-8 text-blue-600" />,
                  title: "Total Pengguna",
                  value: stats.totalUsers,
                },
                {
                  icon: <FileText className="w-8 h-8 text-green-600" />,
                  title: "Total Iuran",
                  value: stats.totalFees,
                },
                {
                  icon: <Clock className="w-8 h-8 text-yellow-600" />,
                  title: "Menunggu Verifikasi",
                  value: stats.pendingPayments,
                },
                {
                  icon: <CheckCircle2 className="w-8 h-8 text-purple-600" />,
                  title: "Pembayaran Berhasil",
                  value: stats.approvedPayments,
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="rounded-2xl shadow-md hover:shadow-xl transition">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="p-4 bg-gray-100 rounded-xl">
                      {item.icon}
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm text-gray-500">{item.title}</p>
                      <p className="text-3xl font-bold">{item.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                    dari Rp {stats.collectionRate?.toLocaleString() || "0"}
                  </span>
                  <span className="text-sm font-semibold text-gray-700">
                    {stats.collectionRate}%
                  </span>
                </div>
                <Progress
                  value={stats.collectionRate}
                  className="h-4 rounded-full"
                />
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
                  className="cursor-pointer rounded-2xl border p-6 bg-white hover:shadow-xl hover:scale-105 transition transform flex flex-col items-center space-y-3">
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
