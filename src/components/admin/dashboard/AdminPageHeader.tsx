import React from "react";
import { Building2 } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  description?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  subtitle,
  icon,
  description,
  rightAction,
  className = "",
}) => {
  return (
    <div
      className={`sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white overflow-hidden mb-6 ${className}`}>
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute top-0 right-0 -mt-4 -mr-16 w-32 h-32 bg-white/10 rounded-full"></div>

      <div className="relative p-4 md:p-6">
        {/* Branding Section - Hidden on mobile, visible on desktop */}
        <div className="hidden md:flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold">
              Dashboard Manajemen IPL
            </h1>
            <p className="text-green-100 text-sm">
              Sistem Pengelolaan Pengguna
            </p>
          </div>
        </div>

        {/* Compact Mobile Header - Only visible on mobile */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-lg font-semibold">Dashboard Admin</span>
          </div>
          {rightAction && rightAction}
        </div>

        {/* Enhanced Greeting Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 bg-white/20 rounded-full">
                {icon}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-semibold mb-1">
                  {title}
                </h2>
                <p className="text-green-100 text-xs md:text-sm">{subtitle}</p>
                {description && (
                  <p className="text-green-200 text-xs mt-1">{description}</p>
                )}
              </div>
            </div>
            {/* Desktop right action */}
            <div className="hidden md:block">{rightAction && rightAction}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPageHeader;
