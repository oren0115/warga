// src/services/websocket.service.ts
import type { Notification } from '../types';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface WebSocketService {
  connect: (userId: string, token: string) => void;
  disconnect: () => void;
  isConnected: () => boolean;
  onNotification: (callback: (notification: Notification) => void) => void;
  onConnectionChange: (callback: (connected: boolean) => void) => void;
  onDashboardUpdate: (callback: (data: any) => void) => void;
}

class WebSocketServiceImpl implements WebSocketService {
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private token: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  // Dasar interval untuk exponential backoff reconnect
  private baseReconnectInterval = 2000; // 2 seconds
  private heartbeatIntervalMs = 30000; // 30 seconds
  private heartbeatTimer: number | null = null;
  private notificationCallbacks: ((notification: Notification) => void)[] = [];
  private connectionCallbacks: ((connected: boolean) => void)[] = [];
  private dashboardUpdateCallbacks: ((data: any) => void)[] = [];

  connect(userId: string, token: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.userId = userId;
    this.token = token;

    // Get API base URL from environment variable
    const apiBaseUrl = import.meta.env.VITE_API_URL || '';

    // Convert HTTP/HTTPS to WS/WSS
    const wsUrl =
      apiBaseUrl
        .replace(/^http/, 'ws') // http -> ws, https -> wss
        .replace(/\/$/, '') + // Remove trailing slash
      `/ws/${userId}`;

    try {
      // Kirim token melalui Sec-WebSocket-Protocol agar tidak muncul di URL dan log query string.
      // Backend akan mengambil token dari header ini.
      this.ws = new WebSocket(wsUrl, ['jwt', token]);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
        this.startHeartbeat();
      };

      this.ws.onmessage = event => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);

          if (message.type === 'notification') {
            this.notifyNotificationCallbacks(message.data);
          } else if (message.type === 'dashboard_update') {
            this.notifyDashboardUpdateCallbacks(message.data);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = event => {
        this.stopHeartbeat();
        this.notifyConnectionChange(false);

        // Attempt to reconnect if not a manual close
        if (
          event.code !== 1000 &&
          this.reconnectAttempts < this.maxReconnectAttempts
        ) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = error => {
        console.error('WebSocket error:', error);
        this.stopHeartbeat();
        this.notifyConnectionChange(false);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.notifyConnectionChange(false);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;

    // Exponential backoff dengan batas maksimum dan jitter kecil
    const maxInterval = 30000; // 30 detik
    const exponent = Math.min(this.reconnectAttempts, 5);
    let delay = this.baseReconnectInterval * Math.pow(2, exponent - 1);
    delay = Math.min(delay, maxInterval);

    const jitter = delay * 0.2;
    const randomizedDelay = delay + (Math.random() * jitter - jitter / 2);

    setTimeout(() => {
      if (this.userId && this.token) {
        this.connect(this.userId, this.token);
      }
    }, randomizedDelay);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.stopHeartbeat();
    this.userId = null;
    this.token = null;
    this.reconnectAttempts = 0;
    this.notifyConnectionChange(false);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  private startHeartbeat() {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
    }
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        try {
          this.ws.send('ping');
        } catch (error) {
          console.error('Failed to send WebSocket heartbeat:', error);
        }
      }
    }, this.heartbeatIntervalMs);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  onNotification(callback: (notification: Notification) => void) {
    this.notificationCallbacks.push(callback);
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionCallbacks.push(callback);
  }

  onDashboardUpdate(callback: (data: any) => void) {
    this.dashboardUpdateCallbacks.push(callback);
  }

  private notifyNotificationCallbacks(notification: Notification) {
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  private notifyConnectionChange(connected: boolean) {
    this.connectionCallbacks.forEach(callback => {
      try {
        callback(connected);
      } catch (error) {
        console.error('Error in connection callback:', error);
      }
    });
  }

  private notifyDashboardUpdateCallbacks(data: any) {
    this.dashboardUpdateCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in dashboard update callback:', error);
      }
    });
  }
}

// Export singleton instance
export const websocketService = new WebSocketServiceImpl();
