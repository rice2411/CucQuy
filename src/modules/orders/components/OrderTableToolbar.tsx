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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { OrderType, OrderStatus } from "../enums/order";

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

// Hàm tiện ích cho filter
const getFirstDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1, 7, 0, 0)
    .toISOString()
    .split("T")[0];
};
const getLastDayOfMonth = () => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 7, 0, 0)
    .toISOString()
    .split("T")[0];
};

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
  const [enableDateFilter, setEnableDateFilter] = React.useState(false);
  const [status, setStatus] = React.useState("all");
  const [type, setType] = React.useState(filters.type);
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState(filters.searchTerm);

  // Xác định có filter nào đang bật không
  const isFilterOn =
    enableDateFilter || type !== "all" || status !== "all" || searchTerm !== "";

  // Hàm lọc dữ liệu
  const handleSearch = () => {
    let resultOrders = [...allOrders];
    // Lọc theo ngày nếu enableDateFilter bật
    if (enableDateFilter && filters.dateFrom && filters.dateTo) {
      const startDate = new Date(filters.dateFrom);
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);
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
    onFiltersChange({
      ...filters,
      searchTerm,
      type,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    });
    setOpen(false);
  };

  // Hàm reset filter
  const handleReset = () => {
    const resetFilters = {
      ...filters,
      searchTerm: "",
      type: "all",
      dateFrom: getFirstDayOfMonth(),
      dateTo: getLastDayOfMonth(),
    };
    onFiltersChange(resetFilters);
    setOrders(allOrders);
    setCurrentPage(1);
    setEnableDateFilter(false);
    setStatus("all");
    setType("all");
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <div className="flex flex-row items-end gap-2 mb-4 w-full">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className={`flex items-center gap-2 border-2 transition-colors ${
              isFilterOn
                ? "border-[var(--primary)] text-[var(--primary)]"
                : "border-gray-200 text-gray-700"
            }`}
          >
            <FunnelIcon
              className={`w-4 h-4 transition-colors ${
                isFilterOn ? "text-[var(--primary)]" : "text-gray-400"
              }`}
            />{" "}
            Bộ lọc
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Bộ lọc </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Search text */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1">
                Tìm kiếm tên hoặc số điện thoại
              </Label>
              <Input
                placeholder="Nhập tên hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            {/* Lọc theo ngày */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={enableDateFilter}
                  onCheckedChange={setEnableDateFilter}
                  id="enable-date-filter"
                />
                <Label htmlFor="enable-date-filter" className="text-xs">
                  Lọc theo ngày
                </Label>
              </div>
              {enableDateFilter && (
                <div className="flex gap-2 w-full">
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, dateFrom: e.target.value })
                    }
                    className="w-full"
                    placeholder="Từ ngày"
                  />
                  <span className="text-gray-400 self-center">-</span>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, dateTo: e.target.value })
                    }
                    className="w-full"
                    placeholder="Đến ngày"
                  />
                </div>
              )}
            </div>
            {/* Lọc theo loại set */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1">Loại set</Label>
              <Select value={type} onValueChange={(v) => setType(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Loại set" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={OrderType.Family}>Gia đình</SelectItem>
                  <SelectItem value={OrderType.Friendship}>Bạn bè</SelectItem>
                  <SelectItem value={OrderType.Gift}>Quà tặng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Lọc theo trạng thái */}
            <div className="flex flex-col gap-1">
              <Label className="text-xs mb-1">Trạng thái</Label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger className="w-full">
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
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button onClick={handleSearch} variant="primary">
              Tìm kiếm
            </Button>
            <DialogClose asChild>
              <Button onClick={handleReset} variant="outline" type="button">
                Đặt lại
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderTableToolbar;
