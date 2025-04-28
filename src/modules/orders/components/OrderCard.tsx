import React from "react";
import { Order } from "@/modules/orders/types/order";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getTypeInfo, getStatusInfo } from "../helpers/orderHelpers";
import {
  CalendarIcon,
  UserIcon,
  PhoneIcon,
  ClipboardIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

interface OrderCardProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onEdit, onDelete }) => {
  const typeInfo = getTypeInfo(order.type);
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 p-0 overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-blue-50 to-pink-50 border-b">
        <div className="flex items-center gap-3">
          <UserIcon className="w-6 h-6 text-blue-400" />
          <span className="font-bold text-lg text-gray-800 truncate">
            {order.customerName}
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}
        >
          <span>{statusInfo.emoji}</span>
          {statusInfo.label}
        </span>
      </div>
      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <PhoneIcon className="w-4 h-4" />
          <span>
            {order.phone ? (
              order.phone
            ) : (
              <span className="italic text-gray-400">
                Chưa có số điện thoại
              </span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <CalendarIcon className="w-4 h-4" />
          <span>
            {order.orderDate && order.orderDate.toDate ? (
              format(order.orderDate.toDate(), "dd/MM/yyyy", { locale: vi })
            ) : (
              <span className="italic text-gray-400">Chưa có ngày</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {typeInfo.icon}
          <span
            className={`px-2 py-1 rounded-full font-medium text-xs ${typeInfo.color}`}
          >
            {typeInfo.label ? (
              typeInfo.label
            ) : (
              <span className="italic text-gray-400">Chưa có loại set</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <ClipboardIcon className="w-4 h-4" />
          <span>
            Số lượng:{" "}
            <b className="text-gray-800">
              {order.quantity ? (
                order.quantity
              ) : (
                <span className="italic text-gray-400">Chưa có số lượng</span>
              )}
            </b>
          </span>
        </div>
        {order.note ? (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span>
              <span className="italic">{order.note}</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            <span className="italic">Chưa có ghi chú</span>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex gap-2 justify-end px-5 py-3 bg-gray-50 border-t">
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
