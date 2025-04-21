"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface OrderFormData {
  customerName: string;
  phoneNumber: string;
  productType: string;
  quantity: number;
  deliveryDate: string;
  notes: string;
}

export function OrderForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: OrderFormData = {
      customerName: formData.get("customerName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      productType: formData.get("productType") as string,
      quantity: parseInt(formData.get("quantity") as string),
      deliveryDate: formData.get("deliveryDate") as string,
      notes: formData.get("notes") as string,
    };

    try {
      // TODO: Implement order service
      console.log("Order data:", data);
      router.push("/orders");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Đặt hàng thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container relative w-full max-w-[800px] h-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
          <div className="order-box w-full max-w-[700px] mx-auto text-center my-6 md:my-10 px-4">
            <h2 className="text-white text-2xl font-semibold mb-4">
              Đặt đơn hàng
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Tên khách hàng
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    className="w-full bg-transparent border border-white/50 text-white placeholder:text-white/70 rounded-md px-3 py-2"
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className="w-full bg-transparent border border-white/50 text-white placeholder:text-white/70 rounded-md px-3 py-2"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Loại sản phẩm
                  </label>
                  <select
                    name="productType"
                    className="w-full bg-transparent border border-white/50 text-white rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Chọn loại sản phẩm</option>
                    <option value="cake">Bánh kem</option>
                    <option value="bread">Bánh mì</option>
                    <option value="cookie">Bánh quy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="1"
                    className="w-full bg-transparent border border-white/50 text-white placeholder:text-white/70 rounded-md px-3 py-2"
                    placeholder="Nhập số lượng"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Ngày giao hàng
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    className="w-full bg-transparent border border-white/50 text-white rounded-md px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-1">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    name="notes"
                    className="w-full bg-transparent border border-white/50 text-white placeholder:text-white/70 rounded-md px-3 py-2"
                    placeholder="Nhập ghi chú (nếu có)"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-md p-3">
                  <p className="text-red-200">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 disabled:opacity-50"
              >
                {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
