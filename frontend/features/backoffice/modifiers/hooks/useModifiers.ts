import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getModifierGroups, createModifierGroup, updateModifierGroup, deleteModifierGroup } from "@/lib/api"
import type { ModifierGroup } from "@/lib/types"

export function useModifiers() {
  return useQuery<ModifierGroup[]>({
    queryKey: ["modifiers"],
    queryFn: async () => {
      console.log("[FETCH] getModifierGroups — requesting...")
      const data = await getModifierGroups()
      console.log("[FETCH] getModifierGroups — received", data)
      return data || []
    },
  })
}

export function useCreateModifier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      console.log("[SUBMIT] createModifierGroup:", data)
      return createModifierGroup(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modifiers"] }),
    onError: (err: any) => console.error("[API ERROR] createModifierGroup:", err),
  })
}

export function useUpdateModifier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log("[SUBMIT] updateModifierGroup:", { id, data })
      return updateModifierGroup(id, data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modifiers"] }),
    onError: (err: any) => console.error("[API ERROR] updateModifierGroup:", err),
  })
}

export function useDeleteModifier() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[SUBMIT] deleteModifierGroup:", id)
      return deleteModifierGroup(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["modifiers"] }),
    onError: (err: any) => console.error("[API ERROR] deleteModifierGroup:", err),
  })
}
