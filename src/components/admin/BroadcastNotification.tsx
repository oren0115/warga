import React, { useState } from "react";
import { adminService } from "../../services/admin.service";
import type { BroadcastNotificationRequest } from "../../types";

// shadcn + lucide
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  Send,
  Volume2,
  CreditCard,
  Clock,
  Building2,
} from "lucide-react";

const BroadcastNotification: React.FC = () => {
  const [formData, setFormData] = useState<BroadcastNotificationRequest>({
    title: "",
    message: "",
    notification_type: "pengumuman",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await adminService.broadcastNotification(formData);
      setMessage(response.message);
      setFormData({
        title: "",
        message: "",
        notification_type: "pengumuman",
      });
    } catch (error) {
      console.error("Error broadcasting notification:", error);
      setError("Gagal mengirim notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pengumuman":
        return <Volume2 className="w-4 h-4 text-blue-600" />;
      case "pembayaran":
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case "reminder":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden  mb-6">
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

        <div className="relative p-4 md:p-6">
          <div className="hidden md:flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold">
                Broadcast Notifikasi RT/RW
              </h1>
              <p className="text-green-100 text-sm">
                Sistem Broadcast Notifikasi
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                  <Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-1">
                    Broadcast Notifikasi
                  </h2>
                  <p className="text-green-100 text-xs md:text-sm">
                    Broadcast notifikasi ke semua pengguna dalam sistem
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 space-y-6">
        <Card className="hover:shadow-lg transition-all duration-300 border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-600" />
              Broadcast Notifikasi
            </CardTitle>
            <CardDescription>
              Kirim notifikasi ke semua pengguna dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Notification Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Tipe Notifikasi</Label>
                <Select
                  value={formData.notification_type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      notification_type: value,
                    }))
                  }>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe notifikasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pengumuman">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-green-600" />
                        Pengumuman
                      </div>
                    </SelectItem>
                    <SelectItem value="pembayaran">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-green-600" />
                        Pembayaran
                      </div>
                    </SelectItem>
                    <SelectItem value="reminder">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-yellow-600" />
                        Reminder
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Judul Notifikasi</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Masukkan judul notifikasi"
                  required
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Isi Notifikasi</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Masukkan isi notifikasi"
                  rows={4}
                  required
                />
              </div>

              {/* Preview */}
              {formData.title && formData.message && (
                <div className="space-y-2">
                  <Label>Preview Notifikasi</Label>
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getTypeIcon(
                          formData.notification_type ?? "pengumuman"
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                          {formData.title}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {formData.message}
                        </p>
                        <div className="mt-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {formData.notification_type}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success/Error Messages */}
              {message && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 text-sm">{message}</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.title || !formData.message}
                className="w-full gap-2">
                {isLoading ? (
                  <>
                    <Bell className="w-4 h-4 animate-pulse" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Kirim Notifikasi
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BroadcastNotification;
