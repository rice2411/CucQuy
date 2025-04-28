import React from "react";
import { OrderType, OrderStatus } from "../enums/order";
import { UserIcon, GiftIcon, ClipboardIcon } from "@heroicons/react/24/outline";

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
