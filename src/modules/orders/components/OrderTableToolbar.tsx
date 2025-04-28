import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Order } from "@/modules/orders/types/order";

import { OrderType, OrderStatus } from "../enums/order";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getMonthOptions,
} from "../../../core/utils/date.util";

interface OrderTableToolbarProps {
  filters: {
    dateFrom: string;
    dateTo: string;
    type: string;
    searchTerm: string;
  };
  onFiltersChange: (filters: any) => void;
  allOrders: Order[];
  setOrders: (orders: Order[]) => void;
  setCurrentPage: (page: number) => void;
}

const monthOptions = getMonthOptions(new Date(2025, 2, 1), new Date());

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: OrderStatus.Completed, label: "Hoàn thành" },
  { value: OrderStatus.Pending, label: "Đang xử lý" },
  { value: OrderStatus.Cancelled, label: "Đã hủy" },
];

const OrderTableToolbar: React.FC<OrderTableToolbarProps> = ({
  filters,
  onFiltersChange,
  allOrders,
  setOrders,
  setCurrentPage,
}) => {
  const [status, setStatus] = React.useState("all");
  const [type, setType] = React.useState(filters.type);
  const [searchTerm, setSearchTerm] = React.useState(filters.searchTerm);
  const [selectedMonth, setSelectedMonth] = React.useState(() => {
    if (filters.dateFrom && filters.dateTo) {
      const d = new Date(filters.dateFrom);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Hàm lọc dữ liệu (tự động gọi khi thay đổi trường)
  React.useEffect(() => {
    let resultOrders = [...allOrders];
    // Lọc theo tháng
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);
      const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      resultOrders = resultOrders.filter((order) => {
        const orderDate = order.orderDate.toDate();
        return orderDate >= startDate && orderDate <= endDate;
      });
    }
    // Lọc theo loại set
    if (type !== "all") {
      resultOrders = resultOrders.filter((order) => order.type === type);
    }
    // Lọc theo trạng thái
    if (status !== "all") {
      resultOrders = resultOrders.filter((order) => order.status === status);
    }
    // Tìm kiếm theo tên hoặc số điện thoại
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      resultOrders = resultOrders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.phone.includes(searchTerm)
      );
    }
    setOrders(resultOrders);
    setCurrentPage(1);
    // Cập nhật filters cho cha
    const [year, month] = selectedMonth.split("-").map(Number);
    onFiltersChange({
      ...filters,
      searchTerm,
      type,
      dateFrom: getFirstDayOfMonth(year, month - 1),
      dateTo: getLastDayOfMonth(year, month - 1),
    });
  }, [searchTerm, type, status, selectedMonth]);

  // Hàm reset filter
  const handleReset = () => {
    const now = new Date();
    const resetMonth = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    const resetFilters = {
      ...filters,
      searchTerm: "",
      type: "all",
      dateFrom: getFirstDayOfMonth(now.getFullYear(), now.getMonth()),
      dateTo: getLastDayOfMonth(now.getFullYear(), now.getMonth()),
    };
    onFiltersChange(resetFilters);
    setOrders(allOrders);
    setCurrentPage(1);
    setStatus("all");
    setType("all");
    setSearchTerm("");
    setSelectedMonth(resetMonth);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 mb-4 w-full">
      {/* Tìm kiếm */}
      <Input
        placeholder="Nhập tên hoặc số điện thoại..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-[220px]"
      />
      {/* Tháng */}
      <Select value={selectedMonth} onValueChange={(v) => setSelectedMonth(v)}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Chọn tháng" />
        </SelectTrigger>
        <SelectContent>
          {monthOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Loại set */}
      <Select value={type} onValueChange={(v) => setType(v)}>
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="Loại set" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả</SelectItem>
          <SelectItem value={OrderType.Family}>Gia đình</SelectItem>
          <SelectItem value={OrderType.Friendship}>Bạn bè</SelectItem>
          <SelectItem value={OrderType.Gift}>Quà tặng</SelectItem>
        </SelectContent>
      </Select>
      {/* Trạng thái */}
      <Select value={status} onValueChange={(v) => setStatus(v)}>
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Nút Đặt lại */}
      <Button
        onClick={handleReset}
        variant="outline"
        type="button"
        className="w-full sm:w-auto"
      >
        Đặt lại
      </Button>
    </div>
  );
};

export default OrderTableToolbar;
