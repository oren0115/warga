import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import {
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { PageHeader, PageLayout } from "./index";

interface PaymentStatusPageProps {
  status: "success" | "pending" | "failed";
  paymentId?: string;
  amount?: number;
  paymentMethod?: string;
  onRetry?: () => void;
  onBack?: () => void;
  onCheckStatus?: () => void;
  isCheckingStatus?: boolean;
  className?: string;
}

const PaymentStatusPage: React.FC<PaymentStatusPageProps> = ({
  status,
  paymentId,
  amount,
  paymentMethod,
  onRetry,
  onBack,
  onCheckStatus,
  isCheckingStatus = false,
  className = "",
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case "success":
        return {
          icon: (
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          ),
          title: "Pembayaran Berhasil!",
          description:
            "Pembayaran Anda telah berhasil diproses dan diverifikasi.",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
          textColor: "text-green-800",
          buttonColor: "bg-green-600 hover:bg-green-700",
        };
      case "pending":
        return {
          icon: <Clock className="w-20 h-20 text-yellow-500 mx-auto mb-6" />,
          title: "Pembayaran Sedang Diproses",
          description:
            "Pembayaran Anda sedang dalam proses verifikasi. Silakan tunggu beberapa saat.",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          textColor: "text-yellow-800",
          buttonColor: "bg-yellow-600 hover:bg-yellow-700",
        };
      case "failed":
        return {
          icon: <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />,
          title: "Pembayaran Gagal",
          description:
            "Maaf, pembayaran Anda gagal diproses. Silakan coba lagi atau gunakan metode pembayaran lain.",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          textColor: "text-red-800",
          buttonColor: "bg-red-600 hover:bg-red-700",
        };
    }
  };

  const config = getStatusConfig();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <PageLayout className={className}>
      <PageHeader
        title="Status Pembayaran"
        subtitle="Informasi status pembayaran Anda"
        icon={<RefreshCw className="w-6 h-6 text-white" />}
      />

      <div className="flex items-center justify-center min-h-[60vh] w-full p-4">
        <Card className="w-full max-w-lg md:max-w-2xl lg:max-w-full shadow-xl border-0">
          <CardContent className="p-8 md:p-12 text-center">
            {config.icon}

            <h2 className={`text-2xl font-bold mb-4 ${config.textColor}`}>
              {config.title}
            </h2>

            <p className="text-gray-600 mb-6">{config.description}</p>

            {/* Payment Details */}
            {(paymentId || amount || paymentMethod) && (
              <div
                className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}>
                <h3 className="font-semibold mb-3 text-gray-800">
                  Detail Pembayaran
                </h3>
                <div className="space-y-2 text-sm">
                  {paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID Transaksi:</span>
                      <span className="font-mono text-blue-600">
                        {paymentId}
                      </span>
                    </div>
                  )}
                  {amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nominal:</span>
                      <span className="font-semibold">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                  )}
                  {paymentMethod && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Metode:</span>
                      <span className="font-medium">{paymentMethod}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {status === "pending" && onCheckStatus && (
                <Button
                  onClick={onCheckStatus}
                  disabled={isCheckingStatus}
                  className={`w-full ${config.buttonColor} text-white cursor-pointer`}>
                  {isCheckingStatus ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Memeriksa Status...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Periksa Status
                    </>
                  )}
                </Button>
              )}

              {status === "failed" && onRetry && (
                <Button
                  onClick={onRetry}
                  className={`w-full ${config.buttonColor} text-white cursor-pointer`}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Coba Lagi
                </Button>
              )}

              {onBack && (
                <Button onClick={onBack}  className="w-full hover:bg-green-900 cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Kembali ke Daftar Iuran
                </Button>
              )}
            </div>

            {/* Additional Info for Pending */}
            {status === "pending" && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tips:</strong> Proses verifikasi biasanya memakan
                  waktu 1-5 menit. Anda dapat menutup halaman ini dan kembali
                  lagi nanti untuk memeriksa status.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default PaymentStatusPage;
