// Zustand Cart Store — Predictable, Global, Debuggable
// Replaces the old useState-based useCart hook.
// Cart state lives here and is accessible from ANY component without prop-drilling.

import { create } from "zustand"
import type { CartItem, MenuItem, CartItemModifier } from "@/lib/types"

interface CartState {
  // ─── State ─────────────────────────────────────
  cartItems: CartItem[]

  // ─── Actions ───────────────────────────────────
  addToCart: (item: MenuItem, modifiers?: CartItemModifier[], quantity?: number, notes?: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  removeItem: (itemId: string) => void
  clearCart: () => void
  getSubtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],

  addToCart: (item, modifiers = [], quantity = 1, notes) => {
    console.log("[CART] addToCart", { item: item.name, modifiers, quantity, notes })

    set((state) => {
      // Create a comparable signature to detect exact duplicates (same item + same modifiers + same notes)
      const modifierSignature = modifiers
        .map((m) => `${m.groupName}:${m.selectedOption}`)
        .sort()
        .join("|")

      const existing = state.cartItems.find((ci) => {
        if (ci.menuItemId !== item.id) return false
        const ciSig = ci.modifiers
          .map((m) => `${m.groupName}:${m.selectedOption}`)
          .sort()
          .join("|")
        return ciSig === modifierSignature && ci.notes === notes
      })

      const basePrice = item.price
      const modifiersPrice = modifiers.reduce((sum, m) => sum + m.priceImpact, 0)
      const finalItemPrice = basePrice + modifiersPrice

      if (existing) {
        return {
          cartItems: state.cartItems.map((ci) =>
            ci.id === existing.id
              ? {
                  ...ci,
                  quantity: ci.quantity + quantity,
                  subtotal: (ci.quantity + quantity) * finalItemPrice,
                }
              : ci
          ),
        }
      }

      return {
        cartItems: [
          ...state.cartItems,
          {
            id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            menuItemId: item.id,
            name: item.name,
            quantity,
            price: finalItemPrice,
            modifiers,
            notes,
            subtotal: quantity * finalItemPrice,
          },
        ],
      }
    })
  },

  updateQuantity: (itemId, quantity) => {
    console.log("[CART] updateQuantity", { itemId, quantity })
    if (quantity <= 0) {
      set((state) => ({ cartItems: state.cartItems.filter((ci) => ci.id !== itemId) }))
    } else {
      set((state) => ({
        cartItems: state.cartItems.map((ci) =>
          ci.id === itemId ? { ...ci, quantity, subtotal: quantity * ci.price } : ci
        ),
      }))
    }
  },

  removeItem: (itemId) => {
    console.log("[CART] removeItem", { itemId })
    set((state) => ({ cartItems: state.cartItems.filter((ci) => ci.id !== itemId) }))
  },

  clearCart: () => {
    console.log("[CART] clearCart")
    set({ cartItems: [] })
  },

  getSubtotal: () => {
    return get().cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  },
}))
