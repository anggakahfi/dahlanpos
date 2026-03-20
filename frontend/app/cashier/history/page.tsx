"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, Receipt, Eye, RotateCcw, Printer } from "lucide-react"
import { getCashierTransactions } from "@/lib/api"
import type { Transaction } from "@/lib/types"

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [showDetail, setShowDetail] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [transactionList, setTransactionList] = useState<Transaction[]>([])

  useEffect(() => {
    setIsMounted(true)
    getCashierTransactions()
      .then((res) => setTransactionList(res.data || []))
      .catch(() => {})
  }, [])

  if (!isMounted) return null

  const todayTransactions = transactionList.filter((t) => {
    const today = new Date().toISOString().split("T")[0]
    return t.date === today
  })

  const filteredTransactions = todayTransactions.filter((t) =>
    t.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setShowDetail(true)
  }

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Selesai</Badge>
      case "void":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Void</Badge>
      default:
        return <Badge variant="secondary">Pending</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Tunai"
      case "card":
        return "Kartu"
      case "qris":
        return "QRIS"
      default:
        return method
    }
  }

  return (
    <div className="p-6 h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Riwayat Transaksi</h1>
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transaksi hari ini
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari no. struk..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Transaksi</p>
            <p className="text-2xl font-bold">{filteredTransactions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Penjualan</p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(
                filteredTransactions
                  .filter((t) => t.status === "paid")
                  .reduce((sum, t) => sum + t.total, 0)
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Tunai</p>
            <p className="text-2xl font-bold">
              {formatPrice(
                filteredTransactions
                  .filter((t) => t.paymentMethod === "cash" && t.status === "paid")
                  .reduce((sum, t) => sum + t.total, 0)
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Non-Tunai</p>
            <p className="text-2xl font-bold">
              {formatPrice(
                filteredTransactions
                  .filter((t) => t.paymentMethod !== "cash" && t.status === "paid")
                  .reduce((sum, t) => sum + t.total, 0)
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="divide-y divide-border">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Belum ada transaksi hari ini</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Receipt className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.orderId}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.time} • {transaction.items.length} item
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">{formatPrice(transaction.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {getPaymentMethodLabel(transaction.paymentMethod)}
                      </p>
                    </div>
                    {getStatusBadge(transaction.status)}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetail(transaction)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">No. Struk</div>
                <div className="font-medium">{selectedTransaction.orderId}</div>
                <div className="text-muted-foreground">Waktu</div>
                <div className="font-medium">
                  {selectedTransaction.date} {selectedTransaction.time}
                </div>
                <div className="text-muted-foreground">Status</div>
                <div>{getStatusBadge(selectedTransaction.status)}</div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="font-medium">Item Pesanan</p>
                {selectedTransaction.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedTransaction.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pajak</span>
                  <span>{formatPrice(selectedTransaction.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Total</span>
                  <span>{formatPrice(selectedTransaction.total)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="h-4 w-4 mr-2" />
                  Cetak Ulang
                </Button>
                {selectedTransaction.status === "paid" && (
                  <Button variant="outline" className="flex-1 text-destructive hover:text-destructive">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
