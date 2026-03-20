"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import type { Shift } from "@/lib/types"

interface ShiftContextType {
  currentShift: Shift | null
  isShiftOpen: boolean
  openShift: (startingCash: number) => void
  closeShift: (endingCash: number) => void
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined)

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null)
  const [isShiftOpen, setIsShiftOpen] = useState(false)

  const openShift = (startingCash: number) => {
    const newShift: Shift = {
      id: `shift_${Date.now()}`,
      employeeId: "emp_1",
      outletId: "outlet_1",
      startTime: new Date().toISOString(),
      endTime: null,
      startingCash,
      endingCash: null,
      totalSales: 0,
      totalTransactions: 0,
      status: "open",
    }
    setCurrentShift(newShift)
    setIsShiftOpen(true)
  }

  const closeShift = (endingCash: number) => {
    if (currentShift) {
      setCurrentShift({
        ...currentShift,
        endTime: new Date().toISOString(),
        endingCash,
        status: "closed",
      })
    }
    setIsShiftOpen(false)
  }

  return (
    <ShiftContext.Provider value={{ currentShift, isShiftOpen, openShift, closeShift }}>
      {children}
    </ShiftContext.Provider>
  )
}

export function useShift() {
  const context = useContext(ShiftContext)
  if (context === undefined) {
    throw new Error("useShift must be used within a ShiftProvider")
  }
  return context
}
