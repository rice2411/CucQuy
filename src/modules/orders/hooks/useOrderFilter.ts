import { useState, useEffect } from "react";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "../../../core/utils/date.util";
import { Order } from "@/modules/orders/types/order";

export function useOrderFilter(allOrders: Order[]) {
  // State filter
  const [filters, setFilters] = useState({
    dateFrom: getFirstDayOfMonth(),
    dateTo: getLastDayOfMonth(),
    type: "all",
    searchTerm: "",
  });
  const [orders, setOrders] = useState<Order[]>(allOrders);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let resultOrders = [...allOrders];
    // Lọc theo ngày
    if (filters.dateFrom && filters.dateTo) {
      const startDate = new Date(filters.dateFrom);
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
      resultOrders = resultOrders.filter((order) => {
        const orderDate = order.orderDate.toDate();
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    // Lọc theo loại set
    if (filters.type !== "all") {
      resultOrders = resultOrders.filter(
        (order) => order.type === filters.type
      );
    }
    // Tìm kiếm theo tên hoặc số điện thoại
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      resultOrders = resultOrders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.phone.includes(filters.searchTerm)
      );
    }
    setOrders(resultOrders);
    setCurrentPage(1);
  }, [allOrders, filters]);

  return {
    orders,
    filters,
    setFilters,
    currentPage,
    setCurrentPage,
    setOrders,
  };
}
