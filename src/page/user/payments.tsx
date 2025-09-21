import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../../services/user.service";
import type { Fee, Payment, PaymentCreateRequest, Notification } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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
  DollarSign,
  Receipt,
  Loader2,
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Building2,
  Bell,
} from "lucide-react";

// Status mappings with improved colors and styling
const STATUS_MAP: Record<
  string,
  {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactElement;
    bgColor: string;
    textColor: string;
  }
> = {
  success: {
    text: "Berhasil",
    variant: "default",
    icon: <CheckCircle className="w-4 h-4" />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  settlement: {
    text: "Berhasil",
    variant: "default",
    icon: <CheckCircle className="w-4 h-4" />,
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
  },
  pending: {
    text: "Menunggu",
    variant: "secondary",
    icon: <Clock className="w-4 h-4" />,
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  deny: {
    text: "Ditolak",
    variant: "destructive",
    icon: <XCircle className="w-4 h-4" />,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  cancel: {
    text: "Dibatalkan",
    variant: "destructive",
    icon: <XCircle className="w-4 h-4" />,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
  expire: {
    text: "Kadaluarsa",
    variant: "destructive",
    icon: <AlertCircle className="w-4 h-4" />,
    bgColor: "bg-red-50",
    textColor: "text-red-700",
  },
};

const PAYMENT_METHOD_MAP: Record<
  string,
  {
    text: string;
    icon: React.ReactElement;
    color: string;
  }
> = {
  credit_card: {
    text: "Kartu Kredit",
    icon: <CreditCard className="w-5 h-5" />,
    color: "text-blue-600",
  },
  bank_transfer: {
    text: "Transfer Bank",
    icon: <Landmark className="w-5 h-5" />,
    color: "text-green-600",
  },
  gopay: {
    text: "GoPay",
    icon: <Smartphone className="w-5 h-5" />,
    color: "text-emerald-600",
  },
  shopeepay: {
    text: "ShopeePay",
    icon: <ShoppingCart className="w-5 h-5" />,
    color: "text-orange-600",
  },
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
  const status = STATUS_MAP[payment.status.toLowerCase()] || {
    text: payment.status,
    variant: "outline" as const,
    icon: <Clipboard className="w-4 h-4" />,
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
  };

  const method = PAYMENT_METHOD_MAP[payment.payment_method.toLowerCase()] || {
    text: payment.payment_method,
    icon: <DollarSign className="w-5 h-5" />,
    color: "text-gray-600",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 bg-white overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${status.bgColor} ${method.color}`}>
              {method.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">
                {method.text}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Calendar className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formatDate(payment.created_at)}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${status.bgColor}`}>
            <span className={status.textColor}>{status.icon}</span>
            <Badge
              variant={status.variant}
              className={`${status.textColor} ${status.bgColor} border-0 text-xs font-medium`}>
              {status.text}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Amount Display */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">Total Pembayaran</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">
                {formatCurrency(payment.amount)}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="space-y-3">
          {payment.transaction_id && (
            <DetailRow
              label="ID Transaksi"
              value={payment.transaction_id}
              isCode
              icon={<Receipt className="w-4 h-4 text-gray-400" />}
            />
          )}
          {payment.payment_type && (
            <DetailRow
              label="Tipe Pembayaran"
              value={payment.payment_type}
              icon={<CreditCard className="w-4 h-4 text-gray-400" />}
            />
          )}
          {payment.bank && (
            <DetailRow
              label="Bank"
              value={payment.bank}
              icon={<Landmark className="w-4 h-4 text-gray-400" />}
            />
          )}
          {payment.va_number && (
            <DetailRow
              label="Nomor VA"
              value={payment.va_number}
              isCode
              icon={<Clipboard className="w-4 h-4 text-gray-400" />}
            />
          )}
          {payment.expiry_time && (
            <DetailRow
              label="Batas Waktu"
              value={formatDate(payment.expiry_time)}
              color="text-amber-600"
              icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
            />
          )}
          {payment.settled_at && (
            <DetailRow
              label="Diselesaikan"
              value={formatDate(payment.settled_at)}
              color="text-green-600"
              icon={<CheckCircle className="w-4 h-4 text-green-500" />}
            />
          )}
        </div>

        {/* Payment URL Button */}
        {payment.payment_url && payment.status.toLowerCase() === "pending" && (
          <div className="pt-2">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg group">
              <a
                href={payment.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2">
                <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Lanjutkan Pembayaran</span>
                <ArrowUpRight className="w-4 h-4 opacity-70" />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  isCode?: boolean;
  color?: string;
  icon?: React.ReactElement;
}> = ({ label, value, isCode = false, color = "text-gray-800", icon }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-gray-600 font-medium text-sm">{label}</span>
    </div>
    <span
      className={`${color} font-medium text-sm ${
        isCode
          ? "font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md text-xs border border-blue-200"
          : ""
      }`}>
      {value}
    </span>
  </div>
);

const FeeCard: React.FC<{
  fee: Fee;
  onPay: (fee: Fee) => void;
  isProcessing: boolean;
}> = ({ fee, onPay, isProcessing }) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case "lunas":
        return {
          variant: "default" as const,
          text: "Lunas",
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          icon: <CheckCircle className="w-4 h-4" />,
        };
      case "pending":
        return {
          variant: "secondary" as const,
          text: "Menunggu",
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          icon: <Clock className="w-4 h-4" />,
        };
      case "belum bayar":
        return {
          variant: "destructive" as const,
          text: "Belum Bayar",
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          icon: <AlertCircle className="w-4 h-4" />,
        };
      default:
        return {
          variant: "outline" as const,
          text: status,
          bgColor: "bg-gray-50",
          textColor: "text-gray-700",
          icon: <Clipboard className="w-4 h-4" />,
        };
    }
  };

  const statusConfig = getStatusConfig(fee.status);

  const handlePayment = () => {
    if (!selectedPaymentMethod && fee.status.toLowerCase() === "belum bayar") {
      alert("Pilih metode pembayaran terlebih dahulu");
      return;
    }
    onPay({ ...fee, payment_method: selectedPaymentMethod });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                Iuran {fee.bulan}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(fee.created_at)}</span>
              </div>
            </div>
          </div>
          <div
            className={`flex items-center space-x-2 px-3 py-2 rounded-full ${statusConfig.bgColor}`}>
            <span className={statusConfig.textColor}>{statusConfig.icon}</span>
            <Badge
              variant={statusConfig.variant}
              className={`${statusConfig.textColor} ${statusConfig.bgColor} border-0`}>
              {statusConfig.text}
            </Badge>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">
              Nominal Pembayaran
            </span>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(fee.nominal)}
              </div>
            </div>
          </div>
        </div>

        {fee.status.toLowerCase() === "belum bayar" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Pilih Metode Pembayaran
              </label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}>
                <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-green-300 transition-colors">
                  <SelectValue placeholder="Pilih metode pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PAYMENT_METHOD_MAP).map(([key, method]) => (
                    <SelectItem
                      key={key}
                      value={key}
                      className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <span className={method.color}>{method.icon}</span>
                        <span>{method.text}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handlePayment}
              disabled={isProcessing || !selectedPaymentMethod}
              className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Bayar Sekarang
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const EmptyState: React.FC<{
  icon: React.ReactElement;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center py-20">
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-200">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
    <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
      {description}
    </p>
  </div>
);

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-xl" />
          </div>
        </Card>
      ))}
    </div>
    {[1, 2, 3].map((i) => (
      <Card key={i} className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </Card>
    ))}
  </div>
);

