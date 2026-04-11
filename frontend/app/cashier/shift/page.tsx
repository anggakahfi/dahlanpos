"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getCurrentShiftSummary } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Clock,
  DollarSign,
  Receipt,
  TrendingUp,
  Banknote,
  AlertTriangle,
  AlertCircle,
  RefreshCw,
} from "lucide-react"
import { useShift } from "@/components/cashier/shift-context"

export default function ShiftPage() {
  const router = useRouter()
  const { currentShift, isShiftOpen, closeShift } = useShift()
  const [showCloseDialog, setShowCloseDialog] = useState(false)
  const [endingCash, setEndingCash] = useState("")
  const [shiftNote, setShiftNote] = useState("")
  const [isClosing, setIsClosing] = useState(false)

  const { data: summaryData, isLoading, isError, refetch } = useQuery({
    queryKey: ["shiftSummary"],
    queryFn: getCurrentShiftSummary,
    enabled: isShiftOpen,
    staleTime: 0,
    refetchOnMount: "always",
    refetchInterval: 10000,
    retry: 2,
  })

  // Dynamic shift data or fallback
  const shiftData = summaryData || {
    total_sales: 0,
    total_transactions: 0,
    cash_sales: 0,
    qris_sales: 0,
    starting_cash: currentShift?.startingCash || 0,
    expected_cash: currentShift?.startingCash || 0,
    voids: 0,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDuration = () => {
    if (!currentShift?.startTime) return "0 jam 0 menit"
    const start = new Date(currentShift.startTime)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours} jam ${minutes} menit`
  }

  const handleCloseShift = async () => {
    if (!currentShift?.id) return
    const amount = parseFloat(endingCash.replace(/\D/g, "")) || 0
    setIsClosing(true)
    
    try {
      // Pass the note to closeShift context (Bug 2 fix)
      await closeShift(amount, shiftNote)

      // Store FULL summary data for summary page (Bug 4 fix)
      sessionStorage.setItem("lastClosedShift", JSON.stringify({
        id: currentShift.id,
        outlet_id: currentShift.outletId,
        starting_cash: shiftData.starting_cash,
        ending_cash: amount,
        total_sales: shiftData.total_sales,
        total_transactions: shiftData.total_transactions,
        cash_sales: shiftData.cash_sales,
        qris_sales: shiftData.qris_sales,
        discrepancy_note: shiftNote || undefined,
        started_at: currentShift.startTime,
        closed_at: new Date().toISOString(),
      }))
      
      setShowCloseDialog(false)
      router.push("/cashier/shift/summary")
    } catch (err: any) {
      alert("Gagal menutup shift: " + (err?.message || "Coba lagi."))
    } finally {
      setIsClosing(false)
    }
  }

  const cashDifference = (parseFloat(endingCash.replace(/\D/g, "")) || 0) - shiftData.expected_cash

  if (!isShiftOpen) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <Card className="w-full max-w-md mx-4 text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Tidak Ada Shift Aktif</h2>
            <p className="text-muted-foreground mb-4">
              Buka shift terlebih dahulu untuk memulai transaksi
            </p>
            <Button onClick={() => router.push("/cashier")}>
              Buka Shift
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Shift Aktif</h1>
            <p className="text-sm text-muted-foreground">
              Mulai: {currentShift?.startTime 
                ? new Date(currentShift.startTime).toLocaleString("id-ID")
                : "-"
              }
            </p>
          </div>
          <Button variant="destructive" onClick={() => setShowCloseDialog(true)}>
            Tutup Shift
          </Button>
        </div>

        {/* Error Banner (Bug 1 fix) */}
        {isError && (
          <Card className="mb-6 border-yellow-300 bg-yellow-50">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  Gagal memuat ringkasan shift
                </p>
                <p className="text-xs text-yellow-600">
                  Data penjualan mungkin belum terupdate
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Coba Lagi
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durasi</p>
                  <p className="font-semibold">{formatDuration()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Penjualan</p>
                  <p className="font-semibold text-green-600">
                    {formatPrice(shiftData.total_sales)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transaksi</p>
                  <p className="font-semibold">{shiftData.total_transactions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kas Awal</p>
                  <p className="font-semibold">{formatPrice(shiftData.starting_cash)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Penjualan per Metode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Banknote className="h-4 w-4 text-green-600" />
                  </div>
                  <span>Tunai</span>
                </div>
                <span className="font-medium">{formatPrice(shiftData.cash_sales)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">QR</span>
                  </div>
                  <span>QRIS</span>
                </div>
                <span className="font-medium">{formatPrice(shiftData.qris_sales)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(shiftData.total_sales)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Kas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Kas Awal</span>
                <span>{formatPrice(shiftData.starting_cash)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Penjualan Tunai</span>
                <span className="text-green-600">+{formatPrice(shiftData.cash_sales)}</span>
              </div>
              {(shiftData.voids ?? 0) > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Void</span>
                  <span className="text-red-600">-{formatPrice(shiftData.voids)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>Kas yang Diharapkan</span>
                <span>{formatPrice(shiftData.expected_cash)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Close Shift Dialog */}
      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tutup Shift</DialogTitle>
            <DialogDescription>
              Hitung dan masukkan jumlah uang kas di laci
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Kas yang Diharapkan</span>
                  <span className="font-medium">{formatPrice(shiftData.expected_cash)}</span>
                </div>
              </CardContent>
            </Card>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Kas Akhir (Aktual)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  Rp
                </span>
                <Input
                  type="text"
                  placeholder="0"
                  value={endingCash ? parseInt(endingCash.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                  onChange={(e) => setEndingCash(e.target.value.replace(/\D/g, ""))}
                  className="pl-10 text-right text-lg font-semibold"
                />
              </div>
            </div>

            {endingCash && (
              <Card className={cashDifference === 0 
                ? "bg-green-50 border-green-200" 
                : "bg-yellow-50 border-yellow-200"
              }>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {cashDifference !== 0 && (
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {cashDifference === 0 
                          ? "Kas sesuai" 
                          : cashDifference > 0 
                            ? "Kelebihan" 
                            : "Kekurangan"
                        }
                      </p>
                      <p className={`font-semibold ${
                        cashDifference === 0 
                          ? "text-green-600" 
                          : cashDifference > 0 
                            ? "text-blue-600" 
                            : "text-red-600"
                      }`}>
                        {formatPrice(Math.abs(cashDifference))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {endingCash && cashDifference !== 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Catatan Selisih
                </label>
                <Textarea
                  placeholder="Masukkan alasan atau keterangan terjadinya selisih kas..."
                  value={shiftNote}
                  onChange={(e) => setShiftNote(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Batal
            </Button>
            <Button 
              onClick={handleCloseShift}
              disabled={!endingCash || isClosing || (cashDifference !== 0 && !shiftNote.trim())}
            >
              {isClosing ? "Menutup..." : "Tutup Shift"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
