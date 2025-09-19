import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { userService } from "../../services/user.service";
import type { Fee, Payment, Notification } from "../../types";
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
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Bell,
  Eye,
  ArrowRight,
} from "lucide-react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [fees, setFees] = useState<Fee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [feesData, paymentsData, notificationsData] = await Promise.all([
        userService.getFees(),
        userService.getPayments(),
        userService.getNotifications(),
      ]);
      setFees(feesData);
      setPayments(paymentsData);
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

  const latestPayments = payments
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const daysUntilDue = currentFee ? getDaysUntilDueDate(currentFee.bulan) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden mb-5">
        {/* <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div> */}
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full "></div>

        <div className="relative p-6 ">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Halo, {authState.user?.nama}! 👋
              </h1>
              <p className="text-green-100 text-sm">
                Kelola iuran RT/RW Anda dengan mudah
              </p>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate("/notifications")}>
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-4">
        {/* Current Fee - Enhanced */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-green-600" />
                Iuran Bulan Ini
              </CardTitle>
              {currentFee && daysUntilDue > 0 && daysUntilDue <= 7 && (
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200">
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
                    <span>{getMonthName(currentFee.bulan)} 2024</span>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      currentFee.status
                    )} flex items-center gap-1`}>
                    {getStatusIcon(currentFee.status)}
                    {currentFee.status}
                  </Badge>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-4">
                  {formatCurrency(currentFee.nominal)}
                </div>

                {daysUntilDue > 0 && daysUntilDue <= 30 && (
                  <div
                    className={`p-3 rounded-lg ${
                      daysUntilDue <= 7
                        ? "bg-orange-50 border border-orange-200"
                        : "bg-blue-50 border border-blue-200"
                    }`}>
                    <div className="flex items-center gap-2 text-sm">
                      <AlertCircle
                        className={`w-4 h-4 ${
                          daysUntilDue <= 7
                            ? "text-orange-600"
                            : "text-blue-600"
                        }`}
                      />
                      <span
                        className={
                          daysUntilDue <= 7
                            ? "text-orange-800"
                            : "text-blue-800"
                        }>
                        Jatuh tempo dalam {daysUntilDue} hari
                      </span>
                    </div>
                  </div>
                )}

                {currentFee.status.toLowerCase() === "belum bayar" && (
                  <Button
                    onClick={() => navigate(`/iuran/${currentFee.id}`)}
                    className="w-full bg-green-600 hover:bg-green-700 shadow-md"
                    size="lg">
                    <CreditCard className="w-4 h-4 mr-2" />
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
        <Card className="shadow-lg border-0">
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
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-md border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lunas</p>
                  <p className="font-bold text-lg">
                    {
                      fees.filter((f) => f.status.toLowerCase() === "lunas")
                        .length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tertunggak</p>
                  <p className="font-bold text-lg">
                    {
                      fees.filter(
                        (f) => f.status.toLowerCase() === "belum bayar"
                      ).length
                    }
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
