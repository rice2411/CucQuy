import { OrderType, OrderStatus } from "../enums/order";

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderDate: {
    toDate: () => Date;
  };
  type: OrderType;
  status: OrderStatus;
  quantity: number;
  note?: string;
  createdAt: {
    toDate: () => Date;
  };
}

export interface OrderFormData {
  customerName: string;
  phone: string;
  orderDate: string;
  type: OrderType;
  quantity: number;
  note: string;
  status?: OrderStatus;
}
