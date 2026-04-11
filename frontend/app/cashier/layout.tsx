"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CashierHeader } from "@/components/cashier/cashier-header"
import { ShiftProvider } from "@/components/cashier/shift-context"
import { setCurrentModuleRole, getAuthSession } from "@/lib/api"

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // Declare this module as 'cashier' context — API requests will use auth_token_cashier
  setCurrentModuleRole('cashier')

  useEffect(() => {
    const session = getAuthSession('cashier')
    if (!session) {
      router.replace("/login")
    }
  }, [router])

  // Avoid flash before redirect
  const session = typeof window !== "undefined" ? getAuthSession('cashier') : null
  if (!session) {
    return null
  }

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
