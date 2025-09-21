import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { Fee, Notification } from "../../types";
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

const IuranList: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<Fee[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [feesData, notificationsData] = await Promise.all([
        userService.getFees(),
        userService.getNotifications(),
      ]);
      setFees(feesData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
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
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    return months[parseInt(monthNum) - 1] || monthNum;
  };

  const getDaysUntilDue = (dueDate: string) => {
    const currentDate = new Date();
    const due = new Date(dueDate);
    const timeDiff = due.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const getDueDateColor = (dueDate: string) => {
    const daysUntilDue = getDaysUntilDue(dueDate);
    if (daysUntilDue <= 0) {
      return "text-red-600 font-semibold"; // Overdue
    } else if (daysUntilDue <= 7) {
      return "text-orange-600 font-medium"; // Urgent
    } else if (daysUntilDue <= 30) {
      return "text-yellow-600"; // Warning
    } else {
      return "text-gray-500"; // Normal
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header with Branding - Responsive */}
      <div className=" sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden mb-6">
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
              <p className="text-green-100 text-sm">Sistem Pembayaran Digital</p>
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
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => navigate("/notifications")}>
                <Bell className="w-5 h-5" />
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
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
                    Daftar Iuran
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola pembayaran iuran RT/RW Anda
                  </p>
                </div>
              </div>
              {/* Desktop notification button - hidden on mobile */}
              <div className="hidden md:block relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => navigate("/notifications")}>
                  <Bell className="w-5 h-5" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {fees.length > 0 ? (
          <div className="space-y-6">
            {fees.map((fee) => (
              <Card key={fee.id} className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                        {fee.kategori}
                      </CardTitle>                     
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{getMonthName(fee.bulan)} {new Date(fee.created_at).getFullYear()}</span>
                      </div>
                      
                      
                    </div>
                    <Badge 
                      className={`${getStatusColor(fee.status)} flex items-center gap-1 px-3 py-1 font-semibold`}
                      variant="outline">
                      {getStatusIcon(fee.status)}
                      {fee.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-2xl font-bold text-gray-900">
                    Rp {fee.nominal.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Jatuh tempo:</span>
                    <span className={`text-sm ${getDueDateColor(fee.due_date)}`}>
                      {formatDate(fee.due_date)}
                    </span>
                    {getDaysUntilDue(fee.due_date) <= 7 && getDaysUntilDue(fee.due_date) > 0 && (
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                        {getDaysUntilDue(fee.due_date)} hari lagi
                      </span>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button
                    className={`w-full ${
                      fee.status.toLowerCase() === "belum bayar" || fee.status.toLowerCase() === "pending"
                        ? "bg-green-600 hover:bg-green-700 text-white font-semibold"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    variant={fee.status.toLowerCase() === "belum bayar" || fee.status.toLowerCase() === "pending" ? "default" : "outline"}
                    onClick={() => navigate(`/iuran/${fee.id}`)}>
                    {fee.status.toLowerCase() === "belum bayar" || fee.status.toLowerCase() === "pending"
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
