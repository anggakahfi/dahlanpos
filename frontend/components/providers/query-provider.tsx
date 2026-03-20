"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState ensures the QueryClient is only created once per session/browser load
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep default cache slightly alive but not permanent to balance fetching cost vs accuracy
            staleTime: 1000 * 60 * 1, // 1 minute
            refetchOnWindowFocus: true, // Fetch background updates when user focuses back on the browser tab
            retry: 1, // Retry only once to prevent hanging UI
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
