"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/backoffice/page-header"
import { DateFilter } from "@/components/backoffice/date-filter"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Eye, Loader2 } from "lucide-react"
import { getReportShifts, getShiftSummary, getOutlets, getEmployees } from "@/lib/api"
import type { ShiftRecord, Outlet, Employee, DateRange } from "@/lib/types"
import { cn } from "@/lib/utils"

function getDiscrepancyColor(discrepancy: number | null) {
  if (discrepancy === null) return ""
  const absVal = Math.abs(discrepancy)
  if (absVal <= 1000) return "text-[#10B981]"
  if (absVal <= 10000) return "text-[#F59E0B]"
  return "text-[#EF4444]"
}

function formatDiscrepancy(discrepancy: number | null) {
  if (discrepancy === null) return "-"
  if (discrepancy === 0) return "Match"
  const prefix = discrepancy > 0 ? "+" : ""
  return `${prefix}Rp ${discrepancy.toLocaleString()}`
}

export default function ShiftsPage() {
  const [selectedOutlet, setSelectedOutlet] = useState("all")
  const [selectedCashier, setSelectedCashier] = useState("all")
  const [selectedShift, setSelectedShift] = useState<ShiftRecord | null>(null)
  const [shiftList, setShiftList] = useState<ShiftRecord[]>([])
  const [outletList, setOutletList] = useState<Outlet[]>([])
  const [employeeList, setEmployeeList] = useState<Employee[]>([])
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Shift summary state for modal
  const [shiftSummary, setShiftSummary] = useState<any>(null)
  const [isSummaryLoading, setIsSummaryLoading] = useState(false)

  // Inline page-reset handlers to avoid double-fetch race condition
  const handleOutletChange = (val: string) => { setSelectedOutlet(val); setPage(1) }
  const handleCashierChange = (val: string) => { setSelectedCashier(val); setPage(1) }
  const handleDateChange = (val: DateRange | null) => { setDateRange(val as DateRange); setPage(1) }

  // Load static lists once
  useEffect(() => {
    getOutlets().then((data) => setOutletList(data || [])).catch(() => {})
    getEmployees().then((data) => setEmployeeList(data || [])).catch(() => {})
  }, [])

  const fetchShifts = useCallback(async () => {
    // Don't fetch until DateFilter has initialized the date range
    if (!dateRange) return
    
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const params: Record<string, string> = { page: String(page), per_page: "20" }
      if (selectedOutlet !== "all") params.outlet_id = selectedOutlet
      if (selectedCashier !== "all") params.cashier_id = selectedCashier
      if (dateRange.start) params.start_date = dateRange.start.toISOString()
      if (dateRange.end) params.end_date = dateRange.end.toISOString()
      const res = await getReportShifts(params)
      setShiftList(res.data || [])
      setTotalRecords((res.meta as any)?.total ?? 0)
    } catch (err: any) {
      console.error("Failed to fetch shifts", err)
      setErrorMsg(err.message || "Gagal memuat data dari server. Token kadaluarsa atau koneksi terputus.")
    } finally {
      setIsLoading(false)
    }
  }, [selectedOutlet, selectedCashier, dateRange, page])

  useEffect(() => {
    fetchShifts()
  }, [fetchShifts])

  const cashiers = employeeList.filter((e) => e.role === "cashier")
  const totalPages = Math.ceil(totalRecords / 20) || 1

  const handleOpenDetail = async (shift: ShiftRecord) => {
    setSelectedShift(shift)
    setShiftSummary(null)
    setIsSummaryLoading(true)
    try {
      const summary = await getShiftSummary(shift.id)
      setShiftSummary(summary)
    } catch {
      // summary not available — possibly open shift
    } finally {
      setIsSummaryLoading(false)
    }
  }

  return (
    <>
      <PageHeader title="Shift Report">
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

          <Select value={selectedCashier} onValueChange={handleCashierChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Cashier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cashiers</SelectItem>
              {cashiers.map((cashier) => (
                <SelectItem key={cashier.id} value={cashier.id}>
                  {cashier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shift ID</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Cashier</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Expected Cash</TableHead>
                  <TableHead className="text-right">Actual Cash</TableHead>
                  <TableHead className="text-right">Diff</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : errorMsg ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-red-500 font-medium">
                      {errorMsg}
                    </TableCell>
                  </TableRow>
                ) : shiftList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No shifts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  shiftList.map((shift) => (
                    <TableRow key={shift.id}>
                      <TableCell className="font-mono text-sm">
                        {shift.id.substring(0, 8).toUpperCase()}
                      </TableCell>
                      <TableCell>{shift.outletName}</TableCell>
                      <TableCell>{shift.cashierName}</TableCell>
                      <TableCell>{shift.startTime}</TableCell>
                      <TableCell>{shift.endTime || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={(shift as any).status === "open" ? "default" : "secondary"}>
                          {(shift as any).status === "open" ? "Open" : "Closed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        Rp {shift.expectedCash.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {shift.actualCash !== null
                          ? `Rp ${shift.actualCash.toLocaleString()}`
                          : "-"}
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-right font-medium",
                          getDiscrepancyColor(shift.discrepancy)
                        )}
                      >
                        {formatDiscrepancy(shift.discrepancy)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetail(shift)}
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

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {shiftList.length === 0 ? 0 : (page - 1) * 20 + 1}-{Math.min(page * 20, totalRecords)} of {totalRecords}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              Previous
            </Button>
            <div className="flex items-center text-sm px-2">
              Page {page} of {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Shift Detail Modal */}
      <Dialog open={!!selectedShift} onOpenChange={() => { setSelectedShift(null); setShiftSummary(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Shift Detail</DialogTitle>
          </DialogHeader>
          {selectedShift && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Shift ID</p>
                  <p className="font-mono font-medium">
                    {selectedShift.id.substring(0, 8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Outlet</p>
                  <p className="font-medium">{selectedShift.outletName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Cashier</p>
                  <p className="font-medium">{selectedShift.cashierName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Duration</p>
                  <p className="font-medium">
                    {selectedShift.startTime} - {selectedShift.endTime || "Ongoing"}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="mb-3 font-medium">Transaction Breakdown</p>
                {isSummaryLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-muted-foreground">Cash Transactions</p>
                        <p className="text-xl font-bold">
                          {shiftSummary ? (shiftSummary.cash_sales > 0 ? "≥1" : "0") : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rp {(shiftSummary?.cash_sales ?? 0).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-muted-foreground">QRIS Transactions</p>
                        <p className="text-xl font-bold">
                          {shiftSummary ? (shiftSummary.qris_sales > 0 ? "≥1" : "0") : "-"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Rp {(shiftSummary?.qris_sales ?? 0).toLocaleString()}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {!isSummaryLoading && shiftSummary && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 font-medium">Total Sales</p>
                    <p className="text-2xl font-bold">
                      Rp {(shiftSummary.total_sales ?? 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {shiftSummary.total_transactions ?? 0} transaksi
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <p className="mb-3 font-medium">Cash Reconciliation</p>
                <div className="space-y-2 rounded-lg border bg-muted/50 p-4 text-sm">
                  <div className="flex justify-between">
                    <span>Beginning Cash</span>
                    <span>Rp {selectedShift.beginningCash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>+ Cash Sales</span>
                    <span>Rp {(shiftSummary?.cash_sales ?? 0).toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>= Expected</span>
                    <span>Rp {selectedShift.expectedCash.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Actual</span>
                    <span>
                      {selectedShift.actualCash !== null
                        ? `Rp ${selectedShift.actualCash.toLocaleString()}`
                        : "-"}
                    </span>
                  </div>
                  <Separator />
                  <div
                    className={cn(
                      "flex justify-between font-bold",
                      getDiscrepancyColor(selectedShift.discrepancy)
                    )}
                  >
                    <span>Difference</span>
                    <span>{formatDiscrepancy(selectedShift.discrepancy)}</span>
                  </div>
                </div>
              </div>

              {selectedShift.notes && (
                <>
                  <Separator />
                  <div>
                    <p className="mb-2 font-medium">Notes</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedShift.notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
