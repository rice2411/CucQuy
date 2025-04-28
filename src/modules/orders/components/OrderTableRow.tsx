import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/modules/orders/types/order";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { OrderType, OrderStatus } from "../enums/order";

interface OrderTableRowProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderTableRow: React.FC<OrderTableRowProps> = ({
  order,
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{order.phone}</TableCell>
      <TableCell>
        {format(order.orderDate.toDate(), "dd/MM/yyyy", { locale: vi })}
      </TableCell>
      <TableCell>
        {order.type === OrderType.Family
          ? "Gia đình"
          : order.type === OrderType.Friendship
          ? "Bạn bè"
          : "Quà tặng"}
      </TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>
        <span
          className={
            order.status === OrderStatus.Completed
              ? "bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs"
              : order.status === OrderStatus.Pending
              ? "bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs"
              : "bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
          }
        >
          {order.status === OrderStatus.Completed
            ? "Hoàn thành"
            : order.status === OrderStatus.Pending
            ? "Đang chờ"
            : "Đã hủy"}
        </span>
      </TableCell>
      <TableCell>{order.note || "-"}</TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <Button
            size="sm"
            variant="ghost"
            aria-label="Sửa"
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
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
