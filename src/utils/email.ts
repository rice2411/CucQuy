import nodemailer from "nodemailer";

export interface OrderDetails {
  customerName: string;
  phone: string;
  address: string;
  setType: "tinhban" | "giadinh";
  quantity: number;
  totalAmount: number;
  note?: string;
}

export const sendOrderEmail = async (orderDetails: OrderDetails) => {
  const setNames = {
    tinhban: "Tình Bạn (22,000đ)",
    giadinh: "Gia Đình (35,000đ)",
  };

  const emailContent = `
    Đơn hàng mới!
    
    Thông tin khách hàng:
    - Tên: ${orderDetails.customerName}
    - Số điện thoại: ${orderDetails.phone}
    - Địa chỉ: ${orderDetails.address}
    
    Chi tiết đơn hàng:
    - Set bánh: ${setNames[orderDetails.setType]}
    - Số lượng: ${orderDetails.quantity}
    - Tổng tiền: ${orderDetails.totalAmount.toLocaleString()}đ
    ${orderDetails.note ? `\nGhi chú: ${orderDetails.note}` : ""}
  `;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "tiembanhcucquy@gmail.com",
    subject: "Đơn hàng mới từ website",
    text: emailContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
