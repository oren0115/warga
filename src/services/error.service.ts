// src/services/error.service.ts
import type { User } from "../types";
import { logger } from "../utils/logger.utils";

export interface ErrorContext {
  componentStack?: string;
  errorBoundary?: boolean;
  timestamp?: string;
  userAgent?: string;
  url?: string;
  userId?: string;
  sessionId?: string;
  action?: string;
  apiEndpoint?: string;
  requestId?: string;
  [key: string]: any;
}

export interface ErrorLog {
  id: string;
  message: string;
  stack?: string;
  context: ErrorContext;
  severity: "low" | "medium" | "high" | "critical";
  category: "network" | "validation" | "server" | "client" | "unknown";
  timestamp: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

class ErrorService {
  private errorQueue: ErrorLog[] = [];
  private maxQueueSize = 100;
  private isOnline = navigator.onLine;
  private retryDelay = 1000; // 1 second

  constructor() {
    // Listen for online/offline events
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.processErrorQueue();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
    });

    // Listen for unhandled errors
    window.addEventListener("error", (event) => {
      this.logError(
        new Error(event.message),
        {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
        "critical",
        "client"
      );
    });

    // Listen for unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError(
        new Error(event.reason?.message || "Unhandled Promise Rejection"),
        {
          reason: event.reason,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
        "high",
        "client"
      );
    });
  }

  /**
   * Log an error with context
   */
  logError(
    error: Error,
    context: ErrorContext = {},
    severity: "low" | "medium" | "high" | "critical" = "medium",
    category:
      | "network"
      | "validation"
      | "server"
      | "client"
      | "unknown" = "unknown"
  ): void {
    try {
      // Get current user info if available
      const user = this.getCurrentUser();
      if (user) {
        context.userId = user.id;
        context.sessionId = this.getSessionId();
      }

      // Create error log
      const errorLog: ErrorLog = {
        id: this.generateErrorId(),
        message: error.message || "Unknown error",
        stack: error.stack,
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        },
        severity,
        category,
        timestamp: new Date().toISOString(),
        user: user
          ? {
              id: user.id,
              username: user.username,
              role: user.is_admin ? "admin" : "user",
            }
          : undefined,
      };

      // Add to queue
      this.addToQueue(errorLog);

      // Log to console in development
      if (import.meta.env.DEV) {
        logger.error(`🚨 Error Logged (${severity.toUpperCase()})`, error);
        logger.log("Context:", context);
        logger.log("Error Log:", errorLog);
      }

      // Try to send immediately if online
      if (this.isOnline) {
        this.sendErrorToServer(errorLog);
      }
    } catch (loggingError) {
      logger.error("Failed to log error:", loggingError);
    }
  }

  /**
   * Log API errors specifically
   */
  logApiError(
    error: any,
    endpoint: string,
    method: string = "GET",
    requestData?: any
  ): void {
    const context: ErrorContext = {
      apiEndpoint: endpoint,
      method,
      requestData: requestData ? JSON.stringify(requestData) : undefined,
      action: "api_call",
    };

    let severity: "low" | "medium" | "high" | "critical" = "medium";
    let category: "network" | "validation" | "server" | "client" | "unknown" =
      "network";

    // Determine severity based on status code
    if (error.response?.status) {
      const status = error.response.status;
      if (status >= 500) {
        severity = "high";
        category = "server";
      } else if (status >= 400) {
        severity = "medium";
        category = "client";
      } else {
        severity = "low";
        category = "network";
      }
    }

    this.logError(error, context, severity, category);
  }

  /**
   * Log validation errors
   */
  logValidationError(
    field: string,
    value: any,
    rule: string,
    message: string
  ): void {
    const error = new Error(`Validation failed for ${field}: ${message}`);
    const context: ErrorContext = {
      field,
      value: typeof value === "object" ? JSON.stringify(value) : String(value),
      rule,
      action: "validation",
    };

    this.logError(error, context, "low", "validation");
  }

  /**
   * Log user actions that might be useful for debugging
   */
  logUserAction(
    action: string,
    details?: any,
    severity: "low" | "medium" | "high" | "critical" = "low"
  ): void {
    const error = new Error(`User action: ${action}`);
    const context: ErrorContext = {
      action,
      details: details ? JSON.stringify(details) : undefined,
    };

    this.logError(error, context, severity, "client");
  }

  /**
   * Get current user from localStorage or context
   */
  private getCurrentUser(): User | null {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get or create session ID
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem("errorSessionId");
    if (!sessionId) {
      sessionId = this.generateErrorId();
      sessionStorage.setItem("errorSessionId", sessionId);
    }
    return sessionId;
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add error to queue
   */
  private addToQueue(errorLog: ErrorLog): void {
    this.errorQueue.push(errorLog);

    // Remove oldest errors if queue is full
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Store in localStorage as backup
    try {
      localStorage.setItem("errorQueue", JSON.stringify(this.errorQueue));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Send error to server
   */
  private async sendErrorToServer(errorLog: ErrorLog): Promise<void> {
    try {
      // In a real implementation, you would send this to your error tracking service
      // For now, we'll simulate the API call

      // Example: Send to your backend API
      // await fetch('/api/errors', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(errorLog),
      // });

      // For development, just log to console
      if (import.meta.env.DEV) {
        logger.log("📤 Sending error to server:", errorLog);
      }

      // Remove from queue after successful send
      this.removeFromQueue(errorLog.id);
    } catch (error) {
      logger.error("Failed to send error to server:", error);
      // Will retry later when online
    }
  }

  /**
   * Process error queue when back online
   */
  private async processErrorQueue(): Promise<void> {
    if (!this.isOnline || this.errorQueue.length === 0) {
      return;
    }

    const errorsToProcess = [...this.errorQueue];

    for (const errorLog of errorsToProcess) {
      try {
        await this.sendErrorToServer(errorLog);
        await this.delay(this.retryDelay);
      } catch (error) {
        logger.error("Failed to process error from queue:", error);
      }
    }
  }

  /**
   * Remove error from queue
   */
  private removeFromQueue(errorId: string): void {
    this.errorQueue = this.errorQueue.filter((log) => log.id !== errorId);

    // Update localStorage
    try {
      localStorage.setItem("errorQueue", JSON.stringify(this.errorQueue));
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Get error statistics
   */
  getErrorStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
    recent: ErrorLog[];
  } {
    const recent = this.errorQueue.slice(-10); // Last 10 errors

    const bySeverity = this.errorQueue.reduce((acc, log) => {
      acc[log.severity] = (acc[log.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = this.errorQueue.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: this.errorQueue.length,
      bySeverity,
      byCategory,
      recent,
    };
  }

  /**
   * Clear error queue
   */
  clearErrorQueue(): void {
    this.errorQueue = [];
    try {
      localStorage.removeItem("errorQueue");
    } catch {
      // Ignore localStorage errors
    }
  }

  /**
   * Utility function for delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const errorService = new ErrorService();

// Export class for testing
export { ErrorService };
