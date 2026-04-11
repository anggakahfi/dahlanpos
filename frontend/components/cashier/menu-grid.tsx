"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Grid, List } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuItem, Category } from "@/lib/types"

interface MenuGridProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onAddToCart: (item: MenuItem) => void
  menuItems?: MenuItem[]
  categories?: Category[]
}

export function MenuGrid({ selectedCategory, onCategoryChange, onAddToCart, menuItems = [], categories = [] }: MenuGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch && item.isActive
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="space-y-4">
      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center border border-border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange("all")}
        >
          Semua
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Menu Items Grid */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "p-4 flex flex-col cursor-pointer transition-all hover:shadow-md min-h-[128px]",
                !item.isActive && "opacity-50"
              )}
              onClick={() => item.isActive && onAddToCart(item)}
            >
              <div className="aspect-square bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-4xl text-muted-foreground">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
              <p className="text-primary font-semibold text-sm">
                {formatPrice(item.price)}
              </p>
              {item.stock !== undefined && item.stock < 10 && (
                <Badge variant="secondary" className="mt-2 text-xs">
                  Stok: {item.stock}
                </Badge>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md min-h-[128px] flex items-center gap-4",
                !item.isActive && "opacity-50"
              )}
              onClick={() => item.isActive && onAddToCart(item)}
            >
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl text-muted-foreground">
                    {item.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{item.name}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {categories.find((c) => c.id === item.categoryId)?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-primary font-semibold">{formatPrice(item.price)}</p>
                {item.stock !== undefined && item.stock < 10 && (
                  <Badge variant="secondary" className="mt-1 text-xs">
                    Stok: {item.stock}
                  </Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>Tidak ada menu yang ditemukan</p>
        </div>
      )}
    </div>
  )
}
