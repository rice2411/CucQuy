import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import type { OrderDetails } from "../../../utils/email";

export async function POST(request: Request) {
  try {
    const orderData: OrderDetails = await request.json();

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const setNames = {
      tinhban: "Tình Bạn (22,000đ)",
      giadinh: "Gia Đình (35,000đ)",
    };

    const emailContent = `
      Đơn hàng mới!
      
      Thông tin khách hàng:
      - Tên: ${orderData.customerName}
      - Số điện thoại: ${orderData.phone}
      - Địa chỉ: ${orderData.address}
      
      Chi tiết đơn hàng:
      - Set bánh: ${setNames[orderData.setType]}
      - Số lượng: ${orderData.quantity}
      - Tổng tiền: ${orderData.totalAmount.toLocaleString()}đ
      ${orderData.note ? `\nGhi chú: ${orderData.note}` : ""}
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "tiembanhcucquy@gmail.com",
      subject: "Đơn hàng mới từ website",
      text: emailContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in email API route:", error);
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
