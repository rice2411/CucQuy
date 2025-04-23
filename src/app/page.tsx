import OrderTable from "@/components/OrderTable";

export default function Home() {
  return (
    <>
      <header className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý đơn hàng Cúc Quy Bakery
          </h1>
        </div>
      </header>
      <OrderTable />
    </>
  );
}
