"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { vi } from "date-fns/locale/vi";
import { Dialog } from "@headlessui/react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Order {
  id: string;
  customerName: string;
  phone: string;
  orderDate: {
    toDate: () => Date;
  };
  type: "family" | "friendship";
  status: "completed" | "pending" | "cancelled";
  note?: string;
  createdAt: {
    toDate: () => Date;
  };
}

export default function OrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const itemsPerPage = 10;

  const [newOrder, setNewOrder] = useState<{
    customerName: string;
    phone: string;
    orderDate: string;
    type: "family" | "friendship";
    note: string;
  }>({
    customerName: "",
    phone: "",
    orderDate: "",
    type: "family",
    note: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, "orders");

      const baseQuery = query(
        ordersRef,
        orderBy("createdAt", "desc"),
        orderBy("orderDate", "desc"),
        orderBy("__name__", "desc"),
        limit(itemsPerPage)
      );

      const snapshot = await getDocs(baseQuery);
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      setAllOrders(fetchedOrders);
      setOrders(fetchedOrders);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === itemsPerPage);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    let resultOrders = [...allOrders];

    // Lọc theo ngày
    if (filters.dateFrom && filters.dateTo) {
      const startDate = new Date(filters.dateFrom);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(filters.dateTo);
      endDate.setHours(23, 59, 59, 999);

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

  const loadMore = async () => {
    if (!lastVisible || !hasMore) return;

    try {
      setLoading(true);
      const ordersRef = collection(db, "orders");
      const nextQuery = query(
        ordersRef,
        orderBy("createdAt", "desc"),
        orderBy("orderDate", "desc"),
        orderBy("__name__", "desc"),
        startAfter(lastVisible),
        limit(itemsPerPage)
      );

      const snapshot = await getDocs(nextQuery);
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Order[];

      // Lọc dữ liệu ở phía client
      let filteredOrders = fetchedOrders;

      // Lọc theo ngày
      if (filters.dateFrom && filters.dateTo) {
        const startDate = new Date(filters.dateFrom);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(filters.dateTo);
        endDate.setHours(23, 59, 59, 999);

        filteredOrders = filteredOrders.filter((order) => {
          const orderDate = order.orderDate.toDate();
          return orderDate >= startDate && orderDate <= endDate;
        });
      }

      // Lọc theo loại set
      if (filters.type !== "all") {
        filteredOrders = filteredOrders.filter(
          (order) => order.type === filters.type
        );
      }

      // Tìm kiếm theo tên hoặc số điện thoại
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(
          (order) =>
            order.customerName.toLowerCase().includes(searchLower) ||
            order.phone.includes(filters.searchTerm)
        );
      }

      setOrders((prev) => [...prev, ...filteredOrders]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === itemsPerPage);
    } catch (error) {
      console.error("Error loading more orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    try {
      setIsCreating(true);
      await addDoc(collection(db, "orders"), {
        ...newOrder,
        orderDate: new Date(newOrder.orderDate),
        status: "pending",
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
            ...newOrder,
            orderDate: format(new Date(newOrder.orderDate), "dd/MM/yyyy"),
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
    <div className="bg-white shadow rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="px-4 py-5 sm:px-6">
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

      {/* Filters */}
      <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Từ ngày
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
              className="mt-1 block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Đến ngày
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Loại set
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="family">Gia đình</option>
              <option value="friendship">Bạn bè</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Tìm kiếm
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
                placeholder="Tên hoặc số điện thoại"
                className="block p-2 w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            disabled={isSearching}
            onClick={handleSearch}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSearching ? "Đang tìm kiếm..." : "Tìm kiếm"}
          </button>
        </div>
      </div>

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
                  {order.type === "family" ? "Gia đình" : "Bạn bè"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {order.status === "completed"
                      ? "Hoàn thành"
                      : order.status === "pending"
                      ? "Đang chờ"
                      : "Đã hủy"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {order.note || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsEditModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 sm:px-6 flex items-center justify-between border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Trang trước
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Trang sau
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{startIndex + 1}</span> đến{" "}
              <span className="font-medium">
                {Math.min(endIndex, orders.length)}
              </span>{" "}
              của <span className="font-medium">{orders.length}</span> kết quả
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Trang trước</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span className="sr-only">Trang sau</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="px-4 py-3 sm:px-6 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? "Đang tải..." : "Tải thêm"}
          </button>
        </div>
      )}

      {/* Create Order Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="mx-auto w-full max-w-4xl rounded-lg bg-white p-4 sm:p-8">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-8">
              Tạo đơn hàng mới
            </Dialog.Title>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-4 sm:space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    value={newOrder.customerName}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, customerName: e.target.value })
                    }
                    className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    placeholder="Nhập tên khách hàng"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={newOrder.phone}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, phone: e.target.value })
                    }
                    className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Ngày đặt
                  </label>
                  <input
                    type="date"
                    value={newOrder.orderDate}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, orderDate: e.target.value })
                    }
                    className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Loại set
                  </label>
                  <select
                    value={newOrder.type}
                    onChange={(e) =>
                      setNewOrder({
                        ...newOrder,
                        type: e.target.value as "family" | "friendship",
                      })
                    }
                    className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                  >
                    <option value="family">Gia đình</option>
                    <option value="friendship">Bạn bè</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                    Ghi chú
                  </label>
                  <textarea
                    value={newOrder.note}
                    onChange={(e) =>
                      setNewOrder({ ...newOrder, note: e.target.value })
                    }
                    className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    rows={4}
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateOrder}
                disabled={isCreating}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Đang tạo..." : "Tạo đơn hàng"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Status Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedOrder(null);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="mx-auto w-full max-w-4xl rounded-lg bg-white p-4 sm:p-8">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-8">
              Cập nhật trạng thái đơn hàng
            </Dialog.Title>

            {selectedOrder && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Tên khách hàng
                    </label>
                    <p className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded-lg">
                      {selectedOrder.customerName}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Số điện thoại
                    </label>
                    <p className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded-lg">
                      {selectedOrder.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Ngày đặt
                    </label>
                    <p className="mt-1 text-sm text-gray-900 p-2 bg-gray-50 rounded-lg">
                      {format(selectedOrder.orderDate.toDate(), "dd/MM/yyyy", {
                        locale: vi,
                      })}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                      Trạng thái
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        setSelectedOrder({
                          ...selectedOrder,
                          status: e.target.value as
                            | "completed"
                            | "pending"
                            | "cancelled",
                        })
                      }
                      className="block w-full p-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    >
                      <option value="pending">Đang chờ</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? "Đang cập nhật..." : "Cập nhật"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedOrder(null);
        }}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
          <Dialog.Panel className="mx-auto w-full max-w-sm rounded-lg bg-white p-4 sm:p-8">
            <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Xác nhận xóa đơn hàng
            </Dialog.Title>

            <p className="text-sm text-gray-500 mb-6 sm:mb-8">
              Bạn có chắc chắn muốn xóa đơn hàng này không? Hành động này không
              thể hoàn tác.
            </p>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedOrder(null);
                }}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteOrder}
                className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Xóa
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
