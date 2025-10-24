import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { AlertCircle } from "lucide-react";
import { getErrorInfo } from "../../utils/error-messages";

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: any;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
  showTechnicalDetails?: boolean;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Terjadi Kesalahan",
  message,
  error,
  onRetry,
  retryText = "Coba Lagi",
  className = "",
  showTechnicalDetails = false,
}) => {
  // Jika ada error object, gunakan sistem error handling yang baru
  if (error) {
    const errorInfo = getErrorInfo(error);
    const displayMessage = message || errorInfo.userMessage;
    const shouldShowRetry = errorInfo.showRetry && onRetry;
    
    return (
      <div
        className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
        <Card className="max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-gray-600 mb-4">{displayMessage}</p>
              
              {/* Technical details (development only) */}
              {showTechnicalDetails && process.env.NODE_ENV === 'development' && (
                <details className="text-left bg-gray-100 p-3 rounded mb-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700">
                    Detail Teknis
                  </summary>
                  <div className="text-xs text-gray-600 mt-2 space-y-1">
                    <p><strong>Status:</strong> {errorInfo.statusCode || 'N/A'}</p>
                    <p><strong>Kategori:</strong> {errorInfo.category}</p>
                    <p><strong>Severity:</strong> {errorInfo.severity}</p>
                    <p><strong>Technical:</strong> {errorInfo.technicalMessage}</p>
                  </div>
                </details>
              )}
              
              {shouldShowRetry && (
                <Button onClick={onRetry} className="w-full">
                  {retryText}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fallback untuk kompatibilitas dengan kode lama
  return (
    <div
      className={`flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <Card className="max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 mb-4">{message}</p>
            {onRetry && (
              <Button onClick={onRetry} className="w-full">
                {retryText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorState;
