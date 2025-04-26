import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Order } from "@/types/order";

interface OrderActionsProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex justify-end space-x-2">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onEdit(order)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onDelete(order)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default OrderActions;
