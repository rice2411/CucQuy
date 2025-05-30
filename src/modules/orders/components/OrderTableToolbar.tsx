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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  // Hàm xuất Excel
  const handleExportExcel = () => {
    // Lấy danh sách đơn hàng đang hiển thị (sau khi lọc)
    // allOrders là toàn bộ, còn orders đã lọc nằm ở cha, nên ta sẽ lọc lại theo filter hiện tại
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
    if (type !== "all") {
      resultOrders = resultOrders.filter((order) => order.type === type);
    }
    if (status !== "all") {
      resultOrders = resultOrders.filter((order) => order.status === status);
    }
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      resultOrders = resultOrders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.phone.includes(searchTerm)
      );
    }
    // Chuyển đổi dữ liệu sang dạng phù hợp cho Excel
    const data = resultOrders.map((order) => {
      let giaTien = "";
      if (order.type === OrderType.Friendship) giaTien = "22000";
      else if (order.type === OrderType.Family) giaTien = "35000";
      else if (order.type === OrderType.Gift) giaTien = order.note || "";
      return {
        "Tên khách hàng": order.customerName,
        "Số điện thoại": order.phone,
        "Ngày đặt": order.orderDate.toDate().toLocaleDateString(),
        "Loại set": order.type,
        "Số lượng": order.quantity,
        "Trạng thái": order.status,
        "Ghi chú": order.note || "",
        "Giá tiền": giaTien,
        "Ngày tạo": order.createdAt.toDate().toLocaleDateString(),
      };
    });
    // Tạo worksheet và workbook
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DoanhThu");
    // Xuất file
    const now = new Date();
    const fileName = `doanh_thu_${now.getFullYear()}_${
      now.getMonth() + 1
    }_${now.getDate()}.xlsx`;
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
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
      {/* Nút Xuất Excel */}
      <Button
        onClick={handleExportExcel}
        variant="primary"
        type="button"
        className="w-full sm:w-auto"
      >
        Xuất Excel
      </Button>
    </div>
  );
};

export default OrderTableToolbar;
