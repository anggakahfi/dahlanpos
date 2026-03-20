"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Minus, Plus, Trash2, X, Percent, User } from "lucide-react"
import type { CartItem } from "@/lib/types"

interface CartPanelProps {
  items: CartItem[]
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemoveItem: (itemId: string) => void
  onClearCart: () => void
}

export function CartPanel({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartPanelProps) {
  const router = useRouter()
  const [discount, setDiscount] = useState(0)
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent")
  const [customerName, setCustomerName] = useState("")
  const [showDiscountDialog, setShowDiscountDialog] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const discountAmount = discountType === "percent" 
    ? (subtotal * discount) / 100 
    : discount
  const tax = (subtotal - discountAmount) * 0.1 // 10% tax
  const total = subtotal - discountAmount + tax

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleCheckout = () => {
    // Navigate to payment with cart data
    const checkoutData = {
      items,
      subtotal,
      discount: discountAmount,
      tax,
      total,
      customerName,
    }
    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData))
    router.push("/cashier/payment")
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lg">Pesanan</h2>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Hapus Semua
            </Button>
          )}
        </div>
        
        {/* Customer Name Input */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Nama pelanggan (opsional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Cart Items */}
      <ScrollArea className="flex-1 min-h-0">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🛒</span>
            </div>
            <p className="text-sm">Belum ada pesanan</p>
            <p className="text-xs">Ketuk menu untuk menambahkan</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3 bg-muted/30 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                  {item.modifiers.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      + {item.modifiers.map((m) => m.selectedOption).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="w-8 text-center font-bold text-lg">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    className="h-10 w-10 p-0 rounded-full"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">{formatPrice(item.subtotal)}</p>
                  <Button
                    variant="ghost"
                    className="h-10 w-10 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-border p-4 space-y-4">
          {/* Discount Button */}
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowDiscountDialog(true)}
          >
            <Percent className="h-4 w-4 mr-2" />
            {discount > 0 
              ? `Diskon: ${discountType === "percent" ? `${discount}%` : formatPrice(discount)}`
              : "Tambah Diskon"
            }
          </Button>

          {/* Summary */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pajak (10%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button className="w-full h-14 text-lg font-bold" size="lg" onClick={handleCheckout}>
            Bayar {formatPrice(total)}
          </Button>
        </div>
      )}

      {/* Discount Dialog */}
      <Dialog open={showDiscountDialog} onOpenChange={setShowDiscountDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Diskon</DialogTitle>
            <DialogDescription>
              Masukkan diskon dalam persen atau nominal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={discountType === "percent" ? "default" : "outline"}
                onClick={() => setDiscountType("percent")}
                className="flex-1"
              >
                Persen (%)
              </Button>
              <Button
                variant={discountType === "fixed" ? "default" : "outline"}
                onClick={() => setDiscountType("fixed")}
                className="flex-1"
              >
                Nominal (Rp)
              </Button>
            </div>
            <Input
              type="number"
              placeholder={discountType === "percent" ? "0" : "0"}
              value={discount || ""}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setDiscount(0)
              setShowDiscountDialog(false)
            }}>
              Hapus Diskon
            </Button>
            <Button onClick={() => setShowDiscountDialog(false)}>
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Cart Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Semua Pesanan?</DialogTitle>
            <DialogDescription>
              Semua item dalam pesanan akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                onClearCart()
                setShowClearDialog(false)
              }}
            >
              Hapus Semua
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
