import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

interface FilterTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  showCounts?: boolean;
  variant?: "tabs" | "select";
  onRefresh?: () => void;
  className?: string;
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  showCounts = true,
  variant = "tabs",
  onRefresh,
  className = "",
}) => {
  if (variant === "select") {
    return (
      <div
        className={`shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 ${className}`}>
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Filter Data
            </h3>
            <p className="text-sm text-gray-600">
              Pilih kategori untuk melihat data
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500">Kategori aktif:</span>
              <Badge className="bg-green-100 text-green-700 text-xs font-medium">
                {tabs.find((tab) => tab.value === activeTab)?.label || "Semua"}
              </Badge>
              {showCounts && (
                <span className="text-xs text-gray-500">
                  ({tabs.find((tab) => tab.value === activeTab)?.count || 0}{" "}
                  item)
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <Select value={activeTab} onValueChange={onTabChange}>
              <SelectTrigger className="flex-1 bg-gray-50 border-gray-200 focus:ring-green-500 focus:border-green-500">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                      {showCounts && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs bg-gray-100">
                          {tab.count || 0}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                className="whitespace-nowrap">
                Segarkan Data
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          variant={activeTab === tab.value ? "default" : "outline"}
          onClick={() => onTabChange(tab.value)}
          className={`flex items-center gap-2 ${
            activeTab === tab.value
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "hover:bg-green-50 hover:text-green-700"
          }`}>
          {tab.icon}
          <span>{tab.label}</span>
          {showCounts && tab.count !== undefined && (
            <Badge
              variant={activeTab === tab.value ? "secondary" : "outline"}
              className="ml-1 text-xs">
              {tab.count}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};

export default FilterTabs;
