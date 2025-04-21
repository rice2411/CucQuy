"use client";

import { useState } from "react";
import { OrderStatistics } from "./OrderStatistics";
import { OrderForm } from "./OrderForm";
import { Button } from "@/components/ui/button";

export function OrderLayout() {
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="primary"
          onClick={() => setIsOrderFormOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Tạo đơn hàng
        </Button>
      </div>

      <OrderStatistics />

      {isOrderFormOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOrderFormOpen(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full max-w-[800px]">
              <button
                className="absolute top-2 right-2 text-white hover:text-gray-300"
                onClick={() => setIsOrderFormOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <OrderForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
