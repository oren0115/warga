import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { userService } from "../../services/user.service";
import type { Fee, PaymentCreateRequest } from "../../types";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "../../components/ui/badge";
import {
  CalendarDays,
  CreditCard,
  Wallet,
  Building2,
  User,
  AlertCircle,
} from "lucide-react";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const IuranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [fee, setFee] = useState<Fee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Default metode pembayaran (ubah sesuai kebutuhan)
  const [selectedPaymentMethod] = useState("bank_transfer");

  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [error] = useState<string | null>(null);

  const fetchFee = useCallback(async () => {
    setIsLoading(true);
    try {
      const fees = await userService.getFees();
      const currentFee = fees.find((f) => f.id === id);
      setFee(currentFee || null);
    } catch (error) {
      console.error("Error fetching fee:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchFee();
  }, [id, fetchFee]);

  const handlePayment = async () => {
    if (!fee || !selectedPaymentMethod) return;
    setIsProcessingPayment(true);
    try {
      const paymentData: PaymentCreateRequest = {
        fee_id: fee.id,
        amount: fee.nominal,
        payment_method: selectedPaymentMethod,
      };
      const paymentResponse = await userService.createPayment(paymentData);

      if (paymentResponse.payment_url) {
        setLastPaymentId(paymentResponse.payment_id);
        window.open(paymentResponse.payment_url, "_blank");
        startPaymentStatusPolling(paymentResponse.payment_id);
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Gagal membuat pembayaran. Silakan coba lagi.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const checkPaymentStatus = async (paymentId: string) => {
    if (!paymentId) return;

    setIsCheckingPayment(true);
    try {
      const statusResponse = await userService.checkPaymentStatus(paymentId);

      if (
        statusResponse.status === "Success" ||
        statusResponse.status === "Failed"
      ) {
        setLastPaymentId(null);
        await fetchFee();
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking payment status:", error);
      return false;
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const forceCheckPaymentStatus = async () => {
    if (!lastPaymentId) return;

    setIsCheckingPayment(true);
    try {
      const statusResponse = await userService.forceCheckPaymentStatus(
        lastPaymentId
      );

      if (statusResponse.updated) {
        setLastPaymentId(null);
        await fetchFee();
        alert("Status pembayaran berhasil diperbarui!");
      } else {
        alert(statusResponse.message || "Status pembayaran sudah up to date");
      }
    } catch (error) {
      console.error("Error force checking payment status:", error);
      alert("Gagal memeriksa status pembayaran. Silakan coba lagi.");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const startPaymentStatusPolling = (paymentId: string) => {
    const pollInterval = setInterval(async () => {
      const shouldStop = await checkPaymentStatus(paymentId);
      if (shouldStop) {
        clearInterval(pollInterval);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(pollInterval);
      setLastPaymentId(null);
    }, 600000);
  };

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "lunas":
        return "default";
      case "pending":
        return "outline";
      case "belum bayar":
        return "destructive";
      case "gagal":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatMonth = (bulan: number) =>
    new Date(2025, bulan - 1).toLocaleDateString("id-ID", { month: "long" });

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

  if (!fee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Iuran Tidak Ditemukan</h2>
          <Button onClick={() => navigate("/iuran")}>
            Kembali ke Daftar Iuran
          </Button>
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
              <Button onClick={fetchFee} className="w-full">
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

          <div className="md:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold">IPL Cluster Cannary</span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate("/iuran")}
              className="text-white hover:bg-white/20">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Detail Iuran - {authState.user?.nama} 👋
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Informasi lengkap iuran RT/RW
                  </p>
                </div>
              </div>
              <div className="hidden md:block">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/iuran")}
                  className="text-white hover:bg-white/20">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Kembali
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 -mt-2">
        {/* Fee Information */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-gray-600" />
              {fee.kategori}
            </CardTitle>
            <Badge variant={getStatusVariant(fee.status)}>{fee.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Bulan:</span>
              <span className="font-medium">
                {formatMonth(Number(fee.bulan))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Nominal:</span>
              <span className="font-bold text-xl text-green-700">
                Rp {fee.nominal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-gray-500" />
                Jatuh Tempo:
              </span>
              <span>{formatDate(fee.due_date)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Dibuat:</span>
              <span>{formatDate(fee.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        {fee.status === "Belum Bayar" && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle>Bayar Iuran</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full mt-2 bg-green-600 hover:bg-green-700 shadow-lg text-white font-semibold py-3 text-lg"
                size="lg">
                <CreditCard className="w-5 h-5 mr-2" />
                {isProcessingPayment ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment Status */}
        {fee.status !== "Belum Bayar" && (
          <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Status Pembayaran
                {isCheckingPayment && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Badge
                variant={getStatusVariant(fee.status)}
                className="px-4 py-2 text-base">
                {fee.status === "Lunas"
                  ? "✓ Sudah Lunas"
                  : fee.status === "Pending"
                  ? "⏳ Sedang Diproses"
                  : "❌ Gagal"}
              </Badge>
              <p className="text-gray-600 mt-2">
                {fee.status === "Lunas"
                  ? "Pembayaran telah berhasil diverifikasi"
                  : fee.status === "Pending"
                  ? "Pembayaran sedang dalam proses verifikasi"
                  : "Pembayaran gagal, silakan coba lagi"}
              </p>
              {lastPaymentId && fee.status === "Pending" && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-blue-600">
                    🔄 Memeriksa status pembayaran secara otomatis...
                  </p>
                  <Button
                    onClick={forceCheckPaymentStatus}
                    disabled={isCheckingPayment}
                    variant="outline"
                    size="sm"
                    className="w-full">
                    {isCheckingPayment
                      ? "Memeriksa..."
                      : "Paksa Periksa Status"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IuranDetail;
