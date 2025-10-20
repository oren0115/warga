import React from "react";
import { Button } from "@/components/ui/button";

interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  showItemsPerPage?: boolean;
  className?: string;
  totalUnfilteredItems?: number;
  filterInfo?: string;
}

const AdminPagination: React.FC<AdminPaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 25, 50],
  showItemsPerPage = true,
  className = "",
  totalUnfilteredItems,
  filterInfo,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const visiblePages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        visiblePages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        visiblePages.push(i);
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        visiblePages.push(i);
      }
    }

    return visiblePages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      className={`flex flex-col gap-3 px-4 sm:px-6 py-4 bg-gray-50 border-t ${className}`}>
      {/* Items Info */}
      <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
        Menampilkan <span className="font-semibold">{startIndex + 1}</span>{" "}
        sampai <span className="font-semibold">{endIndex}</span> dari{" "}
        <span className="font-semibold">{totalItems.toLocaleString()}</span>{" "}
        {filterInfo || "hasil"}
        {totalUnfilteredItems && totalUnfilteredItems !== totalItems && (
          <span className="block sm:inline text-green-600 sm:ml-1 mt-1 sm:mt-0">
            (difilter dari {totalUnfilteredItems.toLocaleString()} total)
          </span>
        )}
      </div>

      {/* Items per page selector - Mobile First */}
      {showItemsPerPage && onItemsPerPageChange && (
        <div className="flex items-center justify-center sm:justify-start gap-2">
          <span className="text-xs sm:text-sm text-gray-600">Tampilkan:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500">
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="text-xs sm:text-sm text-gray-600">per halaman</span>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center justify-center gap-1 sm:gap-2">
        {/* First Page - Hidden on mobile */}
        <Button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="hidden sm:flex px-2 sm:px-3 py-2 hover:bg-green-50 disabled:opacity-50">
          ‹‹
        </Button>

        {/* Previous Page */}
        <Button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="px-2 sm:px-4 py-2 hover:bg-green-50 disabled:opacity-50 text-xs sm:text-sm">
          <span className="hidden sm:inline">‹ Sebelumnya</span>
          <span className="sm:hidden">‹ Prev</span>
        </Button>

        {/* Page Numbers - Desktop */}
        <div className="hidden md:flex items-center gap-1">
          {getVisiblePages().map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              variant="outline"
              size="sm"
              className={`px-3 py-2 min-w-[40px] ${
                currentPage === pageNum
                  ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                  : "bg-white hover:bg-green-50 border-gray-300"
              }`}>
              {pageNum}
            </Button>
          ))}
        </div>

        {/* Mobile: Current page indicator with direct input */}
        <div className="md:hidden flex items-center gap-2 px-3 py-2">
          <input
            type="number"
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                onPageChange(page);
              }
            }}
            min={1}
            max={totalPages}
            className="w-12 px-2 py-1 text-center border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="text-sm text-gray-600">/ {totalPages}</span>
        </div>

        {/* Next Page */}
        <Button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="px-2 sm:px-4 py-2 hover:bg-green-50 disabled:opacity-50 text-xs sm:text-sm">
          <span className="hidden sm:inline">Selanjutnya ›</span>
          <span className="sm:hidden">Next ›</span>
        </Button>

        {/* Last Page - Hidden on mobile */}
        <Button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="hidden sm:flex px-2 sm:px-3 py-2 hover:bg-green-50 disabled:opacity-50">
          ››
        </Button>
      </div>
    </div>
  );
};

export default AdminPagination;
