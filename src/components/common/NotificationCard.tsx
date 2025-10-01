import React from "react";
import { Button } from "../ui/button";
import { Volume2, CreditCard, Clock, Info } from "lucide-react";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  onMarkAsRead?: (id: string) => void;
  className?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  id,
  title,
  message,
  type,
  isRead,
  createdAt,
  onMarkAsRead,
  className = "",
}) => {
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

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "pengumuman":
        return "bg-blue-100 text-blue-800";
      case "pembayaran":
        return "bg-green-100 text-green-800";
      case "reminder":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-sm p-6 border ${
        !isRead ? "border-l-4 border-l-blue-500" : "border-gray-200"
      } ${className}`}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">{getTypeIcon(type)}</div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                  type
                )}`}>
                {type}
              </span>
              {!isRead && (
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              )}
            </div>
          </div>

          <p className="text-gray-700 mb-3">{message}</p>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {formatDate(createdAt)}
            </span>

            {!isRead && onMarkAsRead && (
              <Button
                onClick={() => onMarkAsRead(id)}
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700">
                Tandai Dibaca
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
