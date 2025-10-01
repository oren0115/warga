import React from "react";
import { Info, AlertCircle, CheckCircle } from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  type?: "info" | "success" | "warning" | "error" | "custom";
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  type = "info",
}) => {
  const getDefaultIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
        );
      case "warning":
        return (
          <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        );
      case "error":
        return <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />;
      case "info":
      default:
        return <Info className="w-16 h-16 text-gray-400 mx-auto mb-4" />;
    }
  };

  return (
    <div className="text-center py-12">
      {icon || getDefaultIcon()}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
