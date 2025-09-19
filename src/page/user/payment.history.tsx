import React, { useEffect, useState, type JSX } from "react";
import { userService } from "../../services/user.service";
import type { Payment } from "../../types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Mappings untuk status dan metode pembayaran
const STATUS_MAP: Record<
  string,
  {
    text: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: JSX.Element;
  }
> = {
  success: {
    text: "Berhasil",
    variant: "default",
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
  },
  settlement: {
    text: "Berhasil",
    variant: "default",
    icon: <CheckCircle className="text-green-600 w-5 h-5" />,
  },
  pending: {
    text: "Menunggu",
    variant: "secondary",
    icon: <Clock className="text-amber-500 w-5 h-5" />,
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

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
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
    <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-4 border-l-green-500 bg-white w-full sm:w-auto">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 bg-green-50 px-4 sm:px-6">
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

      <CardContent className="space-y-3 pt-4 px-4 sm:px-6">
        <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
          <span className="text-gray-600 font-medium">Nominal Pembayaran:</span>
          <span className="font-bold text-lg text-green-700">
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

        {payment.payment_url && payment.status.toLowerCase() === "pending" && (
          <div className="pt-4">
            <Button
              asChild
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 shadow-sm">
              <a
                href={payment.payment_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2">
                <Link2 className="w-5 h-5" />
                <span>Lanjutkan Pembayaran</span>
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const Row: React.FC<{
  label: string;
  value: string;
  isCode?: boolean;
  color?: string;
}> = ({ label, value, isCode = false, color = "text-gray-800" }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-gray-100">
    <span className="text-gray-600 font-medium">{label}:</span>
    <span
      className={`${color} font-medium mt-1 sm:mt-0 ${
        isCode
          ? "font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs"
          : ""
      }`}>
      {value}
    </span>
  </div>
);

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const data = await userService.getPayments();
        setPayments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const filterPayments = (status: string) => {
    switch (status) {
      case "all":
        return payments;
      case "success":
        return payments.filter((p) =>
          ["settlement", "success"].includes(p.status.toLowerCase())
        );
      case "pending":
        return payments.filter((p) => p.status.toLowerCase() === "pending");
      case "failed":
        return payments.filter((p) =>
          ["deny", "cancel", "expire"].includes(p.status.toLowerCase())
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
      label: "Berhasil",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    { value: "failed", label: "Gagal", icon: <XCircle className="w-4 h-4" /> },
  ];

  const tabCounts = tabData.reduce((acc, tab) => {
    acc[tab.value] = filterPayments(tab.value).length;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b shadow-sm p-6">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6 space-y-4 shadow-sm w-full">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
        <div className="px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 mb-2">
            <CreditCard className="w-8 h-8" />
            <h1 className="text-2xl font-bold">Riwayat Pembayaran</h1>
          </div>
          <p className="text-green-100 text-base max-w-full sm:max-w-lg">
            Pantau semua transaksi pembayaran iuran warga dengan transparan
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-green-200" />
              <span>Total Transaksi: {payments.length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-200" />
              <span>
                Total Berhasil: Rp{" "}
                {payments
                  .filter((p) =>
                    ["settlement", "success"].includes(p.status.toLowerCase())
                  )
                  .reduce((sum, p) => sum + p.amount, 0)
                  .toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="p-6">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 bg-white shadow-sm p-1 rounded-lg overflow-x-auto sm:overflow-x-visible whitespace-nowrap">
            {tabData.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white px-3 py-1 rounded flex items-center space-x-1 text-xs sm:text-sm min-w-[70px] sm:min-w-0">
                {tab.icon}
                <span>{tab.label}</span>
                <Badge className="ml-1 bg-gray-100 text-gray-700 text-xs">
                  {tabCounts[tab.value]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabData.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="space-y-6">
              {filterPayments(tab.value).length > 0 ? (
                <div className="space-y-4">
                  {filterPayments(tab.value).map((p) => (
                    <PaymentCard key={p.id} payment={p} />
                  ))}
                </div>
              ) : (
                <EmptyState tab={tab.value} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const EmptyState: React.FC<{ tab: string }> = ({ tab }) => {
  const iconMap: Record<string, JSX.Element> = {
    all: <Clipboard className="w-8 h-8 text-gray-700" />,
    pending: <Clock className="w-8 h-8 text-amber-500" />,
    success: <CheckCircle className="w-8 h-8 text-green-600" />,
    failed: <XCircle className="w-8 h-8 text-red-600" />,
  };

  const messageMap: Record<string, string> = {
    all: "Belum ada riwayat transaksi pembayaran iuran",
    pending: "Tidak ada pembayaran yang sedang menunggu konfirmasi",
    success: "Belum ada transaksi yang berhasil di sistem",
    failed: "Tidak ada transaksi yang gagal atau dibatalkan",
  };

  return (
    <div className="text-center py-16 sm:py-20 px-4">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
        {iconMap[tab]}
      </div>
      <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800">
        Tidak Ada Transaksi
      </h3>
      <p className="text-gray-500 max-w-full sm:max-w-md mx-auto leading-relaxed">
        {messageMap[tab]}
      </p>
    </div>
  );
};

export default PaymentHistory;
