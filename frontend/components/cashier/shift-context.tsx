"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { openShift as apiOpenShift, closeShift as apiCloseShift, getCurrentShift } from "@/lib/api"
import type { Shift } from "@/lib/types"

interface ShiftContextType {
  currentShift: Shift | null
  isShiftOpen: boolean
  isLoadingShift: boolean
  openShift: (outletId: string, startingCash: number) => Promise<Shift>
  closeShift: (endingCash: number, note?: string) => Promise<void>
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined)

export function ShiftProvider({ children }: { children: ReactNode }) {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null)
  const [isShiftOpen, setIsShiftOpen] = useState(false)
  const [isLoadingShift, setIsLoadingShift] = useState(true)

  // On mount, check if there's an open shift on the backend
  useEffect(() => {
    getCurrentShift()
      .then((shift) => {
        if (shift && shift.status === "open") {
          setCurrentShift({
            id: shift.id,
            employeeId: shift.cashier_id || "",
            outletId: shift.outlet_id || "",
            startTime: shift.started_at,
            endTime: shift.closed_at || null,
            startingCash: shift.starting_cash,
            endingCash: shift.ending_cash || null,
            totalSales: shift.total_sales || 0,
            totalTransactions: shift.total_transactions || 0,
            status: shift.status,
          })
          setIsShiftOpen(true)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingShift(false))
  }, [])

  const openShift = async (outletId: string, startingCash: number): Promise<Shift> => {
    const raw = await apiOpenShift(outletId, startingCash)
    const shift: Shift = {
      id: raw.id,
      employeeId: raw.cashier_id || "",
      outletId: raw.outlet_id || "",
      startTime: raw.started_at,
      endTime: raw.closed_at || null,
      startingCash: raw.starting_cash,
      endingCash: raw.ending_cash || null,
      totalSales: raw.total_sales || 0,
      totalTransactions: raw.total_transactions || 0,
      status: raw.status,
    }
    setCurrentShift(shift)
    setIsShiftOpen(true)
    return shift
  }

  const closeShift = async (endingCash: number, note?: string) => {
    if (currentShift) {
      await apiCloseShift(currentShift.id, endingCash, note || "")
      setCurrentShift({ ...currentShift, endingCash, status: "closed" })
    }
    setIsShiftOpen(false)
  }

  return (
    <ShiftContext.Provider value={{ currentShift, isShiftOpen, isLoadingShift, openShift, closeShift }}>
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
