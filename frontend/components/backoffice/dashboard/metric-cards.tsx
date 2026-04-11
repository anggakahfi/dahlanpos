import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Receipt, TrendingUp, CreditCard } from "lucide-react"

interface MetricCardsProps {
  metrics?: {
    total_revenue: number
    total_transactions: number
    void_transactions: number
    avg_order_value: number
    cash_count: number
    cash_amount: number
    qris_count: number
    qris_amount: number
  }
  percentChanges?: {
    revenue?: number | null
    transactions?: number | null
    avg_order?: number | null
  }
  isLoading?: boolean
}

function formatCurrency(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`
}

function formatPct(value: number | null | undefined): { text: string; type: "positive" | "negative" } | null {
  if (value == null) return null
  return {
    text: `${value > 0 ? '+' : ''}${value}%`,
    type: value >= 0 ? "positive" : "negative",
  }
}

export function MetricCards({ metrics, percentChanges, isLoading }: MetricCardsProps) {
  const totalPaid = (metrics?.cash_count ?? 0) + (metrics?.qris_count ?? 0)
  const cashPct = totalPaid > 0 ? Math.round(((metrics?.cash_count ?? 0) / totalPaid) * 100) : 0
  const qrisPct = totalPaid > 0 ? 100 - cashPct : 0

  const cards = [
    {
      label: "Revenue",
      value: isLoading ? "..." : formatCurrency(metrics?.total_revenue ?? 0),
      change: formatPct(percentChanges?.revenue),
      icon: DollarSign,
    },
    {
      label: "Transactions",
      value: isLoading ? "..." : String(metrics?.total_transactions ?? 0),
      subValue: metrics?.void_transactions ? `${metrics.void_transactions} void` : undefined,
      change: formatPct(percentChanges?.transactions),
      icon: Receipt,
    },
    {
      label: "Avg Order",
      value: isLoading ? "..." : formatCurrency(metrics?.avg_order_value ?? 0),
      change: formatPct(percentChanges?.avg_order),
      icon: TrendingUp,
    },
    {
      label: "Payment",
      value: isLoading ? "..." : `Cash ${cashPct}%`,
      subValue: isLoading ? undefined : `QRIS ${qrisPct}%`,
      icon: CreditCard,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((metric) => (
        <Card key={metric.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <metric.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs font-medium uppercase text-muted-foreground">
                {metric.label}
              </span>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              <div className="flex items-center gap-2">
                {metric.subValue && (
                  <span className="text-xs text-muted-foreground">
                    {metric.subValue}
                  </span>
                )}
                {metric.change && (
                  <span
                    className={`text-xs font-medium ${
                      metric.change.type === "positive"
                        ? "text-[#10B981]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    {metric.change.text}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
