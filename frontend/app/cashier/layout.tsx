"use client"

import { useState } from "react"
import { CashierHeader } from "@/components/cashier/cashier-header"
import { ShiftProvider } from "@/components/cashier/shift-context"

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ShiftProvider>
      <div className="flex flex-col h-screen bg-background">
        <CashierHeader />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </ShiftProvider>
  )
}
