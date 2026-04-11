"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getAuthSession, logout } from "@/lib/api"

import {
  ShoppingCart,
  History,
  Clock,
  LogOut,
} from "lucide-react"
import { useShift } from "./shift-context"

const navItems = [
  { href: "/cashier", label: "Kasir", icon: ShoppingCart },
  { href: "/cashier/history", label: "Riwayat", icon: History },
  { href: "/cashier/shift", label: "Shift", icon: Clock },
]

export function CashierHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { isShiftOpen } = useShift()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const session = getAuthSession('cashier')
    if (session) setUser(session.user)
  }, [])

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/cashier" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-foreground">Small Things POS</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== "/cashier" && pathname.startsWith(item.href))
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "gap-2",
                    isActive && "bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Shift Status */}
        <div className={cn(
          "px-3 py-1.5 rounded-full text-sm font-medium",
          isShiftOpen 
            ? "bg-green-100 text-green-700" 
            : "bg-muted text-muted-foreground"
        )}>
          {isShiftOpen ? "Shift Aktif" : "Shift Belum Dibuka"}
        </div>

        <div className="text-sm text-muted-foreground">
          {user?.outlet_name || "Cabang Utama"}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 pr-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs uppercase">
              {user?.name ? user.name.slice(0, 2) : "C"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ml-1">
             <span className="text-sm font-medium leading-none">{user?.name || "Cashier"}</span>
             <span className="text-[10px] text-muted-foreground mt-1">{user?.email || ""}</span>
          </div>
          <button
            onClick={async () => { await logout('cashier'); router.push('/login') }}
            className="ml-2 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
