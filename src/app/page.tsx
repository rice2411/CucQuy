"use client";

import { OrderStatistics } from "@/components/order/OrderStatistics";
import OrderForm from "../components/OrderForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Tiệm Bánh Cúc Quỳ
        </h1>
        <OrderStatistics />
      </div>
    </main>
  );
}
