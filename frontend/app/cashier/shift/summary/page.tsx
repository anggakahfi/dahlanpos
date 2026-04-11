"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Printer, ArrowLeft, Check, Loader2 } from "lucide-react"

interface ShiftSummary {
  id: string
  outlet_id: string
  starting_cash: number
  ending_cash: number
  total_sales: number
  total_transactions: number
  cash_sales: number
  qris_sales: number
  discrepancy_note?: string
  started_at: string
  closed_at?: string
}

export default function ShiftSummaryPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<ShiftSummary | null>(null)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)

  const formatDuration = (start: string, end?: string) => {
    const s = new Date(start)
    const e = end ? new Date(end) : new Date()
    const diff = e.getTime() - s.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours} jam ${minutes} menit`
  }

  useEffect(() => {
    const raw = sessionStorage.getItem("lastClosedShift")
    if (!raw) {
      router.push("/cashier")
      return
    }
    try {
      setSummary(JSON.parse(raw))
    } catch {
      router.push("/cashier")
    }
  }, [router])

  if (!summary) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const cashDiff = (summary.ending_cash || 0) - ((summary.starting_cash || 0) + (summary.cash_sales || 0))

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Shift Ditutup</h1>
          <p className="text-muted-foreground">Ringkasan shift Anda telah disimpan</p>
        </div>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Ringkasan Shift</CardTitle>
            <Badge variant="secondary">{summary.id.slice(0, 8).toUpperCase()}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Duration */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Waktu Mulai</p>
                <p className="font-medium">{new Date(summary.started_at).toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Waktu Selesai</p>
                <p className="font-medium">{summary.closed_at ? new Date(summary.closed_at).toLocaleString("id-ID") : "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Durasi</p>
                <p className="font-medium">{formatDuration(summary.started_at, summary.closed_at)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Transaksi</p>
                <p className="font-medium">{summary.total_transactions ?? "-"}</p>
              </div>
            </div>

            <Separator />

            {/* Sales Summary */}
            <div>
              <h3 className="font-medium mb-3">Penjualan</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Penjualan</span>
                  <span className="text-2xl font-bold text-green-600">{formatPrice(summary.total_sales || 0)}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tunai</span>
                  <span>{formatPrice(summary.cash_sales || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">QRIS</span>
                  <span>{formatPrice(summary.qris_sales || 0)}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Cash Summary */}
            <div>
              <h3 className="font-medium mb-3">Kas</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kas Awal</span>
                  <span>{formatPrice(summary.starting_cash || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penjualan Tunai</span>
                  <span className="text-green-600">+{formatPrice(summary.cash_sales || 0)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Kas Aktual</span>
                  <span>{formatPrice(summary.ending_cash || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selisih</span>
                  <span className={cashDiff === 0 ? "text-green-600" : "text-red-600"}>
                    {cashDiff >= 0 ? "+" : ""}{formatPrice(cashDiff)}
                  </span>
                </div>
              </div>
            </div>

            {summary.discrepancy_note && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-1">Catatan Selisih</p>
                  <p className="text-sm text-muted-foreground">{summary.discrepancy_note}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Cetak Laporan
          </Button>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() => {
            sessionStorage.removeItem("lastClosedShift")
            router.push("/cashier")
          }}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Buka Shift Baru
        </Button>
      </div>
    </div>
  )
}
