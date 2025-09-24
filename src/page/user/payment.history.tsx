import React, { useEffect, useState, type JSX } from "react";
import { userService } from "../../services/user.service";
import type { Payment } from "../../types";
// Remove the conflicting import
// import { formatDate } from "../../utils/format.date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  CreditCard,
  Landmark,
  Smartphone,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Clipboard,
  Link2,
  BarChart2,
  DollarSign,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationPopup from "../../components/NotificationPopup";
import NotificationBadge from "../../components/NotificationBadge";

// Mapping status pembayaran
const STATUS_MAP: Record<
  string,
  {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: JSX.Element;
  }
> = {
  success: {
    text: "Lunas",
    variant: "default",
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
  },
  settlement: {
    text: "Lunas",
    variant: "default",
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
  },
  pending: {
    text: "Menunggu",
    variant: "secondary",
    icon: <Clock className="text-amber-500 w-5 h-5" />,
  },
  failed: {
    text: "Gagal",
    variant: "destructive",
    icon: <XCircle className="text-red-600 w-5 h-5" />,
  },
  deny: {
    text: "Ditolak",
    variant: "destructive",
    icon: <XCircle className="text-red-600 w-5 h-5" />,
  },
  cancel: {
    text: "Dibatalkan",
    variant: "destructive",
    icon: <XCircle className="text-red-600 w-5 h-5" />,
  },
  expire: {
    text: "Kadaluarsa",
    variant: "destructive",
    icon: <AlertCircle className="text-red-600 w-5 h-5" />,
  },
};

// Mapping metode pembayaran
const PAYMENT_METHOD_MAP: Record<string, { text: string; icon: JSX.Element }> =
  {
    credit_card: {
      text: "Kartu Kredit",
      icon: <CreditCard className="w-6 h-6 text-gray-700" />,
    },
    bank_transfer: {
      text: "Transfer Bank",
      icon: <Landmark className="w-6 h-6 text-gray-700" />,
    },
    gopay: {
      text: "GoPay",
      icon: <Smartphone className="w-6 h-6 text-gray-700" />,
    },
    shopeepay: {
      text: "ShopeePay",
      icon: <ShoppingCart className="w-6 h-6 text-gray-700" />,
    },
  };

// Keep your local formatDate function
const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

