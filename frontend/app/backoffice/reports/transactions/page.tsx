"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { DateFilter } from "@/components/backoffice/date-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, Receipt, DollarSign, Eye } from "lucide-react"
import { getReportTransactions, getOutlets } from "@/lib/api"
import type { Transaction, Outlet } from "@/lib/types"

export default function TransactionsPage() {
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [transactionList, setTransactionList] = useState<Transaction[]>([])
  const [outletList, setOutletList] = useState<Outlet[]>([])

  useEffect(() => {
    getReportTransactions().then((res) => setTransactionList(res.data || [])).catch(() => {})
    getOutlets().then((data) => setOutletList(data || [])).catch(() => {})
  }, [])

  const filteredTransactions = transactionList.filter((t) => {
    if (selectedOutlet !== "all" && t.outletId !== selectedOutlet) return false
    if (paymentFilter !== "all" && t.paymentMethod !== paymentFilter) return false
    if (searchQuery && !t.orderId.toLowerCase().includes(searchQuery.toLowerCase()))
      return false
    return true
  })

  const totalTransactions = filteredTransactions.length
  const totalRevenue = filteredTransactions
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.total, 0)

  return (
    <>
      <PageHeader title="Transactions">
        <DateFilter />
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Select value={selectedOutlet} onValueChange={setSelectedOutlet}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Outlet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Outlets</SelectItem>
              {outletList.map((outlet) => (
                <SelectItem key={outlet.id} value={outlet.id}>
                  {outlet.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="qris">QRIS</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-9"
            />
          </div>
        </div>

        {/* Metrics */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Receipt className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{totalTransactions}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">Rp {totalRevenue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.orderId}
                    </TableCell>
                    <TableCell>{transaction.outletName}</TableCell>
                    <TableCell>
                      {transaction.date} {transaction.time.slice(0, 5)}
                    </TableCell>
                    <TableCell className="max-w-32 truncate">
                      {transaction.items.map((i) => i.name).join(", ")}
                    </TableCell>
                    <TableCell className="uppercase">{transaction.paymentMethod}</TableCell>
                    <TableCell className="text-right font-medium">
                      Rp {transaction.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={transaction.status === "paid" ? "default" : "destructive"}
                        className={
                          transaction.status === "paid"
                            ? "bg-[#10B981] hover:bg-[#10B981]/80"
                            : ""
                        }
                      >
                        {transaction.status === "paid" ? "Paid" : "Void"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination placeholder */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing 1-{filteredTransactions.length} of {filteredTransactions.length}
          </p>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      <Dialog
        open={!!selectedTransaction}
        onOpenChange={() => setSelectedTransaction(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Transaction Detail</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Order ID</p>
                  <p className="font-mono font-medium">{selectedTransaction.orderId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {selectedTransaction.date} {selectedTransaction.time}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cashier</p>
                  <p className="font-medium">{selectedTransaction.cashierName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Outlet</p>
                  <p className="font-medium">{selectedTransaction.outletName}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-2 font-medium">Items</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Modifiers</TableHead>
                      <TableHead className="text-center">Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedTransaction.items.map((item, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {item.modifiers || "-"}
                        </TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          Rp {item.price.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>Rp {selectedTransaction.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (11%)</span>
                  <span>Rp {selectedTransaction.tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rp {selectedTransaction.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="uppercase">{selectedTransaction.paymentMethod}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
