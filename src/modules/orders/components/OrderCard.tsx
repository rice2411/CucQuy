import React from "react";
import { Order } from "@/modules/orders/types/order";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderType, OrderStatus } from "../enums/order";
import {
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  GiftIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const getTypeInfo = (type: OrderType) => {
  switch (type) {
    case OrderType.Family:
      return {
        label: "Gia đình",
        color: "bg-blue-100 text-blue-700",
        icon: <UserIcon className="w-4 h-4 mr-1" />,
      };
    case OrderType.Friendship:
      return {
        label: "Bạn bè",
        color: "bg-green-100 text-green-700",
        icon: <GiftIcon className="w-4 h-4 mr-1" />,
      };
    case OrderType.Gift:
    default:
      return {
        label: "Quà tặng",
        color: "bg-pink-100 text-pink-700",
        icon: <ClipboardIcon className="w-4 h-4 mr-1" />,
      };
  }
};

const getStatusInfo = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.Completed:
      return {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800",
        emoji: "🟢",
      };
    case OrderStatus.Pending:
      return {
        label: "Đang chờ",
        color: "bg-yellow-100 text-yellow-800",
        emoji: "🟡",
      };
    case OrderStatus.Cancelled:
    default:
      return { label: "Đã hủy", color: "bg-red-100 text-red-800", emoji: "🔴" };
  }
};

const OrderCard: React.FC<OrderCardProps> = ({ order, onEdit, onDelete }) => {
  const typeInfo = getTypeInfo(order.type);
  const statusInfo = getStatusInfo(order.status);
  return (
    <div className="rounded-xl border border-[#E4E4EB] bg-white p-4 shadow-md flex flex-col gap-3 relative">
      {/* Trạng thái nổi bật */}
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}
        >
          <span>{statusInfo.emoji}</span>
          {statusInfo.label}
        </span>
      </div>
      {/* Thông tin khách hàng */}
      <div className="flex items-center gap-2 mb-1">
        <UserIcon className="w-5 h-5 text-gray-400" />
        <span className="font-semibold text-base text-[#40404D] truncate">
          {order.customerName}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-[#6E6E85]">
        <PhoneIcon className="w-4 h-4 text-gray-400" />
        <span>{order.phone}</span>
      </div>
      {/* Ngày đặt và loại set */}
      <div className="flex items-center gap-2 text-sm text-[#6E6E85]">
        <CalendarIcon className="w-4 h-4 text-gray-400" />
        <span>
          {format(order.orderDate.toDate(), "dd/MM/yyyy", { locale: vi })}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        {typeInfo.icon}
        <span
          className={`px-2 py-1 rounded-full font-medium text-xs ${typeInfo.color}`}
        >
          {typeInfo.label}
        </span>
      </div>
      {/* Số lượng và ghi chú */}
      <div className="flex items-center gap-2 text-sm text-[#6E6E85]">
        <ClipboardIcon className="w-4 h-4 text-gray-400" />
        <span>
          Số lượng: <b className="text-[#40404D]">{order.quantity}</b>
        </span>
      </div>
      {order.note && (
        <div className="flex items-center gap-2 text-sm text-[#6E6E85]">
          <span className="inline-block w-4 h-4" />
          <span>
            Ghi chú: <span className="italic text-gray-500">{order.note}</span>
          </span>
        </div>
      )}
      {/* Nút thao tác */}
      <div className="flex gap-2 justify-end mt-2">
        <Button
          size="sm"
          variant="outline"
          aria-label="Sửa"
          className="border-blue-500 text-blue-600 hover:bg-blue-50"
          onClick={() => onEdit(order)}
        >
          Sửa
        </Button>
        <Button
          size="sm"
          variant="destructive"
          aria-label="Xóa"
          onClick={() => onDelete(order)}
        >
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
