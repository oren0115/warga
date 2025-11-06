// src/hooks/useRealtimeNotifications.ts
import { useEffect, useCallback, useState } from "react";
import { useToast } from "../context/toast.context";
import { useGlobalError } from "../context/global-error.context";
import { getToastDuration, isLightweightError } from "../utils/error-handling.utils";
import { websocketService } from "../services/websocket.service";
import { browserNotificationService } from "../services/browser-notification.service";
import type { Notification } from "../types";

interface UseRealtimeNotificationsProps {
  userId: string | null;
  token: string | null;
  onNewNotification?: (notification: Notification) => void;
}

export const useRealtimeNotifications = ({
  userId,
  token,
  onNewNotification,
}: UseRealtimeNotificationsProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const { showError } = useToast();
  const { setGlobalError } = useGlobalError();

  // Request notification permission on mount
  useEffect(() => {
    const requestPermission = async () => {
      const permission = await browserNotificationService.requestPermission();
      setPermissionGranted(permission === "granted");
    };

    requestPermission();
  }, []);

  // Connect to WebSocket when user is available
  useEffect(() => {
    if (userId && token) {
      // Add a small delay to ensure the component is fully mounted
      const timeoutId = setTimeout(() => {
        websocketService.connect(userId, token);
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        websocketService.disconnect();
      };
    } else {
      websocketService.disconnect();
    }
  }, [userId, token]);

  // Handle WebSocket connection status
  useEffect(() => {
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    websocketService.onConnectionChange(handleConnectionChange);

    return () => {
      // Note: In a real implementation, you might want to remove specific callbacks
      // For now, we'll rely on the service cleanup
    };
  }, []);

  // Handle incoming notifications
  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      // Show browser notification immediately if permission is granted
      if (permissionGranted) {
        browserNotificationService.showNotification(notification);
      }

      // Call the provided callback
      onNewNotification?.(notification);

      // Emit custom event for other components (non-blocking)
      try {
        window.dispatchEvent(
          new CustomEvent("notificationReceived", {
            detail: notification,
          })
        );
      } catch (err: any) {
        const message = "Gagal memproses notifikasi realtime";
        if (isLightweightError(err)) {
          showError(message, getToastDuration(err));
        } else {
          setGlobalError(err);
        }
      }
    };

    websocketService.onNotification(handleNotification);

    return () => {
      // Cleanup handled by service
    };
  }, [permissionGranted, onNewNotification]);

  // Manual permission request function
  const requestNotificationPermission = useCallback(async () => {
    const permission = await browserNotificationService.requestPermission();
    setPermissionGranted(permission === "granted");
    return permission === "granted";
  }, []);

  // Test notification function (for development)
  const testNotification = useCallback(() => {
    if (permissionGranted) {
      const testNotif: Notification = {
        id: "test-" + Date.now(),
        user_id: userId || "",
        title: "Test Notification",
        message:
          "This is a test notification to verify browser notifications are working.",
        type: "pengumuman",
        is_read: false,
        read: false,
        created_at: new Date().toISOString(),
        url: "/notifications",
      };
      browserNotificationService.showNotification(testNotif);
    } else {
      requestNotificationPermission();
    }
  }, [permissionGranted, userId, requestNotificationPermission]);

  return {
    isConnected,
    permissionGranted,
    requestNotificationPermission,
    testNotification,
  };
};
