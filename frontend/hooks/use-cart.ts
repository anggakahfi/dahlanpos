"use client"

import { useState } from "react"
import type { CartItem, MenuItem, CartItemModifier } from "@/lib/types"

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  const addToCart = (
    item: MenuItem,
    modifiers: CartItemModifier[] = [],
    quantity: number = 1,
    notes?: string
  ) => {
    setCart((prev) => {
      // Create a comparable string signature of the modifiers to check for exact duplicates
      const modifierSignature = modifiers
        .map((m) => `${m.groupName}:${m.selectedOption}`)
        .sort()
        .join('|')

      const existing = prev.find((ci) => {
        if (ci.menuItemId !== item.id) return false
        
        const ciModifierSignature = ci.modifiers
          .map((m) => `${m.groupName}:${m.selectedOption}`)
          .sort()
          .join('|')

        // Exact match includes identical modifiers and notes
        return ciModifierSignature === modifierSignature && ci.notes === notes
      })

      const basePrice = item.price
      const modifiersPrice = modifiers.reduce((sum, m) => sum + m.priceImpact, 0)
      const finalItemPrice = basePrice + modifiersPrice

      if (existing) {
        return prev.map((ci) =>
          ci.id === existing.id
            ? { 
                ...ci, 
                quantity: ci.quantity + quantity, 
                subtotal: (ci.quantity + quantity) * finalItemPrice
              }
            : ci
        )
      }

      return [
        ...prev,
        {
          id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          menuItemId: item.id,
          name: item.name,
          quantity: quantity,
          price: finalItemPrice,
          modifiers: modifiers,
          notes: notes,
          subtotal: quantity * finalItemPrice,
        },
      ]
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((ci) => ci.id !== itemId))
    } else {
      setCart((prev) =>
        prev.map((ci) =>
          ci.id === itemId
            ? { ...ci, quantity, subtotal: quantity * ci.price }
            : ci
        )
      )
    }
  }

  const removeItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== itemId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getSubtotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0)
  }

  return {
    cart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
  }
}
