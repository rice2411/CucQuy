import React from "react";
import { OrderType, OrderStatus } from "../enums/order";
import { UserIcon, GiftIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { Order } from "../types/order";

export const getTypeInfo = (type: OrderType) => {
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

export const getStatusInfo = (status: OrderStatus) => {
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

/**
 * Tính đơn giá dựa vào loại set
 * @param type - Loại set
 * @param note - Ghi chú (dùng cho Gift để lấy giá)
 * @returns Đơn giá (number) hoặc null nếu không xác định được
 */
export const getUnitPrice = (
  type: OrderType,
  note?: string
): number | null => {
  switch (type) {
    case OrderType.Friendship:
      return 22000;
    case OrderType.Family:
      return 35000;
    case OrderType.Gift:
      // Lấy giá từ note, nếu note là số thì parse, không thì trả về null
      if (note) {
        const price = parseFloat(note.replace(/[^\d.]/g, ""));
        return isNaN(price) ? null : price;
      }
      return null;
    default:
      return null;
  }
};

/**
 * Tính thành tiền = (đơn giá * số lượng) + giá ship
 * @param order - Đơn hàng
 * @returns Thành tiền (number) hoặc null nếu không tính được
 */
export const getTotalPrice = (order: Order): number | null => {
  const unitPrice = getUnitPrice(order.type, order.note);
  if (unitPrice === null) return null;
  const quantity = order.quantity || 0;
  const shippingCost = order.shippingCost || 0;
  return unitPrice * quantity + shippingCost;
};
