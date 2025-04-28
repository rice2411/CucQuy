import React from "react";
import { TableBody, TableRow, TableCell } from "@/components/ui/table";
import { Order } from "@/modules/orders/types/order";
import OrderTableRow from "./OrderTableRow";

interface OrderTableBodyProps {
  orders: Order[];
  loading: boolean;
  currentOrders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderTableBody: React.FC<OrderTableBodyProps> = ({
  orders,
  loading,
  currentOrders,
  onEdit,
  onDelete,
}) => {
  return (
    <TableBody>
      {loading ? (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8">
            Đang tải dữ liệu...
          </TableCell>
        </TableRow>
      ) : orders.length === 0 ? (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8">
            Không có đơn hàng nào.
          </TableCell>
        </TableRow>
      ) : (
        currentOrders.map((order) => (
          <OrderTableRow
            key={order.id}
            order={order}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </TableBody>
  );
};

export default OrderTableBody;
