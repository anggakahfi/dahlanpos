import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/api"
import type { Category } from "@/lib/types"

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      console.log("[FETCH] getCategories — requesting...")
      const data = await getCategories()
      console.log("[FETCH] getCategories — received", data)
      return data || []
    },
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) => {
      console.log("[SUBMIT] createCategory:", name)
      return createCategory(name)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: (err: any) => console.error("[API ERROR] createCategory:", err),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      console.log("[SUBMIT] updateCategory:", { id, name })
      return updateCategory(id, name)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: (err: any) => console.error("[API ERROR] updateCategory:", err),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[SUBMIT] deleteCategory:", id)
      return deleteCategory(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
    onError: (err: any) => console.error("[API ERROR] deleteCategory:", err),
  })
}
