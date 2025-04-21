import { useState, useEffect } from "react"
import { collection, query, orderBy, onSnapshot } from "firebase/firestore"
import { db } from "@/config/firebase"
import { OrderDetails } from "@/utils/email"

export function useOrders() {
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

  return {
    orders: filteredOrders,
    searchTerm,
    setSearchTerm,
  }
}
