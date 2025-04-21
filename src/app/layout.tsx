import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tiệm bánh Cúc Quy",
  description: "Tiệm bánh Cúc Quy",
}

type Props = {
  children: React.ReactNode
}

export default async function LocaleLayout({ children }: Props) {
  return (
    <html>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
