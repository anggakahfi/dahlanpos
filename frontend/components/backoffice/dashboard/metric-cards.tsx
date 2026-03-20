import { Card, CardContent } from "@/components/ui/card"
import { DollarSign, Receipt, TrendingUp, CreditCard } from "lucide-react"

const metrics = [
  {
    label: "Revenue",
    value: "Rp 1.340.000",
    change: "+12%",
    changeType: "positive" as const,
    icon: DollarSign,
  },
  {
    label: "Transactions",
    value: "47",
    subValue: "5 void",
    change: "+8%",
    changeType: "positive" as const,
    icon: Receipt,
  },
  {
    label: "Avg Order",
    value: "Rp 28.510",
    change: "-3%",
    changeType: "negative" as const,
    icon: TrendingUp,
  },
  {
    label: "Payment",
    value: "Cash 55%",
    subValue: "QRIS 45%",
    icon: CreditCard,
  },
]

export function MetricCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
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
                      metric.changeType === "positive"
                        ? "text-[#10B981]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    {metric.change}
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
