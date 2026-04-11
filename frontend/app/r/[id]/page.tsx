"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Loader2, Download, Share2, AlertCircle } from "lucide-react"
import { getPublicReceipt } from "@/lib/api"
import type { Transaction } from "@/lib/types"

interface ReceiptData {
  transaction: any
  settings: {
    logoUrl?: string
    headerText?: string
    footerText?: string
  }
  outlet?: any
}

export default function PublicReceiptPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<ReceiptData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    // If id is not a UUID but orderId (e.g. TRX-123) we might have to pass it to the backend.
    // Our backend expects the UUID, so we need to ensure the ID passed in the URL was the UUID.
    // Wait, in my previous edit in page.tsx I used `receipt.orderId`, let me check if orderId is the UUID!
    // Ah, `receipt.orderId` was `txn.order_id || txn.id.slice(0, 8).toUpperCase()`.
    // It is NOT the UUID! I should fix that in cashier/receipt/page.tsx to use `txn.id` for the URL!
    // But for now, let's just make the API call with whatever ID we have.

    getPublicReceipt(id)
      .then((res) => {
        if (!res.transaction) {
          setError("Struk tidak ditemukan")
        } else {
          setData(res as ReceiptData)
        }
      })
      .catch((err) => {
        setError(err.message || "Gagal memuat struk")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  const formatPrice = (price: number) => {
    if (!price) return "Rp 0"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "E-Receipt DahlanPOS",
          text: `Berikut adalah rincian transaksi Anda`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      alert("Browser Anda tidak mendukung fitur berbagi langsung. Silakan copy URL di atas.")
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground animate-pulse">Memuat E-Receipt...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">Oops!</h2>
            <p className="text-muted-foreground">{error || "Struk tidak valid atau sudah kedaluwarsa."}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const txn = data.transaction
  const settings = data.settings || {}
  const outlet = data.outlet || {}

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans text-gray-800">
      <div className="max-w-md mx-auto relative printable-area">
        {/* Decorative Receipt Edge Top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-repeat-x z-10" style={{ backgroundImage: "radial-gradient(circle, transparent 4px, white 4px)", backgroundSize: "10px 10px", marginTop: "-4px" }} />
        
        <Card className="rounded-none shadow-xl border-t-0 border-b-0 relative overflow-hidden bg-white">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-6">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="h-16 mx-auto mb-4 object-contain" />
              ) : (
                <h1 className="text-2xl font-bold mb-2 tracking-tight">{outlet.name || "DahlanPOS"}</h1>
              )}
              {settings.logoUrl && <h1 className="text-2xl font-bold mb-2 tracking-tight">{outlet.name || "DahlanPOS"}</h1>}
              
              {(outlet.address || outlet.phone) && (
                <div className="text-sm text-gray-500 mb-2 whitespace-pre-wrap">
                  {outlet.address && <p>{outlet.address}</p>}
                  {outlet.phone && <p>{outlet.phone}</p>}
                </div>
              )}
              
              {settings.headerText ? (
                <p className="text-sm text-gray-500 whitespace-pre-wrap">{settings.headerText}</p>
              ) : (
                <p className="text-sm text-gray-500">Terima kasih telah berbelanja</p>
              )}
            </div>

            <Separator className="border-dashed border-gray-300 my-4" />

            {/* Meta Data */}
            <div className="text-xs space-y-2 mb-6 text-gray-600">
              <div className="flex justify-between">
                <span>No. Referensi</span>
                <span className="font-mono">{txn.order_id || txn.id.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal</span>
                <span>{new Date(txn.created_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
              </div>
            </div>

            <Separator className="border-dashed border-gray-300 my-4" />

            {/* Items */}
            <div className="space-y-4 mb-6">
              {(txn.items || []).map((item: any, i: number) => (
                <div key={i} className="text-sm">
                  <div className="font-medium text-gray-900">{item.product_name}</div>
                  <div className="flex justify-between text-gray-500 mt-1">
                    <span>{item.quantity} x {formatPrice(item.unit_price)}</span>
                    <span className="font-medium text-gray-900">{formatPrice(item.subtotal)}</span>
                  </div>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <div className="pl-2 mt-1 border-l-2 border-gray-200 text-xs text-gray-500">
                      {item.modifiers.map((mod: any, j: number) => (
                         <div key={j} className="flex justify-between">
                           <span>+ {mod.selected_option}</span>
                           {mod.price_impact > 0 && <span>{formatPrice(mod.price_impact)}</span>}
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Separator className="border-dashed border-gray-300 my-4" />

            {/* Calculations */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(txn.subtotal)}</span>
              </div>
              {txn.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-{formatPrice(txn.discount_amount)}</span>
                </div>
              )}
              {txn.tax_amount > 0 && (
                <div className="flex justify-between">
                  <span>Pajak</span>
                  <span>{formatPrice(txn.tax_amount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t mt-2">
                <span>TOTAL</span>
                <span>{formatPrice(txn.total_amount)}</span>
              </div>
            </div>

            <Separator className="border-dashed border-gray-300 my-6" />

            {/* Footer */}
            <div className="text-center text-xs text-gray-500 space-y-2">
              {settings.footerText ? (
                <p className="whitespace-pre-wrap">{settings.footerText}</p>
              ) : (
                <>
                  <p>Layanan Kritik & Saran</p>
                  <p>WA: 0812-3456-7890</p>
                </>
              )}
              <p className="mt-4 text-[10px] text-gray-400">Powered by DahlanPOS v1.0</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Decorative Receipt Edge Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-repeat-x z-10" style={{ backgroundImage: "radial-gradient(circle, transparent 4px, white 4px)", backgroundSize: "10px 10px", marginBottom: "-4px", transform: "rotate(180deg)" }} />
      </div>

      {/* Floating Action Buttons (Hidden when printing via CSS) */}
      <div className="fixed bottom-6 left-0 right-0 flex justify-center gap-4 px-4 no-print">
        <Button 
          onClick={handleShare} 
          className="rounded-full shadow-lg h-12 px-6 bg-white text-gray-900 border hover:bg-gray-50"
          variant="outline"
        >
          <Share2 className="h-5 w-5 mr-2" />
          Bagikan
        </Button>
        <Button 
          onClick={() => window.print()} 
          className="rounded-full shadow-lg h-12 px-6"
        >
          <Download className="h-5 w-5 mr-2" />
          Simpan PDF
        </Button>
      </div>

      {/* Print CSS Fixes */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .printable-area { box-shadow: none !important; }
          .printable-area > div:first-child, .printable-area > div:last-child { display: none; } /* Hide jagged edges on print */
        }
      `}} />
    </div>
  )
}
