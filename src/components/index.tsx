"use client"

import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/config/firebase"
import { OrderDetails } from "@/utils/email"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PageContent() {
  const [orders, setOrders] = useState<OrderDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as OrderDetails[]
      setOrders(ordersData)
    })

    return () => unsubscribe()
  }, [])

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone.includes(searchTerm) ||
      order.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (date: any) => {
    if (!date) return ""
    const d = date.toDate()
    return d.toLocaleString("vi-VN")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white">
            Quản lý đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Tìm kiếm theo tên, số điện thoại hoặc địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 bg-white/10 border-white/20 text-white placeholder:text-white/70"
          />
          <div className="rounded-md border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-white/5">
                  <TableHead className="text-white">Thời gian</TableHead>
                  <TableHead className="text-white">Tên khách hàng</TableHead>
                  <TableHead className="text-white">Số điện thoại</TableHead>
                  <TableHead className="text-white">Địa chỉ</TableHead>
                  <TableHead className="text-white">Loại set</TableHead>
                  <TableHead className="text-white">Số lượng</TableHead>
                  <TableHead className="text-white">Tổng tiền</TableHead>
                  <TableHead className="text-white">Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-white/5">
                    <TableCell className="text-white">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.customerName}
                    </TableCell>
                    <TableCell className="text-white">{order.phone}</TableCell>
                    <TableCell className="text-white">
                      {order.address}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.setType === "tinhban" ? "Tình Bạn" : "Gia Đình"}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.quantity}
                    </TableCell>
                    <TableCell className="text-white">
                      {order.totalAmount.toLocaleString()}đ
                    </TableCell>
                    <TableCell className="text-white">
                      {order.note || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
