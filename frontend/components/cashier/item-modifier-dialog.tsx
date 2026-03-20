"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Minus, Plus } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { MenuItem, CartItemModifier, ModifierGroup } from "@/lib/types"

interface ItemModifierDialogProps {
  item: MenuItem | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: ReturnType<typeof useCart>["addToCart"]
  modifierGroups?: ModifierGroup[]
}

export function ItemModifierDialog({
  item,
  isOpen,
  onClose,
  onAddToCart,
  modifierGroups = [],
}: ItemModifierDialogProps) {
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")
  const [selectedModifiers, setSelectedModifiers] = useState<Record<string, string>>({})

  // Determine what modifiers the current item has
  const itemModifierGroups = item
    ? modifierGroups.filter((group) => item.modifierGroupIds.includes(group.id))
    : []

  // Check if all required modifiers have a selection
  const allRequiredSelected = itemModifierGroups
    .filter((g) => g.required)
    .every((g) => selectedModifiers[g.id] !== undefined)

  // Reset state when dialog opens for a new item
  useEffect(() => {
    if (isOpen) {
      setQuantity(1)
      setNotes("")
      
      // Auto-select first option for required groups to save time
      const initialSelections: Record<string, string> = {}
      itemModifierGroups.forEach(group => {
        if (group.required && group.options.length > 0) {
          initialSelections[group.id] = group.options[0].name
        }
      })
      setSelectedModifiers(initialSelections)
    }
  }, [isOpen, item]) // Need item here to recalculate if item changes, though not typically without closing

  if (!item) return null

  const handleModifierSelect = (groupId: string, optionName: string) => {
    setSelectedModifiers((prev) => ({
      ...prev,
      [groupId]: optionName,
    }))
  }

  const handleAddToCart = () => {
    // Build the CartItemModifier array
    const modifiersToAdd: CartItemModifier[] = []
    
    itemModifierGroups.forEach((group) => {
      const selectedOptionName = selectedModifiers[group.id]
      if (selectedOptionName) {
        const option = group.options.find((o) => o.name === selectedOptionName)
        if (option) {
          modifiersToAdd.push({
            groupName: group.name,
            selectedOption: option.name,
            priceImpact: option.priceImpact,
          })
        }
      }
    })

    onAddToCart(item, modifiersToAdd, quantity, notes)
    onClose()
  }

  // Calculate temporary total for the button
  let extraPrice = 0
  itemModifierGroups.forEach(group => {
    const selectedOptionName = selectedModifiers[group.id]
    if (selectedOptionName) {
       const option = group.options.find((o) => o.name === selectedOptionName)
       if (option) extraPrice += option.priceImpact
    }
  })
  
  const currentTotal = (item.price + extraPrice) * quantity

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{item.name}</DialogTitle>
          <p className="text-muted-foreground">
            Rp {item.price.toLocaleString("id-ID")}
          </p>
        </DialogHeader>

        <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {itemModifierGroups.map((group) => (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">
                  {group.name}
                  {group.required && <span className="text-destructive ml-1">*</span>}
                </Label>
                {group.required ? (
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Wajib</span>
                ) : (
                  <span className="text-xs text-muted-foreground">Opsional</span>
                )}
              </div>
              
              <RadioGroup
                value={selectedModifiers[group.id]}
                onValueChange={(val) => handleModifierSelect(group.id, val)}
              >
                {group.options.map((option) => (
                  <div key={option.name} className="flex items-center justify-between border rounded-lg p-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  // Quick tap selection support on the whole row
                  onClick={() => handleModifierSelect(group.id, option.name)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={option.name} id={`${group.id}-${option.name}`} />
                      <Label htmlFor={`${group.id}-${option.name}`} className="font-medium cursor-pointer">
                        {option.name}
                      </Label>
                    </div>
                    {option.priceImpact > 0 && (
                      <span className="text-sm text-muted-foreground">
                        +Rp {option.priceImpact.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          {/* Notes Section */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Catatan</Label>
            <Textarea 
              placeholder="Contoh: Jangan terlalu manis, ekstra es batu" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>
          
          {/* Quantity Section */}
          <div className="space-y-3">
             <Label className="text-base font-semibold">Jumlah</Label>
             <div className="flex items-center justify-center gap-4 border rounded-lg p-2 bg-muted/30">
                <Button
                  variant="outline"
                  className="h-12 w-12 p-0 rounded-full bg-background"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </Button>
                <span className="w-12 text-center font-bold text-2xl">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  className="h-12 w-12 p-0 rounded-full bg-background"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
             </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between pt-2">
          <Button
            type="button"
            className="w-full h-14 text-lg font-bold"
            disabled={!allRequiredSelected}
            onClick={handleAddToCart}
          >
            Tambah ke Pesanan - Rp {currentTotal.toLocaleString("id-ID")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
