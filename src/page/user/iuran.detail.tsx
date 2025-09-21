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
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { Label } from "../../components/ui/label";
import type { VariantProps } from "class-variance-authority";
import { badgeVariants } from "../../components/ui/badge";
import { CalendarDays, CreditCard, Wallet, Banknote, Building2, User } from "lucide-react";

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const IuranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authState } = useAuth();
  const [fee, setFee] = useState<Fee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

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
        window.open(paymentResponse.payment_url, "_blank");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Gagal membuat pembayaran. Silakan coba lagi.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status.toLowerCase()) {
      case "lunas":
        return "default"; // hijau (use "default" for paid)
      case "pending":
        return "outline"; // kuning (use "outline" for pending)
      case "belum bayar":
        return "destructive"; // merah
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Enhanced Header with Branding - Responsive */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden mb-6">
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

          {/* Enhanced Greeting Section */}
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
              {/* Desktop back button - hidden on mobile */}
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
              <CardTitle>Pilih Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3">
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="credit_card" />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Kartu Kredit</div>
                      <div className="text-sm text-gray-500">
                        Visa, Mastercard, JCB
                      </div>
                    </div>
                  </div>
                </Label>
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="bank_transfer" />
                  <div className="flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">Transfer Bank</div>
                      <div className="text-sm text-gray-500">
                        BCA, Mandiri, BNI, BRI
                      </div>
                    </div>
                  </div>
                </Label>
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="gopay" />
                  <div>
                    <div className="font-medium">GoPay</div>
                    <div className="text-sm text-gray-500">
                      Pembayaran via GoPay
                    </div>
                  </div>
                </Label>
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <RadioGroupItem value="shopeepay" />
                  <div>
                    <div className="font-medium">ShopeePay</div>
                    <div className="text-sm text-gray-500">
                      Pembayaran via ShopeePay
                    </div>
                  </div>
                </Label>
              </RadioGroup>

              <Button
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || isProcessingPayment}
                className="w-full mt-6 bg-green-600 hover:bg-green-700 shadow-lg text-white font-semibold py-3 text-lg"
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
              <CardTitle>Status Pembayaran</CardTitle>
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IuranDetail;
