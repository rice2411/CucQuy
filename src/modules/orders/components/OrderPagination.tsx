import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  loading?: boolean;
}

const getPageNumbers = (current: number, total: number) => {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current > 3) pages.push(1);
  if (current > 4) pages.push("...");
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 3) pages.push("...");
  if (current < total - 2) pages.push(total);
  return pages;
};

const OrderPagination: React.FC<OrderPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  loading = false,
}) => {
  // Tính chỉ số bản ghi đang hiển thị
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems || 0);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 gap-2">
      {/* Thông tin tổng số bản ghi */}
      <div className="text-sm text-gray-700 mb-2 md:mb-0">
        {totalItems !== undefined && totalItems > 0 ? (
          <span>
            Hiển thị{" "}
            <span className="font-medium">
              {start}-{end}
            </span>{" "}
            trên tổng <span className="font-medium">{totalItems}</span> đơn hàng
          </span>
        ) : (
          <span>Không có dữ liệu</span>
        )}
      </div>
      {/* Phân trang cho mobile */}
      <div className="flex-1 flex justify-between md:hidden w-full">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          aria-label="Trang trước"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" /> Trang trước
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          aria-label="Trang sau"
        >
          Trang sau <ChevronRightIcon className="w-5 h-5 ml-1" />
        </button>
      </div>
      {/* Phân trang cho desktop */}
      <div className="hidden md:flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          aria-label="Trang trước"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 py-2 text-gray-400">
              <EllipsisHorizontalIcon className="w-4 h-4" />
            </span>
          ) : (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              disabled={loading}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 ${
                currentPage === page
                  ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          aria-label="Trang sau"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default OrderPagination;
