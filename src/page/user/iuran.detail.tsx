import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

const IuranDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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
        return "default";
      case "pending":
        return "default";
      case "belum bayar":
        return "default";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!fee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 shadow-sm">
        <Button
          variant="ghost"
          onClick={() => navigate("/iuran")}
          className="mb-2 flex items-center gap-2 text-blue-600 hover:text-blue-700">
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
          Kembali
        </Button>
        <h1 className="text-xl font-semibold">Detail Iuran</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Fee Information */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>{fee.kategori}</CardTitle>
            <Badge variant={getStatusVariant(fee.status)}>{fee.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Bulan:</span>
              <span className="font-medium">{fee.bulan}</span>
            </div>
            <div className="flex justify-between">
              <span>Nominal:</span>
              <span className="font-bold text-lg">
                Rp {fee.nominal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Jatuh Tempo:</span>
              <span>{formatDate(fee.due_date)}</span>
            </div>
            <div className="flex justify-between">
              <span>Dibuat:</span>
              <span>{formatDate(fee.created_at)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Payment Section */}
        {fee.status === "Belum Bayar" && (
          <Card>
            <CardHeader>
              <CardTitle>Pilih Metode Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                className="space-y-3">
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="credit_card" />
                  <div>
                    <div className="font-medium">Kartu Kredit</div>
                    <div className="text-sm text-gray-500">
                      Visa, Mastercard, JCB
                    </div>
                  </div>
                </Label>
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="bank_transfer" />
                  <div>
                    <div className="font-medium">Transfer Bank</div>
                    <div className="text-sm text-gray-500">
                      BCA, Mandiri, BNI, BRI
                    </div>
                  </div>
                </Label>
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <RadioGroupItem value="gopay" />
                  <div>
                    <div className="font-medium">GoPay</div>
                    <div className="text-sm text-gray-500">
                      Pembayaran via GoPay
                    </div>
                  </div>
                </Label>
                <Label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
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
                className="w-full mt-6">
                {isProcessingPayment ? "Memproses..." : "Bayar Sekarang"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Payment Status */}
        {fee.status !== "Belum Bayar" && (
          <Card>
            <CardHeader>
              <CardTitle>Status Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Badge
                variant={getStatusVariant(fee.status)}
                className="px-4 py-2">
                {fee.status === "Lunas"
                  ? "✓ Sudah Lunas"
                  : "⏳ Sedang Diproses"}
              </Badge>
              <p className="text-gray-600 mt-2">
                {fee.status === "Lunas"
                  ? "Pembayaran telah berhasil diverifikasi"
                  : "Pembayaran sedang dalam proses verifikasi"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default IuranDetail;
