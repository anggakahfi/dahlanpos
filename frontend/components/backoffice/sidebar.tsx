"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Package,
  Users,
  Store,
  Settings,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { logout, getAuthSession } from "@/lib/api"

const navigation = [
  { name: "Dashboard", href: "/backoffice", icon: LayoutDashboard },
  {
    name: "Reports",
    icon: FileText,
    children: [
      { name: "Transactions", href: "/backoffice/reports/transactions" },
      { name: "Shift Report", href: "/backoffice/reports/shifts" },
    ],
  },
  {
    name: "Library",
    icon: Package,
    children: [
      { name: "Items", href: "/backoffice/library/items" },
      { name: "Categories", href: "/backoffice/library/categories" },
      { name: "Modifiers", href: "/backoffice/library/modifiers" },
    ],
  },
  {
    name: "Employees",
    icon: Users,
    children: [
      { name: "Employee List", href: "/backoffice/employees" },
      { name: "Activity Log", href: "/backoffice/employees/activity" },
    ],
  },
  { name: "Outlets", href: "/backoffice/outlets", icon: Store },
  {
    name: "Settings",
    icon: Settings,
    children: [
      { name: "Payment Methods", href: "/backoffice/settings/payment" },
      { name: "Receipt Template", href: "/backoffice/settings/receipt" },
      { name: "Tax Configuration", href: "/backoffice/settings/tax" },
      { name: "Account", href: "/backoffice/settings/account" },
    ],
  },
]

export function BackofficeSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    setIsMounted(true)
    const session = getAuthSession('owner')
    if (session) setUser(session.user)
  }, [])

  if (!isMounted) {
    return (
      <aside className="flex h-screen w-64 flex-col border-r bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/backoffice" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              ST
            </div>
            <span className="text-lg font-bold text-foreground">Small Things</span>
          </Link>
        </div>
      </aside>
    )
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/backoffice" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            ST
          </div>
          <span className="text-lg font-bold text-foreground">Small Things</span>
        </Link>
      </div>



      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {navigation.map((item) =>
            item.children ? (
              <NavItemWithChildren
                key={item.name}
                item={item}
                pathname={pathname}
              />
            ) : (
              <NavItem key={item.name} item={item} pathname={pathname} />
            )
          )}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user?.name?.substring(0, 2).toUpperCase() || 'ST'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name || 'User'}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role || 'owner'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/backoffice/settings/account">
                <User className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={async () => {
                await logout('owner')
                router.push('/login')
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}

interface NavItemProps {
  item: {
    name: string
    href?: string
    icon: React.ComponentType<{ className?: string }>
  }
  pathname: string
}

function NavItem({ item, pathname }: NavItemProps) {
  const isActive = pathname === item.href
  return (
    <li>
      <Link
        href={item.href || "#"}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.name}
      </Link>
    </li>
  )
}

interface NavItemWithChildrenProps {
  item: {
    name: string
    icon: React.ComponentType<{ className?: string }>
    children: { name: string; href: string }[]
  }
  pathname: string
}

function NavItemWithChildren({ item, pathname }: NavItemWithChildrenProps) {
  const isChildActive = item.children.some((child) =>
    pathname.startsWith(child.href)
  )
  const [isOpen, setIsOpen] = useState(isChildActive)

  return (
    <li>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isChildActive
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span className="flex-1 text-left">{item.name}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="ml-7 mt-1 space-y-1 border-l pl-4">
            {item.children.map((child) => {
              const isActive = pathname === child.href
              return (
                <li key={child.name}>
                  <Link
                    href={child.href}
                    className={cn(
                      "block rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {child.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}
