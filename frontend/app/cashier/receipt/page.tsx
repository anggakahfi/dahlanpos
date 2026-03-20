"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Printer, Mail, MessageSquare, ArrowLeft } from "lucide-react"

export default function ReceiptPage() {
  const router = useRouter()

  const receiptData = {
    receiptNumber: "INV-2024-001234",
    date: new Date().toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    outlet: "Kopi Kenangan Sudirman",
    cashier: "Budi Santoso",
    items: [
      { name: "Kopi Susu Gula Aren", qty: 2, price: 24000, subtotal: 48000 },
      { name: "Es Teh Manis", qty: 1, price: 10000, subtotal: 10000 },
      { name: "Roti Bakar Coklat", qty: 1, price: 15000, subtotal: 15000 },
    ],
    subtotal: 73000,
    discount: 0,
    tax: 7300,
    total: 80300,
    paymentMethod: "Tunai",
    cashReceived: 100000,
    change: 19700,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="flex h-full">
      {/* Left: Receipt Preview */}
      <div className="w-1/2 p-6 flex items-center justify-center bg-muted/30 overflow-auto">
        <Card className="w-80 bg-white shadow-lg">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h2 className="font-bold text-lg">DahlanPOS</h2>
              <p className="text-sm text-muted-foreground">{receiptData.outlet}</p>
              <p className="text-xs text-muted-foreground">
                Jl. Sudirman No. 123, Jakarta
              </p>
              <p className="text-xs text-muted-foreground">Tel: 021-1234567</p>
            </div>

            <Separator className="my-4" />

            {/* Receipt Info */}
            <div className="text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">No. Struk</span>
                <span>{receiptData.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span>{receiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kasir</span>
                <span>{receiptData.cashier}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Items */}
            <div className="space-y-2 mb-4">
              {receiptData.items.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span>{item.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.qty} x {formatPrice(item.price)}</span>
                    <span>{formatPrice(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Totals */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(receiptData.subtotal)}</span>
              </div>
              {receiptData.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-{formatPrice(receiptData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Pajak (10%)</span>
                <span>{formatPrice(receiptData.tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(receiptData.total)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Payment Info */}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span>{receiptData.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Diterima</span>
                <span>{formatPrice(receiptData.cashReceived)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Kembalian</span>
                <span>{formatPrice(receiptData.change)}</span>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground">
              <p className="mb-2">Terima kasih telah berbelanja!</p>
              <p>Simpan struk ini sebagai bukti pembayaran</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Actions */}
      <div className="w-1/2 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Transaksi Selesai</h2>

        <div className="space-y-4 mb-8">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Kembalian</p>
              <p className="text-3xl font-bold text-green-600">
                {formatPrice(receiptData.change)}
              </p>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Kirim Struk
          </p>
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Printer className="h-5 w-5 mr-3" />
            Cetak Struk
          </Button>
          <Button variant="outline" className="w-full justify-start" size="lg">
            <Mail className="h-5 w-5 mr-3" />
            Kirim via Email
          </Button>
          <Button variant="outline" className="w-full justify-start" size="lg">
            <MessageSquare className="h-5 w-5 mr-3" />
            Kirim via WhatsApp
          </Button>
        </div>

        <div className="mt-auto pt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={() => router.push("/cashier")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Kasir
          </Button>
        </div>
      </div>
    </div>
  )
}
