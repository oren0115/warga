import React, { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import type { Notification } from "../../types";
import NotificationPopup from "../../components/NotificationPopup";
import NotificationBadge from "../../components/NotificationBadge";
// shadcn + lucide
import { Button } from "@/components/ui/button";
import { Bell, Volume2, CreditCard, Clock, Info } from "lucide-react";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const notificationsData = await userService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setError("Gagal memuat notifikasi");
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await userService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
      // Refresh badge count in header
      setNotificationRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(
        (notif) => !notif.is_read
      );
      await Promise.all(
        unreadNotifications.map((notif) =>
          userService.markNotificationAsRead(notif.id)
        )
      );
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, is_read: true }))
      );
      setNotificationRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pengumuman":
        return <Volume2 className="w-5 h-5 text-blue-600" />;
      case "pembayaran":
        return <CreditCard className="w-5 h-5 text-green-600" />;
      case "reminder":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pengumuman":
        return "bg-blue-100 text-blue-800";
      case "pembayaran":
        return "bg-green-100 text-green-800";
      case "reminder":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Bell className="w-8 h-8 animate-bounce text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Info className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchNotifications}>
            Coba Lagi
          </Button>
        </div>
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
          {/* Header konsisten dengan halaman lain */}
          <div className="flex items-center justify-between mb-2">
            {/* Kiri: Title & subtitle */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Notifikasi</h1>
                <p className="text-green-100 text-sm">Informasi terbaru untuk Anda</p>
              </div>
            </div>

            {/* Kanan: Aksi cepat (badge + tombol) */}
            {/* <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowNotificationPopup(true)}>
                  <Bell className="w-5 h-5" />
                  <NotificationBadge refreshKey={notificationRefreshKey} />
                </Button>
              </div>
              {notifications.some((n) => !n.is_read) && (
                <Button
                  variant="outline"
                  className="border-white/40 text-white hover:bg-white/10"
                  onClick={markAllAsRead}>
                  Tandai semua dibaca
                </Button>
              )}
            </div> */}
          </div>

          {/* Mobile quick action */}
          {/* <div className="md:hidden flex items-center justify-end mt-2">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setShowNotificationPopup(true)}>
                <Bell className="w-5 h-5" />
                <NotificationBadge refreshKey={notificationRefreshKey} />
              </Button>
            </div>
          </div> */}
        </div>
      </div>

      {/* List Notifikasi */}
      <div className="p-4">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm p-6 border ${
                  !notification.is_read
                    ? "border-l-4 border-l-blue-500"
                    : "border-gray-200"
                }`}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {notification.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            notification.type
                          )}`}>
                          {notification.type}
                        </span>
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-3">{notification.message}</p>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {formatDate(notification.created_at)}
                      </span>

                      {!notification.is_read && (
                        <Button
                          onClick={() => markAsRead(notification.id)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700">
                          Tandai Dibaca
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Notifikasi
            </h3>
            <p className="text-gray-600">Notifikasi akan muncul di sini</p>
          </div>
        )}
      </div>
      {/* Notifikasi Popup */}
      <NotificationPopup
        isOpen={showNotificationPopup}
        onClose={() => setShowNotificationPopup(false)}
        onNotificationRead={() => setNotificationRefreshKey((k) => k + 1)}
      />
    </div>
  );
};

export default Notifications;
