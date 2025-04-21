import { useState } from "react";
import { useForm } from "react-hook-form";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { OrderDetails } from "../utils/email";

const SET_PRICES = {
  tinhban: 22000,
  giadinh: 35000,
};

export default function OrderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<OrderDetails>();

  const selectedSet = watch("setType");
  const quantity = watch("quantity");
  const totalAmount =
    selectedSet && quantity ? SET_PRICES[selectedSet] * quantity : 0;

  const onSubmit = async (data: OrderDetails) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Add total amount to order data
      const orderData = {
        ...data,
        totalAmount,
        createdAt: new Date(),
      };

      // Save to Firebase
      await addDoc(collection(db, "orders"), orderData);

      // Send email notification through API route
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      setSubmitStatus("success");
      reset();
    } catch (error) {
      console.error("Error submitting order:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Đặt hàng bánh</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Họ tên</label>
          <input
            type="text"
            {...register("customerName", { required: "Vui lòng nhập họ tên" })}
            className="w-full p-2 border rounded"
          />
          {errors.customerName && (
            <p className="text-red-500 text-sm">
              {errors.customerName.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1">Số điện thoại</label>
          <input
            type="tel"
            {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
            className="w-full p-2 border rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Địa chỉ</label>
          <input
            type="text"
            {...register("address", { required: "Vui lòng nhập địa chỉ" })}
            className="w-full p-2 border rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Chọn set bánh</label>
          <select
            {...register("setType", { required: "Vui lòng chọn set bánh" })}
            className="w-full p-2 border rounded"
          >
            <option value="">-- Chọn set bánh --</option>
            <option value="tinhban">Set Tình Bạn (22,000đ)</option>
            <option value="giadinh">Set Gia Đình (35,000đ)</option>
          </select>
          {errors.setType && (
            <p className="text-red-500 text-sm">{errors.setType.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Số lượng</label>
          <input
            type="number"
            min="1"
            {...register("quantity", {
              required: "Vui lòng nhập số lượng",
              min: { value: 1, message: "Số lượng phải lớn hơn 0" },
            })}
            className="w-full p-2 border rounded"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm">{errors.quantity.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Ghi chú (không bắt buộc)</label>
          <textarea
            {...register("note")}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {totalAmount > 0 && (
          <div className="text-lg font-bold">
            Tổng tiền: {totalAmount.toLocaleString()}đ
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 text-white rounded ${
            isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
        </button>

        {submitStatus === "success" && (
          <p className="text-green-500 text-center">
            Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.
          </p>
        )}

        {submitStatus === "error" && (
          <p className="text-red-500 text-center">
            Có lỗi xảy ra. Vui lòng thử lại sau.
          </p>
        )}
      </form>
    </div>
  );
}
