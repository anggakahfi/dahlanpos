"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Printer, Download, ArrowLeft, Check } from "lucide-react"

export default function ShiftSummaryPage() {
  const router = useRouter()

  // Mock shift summary data
  const summary = {
    shiftId: "SFT-2024-001234",
    outlet: "Kopi Kenangan Sudirman",
    cashier: "Budi Santoso",
    startTime: "2024-01-15 08:00",
    endTime: "2024-01-15 16:30",
    duration: "8 jam 30 menit",
    startingCash: 500000,
    endingCash: 1700000,
    expectedCash: 1700000,
    cashDifference: 0,
    totalSales: 2450000,
    totalTransactions: 45,
    breakdown: {
      cash: { count: 25, amount: 1200000 },
      card: { count: 12, amount: 750000 },
      qris: { count: 8, amount: 500000 },
    },
    refunds: { count: 2, amount: 50000 },
    voids: { count: 1, amount: 25000 },
    topItems: [
      { name: "Kopi Susu Gula Aren", qty: 32 },
      { name: "Es Teh Manis", qty: 28 },
      { name: "Roti Bakar Coklat", qty: 18 },
    ],
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Shift Ditutup</h1>
          <p className="text-muted-foreground">
            Ringkasan shift Anda telah disimpan
          </p>
        </div>

        {/* Summary Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Ringkasan Shift</CardTitle>
            <Badge variant="secondary">{summary.shiftId}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Outlet</p>
                <p className="font-medium">{summary.outlet}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kasir</p>
                <p className="font-medium">{summary.cashier}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Waktu Mulai</p>
                <p className="font-medium">{summary.startTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Waktu Selesai</p>
                <p className="font-medium">{summary.endTime}</p>
              </div>
            </div>

            <Separator />

            {/* Sales Summary */}
            <div>
              <h3 className="font-medium mb-3">Penjualan</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Penjualan</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatPrice(summary.totalSales)}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tunai ({summary.breakdown.cash.count} trx)</span>
                  <span>{formatPrice(summary.breakdown.cash.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kartu ({summary.breakdown.card.count} trx)</span>
                  <span>{formatPrice(summary.breakdown.card.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">QRIS ({summary.breakdown.qris.count} trx)</span>
                  <span>{formatPrice(summary.breakdown.qris.amount)}</span>
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
                  <span>{formatPrice(summary.startingCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Penjualan Tunai</span>
                  <span className="text-green-600">+{formatPrice(summary.breakdown.cash.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Refund</span>
                  <span className="text-red-600">-{formatPrice(summary.refunds.amount)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Kas Diharapkan</span>
                  <span>{formatPrice(summary.expectedCash)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Kas Aktual</span>
                  <span>{formatPrice(summary.endingCash)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selisih</span>
                  <span className={summary.cashDifference === 0 
                    ? "text-green-600" 
                    : "text-red-600"
                  }>
                    {formatPrice(summary.cashDifference)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Top Items */}
            <div>
              <h3 className="font-medium mb-3">Item Terlaris</h3>
              <div className="space-y-2 text-sm">
                {summary.topItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {index + 1}. {item.name}
                    </span>
                    <span>{item.qty} terjual</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-3 mb-6">
          <Button variant="outline" className="flex-1">
            <Printer className="h-4 w-4 mr-2" />
            Cetak Laporan
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Unduh PDF
          </Button>
        </div>

        {/* Back Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={() => router.push("/cashier")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Buka Shift Baru
        </Button>
      </div>
    </div>
  )
}
