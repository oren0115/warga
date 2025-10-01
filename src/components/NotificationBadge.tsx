import React, { useEffect, useState } from "react";
import { userService } from "../services/user.service";

interface NotificationBadgeProps {
  className?: string;
  refreshKey?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ className = "", refreshKey = 0 }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchUnreadCount();
  }, [refreshKey]);

  const fetchUnreadCount = async () => {
    try {
      const notifications = await userService.getNotifications();
      const unread = notifications.filter((notif) => !notif.is_read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notification count:", error);
    }
  };

  if (unreadCount === 0) return null;

  return (
    <span className={`absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center font-bold shadow-lg animate-pulse ${className}`}>
      {unreadCount > 99 ? "99+" : unreadCount}
    </span>
  );
};

export default NotificationBadge;
