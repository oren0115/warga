// src/hooks/useRealtimeDashboard.ts
import { useCallback, useEffect, useState } from 'react';
import { websocketService } from '../services/websocket.service';
import type { DashboardStats } from '../types';

interface UseRealtimeDashboardProps {
  userId: string | null;
  token: string | null;
  onDashboardUpdate?: (stats: DashboardStats) => void;
}

export const useRealtimeDashboard = ({
  userId,
  token,
  onDashboardUpdate,
}: UseRealtimeDashboardProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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

  // Handle incoming dashboard updates
  useEffect(() => {
    const handleDashboardUpdate = (data: any) => {
      console.log('🔄 Dashboard update received:', data);
      setLastUpdate(new Date());
      onDashboardUpdate?.(data);
    };

    websocketService.onDashboardUpdate(handleDashboardUpdate);

    return () => {
      // Cleanup handled by service
    };
  }, [onDashboardUpdate]);

  // Manual refresh function
  const refreshDashboard = useCallback(() => {
    // This will trigger a re-fetch in the parent component
    onDashboardUpdate?.(null as any);
  }, [onDashboardUpdate]);

  return {
    isConnected,
    lastUpdate,
    refreshDashboard,
  };
};
