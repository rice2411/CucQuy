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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Order } from "@/modules/orders/types/order";

import { OrderType, OrderStatus } from "../enums/order";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
  getMonthOptions,
} from "../../../core/utils/date.util";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { getUnitPrice, getTotalPrice } from "../helpers/orderHelpers";

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
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const [exportMonthFrom, setExportMonthFrom] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [exportMonthTo, setExportMonthTo] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
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

  // Helper function để lấy danh sách tháng trong range
  const getMonthsInRange = (fromMonth: string, toMonth: string) => {
    const months: string[] = [];
    const [fromYear, fromMonthNum] = fromMonth.split("-").map(Number);
    const [toYear, toMonthNum] = toMonth.split("-").map(Number);
    
    let currentYear = fromYear;
    let currentMonth = fromMonthNum;
    
    while (
      currentYear < toYear ||
      (currentYear === toYear && currentMonth <= toMonthNum)
    ) {
      months.push(
        `${currentYear}-${String(currentMonth).padStart(2, "0")}`
      );
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
    
    return months;
  };

  // Hàm xuất Excel với range tháng
  const handleExportExcel = () => {
    try {
      // Lấy danh sách tháng trong range
      const months = getMonthsInRange(exportMonthFrom, exportMonthTo);
      
      // Lọc đơn hàng theo filter (type, status, searchTerm)
      let filteredOrders = [...allOrders];
      if (type !== "all") {
        filteredOrders = filteredOrders.filter((order) => order.type === type);
      }
      if (status !== "all") {
        filteredOrders = filteredOrders.filter((order) => order.status === status);
      }
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.customerName.toLowerCase().includes(searchLower) ||
            order.phone.includes(searchTerm)
        );
      }

      // Tạo workbook
      const wb = XLSX.utils.book_new();

      // Tạo sheet cho mỗi tháng
      months.forEach((monthStr) => {
        const [year, month] = monthStr.split("-").map(Number);
        const startDate = new Date(year, month - 1, 1, 0, 0, 0, 0);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        // Lọc đơn hàng theo tháng
        const monthOrders = filteredOrders.filter((order) => {
          const orderDate = order.orderDate.toDate();
          return orderDate >= startDate && orderDate <= endDate;
        });

        // Chuyển đổi dữ liệu sang dạng phù hợp cho Excel
        const data = monthOrders.map((order) => {
          const unitPrice = getUnitPrice(order.type, order.note);
          const totalPrice = getTotalPrice(order);
          return {
            "Tên khách hàng": order.customerName,
            "Số điện thoại": order.phone,
            "Ngày đặt": order.orderDate.toDate().toLocaleDateString("vi-VN"),
            "Loại set": order.type,
            "Số lượng": order.quantity,
            "Đơn giá": unitPrice !== null ? unitPrice : "",
            "Giá ship": order.shippingCost || 0,
            "Thành tiền": totalPrice !== null ? totalPrice : "",
            "Trạng thái": order.status,
            "Ghi chú": order.note || "",
            "Ngày tạo": order.createdAt.toDate().toLocaleDateString("vi-VN"),
          };
        });

        // Chỉ tạo sheet nếu có đơn hàng trong tháng
        if (data.length > 0) {
          // Tính tổng doanh thu của tháng
          const totalRevenue = monthOrders.reduce((sum, order) => {
            const totalPrice = getTotalPrice(order);
            return sum + (totalPrice !== null ? totalPrice : 0);
          }, 0);

          // Thêm dòng tổng vào cuối data
          const totalRow: any = {};
          Object.keys(data[0]).forEach((key) => {
            if (key === "Thành tiền") {
              totalRow[key] = totalRevenue;
            } else if (key === "Tên khách hàng") {
              totalRow[key] = "TỔNG DOANH THU";
            } else {
              totalRow[key] = "";
            }
          });
          data.push(totalRow);

          // Tạo worksheet
          const ws = XLSX.utils.json_to_sheet(data);
          
          // Đặt tên sheet (tối đa 31 ký tự, không được chứa: \ / ? * [ ])
          // Thay thế dấu / bằng dấu - để tránh lỗi
          const sheetName = `T${month}-${year}`.substring(0, 31);
          XLSX.utils.book_append_sheet(wb, ws, sheetName);
        }
      });

      // Xuất file
      const fileName = `doanh_thu_${exportMonthFrom}_den_${exportMonthTo}.xlsx`;
      const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, fileName);

      // Đóng dialog
      setIsExportDialogOpen(false);
    } catch (error) {
      console.error("Error exporting Excel:", error);
      alert("Có lỗi xảy ra khi xuất Excel!");
    }
  };

  return (
    <div className="flex flex-col gap-2 items-stretch mb-4 w-full sm:flex-row sm:items-end">
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
        onClick={() => setIsExportDialogOpen(true)}
        variant="primary"
        type="button"
        className="w-full sm:w-auto"
      >
        Xuất Excel
      </Button>

      {/* Dialog chọn range tháng để xuất Excel */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chọn khoảng tháng để xuất Excel</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exportMonthFrom">Từ tháng</Label>
              <Select
                value={exportMonthFrom}
                onValueChange={setExportMonthFrom}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng bắt đầu" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exportMonthTo">Đến tháng</Label>
              <Select value={exportMonthTo} onValueChange={setExportMonthTo}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tháng kết thúc" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExportDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleExportExcel}
              disabled={
                !exportMonthFrom ||
                !exportMonthTo ||
                (() => {
                  // So sánh tháng để đảm bảo từ tháng <= đến tháng
                  if (!exportMonthFrom || !exportMonthTo) return false;
                  const [fromYear, fromMonth] = exportMonthFrom.split("-").map(Number);
                  const [toYear, toMonth] = exportMonthTo.split("-").map(Number);
                  return fromYear > toYear || (fromYear === toYear && fromMonth > toMonth);
                })()
              }
            >
              Xuất Excel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTableToolbar;
