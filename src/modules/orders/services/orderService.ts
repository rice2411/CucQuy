import { db } from "@/core/lib/firebase";
import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { Order, OrderFormData } from "../types/order";
import { OrderStatus } from "../enums/order";

export async function fetchOrders(): Promise<Order[]> {
  const ordersRef = collection(db, "orders");
  const baseQuery = query(
    ordersRef,
    orderBy("createdAt", "desc"),
    orderBy("orderDate", "desc"),
    orderBy("__name__", "desc")
  );
  const snapshot = await getDocs(baseQuery);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Order[];
}

export async function createOrder(formData: OrderFormData) {
  const orderDate = new Date(formData.orderDate);
  orderDate.setHours(7, 0, 0, 0);
  await addDoc(collection(db, "orders"), {
    ...formData,
    orderDate: orderDate,
    status: OrderStatus.Completed,
    createdAt: new Date(),
  });
}

export async function updateOrder(id: string, formData: OrderFormData) {
  const orderDate = new Date(formData.orderDate);
  orderDate.setHours(7, 0, 0, 0);
  const orderRef = doc(db, "orders", id);
  await updateDoc(orderRef, {
    customerName: formData.customerName,
    phone: formData.phone,
    orderDate: orderDate,
    type: formData.type,
    quantity: formData.quantity,
    note: formData.note,
    status: formData.status,
  });
}

export async function deleteOrder(id: string) {
  const orderRef = doc(db, "orders", id);
  await deleteDoc(orderRef);
}
