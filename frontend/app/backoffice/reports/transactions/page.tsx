"use client"

import { useState, useEffect, useCallback } from "react"
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
import type { Transaction, Outlet, DateRange } from "@/lib/types"

export default function TransactionsPage() {
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [transactionList, setTransactionList] = useState<Transaction[]>([])
  const [outletList, setOutletList] = useState<Outlet[]>([])
  
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Debouncing for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  // Reset page inline with filter changes — no separate useEffect needed
  const handleOutletChange = (val: string) => { setSelectedOutlet(val); setPage(1) }
  const handlePaymentChange = (val: string) => { setPaymentFilter(val); setPage(1) }
  const handleDateChange = (val: DateRange | null) => { setDateRange(val); setPage(1) }

  // Single fetch for outlets
  useEffect(() => {
    getOutlets().then((data) => setOutletList(data || [])).catch(() => {})
  }, [])

  const fetchTransactions = useCallback(async () => {
    // Don't fetch until DateFilter has initialized the date range
    if (!dateRange) return
    
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const params: Record<string, string> = { page: String(page), per_page: "20" }
      if (selectedOutlet !== "all") params.outlet_id = selectedOutlet
      if (paymentFilter !== "all") params.payment_method = paymentFilter
      if (debouncedSearch) params.search = debouncedSearch
      
      if (dateRange.start) params.start_date = dateRange.start.toISOString()
      if (dateRange.end) params.end_date = dateRange.end.toISOString()
      
      const res = await getReportTransactions(params)
      setTransactionList(res.data || [])
      setTotalRecords((res.meta as any)?.total ?? 0)
    } catch (err: any) {
      console.error("Failed to fetch transactions", err)
      setErrorMsg(err.message || "Gagal memuat data dari server. Token kadaluarsa atau koneksi terputus.")
    } finally {
      setIsLoading(false)
    }
  }, [page, selectedOutlet, paymentFilter, debouncedSearch, dateRange])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const totalPages = Math.ceil(totalRecords / 20)
  const totalRevenue = transactionList
    .filter((t) => t.status === "paid")
    .reduce((sum, t) => sum + t.total, 0)

  return (
    <>
      <PageHeader title="Transactions">
        <DateFilter onDateChange={handleDateChange} />
      </PageHeader>

      <div className="flex-1 overflow-y-auto p-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-4">
          <Select value={selectedOutlet} onValueChange={handleOutletChange}>
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

          <Select value={paymentFilter} onValueChange={handlePaymentChange}>
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
                <p className="text-2xl font-bold">{totalRecords}</p>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : errorMsg ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-red-500 font-medium">
                      {errorMsg}
                    </TableCell>
                  </TableRow>
                ) : transactionList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  transactionList.map((transaction) => (
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
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination Controls */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            Showing {totalRecords === 0 ? 0 : (page - 1) * 20 + 1}-
            {Math.min(page * 20, totalRecords)} of {totalRecords}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <div className="flex items-center justify-center text-sm font-medium">
              Page {page} of {Math.max(1, totalPages)}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
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
