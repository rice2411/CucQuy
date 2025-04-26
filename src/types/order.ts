export interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderDate: {
    toDate: () => Date;
  };
  type: "family" | "friendship" | "gift";
  status: "completed" | "pending" | "cancelled";
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
  type: "family" | "friendship" | "gift";
  quantity: number;
  note: string;
  status?: "completed" | "pending" | "cancelled";
}
