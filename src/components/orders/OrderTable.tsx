"use client";
import React, { useState, useEffect } from "react";
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
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderActions from "./OrderActions";
import OrderFilters from "./OrderFilters";
import OrderPagination from "./OrderPagination";
import OrderModal from "./OrderModal";
import OrderForm from "./OrderForm";
import { Order, OrderFormData } from "@/types/order";

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const itemsPerPage = 10;

  const [newOrder, setNewOrder] = useState<OrderFormData>({
    customerName: "",
    phone: "",
    orderDate: "",
    type: "family",
    quantity: 1,
    note: "",
  });

  // Thêm state cho form cập nhật
  const [updateFormData, setUpdateFormData] = useState<OrderFormData>({
    customerName: "",
    phone: "",
    orderDate: "",
    type: "family",
    quantity: 1,
    note: "",
    status: "completed",
  });

  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1, 7, 0, 0)
      .toISOString()
      .split("T")[0];
  };

  const getLastDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0, 7, 0, 0)
      .toISOString()
      .split("T")[0];
  };

  const [filters, setFilters] = useState({
    dateFrom: getFirstDayOfMonth(),
    dateTo: getLastDayOfMonth(),
    type: "all",
    searchTerm: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật updateFormData khi selectedOrder thay đổi
  useEffect(() => {
    if (selectedOrder) {
      const orderDate = selectedOrder.orderDate.toDate();
      setUpdateFormData({
        customerName: selectedOrder.customerName,
        phone: selectedOrder.phone,
        orderDate: format(orderDate, "yyyy-MM-dd"),
        type: selectedOrder.type,
        quantity: selectedOrder.quantity,
        note: selectedOrder.note || "",
        status: selectedOrder.status,
      });
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, "orders");

      const baseQuery = query(
        ordersRef,
        orderBy("createdAt", "desc"),
        orderBy("orderDate", "desc"),
        orderBy("__name__", "desc")
      );

      const snapshot = await getDocs(baseQuery);
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setAllOrders(fetchedOrders);
      setOrders(fetchedOrders);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    let resultOrders = [...allOrders];
    // Lọc theo ngày
    if (filters.dateFrom && filters.dateTo) {
      const startDate = new Date(filters.dateFrom);
      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999); // Đặt thời gian cuối ngày

      resultOrders = resultOrders.filter((order) => {
        const orderDate = order.orderDate.toDate();
        return orderDate >= startDate && orderDate <= endDate;
      });
    }

    // Lọc theo loại set
    if (filters.type !== "all") {
      resultOrders = resultOrders.filter(
        (order) => order.type === filters.type
      );
    }

    // Tìm kiếm theo tên hoặc số điện thoại
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      resultOrders = resultOrders.filter(
        (order) =>
          order.customerName.toLowerCase().includes(searchLower) ||
          order.phone.includes(filters.searchTerm)
      );
    }

    setOrders(resultOrders);
    setCurrentPage(1);
    toast.success(`Tìm thấy ${resultOrders.length} kết quả`);
    setIsSearching(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateOrder = async (formData: OrderFormData) => {
    try {
      setIsCreating(true);

      // Chuyển đổi ngày tháng từ string sang Date object
      const orderDate = new Date(formData.orderDate);
      orderDate.setHours(7, 0, 0, 0); // Đặt giờ về 7:00 AM

      await addDoc(collection(db, "orders"), {
        ...formData,
        orderDate: orderDate,
        status: "completed",
        createdAt: new Date(),
      });

      // Gửi email
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderDetails: {
            ...formData,
            orderDate: format(orderDate, "dd/MM/yyyy"),
          },
        }),
      });

      toast.success("Tạo đơn hàng thành công!");
      setIsOpen(false);
      setNewOrder({
        customerName: "",
        phone: "",
        orderDate: "",
        type: "family",
        quantity: 1,
        note: "",
      });
      fetchOrders();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    } finally {
      setIsCreating(false);
    }
  };

  // Thêm hàm xử lý cập nhật đơn hàng
  const handleUpdateOrder = async (formData: OrderFormData) => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);

      // Chuyển đổi ngày tháng từ string sang Date object
      const orderDate = new Date(formData.orderDate);
      orderDate.setHours(7, 0, 0, 0); // Đặt giờ về 7:00 AM

      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        customerName: formData.customerName,
        phone: formData.phone,
        orderDate: orderDate,
        type: formData.type,
        quantity: formData.quantity,
        note: formData.note,
        status: formData.status,
      });

      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                customerName: formData.customerName,
                phone: formData.phone,
                orderDate: {
                  toDate: () => orderDate,
                },
                type: formData.type,
                quantity: formData.quantity,
                note: formData.note,
                status: formData.status as
                  | "completed"
                  | "pending"
                  | "cancelled",
              }
            : order
        )
      );

      toast.success("Cập nhật đơn hàng thành công!");
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Có lỗi xảy ra khi cập nhật đơn hàng!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);
      const orderRef = doc(db, "orders", selectedOrder.id);
      await updateDoc(orderRef, {
        status: selectedOrder.status,
      });

      setOrders(
        orders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: selectedOrder.status }
            : order
        )
      );

      toast.success("Cập nhật trạng thái đơn hàng thành công!");
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái đơn hàng!");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      const orderRef = doc(db, "orders", selectedOrder.id);
      await deleteDoc(orderRef);

      setOrders(orders.filter((order) => order.id !== selectedOrder.id));
      toast.success("Xóa đơn hàng thành công!");
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Có lỗi xảy ra khi xóa đơn hàng!");
    }
  };

  // Tính toán pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  return (
    <div className="">
      <div className="  ">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Danh sách đơn hàng
          </h3>
          <button
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Thêm đơn hàng
          </button>
        </div>
      </div>

      <OrderFilters
        filters={filters}
        onFilterChange={setFilters}
        onSearch={handleSearch}
        isSearching={isSearching}
        onReset={() => {
          setFilters({
            dateFrom: getFirstDayOfMonth(),
            dateTo: getLastDayOfMonth(),
            type: "all",
            searchTerm: "",
          });
          handleSearch();
        }}
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày đặt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại set
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số lượng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.customerName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(order.orderDate.toDate(), "dd/MM/yyyy", {
                    locale: vi,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.type === "family"
                    ? "Gia đình"
                    : order.type === "friendship"
                    ? "Bạn bè"
                    : "Quà tặng"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.note || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <OrderActions
                    order={order}
                    onEdit={(order) => {
                      setSelectedOrder(order);
                      setIsEditModalOpen(true);
                    }}
                    onDelete={(order) => {
                      setSelectedOrder(order);
                      setIsDeleteModalOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Form tạo đơn hàng mới */}
      <OrderForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateOrder}
        initialData={newOrder}
        isSubmitting={isCreating}
        title="Tạo đơn hàng mới"
        submitText="Tạo đơn hàng"
      />

      {/* Form cập nhật đơn hàng */}
      <OrderForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }}
        onSubmit={handleUpdateOrder}
        initialData={updateFormData}
        isSubmitting={isUpdating}
        title="Cập nhật đơn hàng"
        submitText="Cập nhật"
        isUpdate={true}
      />

      {/* Modal xác nhận xóa */}
      <OrderModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onConfirm={handleDeleteOrder}
        title="Xác nhận xóa đơn hàng"
        message="Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />

      <ToastContainer position="bottom-right" />
    </div>
  );
}
