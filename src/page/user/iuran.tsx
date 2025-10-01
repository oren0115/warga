import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { Fee } from "../../types";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building2,
  User,
  Bell,
} from "lucide-react";

// shadcn/ui
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import NotificationPopup from "../../components/NotificationPopup";
import NotificationBadge from "../../components/NotificationBadge";

const IuranList: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [error] = useState<string | null>(null);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const feesData = await userService.getFees();
      setFees(feesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationRead = () => {
    setNotificationRefreshKey((prev) => prev + 1);
    // This will trigger NotificationBadge to refresh its data
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "lunas":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "belum bayar":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
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

    let month: number;
    if (monthNum.includes("-")) {
      // Format: "2025-09" -> extract month part
      month = parseInt(monthNum.split("-")[1]);
    } else {
      // Format: "9" -> direct parse
      month = parseInt(monthNum);
    }

    return months[month - 1] || monthNum;
  };

  // Samakan perhitungan jatuh tempo dengan halaman Home:
  // Last day of the month berdasarkan nilai fee.bulan ("1".."12" atau "YYYY-MM") di tahun berjalan
  const getDaysUntilDueDate = (month: string) => {
    const currentDate = new Date();
    let dueDate: Date;

    if (month.includes("-")) {
      // Format: "2025-09" -> extract year and month
      const [year, monthNum] = month.split("-");
      dueDate = new Date(parseInt(year), parseInt(monthNum), 0); // Last day of the month
    } else {
      // Format: "9" -> use current year
      const currentYear = currentDate.getFullYear();
      dueDate = new Date(currentYear, parseInt(month), 0); // Last day of the month
    }

    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          {/* Branding desktop */}
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">IPL Cluster Cannary</h1>
              <p className="text-green-100 text-sm">
                Sistem Pembayaran Digital
              </p>
            </div>
          </div>

          {/* Branding mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">IPL Cluster Cannary</span>
            </div>
            <div className="relative">
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

          {/* Greeting */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Daftar Iuran
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola pembayaran iuran RT/RW Anda
                  </p>
                </div>
              </div>
              {/* Notifikasi Desktop */}
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

      {/* Notifikasi Popup */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={handleNotificationRead}
      />

      {/* Daftar Iuran */}
      <div className="p-4 space-y-6 -mt-2">
        {fees.length > 0 ? (
          <div className="space-y-6">
            {fees.map((fee) => (
              <Card
                key={fee.id}
                className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        Tipe Rumah {fee.kategori}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {getMonthName(fee.bulan)}{" "}
                          {new Date(fee.created_at).getFullYear()}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        fee.status
                      )} flex items-center gap-1 px-3 py-1 font-semibold`}
                      variant="outline">
                      {getStatusIcon(fee.status)}
                      {fee.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold text-gray-900">
                    Rp {fee.nominal.toLocaleString()}
                  </div>

                  {/* Detail Iuran */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tahun:</span>
                      <span className="font-medium">
                        {(() => {
                          if (fee.bulan.includes("-")) {
                            return fee.bulan.split("-")[0];
                          }
                          return new Date(fee.created_at).getFullYear();
                        })()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Jatuh Tempo:</span>
                      <span className="font-medium">
                        {(() => {
                          if (fee.bulan.includes("-")) {
                            const [year, month] = fee.bulan.split("-");
                            const dueDate = new Date(
                              parseInt(year),
                              parseInt(month),
                              0
                            );
                            return dueDate.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });
                          } else {
                            const currentYear = new Date().getFullYear();
                            const dueDate = new Date(
                              currentYear,
                              parseInt(fee.bulan),
                              0
                            );
                            return dueDate.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            });
                          }
                        })()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sisa Waktu:</span>
                      {(() => {
                        const days = getDaysUntilDueDate(fee.bulan);
                        if (days > 0) {
                          return (
                            <span
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                days <= 3
                                  ? "bg-red-100 text-red-700"
                                  : days <= 7
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-green-100 text-green-700"
                              }`}>
                              {days} hari lagi
                            </span>
                          );
                        } else if (days === 0) {
                          return (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                              Hari ini
                            </span>
                          );
                        } else {
                          return (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                              Terlambat {Math.abs(days)} hari
                            </span>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    className={`w-full ${
                      fee.status.toLowerCase() === "belum bayar" ||
                      fee.status.toLowerCase() === "pending"
                        ? "bg-green-600 hover:bg-green-700 text-white font-semibold"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    variant={
                      fee.status.toLowerCase() === "belum bayar" ||
                      fee.status.toLowerCase() === "pending"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => navigate(`/iuran/${fee.id}`)}>
                    {fee.status.toLowerCase() === "belum bayar" ||
                    fee.status.toLowerCase() === "pending"
                      ? "Bayar Sekarang"
                      : "Lihat Detail"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-medium mb-2">Belum Ada Iuran</p>
            <p className="text-muted-foreground">
              Iuran akan muncul setelah admin membuatnya
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IuranList;