const Payments: React.FC = () => {
  const navigate = useNavigate();
  const [fees, setFees] = useState<Fee[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
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
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (fee: Fee) => {
    if (!fee.payment_method) {
      alert("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    console.log("Starting payment process for fee:", fee);
    setIsProcessingPayment(true);
    try {
      const paymentData: PaymentCreateRequest = {
        fee_id: fee.id,
        amount: fee.nominal,
        payment_method: fee.payment_method,
      };
      console.log("Payment data:", paymentData);

      const paymentResponse = await userService.createPayment(paymentData);
      console.log("Payment response:", paymentResponse);

      if (paymentResponse.payment_url) {
        console.log("Opening payment URL:", paymentResponse.payment_url);
        window.open(paymentResponse.payment_url, "_blank");
        setTimeout(() => fetchData(), 1000);
      } else {
        console.error("No payment URL in response");
        alert("URL pembayaran tidak ditemukan dalam respons server");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as {
          response?: { data?: { detail?: string } };
          message?: string;
        };
        console.error("Error details:", err.response?.data || err.message);
        alert(
          `Gagal membuat pembayaran: ${
            err.response?.data?.detail || err.message
          }`
        );
      } else {
        console.error("Unknown error:", error);
        alert(`Gagal membuat pembayaran: ${String(error)}`);
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const unpaidFees = fees.filter(
    (fee) => fee.status.toLowerCase() === "belum bayar"
  );
  const paidFees = fees.filter((fee) => fee.status.toLowerCase() === "lunas");
  const successfulPayments = payments.filter((p) =>
    ["settlement", "success"].includes(p.status.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-700 text-white shadow-xl">
          <div className="px-6 py-12">
            <Skeleton className="h-8 w-48 mb-4 bg-white/20" />
            <Skeleton className="h-4 w-96 bg-white/10" />
          </div>
        </div>
        <div className="p-6">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header with Branding - Responsive */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden mb-6">
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
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Pembayaran
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola pembayaran iuran dan pantau riwayat transaksi
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

      {/* Main Content */}
      <div className="p-6">
        <Tabs defaultValue="unpaid" className="w-full">
          <TabsList className="mb-8 bg-white shadow-lg p-1.5 rounded-xl border border-gray-200">
            <TabsTrigger
              value="unpaid"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-red-600 data-[state=active]:text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all">
              <AlertCircle className="w-4 h-4" />
              <span> ({unpaidFees.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="paid"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all">
              <CheckCircle className="w-4 h-4" />
              <span>({paidFees.length})</span>
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all">
              <Clock className="w-4 h-4" />
              <span>({payments.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* Unpaid Fees Tab */}
          <TabsContent value="unpaid" className="space-y-6">
            {unpaidFees.length > 0 ? (
              <div className="grid gap-6">
                {unpaidFees.map((fee) => (
                  <FeeCard
                    key={fee.id}
                    fee={fee}
                    onPay={handlePayment}
                    isProcessing={isProcessingPayment}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<CheckCircle className="w-12 h-12 text-green-600" />}
                title="Semua Iuran Sudah Dibayar"
                description="Selamat! Tidak ada iuran yang belum dibayar. Semua kewajiban pembayaran telah diselesaikan."
              />
            )}
          </TabsContent>

          {/* Paid Fees Tab */}
          <TabsContent value="paid" className="space-y-6">
            {paidFees.length > 0 ? (
              <div className="grid gap-6">
                {paidFees.map((fee) => (
                  <FeeCard
                    key={fee.id}
                    fee={fee}
                    onPay={() => {}}
                    isProcessing={false}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Receipt className="w-12 h-12 text-gray-400" />}
                title="Belum Ada Iuran yang Dibayar"
                description="Iuran yang sudah dibayar akan muncul di sini. Mulai bayar iuran untuk melihat riwayat pembayaran."
              />
            )}
          </TabsContent>

          {/* Payment History Tab */}
          <TabsContent value="history" className="space-y-6">
            {payments.length > 0 ? (
              <div className="grid gap-6">
                {payments.map((payment) => (
                  <PaymentCard key={payment.id} payment={payment} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={<Clock className="w-12 h-12 text-gray-400" />}
                title="Belum Ada Riwayat Pembayaran"
                description="Riwayat semua transaksi pembayaran akan ditampilkan di sini setelah Anda melakukan pembayaran pertama."
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Payments;
