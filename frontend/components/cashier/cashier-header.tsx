"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  const { isShiftOpen } = useShift()

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      <div className="flex items-center gap-8">
        {/* Logo */}
        <Link href="/cashier" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="font-semibold text-foreground">DahlanPOS</span>
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

        {/* Current Outlet */}
        <div className="text-sm text-muted-foreground">
          Kopi Kenangan Sudirman
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 pr-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              BS
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">Budi Santoso</span>
          <Link href="/login" className="ml-2 text-muted-foreground hover:text-destructive">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  )
}
