import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Order } from "@/modules/orders/types/order";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getTypeInfo, getStatusInfo } from "../helpers/orderHelpers";

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
  const typeInfo = getTypeInfo(order.type);
  const statusInfo = getStatusInfo(order.status);
  return (
    <TableRow>
      <TableCell>{order.customerName}</TableCell>
      <TableCell>{order.phone}</TableCell>
      <TableCell>
        {format(order.orderDate.toDate(), "dd/MM/yyyy", { locale: vi })}
      </TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 w-fit  rounded-full font-medium text-xs ${typeInfo.color} flex items-center gap-1`}
        >
          {typeInfo.icon}
          {typeInfo.label}
        </span>
      </TableCell>
      <TableCell>{order.quantity}</TableCell>
      <TableCell>
        <span
          className={`px-2 py-1 w-fit  rounded-full text-xs font-semibold flex items-center gap-1 ${statusInfo.color}`}
        >
          <span>{statusInfo.emoji}</span>
          {statusInfo.label}
        </span>
      </TableCell>
      <TableCell>{order.note || "-"}</TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
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
      </TableCell>
    </TableRow>
  );
};

export default OrderTableRow;
