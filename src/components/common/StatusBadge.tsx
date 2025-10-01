import React from "react";
import { Badge } from "../ui/badge";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
  showIcon?: boolean;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant,
  showIcon = true,
  className = "",
}) => {
  const getStatusConfig = (status: string) => {
    const lowerStatus = status.toLowerCase();

    switch (lowerStatus) {
      case "lunas":
      case "success":
      case "settlement":
        return {
          text: "Lunas",
          variant: variant || "default",
          icon: <CheckCircle className="w-4 h-4" />,
          className: "bg-green-100 text-green-700 border-green-200",
        };
      case "pending":
        return {
          text: "Pending",
          variant: variant || "secondary",
          icon: <Clock className="w-4 h-4" />,
          className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        };
      case "belum bayar":
        return {
          text: "Belum Bayar",
          variant: variant || "destructive",
          icon: <AlertCircle className="w-4 h-4" />,
          className: "bg-red-100 text-red-700 border-red-200",
        };
      case "gagal":
      case "failed":
      case "deny":
      case "cancel":
      case "expire":
        return {
          text: status,
          variant: variant || "destructive",
          icon: <XCircle className="w-4 h-4" />,
          className: "bg-red-100 text-red-700 border-red-200",
        };
      default:
        return {
          text: status,
          variant: variant || "outline",
          icon: <AlertCircle className="w-4 h-4" />,
          className: "bg-gray-100 text-gray-700 border-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className} ${
        showIcon ? "flex items-center gap-1" : ""
      } px-3 py-1 font-semibold`}>
      {showIcon && config.icon}
      {config.text}
    </Badge>
  );
};

export default StatusBadge;
