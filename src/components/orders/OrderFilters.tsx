import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface OrderFiltersProps {
  filters: {
    dateFrom: string;
    dateTo: string;
    type: string;
    searchTerm: string;
  };
  onFilterChange: (filters: {
    dateFrom: string;
    dateTo: string;
    type: string;
    searchTerm: string;
  }) => void;
  onSearch: () => void;
  onReset: () => void;
  isSearching: boolean;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
  isSearching,
}) => {
  return (
    <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="dateFrom">Từ ngày</Label>
          <Input
            id="dateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(e) =>
              onFilterChange({ ...filters, dateFrom: e.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dateTo">Đến ngày</Label>
          <Input
            id="dateTo"
            type="date"
            value={filters.dateTo}
            onChange={(e) =>
              onFilterChange({ ...filters, dateTo: e.target.value })
            }
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="type">Loại set</Label>
          <Select
            value={filters.type}
            onValueChange={(value) =>
              onFilterChange({ ...filters, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại set" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="family">Gia đình</SelectItem>
              <SelectItem value="friendship">Bạn bè</SelectItem>
              <SelectItem value="gift">Quà tặng</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <div className="relative">
            <Input
              id="search"
              value={filters.searchTerm}
              onChange={(e) =>
                onFilterChange({ ...filters, searchTerm: e.target.value })
              }
              placeholder="Tên hoặc số điện thoại"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onSearch}
                disabled={isSearching}
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onReset}
                disabled={isSearching}
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;
