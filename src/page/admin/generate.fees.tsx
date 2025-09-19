import React, { useState } from "react";
import { adminService } from "../../services/admin.service";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import { AlertTriangle, Info, Users, Loader2 } from "lucide-react";

const GenerateFees: React.FC = () => {
  const [formData, setFormData] = useState({ bulan: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const currentYear = new Date().getFullYear();

  const months = [
    { value: "1", label: "Januari" },
    { value: "2", label: "Februari" },
    { value: "3", label: "Maret" },
    { value: "4", label: "April" },
    { value: "5", label: "Mei" },
    { value: "6", label: "Juni" },
    { value: "7", label: "Juli" },
    { value: "8", label: "Agustus" },
    { value: "9", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      await adminService.generateFees(formData);
      setMessage("✅ Iuran berhasil dibuat untuk semua warga");
      setFormData({ bulan: "" });
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal membuat iuran");
    } finally {
      setIsLoading(false);
      setShowConfirm(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bulan) {
      setError("Bulan harus dipilih");
      return;
    }
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gray-100 rounded-xl">
            <Users className="w-6 h-6 text-gray-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Tagihan</h1>
            <p className="text-gray-600 mt-1">Kelola tagihan warga</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Form Card */}
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Buat Iuran Baru
            </CardTitle>
            <CardDescription>
              Pilih bulan untuk membuat iuran semua warga
            </CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <Info className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-700">Berhasil</AlertTitle>
                <AlertDescription className="text-green-700">
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="mb-4 bg-red-50 border-red-200">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-700">Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bulan">Pilih Bulan</Label>
                <Select
                  value={formData.bulan}
                  onValueChange={(val: string) =>
                    setFormData((prev) => ({ ...prev, bulan: val }))
                  }>
                  <SelectTrigger id="bulan">
                    <SelectValue placeholder="-- Pilih Bulan --" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label} {currentYear}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Iuran akan dibuat untuk semua warga yang terdaftar
                </p>
              </div>

              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertTitle className="text-yellow-800">Perhatian</AlertTitle>
                <AlertDescription className="text-yellow-700">
                  Pastikan Anda memilih bulan yang benar. Proses ini akan
                  membuat iuran untuk semua warga yang terdaftar.
                </AlertDescription>
              </Alert>

              <Button
                type="submit"
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoading ? "Memproses..." : "Generate Iuran"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="rounded-xl shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-800">
              Informasi Generate Iuran
            </CardTitle>
            <CardDescription>
              Detail mengenai proses generate iuran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm text-gray-600">
              {[
                "Iuran akan dibuat untuk semua warga yang terdaftar",
                "Setiap warga akan menerima notifikasi tentang iuran baru",
                "Iuran akan memiliki status Belum Bayar secara default",
                "Warga dapat melakukan pembayaran melalui metode yang tersedia",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Modal Konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Konfirmasi Generate Iuran
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Anda yakin ingin membuat iuran untuk semua warga pada bulan ini?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="px-4">
                Batal
              </Button>
              <Button onClick={handleGenerate} disabled={isLoading}>
                {isLoading ? "Memproses..." : "Ya, Generate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateFees;
