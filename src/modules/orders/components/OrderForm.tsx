import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { OrderType, OrderStatus } from "../enums/order";
import { OrderFormData } from "@/modules/orders/types/order";
import { getToday } from "../../../core/utils/date.util";

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OrderFormData) => void;
  initialData?: OrderFormData;
  isSubmitting: boolean;
  title: string;
  submitText: string;
  isUpdate?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = {
    customerName: "",
    phone: "",
    orderDate: getToday(),
    type: OrderType.Family,
    quantity: 1,
    note: "",
    shippingCost: 0,
    status: OrderStatus.Pending,
  },
  isSubmitting,
  title,
  submitText,
  isUpdate = false,
}) => {
  const [formData, setFormData] = React.useState<OrderFormData>({
    ...initialData,
    orderDate: initialData.orderDate || getToday(),
  });

  React.useEffect(() => {
    setFormData({
      ...initialData,
      orderDate: initialData.orderDate || getToday(),
    });
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid =
    formData.customerName.trim() !== "" &&
    formData.orderDate &&
    formData.type &&
    formData.quantity > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="customerName">Tên khách hàng</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              placeholder="Nhập tên khách hàng"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Nhập số điện thoại"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="orderDate">Ngày đặt</Label>
            <Input
              id="orderDate"
              type="date"
              value={formData.orderDate}
              onChange={(e) =>
                setFormData({ ...formData, orderDate: e.target.value })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Loại set</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  type: value as OrderType,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại set" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderType.Family}>Gia đình</SelectItem>
                <SelectItem value={OrderType.Friendship}>Bạn bè</SelectItem>
                <SelectItem value={OrderType.Gift}>Quà tặng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isUpdate && (
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as OrderStatus,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={OrderStatus.Completed}>
                    Hoàn thành
                  </SelectItem>
                  <SelectItem value={OrderStatus.Pending}>
                    Đang xử lý
                  </SelectItem>
                  <SelectItem value={OrderStatus.Cancelled}>Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="quantity">Số lượng</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 1,
                })
              }
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Input
              id="note"
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="Nhập ghi chú (nếu có)"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="shippingCost">Giá ship (VNĐ)</Label>
            <Input
              id="shippingCost"
              type="number"
              min="0"
              value={formData.shippingCost || 0}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shippingCost: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="Nhập giá ship"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={isSubmitting || !isFormValid}>
              {isSubmitting ? "Đang xử lý..." : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OrderForm;
