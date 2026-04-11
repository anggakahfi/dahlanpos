import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getEmployees, createEmployee, updateEmployee, updateEmployeeStatus, deleteEmployee } from "@/lib/api"
import type { Employee } from "@/lib/types"

export function useEmployees() {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      console.log("[FETCH] getEmployees — requesting...")
      const data = await getEmployees()
      console.log("[FETCH] getEmployees — received", data)
      return data || []
    },
  })
}

export function useCreateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: any) => {
      console.log("[SUBMIT] createEmployee:", data)
      return createEmployee(data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    onError: (err: any) => console.error("[API ERROR] createEmployee:", err),
  })
}

export function useUpdateEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      console.log("[SUBMIT] updateEmployee:", { id, data })
      return updateEmployee(id, data)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    onError: (err: any) => console.error("[API ERROR] updateEmployee:", err),
  })
}

export function useUpdateEmployeeStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'active' | 'inactive' }) => {
      console.log("[SUBMIT] updateEmployeeStatus:", { id, status })
      return updateEmployeeStatus(id, status)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    onError: (err: any) => console.error("[API ERROR] updateEmployeeStatus:", err),
  })
}

export function useDeleteEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("[SUBMIT] deleteEmployee:", id)
      return deleteEmployee(id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["employees"] }),
    onError: (err: any) => console.error("[API ERROR] deleteEmployee:", err),
  })
}
