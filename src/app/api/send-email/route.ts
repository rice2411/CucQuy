import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { orderDetails } = await request.json();

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
      html: `
        <h2>Thông tin đơn hàng mới</h2>
        <p><strong>Tên khách hàng:</strong> ${orderDetails.customerName}</p>
        <p><strong>Số điện thoại:</strong> ${orderDetails.phone}</p>
        <p><strong>Loại set:</strong> ${
          orderDetails.type === "family" ? "Set gia đình" : "Set tình bạn"
        }</p>
        <p><strong>Ngày đặt:</strong> ${orderDetails.orderDate}</p>
        <p><strong>Ghi chú:</strong> ${orderDetails.note || "Không có"}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
