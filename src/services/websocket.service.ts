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
  private reconnectInterval = 3000; // 3 seconds
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
      `/ws/${userId}?token=${encodeURIComponent(token)}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.reconnectAttempts = 0;
        this.notifyConnectionChange(true);
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
        this.notifyConnectionChange(false);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      this.notifyConnectionChange(false);
    }
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;

    setTimeout(() => {
      if (this.userId && this.token) {
        this.connect(this.userId, this.token);
      }
    }, this.reconnectInterval);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }
    this.userId = null;
    this.token = null;
    this.reconnectAttempts = 0;
    this.notifyConnectionChange(false);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
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
