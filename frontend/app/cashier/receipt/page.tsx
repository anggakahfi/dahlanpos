"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Printer, ArrowLeft, Loader2, QrCode } from "lucide-react"
import QRCode from "react-qr-code"
import { getPublicReceipt, getAuthSession } from "@/lib/api"

interface ReceiptData {
  id: string
  orderId: string
  date: string
  cashier: string
  customerName?: string
  items: { name: string; qty: number; price: number; subtotal: number }[]
  subtotal: number
  tax: number
  total: number
  paymentMethod: string
  cashReceived: number
  change: number
  settings: any
  outlet: any
}

export default function ReceiptPage() {
  const router = useRouter()
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price)

  useEffect(() => {
    const txnId = sessionStorage.getItem("lastTransactionId")
    if (!txnId) {
      router.push("/cashier")
      return
    }
    const session = getAuthSession('cashier')
    const user = session?.user ?? null
    const method = sessionStorage.getItem("lastPaymentMethod") || "cash"
    const cashIn = parseFloat(sessionStorage.getItem("lastCashReceived") || "0")

    getPublicReceipt(txnId)
      .then(({ transaction: txn, settings, outlet }) => {
        setReceipt({
          id: txn.id,
          orderId: txn.order_id || txn.id.slice(0, 8).toUpperCase(),
          date: txn.created_at
            ? new Date(txn.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })
            : "-",
          cashier: user?.name || "Kasir",
          customerName: txn.customer_name,
          items: (txn.items || []).map((item: any) => ({
            name: item.product_name,
            qty: item.quantity,
            price: item.unit_price ?? 0,
            subtotal: item.subtotal ?? (item.quantity * (item.unit_price ?? 0)),
          })),
          subtotal: txn.subtotal ?? 0,
          tax: txn.tax_amount ?? 0,
          total: txn.total_amount ?? 0,
          paymentMethod: method === "qris" ? "QRIS" : "Tunai",
          cashReceived: cashIn,
          change: method === "cash" ? Math.max(0, cashIn - (txn.total_amount ?? 0)) : 0,
          settings,
          outlet,
        })
      })
      .catch(() => router.push("/cashier"))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
  if (!receipt) return null

  return (
    <div className="flex h-full">
      {/* Left: Receipt Preview */}
      <div className="w-1/2 p-6 flex items-center justify-center bg-muted/30 overflow-auto">
        <Card className="w-80 bg-white shadow-lg">
          <CardContent className="p-6">
            <div className="text-center mb-4">
              {receipt.settings?.logoUrl ? (
                <img src={receipt.settings.logoUrl} alt="Logo" className="h-12 mx-auto mb-2 object-contain" />
              ) : (
                <h2 className="font-bold text-lg">{receipt.outlet?.name || "DahlanPOS"}</h2>
              )}
              {receipt.settings?.logoUrl && <h2 className="font-bold text-base mt-2">{receipt.outlet?.name || "DahlanPOS"}</h2>}
              
              {(receipt.outlet?.address || receipt.outlet?.phone) && (
                <div className="text-xs text-muted-foreground my-1 whitespace-pre-wrap">
                  {receipt.outlet?.address && <p>{receipt.outlet.address}</p>}
                  {receipt.outlet?.phone && <p>{receipt.outlet.phone}</p>}
                </div>
              )}
              
              {receipt.settings?.headerText ? (
                <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{receipt.settings.headerText}</p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">Terima kasih telah berbelanja</p>
              )}
            </div>
            <Separator className="my-4" />
            <div className="text-xs space-y-1 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">No. Order</span>
                <span>{receipt.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tanggal</span>
                <span>{receipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Kasir</span>
                <span>{receipt.cashier}</span>
              </div>
              {receipt.customerName && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pelanggan</span>
                  <span>{receipt.customerName}</span>
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 mb-4">
              {receipt.items.map((item, i) => (
                <div key={i} className="text-sm">
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
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(receipt.subtotal)}</span>
              </div>
              {receipt.tax > 0 && (
                <div className="flex justify-between">
                  <span>Pajak</span>
                  <span>{formatPrice(receipt.tax)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatPrice(receipt.total)}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Metode</span>
                <span>{receipt.paymentMethod}</span>
              </div>
              {receipt.paymentMethod === "Tunai" && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Diterima</span>
                    <span>{formatPrice(receipt.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Kembalian</span>
                    <span>{formatPrice(receipt.change)}</span>
                  </div>
                </>
              )}
            </div>
            <Separator className="my-4" />
            <div className="text-center text-xs text-muted-foreground">
              <p>Terima kasih telah berbelanja!</p>
              <p>Simpan struk ini sebagai bukti pembayaran</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Actions */}
      <div className="w-1/2 p-6 flex flex-col">
        <h2 className="text-xl font-semibold mb-6">Transaksi Selesai</h2>

        {receipt.paymentMethod === "Tunai" && (
          <Card className="p-4 bg-green-50 border-green-200 mb-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Kembalian</p>
              <p className="text-3xl font-bold text-green-600">{formatPrice(receipt.change)}</p>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            size="lg"
            onClick={() => window.print()}
          >
            <Printer className="h-5 w-5 mr-3" />
            Cetak Struk
          </Button>

          <Card className="mt-8 border-dashed border-2">
            <CardContent className="pt-6 flex flex-col items-center">
              <QrCode className="h-8 w-8 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2 text-center">E-Receipt</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Arahkan layar ini ke kustomer untuk di-scan
              </p>
              <div className="bg-white p-2 rounded-lg border">
                <QRCode
                  value={`${process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '')}/r/${receipt.id}`}
                  size={180}
                  level="M"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-auto pt-6">
          <Button
            className="w-full"
            size="lg"
            onClick={() => {
              sessionStorage.removeItem("lastTransactionId")
              router.push("/cashier")
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Kasir
          </Button>
        </div>
      </div>
    </div>
  )
}
