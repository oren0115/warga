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
import { AlertTriangle, Info, Loader2, Receipt, Building2, } from "lucide-react";

const GenerateFees: React.FC = () => {

  const [formData, setFormData] = useState({ bulan: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleExport = async (format: "excel" | "pdf") => {
    if (!formData.bulan) {
      setError("Pilih bulan terlebih dahulu untuk mengekspor laporan");
      return;
    }
    try {
      setIsExporting(true);
      const bulanStr = `${currentYear}-${String(formData.bulan).padStart(2, "0")}`;
      const blob = await adminService.exportFeesReport(bulanStr, format);
      const filename = `fees_${bulanStr}.${format === "excel" ? "xlsx" : "pdf"}`;
      triggerDownload(blob, filename);
    } catch (e) {
      console.error(e);
      setError("Gagal mengekspor laporan iuran");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden  mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Dashboard Manajemen Iuran RT/RW
              </h1>
              <p className="text-green-100 text-sm">
                Sistem Pembayaran Digital
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <Receipt className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Generate Iuran Bulanan
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Kelola iuran RT/RW Anda dengan mudah
                  </p>
                </div>
              </div>
              
            </div>
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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled={isLoading}>
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoading ? "Memproses..." : "Generate Iuran"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleExport("excel")}
                  disabled={isExporting}>
                  <Receipt className="w-4 h-4" />
                  {isExporting ? "Mengekspor..." : "Export Excel"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}>
                  <Receipt className="w-4 h-4" />
                  PDF
                </Button>
              </div>
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
