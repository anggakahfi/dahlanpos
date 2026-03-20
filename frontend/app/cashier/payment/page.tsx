"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Banknote, Smartphone, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/lib/types"

interface CheckoutData {
  items: CartItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  customerName: string
}

const paymentMethods = [
  { id: "cash", name: "Tunai", icon: Banknote },
  { id: "qris", name: "QRIS", icon: Smartphone },
]

const quickCashAmounts = [50000, 100000, 150000, 200000]

export default function PaymentPage() {
  const router = useRouter()
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [selectedMethod, setSelectedMethod] = useState("cash")
  const [cashReceived, setCashReceived] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData")
    if (data) {
      setCheckoutData(JSON.parse(data))
    } else {
      router.push("/cashier")
    }
  }, [router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const cashAmount = parseFloat(cashReceived.replace(/\D/g, "")) || 0
  const change = cashAmount - (checkoutData?.total || 0)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsProcessing(false)
    setIsSuccess(true)
    
    // Clear checkout data
    sessionStorage.removeItem("checkoutData")
    
    // Redirect after showing success
    setTimeout(() => {
      router.push("/cashier/receipt")
    }, 1500)
  }

  const isPaymentValid = () => {
    if (selectedMethod === "cash") {
      return cashAmount >= (checkoutData?.total || 0)
    }
    return true
  }

  if (!checkoutData) {
    return null
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/30">
        <Card className="w-full max-w-md mx-4 text-center">
          <CardContent className="pt-8 pb-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Pembayaran Berhasil!</h2>
            <p className="text-muted-foreground mb-4">
              Transaksi telah selesai
            </p>
            {selectedMethod === "cash" && change > 0 && (
              <div className="bg-muted rounded-lg p-4 mb-4">
                <p className="text-sm text-muted-foreground">Kembalian</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(change)}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              Mencetak struk...
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Left: Order Summary */}
      <div className="w-1/2 p-6 border-r border-border overflow-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Pesanan</CardTitle>
            {checkoutData.customerName && (
              <p className="text-sm text-muted-foreground">
                Pelanggan: {checkoutData.customerName}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Items */}
            <div className="space-y-3">
              {checkoutData.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-medium">{formatPrice(item.subtotal)}</span>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(checkoutData.subtotal)}</span>
              </div>
              {checkoutData.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-{formatPrice(checkoutData.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pajak (10%)</span>
                <span>{formatPrice(checkoutData.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>Total</span>
                <span className="text-primary">{formatPrice(checkoutData.total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right: Payment Method */}
      <div className="w-1/2 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-6">Pilih Metode Pembayaran</h2>

        {/* Payment Methods */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <Card
                key={method.id}
                className={cn(
                  "p-4 cursor-pointer transition-all text-center",
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "hover:border-muted-foreground/30"
                )}
                onClick={() => setSelectedMethod(method.id)}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center",
                    selectedMethod === method.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-medium">{method.name}</span>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Cash Payment Options */}
        {selectedMethod === "cash" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Uang Diterima
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  Rp
                </span>
                <Input
                  type="text"
                  placeholder="0"
                  value={cashReceived ? parseInt(cashReceived.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                  onChange={(e) => setCashReceived(e.target.value.replace(/\D/g, ""))}
                  className="pl-10 text-right text-xl font-semibold h-14"
                />
              </div>
            </div>

            {/* Quick Cash Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {quickCashAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  onClick={() => setCashReceived(amount.toString())}
                >
                  {formatPrice(amount)}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setCashReceived(checkoutData.total.toString())}
            >
              Uang Pas ({formatPrice(checkoutData.total)})
            </Button>

            {/* Change Display */}
            {cashAmount > 0 && (
              <Card className={cn(
                "p-4",
                change >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
              )}>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">
                    {change >= 0 ? "Kembalian" : "Kurang"}
                  </p>
                  <p className={cn(
                    "text-2xl font-bold",
                    change >= 0 ? "text-green-600" : "text-red-600"
                  )}>
                    {formatPrice(Math.abs(change))}
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* QRIS Payment Instructions */}
        {selectedMethod === "qris" && (
          <Card className="p-6 text-center bg-muted/50 border-dashed">
            <div className="w-24 h-24 bg-primary/10 mx-auto rounded-xl mb-4 flex items-center justify-center">
              <Smartphone className="h-10 w-10 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Pembayaran QRIS</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Arahkan pelanggan untuk scan QRIS toko yang tersedia di meja kasir. 
              PENTING: Pastikan pembayaran telah berhasil sebelum menekan konfirmasi.
            </p>
            <p className="font-bold text-2xl text-primary">{formatPrice(checkoutData.total)}</p>
          </Card>
        )}

        {/* Pay Button */}
        <Button
          className="w-full mt-6 h-14 text-lg"
          size="lg"
          disabled={!isPaymentValid() || isProcessing}
          onClick={handlePayment}
        >
          {isProcessing 
            ? "Memproses..." 
            : selectedMethod === "qris" 
              ? `Konfirmasi Bayar QRIS ${formatPrice(checkoutData.total)}`
              : `Bayar Tunai ${formatPrice(checkoutData.total)}`
          }
        </Button>
      </div>
    </div>
  )
}
