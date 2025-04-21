"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function OrderStatistics() {
  return (
    <div className="fixed inset-0 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-container relative w-full max-w-[1200px] h-full bg-white/10 backdrop-blur-md rounded-lg border border-white/20 shadow-lg">
          <div className="statistics-box w-full max-w-[1100px] mx-auto text-center my-6 md:my-10 px-4">
            <h2 className="text-white text-2xl font-semibold mb-6">
              Thống kê đơn hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white/10 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Tổng số đơn hàng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">150</div>
                  <p className="text-xs text-white/70">
                    +20% so với tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Doanh thu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    25.000.000đ
                  </div>
                  <p className="text-xs text-white/70">
                    +15% so với tháng trước
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    Đơn hàng đang xử lý
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">12</div>
                  <p className="text-xs text-white/70">Cần giao trong ngày</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="date"
                  className="bg-transparent border-white/50 text-white w-[200px]"
                  placeholder="Từ ngày"
                />
                <Input
                  type="date"
                  className="bg-transparent border-white/50 text-white w-[200px]"
                  placeholder="Đến ngày"
                />
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Lọc
                </Button>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                Xuất báo cáo
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table className="bg-white/10 border-white/20">
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-white">Mã đơn</TableHead>
                    <TableHead className="text-white">Khách hàng</TableHead>
                    <TableHead className="text-white">Sản phẩm</TableHead>
                    <TableHead className="text-white">Số lượng</TableHead>
                    <TableHead className="text-white">Ngày đặt</TableHead>
                    <TableHead className="text-white">Ngày giao</TableHead>
                    <TableHead className="text-white">Trạng thái</TableHead>
                    <TableHead className="text-white">Tổng tiền</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="border-white/20">
                    <TableCell className="text-white">DH001</TableCell>
                    <TableCell className="text-white">Nguyễn Văn A</TableCell>
                    <TableCell className="text-white">Bánh kem</TableCell>
                    <TableCell className="text-white">2</TableCell>
                    <TableCell className="text-white">21/04/2024</TableCell>
                    <TableCell className="text-white">22/04/2024</TableCell>
                    <TableCell className="text-white">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-xs">
                        Đang xử lý
                      </span>
                    </TableCell>
                    <TableCell className="text-white">500.000đ</TableCell>
                  </TableRow>
                  {/* Add more rows as needed */}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
