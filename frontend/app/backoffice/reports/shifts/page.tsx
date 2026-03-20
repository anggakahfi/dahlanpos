"use client"

import { useState, useEffect } from "react"
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
import { Eye } from "lucide-react"
import { getReportShifts, getOutlets, getEmployees } from "@/lib/api"
import type { ShiftRecord, Outlet, Employee } from "@/lib/types"
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

  useEffect(() => {
    getReportShifts().then((res) => setShiftList(res.data || [])).catch(() => {})
    getOutlets().then((data) => setOutletList(data || [])).catch(() => {})
    getEmployees().then((data) => setEmployeeList(data || [])).catch(() => {})
  }, [])

  const cashiers = employeeList.filter((e) => e.role === "cashier")

  const filteredShifts = shiftList.filter((s) => {
    if (selectedOutlet !== "all" && s.outletId !== selectedOutlet) return false
    if (selectedCashier !== "all" && s.cashierId !== selectedCashier) return false
    return true
  })

  return (
    <>
      <PageHeader title="Shift Report">
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

          <Select value={selectedCashier} onValueChange={setSelectedCashier}>
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
                  <TableHead className="text-right">Expected Cash</TableHead>
                  <TableHead className="text-right">Actual Cash</TableHead>
                  <TableHead className="text-right">Diff</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShifts.map((shift) => (
                  <TableRow key={shift.id}>
                    <TableCell className="font-mono text-sm">
                      SHIFT-{shift.id.padStart(3, "0")}
                    </TableCell>
                    <TableCell>{shift.outletName}</TableCell>
                    <TableCell>{shift.cashierName}</TableCell>
                    <TableCell>{shift.startTime}</TableCell>
                    <TableCell>{shift.endTime || "-"}</TableCell>
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
                        onClick={() => setSelectedShift(shift)}
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
      </div>

      {/* Shift Detail Modal */}
      <Dialog open={!!selectedShift} onOpenChange={() => setSelectedShift(null)}>
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
                    SHIFT-{selectedShift.id.padStart(3, "0")}
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">Cash Transactions</p>
                      <p className="text-xl font-bold">
                        {selectedShift.cashTransactions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rp {selectedShift.cashAmount.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground">QRIS Transactions</p>
                      <p className="text-xl font-bold">
                        {selectedShift.qrisTransactions}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Rp {selectedShift.qrisAmount.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

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
                    <span>Rp {selectedShift.cashAmount.toLocaleString()}</span>
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
