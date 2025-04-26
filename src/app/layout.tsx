import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cúc Quy Bakery - Quản lý đơn hàng",
  description: "Hệ thống quản lý đơn hàng Cúc Quy Bakery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 overflow-hidden`}
      >
        <div className="flex h-screen">
          <Sidebar />
          <div className="flex-1 flex flex-col h-full">
            <main className="flex-1 overflow-y-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </div>
            </main>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
