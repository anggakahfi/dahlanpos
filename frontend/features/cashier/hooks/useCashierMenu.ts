// TanStack Query hook for fetching Cashier Menu data (categories, items, modifier groups).
// Replaces the old useEffect + useState pattern in cashier/page.tsx.
// Benefits: auto-caching, loading/error states, auto-refetch, clean code.

import { useQuery } from "@tanstack/react-query"
import { getCashierMenu } from "@/lib/api"
import type { MenuItem, Category, ModifierGroup } from "@/lib/types"

interface CashierMenuData {
  categories: Category[]
  menuItems: MenuItem[]
  modifierGroups: ModifierGroup[]
}

function transformMenuData(raw: any): CashierMenuData {
  const categories: Category[] = (raw.categories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    itemCount: 0,
  }))

  const menuItems: MenuItem[] = (raw.items || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    categoryId: p.category_id || "",
    price: p.price,
    stock: p.stock,
    image: p.image_url || "",
    isActive: p.is_active && p.stock > 0,
    modifierGroupIds: p.modifier_group_ids || [],
  }))

  const modifierGroups: ModifierGroup[] = (raw.modifier_groups || []).map((g: any) => ({
    id: g.id,
    name: g.name,
    required: g.required,
    options: (g.options || []).map((o: any) => ({
      name: o.name,
      priceImpact: o.price_impact,
    })),
    usedByCount: 0,
  }))

  return { categories, menuItems, modifierGroups }
}

export function useCashierMenu() {
  return useQuery<CashierMenuData>({
    queryKey: ["cashier-menu"],
    queryFn: async () => {
      console.log("[FETCH] getCashierMenu — requesting from backend...")
      const raw = await getCashierMenu()
      console.log("[FETCH] getCashierMenu — received", raw)
      return transformMenuData(raw)
    },
  })
}
