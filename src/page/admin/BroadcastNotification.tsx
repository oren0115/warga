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
import { Bell, Send, Volume2, CreditCard, Clock } from "lucide-react";
import { AdminPageHeader } from "../../components/admin";
import { Skeleton } from "../../components/ui/skeleton";

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
      <AdminPageHeader
        title="Broadcast Notifikasi"
        subtitle="Kirim notifikasi ke semua pengguna dalam sistem"
        icon={<Bell className="w-5 h-5 md:w-6 md:h-6 text-white" />}
      />

      <div className="container mx-auto px-4 md:px-6 space-y-6">
        <Card className="hover:shadow-lg transition-all duration-300 border rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-6 h-6 text-green-600" />
              Kirim Notifikasi
            </CardTitle>
            <CardDescription>
              Kirim notifikasi ke semua warga dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-6">
                {/* Notification Type Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Title Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-10 w-full" />
                </div>

                {/* Message Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                </div>

                {/* Preview Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <div className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-start space-x-3">
                      <Skeleton className="h-4 w-4 mt-1" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button Skeleton */}
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
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
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BroadcastNotification;
