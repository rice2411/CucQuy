"use client";
import React, { useState, useEffect } from "react";

import { format } from "date-fns";
import { PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrderPagination from "./OrderPagination";
import OrderModal from "./OrderModal";
import OrderForm from "./OrderForm";
import { Order, OrderFormData } from "@/modules/orders/types/order";
import { Table, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import OrderTableToolbar from "./OrderTableToolbar";
import OrderTableBody from "./OrderTableBody";
import {
  fetchOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/orderService";
import OrderCard from "./OrderCard";
import { notifyTelegram } from "@/core/services/telegramService";
import { buildOrderTelegramMessage } from "@/core/utils/orderTelegramTemplate";
import { OrderType, OrderStatus } from "../enums/order";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

/**
 * Hiển thị bảng danh sách đơn hàng với các thao tác CRUD, filter, phân trang.
 * UI tuân thủ chuẩn component-ui, sử dụng các component từ src/components/ui.
 */
const OrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const itemsPerPage = 20;

  const [newOrder, setNewOrder] = useState<OrderFormData>({
    customerName: "",
    phone: "",
    orderDate: "",
    type: OrderType.Family,
    quantity: 1,
    note: "",
  });

  // Thêm state cho form cập nhật
  const [updateFormData, setUpdateFormData] = useState<OrderFormData>({
    customerName: "",
    phone: "",
    orderDate: "",
    type: OrderType.Family,
    quantity: 1,
    note: "",
    status: OrderStatus.Completed,
  });

  const [loading, setLoading] = useState(true);

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

  const isMobile = useIsMobile();

  useEffect(() => {
    setLoading(true);
    fetchOrders()
      .then((fetchedOrders) => {
        setAllOrders(fetchedOrders);
        setOrders(fetchedOrders);
        setCurrentPage(1);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => setLoading(false));
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateOrder = async (formData: OrderFormData) => {
    try {
      setIsCreating(true);
      await createOrder(formData);
      await notifyTelegram(buildOrderTelegramMessage(formData, "create"));
      toast.success("Tạo đơn hàng thành công!");
      setIsOpen(false);
      setNewOrder({
        customerName: "",
        phone: "",
        orderDate: "",
        type: OrderType.Family,
        quantity: 1,
        note: "",
      });
      // Refetch orders
      const fetchedOrders = await fetchOrders();
      setAllOrders(fetchedOrders);
      setOrders(fetchedOrders);
      setCurrentPage(1);
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
      await updateOrder(selectedOrder.id, formData);
      await notifyTelegram(buildOrderTelegramMessage(formData, "update"));
      // Refetch orders
      const fetchedOrders = await fetchOrders();
      setAllOrders(fetchedOrders);
      setOrders(fetchedOrders);
      setCurrentPage(1);
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

  const handleDeleteOrder = async () => {
    if (!selectedOrder) return;
    try {
      setIsDeleting(true);
      await deleteOrder(selectedOrder.id);
      await notifyTelegram(buildOrderTelegramMessage(selectedOrder, "delete"));
      // Refetch orders
      const fetchedOrders = await fetchOrders();
      setAllOrders(fetchedOrders);
      setOrders(fetchedOrders);
      setCurrentPage(1);
      toast.success("Xóa đơn hàng thành công!");
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Có lỗi xảy ra khi xóa đơn hàng!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Tính toán pagination
  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = orders.slice(startIndex, endIndex);

  // UI Table/Card
  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Danh sách đơn hàng
        </h2>
        <Button
          variant="primary"
          size="lg"
          onClick={() => setIsOpen(true)}
          iconPosition="left"
          icon={undefined}
        >
          <PlusIcon className="w-5 h-5" /> Thêm đơn hàng
        </Button>
      </div>
      <OrderTableToolbar
        filters={filters}
        onFiltersChange={setFilters}
        allOrders={allOrders}
        setOrders={setOrders}
        setCurrentPage={setCurrentPage}
      />
      {/* Card view cho mobile, Table view cho desktop/tablet */}
      {isMobile ? (
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">Không có đơn hàng nào.</div>
          ) : (
            currentOrders.map((order) => (
              <OrderCard
                key={order.id}
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
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm border border-[#E4E4EB] overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Loại set</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <OrderTableBody
              orders={orders}
              loading={loading}
              currentOrders={currentOrders}
              onEdit={(order) => {
                setSelectedOrder(order);
                setIsEditModalOpen(true);
              }}
              onDelete={(order) => {
                setSelectedOrder(order);
                setIsDeleteModalOpen(true);
              }}
            />
          </Table>
        </div>
      )}
      <OrderPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={orders.length}
        itemsPerPage={itemsPerPage}
        loading={loading}
      />
      <OrderForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateOrder}
        initialData={newOrder}
        isSubmitting={isCreating}
        title="Tạo đơn hàng mới"
        submitText="Tạo đơn hàng"
      />
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
        confirmText={isDeleting ? "Đang xử lý..." : "Xóa"}
        cancelText="Hủy"
      />
    </div>
  );
};

export default OrderTable;