// ===================== PaymentCard =====================
const PaymentCard: React.FC<{
  payment: Payment;
  onRefresh: () => Promise<void>;
}> = ({ payment, onRefresh }) => {
  const [isForceChecking, setIsForceChecking] = useState(false);

  const status = STATUS_MAP[payment.status.toLowerCase()] || {
    text: payment.status,
    variant: "outline",
    icon: <Clipboard className="w-5 h-5" />,
  };

  const method = PAYMENT_METHOD_MAP[payment.payment_method.toLowerCase()] || {
    text: payment.payment_method,
    icon: <DollarSign className="w-6 h-6 text-gray-700" />,
  };

  return (
    <Card className="shadow-xl hover:shadow-2xl transition-all duration-200 border-0 bg-gradient-to-br from-white to-gray-50 w-full sm:w-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 bg-gradient-to-r from-green-50 to-emerald-50 px-4 sm:px-6 rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div>{method.icon}</div>
          <div>
            <CardTitle className="text-lg text-gray-800 font-semibold">
              {method.text}
            </CardTitle>
            <p className="text-sm text-gray-500 font-medium">
              {formatDate(payment.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          {status.icon}
          <Badge
            variant={status.variant}
            className="px-3 py-1 text-xs font-medium">
            {status.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4 px-4 sm:px-6">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 shadow-sm">
          <span className="text-gray-700 font-semibold">
            Nominal Pembayaran:
          </span>
          <span className="font-bold text-xl text-green-700">
            Rp {payment.amount.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          {payment.transaction_id && (
            <Row label="ID Transaksi" value={payment.transaction_id} isCode />
          )}
          {payment.payment_type && (
            <Row label="Tipe Pembayaran" value={payment.payment_type} />
          )}
          {payment.bank && <Row label="Bank" value={payment.bank} />}
          {payment.va_number && (
            <Row label="Nomor VA" value={payment.va_number} isCode />
          )}
          {payment.expiry_time && (
            <Row
              label="Batas Waktu"
              value={formatDate(payment.expiry_time)}
              color="text-amber-600"
            />
          )}
          {payment.settled_at && (
            <Row
              label="Diselesaikan"
              value={formatDate(payment.settled_at)}
              color="text-green-600"
            />
          )}
        </div>

        {payment.status.toLowerCase() === "pending" && (
          <div className="pt-4 flex flex-col sm:flex-row gap-2">
            {payment.payment_url && (
              <Button
                asChild
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
                <a
                  href={payment.payment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2">
                  <Link2 className="w-5 h-5" />
                  <span>Lanjutkan Pembayaran</span>
                </a>
              </Button>
            )}
            <Button
              disabled={isForceChecking}
              onClick={async () => {
                try {
                  setIsForceChecking(true);
                  await userService.forceCheckPaymentStatus(payment.id);
                  await onRefresh();
                } finally {
                  setIsForceChecking(false);
                }
              }}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              {isForceChecking ? "Memeriksa..." : "Perbarui Status"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// ===================== Row =====================
const Row: React.FC<{
  label: string;
  value: string;
  isCode?: boolean;
  color?: string;
}> = ({ label, value, isCode = false, color = "text-gray-800" }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-3 border-b border-gray-100 last:border-b-0">
    <span className="text-gray-600 font-semibold text-sm">{label}:</span>
    <span
      className={`${color} font-medium mt-1 sm:mt-0 ${
        isCode
          ? "font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs border border-blue-100"
          : "text-gray-800"
      }`}>
      {value}
    </span>
  </div>
);

// ===================== PaymentHistory =====================
const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState("all");

  const fetchPayments = async () => {
    try {
      const paymentsData = await userService.getPayments();
      setPayments(paymentsData);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Gagal memuat data");
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await fetchPayments();
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchPayments();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationRead = () => {
    setNotificationRefreshKey((prev) => prev + 1);
  };

  const filterPayments = (status: string) => {
    switch (status) {
      case "all":
        return payments;
      case "success":
        return payments.filter((p) =>
          ["success", "settlement"].includes(p.status.toLowerCase())
        );
      case "pending":
        return payments.filter((p) =>
          ["pending"].includes(p.status.toLowerCase())
        );
      case "failed":
        return payments.filter((p) =>
          ["failed", "deny", "cancel", "expire"].includes(
            p.status.toLowerCase()
          )
        );
      default:
        return [];
    }
  };

  const tabData = [
    { value: "all", label: "Semua", icon: <Clipboard className="w-4 h-4" /> },
    {
      value: "pending",
      label: "Menunggu",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      value: "success",
      label: "Lunas",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    { value: "failed", label: "Gagal", icon: <XCircle className="w-4 h-4" /> },
  ];

  const tabCounts = tabData.reduce((acc, tab) => {
    acc[tab.value] = filterPayments(tab.value).length;
    return acc;
  }, {} as Record<string, number>);

  // --- Loading State ---
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

  // --- Error State ---
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
              <Button onClick={fetchPayments} className="w-full">
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
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Manajemen Iuran RT/RW</h1>
              <p className="text-green-100 text-sm">
                Sistem Pembayaran Digital
              </p>
            </div>
          </div>

          {/* Branding mobile */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">RT/RW</span>
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
                  <BarChart2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Riwayat Pembayaran
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Pantau semua transaksi pembayaran iuran warga
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

      {/* Filter dan Content */}
      <div className="p-4 space-y-6 -mt-2">
        {/* Filter */}
        <div className="mb-6">
          <div className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4">
            <div className="flex flex-col gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Filter Pembayaran
                </h3>
                <p className="text-sm text-gray-600">
                  Pilih status pembayaran untuk melihat riwayat
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-gray-500">Status aktif:</span>
                  <Badge className="bg-green-100 text-green-700 text-xs font-medium">
                    {tabData.find((tab) => tab.value === selectedFilter)
                      ?.label || "Semua"}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    ({filterPayments(selectedFilter).length} item)
                  </span>
                </div>
              </div>
              <div className="w-full flex flex-col sm:flex-row gap-2">
                <Select
                  value={selectedFilter}
                  onValueChange={setSelectedFilter}>
                  <SelectTrigger className="flex-1 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500">
                    <SelectValue placeholder="Pilih status pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {tabData.map((tab) => (
                      <SelectItem key={tab.value} value={tab.value}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            {tab.icon}
                            <span>{tab.label}</span>
                          </div>
                          <Badge
                            variant="outline"
                            className="ml-2 text-xs bg-gray-100">
                            {tabCounts[tab.value]}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={fetchPayments}
                  variant="outline"
                  className="whitespace-nowrap">
                  Segarkan Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {filterPayments(selectedFilter).length > 0 ? (
            filterPayments(selectedFilter).map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onRefresh={fetchPayments}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-white/70 rounded-xl shadow-inner border border-gray-100">
              <Clipboard className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 text-center">
                Belum ada data pembayaran untuk kategori ini
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Notifikasi */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={handleNotificationRead}
      />
    </div>
  );
};

export default PaymentHistory;
