// TanStack Query hooks for Outlet CRUD operations.
// Replaces manual useEffect fetching + setState refreshing.
// Benefits: auto-cache, auto-refetch after mutations, loading/error states.

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getOutlets, createOutlet, updateOutlet, deleteOutlet, updateOutletStatus } from "@/lib/api"
import type { Outlet } from "@/lib/types"

// ─── Query: Fetch all outlets ──────────────────────
export function useOutlets() {
  return useQuery<Outlet[]>({
    queryKey: ["outlets"],
    queryFn: async () => {
      console.log("[FETCH] getOutlets — requesting...")
      const data = await getOutlets()
      console.log("[FETCH] getOutlets — received", data)
      return data || []
    },
  })
}

// ─── Mutation: Create a new outlet ────────────────
export function useCreateOutlet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      console.log("[SUBMIT] createOutlet — sending payload:", data)
      return createOutlet(data)
    },
    onSuccess: () => {
      console.log("[SUBMIT] createOutlet — SUCCESS, refreshing list...")
      // This automatically re-fetches the outlets list! No manual setState needed.
      queryClient.invalidateQueries({ queryKey: ["outlets"] })
    },
    onError: (error: any) => {
      console.error("[API ERROR] createOutlet failed:", error)
    },
  })
}

// ─── Mutation: Update an existing outlet ──────────
export function useUpdateOutlet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log("[SUBMIT] updateOutlet — sending payload:", { id, data })
      return updateOutlet(id, data)
    },
    onSuccess: () => {
      console.log("[SUBMIT] updateOutlet — SUCCESS, refreshing list...")
      queryClient.invalidateQueries({ queryKey: ["outlets"] })
    },
    onError: (error: any) => {
      console.error("[API ERROR] updateOutlet failed:", error)
    },
  })
}

// ─── Mutation: Update an outlet status ──────────
export function useUpdateOutletStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "inactive" }) => {
      console.log("[SUBMIT] updateOutletStatus — sending payload:", { id, status })
      return updateOutletStatus(id, status)
    },
    onSuccess: () => {
      console.log("[SUBMIT] updateOutletStatus — SUCCESS, refreshing list...")
      queryClient.invalidateQueries({ queryKey: ["outlets"] })
    },
    onError: (error: any) => {
      console.error("[API ERROR] updateOutletStatus failed:", error)
    },
  })
}

// ─── Mutation: Delete an outlet ───────────────────
export function useDeleteOutlet() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[SUBMIT] deleteOutlet — sending payload:", id)
      return deleteOutlet(id)
    },
    onSuccess: () => {
      console.log("[SUBMIT] deleteOutlet — SUCCESS, refreshing list...")
      queryClient.invalidateQueries({ queryKey: ["outlets"] })
    },
    onError: (error: any) => {
      console.error("[API ERROR] deleteOutlet failed:", error)
    },
  })
}
