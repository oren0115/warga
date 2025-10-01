import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Terjadi Kesalahan",
  message,
  onRetry,
  retryText = "Coba Lagi",
  className = "",
}) => {
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
