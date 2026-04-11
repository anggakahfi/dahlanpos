"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { BackofficeSidebar } from "@/components/backoffice/sidebar"
import { setCurrentModuleRole, getAuthSession } from "@/lib/api"

export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  // Declare this module as 'owner' context — API requests will use auth_token_owner
  setCurrentModuleRole('owner')

  useEffect(() => {
    const session = getAuthSession('owner')
    if (!session) {
      router.replace("/login")
      return
    }
    if (session.user.role !== "owner") {
      router.replace("/cashier")
    }
  }, [router])

  // Avoid flash before redirect — check synchronously with role-keyed session
  const session = typeof window !== "undefined" ? getAuthSession('owner') : null
  if (!session || session.user.role !== "owner") {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <BackofficeSidebar />
      <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
    </div>
  )
}
