import React from "react";
import { Button } from "../ui/button";

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
    <div className={`flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t ${className}`}>
      {/* Items Info */}
      <div className="text-sm text-gray-600 mb-4 sm:mb-0">
        Menampilkan{" "}
        <span className="font-semibold">{startIndex + 1}</span> sampai{" "}
        <span className="font-semibold">{endIndex}</span> dari{" "}
        <span className="font-semibold">{totalItems.toLocaleString()}</span>{" "}
        hasil
      </div>

      <div className="flex items-center space-x-4">
        {/* Items per page selector */}
        {showItemsPerPage && onItemsPerPageChange && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Tampilkan:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="border border-gray-200 rounded px-2 py-1 text-sm bg-white"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">entri per halaman</span>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* First Page */}
          <Button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="px-3 py-2"
          >
            ‹‹
          </Button>

          {/* Previous Page */}
          <Button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="px-4 py-2"
          >
            ‹ Sebelumnya
          </Button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages().map((pageNum) => (
              <Button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className={`px-4 py-2 ${
                  currentPage === pageNum
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </Button>
            ))}
          </div>

          {/* Mobile: Current page indicator */}
          <div className="sm:hidden px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
            {currentPage} / {totalPages}
          </div>

          {/* Next Page */}
          <Button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="px-4 py-2"
          >
            Selanjutnya ›
          </Button>

          {/* Last Page */}
          <Button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="px-3 py-2"
          >
            ››
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPagination;
