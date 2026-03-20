import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api"
import type { Product } from "@/lib/types"

export function useItems() {
  return useQuery<{ data: Product[] }>({
    queryKey: ["items"],
    queryFn: async () => {
      console.log("[FETCH] getProducts — requesting...")
      const res = await getProducts()
      console.log("[FETCH] getProducts — received", res)
      return res
    },
  })
}

export function useCreateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      console.log("[SUBMIT] createProduct:", data)
      return createProduct(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
    onError: (err: any) => console.error("[API ERROR] createProduct:", err),
  })
}

export function useUpdateItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log("[SUBMIT] updateProduct:", { id, data })
      return updateProduct(id, data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
    onError: (err: any) => console.error("[API ERROR] updateProduct:", err),
  })
}

export function useDeleteItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[SUBMIT] deleteProduct:", id)
      return deleteProduct(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["items"] }),
    onError: (err: any) => console.error("[API ERROR] deleteProduct:", err),
  })
}
