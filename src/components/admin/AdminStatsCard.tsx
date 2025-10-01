import React from "react";
import { Card, CardContent } from "../ui/card";

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  valueColor?: string;
  trend?: {
    value: string | number;
    label: string;
    color?: string;
  };
  className?: string;
  onClick?: () => void;
}

const AdminStatsCard: React.FC<AdminStatsCardProps> = ({
  title,
  value,
  description,
  icon,
  iconBgColor = "bg-blue-100",
  iconTextColor = "text-blue-700",
  valueColor = "text-gray-900",
  trend,
  className = "",
  onClick,
}) => {
  const formatValue = (val: string | number) => {
    if (typeof val === "number") {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-all duration-300 rounded-xl border border-gray-100 ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              {title}
            </p>
            <p className={`text-3xl font-bold ${valueColor}`}>
              {formatValue(value)}
            </p>
            {description && (
              <p className="text-xs text-gray-500">
                {description}
              </p>
            )}
            {trend && (
              <div className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${trend.color || 'bg-blue-500'}`}></div>
                <span className="text-gray-600">
                  {trend.label}:{" "}
                  <span className={`font-semibold ${trend.color || 'text-blue-600'}`}>
                    {formatValue(trend.value)}
                  </span>
                </span>
              </div>
            )}
          </div>
          <div className={`p-4 rounded-xl shadow-sm ${iconBgColor}`}>
            <div className={`w-7 h-7 ${iconTextColor}`}>
              {icon}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminStatsCard;
