// src/services/browser-notification.service.ts
import type { Notification } from "../types";

export interface BrowserNotificationService {
  requestPermission: () => Promise<NotificationPermission>;
  showNotification: (notification: Notification) => void;
  isSupported: () => boolean;
  getPermission: () => NotificationPermission;
}

class BrowserNotificationServiceImpl implements BrowserNotificationService {
  isSupported(): boolean {
    return "Notification" in window;
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      return "denied";
    }

    if (window.Notification.permission === "granted") {
      return "granted";
    }

    if (window.Notification.permission === "denied") {
      return "denied";
    }

    try {
      const permission = await window.Notification.requestPermission();
      return permission;
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return "denied";
    }
  }

  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return window.Notification.permission;
  }

  showNotification(notification: Notification): void {
    if (!this.isSupported()) {
      return;
    }

    if (window.Notification.permission !== "granted") {
      return;
    }

    try {
      const icon = this.getNotificationIcon(notification.type);
      const options: NotificationOptions = {
        body: notification.message,
        icon: icon,
        badge: icon,
        tag: notification.id, // Prevent duplicate notifications
        requireInteraction: notification.type === "pembayaran", // Require interaction for payment notifications
        silent: false,
        // vibrate: [200, 100, 200], // Vibration pattern - not supported in all browsers
        data: {
          notificationId: notification.id,
          type: notification.type,
          url: notification.url || "/notifications",
        },
      };

      const browserNotification = new window.Notification(
        notification.title,
        options
      );

      // Auto close after 5 seconds for non-payment notifications
      if (notification.type !== "pembayaran") {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }

      // Handle click to focus the app
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();

        // Navigate to notification page if URL is provided
        if (notification.url) {
          window.location.href = notification.url;
        }
      };

      // Handle error
      browserNotification.onerror = (error) => {
        console.error("Notification error:", error);
      };
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  }

  private getNotificationIcon(type: string): string {
    // You can customize these icons based on your needs
    switch (type.toLowerCase()) {
      case "pengumuman":
        return "/logo.png"; // Use your app logo
      case "pembayaran":
        return "/logo.png";
      case "reminder":
        return "/logo.png";
      default:
        return "/logo.png";
    }
  }
}

// Export singleton instance
export const browserNotificationService = new BrowserNotificationServiceImpl();
