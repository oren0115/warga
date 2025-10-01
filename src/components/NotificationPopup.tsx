import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { userService } from "../services/user.service";
import type { Notification } from "../types";

// shadcn + lucide
import { Button } from "@/components/ui/button";
import { Bell, Volume2, CreditCard, Clock, Info, Check, X } from "lucide-react";

interface NotificationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead?: () => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  isOpen,
  onClose,
  onNotificationRead,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

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
      onNotificationRead?.();
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
      onNotificationRead?.();
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

  const formatRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
    const now = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    const then = new Date(dateString);
    const diffMs = then.getTime() - now.getTime();
    const minutes = Math.round(diffMs / 60000);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    return rtf.format(days, "day");
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

  const getTypeBadge = (type: string) => {
    const t = type.toLowerCase();
    const styles =
      t === "pembayaran"
        ? "bg-green-100 text-green-700"
        : t === "pengumuman"
        ? "bg-blue-100 text-blue-700"
        : t === "reminder"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-700";
    const label =
      t === "pembayaran"
        ? "Tagihan"
        : t === "pengumuman"
        ? "Pengumuman"
        : t === "reminder"
        ? "Pengingat"
        : "Info";
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${styles}`}>
        {label}
      </span>
    );
  };

  const unreadCount = notifications.filter((notif) => !notif.is_read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed top-14 right-4 z-50 w-96">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[70vh] backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Notifikasi</h2>
              <p className="text-xs text-gray-500">Pemberitahuan terbaru</p>
            </div>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                onClick={markAllAsRead}
                size="sm"
                variant="ghost"
                className="h-8 px-3 text-xs text-green-600 hover:bg-green-100 rounded-lg font-medium">
                <Check className="w-3 h-3 mr-1" /> Tandai Semua
              </Button>
            )}
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-lg">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="p-4 bg-green-100 rounded-full mb-4">
                <Bell className="w-8 h-8 animate-bounce text-green-600" />
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Memuat notifikasi...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12 px-6">
              <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
                <Info className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-red-600 text-sm font-medium mb-4">{error}</p>
              <Button
                onClick={fetchNotifications}
                className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg"
                size="sm">
                Coba Lagi
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className={`${
                    !notification.is_read
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-l-green-400"
                      : "hover:bg-gray-50"
                  } transition-all duration-200`}>
                  <Link
                    to={notification.url || "/notifications"}
                    onClick={() => markAsRead(notification.id)}
                    className="flex items-start gap-4 px-5 py-4 group">
                    <div
                      className={`mt-1 p-2 rounded-full ${
                        !notification.is_read
                          ? "bg-green-100"
                          : "bg-gray-100 group-hover:bg-green-100"
                      } transition-colors duration-200`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0 leading-relaxed">
                      <div className="flex items-start justify-between gap-3">
                        <p
                          className={`text-[13px] md:text-sm font-bold ${
                            !notification.is_read
                              ? "text-gray-900"
                              : "text-gray-700"
                          } group-hover:text-gray-900 transition-colors duration-200`}>
                          {notification.title}
                        </p>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getTypeBadge(notification.type)}
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-[13px] md:text-sm text-gray-600 mt-1 line-clamp-2 group-hover:text-gray-700 transition-colors duration-200">
                        {notification.message}
                      </p>
                      <span
                        className="text-[11px] text-gray-500 mt-2 block"
                        title={formatDate(notification.created_at)}>
                        {formatRelativeTime(notification.created_at)}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Belum ada notifikasi
              </h3>
              <p className="text-xs text-gray-500">
                Notifikasi akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPopup;
