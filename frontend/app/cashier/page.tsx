"use client"

import { useState } from "react"
import { MenuGrid } from "@/components/cashier/menu-grid"
import { CartPanel } from "@/components/cashier/cart-panel"
import { OpenShiftDialog } from "@/components/cashier/open-shift-dialog"
import { ItemModifierDialog } from "@/components/cashier/item-modifier-dialog"
import { useShift } from "@/components/cashier/shift-context"
import { useCartStore } from "@/features/cashier/stores/useCartStore"
import { useCashierMenu } from "@/features/cashier/hooks/useCashierMenu"
import type { MenuItem } from "@/lib/types"

export default function CashierPage() {
  const { isShiftOpen } = useShift()

  // ─── Zustand (Global Cart State) ────────────────
  const { cartItems, addToCart, updateQuantity, removeItem, clearCart } = useCartStore()

  // ─── TanStack Query (Server State) ────────────────
  const { data: menuData, isLoading, isError } = useCashierMenu()

  // ─── Local UI State ─────────────────────────────────
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null)
  const [isModifierDialogOpen, setIsModifierDialogOpen] = useState(false)

  const handleMenuClick = (item: MenuItem) => {
    setSelectedMenuItem(item)
    setIsModifierDialogOpen(true)
  }

  // ─── Shift Gate ─────────────────────────────────────
  if (!isShiftOpen) {
    return <OpenShiftDialog />
  }

  // ─── Loading & Error Fallback (Demoable + Debuggable) ─
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Memuat menu kasir...</p>
      </div>
    )
  }

  if (isError || !menuData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">Gagal memuat menu. Pastikan backend berjalan.</p>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Menu Section - 60% */}
      <div className="flex-1 p-6 overflow-auto">
        <MenuGrid
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={handleMenuClick}
          menuItems={menuData.menuItems}
          categories={menuData.categories}
        />
      </div>

      {/* Cart Section - 40% */}
      <div className="w-[400px] border-l border-border bg-card flex flex-col overflow-hidden">
        <CartPanel
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearCart={clearCart}
        />
      </div>

      <ItemModifierDialog
        item={selectedMenuItem}
        isOpen={isModifierDialogOpen}
        onClose={() => setIsModifierDialogOpen(false)}
        onAddToCart={addToCart}
        modifierGroups={menuData.modifierGroups}
      />
    </div>
  )
}
