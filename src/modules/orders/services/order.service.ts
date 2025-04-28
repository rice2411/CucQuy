import { FirestoreService } from "@/core/services/firesotre.service";
import { Order, OrderFormData } from "../types/order";
import {
  ISuccessResponse,
  IErrorResponse,
} from "@/core/types/api/response.interface";
import { OrderStatus } from "../enums/order";
import { Timestamp } from "firebase/firestore";

const COLLECTION = "orders";

export class OrderService {
  static async fetchOrders(): Promise<
    ISuccessResponse<Order[]> | IErrorResponse
  > {
    // Có thể truyền thêm options nếu muốn sort, limit, ...
    return await FirestoreService.readDocuments<Order>(COLLECTION, [], {});
  }

  static async createOrder(
    formData: OrderFormData
  ): Promise<ISuccessResponse<Order | Partial<Order>> | IErrorResponse> {
    return await FirestoreService.createOrUpdateDocument<Partial<Order>>(
      COLLECTION,
      {
        customerName: formData.customerName,
        phone: formData.phone,
        orderDate: Timestamp.fromDate(new Date(formData.orderDate)),
        type: formData.type,
        quantity: formData.quantity,
        note: formData.note,
        status: formData.status ?? OrderStatus.Completed,
        createdAt: Timestamp.fromDate(new Date()),
      }
    );
  }

  static async updateOrder(
    id: string,
    formData: OrderFormData
  ): Promise<ISuccessResponse<Order> | IErrorResponse> {
    return await FirestoreService.createOrUpdateDocument<Order>(COLLECTION, {
      id,
      customerName: formData.customerName,
      phone: formData.phone,
      orderDate: Timestamp.fromDate(new Date(formData.orderDate)),
      type: formData.type,
      quantity: formData.quantity,
      note: formData.note,
      status: formData.status ?? OrderStatus.Completed,
      createdAt: (formData as any).createdAt
        ? (formData as any).createdAt
        : Timestamp.fromDate(new Date()),
    });
  }

  static async deleteOrder(
    id: string
  ): Promise<ISuccessResponse<null> | IErrorResponse> {
    return await FirestoreService.deleteDocument(COLLECTION, id);
  }
}
