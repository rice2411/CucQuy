// Các hàm tiện ích xử lý ngày tháng cho module orders
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const getFirstDayOfMonth = (year?: number, month?: number) => {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  return new Date(y, m, 1, 7, 0, 0).toISOString().split("T")[0];
};

export const getLastDayOfMonth = (year?: number, month?: number) => {
  const now = new Date();
  const y = year ?? now.getFullYear();
  const m = month ?? now.getMonth();
  return new Date(y, m + 1, 0, 7, 0, 0).toISOString().split("T")[0];
};

export const getMonthOptions = (start: Date, end: Date) => {
  const months = [];
  const d = new Date(start);
  while (d <= end) {
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    const label = `Tháng ${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}/${d.getFullYear()}`;
    months.push({ value, label });
    d.setMonth(d.getMonth() + 1);
  }
  return months.reverse();
};

export const getToday = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

export const formatDate = (date: Date | string, formatStr = "dd/MM/yyyy") => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, formatStr, { locale: vi });
};
