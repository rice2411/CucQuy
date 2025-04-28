import { Order, OrderFormData } from "@/modules/orders/types/order";
import { OrderType, OrderStatus } from "@/modules/orders/enums/order";

export function buildOrderTelegramMessage(
  order: Order | OrderFormData,
  type: "create" | "update" | "delete"
): string {
  const typeLabel =
    type === "create"
      ? "🆕 <b>ĐƠN HÀNG MỚI</b> 🆕"
      : type === "update"
      ? "✏️ <b>CẬP NHẬT ĐƠN HÀNG</b> ✏️"
      : "🗑️ <b>XÓA ĐƠN HÀNG</b> 🗑️";
  const orderDate = (order as any).orderDate?.toDate
    ? (order as any).orderDate.toDate().toLocaleDateString()
    : order.orderDate;
  const typeText =
    order.type === OrderType.Family
      ? "Gia đình"
      : order.type === OrderType.Friendship
      ? "Bạn bè"
      : "Quà tặng";
  let statusEmoji = "";
  let statusText = "-";
  if (order.status === OrderStatus.Completed) {
    statusEmoji = "🟢";
    statusText = "Hoàn thành";
  } else if (order.status === OrderStatus.Pending) {
    statusEmoji = "🟡";
    statusText = "Đang xử lý";
  } else if (order.status === OrderStatus.Cancelled) {
    statusEmoji = "🔴";
    statusText = "Đã hủy";
  }
  return `${typeLabel}\n
<b>👤 Khách:</b> ${order.customerName}
<b>📞 SĐT:</b> ${order.phone}
<b>📅 Ngày:</b> ${orderDate}
<b>🎁 Loại:</b> ${typeText}
<b>🔢 Số lượng:</b> ${order.quantity}
<b>📝 Ghi chú:</b> ${order.note || "-"}
<b>📦 Trạng thái:</b> <b>${statusEmoji} ${statusText}</b>`;
}
