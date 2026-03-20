"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            DP
          </div>
          <span className="text-lg font-bold text-foreground">DahlanPOS</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Contact
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm">Coba Gratis</Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="border-t bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="flex flex-col gap-2 pt-2">
              <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Coba Gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
