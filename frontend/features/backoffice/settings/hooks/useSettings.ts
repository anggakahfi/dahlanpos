import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSettings, updateSettings } from '@/lib/api'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  })
}
