import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Search, Filter, RefreshCw, Download, X } from "lucide-react";

interface FilterOption {
  key: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: FilterOption[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  isRefreshing?: boolean;
  isExporting?: boolean;
  showSearch?: boolean;
  showFilters?: boolean;
  showRefresh?: boolean;
  showExport?: boolean;
  showReset?: boolean;
  className?: string;
  rightActions?: React.ReactNode;
}

const AdminFilters: React.FC<AdminFiltersProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Cari...",
  filters,
  activeFilter,
  onFilterChange,
  onRefresh,
  onExport,
  onReset,
  isRefreshing = false,
  isExporting = false,
  showSearch = true,
  showFilters = true,
  showRefresh = true,
  showExport = true,
  showReset = true,
  className = "",
  rightActions,
}) => {
  const hasActiveFilters = activeFilter !== "all" || searchTerm !== "";

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search and Main Actions */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search Bar */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {rightActions}
          
          {showRefresh && onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="font-medium"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              {isRefreshing ? "Memuat..." : "Refresh"}
            </Button>
          )}

          {showExport && onExport && (
            <Button
              onClick={onExport}
              disabled={isExporting}
              variant="outline"
              size="sm"
              className="font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              {isExporting ? "Mengekspor..." : "Export"}
            </Button>
          )}
        </div>
      </div>

      {/* Filter Buttons */}
      {showFilters && filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? "default" : "outline"}
              onClick={() => onFilterChange(filter.key)}
              className="text-sm font-medium"
              size="sm"
            >
              {filter.icon && <span className="mr-2">{filter.icon}</span>}
              {filter.label}
              {filter.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {filter.count.toLocaleString()}
                </span>
              )}
            </Button>
          ))}
        </div>
      )}

      {/* Reset Button */}
      {showReset && hasActiveFilters && onReset && (
        <div className="flex justify-end">
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Filter className="w-4 h-4 mr-2" />
            Reset Semua Filter
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminFilters;
