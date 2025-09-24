import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { userService } from "../../services/user.service";
import type { Fee, Notification } from "../../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
  Calendar,
  Clock,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Bell,
  Building2,
  User,
} from "lucide-react";
import { LuBell } from "react-icons/lu";
import NotificationBadge from "@/components/NotificationBadge";
import NotificationPopup from "@/components/NotificationPopup";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [feesData, notificationsData] = await Promise.all([
        userService.getFees(),
        userService.getNotifications(),
      ]);
      setFees(feesData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "lunas":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "belum bayar":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "lunas":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "belum bayar":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getDaysUntilDueDate = (month: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const dueDate = new Date(currentYear, parseInt(month), 0); // Last day of the month
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getMonthName = (monthNum: string) => {
    const months = [
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
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchData} className="w-full">
                Coba Lagi
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentFee = fees.find(
    (fee) => parseInt(fee.bulan) === new Date().getMonth() + 1
  );

  const daysUntilDue = currentFee ? getDaysUntilDueDate(currentFee.bulan) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Notification Popup */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={() => setNotificationRefreshKey((prev) => prev + 1)}
      />

      {/* Enhanced Header with Branding - Responsive */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white  overflow-hidden mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          {/* Branding Section - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Manajemen Iuran RT/RW</h1>
              <p className="text-green-100 text-sm">
                Sistem Pembayaran Digital
              </p>
            </div>
          </div>

          {/* Compact Mobile Header - Only visible on mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">RT/RW</span>
            </div>
            <div className="relative">
              <Button
                onClick={() => setShowNotificationPopup(true)}
                variant="ghost"
                size="icon"
                className="relative">
                <LuBell className="h-5 w-5" />
                <NotificationBadge refreshKey={notificationRefreshKey} />
              </Button>
            </div>
          </div>

          {/* Enhanced Greeting Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Halo, {authState.user?.nama}! 👋
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola iuran RT/RW Anda dengan mudah
                  </p>
                </div>
              </div>
              {/* Desktop notification button - hidden on mobile */}
              <div className="hidden md:block relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowNotificationPopup(true)}>
                  <Bell className="w-5 h-5" />
                  <NotificationBadge refreshKey={notificationRefreshKey} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-2">
        {/* Current Fee - Enhanced */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <CreditCard className="w-5 h-5 text-green-600" />
                Iuran Bulan Ini
              </CardTitle>
              {currentFee && daysUntilDue > 0 && daysUntilDue <= 7 && (
                <Badge
                  variant="outline"
                  className="bg-orange-100 text-orange-800 border-orange-300 font-semibold px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {daysUntilDue} hari lagi
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {currentFee ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {getMonthName(currentFee.bulan)}{" "}
                      {new Date(currentFee.created_at).getFullYear()}
                    </span>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      currentFee.status
                    )} flex items-center gap-1 font-semibold px-3 py-1`}>
                    {getStatusIcon(currentFee.status)}
                    {currentFee.status}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {formatCurrency(currentFee.nominal)}
                </div>

                {daysUntilDue > 0 && daysUntilDue <= 30 && (
                  <div
                    className={`p-4 rounded-lg border-2 ${
                      daysUntilDue <= 7
                        ? "bg-red-50 border-red-200"
                        : daysUntilDue <= 14
                        ? "bg-orange-50 border-orange-200"
                        : "bg-blue-50 border-blue-200"
                    }`}>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <AlertCircle
                        className={`w-5 h-5 ${
                          daysUntilDue <= 7
                            ? "text-red-600"
                            : daysUntilDue <= 14
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`}
                      />
                      <span
                        className={
                          daysUntilDue <= 7
                            ? "text-red-800"
                            : daysUntilDue <= 14
                            ? "text-orange-800"
                            : "text-blue-800"
                        }>
                        Jatuh tempo dalam {daysUntilDue} hari
                      </span>
                    </div>
                  </div>
                )}

                {(currentFee.status.toLowerCase() === "belum bayar" ||
                  currentFee.status.toLowerCase() === "pending") && (
                  <Button
                    onClick={() => navigate(`/iuran/${currentFee.id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 shadow-lg text-white font-semibold py-3 text-lg"
                    size="lg">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Bayar Sekarang
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">Tidak ada iuran tertunggak</p>
                <p className="text-sm text-gray-400">Semua iuran sudah lunas</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment History - Enhanced */}
        {/* <Card className="shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Riwayat Pembayaran
              </CardTitle>
              {payments.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/payments")}
                  className="text-green-600 hover:text-green-700">
                  <Eye className="w-4 h-4 mr-1" />
                  Lihat Semua
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {latestPayments.length > 0 ? (
              <div className="space-y-4">
                {latestPayments.map((payment, index) => (
                  <div
                    key={payment.id || index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigate(`/payments/${payment.id}`)}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${getStatusColor(
                          payment.status
                        )
                          .replace("text-", "bg-")
                          .replace("bg-", "bg-opacity-20 bg-")}`}>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getMonthName(
                            String(new Date(payment.created_at).getMonth() + 1)
                          )}{" "}
                          2024
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString(
                            "id-ID",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </p>
                      <Badge
                        className={`${getStatusColor(payment.status)} text-xs`}
                        variant="outline">
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}

                {payments.length > 3 && (
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => navigate("/payments")}>
                    Lihat Riwayat Lengkap
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">
                  Belum ada riwayat pembayaran
                </p>
                <p className="text-sm text-gray-400">
                  Riwayat pembayaran akan muncul setelah Anda melakukan
                  pembayaran pertama
                </p>
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-full shadow-md">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium">Lunas</p>
                  <p className="font-bold text-2xl text-green-800">
                    {
                      fees.filter((f) => f.status.toLowerCase() === "lunas")
                        .length
                    }
                  </p>
                  <p className="text-xs text-green-600">
                    {fees.filter((f) => f.status.toLowerCase() === "lunas")
                      .length === 0
                      ? "Belum ada data"
                      : "Pembayaran selesai"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500 rounded-full shadow-md">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-red-700 font-medium">Tertunggak</p>
                  <p className="font-bold text-2xl text-red-800">
                    {
                      fees.filter(
                        (f) => f.status.toLowerCase() === "belum bayar"
                      ).length
                    }
                  </p>
                  <p className="text-xs text-red-600">
                    {fees.filter(
                      (f) => f.status.toLowerCase() === "belum bayar"
                    ).length === 0
                      ? "Semua lunas"
                      : "Perlu dibayar"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
