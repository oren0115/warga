import React from "react";
import { Button } from "../ui/button";
import {
  Volume2,
  CreditCard,
  Clock,
  Info,
  CheckCheck,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NotificationCardProps {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  onMarkAsRead?: (id: string) => void;
  url?: string;
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
  url,
  className = "",
}) => {
  const navigate = useNavigate();

  const getTypeConfig = (type: string) => {
    const lowerType = type.toLowerCase();
    switch (lowerType) {
      case "pengumuman":
        return {
          icon: <Volume2 className="w-5 h-5" />,
          bgColor: "bg-blue-50",
          iconBgColor: "bg-blue-100",
          iconColor: "text-blue-600",
          badgeBgColor: "bg-blue-100",
          badgeTextColor: "text-blue-700",
          borderColor: "border-blue-200",
          accentColor: "border-l-blue-500",
          label: "Pengumuman",
        };
      case "pembayaran":
        return {
          icon: <CreditCard className="w-5 h-5" />,
          bgColor: "bg-green-50",
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600",
          badgeBgColor: "bg-green-100",
          badgeTextColor: "text-green-700",
          borderColor: "border-green-200",
          accentColor: "border-l-green-500",
          label: "Pembayaran",
        };
      case "reminder":
        return {
          icon: <Clock className="w-5 h-5" />,
          bgColor: "bg-red-50",
          iconBgColor: "bg-red-100",
          iconColor: "text-red-600",
          badgeBgColor: "bg-red-100",
          badgeTextColor: "text-red-700",
          borderColor: "border-red-200",
          accentColor: "border-l-red-500",
          label: "Pengingat",
        };
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: "bg-gray-50",
          iconBgColor: "bg-gray-100",
          iconColor: "text-gray-600",
          badgeBgColor: "bg-gray-100",
          badgeTextColor: "text-gray-700",
          borderColor: "border-gray-200",
          accentColor: "border-l-gray-500",
          label: "Info",
        };
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = then.getTime() - now.getTime();
    const minutes = Math.round(diffMs / 60000);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    if (Math.abs(days) < 7) return rtf.format(days, "day");

    return then.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Extract payment amount and due date from message if available
  const extractPaymentInfo = () => {
    const amountMatch = message.match(/Rp\s?([\d.,]+)/);
    const dateMatch = message.match(/\d{1,2}\s+\w+\s+\d{4}/);
    return {
      amount: amountMatch ? amountMatch[0] : null,
      dueDate: dateMatch ? dateMatch[0] : null,
    };
  };

  const config = getTypeConfig(type);
  const paymentInfo = extractPaymentInfo();
  const isPending =
    type.toLowerCase() === "pembayaran" || type.toLowerCase() === "reminder";

  const handleQuickAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      navigate(url);
    }
    if (onMarkAsRead && !isRead) {
      onMarkAsRead(id);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border-2 ${
        !isRead ? `${config.accentColor} border-l-4` : config.borderColor
      } overflow-hidden ${className}`}>
      {/* Card Content */}
      <div className="p-5">
        {/* Header: Category + Icon + Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className={`${config.iconBgColor} ${config.iconColor} p-2 rounded-full`}>
              {config.icon}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${config.badgeBgColor} ${config.badgeTextColor}`}>
                {config.label}
              </span>
              <span>•</span>
              <span className="font-medium">
                {formatRelativeTime(createdAt)}
              </span>
            </div>
          </div>
          {!isRead && (
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </div>

        {/* Title: Bold & Larger */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          {title}
        </h3>

        {/* Brief Content: Max 2 lines */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {message}
        </p>

        {/* Payment Info Highlights (if available) */}
        {(paymentInfo.amount || paymentInfo.dueDate) && (
          <div className="flex flex-wrap gap-3 mb-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            {paymentInfo.amount && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-bold text-gray-900">
                  {paymentInfo.amount}
                </span>
              </div>
            )}
            {paymentInfo.dueDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Jatuh Tempo: {paymentInfo.dueDate}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          {/* <Button
            onClick={handleViewDetails}
            size="sm"
            className={`flex-1 ${config.iconColor} ${config.bgColor} hover:${config.iconBgColor} border ${config.borderColor} font-semibold rounded-xl h-9 transition-all duration-200`}
            variant="ghost">
            <Eye className="w-4 h-4 mr-1.5" />
            Lihat Detail
          </Button> */}

          {!isRead && onMarkAsRead && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead(id);
              }}
              size="sm"
              variant="ghost"
              className="px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 rounded-xl h-9 transition-all duration-200">
              <CheckCheck className="w-4 h-4" />
            </Button>
          )}

          {isPending && url && (
            <Button
              onClick={handleQuickAction}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl h-9 px-4 shadow-md hover:shadow-lg transition-all duration-200">
              {type.toLowerCase() === "pembayaran" ? "Bayar" : "Lihat"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
